// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's bootstrap code for the ABAP platform.
 *
 * @version 1.74.0
 */

// from sap/net/xhr.js ********************************************************
// lightweight override of XMLHttpRequest object
/* global define */

(function (global) {
    var localDefine;
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(callback, thisArg) {
            var T, k, n;
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }
            if (typeof callback !== "function") {
                throw new TypeError(callback + ' is not a function');
            }
            if (arguments.length > 1) {
                T = thisArg;
            }
            n = this.length;
            for (k = 0; k < n; ++k) {
                callback.call(T, this[k], k, this);
            }
        };
    }
    if (typeof define === "function") {
        localDefine = define;
    }
    else {
        if ((typeof jQuery !== "undefined") && jQuery.sap) {
            localDefine = function (module, dependencies, definition) {
                var args = [];
                dependencies.forEach(function (dependency) {
                    jQuery.sap.require(dependency);
                    args.push(jQuery.sap.getObject(dependency));
                });
                jQuery.sap.setObject(module, definition.apply(global, args));
            };
        }
        else {
            localDefine = function (module, dependencies, definition) {
                if (dependencies && (dependencies.length > 0)) {
                    throw new Error("Cannot resolve dependencies");
                }
                definition();
            };
        }
    }

    localDefine("sap.net.xhr", [], function () {
        "use strict";
        // Module variables
        var progressEvents, xhrEvents, xhrLogger, nopLogger, NOP, _XMLHttpRequest, XMLHttpRequestPrototype,
            LogPrototype, EventHandlersPrototype, ChannelPrototype, IgnoreListPrototype, trim, uuid = 0;

        if (XMLHttpRequest._SAP_ENHANCED) {
            return {};
        }

        progressEvents = ["loadstart", "progress", "abort", "error", "load", "timeout", "loadend"];
        xhrEvents = progressEvents.concat("readystatechange");
        function makeProtected(obj, members) {
            var k, n, member, _fn, _member, fn;
            n = members.length;
            for (k = 0; k < n; ++k) {
                member = members[k];
                fn = obj[member];
                if (fn) {
                    _member = "_" + member;
                    _fn = obj[_member];
                    if (!_fn) {
                        obj[_member] = fn;
                    }
                }
            }
        }
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function (searchString, position) {
                position = position || 0;
                return (this.substr(position, searchString.length) === searchString);
            }
        }
        if (!String.prototype.trim) {
            trim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
            String.prototype.trim = function () {
                return this.replace(trim, "");
            };
        }
        // Logging
        function hasMethod(x, method) {
            return (typeof x[method] === "function");
        }
        function hasMethods(x, methods) {
            var result, i, n;
            result = true;
            n = methods.length;
            for (i = 0; i < n; ++i) {
                result = result && hasMethod(x, methods[i]);
                if (!result) {
                    break;
                }
            }
            return result;
        }
        function isLogger(x) {
            return (typeof x === "object") && (x !== null) && hasMethods(x, ["error", "warning", "info", "debug"]);
        }
        function Log(logger) {
            this.logger = logger;
        }
        LogPrototype = Log.prototype;
        LogPrototype.error = function (msg) {
            try {
                this.logger.error(msg);
            }
            catch(e) {
            }
        };
        LogPrototype.warning = function (msg) {
            try {
                this.logger.warning(msg);
            }
            catch(e) {
            }
        };
        LogPrototype.info = function (msg) {
            try {
                this.logger.info(msg);
            }
            catch(e) {
            }
        };
        LogPrototype.debug = function (msg) {
            try {
                this.logger.debug(msg);
            }
            catch(e) {
            }
        };
        NOP = function () {
        };
        nopLogger = {
            error: NOP,
            warning: NOP,
            info: NOP,
            debug: NOP
        };
        xhrLogger = new Log(nopLogger);
        // XHR Events
        function isHandler(x) {
            var t;
            t = typeof x;
            return (t === "function") || ((t === "object") && (x !== null) && (typeof x.handleEvent === "function"));
        }
        function fireEvent(x, e, logger) {
            try {
                if (typeof x === "function") {
                    // DOM4: if listener's callback is a Function object, its callback this value is the event's currentTarget attribute value.
                    x.call(e.currentTarget, e);
                }
                else {
                    x.handleEvent(e);
                }
            }
            catch (error) {
                if (logger) {
                    logger.warning("Exception in " + e.type + " event handler: " + error.message);
                }
                throw error;
            }
        }
        function EventHandlers(events) {
            var i, n;
            n = events.length;
            for (i = 0; i < n; ++i) {
                this[events[i]] = [];
            }
            this.subscriptions = {};
            this.bufferedEvents = [];
        }
        EventHandlersPrototype = EventHandlers.prototype;
        EventHandlersPrototype.add = function (type, callback) {
            var add, h, i, n;
            if (isHandler(callback)) {
                h = this[type];
                if (h) {
                    add = true;
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        if (h[i] === callback) {
                            add = false;
                            break;
                        }
                    }
                    if (add) {
                        h.push(callback);
                    }
                }
            }
        };
        EventHandlersPrototype.remove = function (type, callback) {
            var h, i, n;
            if (isHandler(callback)) {
                h = this[type];
                if (h) {
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        if (h[i] === callback) {
                            if (n === 1) {
                                this[type] = [];
                            }
                            else {
                                h.splice(i, 1);
                            }
                            break;
                        }
                    }
                }
            }
        };
        EventHandlersPrototype.dispatch = function (event) {
            var h, on, type, i, n;
            if (this.suspend) {
                this.bufferedEvents.push(event);
            }
            else {
                type = event.type;
                h = this[type];
                if (h) {
                    h = h.slice(); // Copy handlers in case an event handler would mess with the subscriptions
                    n = h.length;
                    for (i = 0; i < n; ++i) {
                        fireEvent(h[i], event, xhrLogger);
                    }
                }
                on = this["on" + type];
                if (on) {
                    try {
                        // DOM4: if listener's callback is a Function object, its callback this value is the event's currentTarget attribute value.
                        on.call(event.currentTarget, event);
                    }
                    catch (error) {
                        xhrLogger.warning("Exception in on" + type + " callback: " + error.message);
                        throw error;
                    }
                }
            }
        };
        EventHandlersPrototype.clearEvents = function () {
            this.bufferedEvents = [];
        };
        EventHandlersPrototype.releaseEvents = function () {
            var k, n, events;
            events = this.bufferedEvents;
            n = events.length;
            if (n > 0) {
                this.clearEvents();
                for (k = 0; k < n; ++k) {
                    this.dispatch(events[k]);
                }
            }
        };
        EventHandlersPrototype.hasSubscribers = function (type) {
            var h, res;
            h = this[type];
            if (h) {
                res = (h.length > 0) || this["on" + type];
            }
            else {
                res = false;
            }
            return res;
        };
        EventHandlersPrototype.subscribed = function (type) {
            return (this.subscriptions[type] ? true : false);
        };
        EventHandlersPrototype.subscribe = function (type) {
            this.subscriptions[type] = true;
        };
        EventHandlersPrototype.unsubscribe = function (type) {
            delete this.subscriptions[type];
        };

        // ------------------------------------------------------------
        // XMLHttpRequest enhancement
        // ------------------------------------------------------------

        // Save reference to original XHR constructor in case it gets overloaded (e.g. by SinonJS)
       _XMLHttpRequest = XMLHttpRequest;
        XMLHttpRequest._SAP_ENHANCED = true;
        XMLHttpRequestPrototype = _XMLHttpRequest.prototype;
        _XMLHttpRequest.EventHandlers = EventHandlers;
        makeProtected(XMLHttpRequestPrototype, ["abort", "open", "setRequestHeader", "send", "addEventListener", "removeEventListener"]);
        XMLHttpRequestPrototype._saveOnEvent = function (type) {
            var methodName, handlers, thisMethod, save;
            methodName = "on" + type;
            thisMethod = this[methodName];
            handlers = this._getHandlers();
            if (handlers[methodName]) {
                save = (thisMethod !== NOP);
            }
            else {
                save = !!thisMethod;
            }
            if (save) {
                handlers[methodName] = thisMethod;
                this[methodName] = NOP;
            }
        };
        XMLHttpRequestPrototype._getHandlers = function () {
            var h;
            h = this._handlers;
            if (!h) {
                h = new EventHandlers(xhrEvents);
                this._handlers = h;
            }
            return h;
        };
        XMLHttpRequestPrototype.handleEvent = function (event) {
            if ((event.type === "readystatechange") && (this.readyState > 2)){
                // jQuery.ajax attach onreadystatechange handler AFTER having called send!!!
                this._checkEventSubscriptions();
            }
            this._getHandlers().dispatch(event);
        };
        XMLHttpRequestPrototype.suspendEvents = function () {
            this._getHandlers().suspend = true;
        };
        XMLHttpRequestPrototype.resumeEvents = function (release) {
            var handlers;
            handlers = this._getHandlers();
            handlers.suspend = false;
            if (release) {
                handlers.releaseEvents();
            }
        };
        XMLHttpRequestPrototype.getEventHandler = function () {
            var xhr, fnHandler;
            fnHandler = this._fnHandler;
            if (!fnHandler) {
                xhr = this;
                fnHandler = function (event) {
                    xhr.handleEvent(event);
                };
                this._fnHandler = fnHandler;
            }
            return fnHandler;
        };
        XMLHttpRequestPrototype._checkEventSubscription = function (type, handlers) {
            // Some browser do not support multiple registrations of the same event handler
            handlers = handlers || this._getHandlers();
            this._saveOnEvent(type);
            if (handlers.hasSubscribers(type)) {
                if (!handlers.subscribed(type)) {
                    this._addEventListener(type, this.getEventHandler());
                    handlers.subscribe(type);
                }
            }
            else {
                if (handlers.subscribed(type)) {
                    this._removeEventListener(type, this.getEventHandler());
                    handlers.unsubscribe(type);
                }
            }
        };
        XMLHttpRequestPrototype._checkEventSubscriptions = function () {
            var handlers, i, n;
            handlers = this._getHandlers();
            n = xhrEvents.length;
            for (i = 0; i < n; ++i) {
                this._checkEventSubscription(xhrEvents[i], handlers);
            }
        };

        // ------------------------------------------------------------
        //      XMLHttpRequest override
        // ------------------------------------------------------------

        XMLHttpRequestPrototype.addEventListener = function (type, callback) {
            this._getHandlers().add(type, callback);
            this._checkEventSubscription(type);
        };
        XMLHttpRequestPrototype.removeEventListener = function (type, callback) {
            this._getHandlers().remove(type, callback);
            this._checkEventSubscription(type);
        };

        /**
         * Cancels any network activity.
         * (XMLHttpRequest standard)
         */
        XMLHttpRequestPrototype.abort = function () {
            var channel;
            try {
                channel = this._channel;
                if (channel) {
                    xhrLogger.debug("Aborting request " + channel.method + " " + channel.url);
                    channel.aborting();
                    this._abort();
                    channel.aborted();
                }
                else {
                    xhrLogger.debug("Aborting request");
                    this._abort();
                }
                this._getHandlers().clearEvents();
            }
            catch (error) {
                xhrLogger.warning("Failed to abort request: " + error.message);
                if (channel) {
                    channel["catch"](error);
                }
                else {
                    throw error;
                }
            }
        };

        /**
         * Sets the request method, request URL, and synchronous flag.
         * Throws a JavaScript TypeError if either method is not a valid HTTP method or url cannot be parsed.
         * Throws a "SecurityError" exception if method is a case-insensitive match for CONNECT, TRACE or TRACK.
         * Throws an "InvalidAccessError" exception if async is false, the JavaScript global environment is a document environment, and either the timeout attribute is not zero, the withCredentials attribute is true, or the responseType attribute is not the empty string.
         * (XMLHttpRequest standard)
         * @param {String} method
         * @param {String} url
         * @param {Boolean} async
         * @param {String} username
         * @param {String} password
         */
        XMLHttpRequestPrototype.open = function (method, url, async, username, password) {
            //  Cf. XHR specification
            //      If the async argument is omitted, set async to true, and set username and password to null.
            //      Due to unfortunate legacy constraints, passing undefined for the async argument is treated differently from async being omitted.
            var channel, arglen, origMethod, origUrl;
            this._id = ++uuid;
            xhrLogger.debug("Opening request #" + this._id + " " + method + " " + url);
            arglen = arguments.length;
            if (arglen <= 2) {
                async = true;
            }
            origMethod = method;
            origUrl = url;
            this._getHandlers().clearEvents(); // Clear possibly lingering events from previous execution
            channel = _XMLHttpRequest.channelFactory.create(this, method, url, async, username, password);
            this._channel = channel;
            this._checkEventSubscription("readystatechange");
            try {
                this._clearParams(); // In case of XHR reuse, delete previously stored replay data
                channel.opening();
                // Allow channels to overload URL and method (e.g. for method tunneling)
                method = channel.method;
                url = channel.url;
                if ((origUrl !== url) || (origMethod !== method)) {
                    xhrLogger.debug("Rewriting request #" + this._id + " to " + method + " " + url);
                }
                if (arglen <= 2) {
                    this._open(method, url);
                }
                else {
                    this._open(method, url, async, username, password);
                }
                channel.opened();

                // Always listen to readystatechange event (AFTER all filters)
                this._addEventListener("readystatechange", this.getEventHandler());
            }
            catch (error) {
                xhrLogger.warning("Failed to open request #" + this._id + " " + method + " " + url + ": " + error.message);
                channel["catch"](error);
            }
        };

        /**
         * Appends an header to the list of author request headers, or if header is already in the list of author request headers, combines its value with value.
         * Throws an "InvalidStateError" exception if the state is not OPENED or if the send() flag is set.
         * Throws a JavaScript TypeError if header is not a valid HTTP header field name or if value is not a valid HTTP header field value.
         * (XMLHttpRequest standard)
         * @param {String} header
         * @param {String} value
         */
        XMLHttpRequestPrototype.setRequestHeader = function (header, value) {
            var headers, normalizedHeader;
            this._setRequestHeader(header, value);
            normalizedHeader = header.toLowerCase();
            headers = this.headers;
            if (headers[normalizedHeader]) {
                // If header is in the author request headers list, append ",", followed by U+0020, followed by value, to the value of the header matching header.
                headers[normalizedHeader] += ", " + value;
            }
            else {
                headers[normalizedHeader] = value;
            }
        };

        /**
         * Performs a setRequestHeader for all own properties of the headers object
         * (non standard)
         * @param {Object} headers
         */
        XMLHttpRequestPrototype.setRequestHeaders = function (headers) {
            var header, headerNames, i, n;
            if (typeof headers === "object") {
                headerNames = Object.getOwnPropertyNames(headers);
                n = headerNames.length;
                for (i = 0; i < n; ++i) {
                    header = headerNames[i];
                    this.setRequestHeader(header, headers[header]);
                }
            }
        };

        /**
         * Initiates the request. The optional argument provides the request entity body. The argument is ignored if request method is GET or HEAD.
         * Throws an "InvalidStateError" exception if the state is not OPENED or if the send() flag is set.
         * (XMLHttpRequest standard)
         * @param data
         */
        XMLHttpRequestPrototype.send = function (data) {
            var channel, method, url;

            this._checkEventSubscriptions(); // redispatch only events with actual subscribers
            try {
                channel = this._channel;
                if (channel) {
                    // channel might not exist if object is not in the right state.
                    // We let the native "send" method throw the corresponding exception
                    method = channel.method;
                    url = channel.url;
                    xhrLogger.debug("Sending request #" + this._id + " " + method + " " + url);
                    channel.sending();
                }
                this._saveParams(data);
                this._send(data);
                if (channel) {
                    channel.sent();
                }
            }
            catch (error) {
                if (method) {
                    xhrLogger.warning("Failed to send request #" + this._id + " " + method + " " + url + ": " + error.message);
                }
                else {
                    xhrLogger.warning("Failed to send request #" + this._id + ": " + error.message);
                }
                if (channel) {
                    channel["catch"](error);
                }
                else {
                    throw error;
                }
            }
        };

        // ------------------------------------------------------------
        //      XMLHttpRequest enhancement
        // ------------------------------------------------------------

        /**
         * Retrieves the current value of a request header
         * (non standard)
         * @param {String} header
         * @returns {String}
         */
        XMLHttpRequestPrototype.getRequestHeader = function (header) {
            return this.headers[header.toLowerCase()];
        };

        /**
         * Deletes the repeat data for a given request header @see XMLHttpRequest#repeat
         * (non standard)
         * @param {String} header name of the HTTP header
         */
        XMLHttpRequestPrototype.deleteRepeatHeader = function (header) {
            delete this.headers[header.toLowerCase()];
        };

        /**
         * Changes the repeat data for a given request header @see XMLHttpRequest#repeat
         * (non standard)
         * @param {String} header
         * @param {String} value
         */
        XMLHttpRequestPrototype.setRepeatHeader = function (header, value) {
            this.headers[header.toLowerCase()] = value;
        };

        /**
         * Reopens a request and restores the settings and headers from the previous execution
         * (non standard)
         */
        XMLHttpRequestPrototype.reopen = function () {
            var channel;
            channel = this._channel;
            if (channel) {
                xhrLogger.debug("Reopening request #" + this._id + " " + channel.method + " " + channel.url);
            }
            else {
                throw new TypeError("Cannot reopen request");
            }
            this._checkEventSubscription("readystatechange");
            try {
                channel.reopening();
                channel.opening();
                this._open(channel.method, channel.url, channel.async, channel.username, channel.password);
                channel.opened();
                this._restoreParams();
            }
            catch (error) {
                xhrLogger.warning("Failed to reopen request #" + this._id + " " + method + " " + url + ": " + error.message);
                channel["catch"](error);
            }
        };

        /**
         * Repeats a request
         * (non standard)
         */
        XMLHttpRequestPrototype.repeat = function () {
            var channel = this._channel;
            if (!channel) {
                throw new TypeError("Cannot repeat request");
            }
            this.reopen();
            this.send(this._data);
        };

        XMLHttpRequestPrototype.toString = function () {
            var channel = this._channel, str = "[object XMLHttpRequest]";
            if (channel) {
                str += "#" + this._id + " " + channel.method + " " + channel.url;
            }
            return str;
        };

        Object.defineProperties(XMLHttpRequestPrototype, {
            "channel": {
                get: function () {
                    return this._channel;
                }
            },
            "headers": {
                get: function () {
                    var headers;
                    headers = this._headers;
                    if (!headers) {
                        headers = {};
                        this._headers = headers;
                    }
                    return headers;
                }
            },
            "id": {
                get: function () {
                    return this._id;
                }
            }
        });

        // ------------------------------------------------------------
        //      Implementation
        // ------------------------------------------------------------

        XMLHttpRequestPrototype._clearParams = function () {
            delete this._headers;
            delete this._withCredentials;
            delete this._timeout;
            delete this._data;
        };
        XMLHttpRequestPrototype._restoreParams = function () {
            var timeout, headers;
            if (this._headers) {
                headers = this._headers;
                this._headers = {};
                this.setRequestHeaders(headers);
            }
            if (this._withCredentials) {
                this.withCredentials = true;
            }
            timeout = this._timeout;
            if (timeout) {
                this.timeout = timeout;
            }
        };
        XMLHttpRequestPrototype._saveParams = function (data) {
            var timeout;
            if ((data !== undefined) && (data !== null)) {
                this._data = data;
            }
            if (this.withCredentials) {
                this._withCredentials = true;
            }
            timeout = this.timeout;
            if (timeout) {
                this._timeout = timeout;
            }
        };

        Object.defineProperties(XMLHttpRequest, {
            "logger": {
                get: function () {
                    return xhrLogger;
                },
                set: function (logger) {
                    // Update internal logging component without invalidating existing references
                    if (isLogger(logger)) {
                        xhrLogger.logger = logger;
                    }
                    else {
                        xhrLogger.logger = nopLogger;
                    }
                }
            }
        });

        // Request pipeline enhancement
        function Channel(xhr, method, url, async, username, password) {
            this.filters = [];
            this.xhr = xhr;
            this.method = method;
            this.url = url;
            this.async = !!async;
            if (username !== undefined) {
                this.username = username;
            }
            if (password !== undefined) {
                this.password = password;
            }
        }
        ChannelPrototype = Channel.prototype;
        ChannelPrototype._process = function (method) {
            var filters, filter, i, n;
            filters = this.filters;
            n = filters.length;
            for (i = 0; i < n; ++i) {
                filter = filters[i];
                if (typeof filter[method] === "function") {
                    filter[method](this);
                }
            }
        };
        ChannelPrototype.aborting = function () {
            this._process("aborting");
        };
        ChannelPrototype.aborted = function () {
            this._process("aborted");
        };
        ChannelPrototype.opening = function () {
            this._process("opening");
        };
        ChannelPrototype.opened = function () {
            this._process("opened");
        };
        ChannelPrototype.sending = function () {
            this._process("sending");
        };
        ChannelPrototype.sent = function () {
            this._process("sent");
        };
        ChannelPrototype.reopening = function () {
            this._process("reopening");
        };
        ChannelPrototype["catch"] = function (error) {
            var filters, i, n;
            filters = this.filters;
            n = filters.length;
            for (i = 0; i < n; ++i) {
                if (typeof filters[i]["catch"] === "function") {
                    try {
                        filters[i]["catch"](error, this);
                        error = null;
                        break;
                    }
                    catch (err) {
                        error = err;
                    }
                }
            }
            if (error) {
                throw error;
            }
        };

        function IgnoreList () {
            this.p = [];
            this.r = [];
            this.f = [];
        }
        IgnoreListPrototype = IgnoreList.prototype;
        IgnoreListPrototype.add = function (item) {
            switch (typeof item) {
                case "string":
                    this.p.push(item);
                    break;
                case "object":
                    if (item instanceof RegExp) {
                        this.r.push(item);
                    }
                    else {
                        throw new TypeError("Unsupported ignore type");
                    }
                    break;
                case "function":
                    this.f.push(item);
                    break;
                default:
                    throw new TypeError("Unsupported ignore type");
            }
        };
        IgnoreListPrototype.ignored = function (item) {
            var ignore;
            ignore = this._prefix(item) || this._regexp(item) || this._function(item);
            return ignore;
        };
        IgnoreListPrototype.clear = function () {
            this.p = [];
            this.r = [];
            this.f = [];
        };
        IgnoreListPrototype._prefix = function (item) {
            var filters, k, n, res;
            res = false;
            filters = this.p;
            n = filters.length;
            for (k = 0; k < n; ++k) {
                if (item.startsWith(filters[k])) {
                    res = true;
                    break;
                }
            }
            return res;
        };
        IgnoreListPrototype._regexp = function (item) {
            var filters, k, n, res;
            res = false;
            filters = this.r;
            n = filters.length;
            for (k = 0; k < n; ++k) {
                if (filters[k].test(item)) {
                    res = true;
                    break;
                }
            }
            return res;
        };
        IgnoreListPrototype._function = function (item) {
            var filters, k, n, res;
            res = false;
            filters = this.f;
            n = filters.length;
            for (k = 0; k < n; ++k) {
                try {
                    if (filters[k](item)) {
                        res = true;
                        break;
                    }
                }
                catch (error) {
                }
            }
            return res;
        };

        function isFactory(x) {
            var t;
            t = typeof x;
            return (t === "function") || ((t === "object") && (x !== null) && (typeof x.addFilter === "function"));
        }
        function invokeFactory(x, channel) {
            if (typeof x === "function") {
                x(channel);
            }
            else {
                x.addFilter(channel);
            }
        }

        function SimpleChannelFactory() {
            this._filterFactories = [];
            this.ignore = new IgnoreList();
        }
        SimpleChannelFactory.prototype.reset = function () {
            this._filterFactories = [];
            this.ignore = new IgnoreList();
        };
        SimpleChannelFactory.prototype.addFilterFactory = function (factory) {
            var add, factories, i, n;
            if (!isFactory(factory)) {
                throw new TypeError("addFilterFactory expects a FilterFactory or a function parameter");
            }
            factories = this._filterFactories;
            add = true;
            n = factories.length;
            for (i = 0; i < n; ++i) {
                if (factories[i] === factory) {
                    add = false;
                    break;
                }
            }
            if (add) {
                this._filterFactories.push(factory);
            }
        };
        SimpleChannelFactory.prototype.removeFilterFactory = function (factory) {
            var factories, i, n;
            factories = this._filterFactories;
            n = factories.length;
            for (i = 0; i < n; ++i) {
                if (factories[i] === factory) {
                    factories.splice(i, 1);
                    break;
                }
            }
        };
        SimpleChannelFactory.prototype.getFilterFactories = function () {
            return this._filterFactories.slice();
        };
        SimpleChannelFactory.prototype.create = function (xhr, method, url, async, username, password) {
            var channel, factories, i, n;
            channel = new Channel(xhr, method, url, async, username, password);
            if (!this.ignore.ignored(url)) {
                factories = this._filterFactories;
                n = factories.length;
                for (i = 0; i < n; ++i) {
                    invokeFactory(factories[i], channel);
                }
            }
            return channel;
        };
        XMLHttpRequest.channelFactory = new SimpleChannelFactory();

       // Module export
       return {};
    });
}) (this);


// from sap/ui/Device.js ******************************************************
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
if(typeof window.sap!=="object"&&typeof window.sap!=="function"){window.sap={};}if(typeof window.sap.ui!=="object"){window.sap.ui={};}(function(){"use strict";if(typeof window.sap.ui.Device==="object"||typeof window.sap.ui.Device==="function"){var c="1.74.0";window.sap.ui.Device._checkAPIVersion(c);return;}var D={};var F=0,E=1,W=2,I=3,d=4,T=5;var f=function(){function a(i,w){return("000"+String(i)).slice(-w);}this.defaultComponent='DEVICE';this.sWindowName=(window.top==window)?"":"["+window.location.pathname.split('/').slice(-1)[0]+"] ";this.log=function(i,b,e){e=e||this.defaultComponent||'';var q=new Date(),v={time:a(q.getHours(),2)+":"+a(q.getMinutes(),2)+":"+a(q.getSeconds(),2),date:a(q.getFullYear(),4)+"-"+a(q.getMonth()+1,2)+"-"+a(q.getDate(),2),timestamp:q.getTime(),level:i,message:b||"",component:e||""};if(window.console){var w=v.date+" "+v.time+" "+this.sWindowName+v.message+" - "+v.component;switch(i){case F:case E:console.error(w);break;case W:console.warn(w);break;case I:console.info?console.info(w):console.log(w);break;case d:console.debug?console.debug(w):console.log(w);break;case T:console.trace?console.trace(w):console.log(w);break;}}return v;};};var l=new f();l.log(I,"Device API logging initialized");D._checkAPIVersion=function(a){var v="1.74.0";if(v!=a){l.log(W,"Device API version differs: "+v+" <-> "+a);}};var g={};function h(e,a,b){if(!g[e]){g[e]=[];}g[e].push({oListener:b,fFunction:a});}function j(e,a,b){var q=g[e];if(!q){return this;}for(var i=0,v=q.length;i<v;i++){if(q[i].fFunction===a&&q[i].oListener===b){q.splice(i,1);break;}}if(q.length==0){delete g[e];}}function k(e,a){var b=g[e];var q;if(b){b=b.slice();for(var i=0,v=b.length;i<v;i++){q=b[i];q.fFunction.call(q.oListener||window,a);}}}var O={"WINDOWS":"win","MACINTOSH":"mac","LINUX":"linux","IOS":"iOS","ANDROID":"Android","BLACKBERRY":"bb","WINDOWS_PHONE":"winphone"};function n(a,b){a=a||navigator.userAgent;var e,i;function q(){var x=b||navigator.platform;if(x.indexOf("Win")!=-1){var p1=/Windows NT (\d+).(\d)/i;var q1=a.match(p1);var r1="";if(q1[1]=="6"){if(q1[2]==1){r1="7";}else if(q1[2]>1){r1="8";}}else{r1=q1[1];}return{"name":O.WINDOWS,"versionStr":r1};}else if(x.indexOf("Mac")!=-1){return{"name":O.MACINTOSH,"versionStr":""};}else if(x.indexOf("Linux")!=-1){return{"name":O.LINUX,"versionStr":""};}l.log(I,"OS detection returned no result");return null;}e=/Windows Phone (?:OS )?([\d.]*)/;i=a.match(e);if(i){return({"name":O.WINDOWS_PHONE,"versionStr":i[1]});}if(a.indexOf("(BB10;")>0){e=/\sVersion\/([\d.]+)\s/;i=a.match(e);if(i){return{"name":O.BLACKBERRY,"versionStr":i[1]};}else{return{"name":O.BLACKBERRY,"versionStr":'10'};}}e=/\(([a-zA-Z ]+);\s(?:[U]?[;]?)([\D]+)((?:[\d._]*))(?:.*[\)][^\d]*)([\d.]*)\s/;i=a.match(e);if(i){var v=/iPhone|iPad|iPod/;var w=/PlayBook|BlackBerry/;if(i[0].match(v)){i[3]=i[3].replace(/_/g,".");return({"name":O.IOS,"versionStr":i[3]});}else if(i[2].match(/Android/)){i[2]=i[2].replace(/\s/g,"");return({"name":O.ANDROID,"versionStr":i[3]});}else if(i[0].match(w)){return({"name":O.BLACKBERRY,"versionStr":i[4]});}}e=/\((Android)[\s]?([\d][.\d]*)?;.*Firefox\/[\d][.\d]*/;i=a.match(e);if(i){return({"name":O.ANDROID,"versionStr":i.length==3?i[2]:""});}return q();}function s(a,b){D.os=n(a,b)||{};D.os.OS=O;D.os.version=D.os.versionStr?parseFloat(D.os.versionStr):-1;if(D.os.name){for(var e in O){if(O[e]===D.os.name){D.os[e.toLowerCase()]=true;}}}}s();D._setOS=s;var B={"INTERNET_EXPLORER":"ie","EDGE":"ed","FIREFOX":"ff","CHROME":"cr","SAFARI":"sf","ANDROID":"an"};var u=navigator.userAgent;function o(a,b){
/*!
		 * Taken from jQuery JavaScript Library v1.7.1
		 * http://jquery.com/
		 *
		 * Copyright 2011, John Resig
		 * Dual licensed under the MIT or GPL Version 2 licenses.
		 * http://jquery.org/license
		 *
		 * Includes Sizzle.js
		 * http://sizzlejs.com/
		 * Copyright 2011, The Dojo Foundation
		 * Released under the MIT, BSD, and GPL Licenses.
		 *
		 * Date: Mon Nov 21 21:11:03 2011 -0500
		 */
function e(a){var q=(a||u).toLowerCase();var B1=/(webkit)[ \/]([\w.]+)/;var C1=/(opera)(?:.*version)?[ \/]([\w.]+)/;var D1=/(msie) ([\w.]+)/;var E1=/(trident)\/[\w.]+;.*rv:([\w.]+)/;var F1=/(edge)[ \/]([\w.]+)/;var G1=/(mozilla)(?:.*? rv:([\w.]+))?/;var H1=F1.exec(q)||E1.exec(q)||B1.exec(q)||C1.exec(q)||D1.exec(q)||q.indexOf("compatible")<0&&G1.exec(q)||[];var I1={browser:H1[1]||"",version:H1[2]||"0"};I1[I1.browser]=true;return I1;}var i=e(a);var q=a||u;var v=b||window.navigator;var w;var x;if(i.mozilla){w=/Mobile/;if(q.match(/Firefox\/(\d+\.\d+)/)){var p1=parseFloat(RegExp.$1);x={name:B.FIREFOX,versionStr:""+p1,version:p1,mozilla:true,mobile:w.test(q)};}else{x={mobile:w.test(q),mozilla:true,version:-1};}}else if(i.webkit){var q1=q.toLowerCase().match(/webkit[\/]([\d.]+)/);var r1;if(q1){r1=q1[1];}w=/Mobile/;var s1=q.match(/(Chrome|CriOS)\/(\d+\.\d+).\d+/);var t1=q.match(/FxiOS\/(\d+\.\d+)/);var u1=q.match(/Android .+ Version\/(\d+\.\d+)/);if(s1||t1||u1){var v1,w1,x1;if(s1){v1=B.CHROME;x1=w.test(q);w1=parseFloat(s1[2]);}else if(t1){v1=B.FIREFOX;x1=true;w1=parseFloat(t1[1]);}else if(u1){v1=B.ANDROID;x1=w.test(q);w1=parseFloat(u1[1]);}x={name:v1,mobile:x1,versionStr:""+w1,version:w1,webkit:true,webkitVersion:r1};}else{var y1=/(Version|PhantomJS)\/(\d+\.\d+).*Safari/;var z1=v.standalone;if(y1.test(q)){var A1=y1.exec(q);var p1=parseFloat(A1[2]);x={name:B.SAFARI,versionStr:""+p1,fullscreen:false,webview:false,version:p1,mobile:w.test(q),webkit:true,webkitVersion:r1,phantomJS:A1[1]==="PhantomJS"};}else if(/iPhone|iPad|iPod/.test(q)&&!(/CriOS/.test(q))&&!(/FxiOS/.test(q))&&(z1===true||z1===false)){x={name:B.SAFARI,version:-1,fullscreen:z1,webview:!z1,mobile:w.test(q),webkit:true,webkitVersion:r1};}else{x={mobile:w.test(q),webkit:true,webkitVersion:r1,version:-1};}}}else if(i.msie||i.trident){var p1;if(document.documentMode&&!a){if(document.documentMode===7){p1=8.0;}else{p1=parseFloat(document.documentMode);}}else{p1=parseFloat(i.version);}x={name:B.INTERNET_EXPLORER,versionStr:""+p1,version:p1,msie:true,mobile:false};}else if(i.edge){var p1=p1=parseFloat(i.version);x={name:B.EDGE,versionStr:""+p1,version:p1,edge:true};}else{x={name:"",versionStr:"",version:-1,mobile:false};}if((i.chrome||window.Intl&&window.Intl.v8BreakIterator)&&'CSS'in window){x.blink=true;}return x;}D._testUserAgent=o;function p(){D.browser=o();D.browser.BROWSER=B;if(D.browser.name){for(var b in B){if(B[b]===D.browser.name){D.browser[b.toLowerCase()]=true;}}}}p();D.support={};D.support.touch=!!(('ontouchstart'in window)||(navigator.maxTouchPoints>0)||(window.DocumentTouch&&document instanceof window.DocumentTouch)||(window.TouchEvent&&D.browser.firefox));if(D.browser.phantomJS){l.log(E,"PhantomJS is not supported! UI5 might break on PhantomJS in future releases. Please use Chrome Headless instead.");D.support.touch=false;}D.support.pointer=!!window.PointerEvent;D.support.matchmedia=!!window.matchMedia;var m=D.support.matchmedia?window.matchMedia("all and (max-width:0px)"):null;D.support.matchmedialistener=!!(m&&m.addListener);D.support.orientation=!!("orientation"in window&&"onorientationchange"in window);D.support.retina=(window.retina||window.devicePixelRatio>=2);D.support.websocket=('WebSocket'in window);D.support.input={};D.support.input.placeholder=('placeholder'in document.createElement("input"));D.media={};var R={"SAP_3STEPS":"3Step","SAP_4STEPS":"4Step","SAP_6STEPS":"6Step","SAP_STANDARD":"Std","SAP_STANDARD_EXTENDED":"StdExt"};D.media.RANGESETS=R;D.media._predefinedRangeSets={};D.media._predefinedRangeSets[R.SAP_3STEPS]={points:[520,960],unit:"px",name:R.SAP_3STEPS,names:["S","M","L"]};D.media._predefinedRangeSets[R.SAP_4STEPS]={points:[520,760,960],unit:"px",name:R.SAP_4STEPS,names:["S","M","L","XL"]};D.media._predefinedRangeSets[R.SAP_6STEPS]={points:[241,400,541,768,960],unit:"px",name:R.SAP_6STEPS,names:["XS","S","M","L","XL","XXL"]};D.media._predefinedRangeSets[R.SAP_STANDARD]={points:[600,1024],unit:"px",name:R.SAP_STANDARD,names:["Phone","Tablet","Desktop"]};D.media._predefinedRangeSets[R.SAP_STANDARD_EXTENDED]={points:[600,1024,1440],unit:"px",name:R.SAP_STANDARD_EXTENDED,names:["Phone","Tablet","Desktop","LargeDesktop"]};var _=R.SAP_STANDARD;var M=D.support.matchmedialistener?0:100;var Q={};var r=null;function t(i,a,b){b=b||"px";var q="all";if(i>0){q=q+" and (min-width:"+i+b+")";}if(a>0){q=q+" and (max-width:"+a+b+")";}return q;}function y(a){if(!D.support.matchmedialistener&&r==G()[0]){return;}if(Q[a].timer){clearTimeout(Q[a].timer);Q[a].timer=null;}Q[a].timer=setTimeout(function(){var b=z(a,false);if(b){k("media_"+a,b);}},M);}function z(a,b,e){function v(q1,r1){var q=Q[q1].queries[r1];var x={from:q.from,unit:Q[q1].unit};if(q.to>=0){x.to=q.to;}if(Q[q1].names){x.name=Q[q1].names[r1];}return x;}e=e||D.media.matches;if(Q[a]){var w=Q[a].queries;var x=null;for(var i=0,p1=w.length;i<p1;i++){var q=w[i];if((q!=Q[a].currentquery||b)&&e(q.from,q.to,Q[a].unit)){if(!b){Q[a].currentquery=q;}if(!Q[a].noClasses&&Q[a].names&&!b){A(a,Q[a].names[i]);}x=v(a,i);}}return x;}l.log(W,"No queryset with name "+a+" found",'DEVICE.MEDIA');return null;}function A(a,b,e){var i="sapUiMedia-"+a+"-";C(i+b,e,i);}function C(a,b,e){var q=document.documentElement;if(q.className.length==0){if(!b){q.className=a;}}else{var v=q.className.split(" ");var w="";for(var i=0;i<v.length;i++){if((e&&v[i].indexOf(e)!=0)||(!e&&v[i]!=a)){w=w+v[i]+" ";}}if(!b){w=w+a;}q.className=w;}}function G(){return[window.innerWidth,window.innerHeight];}function H(i,q,v,w){function x(q1,v){if(v==="em"||v==="rem"){var r1=window.getComputedStyle||function(e){return e.currentStyle;};var s1=r1(document.documentElement).fontSize;var t1=(s1&&s1.indexOf("px")>=0)?parseFloat(s1,10):16;return q1*t1;}return q1;}i=x(i,v);q=x(q,v);var p1=w[0];var a=i<0||i<=p1;var b=q<0||p1<=q;return a&&b;}function J(i,a,b){return H(i,a,b,G());}function K(i,a,b){var q=t(i,a,b);var e=window.matchMedia(q);return e&&e.matches;}D.media.matches=D.support.matchmedia?K:J;D.media.attachHandler=function(a,b,e){var i=e||_;h("media_"+i,a,b);};D.media.detachHandler=function(a,b,e){var i=e||_;j("media_"+i,a,b);};D.media.initRangeSet=function(a,b,e,q,v){var w;if(!a){w=D.media._predefinedRangeSets[_];}else if(a&&D.media._predefinedRangeSets[a]){w=D.media._predefinedRangeSets[a];}else{w={name:a,unit:(e||"px").toLowerCase(),points:b||[],names:q,noClasses:!!v};}if(D.media.hasRangeSet(w.name)){l.log(I,"Range set "+w.name+" has already been initialized",'DEVICE.MEDIA');return;}a=w.name;w.queries=[];w.timer=null;w.currentquery=null;w.listener=function(){return y(a);};var x,to,p1;var q1=w.points;for(var i=0,r1=q1.length;i<=r1;i++){x=(i==0)?0:q1[i-1];to=(i==q1.length)?-1:q1[i];p1=t(x,to,w.unit);w.queries.push({query:p1,from:x,to:to});}if(w.names&&w.names.length!=w.queries.length){w.names=null;}Q[w.name]=w;if(D.support.matchmedialistener){w.queries.forEach(function(s1){s1.media=window.matchMedia(s1.query);s1.media.addListener(w.listener);});}else{window.addEventListener("resize",w.listener,false);window.addEventListener("orientationchange",w.listener,false);}w.listener();};D.media.getCurrentRange=function(a,w){if(!D.media.hasRangeSet(a)){return null;}return z(a,true,isNaN(w)?null:function(b,e,i){return H(b,e,i,[w,0]);});};D.media.hasRangeSet=function(a){return a&&!!Q[a];};D.media.removeRangeSet=function(a){if(!D.media.hasRangeSet(a)){l.log(I,"RangeSet "+a+" not found, thus could not be removed.",'DEVICE.MEDIA');return;}for(var x in R){if(a===R[x]){l.log(W,"Cannot remove default rangeset - no action taken.",'DEVICE.MEDIA');return;}}var b=Q[a];if(D.support.matchmedialistener){var q=b.queries;for(var i=0;i<q.length;i++){q[i].media.removeListener(b.listener);}}else{window.removeEventListener("resize",b.listener,false);window.removeEventListener("orientationchange",b.listener,false);}A(a,"",true);delete g["media_"+a];delete Q[a];};var S={"TABLET":"tablet","PHONE":"phone","DESKTOP":"desktop","COMBI":"combi"};D.system={};function L(a,b){var e=N(b);var i=D.os.windows&&D.os.version>=8;var q=D.os.windows&&D.os.version===7;var v={};v.tablet=!!(((D.support.touch&&!q)||i||!!a)&&e);v.phone=!!(D.os.windows_phone||((D.support.touch&&!q)||!!a)&&!e);v.desktop=!!((!v.tablet&&!v.phone)||i||q||D.os.linux||D.os.macintosh);v.combi=v.desktop&&v.tablet;v.SYSTEMTYPE=S;for(var w in S){C("sap-"+S[w],!v[S[w]]);}return v;}function N(a){var b=a||navigator.userAgent;if(D.os.ios){return/ipad/i.test(b);}else if(D.os.macintosh){return navigator.maxTouchPoints>1;}else{if(D.support.touch){if(D.os.windows&&D.os.version>=8){return true;}if(D.browser.chrome&&D.os.android&&D.os.version>=4.4){return!/Mobile Safari\/[.0-9]+/.test(b);}else{var e=window.devicePixelRatio?window.devicePixelRatio:1;if(D.os.android&&D.browser.webkit&&(parseFloat(D.browser.webkitVersion)>537.10)){e=1;}var i=(Math.min(window.screen.width/e,window.screen.height/e)>=600);if(l1()&&(window.screen.height===552||window.screen.height===553)&&(/Nexus 7/i.test(b))){i=true;}return i;}}else{var q=(/(?=android)(?=.*mobile)/i.test(b));return(D.browser.msie&&b.indexOf("Touch")!==-1)||(D.os.android&&!q);}}}function P(a,b){D.system=L(a,b);if(D.system.tablet||D.system.phone){D.browser.mobile=true;}}P();D._getSystem=L;D.orientation={};D.resize={};D.orientation.attachHandler=function(a,b){h("orientation",a,b);};D.resize.attachHandler=function(a,b){h("resize",a,b);};D.orientation.detachHandler=function(a,b){j("orientation",a,b);};D.resize.detachHandler=function(a,b){j("resize",a,b);};function U(i){i.landscape=l1(true);i.portrait=!i.landscape;}function V(){U(D.orientation);k("orientation",{landscape:D.orientation.landscape});}var X=D.resize._update=function(){Y(D.resize);k("resize",{height:D.resize.height,width:D.resize.width});};function Y(i){i.width=G()[0];i.height=G()[1];}function Z(){var w=D.orientation.landscape;var i=l1();if(w!=i){V();}if(!d1){d1=window.setTimeout($,150);}}function $(){X();d1=null;}var a1=false;var b1=false;var c1;var d1;var e1;var f1=G()[1];var g1=G()[0];var h1=false;var i1;var j1=/INPUT|TEXTAREA|SELECT/;var k1=D.os.ios&&D.browser.name==="sf"&&((D.system.phone&&D.os.version>=7&&D.os.version<7.1)||(D.system.tablet&&D.os.version>=7));function l1(b){if(D.support.touch&&D.support.orientation&&D.os.android){if(h1&&b){return!D.orientation.landscape;}if(h1){return D.orientation.landscape;}}else if(D.support.matchmedia&&D.support.orientation){return!!window.matchMedia("(orientation: landscape)").matches;}var a=G();return a[0]>a[1];}function m1(e){if(e.type=="resize"){if(k1&&j1.test(document.activeElement.tagName)&&!a1){return;}var w=G()[1];var i=G()[0];var a=new Date().getTime();if(w===f1&&i===g1){return;}b1=true;if((f1!=w)&&(g1==i)){if(!i1||(a-i1>300)){h1=(w<f1);}X();}else{g1=i;}i1=a;f1=w;if(e1){window.clearTimeout(e1);e1=null;}e1=window.setTimeout(o1,1200);}else if(e.type=="orientationchange"){a1=true;}if(c1){clearTimeout(c1);c1=null;}c1=window.setTimeout(n1,50);}function n1(){if(b1&&(a1||(D.system.tablet&&D.os.ios&&D.os.version>=9))){V();X();a1=false;b1=false;if(e1){window.clearTimeout(e1);e1=null;}}c1=null;}function o1(){a1=false;b1=false;e1=null;}D._update=function(a){u=navigator.userAgent;l.log(W,"Device API values manipulated: NOT PRODUCTIVE FEATURE!!! This should be only used for test purposes. Only use if you know what you are doing.");p();s();P(a);};Y(D.resize);U(D.orientation);window.sap.ui.Device=D;if(D.support.touch&&D.support.orientation){window.addEventListener("resize",m1,false);window.addEventListener("orientationchange",m1,false);}else{window.addEventListener("resize",Z,false);}D.media.initRangeSet();D.media.initRangeSet(R["SAP_STANDARD_EXTENDED"]);if(sap.ui.define){sap.ui.define("sap/ui/Device",[],function(){return D;});}}());

// from services/sap/ui2/srvc/utils.js ****************************************
// ${copyright}
/**
 * @fileOverview This file contains miscellaneous utility functions.
 */

this.sap = this.sap || {};

(function () {
  "use strict";
  /*global window,console, DOMParser, jQuery, location, sap, setTimeout, XMLHttpRequest */

  // ensure that Function.prototype.bind is available, even with iOS 5
  // utils.js is used with startup service, shell API and page building services
  if (!Function.prototype.bind) {
    /* eslint-disable no-extend-native */
    /**
     * Replacement for ECMAScript 5 feature which might still be missing.
     *
     * @param {object} oThis
     *  The value to be passed as the <code>this</code> parameter to the target
     *  function when the bound function is called. The value is ignored if the
     *  bound function is constructed using the <code>new</code> operator.
     * @param {...object} aVarArgs
     *  Arguments to prepend to arguments provided to the bound function when
     *  invoking the target function.
     * @returns {function}
     *  A function with the bound arguments aVarArgs
     *
     * @see <a href="https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind">bind in ECMAScript 5</a>
     */
    Function.prototype.bind = function (oThis) {
      /* eslint-enable no-extend-native */
      if (typeof this !== "function") {
        // closest thing possible to the ECMAScript 5 internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }

      var aArgs = Array.prototype.slice.call(arguments, 1),
        that = this,
        NOP = function () {/* no-op c'tor */},
        fBound = function () {
          return that.apply(
            // passing "window" as "this" has been removed (cf. "use strict";)
            this instanceof NOP ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments))
          );
        };
      NOP.prototype = this.prototype;
      fBound.prototype = new NOP();
      return fBound;
    };
  }

  // namespace "sap.ui2.srvc" **************************************************
  sap.ui2 = sap.ui2 || {};
  sap.ui2.srvc = sap.ui2.srvc || {};
  if (sap.ui2.srvc.log) {
    return; // It's OK. Don't load twice.
  }

  // cache for GET requests
  var oCache;

  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.utils");
  }

  // "private static" methods **************************************************

  /**
   * Tells whether the package <code>jQuery.sap.log</code> currently exists.
   *
   * @returns {boolean}
   *   returns <code>true</code> if <code>jQuery.sap.log</code> exists
   */
  function jQuerySapLogExists() {
    return typeof jQuery === "function" && jQuery.sap && jQuery.sap.log;
  }

  /**
   * Formats the message for a simple output to <code>window.console</code>.
   * Mimics SAPUI5 log behavior for the three last parts:
   * <code>
   * var logText = oLogEntry.date + " " + oLogEntry.time + " " + sWindowName +
   *    oLogEntry.message + " - " + oLogEntry.details + " " + oLogEntry.component;
   * </code>
   * @param {string} sMessage
   *  message to be logged
   * @param {string} sDetails
   *  message details to be logged
   * @param {string} sComponent
   *  component which logged the message
   * @returns {string}
   *  message in the format "message - details - component"
   */
  function formatMessage(sMessage, sDetails, sComponent) {
    return (sMessage || "") + " - " + (sDetails || "") + " " + (sComponent || "");
  }

  // "public static" methods ***************************************************

  /**
   * @namespace The namespace for functions which log messages even if SAPUI5 is not present.
   * @since 1.3.0
   */
  sap.ui2.srvc.log = {
    /**
     * Wrapper function for <code>jQuery.sap.log.debug()</code>. Writes a simple log message to
     * the console if SAPUI5 is not present.
     *
     * @param {string} sMessage
     *   the log message
     * @param {string} sDetails
     *   the message details
     * @param {string} sComponent
     *   the component which issues the message
     * @since 1.3.0
     */
    debug: function (sMessage, sDetails, sComponent) {
      if (jQuerySapLogExists()) {
        jQuery.sap.log.debug(sMessage, sDetails, sComponent);
        return;
      }
      if (typeof console === "object") {
        /* eslint-disable no-console */
        if (typeof console.debug === "function") { // e.g. Chrome
          console.debug(formatMessage(sMessage, sDetails, sComponent));
        } else { // e.g. IE9
          console.log(formatMessage(sMessage, sDetails, sComponent));
        }
        /* eslint-enable no-console */
      }
    },

    /**
     * Wrapper function for <code>jQuery.sap.log.error()</code>. Writes a simple error message to
     * the console if SAPUI5 is not present.
     *
     * @param {string} sMessage
     *   the log message
     * @param {string} sDetails
     *   the message details
     * @param {string} sComponent
     *   the component which issues the message
     * @since 1.3.0
     */
    error: function (sMessage, sDetails, sComponent) {
      if (jQuerySapLogExists()) {
        jQuery.sap.log.error(sMessage, sDetails, sComponent);
        return;
      }
      if (typeof console === "object") {
        /* eslint-disable no-console */
        console.error(formatMessage(sMessage, sDetails, sComponent));
        /* eslint-enable no-console */
      }
    },

    /**
     * Wrapper function for <code>jQuery.sap.log.info()</code>. Writes a simple info message to
     * the console if SAPUI5 is not present.
     *
     * @param {string} sMessage
     *   the log message
     * @param {string} sDetails
     *   the message details
     * @param {string} sComponent
     *   the component which issues the message
     * @since 1.3.0
     */
    info: function (sMessage, sDetails, sComponent) {
      if (jQuerySapLogExists()) {
        jQuery.sap.log.info(sMessage, sDetails, sComponent);
        return;
      }
      if (typeof console === "object") {
        /* eslint-disable no-console */
        console.info(formatMessage(sMessage, sDetails, sComponent));
        /* eslint-enable no-console */
      }
    },

    /**
     * Wrapper function for <code>jQuery.sap.log.warning()</code>. Writes a simple warning message
     * to the console if SAPUI5 is not present.
     *
     * @param {string} sMessage
     *   the log message
     * @param {string} sDetails
     *   the message details
     * @param {string} sComponent
     *   the component which issues the message
     * @since 1.3.0
     */
    warning: function (sMessage, sDetails, sComponent) {
      if (jQuerySapLogExists()) {
        jQuery.sap.log.warning(sMessage, sDetails, sComponent);
        return;
      }
      if (typeof console === "object") {
        /* eslint-disable no-console */
        console.warn(formatMessage(sMessage, sDetails, sComponent));
        /* eslint-enable no-console */
      }
    }
  };

  /**
   * Makes the given relative URL absolute. URLs containing host and/or protocol
   * and URLs with an absolute path remain unchanged. The URL is in no way
   * normalized; the function simply cuts off the file name from the base and
   * appends the relative URL.
   *
   * @param {string} sUrl
   *   the (possibly server-relative) URL
   * @param {string} [sBase=location.href]
   *   the base URL; it <b>must</b> at least be server-absolute
   * @returns {string}
   *   the absolute URL
   * @since 1.2.0
   */
  sap.ui2.srvc.absoluteUrl = function (sUrl, sBase) {
    /*jslint regexp: true */

    // default base is the page location
    sBase = sBase || location.href;
    // base must be absolute
    if (sBase.indexOf('://') < 0 && sBase.charAt(0) !== '/') {
      throw new sap.ui2.srvc.Error("Illegal base URL: " + sBase, "sap.ui2.srvc");
    }
    // do not change empty or absolute URL
    if (!sUrl || sUrl.indexOf('://') >= 0 || sUrl.charAt(0) === '/') {
      return this.addCacheBusterTokenUsingUshellConfig(sUrl);
    }
    if (sBase.search(/^([^:]*:)?\/\/[^\/]+$/) < 0) {
      // not a pure server URL -> cut off the file name
      sBase = sBase.replace(/\/[^\/]*$/, '');
    }
    // append the relative path
    return this.addCacheBusterTokenUsingUshellConfig(sBase + '/' + sUrl);
  };

  /**
   * Calls the given success handler (a)synchronously. Errors thrown in the success handler are
   * caught and the error message is reported to the error handler; if an error stack is
   * available, it is logged.
   *
   * @param {function ()} fnSuccess
   *   no-args success handler
   * @param {function (string)} [fnFailure]
   *   error handler, taking an error message; MUST NOT throw any error itself!
   * @param {boolean} [bAsync=false]
   *   whether the call shall be asynchronously
   * @since 1.2.0
   */
  sap.ui2.srvc.call = function (fnSuccess, fnFailure, bAsync) {
    // see also redundant declaration in sap.ushell.utils.call which has to be in sync
    var sMessage;

    if (bAsync) {
      setTimeout(function () {
        sap.ui2.srvc.call(fnSuccess, fnFailure, false);
      }, 0);
      return;
    }

    try {
      fnSuccess();
    } catch (e) {
      sMessage = e.message || e.toString();
      sap.ui2.srvc.log.error("Call to success handler failed: " + sMessage,
          e.stack, //may be undefined: only supported in Chrome, FF; as of now not in Safari, IE
          "sap.ui2.srvc");
      if (fnFailure) {
        fnFailure(sMessage);
      }
    }
  };

  /**
   * GETs the given URL (as XML if indicated) and hands it to the given
   * success handler. As this is a root cause for asynchronous behaviour,
   * special precautions are taken: errors thrown in the success handler are
   * caught and reported to the error handler!
   *
   * @param {string} sUrl
   *   URL for GET request
   * @param {boolean} bXml
   *   whether the handler expects XML instead of plain text
   * @param {function (*)} fnSuccess
   *   success handler, taking a DOM document or text string
   * @param {function (string, string)} fnFailure
   *   error handler, taking an error message and (if http status is not OK) the GET response as
   *   text; MUST NOT throw any error itself!
   * @param {object} [oXHR]
   *   the XMLHttpRequest object which may be predefined (e.g. by setting request headers). If
   *   <code>undefined</code>, a new XMLHttpRequest object is created.
   * @param {boolean} [bCache]
   *   whether the response is cached for further calls (since 1.8.1). XML responses cannot be
   *   cached. An <code>sap.ui2.srvc.Error</code> is thrown if both <code>bXml</code> and
   *   <code>bCache</code> are set to <code>true</code>.
   * @since 1.2.0
   */
  sap.ui2.srvc.get = function (sUrl, bXml, fnSuccess, fnFailure, oXHR, bCache) {
    if (typeof fnSuccess !== "function") {
      throw new sap.ui2.srvc.Error("Missing success handler", "sap.ui2.srvc");
    }
    if (typeof fnFailure !== "function") {
      throw new sap.ui2.srvc.Error("Missing error handler", "sap.ui2.srvc");
    }
    if (bXml && bCache) {
      throw new sap.ui2.srvc.Error("Caching of XML responses not supported", "sap.ui2.srvc");
    }
    if (typeof sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig === "function") {
      sUrl = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(sUrl);
    }
    oXHR = oXHR || new XMLHttpRequest();

    /**
     * @private
     */
    oXHR.onreadystatechange = function () {
      var oResult, oXml;
      // Note: "this" refers to oXHR according to W3C
      if (this.readyState !== /*DONE*/4) {
        return; // not yet DONE
      }
      sap.ui2.srvc.get.pending -= 1;
      if (this.status !== /*OK*/200) {
        // HTTP status not OK
        sap.ui2.srvc.log.error("Error " + this.status + " in response for URL " + sUrl,
          null, "sap.ui2.srvc");
        fnFailure(sUrl + ": " + this.status + " " + this.statusText, this.responseText);
        return;
      }

      sap.ui2.srvc.log.debug("Received response for URL " + sUrl, null, "sap.ui2.srvc");
      if (bXml) {
        oXml = this.responseXML;
        if (oXml === null || !oXml.documentElement) {
          // in FF it is null, in IE it is a document with only an error message
          fnFailure(sUrl + ": no valid XML");
          return;
        }
        oResult = oXml;
      } else {
        oResult = this.responseText;
        if (bCache) {
          oCache.put(sUrl, oResult);
        }
      }
      sap.ui2.srvc.call(fnSuccess.bind(null, oResult), fnFailure);
    };

    if (!bXml && oCache.containsKey(sUrl)) {
      sap.ui2.srvc.log.debug("Return cached response for URL " + sUrl, null, "sap.ui2.srvc");
      sap.ui2.srvc.call(fnSuccess.bind(null, oCache.get(sUrl)), fnFailure);
    } else {
      try {
        // Given that the XHR request could be provided as a parameter, we must
        // check that this was not already opened before calling open. One
        // reason this could happen is header settings. Only after opening the
        // request headers can be set. Calling open again will cause the
        // previous request to be aborted (i.e., headers loss).
        if (oXHR.readyState < XMLHttpRequest.OPENED) { // keep working on the opened request
            oXHR.open("GET", sUrl, /*asynchronously*/true);
        } else {
            sap.ui2.srvc.log.debug("XHR Request was already opened for " + sUrl, null, "sap.ui2.srvc");
        }
        oXHR.send();
        sap.ui2.srvc.get.pending += 1;
        sap.ui2.srvc.log.debug("Sent request to URL " + sUrl, null, "sap.ui2.srvc");
      } catch (e) {
        sap.ui2.srvc.log.error("Error '" + (e.message || e) + "' in request to URL " + sUrl,
          null, "sap.ui2.srvc");
        throw e;
      }
    }
  };

  /**
   * Gets an URL and adds the given cache buster token to it if no other token is already
   * contained. In case the URL is no valid URL the token is not added.
   *
   * @param {string} sUrl
   *  e.g. "/sap/bc/ui5_ui5/application/path"
   *  URL to be changed
   * @param {regEx} oPattern
   *  e.g /^\/sap\/bc\/ui5_ui5\//
   *  RegExp to determine if sUrl matches and needs to be extended by the cache buster token
   *  sToken
   * @param {string} sReplacement
   *  e.g. "/sap/bc/ui5_ui5/[CacheBusterToken]/"
   *  The part of sUrl matched by oPattern will be exchanged by this. Before that is done sToken
   *  is inserted in sReplacement at the position indicated by [CacheBusterToken]
   *  The replacement may refer to capture groups of oPattern
   * @param {string} sToken
   *  e.g. "~201412132350000~"
   *  token to be inserted in sUrl. It will be inserted as indicated in the final constructed URL!
   * @returns {string}
   *  - if sUrl did not matched oPattern: unchanged sUrl
   *  - if sUrl matched oPattern: sUrl enhanced with sToken,
   *         e.g. "/sap/bc/ui5_ui5/~201412132350000~/application/path"
   *
   * @private
   */
  sap.ui2.srvc.addCacheBusterToken = function (sUrl, oPattern, sReplacement, sToken) {
    if (oPattern.test(sUrl)) { //url matches the pattern
      sUrl = sUrl.replace(oPattern, sReplacement);
      //replace the token placeholder globally in the final url (!)
      // (also allow the token to be added elsewhere)
      sUrl = sUrl.replace(/\[CacheBusterToken\]/g, sToken);
    }
    return sUrl;
  };

  /**
   * Removes a cache buster token (if available) of an Url and normalizes the url afterwards
   * @param {string} sUrl
   *  the URL to be normalized
   * @returns {string}
   *   normalized url (without a cache buster token)
   * @since 1.28.1
   *
   * @private
   */
  sap.ui2.srvc.removeCBAndNormalizeUrl = function (sUrl) {
    var aMatches,
      sUrlPrefix,
      sCacheBusterSegment,
      sUrlPostfix;

    jQuery.sap.require("sap.ui.thirdparty.URI");
    var URI = sap.ui.require('sap/ui/thirdparty/URI');

    if (typeof sUrl !== "string" || sUrl === "" || isUriWithRelativeOrEmptyPath(sUrl)) {
      return sUrl;
    }

    function isUriWithRelativeOrEmptyPath(sUrl0) {
        var oUri = new URI(sUrl0),
            sPath = oUri.path();

        if (oUri.is("absolute")) {
          return false;
        }

        if (sPath && sPath.charAt(0) === "/") {
          return false;
        }

        return true;
    }

    // split up the URL into 3 parts: prefix, cache-buster segment, postfix
    // leading slashes are always part of the segment, the postfix might have a trailing slash
    aMatches = sUrl.match(/(.*)(\/~[\w\-]+~[A-Z0-9]?)(.*)/);
    if (aMatches) {
      sUrlPrefix = aMatches[1];
      sCacheBusterSegment = aMatches[2];
      sUrlPostfix = aMatches[3];
    }

    function normalizePath(sUrl0) {
      return new URI(sUrl0).normalizePathname().toString();
    }

    function isRelativePathWithDotSegmentsThatGoOutside(sPath) {
      var aSegments = new URI(sPath).segment(),
        i,
        iPos = 0;

      for (i = 0; i < aSegments.length && iPos >= 0; i += 1) {
        if (aSegments[i] === "..") {
          iPos = iPos - 1;
        } else {
          iPos = iPos + 1;
        }
      }

      return iPos < 0;
    }

    // check if URL contains a cache-buster token
    if (sCacheBusterSegment) {
      // check if removal of cache-buster token is required
      if (sUrlPostfix && isRelativePathWithDotSegmentsThatGoOutside(sUrlPostfix)) {
        // remove the cache-buster token
        sUrl = sUrlPrefix + sUrlPostfix;
      }
    }

    // always normalize the URL path
    return normalizePath(sUrl);
  };

  /**
   * Gets an URL and adds the given cache buster token to it if no other token is already
   * contained. The rules to be applied are coming from the ushell configuration:
   *  sap-ushell-config.cacheBusting.patterns
   * The rules are applied by there order property (lowest first) and the modified URL is returned
   * as soon as the first rule matched.
   * <p>
   * If the query parameter <code>sap-ushell-nocb</code> is set to <code>true</code> or <code>X</code>,
   * no cache buster tokens are added and existing cache buster tokens are removed from the specified URL.
   *
   * @param {string} sUrl
   *  e.g. "/sap/bc/ui5_ui5/application/path"
   *  URL to be changed
   * @returns {string}
   *  - if sUrl already contained a cache buster token (e.g. ~00000~): unchanged sUrl
   *  - if sUrl did not match any pattern: unchanged sUrl
   *  - if sUrl matched pattern: sUrl enhanced with sToken,
   *         e.g. "/sap/bc/ui5_ui5/~201412132350000~/application/path"
   *  - if the modified sUrl (normalized and cache buster token was removed)
   *    is found as an attribute of the config
   *    (window["sap-ushell-config"].cacheBusting.urls),
   *    the cache buster token which is defined as the value of this attribute
   *    is going to be returned.
   *
   * @private
   */
  sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig = function (sUrl) {
    //TODO move to sap.ushell.utils
    var oCacheBusting = window["sap-ushell-config"] &&
        window["sap-ushell-config"].cacheBusting,
      oPatterns = oCacheBusting && oCacheBusting.patterns,
      sCacheBusterUrl = sUrl,
      aParameterMap = [],
      sSapUshellNoCb,
      aRules = [];

    aParameterMap = sap.ui2.srvc.getParameterMap();
    sSapUshellNoCb = aParameterMap["sap-ushell-nocb"] && aParameterMap["sap-ushell-nocb"][0];

    // When URL disables Cache Busting return URL without cache busting token
    // It can happen that we get a URL which already has a cache-buster token included (from the ABAP server), so we also remove
    // an existing token here (this implementation is simpler than passing the URL parameter to the resolveLink service and evaluate it there)
    if ((sSapUshellNoCb === 'true' || sSapUshellNoCb === 'X') && typeof sUrl === "string") {
      sUrl = sUrl.replace(/\/~[\w\-]+~[A-Z0-9]?/, "");
      return sUrl;
    }

    // don't continue if the string is empty or a token is already present,
    // either as path segment (e.g.: /~0123_-Abc~/) or as query parameter
    // /e.g. ?cb=~xxxxxx~
    // also consider URLs with query parameters and fragments
    // this case happens during navigation, because this method is both called from
    // NavTargetResolution service as well as from the stubbed jQuery.sap.registerModulePath method
    //
    // syntax for application cache-buster contains now an additional scope qualifier that can be
    // either empty, "R" for resource, "5" for UI5 app, "W" for web app and "C"  for custom
    // see ABAP class /UI5/CL_UI5_APP_HTTP_HANDLER for details
    if (!oCacheBusting
            || typeof sUrl !== "string"
            || sUrl === ""
            || /[\/=]~[\w\-]+~[A-Z0-9]?[\/#\?\&]/.test(sUrl) // matches intermediate segment with cb-token; consider URLs with query string or fragment
            || /[\/=]~[\w\-]+~[A-Z0-9]?$/.test(sUrl)) {    // matches last segment with cb-token (no trailing slash or further parameters)
      return sUrl;
    }

    if (oCacheBusting && oCacheBusting.urls) {
      // Removing the last slash of the input url
      if (sUrl.charAt(sUrl.length - 1) === "/") {
        sUrl = sUrl.substr(0, sUrl.length - 1);
      }
      // Config contains the modified url (without a slash at the end)
      if (oCacheBusting.urls.hasOwnProperty(sUrl)) {
        return sUrl + "/" + oCacheBusting.urls[sUrl].cacheBusterToken;
      }
      // Config contains the modified url (having a slash at the end)
      if (oCacheBusting.urls.hasOwnProperty(sUrl + "/")) {
        return sUrl + "/" + oCacheBusting.urls[sUrl + "/"].cacheBusterToken;
      }
    }

    if (!oPatterns) {
      return sUrl;
    }

    // put rules in aRules and sort them by oRule.order
    Object.keys(oPatterns).forEach(function (sPattern) {
      if (oPatterns.hasOwnProperty(sPattern)) {
        var oRule = oPatterns[sPattern];
        // the property name is the pattern to be used, copy it to the object itself for later
        oRule.pattern = new RegExp(sPattern);
        aRules.push(oRule);
      }
    });
    aRules.sort(function (oRule1, oRule2) { return oRule1.order - oRule2.order; });

    // apply rules
    aRules.every(function (oRule) { // use every to be able to break
      if (oRule.pattern.test(sUrl)) {
        if (!oRule.cacheBusterToken) {
          oRule.cacheBusterToken = oCacheBusting.cacheBusterToken;
        }

        //url matches the pattern, note that this is not redundant
        //one can define patterns without a replacement to match and end the matching process!
        sCacheBusterUrl = sap.ui2.srvc.addCacheBusterToken(sUrl, oRule.pattern, oRule.replacement,
          oRule.cacheBusterToken);
        // break as soon as first rule matches (irrespective of alteration)
        return false;
      }
      return true;
    });

    return sCacheBusterUrl;
  };

  /**
   * Clear cache for GET requests.
   *
   * @since 1.8.1
   */
  sap.ui2.srvc.get.clearCache = function () {
    oCache = new sap.ui2.srvc.Map();
  };

  /**
   * Number of pending XHR requests.
   *
   * @type {number}
   */
  sap.ui2.srvc.get.pending = 0;

  /**
   * Gets the device's form factor. Based on <code>sap.ui.Device.system</code> from SAPUI5.
   * @returns {string}
   *   the device's form factor ("desktop", "tablet" or "phone")
   * @since 1.19.1
   */
  sap.ui2.srvc.getFormFactor = function () {
   // see also redundant declaration in sap.ushell.utils.getFormFactor which has to be in sync
    var oSystem = sap.ui.Device.system;

    if (oSystem.desktop) {
      return oSystem.SYSTEMTYPE.DESKTOP;
    }
    if (oSystem.tablet) {
      return oSystem.SYSTEMTYPE.TABLET;
    }
    if (oSystem.phone) {
      return oSystem.SYSTEMTYPE.PHONE;
    }
    // returns undefined
  };

  /**
   * Returns a map of all search parameters present in the given search string
   * or this window's current URL. To be precise, <code>location.search</code>
   * is used as a default and any given search string must use the same syntax
   * (start with a "?" and not include a "#").
   *
   * @param {string} [sSearchString=location.search]
   *   search string starting with a "?" (unless empty) and not including a "#"
   * @returns {object}
   *   a <code>map&lt;string, string[]></code> from key to array of values
   * @since 1.2.0
   *
   * @see <a href="http://java.sun.com/javaee/5/docs/api/javax/servlet/ServletRequest.html#getParameterMap()">
   * javax.servlet.ServletRequest#getParameterMap()</a>
   * @see <a href="https://sapui5.hana.ondemand.com/sdk/docs/api/symbols/jQuery.sap.util.UriParameters.html">
   * Interface jQuery.sap.util.UriParameters</a>
   */
  sap.ui2.srvc.getParameterMap = function (sSearchString) {
    var i,
      n,
      mResult = {},
      sKey,
      sValue,
      iIndexOfEquals,
      aKeyValuePairs,
      // Note: location.search starts with "?" if not empty
      sSearch = arguments.length > 0 ? sSearchString : location.search;

    if (sSearch && sSearch.charAt(0) !== "?") {
      throw new sap.ui2.srvc.Error("Illegal search string " + sSearch, "sap.ui2.srvc");
    }
    if (!sSearch || sSearch === "?") {
      return {}; // Note: split("") would return [""]
    }

    // Note: W3C recommends that servers support ";" as well as "&"
    //       (http://www.w3.org/TR/1999/REC-html401-19991224/appendix/notes.html#h-B.2.2)
    // http://unixpapa.com/js/querystring.html advocates this on the client-side also!
    aKeyValuePairs = sSearch.substring(1).replace(/\+/g, ' ').split(/[&;]/);

    for (i = 0, n = aKeyValuePairs.length; i < n; i += 1) {
      // decode key/value pair at first "=" character
      sKey = aKeyValuePairs[i];
      sValue = ""; // Note: empty value may be omitted altogether
      iIndexOfEquals = sKey.indexOf("=");
      if (iIndexOfEquals >= 0) {
        sValue = sKey.slice(iIndexOfEquals + 1);
        sValue = decodeURIComponent(sValue);
        sKey = sKey.slice(0, iIndexOfEquals);
      }
      sKey = decodeURIComponent(sKey);

      // map key to value(s)
      // Note: beware of inherited functions!
      if (!Object.prototype.hasOwnProperty.call(mResult, sKey)) {
        mResult[sKey] = [];
      }
      mResult[sKey].push(sValue);
    }

    return mResult;
  };

  /**
   * Returns the value of the given URL's GET parameter with the given name, properly decoded.
   * Returns "" if no such parameter can be found.
   *
   * @param {string} sUrl
   *   any URL
   * @param {string} sName
   *   the name of the GET parameter we are looking for
   * @returns {string}
   *   the parameter value, properly decoded
   *
   * @private
   * @since 1.17.0
   */
  sap.ui2.srvc.getParameterValue = function (sUrl, sName) {
    var oParameterMap, iQueryIndex;

    if (typeof sName !== "string") {
      // avoid surprises when sName would later be converted into a string
      throw new sap.ui2.srvc.Error("Missing parameter name", "sap.ui2.srvc");
    }

    sUrl = sUrl.split('#')[0];
    iQueryIndex = sUrl.indexOf("?");
    if (iQueryIndex >= 0) {
      oParameterMap = sap.ui2.srvc.getParameterMap(sUrl.slice(iQueryIndex));
      if (oParameterMap[sName]) {
        return oParameterMap[sName][0];
      }
    }
    return "";
  };

  /**
   * Tells whether the given value is an array.
   *
   * @param {object} o
   *   any value
   * @returns {boolean}
   *   <code>true</code> if and only if the given value is an array
   * @since 1.2.0
   */
  sap.ui2.srvc.isArray = function (o) {
    // see Crockford page 61
    return Object.prototype.toString.apply(o) === '[object Array]';
  };
  /**
   * Tells whether the given value is a string.
   *
   * @param {object} o
   *   any value
   * @returns {boolean}
   *   <code>true</code> if and only if the given value is a string
   * @since 1.50.1
   */
  sap.ui2.srvc.isString = function name(o) {
    return /String/.test(Object.prototype.toString.call(o));
  };

  /**
   * Parses the given XML string and returns it as a document.
   *
   * @param {string} sXml
   *   the XML
   * @returns {DOMDocument}
   *   a DOM document, or <code>null</code> in case of missing or empty XML string
   * @throws {Error}
   *   in case of invalid XML string
   * @since 1.2.0
   */
  sap.ui2.srvc.parseXml = function (sXml) {
    var oXml;
    if (!sXml || typeof sXml !== "string") {
      return null;
    }
    oXml = new DOMParser().parseFromString(sXml, "text/xml");
    if (oXml.getElementsByTagName("parsererror").length) { // Chrome, Firefox
      throw new sap.ui2.srvc.Error("Invalid XML: " + sXml, "sap.ui2.srvc");
    }
    return oXml;
  };

  /**
   * Serves as a marker for functions that are to be exposed in QUnit tests. Calls to this function
   * are expected to be placed directly before the named function declaration (even <b>after</b>
   * the JSDoc). The function itself does nothing.
   *
   * @param {object} o
   *   the object to which this function will be attached in tests; must not be <code>this</code>
   *   (use <code>that</code> instead)
   * @since 1.3.0
   */
  sap.ui2.srvc.testPublishAt = function (o) {
    // intentionally left blank
  };

  // "public classes" **********************************************************

  if (sap.ui2.srvc.Error === undefined) {
    sap.ui2.srvc.Error = function (sMessage, sComponent, bLogError) {
      // see also redundant declaration in error.js which has to be in sync
      var oError = new Error(sMessage); // reuse Error constructor to benefit from it (e.g. stack)

      // by default the error should be logged (as always in this project)
      bLogError = bLogError === undefined ? true : bLogError;

      oError.name = "sap.ui2.srvc.Error";
      if (bLogError === true) {
        sap.ui2.srvc.log.error(sMessage, null, sComponent);
      }
      return oError;
    };
    // to avoid (new Error()) instanceof sap.ui2.srvc.Error === true we do not set the prototype,
    // we also tolerate that (new sap.ui2.srvc.Error()) instanceof sap.ui2.srvc.Error === false now
    // sap.ui2.srvc.Error.prototype = Error.prototype;
  }

  /**
   * Creates an empty map. It is used for mapping from arbitrary string(!) keys (including "get" or
   * "hasOwnProperty") to values of any type.
   * @class
   * @since 1.5.0
   */
  sap.ui2.srvc.Map = function () {
    this.entries = {};
  };

  /**
   * Associates the specified value with the specified key in this map. If the map previously
   * contained a mapping for the key, the old value is replaced by the specified value. Returns
   * the old value. Note: It might be a good idea to assert that the old value is
   * <code>undefined</code> in case you expect your keys to be unique.
   *
   * @param {string} sKey
   *   key with which the specified value is to be associated
   * @param {any} vValue
   *   value to be associated with the specified key
   * @returns {any}
   *   the old value
   * @since 1.5.0
   */
  sap.ui2.srvc.Map.prototype.put = function (sKey, vValue) {
    var vOldValue = this.get(sKey);
    this.entries[sKey] = vValue;
    return vOldValue;
  };

  /**
   * Returns <tt>true</tt> if this map contains a mapping for the specified key.
   *
  * @param {string} sKey
  *   key whose presence in this map is to be tested
  * @returns {boolean}
  *   <tt>true</tt> if this map contains a mapping for the specified key
   * @since 1.5.0
  */
  sap.ui2.srvc.Map.prototype.containsKey = function (sKey) {
    if (typeof sKey !== "string") {
      throw new sap.ui2.srvc.Error("Not a string key: " + sKey, "sap.ui2.srvc");
    }
    return Object.prototype.hasOwnProperty.call(this.entries, sKey);
  };

  /**
   * Returns the value to which the specified key is mapped, or <code>undefined</code> if this map
   * contains no mapping for the key.
   * @param {string} sKey
   *   the key whose associated value is to be returned
   * @returns {any}
   *   the value to which the specified key is mapped, or <code>undefined</code> if this map
   *   contains no mapping for the key
   * @since 1.5.0
  */
  sap.ui2.srvc.Map.prototype.get = function (sKey) {
    if (this.containsKey(sKey)) {
      return this.entries[sKey];
    }
    //return undefined;
  };

  /**
   * Returns an array of this map's keys. This array is a snapshot of the map; concurrent
   * modifications of the map while iterating do not influence the sequence.
   * @returns {string[]}
   *   this map's keys
   * @since 1.5.0
   */
  sap.ui2.srvc.Map.prototype.keys = function () {
    return Object.keys(this.entries);
  };

  /**
   * Removes a key together with its value from the map.
   * @param {string} sKey
   *  the map's key to be removed
   * @since 1.11.0
   */
  sap.ui2.srvc.Map.prototype.remove = function (sKey) {
    delete this.entries[sKey];
  };

  /**
   * Returns this map's string representation.
   *
   * @returns {string}
   *   this map's string representation
   * @since 1.5.0
   */
  sap.ui2.srvc.Map.prototype.toString = function () {
    var aResult = ['sap.ui2.srvc.Map('];
    aResult.push(JSON.stringify(this.entries));
    aResult.push(')');
    return aResult.join('');
  };


  // initialize the cache for GET
  sap.ui2.srvc.get.clearCache();
}());

// from template itself *******************************************************
(function () {
    "use strict";
    /*global bootTask, FrameLogonManager, LogonManager, start, window */

// begin sap/net/LogonManager.js *******************************************
        var Status, logonManager, xhrLogonEvents, useOldEvents, IgnoreListPrototype, useCompliantReadyStates, HEADERS_RECEIVED = 2, DONE = 4, _XMLHttpRequest = XMLHttpRequest;

        Status = {
            AUTHENTICATED: 0,
            UNAUTHENTICATED: 1,
            PENDING: 2
        };
        xhrLogonEvents = ["xhrlogon", "xhrlogoncomplete", "xhrlogonfailed", "xhrlogonaborted"];

        function xhrLogger() {
            return _XMLHttpRequest.logger;
        }

        // Helper functions
        function isSuccess(status) {
            return (status >= 200 && status < 300) || (status === 304);
        }

        function createOldEvent(type) {
            var event;
            event = document.createEvent("Event");
            event.initEvent(type, false, true);
            return event;
        }

        function createEvent(type) {
            var event;
            if (useOldEvents) {
                event = createOldEvent(type);
            }
            else {
                try {
                    event = new Event(type);
                }
                catch (error) {
                    useOldEvents = true;
                    event = createOldEvent(type);
                }
            }
            return event;
        }

        function parseXHRLogonHeader(httpHeader) {
            var parser, result, token, value, xhrLogonHeader, i;
            parser = /(?:,|^)\s*(?:,\s*,)*\s*(\w+)\s*=\s*(?:"((?:[^"\\]|\\.)*)"|(\w*))/g;
            xhrLogonHeader = {};
            result = parser.exec(httpHeader);
            while (result !== null) {
                token = result[1];
                value = result[2].replace(/\\(.)/g, "$1");
                xhrLogonHeader[token] = value;
                result = parser.exec(httpHeader);
            }
            if (xhrLogonHeader.accept) {
                xhrLogonHeader.accept = xhrLogonHeader.accept.split(",");
                for (i = 0; i < xhrLogonHeader.accept.length; ++i) {
                    xhrLogonHeader.accept[i] = xhrLogonHeader.accept[i].trim();
                }
            }
            return xhrLogonHeader;
        }

        // XHRLogonRequest
        function XHRLogonRequest(channel, event, xhrLogonHeader) {
            this.channel = channel;
            this.event = event;
            this.header = xhrLogonHeader;
        }

        // IgnoreList
        function IgnoreList() {
            this.p = [];
            this.r = [];
            this.f = [];
        }

        IgnoreListPrototype = IgnoreList.prototype;
        IgnoreListPrototype.add = function (item) {
            switch (typeof item) {
                case "string":
                    this.p.push(item);
                    break;
                case "object":
                    if (item instanceof RegExp) {
                        this.r.push(item);
                    }
                    else {
                        throw new TypeError("Unsupported ignore type");
                    }
                    break;
                case "function":
                    this.f.push(item);
                    break;
                default:
                    throw new TypeError("Unsupported ignore type");
            }
        };
        IgnoreListPrototype.ignored = function (item) {
            var ignore;
            ignore = this._prefix(item) || this._regexp(item) || this._function(item);
            return ignore;
        };
        IgnoreListPrototype.clear = function () {
            this.p = [];
            this.r = [];
            this.f = [];
        };
        IgnoreListPrototype._prefix = function (item) {
            var filters, k, n, res;
            res = false;
            filters = this.p;
            n = filters.length;
            for (k = 0; k < n; ++k) {
                if (item.startsWith(filters[k])) {
                    res = true;
                    break;
                }
            }
            return res;
        };
        IgnoreListPrototype._regexp = function (item) {
            var filters, k, n, res;
            res = false;
            filters = this.r;
            n = filters.length;
            for (k = 0; k < n; ++k) {
                if (filters[k].test(item)) {
                    res = true;
                    break;
                }
            }
            return res;
        };
        IgnoreListPrototype._function = function (item) {
            var filters, k, n, res;
            res = false;
            filters = this.f;
            n = filters.length;
            for (k = 0; k < n; ++k) {
                try {
                    if (filters[k](item)) {
                        res = true;
                        break;
                    }
                }
                catch (error) {
                }
            }
            return res;
        };

        // LogonManager
        function LogonManager(customFactory) {
            if (logonManager) {
                // Enforce singleton
                throw new Error("XHR Logon Manager already created");
            }
            xhrLogger().info("Starting XHR Logon Manager");
            this.queue = [];
            this.realms = {};
            this.handlers = new _XMLHttpRequest.EventHandlers(xhrLogonEvents);
            if (customFactory) {
                this._filterFactory = customFactory;
            }
            this._initializeTrustedOrigins();
            this._registerFilterFactory();
            window.addEventListener("message", this.getEventHandler());
        }

        // Whether to trigger a logon process if a synchronous request gets an XHR logon challenge
        LogonManager.prototype.triggerLogonOnSyncRequest = true;
        LogonManager.prototype.addEventListener = function (type, callback) {
            this.handlers.add(type, callback);
        };
        LogonManager.prototype.removeEventListener = function (type, callback) {
            this.handlers.remove(type, callback);
        };
        LogonManager.prototype.dispatchEvent = function (event) {
            this.handlers.dispatch(event);
        };
        LogonManager.prototype.dispatchLogonEvent = function (request) {
            var event;
            event = createEvent("xhrlogon");
            event.request = request;
            this.dispatchEvent(event);
        };
        LogonManager.prototype.dispatchLogonCompletedEvent = function (xhrLogon) {
            var event;
            event = createEvent("xhrlogoncomplete");
            event.xhrLogon = xhrLogon;
            this.dispatchEvent(event);
        };
        LogonManager.prototype.dispatchLogonFailedEvent = function (xhrLogon) {
            var event;
            event = createEvent("xhrlogonfailed");
            event.xhrLogon = xhrLogon;
            this.dispatchEvent(event);
        };
        LogonManager.prototype.dispatchLogonAbortedEvent = function (realm) {
            var event;
            event = createEvent("xhrlogonaborted");
            event.realm = realm;
            this.dispatchEvent(event);
        };
        LogonManager.prototype.getRealmStatus = function (name) {
            var status;
            status = this.realms[name];
            if (status === undefined) {
                status = Status.UNAUTHENTICATED;
                this.realms[name] = status;
            }
            return status;
        };
        LogonManager.prototype.isQueued = function (xhr) {
            var i, n, req;
            if (this.pending && this.pending.channel && this.pending.channel.xhr === xhr) {
                return true;
            }
            for (i = 0, n = this.queue.length; i < n; ++i) {
                req = this.queue[i];
                if (req.channel && req.channel.xhr === xhr) {
                    return true;
                }
            }
            return false;
        };
        LogonManager.prototype.onXHRLogon = function (request) {
            var realm, abort;
            if (!request || !request.channel) {
                xhrLogger().warn("Ignoring invalid XHR Logon request");
                return;
            }
            if (this.isQueued(request.channel.xhr)) {
                xhrLogger().debug("Ignoring authentication request for already queued request " + request.channel.url);
                return;
            }
            xhrLogger().info("Authentication requested for " + request.channel.url);
            if (this.handlers.hasSubscribers("xhrlogon")) {
                // Initiate XHR Logon sequence only if someone handles it :-)
                realm = request.header.realm;
                if (this.pending) {
                    xhrLogger().debug("Pending authentication process, queueing request");
                    if (this.getRealmStatus(realm) === Status.AUTHENTICATED) {
                        this.realms[realm] = Status.UNAUTHENTICATED;
                    }
                    this.queue.push(request);
                }
                else {
                    xhrLogger().debug("Dispatching authentication request");
                    this.realms[realm] = Status.PENDING;
                    this.pending = request;
                    this.dispatchLogonEvent(request);
                }
            }
            else {
                xhrLogger().info("No authentication handler registered");
                abort = this.queue;
                this.queue = [];
                abort.push(request);
                if (this.pending) {
                    abort.push(this.pending);
                    this.pending = undefined;
                }
                this.abort(abort);
            }
        };
        LogonManager.prototype.onXHRLogonCompleted = function (xhrLogon) {
            var realm, success, queue, processQueue, waitingQueue, i, n;
            realm = xhrLogon.realm;
            queue = this.queue;
            processQueue = [];
            waitingQueue = [];
            success = isSuccess(xhrLogon.status);
            this.realms[realm] = (success ? Status.AUTHENTICATED : Status.UNAUTHENTICATED);
            if (this.pending) {
                if (realm === this.pending.header.realm) {
                    processQueue.push(this.pending);
                }
                else {
                    queue.push(this.pending);
                }
            }
            this.pending = undefined;
            n = queue.length;
            for (i = 0; i < n; ++i) {
                if (queue[i].header.realm === realm) {
                    processQueue.push(queue[i]);
                }
                else {
                    waitingQueue.push(queue[i]);
                }
            }
            this.queue = waitingQueue;
            if (processQueue.length > 0) {
                if (success) {
                    xhrLogger().info("Authentication succeeded for realm " + realm + ", repeating requests.");
                    this.retry(processQueue);
                }
                else {
                    xhrLogger().warning("Authentication failed for realm " + realm);
                    this.abort(processQueue);
                }
            }

            // Fire events to complete current logon process before initiating a new one
            if (success) {
                this.dispatchLogonCompletedEvent(xhrLogon);
            }
            else {
                this.dispatchLogonFailedEvent(xhrLogon);
            }

            // Process awaiting requests
            if (this.queue.length > 0) {
                this.onXHRLogon(this.queue.shift());
            }
        };
        LogonManager.prototype.abortXHRLogon = function (realm) {
            var queue, processQueue, waitingQueue, i, n;
            if (!realm && this.pending) {
                realm = this.pending.header.realm;
            }
            if (realm) {
                queue = this.queue;
                processQueue = [];
                waitingQueue = [];
                this.realms[realm] = Status.UNAUTHENTICATED;
                if (this.pending) {
                    if (realm === this.pending.header.realm) {
                        processQueue.push(this.pending);
                    }
                    else {
                        queue.push(this.pending);
                    }
                }
                this.pending = undefined;
                n = queue.length;
                for (i = 0; i < n; ++i) {
                    if (queue[i].header.realm === realm) {
                        processQueue.push(queue[i]);
                    }
                    else {
                        waitingQueue.push(queue[i]);
                    }
                }
                this.queue = waitingQueue;
                if (processQueue.length > 0) {
                    xhrLogger().warning("Authentication aborted for realm " + realm);
                    this.abort(processQueue);
                }
            }
            else {
                xhrLogger().info("No pending authentication, ignoring abort");
            }

            // Fire abort event and process awaiting requests
            this.dispatchLogonAbortedEvent(realm);
            if (this.queue.length > 0) {
                this.onXHRLogon(this.queue.shift());
            }
        };
        LogonManager.prototype.retry = function (queue) {
            var i, n, channel, xhr;
            n = queue.length;
            for (i = 0; i < n; ++i) {
                try {
                    channel = queue[i].channel;
                    if (channel.async) {
                        xhr = channel.xhr;
                        xhr.resumeEvents();
                        xhr.repeat(); // renew request
                    }
                }
                catch (error) {
                    xhrLogger().warning("Error while repeating request: " + error.message);
                }
            }
        };
        LogonManager.prototype.abort = function (queue) {
            var i, n, channel, xhr;
            n = queue.length;
            for (i = 0; i < n; ++i) {
                try {
                    channel = queue[i].channel;
                    if (channel.async) {
                        xhr = channel.xhr;
                        xhr.resumeEvents(true); // authentication failed, propagate buffered initial events
                    }
                }
                catch (error) {
                    xhrLogger().warning("Error while aborting request: " + error.message);
                }
            }
        };
        LogonManager.prototype.abortAll = function () {
            var abort;
            abort = this.queue;
            this.queue = [];
            if (this.pending) {
                abort.push(this.pending);
                this.pending = undefined;
            }
            this.abort(abort);
        };
        LogonManager.prototype.shutdown = function () {
            xhrLogger().info("XHR Logon Manager shutdown");
            window.removeEventListener("message", this.getEventHandler());
            this.abortAll();
            this._unregisterFilterFactory();
        };
        LogonManager.prototype.handleEvent = function (event) {
            var data, xhrLogonRegExp, xhrLogonStatus;
            xhrLogonRegExp = /^\s*\{\s*"xhrLogon"/;
            data = event.data;
            if (xhrLogonRegExp.test(data)) {
                try {
                    if (this.isTrusted(event.origin)) {
                        xhrLogonStatus = JSON.parse(data);
                        this.onXHRLogonCompleted(xhrLogonStatus.xhrLogon);
                    }
                    else {
                        xhrLogon.warning("Received xhrlogon message from untrusted origin " + event.origin);
                    }
                }
                catch (error) {
                    xhrLogger().warning("Invalid xhrLogon message: " + data);
                }
            }
        };
        LogonManager.prototype._initializeTrustedOrigins = function () {
            var loc, protocol, origins;
            origins = {};
            loc = window.location;
            protocol = loc.protocol;
            origins[protocol + "//" + loc.host] = true;
            if (loc.port === "") {
                switch (protocol) {
                    case "http":
                        origins[protocol + "//" + loc.host + ":80"] = true;
                        break;
                    case "https":
                        origins[protocol + "//" + loc.host + ":443"] = true;
                        break;
                }
            }
            this._trustedOrigins = origins;
        };
        LogonManager.prototype.isTrusted = function (origin) {
            return (!!this._trustedOrigins[origin]);
        };
        LogonManager.prototype.addTrustedOrigin = function (origin) {
            this._trustedOrigins[origin] = true;
        };
        LogonManager.prototype.getEventHandler = function () {
            var handler, self;
            handler = this._eventHandler;
            if (!handler) {
                self = this;
                handler = function (event) {
                    self.handleEvent(event);
                };
                this._eventHandler = handler;
            }
            return handler;
        };
        LogonManager.prototype._getFilterFactory = function () {
            var factory, self;
            factory = this._filterFactory;
            if (!factory) {
                self = this;
                factory = function (channel) {
                    channel.filters.push(new XHRLogonFilter(self, channel));
                };
                this._filterFactory = factory;
            }
            return factory;
        };
        LogonManager.prototype._registerFilterFactory = function () {
            if (_XMLHttpRequest.channelFactory) {
                _XMLHttpRequest.channelFactory.addFilterFactory(this._getFilterFactory());
            }
        };
        LogonManager.prototype._unregisterFilterFactory = function () {
            if (_XMLHttpRequest.channelFactory) {
                _XMLHttpRequest.channelFactory.removeFilterFactory(this._getFilterFactory());
                delete this._filterFactory;
            }
        };
        LogonManager.prototype.createIgnoreList = function () {
            this.ignore = new IgnoreList();
        };

        // XHRLogonFilter
        function XHRLogonFilter(manager, channel) {
            this.manager = manager;
            this.channel = channel;
            // Listen on the readystatechange event as this is the first one to be fired upon completion
            if (!this.manager.ignore || !this.manager.ignore.ignored(channel.url)) {
                channel.xhr._addEventListener("readystatechange", this);
            }
        }

        XHRLogonFilter.prototype.sending = function (channel) {
            var xhr;
            if (this.manager.ignore && this.manager.ignore.ignored(channel.url)) {
                return;
            }
            xhr = channel.xhr;
            if (!xhr.getRequestHeader("X-XHR-Logon")) {
                xhr.setRequestHeader("X-XHR-Logon", "accept=\"repeat,iframe\"");
            }
            if (!xhr.getRequestHeader("X-Requested-With")) {
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            }
        };
        XHRLogonFilter.prototype.handleEvent = function (event) {
            var channel, xhr, xhrLogonHeader, httpHeader, status, repeat, accept, i;
            channel = this.channel;
            xhr = channel.xhr;
            if (xhr.readyState < HEADERS_RECEIVED) {
                return;
            }
            if (xhr.readyState === HEADERS_RECEIVED) {
                // Some old IE versions use ready states from old XHR specification
                if (useCompliantReadyStates === undefined) {
                    try {
                        status = xhr.status;
                        useCompliantReadyStates = !!status;
                    }
                    catch (err) {
                        useCompliantReadyStates = false;
                    }
                    if (!status) {
                        return;
                    }
                }
                else if (!useCompliantReadyStates) {
                    return;
                }
            }

            if (xhr.status === 403) {
                httpHeader = xhr.getResponseHeader("x-xhr-logon");
                if (httpHeader) {
                    // prevent event propagation
                    if (channel.async) {
                        channel.xhr.suspendEvents();
                    }
                    if (channel.async || this.manager.triggerLogonOnSyncRequest) {
                        xhrLogonHeader = parseXHRLogonHeader(httpHeader);
                        accept = xhrLogonHeader.accept;
                        if (accept) {
                            for (i = 0; i < accept.length; ++i) {
                                if (accept[i] === 'repeat') {
                                    repeat = true;
                                    break;
                                }
                            }
                        }
                        if (repeat && !channel.repeated) {
                            if (xhr.readyState === DONE) {
                                channel.repeated = true; // Prevent looping
                                xhr.setRepeatHeader("X-XHR-Logon", "accept=\"iframe\"");
                                xhr.resumeEvents();
                                xhr.repeat();
                            }
                        }
                        else {
                            this.manager.onXHRLogon(new XHRLogonRequest(channel, event, xhrLogonHeader));
                        }
                    }
                }
            }
        };

// end   sap/net/LogonManager.js *******************************************

// begin sap/net/FrameLogonManager.js *******************************************
        var frameLogonManager, useOldEvents, _XMLHttpRequest = XMLHttpRequest;

        function createOldEvent(type) {
            var event;
            event = document.createEvent("Event");
            event.initEvent(type, false, true);
            return event;
        }

        function createEvent(type) {
            var event;
            if (useOldEvents) {
                event = createOldEvent(type);
            }
            else {
                try {
                    event = new Event(type);
                }
                catch (error) {
                    useOldEvents = true;
                    event = createOldEvent(type);
                }
            }
            return event;
        }

        // Lightweight URL
        function URL(url) {
            this._parse(url);
        }

        URL.prototype._parse = function (url) {
            var parseRegExp, matches;
            parseRegExp = /([^?#]+)(\?[^#]*)?(#.*)?/;
            matches = parseRegExp.exec(url);
            this.path = matches[1];
            this.hash = matches[3] || "";
            this.parameters = this._parseSearch(matches[2]);
        };
        URL.prototype._parseSearch = function (search) {
            var paramRegExp, matches, params;
            params = {};
            if (search) {
                paramRegExp = /[?&]([^&=]+)=?([^&]*)/g;
                matches = paramRegExp.exec(search);
                while (matches) {
                    params[matches[1]] = matches[2];
                    matches = paramRegExp.exec(search);
                }
            }
            return params;
        };
        URL.prototype.getParameter = function (name) {
            return this.parameters[name];
        };
        URL.prototype.removeParameter = function (name) {
            delete this.parameters[name];
        };
        URL.prototype.setParameter = function (name, value) {
            this.parameters[name] = encodeURIComponent(value);
        };
        Object.defineProperties(URL.prototype, {
            href: {
                enumerable: true,
                get: function () {
                    var href;
                    href = this.path + this.search + this.hash;
                    return href;
                }
            },
            "search": {
                enumerable: true,
                get: function () {
                    var search, params, name, value;
                    search = "";
                    params = this.parameters;
                    for (name in params) {
                        if (params.hasOwnProperty(name)) {
                            value = params[name];
                            if (search.length > 0) {
                                search += "&";
                            }
                            search += name;
                            if (value) {
                                search += "=";
                                search += value;
                            }
                        }
                    }
                    if (search.length > 0) {
                        search = "?" + search;
                    }
                    return search;
                }
            }
        });

        /*
         * For a sorted set a, returns the largest element smaller or equal to x or -1 if such an element does not exist
         */
        function lowerBound(x, a) {
            var i, v, s = 0, e = a.length - 1;
            if (e < 0 || x < a[0]) {
                return -1;
            }
            if (x >= a[e]) {
                return e;
            }
            while (s < e) {
                i = (s + e + 1) >> 1; // integer division by 2, s < i <= e
                v = a[i];
                if (x === v) {
                    return i;
                }
                if (x < v) {
                    e = i - 1;
                }
                else {
                    s = i;
                }
            }
            return s;
        }

        /*
         * Default implementation for creating, showing, and destroying an iframe.
         */
        function DefaultLogonFrameProvider() {
            var frame,
                frameCounter = 0,
                AUTH_REQUIRED = "authenticationrequired";
            this.handlers = new _XMLHttpRequest.EventHandlers([AUTH_REQUIRED]);
            this.addEventListener = function (type, callback) {
                this.handlers.add(type, callback);
            };
            this.removeEventListener = function (type, callback) {
                this.handlers.remove(type, callback);
            };
            this.dispatchAuthenticationRequired = function () {
                var self = this, event = createEvent(AUTH_REQUIRED);
                setTimeout(function () {
                    self.handlers.dispatch(event);
                }, 0);
            };

            function onReadyStateChanged() {
                if (document.readyState === "complete") {
                    document.body.appendChild(frame);
                }
            }

            this.create = function () {
                var frameId;
                this.destroy();
                // don't create frame if simple reload mode is used
                if (this.handlers.hasSubscribers(AUTH_REQUIRED)) {
                    this.dispatchAuthenticationRequired();
                    return null;
                } else {
                    frameCounter += 1;
                    frameId = "xhrLogonFrame" + frameCounter;
                    frame = document.createElement("iframe");
                    frame.id = frameId;
                    frame.style.display = "none";
                    if (document.readyState === "complete") {
                        document.body.appendChild(frame);
                    } else {
                        // wait until document has been loaded
                        addWindowEventListener(document, "readystatechange", onReadyStateChanged);
                    }
                    return frame;
                }
            };

            this.destroy = function () {
                if (frame) {
                    document.body.removeChild(frame);
                    frame = null;
                }
            };

            this.show = function (forceDisplay) {
                if (!forceDisplay && this.handlers.hasSubscribers(AUTH_REQUIRED)) {
                    this.dispatchAuthenticationRequired();
                }
                else if (frame) {
                    frame.style.display = "block";
                    frame.style.position = "absolute";
                    frame.style.top = 0;
                    frame.style.left = 0;
                    frame.style.width = "100%";
                    frame.style.height = "100%";
                    frame.style.zIndex = 9999;
                    frame.style.border = 0;
                    frame.style.background = "white"; // Note: else it is transparent!
                }
            };
        }

        // Simple frame logon management
        function FrameLogonManager(logonManager) {
            this.logonManager = logonManager;
            this._lfp = new DefaultLogonFrameProvider();
            this._timeout = {};
            this._idxTimeout = [];
            this.defaultTimeout = 600;
            logonManager.addEventListener("xhrlogon", this);
            logonManager.addEventListener("xhrlogoncomplete", this);
            logonManager.addEventListener("xhrlogonfailed", this);
        }

        Object.defineProperties(FrameLogonManager.prototype, {
            logonFrameProvider: {
                get: function () {
                    return this._lfp;
                },
                set: function (lfp) {
                    if (lfp) {
                        this._lfp = lfp;
                    }
                    else {
                        // Setting null or undefined will reset to the default LogonFrameProvider
                        this._lfp = new DefaultLogonFrameProvider();
                    }
                }
            }
        });
        FrameLogonManager.prototype._indexTimeouts = function () {
            var k, index = [], timeout = this._timeout;
            for (k in timeout) {
                if (timeout.hasOwnProperty(k)) {
                    index.push(k);
                }
            }
            this._idxTimeout = index.sort();
        };
        FrameLogonManager.prototype.getTimeout = function (path) {
            var p, i = lowerBound(path, this._idxTimeout);
            if (i >= 0) {
                p = this._idxTimeout[i];
                if (path.substring(0, p.length) === p) {
                    return this._timeout[p];
                }
            }
            return this.defaultTimeout
        };
        FrameLogonManager.prototype.setTimeout = function (path, value) {
            if (!path) {
                return;
            }
            if (value) {
                this._timeout[path] = value;
            }
            else {
                delete this._timeout[path];
            }
            this._indexTimeouts();
        };
        FrameLogonManager.prototype.shutdown = function () {
            var logonManager;
            logonManager = this.logonManager;
            if (logonManager) {
                logonManager.removeEventListener("xhrlogon", this);
                logonManager.removeEventListener("xhrlogoncomplete", this);
                logonManager.removeEventListener("xhrlogonfailed", this);
            }
        };
        FrameLogonManager.prototype.getFrameLoadHandler = function (provider, frameId, timeout) {
            var loadHandler, cancelId;
            timeout = timeout || this.defaultTimeout;
            loadHandler = function () {
                if (cancelId) {
                    // Frame has loaded a new page, reset previous timer
                    clearTimeout(cancelId);
                }
                cancelId = setTimeout(function () {
                    provider.show();
                }, timeout);
            };
            return loadHandler;
        };
        FrameLogonManager.prototype.onXHRLogon = function (request) {
            var url, provider, frame, timeout;
            this.cancelXHRLogon();
            timeout = this.getTimeout(request.channel.url);
            url = new URL(request.channel.url);
            url.setParameter("xhr-logon", "iframe");
            provider = this.logonFrameProvider;
            frame = provider.create();
            if (frame) {
                if (!frame.onload) {
                    frame.onload = this.getFrameLoadHandler(provider, frame.id, timeout);
                }
                frame.xhrTimeout = timeout;
                frame.src = url.href;
            }
            this.pending = provider;
        };
        FrameLogonManager.prototype.onXHRLogonComplete = function () {
            if (this.pending) {
                this.pending.destroy();
                this.pending = undefined;
            }
        };
        FrameLogonManager.prototype.cancelXHRLogon = function () {
            if (this.pending) {
                LogonManager.getInstance().abortXHRLogon();
                this.onXHRLogonComplete();
            }
        };
        FrameLogonManager.prototype.handleEvent = function (event) {
            var request;
            switch (event.type) {
                case "xhrlogon":
                    request = event.request;
                    if (request) {
                        this.onXHRLogon(request);
                    }
                    break;
                case "xhrlogoncomplete":
                    this.onXHRLogonComplete();
                    break;
                case "xhrlogonfailed":
                    this.onXHRLogonComplete();
                    break;
            }
        };

// end   sap/net/FrameLogonManager.js *******************************************

    // instantiate the standard FrameLogonManager here; we just add a setter method
    // for the LogonFrameProvider which allows to flag it as final to avoid that
    // an AuxWindowFrameProvider is overridden later
    var oLogonManager = new LogonManager();
    LogonManager.getInstance = function() {
        return oLogonManager;
    };
    var oFrameLogonManager = new FrameLogonManager(oLogonManager);
    oFrameLogonManager.setLogonFrameProvider = function (oNewLogonFrameProvider, bFinal) {
        if (this.bLogonFrameProviderFinal) {
            return;
        }
        this.bLogonFrameProviderFinal = !!bFinal;

        this.logonFrameProvider = oNewLogonFrameProvider;
    };
    oFrameLogonManager.setLogonFrameProviderFinal = function (bFinal) {
        this.bLogonFrameProviderFinal = !!bFinal;
    };

    // add a getInstance() method to FrameLogonManager
    // to make sap.net.AuxWindowFrameProvider work
    // TODO: the packaging via the template mechanism is not stable;
    // XHR lib should rather be a complete
    // package that we just consume
    FrameLogonManager.getInstance = function() {
        return oFrameLogonManager;
    };

    // Note: replaced with jQuery.sap.log.getLogger("sap.net.xhr") in bootTask()
    XMLHttpRequest.logger = sap.ui2.srvc.log;

// begin sap/net/AuxWindowFrameProvider.js *******************************************
        var useOldEvents, logger, _XMLHttpRequest = XMLHttpRequest; // protect against a possible override of XMLHttpRequest
        logger = {
            info: function (msg) {
                if (_XMLHttpRequest.logger && _XMLHttpRequest.logger.info) {
                    _XMLHttpRequest.logger.info(msg);
                }
            },
            warning: function (msg) {
                if (_XMLHttpRequest.logger && _XMLHttpRequest.logger.warning) {
                    _XMLHttpRequest.logger.warning(msg);
                }
            }
        };

        function createOldEvent(type) {
            var event;
            event = document.createEvent("Event");
            event.initEvent(type, false, true);
            return event;
        }

        function createEvent(type) {
            var event;
            if (useOldEvents) {
                event = createOldEvent(type);
            }
            else {
                try {
                    event = new Event(type);
                }
                catch (error) {
                    useOldEvents = true;
                    event = createOldEvent(type);
                }
            }
            return event;
        }

        function addWindowEventListener(target, type, listener, useCapture) {
            if (target.addEventListener) {
                target.addEventListener(type, listener, useCapture);
            }
            else if (target.attachEvent) {
                target.attachEvent("on" + type, listener);
            }
        }

        function FrameProxy(provider) {
            this.provider = provider;
            this.xhrTimeout = 600;
        }

        FrameProxy.frameCounter = 0;

        Object.defineProperty(FrameProxy.prototype, 'src', {
            get: function () {
                return this.url;
            },
            set: function (url) {
                this.initialize(url);
            }
        });

        FrameProxy.prototype.initialize = function (url) {
            var cancelId, self = this;
            this.close();
            this.closed = false;
            this.url = url;
            this.createPollingFrame();
            addWindowEventListener(this.frame, "load", function () {
                if (cancelId) {
                    // Frame has loaded a new page, reset previous timer
                    clearTimeout(cancelId);
                }
                cancelId = setTimeout(function () {
                    // It seems that we need to display a logon form, do this in a new window to avoid framing issues
                    if (!self.window) {
                        self.createWindow();
                    }
                }, self.xhrTimeout);
            });
        };

        FrameProxy.prototype.closeFrame = function () {
            if (this.frame) {
                document.body.removeChild(this.frame);
                this.frame = undefined;
            }
        };

        FrameProxy.prototype.close = function () {
            try {
                this.closed = true;
                if (this.pollIntervalId) {
                    clearInterval(this.pollIntervalId);
                    this.pollIntervalId = undefined;
                }
                if (this.windowIntervalId) {
                    clearInterval(this.windowIntervalId);
                    this.windowIntervalId = undefined;
                }
                this.closeFrame();
                if (this.window) {
                    setTimeout(function () {
                        window.focus();
                    }, 100);
                    this.window.close();
                    this.window = undefined;
                }
            }
            catch (err) {
                logger.warning("Error while closing logon window: " + err.message);
            }
        };

        FrameProxy.prototype.cancelLogon = function () {
            if (!this.closed) {
                logger.warning("XHR Logon cancelled");
                this.close();
                FrameLogonManager.getInstance().cancelXHRLogon();
            }
        };

        FrameProxy.prototype.createPollingFrame = function () {
            var frame, frameId;
            if (this.closed) {
                return;
            }
            FrameProxy.frameCounter += 1;
            frameId = "xhrLogonFrame" + FrameProxy.frameCounter;
            frame = document.createElement("iframe");
            frame.id = frameId;
            frame.style.display = "none";
            function onReadyStateChanged() {
                if (document.readyState === "complete") {
                    document.body.appendChild(frame);
                }
            }
            if (document.readyState === "complete") {
                document.body.appendChild(frame);
            } else {
                // wait until document has been loaded
                addWindowEventListener(document, "readystatechange", onReadyStateChanged);
            }
            this.frame = frame;
            frame.src = this.url;
        };

        FrameProxy.prototype.onWindowOpenFailed = function () {
            logger.warning("Failed to open logon window");
            this.cancelLogon();
            this.provider.dispatchWindowFailedEvent();
        };

        FrameProxy.prototype.createWindow = function () {
            var auxWindow, self = this;
            auxWindow = window.open(this.url);
            if (!auxWindow) {
                return this.onWindowOpenFailed();
            }
            this.window = auxWindow;
            addWindowEventListener(auxWindow, "load", function () {
                logger.info("Logon window opened");
                if (self.windowTimeout) {
                    clearTimeout(self.windowTimeout);
                }
                if (self.pollIntervalId) {
                    clearInterval(self.pollIntervalId);
                }
                if (self.closed) {
                    return;
                }
                self.pollIntervalId = setInterval(function () {
                    // Robust coarse-grained polling
                    self.poll();
                }, 5000);

                if (!self.windowIntervalId) {
                    self.windowIntervalId = setInterval(function () {
                        // Fine-grained polling
                        var auxWindow = self.window;
                        try {
                            if (!auxWindow || auxWindow.closed) {
                                self.cancelLogon();
                            }
                            else if (typeof auxWindow.notifyParent === "function") {
                                self.poll();
                            }
                        }
                        catch (err) {
                            logger.warning("Logon polling failed: " + err.message);
                        }
                    }, 300);
                }
                setTimeout(function () {
                    self.poll();
                }, 300);
            });
            addWindowEventListener(auxWindow, "close", function () {
                self.cancelLogon();
            });
            setTimeout(function () {
                try {
                    if (self.window) {
                        self.window.focus();
                    }
                }
                catch (err) {
                    logger.warn("Failed to switch focus to logon window");
                }
            }, 300);
            this.windowTimeout = setTimeout(function () {
                // If window load event has not fired after 5s then presumably windows has been blocked
                self.onWindowOpenFailed();
            }, 5000);
        };

        FrameProxy.prototype.poll = function () {
            // Force frame destruction and recreation as forcing reload seems not to be working
            if (this.window && this.window.closed) {
                this.cancelLogon(); // Window has been closed and we did not receive the close event
            }
            else {
                this.closeFrame();
                this.createPollingFrame();
            }
        };

        function AuxWindowFrameProvider() {
            this.handlers = new _XMLHttpRequest.EventHandlers(["windowfailed"]);
        }

        AuxWindowFrameProvider.prototype.create = function () {
            this.frameProxy = new FrameProxy(this);
            return this.frameProxy;
        };
        AuxWindowFrameProvider.prototype.destroy = function () {
            if (this.frameProxy) {
                this.frameProxy.close();
                this.frameProxy = undefined;
            }
        };
        AuxWindowFrameProvider.prototype.show = function () {
        };
        AuxWindowFrameProvider.prototype.addEventListener = function (type, callback) {
            this.handlers.add(type, callback);
        };
        AuxWindowFrameProvider.prototype.removeEventListener = function (type, callback) {
            this.handlers.remove(type, callback);
        };
        AuxWindowFrameProvider.prototype.dispatchWindowFailedEvent = function () {
            var self = this, event = createEvent("windowfailed");
            setTimeout(function () {
                self.handlers.dispatch(event);
            }, 0);
        };
// end   sap/net/AuxWindowFrameProvider.js *******************************************

    // to be used for testPublishAt
    sap.ushell_abap = sap.ushell_abap || {};
    sap.ushell_abap.bootstrap = sap.ushell_abap.bootstrap || {};

    var S_PAGE_SETS_FALLBACK_URL_BASE = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS",
        S_PAGE_SETS_FALLBACK_EXPAND = "Pages/PageChipInstances/Chip/ChipBags/ChipProperties,"
            + "Pages/PageChipInstances/RemoteCatalog,"
            + "Pages/PageChipInstances/ChipInstanceBags/ChipInstanceProperties,"
            + "AssignedPages,DefaultPage",
        S_PAGE_SETS_FALLBACK_URL_RELATIVE = "PageSets('%2FUI2%2FFiori2LaunchpadHome')",
        S_RELOAD_QUERY_PARAM = "sap-ushell-reloaded",
        rShellHash = new RegExp("^(#)?([A-Za-z0-9_]+)-([A-Za-z0-9_]+)"),
        bTriggerStartupProcessing = false,  // to trigger the bootstrap
        bNoOData = false,                   // whether to prevent OData requests
        bApplicationColdStart = false,      // whether an app is directly started via intent
        aServerConfig,                      // the result of the server configuration request
        oPageSetDeferred,                   // the Deferred taking the result from the page set request
        aPageSetArgs,                       // the arguments of the page set request callback function
        bSapStatistics,                     // sap performance statistics setting
        oStartupResult,                     // the result of the startup service
        vDirectStartResponseOrFailMessage,                 // the JSON parsed result of a Direct Start request
        oFullTMResult,                      // the JSON parsed result of the full TM request ( start_up?so=%2A&action=%2A )
        bRequestedCompactTM,                // whether a compactTM request was issued, if not promises are not created!
        oCompactTMResult,                   // the JSON parsed result of the compact TM request
        aDirectStartRequestSegment,                // the Segment used for direct start
        sSystemThemeRoot,                   // theme root - provided by startup service or fallback
        oStartupTheme,                      // theme from startup service
        fnUi5Callback,                      // the SAPUI5 start task callback function
        sXhrLogonMode;                      // xhr logon mode from configuration
    window["sap-ushell-aLazyMeasurements"] = [];  // queue for lazy measurements which cannot be propagated to ui5 yet
    /**
     * Calls window.localStorage.getItem with sKey as key
     * Note: this function is needed, as local storage cannot be spied in FireFox
     * @param {string} sKey
     *   key to read the value from local storage
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function getLocalStorageItem(sKey) {
        return window.localStorage.getItem(sKey);
    }
    /**
     * Checks if the sap-statistics setting as query parameter or via local storage, as
     * UI5 does it in some cases.
     * Note: this function is directly executed
     * @param {string} getWindowLocationSearch
     *   value of window.location.search; to be able to test the behavior of this method with
     *   different search strings.
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function checkSapStatisticsSetting(sWindowLocationSearch) {
        // Check (only once for this file) if sap-statistics is set in query parameter or local storage
        bSapStatistics = /sap-statistics=(true|x|X)/.test(sWindowLocationSearch);
        try {
            // UI5's config cannot be used here, so check local storage
            bSapStatistics = bSapStatistics || (getLocalStorageItem("sap-ui-statistics") === "X");
        } catch (e) {
            sap.ui2.srvc.log.warning(
                "failed to read sap-statistics setting from local storage",
                null,
                "sap.ushell_abap.bootstrap"
            );
        }
        return bSapStatistics; // needed for tests only
    }
    // call function directly (immediate function pattern will break testPublishAt)
    checkSapStatisticsSetting(window.location.search);

    /**
     * Clone a JSON object.
     *
     * @param {object} oObject to clone
     * @returns {object} copy of the input object
     *
     * @private
     */
    function clone(oObject) {
        if (oObject === undefined) {
            return undefined;
        }
        try {
            return JSON.parse(JSON.stringify(oObject));
        } catch (e) {
            sap.ui2.srvc.log.error(
                "Could not clone object",
                null,
                "sap.ushell_abap.bootstrap"
            );
            return undefined;
        }
    }

    /**
     * Determines whether an application
     * direct start is occurring.
     *
     * The root intent (e.g., #Shell-home) will
     * not determine a direct start condition.
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function isDirectStart(sHash) {
        /*
         * Determine whether sHash is a standalone hash #Shell-runStandaloneApp etc; in
         * this case, the hash is not set as initial target for the start_up service
         *
         * @param {string} sName
         *   URL parameter name
         * @return {boolean}
         * @private
         */
        function isStandaloneHash(sHash) {
            if (!sHash) {
                return false;
            }
            return (sHash.indexOf("Shell-runStandaloneApp") === 0)
                || (sHash.indexOf("Shell-home") === 0)
                || (sHash.indexOf("Shell-catalog") === 0)
                || (sHash.indexOf("shell-catalog") === 0)
                || (sHash.indexOf("Action-search") === 0);
        }

        /*
         * We allow to switch off the initial target resolution via configuration; use case is
         * SAP Fiori launchpad designer which bootstraps the ushell,
         * but uses non-standard URL hashes; start_up service performance is very bad if target
         * cannot be resolved; see internal CSN 0000796004 2014
         *
         * @return {boolean} <code>true</code>, if window['sap-ushell_abap-bootstrap-abap-noInitialTarget']
         *      is set to any value
         */
        function isNoInitialTargetResolution() {
            return window['sap-ushell_abap-bootstrap-abap-noInitialTarget'] !== undefined;
        }

        var oMatch = sHash.match(rShellHash);
        var sSemanticObject = oMatch && oMatch[2];
        var sAction = oMatch && oMatch[3];
        var bDirectStart = sHash && !isStandaloneHash(sHash) && !isNoInitialTargetResolution() && sSemanticObject && sAction;
        return bDirectStart;
    }

    /**
     * Determines if a theme is a SAP theme
     * @param {string} sTheme
     *      Theme to be tested
     * @returns {boolean}
     *      <code>true</code> if the theme is an SAP theme
     * @private
     */
    function isSapTheme(sTheme) {
        return sTheme.indexOf("sap_") === 0;
    }

    /**
     * Returns the location href.
     *
     * @returns {string}
     *     the location href
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getLocationHref() {
        return location.href;
    }
    /**
     * Returns the location origin.
     *
     * @returns {string}
     *     the location origin
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getLocationOrigin() {
        // location.origin might not be supported by all browsers
        return location.protocol + "//" + location.host;
    }
    /**
     * Returns the [first] parameter value or undefined
     * @param {string} sValue the value to retrieve
     * @param {object} mMap optional, a parameter map
     * @returns {string}
     *     the first parameter value, if present
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getUrlParameterValue(sValue, mMap) {
        var mParameterMap = mMap || sap.ui2.srvc.getParameterMap();
        return mParameterMap[sValue] && mParameterMap[sValue][0];
    }

    /**
     * Returns the shell hash which is the part of the URL fragment which determines the
     * navigation for the shell. If the URL fragment does not exist or is empty, an empty
     * string is returned.
     *
     * @returns {string}
     *     the shell hash
     *
     * @private
     */
    //TODO Refactor: Align with URLParsing.getShellHash
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getFullShellHash() {
        var sHashDecoded,
            sHref = getLocationHref(),
            iHashIndex = sHref.indexOf("#");
        if (iHashIndex < 0) {
            return "";
        }
        //decode hash: identical behavior to ShellNavigation.hrefForExternal
        sHashDecoded = decodeURI(sHref.slice(iHashIndex + 1));
        return sHashDecoded;
    }

    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getShellHash() {
        var sHashDecoded = getFullShellHash(),
            iAppStateIndex = sHashDecoded.indexOf("&/");
        return iAppStateIndex < 0 ? sHashDecoded : sHashDecoded.slice(0, iAppStateIndex);
    }

    /**
     * Returns the parsed shell hash
     *
     * @returns {object} with properties <code>semanticObject</code> and <code>action</code>
     *
     * @private
     */
    //TODO Refactor: Align with URLParsing.getShellHash
    function getParsedShellHash(sHash) {
        var oMatch = sHash.match(rShellHash);

        return oMatch ? {semanticObject: oMatch[2], action: oMatch[3]} : undefined;
    }

    /**
     * Determines whether to prevent OData requests.
     *
     * @param {boolean} bNewNoOData
     *   whether to prevent OData requests
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function setNoOData(bNewNoOData) {
        bNoOData = bNewNoOData;
    }

    /**
     * Determines whether an application is started directly.
     *
     * @param {boolean} bNewNoOData
     *   whether to prevent OData requests
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function setApplicationColdStart(bNewApplicationColdStart) {
        bApplicationColdStart = bNewApplicationColdStart;
    }

    /**
     * Set startup processing - only needed for tests
     *
     * @param {boolean} bNewValue
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function setTriggerStartupProcessing(bNewValue) {
        bTriggerStartupProcessing = bNewValue;
    }

    function addTime(sId,sInfo) {
        if (sap && sap.ushell && sap.ushell.utils && typeof sap.ushell.utils.addTime === "function") {
            sap.ushell.utils.addTime(sId,sInfo);
        } else {
            window["sap-ushell-aLazyMeasurements"].push({ id : sId, info : sInfo, ts : Date.now() });
        }
    }
    /**
     * Set xhr logon mode - only needed for tests
     *
     * @param {string} sNewValue
     *
     * @private
     */
    /*eslint-disable*/ // need this function for unit tests only
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function setXhrLogonMode(sNewValue) {
        sXhrLogonMode = sNewValue;
    }
    /*eslint-enable*/
    /**
     * Sets the given language and format settings in SAPUI5.
     *
     * @param {object} [oSettings]
     *   the options (may be undefined when nothing to apply)
     * @param {string} [oSettings.language]
     *   the language
     * @param {string} [oSettings.legacyDateFormat]
     *   the date format
     * @param {string} [oSettings.legacyNumberFormat]
     *   the number format
     * @param {string} [oSettings.legacyTimeFormat]
     *   the time format
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function setSapui5Settings(oSettings) {
        var oCore = sap.ui.getCore(),
            oConfiguration = oCore.getConfiguration(),
            oFormatSettings = oConfiguration.getFormatSettings();
        addTime("setSapui5Settings");
        sap.ui2.srvc.log.debug("setSapui5Settings()", JSON.stringify(oSettings),
            "sap.ushell_abap.bootstrap.abap");
        if (oSettings.language) {
            oConfiguration.setLanguage(oSettings.language, oSettings.ABAPLanguage);
        }
        if (oSettings.legacyDateFormat) {
            oFormatSettings.setLegacyDateFormat(oSettings.legacyDateFormat);
        }
        if (oSettings.legacyDateCalendarCustomizing) {
            oFormatSettings.setLegacyDateCalendarCustomizing(oSettings.legacyDateCalendarCustomizing);
        }
        if (oSettings.legacyNumberFormat) {
            oFormatSettings.setLegacyNumberFormat(oSettings.legacyNumberFormat);
        }
        if (oSettings.legacyTimeFormat) {
            oFormatSettings.setLegacyTimeFormat(oSettings.legacyTimeFormat);
        }
    }

    /**
     * Merge the object oConfigToMerge into oMutatedConfig according to
     * sap-ushell-config merge rules Note that the JSON serialized content of
     * oConfigToMerge is used, thus JSON serialization limitations apply (e.g.
     * Infinity -> null ) Note that it is thus not possible to remove a
     * property definition or overriding with  {"propname" : undefined}, one
     * has to override with null or 0 etc.
     *
     * Note: Do not use this method for general merging of other objects, as
     * the rules may be enhanced/altered
     *
     * @param {object} oMutatedBaseConfig
     *     the configuration to merge into, modified in place
     * @param {object} oConfigToMerge
     *     the configuration to be merged with oMutatedBaseConfig
     * @param {boolean} bCloneConfigToMerge
     *     whether the oConfigToMerge must be cloned prior the merge
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function mergeConfig(oMutatedBaseConfig, oConfigToMerge, bCloneConfigToMerge) {
        var oActualConfigToMerge = bCloneConfigToMerge
            ? JSON.parse(JSON.stringify(oConfigToMerge))
            : oConfigToMerge;

        if (typeof oConfigToMerge !== "object") {
            return;
        }

        Object.keys(oActualConfigToMerge).forEach(function (sKey) {
            if (Object.prototype.toString.apply(oMutatedBaseConfig[sKey]) === "[object Object]" &&
                Object.prototype.toString.apply(oActualConfigToMerge[sKey]) === "[object Object]") {

                mergeConfig(oMutatedBaseConfig[sKey], oActualConfigToMerge[sKey], false);
                return;
            }
            oMutatedBaseConfig[sKey] = oActualConfigToMerge[sKey];
        });
    }

    /**
     * Merge launchpad url parameters into the configuration,
     * where appropriate
     * Note: currently a nr of parameters are also interpreted later
     * or evaluated at other points in time or not moved into the config
     * as: a) this coding needs to be copied to other platforms
     *
     * @param {object} oMutatedBaseConfig modified in place
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function mergeUrlParameters(oMutatedBaseConfig) {
        // Shell Navigation reload
        var sUshellReload = getUrlParameterValue("sap-ushell-reload"),
            bUshellReload;
        if (sUshellReload) {
            if (sUshellReload === "X" || sUshellReload === "true") {
                bUshellReload = true;
            } else {
                bUshellReload = false;
            }
        }
        if (bUshellReload !== undefined) {
            jQuery.sap.getObject("services.ShellNavigation.config", 0, oMutatedBaseConfig).reload = bUshellReload;
        }
    }

    function mergePlatformSpecificUrlParameters(oMutatedBaseConfig) {
    }
    /**
     *  determine a theme from the startup result, propagating it into the configuration
     *  at  window["sap-ushell-config"].services.Container.adapter.config.bootTheme
     *
     * @param {object}
     *     the parsed response of the start-up service call
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function copyThemeToContainerAdapterConfig(oBootTheme) {
        jQuery.sap.getObject("sap-ushell-config.services.Container.adapter.config", 0).bootTheme = clone(oBootTheme);
    }


    /**
     * Extracts the theme root from the startup service result or fall back
     * @param {object} oStartupServiceResult
     * @returns {string} the system theme root
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function extractSystemThemeRoot(oStartupServiceResult) {
        if (!oStartupServiceResult) {
            sap.ui2.srvc.log.error("extractSystemThemeRoot: mandatory parameter oStartupServiceResult not supplied");
        }
        if (oStartupServiceResult.themeRoot) {
            // we expect that theme root is supplied by the startup service
            return oStartupServiceResult.themeRoot;
        }
        if (oStartupServiceResult.client) {
            // fallback
            sap.ui2.srvc.log.warning(
                "Theme root was not contained in startup service result. A fallback to /sap/public/bc/themes/~client-<client number> is used",
                null,
                "sap.ushell_abap.bootstrap"
            );
            return "/sap/public/bc/themes/~client-" + oStartupServiceResult.client;
        }
        sap.ui2.srvc.log.error("extractSystemThemeRoot: Could not determine system theme root");
    }

    /**
     * Extracts the theme from the startup service result
     * @param {object} startup service result
     * @returns {string} the theme or undefined
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function extractThemeFromStartupServiceResult(oStartupServiceResult) {
        var aProperties,
            oThemeData;

        if (oStartupServiceResult && oStartupServiceResult.userProfile) {
            aProperties = oStartupServiceResult.userProfile.filter(function (obj) {
                return obj.id === "THEME";
            });
            oThemeData = aProperties.length ? aProperties[0] : {};
            if (oThemeData.value) {
                return oThemeData.value; // this is the one we expect
            }
        }
        if (oStartupServiceResult && oStartupServiceResult.theme) {
            return oStartupServiceResult.theme; // fallback to system default theme
        }
        return ""; // fallback
    }

    /**
     * Determines the theme root for the given theme.
     * In case the theme begins with sap_ we assume that it is a theme provided by sap and therefore
     * theme root is set to "". The theme is then loaded by the UI5 http handler. This is necessary
     * as the themeing infrastructure is not mandatory and therefore it cannot be ensured that the
     * http handler of the theming infrastructure is running.
     * @params {string} theme
     * @params {string} system theme root
     * @returns {string} theme root for the given theme
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function determineThemeRoot(sTheme, sSystemThemeRoot) {
        if (sTheme && isSapTheme(sTheme)) {
            // SAP theme
            return "";
        }
        return sSystemThemeRoot;
    }

    /**
     * Determines the startup theme.
     * Assumption: The theme returned in the startup service does not have a root.
     * It is only the theme name!
     * The theme root is amended here in.
     * @params {string} startup theme
     * @params {string} system theme root
     * @returns {object} theme root for the startup theme
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function determineStartupTheme(oStartupServiceResult, sSystemThemeRoot) {
        var sTheme;

        sTheme = extractThemeFromStartupServiceResult(oStartupServiceResult);
        return {
            theme: sTheme,
            root: determineThemeRoot(sTheme, sSystemThemeRoot)
        };
    }

    /**
     * Extracts the theme from the URL and determines the theme root
     * @returns {object} contains the theme and the theme root, undefined if no URL theme supplied
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function determineUrlTheme(sSystemThemeRoot) {
        var sThemeUrlParameter,
            aThemeParts;

        sThemeUrlParameter = getUrlParameterValue("sap-theme");
        if (sThemeUrlParameter) {
            if (sThemeUrlParameter.indexOf('@') > 0) {
                aThemeParts = sThemeUrlParameter.split('@', 2);
                return {
                    theme : aThemeParts[0],
                    root : aThemeParts[1]
                };
            }
            // no theme root supplied
            return {
                theme : sThemeUrlParameter,
                root : determineThemeRoot(sThemeUrlParameter, sSystemThemeRoot)
            };
        }
        return undefined;
    }

    /**
     * Checks if a theme parameter is supplied in the URL
     * @returns {boolean}
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function isUrlThemeSupplied() {
        if (sap.ui2.srvc.getParameterMap()['sap-theme']) {
            return true;
        }
        return false;
    }

    /**
     * Process themes
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function processTheme(oStartupTheme, sSystemThemeRoot) {
        var oUrlTheme,
            oHtmlTheme = {},
            oBootTheme;
        addTime("applyTheme");
        if (isUrlThemeSupplied()) {
            // URL = prio 1
            oUrlTheme = determineUrlTheme(sSystemThemeRoot);
            oBootTheme = oUrlTheme;
            sap.ui2.srvc.log.debug("theme: URL theme = '" + oBootTheme.theme + "' theme root = '" + oBootTheme.root + "'",
                    null, "sap.ushell_abap.bootstrap");
            // theme is loaded by UI5
        } else if (oStartupTheme) {
            // startup theme = prio 2
            oBootTheme = oStartupTheme;
            sap.ui2.srvc.log.debug("theme: startup service theme = '" + oBootTheme.theme + "' theme root = '" + oBootTheme.root + "'",
                    null, "sap.ushell_abap.bootstrap");

            if (oBootTheme.root) {
                sap.ui.getCore().applyTheme(oBootTheme.theme, oBootTheme.root + "/UI5/");
            } else {
                sap.ui.getCore().applyTheme(oBootTheme.theme);
            }
        } else {
            // html file theme = prio 3
            // set via e.g. data-sap-ui-theme="sap_bluecrystal" as part of UI5 startup in the central
            // Fiori launchpad html file
            oHtmlTheme.theme = jQuery.sap.getObject("sap-ui-config.theme");
                    // could be the URL theme; no problem
                    // Assumption: no theme root included here
            if (oHtmlTheme.theme) {
                oHtmlTheme.root = jQuery.sap.getObject("sap-ui-config.themeRoots." + oHtmlTheme.theme);
                if (!oHtmlTheme.root) {
                    oHtmlTheme.root = determineThemeRoot(oHtmlTheme.theme, sSystemThemeRoot);
                }
                oBootTheme = {
                    theme : oHtmlTheme.theme,
                    root : oHtmlTheme.root
                };
                sap.ui2.srvc.log.debug("theme: html file theme = '" + oBootTheme.theme + "' theme root = '" + oBootTheme.root + "'",
                        null, "sap.ushell_abap.bootstrap");
            } else {
                oBootTheme = {
                    theme : "",
                    root : ""
                };
                sap.ui2.srvc.log.error("Could not determine theme",
                        null, "sap.ushell_abap.bootstrap");
            }
        }
        copyThemeToContainerAdapterConfig(oBootTheme);
        return oBootTheme;
    }

    /**
     * Processes the result of the Context independent
     * configuration results (part of the FioriLaunchpad.html response)
     *
     *
     * @param {object} oStartupResult
     *   the result as a JSON object
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function processStartup(oStartupResult) {
        // TODO: split in merging with config => do first,
        // THEN merge with Configuration file ( if relevant)
        // THEN process => apply to ui5 services etc.
        var mParameterMap = sap.ui2.srvc.getParameterMap(),
            sRequestLocale = getUrlParameterValue("sap-locale", mParameterMap),
            oUi5UserInfo = {},
            oConfig;

        // write the support ticket service enablement to the bootstrap config;
        // do not enable if already disabled, but disable if not available in backend
        oConfig = jQuery.sap.getObject("sap-ushell-config.services.SupportTicket.config",
            0);
        if (oConfig.enabled !== false) {
            oConfig.enabled = (oStartupResult.isEmbReportingActive === true);
        }

        // we just copy the setting of the startupResult to the bootstrap configuration
        // startup result might have been adjusted with fallback URL
        oConfig = jQuery.sap.getObject("sap-ushell-config.services.ClientSideTargetResolution.adapter.config.services", 0);
        oConfig.targetMappings = oStartupResult.services && oStartupResult.services.targetMappings;

        // the same settings must be copied also in the LaunchPage adapter
        // configuration as long as OData requests to target mappings are being
        // made in there.
        oConfig = jQuery.sap.getObject("sap-ushell-config.services.LaunchPage.adapter.config.services", 0);
        oConfig.targetMappings = oStartupResult.services && oStartupResult.services.targetMappings;
        oConfig.launchPage = oStartupResult.services && oStartupResult.services.pbFioriHome;

        oConfig = jQuery.sap.getObject("sap-ushell-config.services.PageBuilding.adapter.config.services", 0);
        oConfig.pageBuilding = oStartupResult.services && oStartupResult.services.pbFioriHome;

        // we just copy the setting of the startupResult to the bootstrap configuration
        // startup result might have been adjusted with fallback URL
        oConfig = jQuery.sap.getObject("sap-ushell-config.services.Personalization.adapter.config.services", 0);
        oConfig.personalization = oStartupResult.services && oStartupResult.services.personalization;

        // we just copy the setting of the startupResult to the bootstrap configuration
        oConfig = jQuery.sap.getObject("sap-ushell-config.services.Personalization.config", 0);
        oConfig.seed = oStartupResult.seed;

        if (!sRequestLocale) {
            oUi5UserInfo = {
                language : oStartupResult.languageBcp47 || oStartupResult.language,
                ABAPLanguage : oStartupResult.language,
                legacyDateFormat : oStartupResult.dateFormat,
                legacyDateCalendarCustomizing : oStartupResult.tislcal,
                legacyNumberFormat : oStartupResult.numberFormat === "" ? " "
                        : oStartupResult.numberFormat,
                legacyTimeFormat : oStartupResult.timeFormat
            };
        }
        processTheme(oStartupTheme, sSystemThemeRoot);
        setSapui5Settings(oUi5UserInfo);

    }

    /**
     * Processes the result of the Context dependent
     * configuration results (part of an explicit start_up call)
     * result processing will trigger resolution of the following two
     * promises
     *  a) AppState Service
     *        services.AppState.config.initialAppStatesPromise
     *        (initialAppStates : { "<key>" : "value as json"})
     *  b) ClientSideTargetResolutionAdapter abap
     *        services.ClientSideTargetResolution.adapter.config.initialSegmentPromise
     *        {[aSegments], oTargetMappings, oSystems);
     * @param {object} oStartupResult
     *   the result as a JSON object
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function processDirectStart(oDirectStart) {
        var oInitialAppStates = {},
            aSegment;
        function addKeys(oTarget, oData, oInitialKeys, oParam, oMember) {
            if (!(oData && oData[oMember])) {
                return;
            }
            if (!(oInitialKeys && oInitialKeys[oParam])) {
                return;
            }
            oTarget[oInitialKeys[oParam]] = oData[oMember];
        }
        // this processing may occur very late, even after the application has been started
        // and a different hash is set.
        // thus it is essential to use the *original* keys from the start_up call here,
        // not the keys extracted from a current hash
        var oInitialKeys = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config._initialKeys;
        addKeys(oInitialAppStates, oDirectStart, oInitialKeys, "sap-intent-param","iparState");
        addKeys(oInitialAppStates, oDirectStart, oInitialKeys, "sap-iapp-state","iappState");
        addKeys(oInitialAppStates, oDirectStart, oInitialKeys, "sap-xapp-state","xappState");
        var oConfig = jQuery.sap.getObject("sap-ushell-config.services.AppState.config", 0);
        oConfig.initialAppStates = oInitialAppStates;
        window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseResolve(oInitialAppStates);
        if (oDirectStart.targetMappings) {
            // we are in application direct start case
            aSegment = aDirectStartRequestSegment;
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseResolve(
                    [aSegment,
                    oDirectStart.targetMappings, oDirectStart.systemAliases]);
        }
        // note: there is no harm in never resolving this promise
    }

    /**
     * Processes the result of the Context dependent
     * configuration results (part of an explicit start_up call)
     * result processing will trigger resolution of the following two
     * promises
     *  a) AppState Service
     *        services.AppState.config.initialAppStatesPromise
     *        (initialAppStates : { "<key>" : "value as json"})
     *  b) ClientSideTargetResolutionAdapter abap
     *        services.ClientSideTargetResolution.adapter.config.initialSegmentPromise
     *        {[aSegments], oTargetMappings, oSystems);
     * @param {object} oResult
     *   the result as a JSON object
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    /**
     * Detect whether the browser can open WebGui applications natively.
     *
     * This is expected to happen from NWBC Version 6 onward.
     *
     * NWBC exposes a feature bit vector via the getNwbcFeatureBits method of
     * the private epcm object.  This is expected to be a
     * string in hex format representing 4 bits, where the least significant
     * bit represents native navigation capability. For example: "B" = 1011,
     * last bit is 1, therefore native navigation capability is enabled.
     *
     * NOTE: this implementation should be kept in sync with {@link
     * sap.ushell.utils#hasNativeNavigationCapability}. Note that in the
     * boottask implementation we are not allowed to use jQuery for logging, as
     * this is not loaded yet.
     *
     * @return {boolean}
     *     whether the browser can open SapGui applications natively
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function hasNativeNavigationCapability() {
        var sFeaturesHex = "0",
            oPrivateEpcm;

        // Try to get the Feature version number
        if (window.external && window.external && typeof window.external.getPrivateEpcm !== "undefined") {
            oPrivateEpcm = window.external.getPrivateEpcm();

            try {
                sFeaturesHex = oPrivateEpcm.getNwbcFeatureBits();
            } catch (e) {
                sap.ui2.srvc.log.error(
                    "failed to get feature bit vector via call getNwbcFeatureBits on private epcm object",
                    "sap.ushell_abap.bootstrap"
                );
            }
        }
        return (parseInt(sFeaturesHex, 16) & 1) > 0;
    }

    /**
     * Determine the shell type considering NWBC
     * Version 6.0+ client case.
     *
     * @return {string}
     *   the shell type ("NWBC" or "FLP"), based on whether NWBC v6.0+
     *   Client is detected.
     */
    sap.ushell_abap.getShellType = function() {
        return hasNativeNavigationCapability() ? "NWBC" : "FLP";
    };


    /**
     * Performs the start-up request.
     * @param {function(string)} fnSuccess
     *    success handler taking the result as JSON string
     * @param {function(string)} fnFailure
     *    failure handler taking an error message
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function requestStartup(fnSuccess, fnFailure) {
        var  oServerSideConfigStartup = window["sap-ushell-config"] && window["sap-ushell-config"].services
                && window["sap-ushell-config"].services.Container && window["sap-ushell-config"].services.Container.adapter
                && window["sap-ushell-config"].services.Container.adapter.config,
            mParameterMap = sap.ui2.srvc.getParameterMap(),
            sRequestUrl = "/sap/bc/ui2/start_up?";

        if (oServerSideConfigStartup) {
            fnSuccess(oServerSideConfigStartup);
            return;
        }
        /*
         * Copies the URL parameter with the given name from <code>mParameterMap</code> to
         * <code>sRequestUrl</code>.
         *
         * @param {string} sName
         *   URL parameter name
         * @private
         */
        function copyParameter(sName) {
            var sValue = mParameterMap[sName];
            if (sValue) {
                sRequestUrl += sName + "=" + encodeURIComponent(sValue[0]) + "&";
            }
        }

        copyParameter("sap-language");
        copyParameter("sap-client");
        sap.ui2.srvc.get(
            sRequestUrl + "shellType=" + sap.ushell_abap.getShellType() + "&depth=0",
            false, /*xml=*/
            function (sStartupCallResult) {
                var oStartupResult = JSON.parse(sStartupCallResult);

                window["sap-ushell-config"] = window["sap-ushell-config"] || {};
                window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
                window["sap-ushell-config"].services.Container = window["sap-ushell-config"].services.Container || {};
                window["sap-ushell-config"].services.Container.adapter = window["sap-ushell-config"].services.Container.adapter || {};
                window["sap-ushell-config"].services.Container.adapter.config = oStartupResult;
                fnSuccess(oStartupResult);
            },
            fnFailure
        );
    }

    /**
     * Performs an extra request to retreive a direct Start Request.
     * @param {function(string)} fnSuccess
     *    success handler taking the result as JSON string
     * @param {function(string)} fnFailure
     *    failure handler taking an error message
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function requestDirectStart(oStartupResult) {
        var sFormFactor = sap.ui2.srvc.getFormFactor(),
            sHash = getShellHash(),
            sFullHash = getFullShellHash(),
            mParameterMap = sap.ui2.srvc.getParameterMap(),
            sRequestUrl = "/sap/bc/ui2/start_up?",
            sCacheId = getCacheIdAsQueryParameter(oStartupResult);
        if (bNoOData) {
            return;
        }

        /*
         * Copies the URL parameter with the given name from <code>mParameterMap</code> to
         * <code>sRequestUrl</code> if within the relevant list.
         *
         * @param {string} sName
         *   URL parameter name
         * @private
         */
        function copyParameter(sName) {
            var sValue = mParameterMap[sName];
            if (sValue) {
                sRequestUrl += sName + "=" + encodeURIComponent(sValue[0]) + "&";
            }
        }


        /*
         * Determine whether sHash is a hash which loads the home page; in this case
         * some OData requests are triggered early for performance optimization
         *
         * @param {string} sName
         *   URL parameter name
         * @return {boolean}
         * @private
         */
        function isHomepageHash(sHash) {
            if (!sHash || sHash === "#") {
                return true;
            }
            return (sHash.indexOf("Shell-home") === 0)
                || (sHash.indexOf("Shell-catalog") === 0)
                || (sHash.indexOf("shell-catalog") === 0);
        }



        function addParam(oInitialKeys, sLeanHash, oRegex, sFullHash) {
            var oMatch = sFullHash.match(oRegex);
            var aSplit = [];
            if (!oMatch) {
                return sLeanHash;
            }
            sLeanHash +=  oMatch[2] + "&";
            aSplit = (oMatch[2]).toString().split("=");
            oInitialKeys[aSplit[0]] = aSplit[1];
            return sLeanHash;
        }

        if (!isHomepageHash(sHash)) {
            // suppress early OData calls for LaunchPage service in case of application start
         // TODO: this may be done somewhere else
            setApplicationColdStart(true);
        }
        window["sap-ushell-config"] = window["sap-ushell-config"] || {};
        window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution = window["sap-ushell-config"].services.ClientSideTargetResolution || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config || {};

        vDirectStartResponseOrFailMessage = undefined;
        aDirectStartRequestSegment = undefined;
        // we cannot use promises here yet(UI5 not loaded and no support for Promise on older IE variants), thus we use the following flow
        //
        // the segment goes here:
        //   scope variable: aDirectStartRequestSegment
        // a received result goes here:
        //   scope variable: vDirectStartResponseOrFailMessage
        //
        // a function to invoke when the request *may* be registered here ( this is the promise resolve/reject function) if needed
        // window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentResultFunction
        // window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentFailFunction
        //
        // the handler will *always* set vDirectStartResponseOrFailMessage, either to an object (ok) or to a string( failure).
        //
        // when creating the promises later, it will either directly resolve (if the result is already in), otherwise it will install
        // the functions above which then cause resolve/reject once the result is in.
        //

        var oInitialKeys = {};
        if (isDirectStart(sHash)) {
            var oMatch = sHash.match(rShellHash);
            var sSemanticObject = oMatch && oMatch[2];
            var sAction = oMatch && oMatch[3];
            aDirectStartRequestSegment = [{
                semanticObject: sSemanticObject,
                action: sAction
            }];
            sRequestUrl += "so=" + sSemanticObject + "&action=" + sAction + "&";
            sRequestUrl = addParam(oInitialKeys, sRequestUrl, /(\?|&)(sap-xapp-state=[A-Z0-9]+)/, sHash);
            sRequestUrl = addParam(oInitialKeys, sRequestUrl, /(\?|&)(sap-intent-param=[A-Z0-9]+)/, sHash);
            sRequestUrl = addParam(oInitialKeys, sRequestUrl, /(\?|&)(sap-system=[A-Z0-9]+)/, sHash);
            /* eslint-disable no-useless-escape */
            sRequestUrl = addParam(oInitialKeys, sRequestUrl, /(\?|&|[\/])(sap-iapp-state=[A-Z0-9]+)/, sFullHash);
            /* eslint-enable no-useless-escape */
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config._initialKeys = oInitialKeys;

            if (sFormFactor) {
                sRequestUrl += "formFactor=" + encodeURIComponent(sFormFactor) + "&";
            }

            copyParameter("sap-language");
            copyParameter("sap-client");
            addTime("RequestDirectStart");

            sRequestUrl += "shellType=" + sap.ushell_abap.getShellType() + "&depth=0" + sCacheId;

            sap.ui2.srvc.get(
                sRequestUrl  /* unused given the 5th argument */,
                false, /*xml=*/
                function (sDirectStartResult) {
                    addTime("ReceiveDirectStart");
                    vDirectStartResponseOrFailMessage = JSON.parse(sDirectStartResult);
                    if (window["sap-ushell-config"] &&
                        window["sap-ushell-config"].services &&
                        window["sap-ushell-config"].services.ClientSideTargetResolution &&
                        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter &&
                        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config &&
                        typeof window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentResultFunction === "function") {
                        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentResultFunction(vDirectStartResponseOrFailMessage);
                    }
                },
                function (sMessage) {
                    vDirectStartResponseOrFailMessage = "fail:" + sMessage;
                    if (window["sap-ushell-config"] &&
                        window["sap-ushell-config"].services &&
                        window["sap-ushell-config"].services.ClientSideTargetResolution &&
                        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter &&
                        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config &&
                        typeof window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentFailFunction === "function") {
                        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentFailFunction(sMessage);
                    }
                },
                addCommonHeadersToXHR(createAndOpenXHR(sRequestUrl), oStartupResult)  // XMLHttpRequest + headers
            );
        }
    }

    /**
     * once UI5 is loaded, create ES6 Promises reflecting the resolution state
     * Depending on whether the response is already available in vDirectStartResponseOrFailMessage
     * we either
     * @param {function(string)} fnSuccess
     *    success handler taking the result as JSON string
     * @param {function(string)} fnFailure
     *    failure handler taking an error message
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createDirectStartPromises() {

        function fnFailure(sReason) {
            // reject the two promises
            window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseReject(sReason);
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseReject(sReason);
        }

        var fnInitialAppStatePromiseResolve;
        var fnInitialAppStatePromiseReject;
        window["sap-ushell-config"] = window["sap-ushell-config"] || {};
        window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};

        window["sap-ushell-config"].services.AppState = window["sap-ushell-config"].services.AppState || {};
        window["sap-ushell-config"].services.AppState.config = window["sap-ushell-config"].services.AppState.config || {};
        window["sap-ushell-config"].services.AppState.config = window["sap-ushell-config"].services.AppState.config || {};

        window["sap-ushell-config"].services.AppState.config.initialAppStatesPromise = new Promise(function(resolve,reject) {
            fnInitialAppStatePromiseResolve = resolve;
            fnInitialAppStatePromiseReject = reject;
        });
        window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseReject = fnInitialAppStatePromiseReject;
        window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseResolve = fnInitialAppStatePromiseResolve;

        window["sap-ushell-config"].services.ClientSideTargetResolution = window["sap-ushell-config"].services.ClientSideTargetResolution || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config || {};


        var fnInitialSegmentPromiseResolve;
        var fnInitialSegmentPromiseReject;
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromise = new Promise(function(resolve, reject) {
            fnInitialSegmentPromiseResolve = resolve;
            fnInitialSegmentPromiseReject = reject;
        });

        // missing catch handler leads to weird exception on rejection
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromise.catch(function(sMsg) {
            /*silently ignore*/
        });
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseReject = fnInitialSegmentPromiseReject;
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseResolve = fnInitialSegmentPromiseResolve;
        if (aDirectStartRequestSegment) {
            // implies a request was already issued with this segment
            if (typeof vDirectStartResponseOrFailMessage === "string") {
                fnFailure(vDirectStartResponseOrFailMessage);
            } else {
                /* eslint-disable no-lonely-if */
                if (vDirectStartResponseOrFailMessage) {
                    // we can directly resolve now, the response was already returned
                    processDirectStart(vDirectStartResponseOrFailMessage);
                } else {
                    // request is still in progress, the callback below will be called once response comes back
                    window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentResultFunction = function(vDirectStartResponseOrFailMessage) {
                           processDirectStart(vDirectStartResponseOrFailMessage);
                    };
                    window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentFailFunction = fnFailure;
                }
                /* eslint-enable no-lonely-if */
            }
        } else {
            window["sap-ushell-config"].services.AppState.config.initialAppStatesPromiseResolve({});

            /* null -> initialSegmentPromiseResolve not needed any longer */
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.initialSegmentPromiseResolve(null);
        }

    }

    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createCompactTMPromises() {
        if (bNoOData || !bRequestedCompactTM) {
            return;
        }
        window["sap-ushell-config"] = window["sap-ushell-config"] || {};
        window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
        function fnFailure(sMsg) {
            // reject the two promises
            window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromiseReject(sMsg);
        }
        window["sap-ushell-config"].services.LaunchPage = window["sap-ushell-config"].services.LaunchPage || {};
        window["sap-ushell-config"].services.LaunchPage.adapter = window["sap-ushell-config"].services.LaunchPage.adapter || {};
        window["sap-ushell-config"].services.LaunchPage.adapter.config = window["sap-ushell-config"].services.LaunchPage.adapter.config || {};

        var fnResolve;
        var fnReject;
        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromise = new Promise(function(resolve, reject) {
            fnResolve = resolve;
            fnReject = reject;
        });
        // missing catch handler leads to weird exception on rejection
        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromise.catch(function(sMsg) {
            jQuery.sap.log.error("compactTMPromise rejected" + sMsg);
        });
        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromiseReject = fnReject;
        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMPromiseResolve = fnResolve;

        function processCompactTM(oResult) {
            var config = window["sap-ushell-config"].services.LaunchPage.adapter.config;
            if (oResult.targetMappings) {
                config.compactTMPromiseResolve(
                        oResult.targetMappings);
                return;
            }
            config.compactTMPromiseResolve({});
        }

        var oResult = oCompactTMResult;
        if (typeof oResult === "string") {
           fnFailure(oResult);
        } else if (oResult) {
            // we can directly resolve now, the request was already returned.
            processCompactTM(oResult);
        } else {
            window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMResultFunction = function(oFullResult) {
                processCompactTM(oCompactTMResult);
            };
           window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMFailFunction = fnFailure;
        }
    }
    /**
     * Once UI5 is loaded, create ES6 Promises reflecting the resolution state
     * Depending on whether the response is already available in oFullTMResult
     * we either process it or create the promises
     * if bNoOData is set, this is a noop
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createFullTMPromises() {
        if (bNoOData) {
            return;
        }
        window["sap-ushell-config"] = window["sap-ushell-config"] || {};
        window["sap-ushell-config"].services = window["sap-ushell-config"].services || {};
        function fnFailure(sMsg) {
            // reject the two promises
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromiseReject(sMsg);
        }
        window["sap-ushell-config"].services.ClientSideTargetResolution = window["sap-ushell-config"].services.ClientSideTargetResolution || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter || {};
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config || {};

        var fnResolve;
        var fnReject;
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromise = new Promise(function(resolve, reject) {
            fnResolve = resolve;
            fnReject = reject;
        });
        // missing catch handler leads to weird exception on rejection
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromise.catch(function(sMsg) {
            jQuery.sap.log.error("navTargetDataPromise rejected: " + sMsg);
        });

        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromiseReject = fnReject;
        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.navTargetDataPromiseResolve = fnResolve;

        function processFullTM(oResult) {
            var config = window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config;

            if (oResult.client) {  // double check we get the correct response
                                   // TODO: move this to integration test perhaps
                config.navTargetDataPromiseReject("A start up response was returned in a target mappings request.");
                return;
            }

            if (oResult) {
                config.navTargetDataPromiseResolve(oResult);
                return;
            }
            config.navTargetDataPromiseResolve({});
        }

        var oResult = oFullTMResult;
        if (typeof oResult === "string") {
           fnFailure(oResult);
        } else if (oResult) {
            // we can directly resolve now, the request was already returned.
            processFullTM(oResult);
        } else {
            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMResultFunction = function(oFullResult) {
                 processFullTM(oFullResult);
            };
           window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMFailFunction = fnFailure;
        }
    }
    /**
     * Validates the given URL.
     *
     * The validation consists of two steps.
     *
     * 1. name validation, in which it is checked that the url is
     *    slash-separated, the filename is composed of an ASCII subset (i.e.,
     *    letters, numbers and underscore), and ending with a .json extension.
     *
     * 2. whitelisting, in which the URL prefix is searched in a whitelist
     * hardcoded in
     * <code>window["sap-ushell-config"].launchpadConfiguration.configurationFile.configurationFileFolderWhitelist</code>.
     *
     * NOTE: a falsy mWhitelist parameter causes this method to return an error message.
     *
     * @param {string} sUrl
     *   The url to validate
     * @param {object} mWhitelist
     *   A whitelist, mapping a url prefix to a boolean value that indicates
     *   whether a URL starting with that prefix should be allowed.
     * @return {string|undefined}
     *   The error message encountered during validation, or undefined if the url is valid.
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function fnValidateUrl(sUrl, mWhitelist) {
        // Check for allowed characters in the json file name
        var aRequestUrlComponents = /^((.*)\/)?[A-Za-z0-9_]+\.json$/.exec(sUrl),
            sRequestUrlPrefix;

        if (!aRequestUrlComponents) {
            return "name of configuration URL is not valid. Url is:\"" + sUrl + "\"";
        }

        sRequestUrlPrefix = typeof aRequestUrlComponents[1] === "undefined" ? "" : aRequestUrlComponents[1];

        if ( !mWhitelist ||
             !mWhitelist.hasOwnProperty(sRequestUrlPrefix) ||
             !mWhitelist[sRequestUrlPrefix]) {

            return "URL for config file does not match restrictions. Url is:\"" + sUrl + "\"";
        }

        return undefined;
    }

    /**
     * Returns an array of valid configuration URLs. These URLs must point to a
     * JSON configuration file, and can be specified in three possible ways:
     *
     * 1. as an array, in window["sap-ushell-config"].launchpadConfiguration.configurationFile,
     * 2. as a string, in window["sap-ushell-config"].launchpadConfiguration.configurationFile,
     * 3. as a string via the sap-ushell-config-url URL parameter
     *
     * Precedence:
     *
     * Case 1 excludes case 2, i.e., the hardcoded url is ignored
     * Case 2 excludes case 3, i.e., the url parameter is ignored
     *
     * NOTE: if cases 3 and 1 occur at the same time, the url parameter is not
     * ignored, and will be returned as the last URL in the result array.
     *
     * Whitelist:
     *
     * For security reasons, in the cases #2 and #3 specified above, URL names
     * are validated (see fnValidateUrl). Validation is skipped in case #1.
     *
     * NOTE: an error is logged when duplicate URLs are found in the
     *       configuration array, but these duplicates are returned anyway.
     *
     * NOTE: this method always returns an array (empty when no valid URLs were found).
     *
     * @returns {array} an array of valid URLs.
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getServerConfigUrls() {

        var oConfig = window["sap-ushell-config"] &&
                window["sap-ushell-config"].launchpadConfiguration &&
                window["sap-ushell-config"].launchpadConfiguration.configurationFile,

            // can be string (hardcoded) OR array (coming from the server)
            vHardcodedUrlOrServerSideUrls = oConfig && oConfig["sap-ushell-config-url"],
            sHardcodedUrlOrParameterUrl,
            sValidationFailReason,
            aRequestUrls = [],
            mUrlCounts = {},
            aDuplicateUrls = [],
            oWhitelist;

        if (Object.prototype.toString.call(vHardcodedUrlOrServerSideUrls) === "[object Array]") {

            // i.e., parameter comes from the server
            Array.prototype.push.apply(aRequestUrls, vHardcodedUrlOrServerSideUrls);
        } else if (typeof vHardcodedUrlOrServerSideUrls === "string") {

            // i.e., parameter was hardcoded
            sHardcodedUrlOrParameterUrl = vHardcodedUrlOrServerSideUrls;
        }

        // try url parameter if no hardcoded url
        sHardcodedUrlOrParameterUrl = sHardcodedUrlOrParameterUrl || (
            sap.ui2.srvc.getParameterMap()["sap-ushell-config-url"] && sap.ui2.srvc.getParameterMap()["sap-ushell-config-url"][0]
        );

        if (typeof sHardcodedUrlOrParameterUrl !== "undefined") {
            // NOTE: url parameter is last in array

            oWhitelist = oConfig &&
                Object.prototype.toString.apply(oConfig) === "[object Object]" &&
                oConfig.hasOwnProperty("configurationFileFolderWhitelist") &&
                Object.prototype.toString.apply(oConfig.configurationFileFolderWhitelist) === "[object Object]" &&
                oConfig.configurationFileFolderWhitelist;

            sValidationFailReason = fnValidateUrl(sHardcodedUrlOrParameterUrl, oWhitelist);
            if (typeof sValidationFailReason !== "undefined") {
                sap.ui2.srvc.log.error(sValidationFailReason, null, "sap.ushell_abap.bootstrap");
            } else {
                aRequestUrls.push(sHardcodedUrlOrParameterUrl);
            }
        }

        // check for duplicates and log error in case
        aRequestUrls.forEach(function (sUrl) {
            if (!mUrlCounts.hasOwnProperty(sUrl)) {
                mUrlCounts[sUrl] = 0;
            }
            mUrlCounts[sUrl]++;
            if (mUrlCounts[sUrl] === 2) {
                aDuplicateUrls.push(sUrl);
            }
        });
        if (aDuplicateUrls.length > 0) {
            sap.ui2.srvc.log.error([
                "Duplicate Urls found in server configuration:", aDuplicateUrls.join(", ")
            ].join(" "), null, "sap.ushell_abap.bootstrap");
        }

        return aRequestUrls;
    }

    /**
     * Returns all the meta tags of the current html document
     *
     * @returns {array} an array of meta tag DOM elements.
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getMetaTags() {
        var aMetaTags = window.document.getElementsByTagName("meta");

        if (aMetaTags === undefined) {
            aMetaTags = [];
        }

        return aMetaTags;
    }

    /**
     * Returns the configuration defined in corresponding meta tags of the current html document
     *
     * @returns {array} an array of parsed configuration objects retrieved from meta tag DOM elements related to Configuration.
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getConfigurationFromMetaTags() {
        var aMetaTags = getMetaTags(),
            sNameAttribute,
            sContentAttribute,
            oConfigObject,
            length = aMetaTags.length,
            aConfigObjects = [];

         for (var i = 0; i < length ; i++) {
             sNameAttribute = aMetaTags[i].getAttribute("name");
             sContentAttribute = aMetaTags[i].getAttribute("content");

             if ((typeof sNameAttribute === "string") && sNameAttribute.startsWith("sap.ushellConfig")) {
                 if (sContentAttribute) {
                     try {
                         oConfigObject = JSON.parse(sContentAttribute);
                         aConfigObjects.push(oConfigObject);
                     } catch (e) {
                         sap.ui2.srvc.log.error("Failed to parse configuration object from meta tag '"
                             + sNameAttribute + "', content: '" + sContentAttribute + "'",
                             e, "sap.ushell_abap.bootstrap");
                     }
                 }
             }
         }

        return aConfigObjects;
    }

    /**
     * Requests and parses the configuration associated to one or more server
     * configuration URLs asynchronously (see getServerConfigUrls method). The
     * success handler is called after ALL the content is retrieved and parsed
     * successfully. The fail handler is called once, if any of the contents
     * could not be retrieved or parsed.
     *
     * @param {function(Array)} fnSuccess
     *    success handler taking the result as JSON Array of objects (the
     *    parsed responses associated to the urls)
     * @param {function(string)} fnFailure
     *    failure handler taking an error message
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function requestServerConfig(fnSuccess, fnFailure) {
        var that = this,
            aConfigUrls = getServerConfigUrls(),
            aResultContents = [],
            iSuccessCount = 0,
            bFailureCalled = false;

        /*
         * A wrapper around the original failure handler. It ensures the
         * failure handler is called only once.
         */
        function fnFailureWrapper() {
            if (!bFailureCalled) {
                fnFailure.apply(that, arguments);
                bFailureCalled = true;
            }
        }

        /*
         * One success handler, called each time a response text is retrived
         * successfully.
         */
        function fnGetSuccess (iPosition, sUrl, sResponseText) {
            var oParsedResponse;
            try {
                oParsedResponse = JSON.parse(sResponseText);
            } catch (e) {
                fnFailureWrapper(["parse error in server config file", "'" + sUrl + "'",
                    "with content:", "'" + sResponseText + "'"].join(" "));
                return;
            }

            aResultContents[iPosition] = oParsedResponse;

            iSuccessCount++;
            if (iSuccessCount === aConfigUrls.length) {
                // ALL results were correctly obtained and parsed
                sap.ui2.srvc.call(fnSuccess.bind(null, aResultContents),
                    fnFailureWrapper);
            }
        }

        // return immediately if there are no urls
        if (aConfigUrls.length === 0) {
            sap.ui2.srvc.call(fnSuccess.bind(null, aResultContents), fnFailureWrapper);
            return;
        }

        aConfigUrls.forEach(function (sUrl, iIdx) {
            if (bFailureCalled) {
                return;
            }
            // partial binding: the response text will be the 3rd parameter of
            // fnBoundSuccessHandler if called with one parameter inside
            // sap.ui2.srvc.get
            var fnBoundSuccessHandler = fnGetSuccess.bind(null, iIdx, sUrl);

            // note: asynchronous get
            sap.ui2.srvc.get(sUrl, /*xml=*/false, fnBoundSuccessHandler,
                fnFailureWrapper);
        });
    }

    /**
     * Creates the Deferred in the OData.read cache to keep the result of the request with the
     * given URL.
     * @param {string} sUrl
     * @returns {jQuery.Deferred}
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createODataDeferred(sUrl) {
        if (bNoOData) {
            return undefined;
        }

        var oDeferred = new jQuery.Deferred();

        jQuery.sap.require("sap.ui.thirdparty.datajs");
        OData.read.$cache = OData.read.$cache || new sap.ui2.srvc.Map();
        OData.read.$cache.put(sUrl, oDeferred.promise());
        return oDeferred;
    }

    /**
     * Processes the OData response.
     * @param {jQuery.Deferred} oDeferred
     *     the deferred object updating the cache in OData.read
     * @param {number} iStatus
     *     the status code
     * @param {string} sCsrfToken
     *    the CSRF token
     * @param {string} sResponse
     *    the response message
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function processOData(oDeferred, iStatus, sCsrfToken, sResponse) {
        if (iStatus === 200) {
            oDeferred.resolve(JSON.parse(sResponse).d, sCsrfToken);
        } else {
            // rejecting the deferred will make the request later (in the ushell adapter) fail, so
            // the error handling there takes effect
            oDeferred.reject(sResponse);
        }
    }

    /**
     * Performs an OData GET request using a plain XHR.
     * @param {function(number, object, function)}
     *    callback function to be called when the request finished, taking the status code, the
     *    CSRF token and the response message
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function requestOData(sUrl, oStartupResult, fnCallback) {
        var oXHR;

        if (bNoOData) {
            return;
        }

        oXHR = createAndOpenXHR(sUrl);

        oXHR.setRequestHeader("X-CSRF-Token", "fetch");

        addCommonHeadersToXHR(oXHR, oStartupResult);

        // set sap-statistics header, see
        // http://help.sap.com/saphelp_nw74/helpdata/de/40/93b81292194d6a926e105c10d5048d/content.htm
        if (bSapStatistics) {
            oXHR.setRequestHeader("sap-statistics", "true");
        }

        oXHR.onreadystatechange = function () {
            if (this.readyState !== /*DONE*/4) {
                return; // not yet DONE
            }
            fnCallback(oXHR.status, oXHR.getResponseHeader("x-csrf-token"), oXHR.responseText);
        };
        oXHR.send();
    }

    // ---------------------------------------------

    /**
     * We expose a factory method for the tests and allow to pass a test double for the window object
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createXhrLogonEventHandler(oWindow, sXhrLogonMode) {
        return new XhrLogonEventHandler(oWindow, sXhrLogonMode);
    }

    /**
     * Helper class for handling events from XHR logon frame provider
     *
     * @private
     */
    function XhrLogonEventHandler(oWindow, sXhrLogonMode) {
        this._oWindow = oWindow || window;
        this._sXhrLogonMode = sXhrLogonMode;
    }

    XhrLogonEventHandler.prototype.handleEvent = function(oEvent) {
        if (oEvent.type === "windowfailed") {
            this._showErrorAndReload(
                { key: "bootstrap.xhr.authenticationRequired", text: "Authentication required"},
                { key: "bootstrap.xhr.windowOpenFailed", text: "Logon window cannot be opened - ensure pop-up windows are not blocked."},
                this._reloadPage,
                this._handleWindowFailedNoUi5.bind(this)
            );
        } else if (oEvent.type === "authenticationrequired") {
            if (this._sXhrLogonMode === "logoffAndRedirect") {
                this._showErrorAndReload(
                    { key: "bootstrap.xhr.authenticationRequired", text: "Authentication required"},
                    { key: "bootstrap.xhr.sessionExpired", text: "Your session has expired. Press OK to reload."},
                    this._logoffAndRedirect,
                    this._handleAuthenticationRequiredNoUi5.bind(this)
                );
            } else { // reload is default
                this._showErrorAndReload(
                    { key: "bootstrap.xhr.authenticationRequired", text: "Authentication required"},
                    { key: "bootstrap.xhr.sessionExpired", text: "Your session has expired. Press OK to reload."},
                    this._reloadPage,
                    this._handleAuthenticationRequiredNoUi5.bind(this)
                );
            }
        } else {
            sap.ui2.srvc.log.error("Cannot handle event with unknown type: " + oEvent.type,
                null, "sap.ushell_abap.bootstrap.XhrLogonEventHandler");
        }
    };

    /**
     * Returns a modified location search string for reloading the Fiori launchpad,
     * i.e. the result of this method can be assigned to <code>window.location.search</code>
     * for triggering a page reload. Modifying the search part of the URL by
     * adding the query parameter &quot;sap-ushell-reloaded&quot; ensures that the
     * reload is always triggering a GET request. This is important because with SAML
     * logon, window.location.reload() would trigger a POST request with an outdated
     * SAML assertion; the ABAP server does not a redirect to the IDP login page in
     * that case.
     *
     * @param {string} sCurrentLocationSearch - current location search string
     * @return {string} an updated location search string triggering a page reload
     * @private
     */
    XhrLogonEventHandler.prototype._getUpdatedLocationSearchForReload = function(sCurrentLocationSearch) {
        var iReloadParamVal = Date.now(),
            rReloadedPattern = new RegExp(["(.*)([?&])", S_RELOAD_QUERY_PARAM, "(=[^&]*)?(.*)"].join("")),
            sResult,
            bMatched = false;

        // input must be a string, but could be empty
        if (typeof sCurrentLocationSearch !== "string" ) {
            throw new Error("Illegal argument: sCurrentLocationSearch must be a string");
        }

        // split into groups prefix, operand, current value and rest and replace the value if present
        sResult = sCurrentLocationSearch.replace(rReloadedPattern, function(sMatch, sPrefix, sOperand, sValueWithEquals, sRest) {
            bMatched = true;
            return [sPrefix, sOperand, S_RELOAD_QUERY_PARAM, "=", iReloadParamVal, sRest].join("");
        });

        if (!bMatched) {
            if (sCurrentLocationSearch) {
                // append if there is already a search string
                sResult = [sCurrentLocationSearch, "&", S_RELOAD_QUERY_PARAM, "=", iReloadParamVal].join("");
            } else {
                // no query yet
                sResult = ["?", S_RELOAD_QUERY_PARAM, "=", iReloadParamVal].join("");
            }
        }

        return sResult;
    };

    /**
     * Reloads the current browser page
     *
     * @private
     */
    XhrLogonEventHandler.prototype._reloadPage = function() {
        var that = this;

        that._oWindow.setTimeout( function () {
            /*
            When SAP Fiori launchpad is configured to use "reload" mode for xhrLogon,
            we reload the FLP page after a session timeout. In case of SAML, this
            seems to be re-triggering a POST request with the form data that
            was obtained from the initial logon.
            The code above now forces a GET request with an additional query
            parameter (a timestamp indicating the Fiori launchpad was reloaded).
            */
            that._oWindow.location.search = that._getUpdatedLocationSearchForReload(that._oWindow.location.search);
        }, 0);
    };

    /**
     * Logs off from the FES and triggers a relogon that also ensures that relogon at all secondary systems is done.
     * We set the redirect to the current FLP URL so that we get a new logon triggered.
     *
     * @private
     */
    XhrLogonEventHandler.prototype._logoffAndRedirect = function() {
        var sLocationHref = getLocationHref(),
            sUrl;

        sUrl = new URI("/sap/public/bc/icf/logoff")
            .absoluteTo(sLocationHref)
            .search("sap-client="+ oStartupResult.client +"&propagateLogoff=false&redirectURL=" + encodeURIComponent(sLocationHref))
            .toString();
        document.location = sUrl;
    };

    /**
     * Checks if the page is currently being reloaded by the XHR logon which triggers
     * this by setting query-parameter sap-ushell-reloaded
     *
     * @private
     */
    XhrLogonEventHandler.prototype._isPageReloaded = function() {
        return new RegExp(["[?&]", S_RELOAD_QUERY_PARAM].join("")).test(this._oWindow.location.search);
    };

    /**
     * Handler for the window open failed event of the AuxWindowFrameProvider for XHR logon without SAPUI5
     * <p>
     * This handler is called if the &quot;window&quot; mode is used for XHR logon and the window
     * could not be opened, e.g. if pop-up blocker has prevented it.
     * <p>
     * This function is used during the early start-up phase when the sapui5 runtime is not yet
     * available (XHR logon for start_up request). This should be active only in rare cases, because
     * the authentication is usually done for the HTML page itself, but if this is not done
     * for some reason (e.g. the main page is cached), this simple alert is used as fallback.
     *
     * @private
     */
    XhrLogonEventHandler.prototype._handleWindowFailedNoUi5 = function() {

        // no translation in fallback case
        var sMessage = "Authentication required\n\nLogon window cannot be opened - ensure pop-ups are not blocked.";

        /*eslint-disable*/
        this._oWindow.alert(sMessage);
        /*eslint-enable*/

        this._reloadPage();
    };

    XhrLogonEventHandler.prototype._handleAuthenticationRequiredNoUi5 = function (fnReload) {
        // in reload mode, this should not happen (can only occur in very early XHR requests, i.e. start_up). But then the session should
        // still be valid. So if we get in here, the HTML page itself has been cached or for some reason the server served it, but
        // rejected the subsequent start_up or pageSets request
        // we render a plain alert popup and try to reload the page once in this case; if the page is already reloaded (we trigger the
        // reload be setting the query parameter 'sap-ushell-reloaded'), we give up with an error message to avoid an endless loop

        if (!this._isPageReloaded()) {
            // not in reload case, try reload once
            // no translation in fallback case
            sap.ui2.srvc.log.error("Illegal state: XHR authentication (mode=reload) requested before SAPUI5 is initialized. This should not happen if the"
                + " FioriLaunchpad.html page is loaded from the server. Trying to reload page once.",
                null, "sap.ushell_abap.bootstrap.XhrLogonEventHandler");

            var sMessage = "Authentication required\n\nYour session might have expired. Press OK to reload.";

            /*eslint-disable*/
            this._oWindow.alert(sMessage);
            /*eslint-enable*/

            fnReload.call(this);
        } else {
            // reload already triggered at least once, giving up
            sap.ui2.srvc.log.error("Illegal state: XHR authentication (mode=reload) requested before SAPUI5 is initialized and page reload has been triggered once."
                + " Stopping reload to avoid endless loop. This state cannot be overcome. Please ensure that the FioriLaunchpad.html"
                + " page is not cached, but always loaded from the server.",
                null, "sap.ushell_abap.bootstrap.XhrLogonEventHandler");
        }
    };

    /**
     * Helper method showing an error dialog and reloading the page afterwards.
     *
     * @param {object} oTitleText text key and default text for the dialog title
     * @param {object} oMessageText text key and default text for the dialog message
     * @Param {function} fnReload function that is executed to do the actual reload
     * @param {function} fnFallbackIfUi5NotLoaded a fallback function which is executed if UI5 not yet loaded
     */
    XhrLogonEventHandler.prototype._showErrorAndReload = function (oTitleText, oMessageText, fnReload, fnFallbackIfUi5NotLoaded) {

        var sTitle,
            sMessage;

        // We have to avoid that the modules are loaded by an additional XHR request here,
        // because this would block the synchronous call as we are in the middle of the
        // logon process. Therefore, we first check if the modules are already declared; we
        // set the preload flag to true, because this means that a subsequent require
        // call does not perform a server round trip; this is also the reason why we hard-code
        // the sap.m.MessageBox here - using the Message service would be the better way, but
        // this might trigger module loading as well
        // normally, the 2 required modules should be part of the fiori-lib preload package,
        // so the fallback should not occur under normal circumstances
        if (sap && sap.ui && (typeof sap.ui.getCore === "function")
            && sap.ui.getCore().isInitialized() && jQuery.sap.isDeclared("sap.m.MessageBox", true)) {
            jQuery.sap.require("sap.m.MessageBox");
            if (jQuery.sap.isDeclared("sap.ushell.resources", true)) {
                jQuery.sap.require("sap.ushell.resources");
                sTitle = this._getText(oTitleText);
                sMessage = this._getText(oMessageText);
            }

            // Overwrite sap.ui.core.BusyIndicator.show to not open a busy indicator.
            // In case the MessageBox (to show the error message and to offer the
            // end user to reload the FLP) gets shown, we want to make sure that
            // no busy indicator is layered above which would not allow the end user
            // to react on this message box control. Therefore we overwrite the 'show'
            // method of the sap.ui.core.BusyIndicator class with an empty implementation body.
            // In case someone triggered a 'show' call of the busy indicator with a delay,
            // we need to stop that with a respective 'hide' call. As the FLP gets reloaded
            // afterwards, we do not need to apply the old logic of 'show' again.
            if (jQuery.sap.isDeclared("sap.ui.core.BusyIndicator", true)) {
                jQuery.sap.require("sap.ui.core.BusyIndicator");
                if (typeof sap.ui.core.BusyIndicator.show === "function" &&
                        typeof sap.ui.core.BusyIndicator.hide === "function") {
                    sap.ui.core.BusyIndicator.hide();
                    sap.ui.core.BusyIndicator.show = function () {};
                }
            }

            if (sap && sap.ca && sap.ca.ui && sap.ca.ui.utils && sap.ca.ui.utils.busydialog) {
                // workaround to avoid that clicking on the reload popup is blocked by a busy
                // dialog from sap.ca; this is not a general solution
               if (typeof sap.ca.ui.utils.busydialog.releaseBusyDialog === "function") {
                       for (var i = 0; i < 200; ++i) {
                           sap.ca.ui.utils.busydialog.releaseBusyDialog();
                       }
               }
            }

            sap.m.MessageBox.show(sMessage, {
                icon: sap.m.MessageBox.Icon.ERROR,
                title: sTitle,
                actions: [sap.m.MessageBox.Action.OK],
                onClose: fnReload.bind(this)
            });
        } else {
            // execute fallback function
            fnFallbackIfUi5NotLoaded.call(this, fnReload);
       }
    };

    /**
     * Helper method to get a translated text with fallback to a hard-coded one.
     *
     * @param {object} oText text key and default text
     * @return {string} the translated text if the key exists or the provided fallback text
     */
    XhrLogonEventHandler.prototype._getText = function (oText) {
        var sText = sap.ushell.resources.i18n.getText(oText.key);

        // ui5 resource bundle returns the text key if no text defined
        // we need the fallback, because translations might be missing in lower releases
        if (sText && (sText !== oText.key)) {
            return sText;
        } else {
            return oText.text;
        }
    };
    // ---------------------------------------------  helper class for handling events from XHR logon frame provider
    /**
     * Factory method for the AuxWindowFrameProvider for XHR logon
     * <p>
     * Needed to be able to stub it in qunit test.
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createAuxWindowFrameProvider() {
        return new AuxWindowFrameProvider();
    }

    /**
     * Factory method for the DefaultFrameProvider for XHR logon
     * <p>
     * Needed to be able to stub it in qunit test.
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createDefaultLogonFrameProvider() {
        return new DefaultLogonFrameProvider();
    }

    /**
     * Initializes XHR logon manager based on a given configuration.
     * <p>
     *
     * @param {object} oConfig
     *     the configuration
     * @param {object} oLocalFrameLogonManager
     *     the logon frame manager instance to use
     * @param {string} sPreviousXhrLogonMode
     *     the previously set XHR logon mode
     * @param {boolean} bFinalIfNonDefaultMode
     *     a flag indicating wether the setting should be final (second call); only for non-default modes
     * @return
     *     the XHR logon mode which was set
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function initXhrLogon(oConfig, oLocalFrameLogonManager, sPreviousXhrLogonMode, bFinalIfNonDefaultMode) {
        var sLocalXhrLogonMode = getUrlParameterValue("sap-ushell-xhrLogon-mode") || oConfig && oConfig.xhrLogon && oConfig.xhrLogon.mode || "frame",
            oXhrLogonEventHandler = createXhrLogonEventHandler(window, sLocalXhrLogonMode), // TODO: check if setting window here breaks the tests. If yes handover undefined.
            oFrameProvider;

        function setLogonFrameProvider() {

            if (sLocalXhrLogonMode === "frame") {
                oFrameProvider = createDefaultLogonFrameProvider();
            } else if (sLocalXhrLogonMode === "window") {
                oFrameProvider = createAuxWindowFrameProvider();
                oFrameProvider.addEventListener("windowfailed", oXhrLogonEventHandler);
            } else if (sLocalXhrLogonMode === "reload") {
                oFrameProvider = createDefaultLogonFrameProvider();
                oFrameProvider.addEventListener("authenticationrequired", oXhrLogonEventHandler);
            } else if (sLocalXhrLogonMode === "logoffAndRedirect") {
                oFrameProvider = createDefaultLogonFrameProvider();
                oFrameProvider.addEventListener("authenticationrequired", oXhrLogonEventHandler);
            } else {
                sap.ui2.srvc.log.warning("Unknown setting for xhrLogonMode: '" + sLocalXhrLogonMode + "'. Using default mode 'frame'.",
                        null, "sap.ushell_abap.bootstrap");
            }

            if (oFrameProvider && typeof oLocalFrameLogonManager.setLogonFrameProvider === "function") {
                // non-default XHR logon mode: set window frame provider with final=true to prevent overriding by renderer
                oLocalFrameLogonManager.setLogonFrameProvider(oFrameProvider);
            }
        }

        if (sPreviousXhrLogonMode !== sLocalXhrLogonMode) {
            // only override if changed - for first call, it should be undefined
            setLogonFrameProvider();
        }

        // set final if specified and not default (for frame mode,
        // the shell renderer can provide a better implementation, all other modes are always managed by us)
        if (bFinalIfNonDefaultMode && sLocalXhrLogonMode !== "frame") {
            oLocalFrameLogonManager.setLogonFrameProviderFinal(true);
        }

        return sLocalXhrLogonMode;
    }

    /**
     * Initializes the ignore list of the XHR logon manager.
     * <p>
     * If the UI5 resources (including the own bootstrap script) are loaded from an absolute URL
     * (in case CDN is activated),
     * this URL is added to the ignore list to prevent CORS preflight requests due to the X headers.
     * We expect that all resources can be loaded without authentication in this case.
     *
     * @param {string} sUi5ResourceRootUrl
     *     the root URL for loading SAPUI5 resources
     * @param {object} oLocalFrameLogonManager
     *     the logon frame manager instance to use
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function initXhrLogonIgnoreList(sUi5ResourceRootUrl, oLocalFrameLogonManager) {
        var oLocalLogonManager = oLocalFrameLogonManager.logonManager,
            sOrigin = getLocationOrigin();

        // add "/" to origin, as otherwise the following use case will match:
        //      sUi5ResourceRootUrl: http://sap.com:123
        //      sOrigin:             http://sap.com
        if (sUi5ResourceRootUrl && sUi5ResourceRootUrl.indexOf(sOrigin + "/") === -1) {
            // In case UI5 is loaded from a different domain (CDN / AKAMAI), that URL
            // needs to be ignored for the XHR logon, as we expect that the resources
            // are not protected.
            if (!oLocalLogonManager.ignore) {
                oLocalLogonManager.createIgnoreList();
            }
            oLocalLogonManager.ignore.add(sUi5ResourceRootUrl);
        }
    }

    /**
     * Creates an ECMA6 Promise which resolves after the shell renderer has been created. This
     * is necessary to delay the component creation in direct start case, so that the shell renderer
     * had time to initialize (e.g. init shell navigation service).
     *
     * This method must only be called after the shell bootstrap!
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createWaitForRendererCreatedPromise() {
        var oPromise = new Promise(function(resolve, reject) {
            var oRenderer,
                fnOnRendererCreated;

            fnOnRendererCreated = function() {
                sap.ui2.srvc.log.info("Direct application start: resolving component waitFor promise after shell renderer created event fired.");
                resolve();
                sap.ushell.Container.detachRendererCreatedEvent(fnOnRendererCreated);
            };
            oRenderer = sap.ushell.Container.getRenderer();
            if (oRenderer) {
                // unlikely to happen, but be robust
                sap.ui2.srvc.log.info("Direct application start: resolving component waitFor promise immediately (shell renderer already created).");
                resolve();
            } else {
                sap.ushell.Container.attachRendererCreatedEvent(fnOnRendererCreated);
            }
        });

        return oPromise;
    }

    /**
     * Performs the actual bootstrap when the start-up request is finished and SAPUI5 has started
     * the boot task.
     * @param {string} sStartupCallResult
     *     the result of the start-up service
     * @param {object} aServerConfig
     *     the result of the server config request
     * @param {function} fnCallback
     *     the callback function of the SAPUI5 boot task
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function bootstrap(oStartupCallResult, aServerConfig, fnCallback) {
        var sShellHash = getShellHash(),
            aMetaTagConfig = getConfigurationFromMetaTags();

        // Note: processStartup creates window["sap-ushell-config"]
        processStartup(oStartupCallResult);

        aMetaTagConfig.forEach(function (oMetaTagConfig) {
            mergeConfig(window["sap-ushell-config"], oMetaTagConfig, true);
        });

        aServerConfig.forEach(function (oServerConfig) {
            mergeConfig(window["sap-ushell-config"], oServerConfig, true);
        });
        // creates the promises
        createDirectStartPromises();
        createFullTMPromises();
        createCompactTMPromises();
        mergeUrlParameters(window["sap-ushell-config"]);
        mergePlatformSpecificUrlParameters(window["sap-ushell-config"]);

        jQuery.sap.declare("sap.ui2.srvc.utils");
        sap.ui.getCore().loadLibraries(
            [ "sap.ushell_abap" ],
            {
                async: false,
                preloadOnly : false
            }
        );

        jQuery.sap.require("sap.ushell.services.Container");

        sap.ushell.bootstrap("abap", {
            abap: "sap.ushell_abap.adapters.abap",
            hana: "sap.ushell_abap.adapters.hana"
        }).done(function () {
            // add all lazyMeasurements
            // TODO: check for addTime only necessary until ushell-lib and ushell_abap inconsistently deployed
            if (window["sap-ushell-aLazyMeasurements"] && (typeof sap.ushell.utils.addTime === "function")) {
                window["sap-ushell-aLazyMeasurements"].forEach(function (oEntry) {
                    sap.ushell.utils.addTime(oEntry.id,oEntry.info,oEntry.ts);
                });
                delete window["sap-ushell-aLazyMeasurements"];
            }

            // we call the XHR logon init again with configuration from file and set it to final for non default
            // modes, so that the renderer does not override it
            initXhrLogon(window["sap-ushell-config"], oFrameLogonManager, sXhrLogonMode, true);
            sap.ushell.Container.oFrameLogonManager = oFrameLogonManager;
        }).always(function () {
            if (isDirectStart(sShellHash)) {  // only set on direct app start (not #Shell-home)
                var fnResolve, fnReject;
                window["sap-ushell-async-libs-promise-directstart"] = new Promise(function(resolve, reject) {
                    fnResolve = resolve;
                    fnReject = reject;
                });
                window["sap-ushell-async-libs-promise-directstart"].catch(function(sMsg) { // always provide catch handler
                    /*silently ignore*/
                });
                // resolve the shell hash and try to load a UI5 component for it; if successful,
                // the application context for the component will be attached to the resolution result
                // for non-UI5 targets, it will be empty
                sap.ushell.Container.getService("NavTargetResolution").resolveHashFragment("#" + getShellHash())
                    .done(function (oResolutionResult) {
                        var oAppConfiguration = sap.ui.require("sap/ushell/services/AppConfiguration");
                        oAppConfiguration.setCurrentApplication(oResolutionResult);

                        if (oResolutionResult && oResolutionResult.ui5ComponentName) {
                            // create UI5 component early
                            sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(
                                oResolutionResult, getParsedShellHash(sShellHash), createWaitForRendererCreatedPromise())
                                .done(function (oResolutionResultWithComponentHandle) {
                                    fnResolve({
                                        resolvedHashFragment: oResolutionResultWithComponentHandle,
                                        dependenciesLoaded: true
                                    });
                                })
                                .fail(function (vError) {
                                    fnReject(vError);
                                });
                        } else {
                            // non-ui5 app
                            fnResolve({
                                resolvedHashFragment: oResolutionResult,
                                dependenciesLoaded: false
                            });
                        }
                    }).fail(function(sMsg) {
                        fnReject(sMsg);
                    });
            }

            // tell SAPUI5 that this boot task is done once the container has loaded
            fnCallback();
        });
    }


    /**
     * Overwrites jQuery.sap.registerModulePath to add a cache buster token on each call to the
     * URL prefix path.
     *
     * Note:
     * The sap-ushell-config defines the rules for adding a token to the URL.
     * This is a temporary solution. Ideally UI5 will provide this functionality.
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function overwriteRegisterModulePath() {
        var fnRegisterModulePath = jQuery.sap.registerModulePath;

        function normalizeUrlAndAddCacheBusterToken(sUrlPrefix) {
            // Removing cache buster token (if available) of url and normalize the url afterwards
            var sNormalizedUrl = sap.ui2.srvc.removeCBAndNormalizeUrl(sUrlPrefix),
                sUrlPrefixModified = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(sNormalizedUrl);
            return sUrlPrefixModified;
        }

        jQuery.sap.registerModulePath = function (sModuleName, vUrlPrefix) {
            // since 1.28, registerModulePath can take either a URL string or an object of form {url: "url", "final": true}
            if (typeof vUrlPrefix === "object") {
                vUrlPrefix.url = normalizeUrlAndAddCacheBusterToken(vUrlPrefix.url);
            } else if (typeof vUrlPrefix === "string") {
                vUrlPrefix = normalizeUrlAndAddCacheBusterToken(vUrlPrefix);
            }
            // any other types are just passed through

            fnRegisterModulePath(sModuleName, vUrlPrefix);
        };
    }

    /**
     * Determines the URL for the PageSets OData service from the startup service result. If the URL is not set
     * a hard-coded fallback URL is returned and set in the startupResult.
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getAndAdjustServiceURL(oStartupCallResult, sServicePropertyName, sFallbackBaseUrl,
            sFallbackRelativeUrl, sFallbackExpand) {
        var sServiceUrl,
            oServiceData, // shortcut for oStartupCallResult.services[sServicePropetyName]
            bFallbackApplied = false;

        if (oStartupCallResult.services) {
            if (oStartupCallResult.services[sServicePropertyName]) {
                oServiceData = oStartupCallResult.services[sServicePropertyName];
            } else {
                oServiceData = {};
                oStartupCallResult.services[sServicePropertyName] = oServiceData;
                bFallbackApplied = true;
            }
        } else {
            oServiceData = {};
            oStartupCallResult.services = {};
            oStartupCallResult.services[sServicePropertyName] = oServiceData;
            bFallbackApplied = true;
        }

        if (!oServiceData.baseUrl || !oServiceData.relativeUrl) {
            oServiceData.baseUrl = sFallbackBaseUrl;
            oServiceData.relativeUrl = sFallbackRelativeUrl;
            bFallbackApplied = true;
        }

        if (bFallbackApplied) {
            sap.ui2.srvc.log.warning(
                "URL for " + sServicePropertyName + " service not found in startup service result; fallback to default; cache invalidation might fail",
                null,
                "sap.ushell_abap.bootstrap"
            );
        }

        // clean trailing and leading slashes
        if (oServiceData.baseUrl.lastIndexOf("/") !== oServiceData.baseUrl.length - 1) {
            // modify the startUpResult, to simplify the adapter code later
            oServiceData.baseUrl += "/";
        }
        if (oServiceData.relativeUrl[0] === "/") {
            // modify the startUpResult, to simplify the adapter code later
            oServiceData.relativeUrl = oServiceData.relativeUrl.slice(1);
        }

        sServiceUrl = oServiceData.baseUrl + oServiceData.relativeUrl;

        // add parameters if needed
        // Note: order should always be 1. $expand, 2. sap-cache-id=, 3. additional params;
        // as OData.read.$cache may otherwise not work properly
        if (!/\$expand=/.test(sServiceUrl) && sFallbackExpand) {
            // no expand, add fallback expand (if not "")
            sServiceUrl += (sServiceUrl.indexOf("?") < 0 ? "?" : "&" ) + "$expand=" + sFallbackExpand;
        }
        if (oServiceData.cacheId) {
            sServiceUrl += (sServiceUrl.indexOf("?") < 0 ? "?" : "&" ) + "sap-cache-id=" + oServiceData.cacheId;
        }
        if (oServiceData["sap-ui2-cache-disable"]) {
            sServiceUrl += (sServiceUrl.indexOf("?") < 0 ? "?" : "&" ) + "sap-ui2-cache-disable=" + oServiceData["sap-ui2-cache-disable"];
        }
        return sServiceUrl;
    }

    /**
     * Determines the URL for the PageSets OData service from the startup service result. If the URL is not set
     * a hard-coded fallback URL is returned and set in the startupResult.
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getAndAdjustPageSetServiceURL(oStartupCallResult) {
        var sUI2CacheDisable = getUrlParameterValue("sap-ui2-cache-disable");
        if (sUI2CacheDisable && oStartupCallResult && oStartupCallResult.services && oStartupCallResult.services.pbFioriHome) {
            oStartupCallResult.services.pbFioriHome["sap-ui2-cache-disable"] = sUI2CacheDisable;
        }
        return getAndAdjustServiceURL(
            oStartupCallResult,
            "pbFioriHome",
            S_PAGE_SETS_FALLBACK_URL_BASE,
            S_PAGE_SETS_FALLBACK_URL_RELATIVE,
            S_PAGE_SETS_FALLBACK_EXPAND
        );
    }

    /**
     * Synchronizes asynchronous requests
     * - start-up request
     * - UI5 boot task
     * - server config request
     * - target mappings request
     * - page set request and SAPUI5 boot task.
     * @private
     * @memberOf outerClosure
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap);
    function sync() {
        if (bTriggerStartupProcessing && fnUi5Callback && aServerConfig) {
            // avoid calling it a 2nd time; reset this BEFORE calling bootstrap to be safe in case of re-entrant calls
            setTriggerStartupProcessing(false);

            sap.ui2.srvc.log.debug("sync: point for startupResult, serverConfig and UI5 - executing ushell bootstrap",
                    null, "sap.ushell_abap.bootstrap");

            // creating the deferred objects here should ensure that the ushell adapters later read
            // the responses from the "cache", even if UI5 bootstrap is faster than the
            // OData requests
            if (!bApplicationColdStart) {
                // do not create cache entries for PageSet and compact TMs
                // otherwise the FLP will freeze when returning to HOME from the cold started app (???)
                oPageSetDeferred = createODataDeferred(getAndAdjustPageSetServiceURL(oStartupResult));
            }
            bootstrap(oStartupResult, aServerConfig, fnUi5Callback);
            fnUi5Callback = aServerConfig = undefined; // avoid calling it a 2nd time
        }
        if (oPageSetDeferred && aPageSetArgs) {
            sap.ui2.srvc.log.debug(
                "sync: point for pageSet request and UI5 - executing odata cache fill for page set request",
                null,
                "sap.ushell_abap.bootstrap"
            );
            aPageSetArgs.unshift(oPageSetDeferred);  // add at beginning
            processOData.apply(null, aPageSetArgs);
            oPageSetDeferred = aPageSetArgs = undefined; // avoid calling it twice
        }
    }

    /**
     *  check if a given BCP-47 compliant locale
     *  is a RTL locale or not
     * @param {string} sLocale
     *     a string representing a locale e.g "en" or "en-US"
     *
     * @return {boolean}
     *      true will be returned if this is a RTL language
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function isRTLLocale(sLocale) {
        //a list of RTL locales ('iw' is an old code for 'he')
        var aRTL_LOCALES = ['ar', 'fa', 'he', 'iw'];

        //remove the region part of the locale if it exists
        sLocale = sLocale.toLowerCase().substring(0, 2);
        return aRTL_LOCALES.indexOf(sLocale) >= 0;
    }

    /**
     * obtain the path of the sap-ui5 core library
     * own script; module paths are registered relative to this path, not relative to the HTML page
    * @return {string}
    *    the bootstrap path resources of the sap-ui5 libary, not "/"-terminated,
    *    note that it may contain a cachebuster token,
    *    e.g. "/sap/public/bc/ui5_ui5/resources/~201410160110~"
    * @private
    */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getBootstrapScriptPath() {
        // we cannot use jQuery.sap.getModulePath("") here, because ui5 may not yet be loaded
        // therefore, we determine the path relative to the ushell bootstrap script location
        // using the ui5 bootstrap script is also not 100% safe, because this is included AFTER
        // the ushell script; the theme loading has to be failsafe against missing bootstrap script path
        var oBootstrapScript = window.document.getElementById("sap-ushell-bootstrap"),
            sBootstrapScriptPath;
        if (oBootstrapScript) {
            sBootstrapScriptPath = oBootstrapScript.src.split('/').slice(0, -4).join('/');
        } else {
            sap.ui2.srvc.log.warning(
                "Cannot determine bootstrap script path: no element with ID 'sap-ushell-bootstrap' found.",
                null,
                "sap.ushell_abap.bootstrap"
            );
        }
        return sBootstrapScriptPath;
    }

    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function loadStartupServiceTheme(oStartupTheme, oStartupServiceResult) {
        var sLanguage = oStartupServiceResult.languageBcp47 || "",
            bIsRTL = isRTLLocale(sLanguage),
            sThemeBaseUrl,
            sBootstrapScriptPath,
            sFileName,
            oLink;

        if (oStartupTheme && oStartupTheme.theme) {
            oLink = window.document.createElement("link");
            sFileName = bIsRTL ? "library-RTL.css" : "library.css";
            if (oStartupTheme.root) {
                sThemeBaseUrl = oStartupTheme.root + "/UI5/sap/fiori/themes/";
            } else {
                sBootstrapScriptPath = getBootstrapScriptPath();
                if (sBootstrapScriptPath) {
                    sThemeBaseUrl = sBootstrapScriptPath + "/sap/fiori/themes/";
                }
            }
            if (sThemeBaseUrl) {
                oLink.setAttribute("href", sThemeBaseUrl + oStartupTheme.theme + "/" + sFileName);
                oLink.setAttribute("rel", "stylesheet");
                oLink.setAttribute("id", "sap-ui-theme-sap.fiori");
                oLink.addEventListener("load", function() {
                    oLink.setAttribute("data-sap-ui-ready", "true");
                });
                oLink.addEventListener("error", function() {
                    oLink.setAttribute("data-sap-ui-ready", "false");
                });
                window.document.head.appendChild(oLink);
            }
        }
    }

    /**
     * @param oStartupResult
     * @returns "&sap-cache-id=xxxx" if found, otherwise ""
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function getCacheIdAsQueryParameter(oStartupResult) {
        var sResult = oStartupResult && oStartupResult.services
        && oStartupResult.services.targetMappings
        && oStartupResult.services.targetMappings.cacheId;
        if (typeof sResult === "string") {
            return "&sap-cache-id=" + sResult;
        }
        return "";
    }

    /**
     * Adds common headers to the given XHR object. This method is ideal to be used whenever the request should be made with certain headers.
     *
     * @param {object} oXHR
     *
     * @param {object} oStartupResultLikeObject
     *   An object that looks like the start_up result. This object must
     *   contain at least the following fields:
     * <pre>
     * {
     *     "client": "<client>",
     *     "language": "<language>"
     * }
     * </pre>
     *
     * @returns {object}
     *   The input oXHR object amended with headers.
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function addCommonHeadersToXHR(oXHR, oStartupResultLikeObject) {
        oXHR.setRequestHeader("Accept", "application/json");
        if (oStartupResultLikeObject.client) {
            oXHR.setRequestHeader("sap-client", oStartupResultLikeObject.client);
        }
        if (oStartupResultLikeObject.language) {
            oXHR.setRequestHeader("sap-language", oStartupResultLikeObject.language);
        }
        return oXHR;
    }

    /**
     * Creates and opens a new XMLHttpRequest object.
     *
     * @param {string} sUrl
     *  The URL the XHR object should request from.
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function createAndOpenXHR(sUrl) {
        var oXHR = new XMLHttpRequest();
        oXHR.open("GET", sUrl, /*async=*/true);
        return oXHR;
    }

    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function requestCompactTM(oStartupResult) {
        oCompactTMResult = undefined;
        if (bNoOData) {
            return;
        }
        var mParameterMap = sap.ui2.srvc.getParameterMap();
        var sRequestUrl = "/sap/bc/ui2/start_up?so=%2A&action=%2A&tm-compact=true&",
            sCacheId = getCacheIdAsQueryParameter(oStartupResult);
        oFullTMResult = undefined;

        /*
         * Copies the URL parameter with the given name from <code>mParameterMap</code> to
         * <code>sRequestUrl</code> if within the relevant list.
         *
         * @param {string} sName
         *   URL parameter name
         * @private
         */
        function copyParameter(sName) {
            var sValue = mParameterMap[sName];
            if (sValue) {
                sRequestUrl += sName + "=" + encodeURIComponent(sValue[0]) + "&";
            }
        }
        copyParameter("sap-language");
        copyParameter("sap-client");
        copyParameter("sap-ui2-cache-disable");
        bRequestedCompactTM = true;
        addTime("RequestCompactTM");

        // add more parameters
        sRequestUrl = sRequestUrl + "shellType=" + sap.ushell_abap.getShellType() + "&depth=0" + sCacheId;

        sap.ui2.srvc.get(
                sRequestUrl,
                false, /*xml=*/
                function (sTMResult) {
                    addTime("ReceiveCompactTM");
                    oCompactTMResult = JSON.parse(sTMResult);
                    if (window["sap-ushell-config"] &&
                            window["sap-ushell-config"].services &&
                            window["sap-ushell-config"].services.LaunchPage &&
                            window["sap-ushell-config"].services.LaunchPage.adapter &&
                            window["sap-ushell-config"].services.LaunchPage.adapter.config &&
                            typeof window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMResultFunction === "function") {
                        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMResultFunction(oFullTMResult);
                    }
                },
                function (sMessage) {
                    oCompactTMResult = "fail:" + sMessage;
                    if (window["sap-ushell-config"] &&
                            window["sap-ushell-config"].services &&
                            window["sap-ushell-config"].services.LaunchPage &&
                            window["sap-ushell-config"].services.LaunchPage.adapter &&
                            window["sap-ushell-config"].services.LaunchPage.adapter.config &&
                            typeof window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMFailFunction === "function") {
                        window["sap-ushell-config"].services.LaunchPage.adapter.config.compactTMFailFunction(sMessage);
                    }
                },
                addCommonHeadersToXHR(createAndOpenXHR(sRequestUrl), oStartupResult)  // XMLHttpRequest + headers
        );
    }

    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function requestFullTM(oStartupResult) {
        var mParameterMap = sap.ui2.srvc.getParameterMap();
        var sRequestUrl = "/sap/bc/ui2/start_up?so=%2A&action=%2A&",
            sCacheId = getCacheIdAsQueryParameter(oStartupResult);
        oFullTMResult = undefined;
        if (bNoOData) {
            return;
        }

        /*
         * Copies the URL parameter with the given name from <code>mParameterMap</code> to
         * <code>sRequestUrl</code> if within the relevant list.
         *
         * @param {string} sName
         *   URL parameter name
         * @private
         */
        function copyParameter(sName) {
            var sValue = mParameterMap[sName];
            if (sValue) {
                sRequestUrl += sName + "=" + encodeURIComponent(sValue[0]) + "&";
            }
        }
        copyParameter("sap-language");
        copyParameter("sap-client");
        copyParameter("sap-ui2-cache-disable");
        addTime("RequestFullTM");

        // add more parameters
        sRequestUrl = sRequestUrl + "shellType=" + sap.ushell_abap.getShellType() + "&depth=0" + sCacheId;

        sap.ui2.srvc.get(
                sRequestUrl,
                false, /*xml=*/
                function (sFullTMResult) {
                    oFullTMResult = JSON.parse(sFullTMResult);
                    if (window["sap-ushell-config"] &&
                            window["sap-ushell-config"].services &&
                            window["sap-ushell-config"].services.ClientSideTargetResolution &&
                            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter &&
                            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config &&
                            typeof window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMResultFunction === "function") {
                        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMResultFunction(oFullTMResult);
                    }
                },
                function (sMessage) {
                    oFullTMResult = "fail:" + sMessage;
                    if (window["sap-ushell-config"] &&
                            window["sap-ushell-config"].services &&
                            window["sap-ushell-config"].services.ClientSideTargetResolution &&
                            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter &&
                            window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config &&
                            typeof window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMFailFunction === "function") {
                        window["sap-ushell-config"].services.ClientSideTargetResolution.adapter.config.fullTMFailFunction(sMessage);
                    }
                },
                addCommonHeadersToXHR(createAndOpenXHR(sRequestUrl), oStartupResult)  // XMLHttpRequest + headers
        );
    }


    /*eslint-disable*/
    /**
     * Performs a start-up request and synchronizes it with the SAPUI5 boot task.
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function start() {
        if (window['sap-ushell_abap-bootstrap-abap-noOData']) {
            setNoOData(true);
        }

        // initialize XHR logon manager based on configuration; this has to be done before triggering any XHR requests
        // for this early phase, we use the the configuration form the window object
        // the method is called a second time later when we have loaded the config file
        sXhrLogonMode = initXhrLogon(window["sap-ushell-config"], oFrameLogonManager);

        // add ignore filter for XHR logon if loaded from absolute URL
        // see internal BCP 1680358500
        initXhrLogonIgnoreList(getBootstrapScriptPath(), oFrameLogonManager);

        //TODO: this may move before TargetMappings & pageset firing (in case of contention of network connections)
        //fire start-up request if direct start also indicates suppression of pageset request
        //must be kept before success handler of requestStartUp

        requestStartup(function (oResult) {
            var sPageSetServiceUrl;
            oStartupResult = oResult;
            requestDirectStart(oStartupResult);
            sPageSetServiceUrl = getAndAdjustPageSetServiceURL(oStartupResult);
            // Startup theme processing: as early as possible for performance reasons
            sSystemThemeRoot = extractSystemThemeRoot(oStartupResult);
            oStartupTheme = determineStartupTheme(oStartupResult, sSystemThemeRoot);
            if (!isUrlThemeSupplied() && oStartupTheme) {
                sap.ui2.srvc.log.debug("theme: load theme from startup service via window",
                        null, "sap.ushell_abap.bootstrap");
                loadStartupServiceTheme(oStartupTheme, oStartupResult);
                // loads the theme via adding as link to the window
            }
            setTriggerStartupProcessing(true);
            // Request page set and incomplete target mappings only if the home page is loaded
            // (not a direct application start)
            if (!bApplicationColdStart) {
                requestOData(sPageSetServiceUrl, oStartupResult, function (iStatus, sCsrfToken, sResponse) {
                    aPageSetArgs = Array.prototype.slice.call(arguments);
                    sync();
                });
                requestCompactTM(oStartupResult);
            }
            requestFullTM(oStartupResult);
            // Request the target mappings immediately when startup request is finished; this is always requested,
            // because we need it for navigation target resolution
            sync();
        }, function (sMessage) {
            sap.ui2.srvc.log.error("start_up request failed: " + sMessage, null,
                "sap.ushell_abap.bootstrap");
            oStartupResult = {};
            setTriggerStartupProcessing(true);
            sync();
        });

        requestServerConfig(function (aConfigs) {
            aServerConfig = aConfigs;
            sync();
        }, function (sMessage) {
            sap.ui2.srvc.log.error("Could not load server configuration: " + sMessage, null,
                "sap.ushell_abap.bootstrap.abap");
            aServerConfig = [];
            sync();
        });
    }
    /*eslint-enable*/

    /*eslint-disable*/
    /**
     * The SAPUI5 boot task when bootstrapping Unified Shell for ABAP.
     * @param {function} fnCallback
     *     the function by which SAPUI5 is notified that this task is finished
     */
    sap.ui2.srvc.testPublishAt(sap.ushell_abap.bootstrap); /** @memberOf outerClosure */
    function bootTask(fnCallback) {
        fnUi5Callback = fnCallback;
        overwriteRegisterModulePath();
        sync();

        // add nice logging for sap/net/xhr.js
        XMLHttpRequest.logger = jQuery.sap.log.getLogger("sap.net.xhr");
    }
    /*eslint-enable*/

    /**
     * Adds the given post parameters to a url
     *
     * @param {string} sPostParameters
     *    the postParameters field from a NavTargetResult
     *
     * @param {string} sUrl
     *    the url string to add the postParameters to
     *
     * @return {string}
     *    sUrl with the post parameter added
     */
    sap.ushell_abap.bootstrap.addPostParametersToNavTargetResultUrl = function (sPostParameters, sUrl) {
        // add POST parameters to URL
        if (sPostParameters) {
            sUrl += (sUrl.indexOf("?") < 0) ? "?" : "&";
            sUrl += sPostParameters;
        }
        return sUrl;
    };


    /**
     * Checks the Resolve Link/Start Up result for Application Dependencies and if present modifies the results
     * Additionaly amends the post parameters if present
     * @param {object}
     *
     * @private
     */
    sap.ushell_abap.bootstrap.adjustNavTargetResult = function (oResult) {
        if (oResult) {
            var sUrl = oResult.url,
                oUri,
                oAdjustedResult = {
                        applicationType: oResult.applicationType,
                        additionalInformation: oResult.applicationData
                },
                sComponentName,
                aMatches,
                oAppDependencies,
                oSelf;

            if (oResult.text) {
                oAdjustedResult.text = oResult.text;
            }
            if ((oResult.applicationType === "URL" || oResult.applicationType === "SAPUI5")) {
                aMatches = /^SAPUI5\.Component=(.*)/.exec(oResult.applicationData);
                sComponentName = aMatches && aMatches[1];

                if (sComponentName || oResult.applicationDependencies) {
                    if (sComponentName) {
                        oAdjustedResult.ui5ComponentName = sComponentName;
                    }
                    // we only want to assign oAsyncHints if parsing succeeds, otherwise we're happy with undefined
                    if (oResult.applicationDependencies) {
                        try {
                            oAppDependencies = JSON.parse(oResult.applicationDependencies);
                            oSelf = oAppDependencies.self;
                            if (!oAdjustedResult.ui5ComponentName && oSelf.name) {
                                oAdjustedResult.ui5ComponentName = oSelf.name;
                                oAdjustedResult.additionalInformation = "SAPUI5.Component=" + oAdjustedResult.ui5ComponentName;
                            }
                            if (oSelf && oSelf.url && typeof oSelf.url === "string") {

                                var URI = sap.ui.require('sap/ui/thirdparty/URI');
                                oUri = sUrl && new URI(sUrl);

                                if (oUri) {
                                    if (oSelf.url.toUpperCase().indexOf(oUri.path().toUpperCase()) !== 0) {
                                        //no applicationDependencies in this case as they belong to the wrong app
                                        sap.ui2.srvc.log.debug("Component URL defined in target mapping "
                                                + "does not match the URL retrieved from application index. "
                                                + "The URL of the application index is used for further processing.",
                                        "Target mapping URL: " + oResult.url + "\nApplication index URL: " + oSelf.url,
                                        "sap.ushell_abap.bootstrap.abap");
                                    }
                                    oUri.path(oSelf.url);
                                    sUrl = oUri.toString();
                                    jQuery.sap.log.debug("ResolveLink result's component url has been replaced with the url specified " +
                                        "in Application Dependencies, which includes cache buster token");
                                } else {
                                    sUrl = oSelf.url;
                                }
                            }

                            oAdjustedResult.applicationDependencies = oAppDependencies;
                        } catch (oError) {
                            sap.ui2.srvc.log.error(
                                "Parsing of applicationDependencies attribute in resolveLink result failed for SAPUI5 component '" + sComponentName + "'",
                                oError,
                                "sap.ushell_abap.bootstrap.abap"
                            );
                        }
                    }

                    // add cache-buster token to URL
                    // although we stub the jQuery.sap.registerModulePath() method,
                    // we have to replace it in the URL already, because the AppConfiguration service
                    // loads the component's resource bundle already before the module path is registered
                    // by the ApplicationContainer
                    //
                    // we only do this for SAPUI5 applications - if a plain URL or NWBC app is launched,
                    // we keep it as it is
                    // see internal BCP inicdent 1580137234 2015
                    sUrl = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(sUrl);
                }
            }

            oAdjustedResult.url = sUrl;
            return oAdjustedResult;
        }
    };

    start();
    //TODO how to drop our own version of sap.ui.Device in favor of SAPUI5's original?
//    delete sap.ui.Device;

    // don't overwrite existing ui5 config settings
    window['sap-ui-config'] = window['sap-ui-config'] || {};
    window['sap-ui-config']["xx-bootTask"] = bootTask;
}());
