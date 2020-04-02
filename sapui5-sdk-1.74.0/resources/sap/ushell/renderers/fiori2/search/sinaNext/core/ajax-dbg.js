// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global XMLHttpRequest, sinaDefine, Promise */
sinaDefine(['./core', './util'], function (core, util) {
    "use strict";

    var module = {};

    module.parseHeaders = function (header) {
        var headers = {};
        var lines = header.split('\n');
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            var index = line.indexOf(':');
            if (index >= 0) {
                var name = line.slice(0, index).toLowerCase(); // headers are case insensitive -> normalize to lower case
                var value = line.slice(index + 1);
                headers[name] = value.trim();
            }
        }
        return headers;
    };

    module.encodeUrlParameters = function (parameters) {
        var result = [];
        for (var name in parameters) {
            var value = parameters[name];
            result.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
        }
        return result.join('&');
    };

    module.addEncodedUrlParameters = function (url, parameters) {
        if (!parameters) {
            return url;
        }
        var encodedParameters = module.encodeUrlParameters(parameters);
        if (encodedParameters.length > 0) {
            url += '?' + encodedParameters;
        }
        return url;
    };

    module.Exception = core.Exception.derive({
        _init: function (xhttp) {
            this.xhttp = xhttp;
            this.status = xhttp.status;
            this.statusText = xhttp.statusText;
            this.responseText = xhttp.responseText;
            this.headers = module.parseHeaders(xhttp.getAllResponseHeaders());
            core.Exception.prototype._init.apply(this, [{
                message: this.status + ': ' + this.statusText,
                description: this.responseText
            }]);
        }
    });

    module.request = function (properties) {
        return new Promise(function (resolve, reject) {

            // new http request
            var xhttp = new XMLHttpRequest();

            // callback handler
            xhttp.onreadystatechange = function () {
                if (xhttp.readyState == 4 && (xhttp.status == 200 || xhttp.status == 201 || xhttp.status == 204)) {
                    resolve({
                        data: xhttp.responseText,
                        headers: module.parseHeaders(xhttp.getAllResponseHeaders())
                    });
                    return;
                }
                if (xhttp.readyState == 4) {
                    reject(new module.Exception(xhttp));
                }
            };

            // add url parameters to url
            var url = module.addEncodedUrlParameters(properties.url, properties.parameters);

            // write headers to http request
            xhttp.open(properties.method, url, true);
            for (var headerName in properties.headers) {
                var headerValue = properties.headers[headerName];
                xhttp.setRequestHeader(headerName, headerValue);
            }

            // send
            xhttp.send(properties.data);
        });

    };

    module.Client = core.defineClass({

        _init: function (properties) {
            this._client = new module._Client(properties);
            this.recordOptions = {
                mode: util.getUrlParameter('recordingMode') || properties.recordingMode || "none",
                path: util.getUrlParameter('recordingPath') || properties.recordingPath || "",
                requestNormalization: properties.requestNormalization || this._defaultRequestNormalization
            };
            this.records = {};
        },

        _encodeObj: function (data) {
            var aResult = [];
            for (var prop in data) {
                if (data.hasOwnProperty(prop)) {
                    aResult.push(encodeURIComponent(prop) + "=" + encodeURIComponent(data[prop]));
                }
            }
            return aResult.join("&");
        },

        getJson: function (url, data) {
            var that = this;
            if (data) {
                var sData = '?' + that._encodeObj(data);
                url = url + sData;
            }
            if (that.recordOptions.mode === "none") {
                return that._client.getJson(url);
            }
            if (that.recordOptions.mode === "replay") {
                return that._replay(url, null);
            }
            return that._client.getJson(url).then(function (response) {
                return that._record(url, null, response);
            });
        },

        getXML: function (url) {
            var that = this;
            if (that.recordOptions.mode === "none") {
                return that._client.getXML(url);
            }
            if (that.recordOptions.mode === "replay") {
                return that._replayXML(url);
            }
            return that._client.getXML(url).then(function (response) {
                return that._recordXML(url, response);
            });
        },

        postJson: function (url, payload) {
            // avoid to modifeid by the next call
            payload = JSON.parse(JSON.stringify(payload));

            var that = this;
            if (that.recordOptions.mode === "none") {
                return that._client.postJson(url, payload);
            }
            if (that.recordOptions.mode === "replay") {
                return that._replay(url, payload);
            }
            return that._client.postJson(url, payload).then(function (response) {
                return that._record(url, payload, response);
            });
        },

        mergeJson: function (url, payload) {
            // avoid to modifeid by the next call
            payload = JSON.parse(JSON.stringify(payload));

            var that = this;
            if (that.recordOptions.mode === "none") {
                return that._client.mergeJson(url, payload);
            }
            if (that.recordOptions.mode === "replay") {
                return that._replay(url, payload);
            }
            return that._client.mergeJson(url, payload).then(function (response) {
                return that._record(url, payload, response);
            });
        },

        request: function (properties) {
            return this._client.request(properties);
        },

        _record: function (url, payload, response) {
            var that = this;
            var key = url + JSON.stringify(that.recordOptions.requestNormalization(payload));
            if (that.records[key] === undefined && key.indexOf("NotToRecord") === -1) {
                that.records[key] = JSON.parse(JSON.stringify(response.data));
            }
            return that._client.putJson(that.recordOptions.path, that.records).then(function () {
                return response;
            });
        },

        _recordXML: function (url, response) {
            var that = this;
            var key = url;
            if (that.records[key] === undefined && key.indexOf("NotToRecord") === -1) {
                that.records[key] = response;
            }
            return that._client.putJson(that.recordOptions.path, that.records).then(function () {
                return response;
            });
        },

        _replay: function (url, payload) {
            var that = this;
            var key = url + JSON.stringify(that.recordOptions.requestNormalization(payload));
            return that._client.getJson(that.recordOptions.path).then(function (records) {
                return {
                    data: records.data[key]
                };
            });
        },

        _replayXML: function (url) {
            var that = this;
            var key = url;
            return that._client.getJson(that.recordOptions.path).then(function (records) {
                return records.data[key];
            });
        },

        _defaultRequestNormalization: function (payload) {
            if (payload === null) {
                return "";
            }
            delete payload.SessionID;
            delete payload.SessionTimestamp;
            return payload;
        }
    });

    module._Client = core.defineClass({

        _init: function (properties) {
            this.csrf = properties.csrf;
            this.csrfByPassCache = properties.csrfByPassCache || false;
            this.csrfToken = null;
            this.csrfFetchRequest = properties.csrfFetchRequest || null;
        },

        jsonHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },

        xmlHeaders: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        },

        getJson: function (url) {
            return this.request({
                headers: this.jsonHeaders,
                method: 'GET',
                url: url
            }).then(function (response) {
                if (response.data.length === 0) {
                    response.data = '{}';
                }
                if (typeof (response.data) !== "object") {
                    response.data = JSON.parse(response.data);
                }
                return response;
            });
        },

        getXML: function (url) {
            return this.request({
                headers: this.xmlHeaders,
                method: 'GET',
                url: url
            }).then(function (response) {
                return response.data;
            });
        },

        postJson: function (url, data) {
            return this.request({
                headers: this.jsonHeaders,
                method: 'POST',
                url: url,
                data: JSON.stringify(data)
            }).then(function (response) {
                if (response.data.length === 0) {
                    response.data = '{}';
                }
                if (typeof (response.data) !== "object") {
                    response.data = JSON.parse(response.data);
                }
                return response;
            });
        },

        mergeJson: function (url, data) {
            return this.request({
                headers: this.jsonHeaders,
                method: 'MERGE',
                url: url,
                data: JSON.stringify(data)
            }).then(function (response) {
                if (response.data.length === 0) {
                    response.data = '{}';
                }
                if (typeof (response.data) !== "object") {
                    response.data = JSON.parse(response.data);
                }
                return response;
            });
        },

        putJson: function (directory, data) {
            return this.request({
                method: 'PUT',
                url: directory,
                data: JSON.stringify(data)
            }).catch(function (error) {
                throw error;
            });
        },

        _fetchCsrf: function () {
            if (this.csrfFetchRequestPromise) {
                return this.csrfFetchRequestPromise;
            }
            this.csrfFetchRequest.headers = this.csrfFetchRequest.headers || {};
            this.csrfFetchRequest.headers['x-csrf-token'] = 'fetch';
            this.csrfFetchRequest.parameters = this.csrfFetchRequest.parameters || {};
            if (this.csrfByPassCache) {
                this.csrfFetchRequest.parameters._ = Date.now(); // bypass cache;
            }
            this.csrfFetchRequestPromise = module.request(this.csrfFetchRequest).then(function (response) {
                this.csrfFetchRequestPromise = null;
                this.csrfToken = response.headers['x-csrf-token'];
                return response;
            }.bind(this));
            return this.csrfFetchRequestPromise;
        },

        _requestWithCsrf: function (properties, renewCsrf) {

            // if request is identical to csrf fetch request -> always fetch a new csrf token
            if (module.addEncodedUrlParameters(this.csrfFetchRequest.url, this.csrfFetchRequest.parameters) === module.addEncodedUrlParameters(properties.url, properties.parameters)) {
                return this._fetchCsrf();
            }

            // no csrf -> fetch csrf and then call again _requestWithCsrf
            if (renewCsrf && !this.csrfToken) {
                return this._fetchCsrf().then(function () {
                    return this._requestWithCsrf(properties, false);
                }.bind(this));
            }

            // do request with csrf token
            properties.headers = properties.headers || {};
            properties.headers['x-csrf-token'] = this.csrfToken;
            return module.request(properties).catch(function (error) {
                if (renewCsrf && error.headers['x-csrf-token'] && error.headers['x-csrf-token'].toLowerCase() === 'required') {
                    return this._fetchCsrf().then(function () {
                        return this._requestWithCsrf(properties, false);
                    }.bind(this));
                }
                return core.Promise.reject(error);
            }.bind(this));
        },

        request: function (properties) {

            // check csrf is enabled
            if (!this.csrf) {
                return module.request(properties);
            }

            // if csrf fetch request is not set -> treat first request as csrf fetch request
            if (!this.csrfFetchRequest) {
                this.csrfFetchRequest = properties;
            }

            // mainRequest with csrf renew if neccessary
            return this._requestWithCsrf(properties, true);

        }

    });

    return module;

});
