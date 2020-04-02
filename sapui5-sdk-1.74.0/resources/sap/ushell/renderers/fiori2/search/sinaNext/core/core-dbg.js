// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
// start sina init
window.sinaRequire = window.sinaRequire || (window.sap && window.sap.ui && window.sap.ui.require) || window.require;
window.sinaDefine = window.sinaDefine || (window.sap && window.sap.ui && window.sap.ui.define) || window.define;
window.sinaLog = window.sinaLog || (window.jQuery && window.jQuery.sap && window.jQuery.sap.log) || window.console;
// end sina init

sinaDefine([], function () {
    "use strict";

    var module = {};

    // =========================================================================
    // map
    // =========================================================================
    module.map = function (list, mapFunction, mapCtx) {
        var result = [];
        for (var i = 0; i < list.length; ++i) {
            result.push(mapFunction.apply(mapCtx, [list[i]]));
        }
        return result;
    };

    // =========================================================================
    // filter
    // =========================================================================
    module.filter = function (list, check) {
        var result = [];
        for (var i = 0; i < list.length; ++i) {
            var element = list[i];
            if (check(element)) {
                result.push(element);
            }
        }
        return result;
    };

    // =========================================================================
    // create object with prototype
    // =========================================================================
    module.object = function (prototype) {
        var TmpFunction = function () {};
        TmpFunction.prototype = prototype;
        return new TmpFunction();
    };

    // =========================================================================
    // extend object
    // =========================================================================
    module.extend = function (o1, o2) {
        for (var key in o2) {
            o1[key] = o2[key];
        }
        return o1;
    };

    // =========================================================================
    // first character to upper
    // =========================================================================
    module.firstCharToUpper = function (text, removeUnderscore) {
        if (removeUnderscore) {
            if (text[0] === '_') {
                text = text.slice(1);
            }
        }
        return text[0].toUpperCase() + text.slice(1);
    };

    // =========================================================================
    // is list
    // =========================================================================
    module.isList = function (obj) {
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            return true;
        }
        return false;
    };

    // =========================================================================
    // is object (array!=object)
    // =========================================================================
    module.isObject = function (obj) {
        if (module.isList(obj)) {
            return false;
        }
        return typeof obj === 'object';
    };

    // =========================================================================
    // is empty object
    // =========================================================================
    module.isEmptyObject = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return JSON.stringify(obj) === JSON.stringify({});
    };

    // =========================================================================
    // is function
    // =========================================================================
    module.isFunction = function (obj) {
        return typeof obj === 'function';
    };

    // =========================================================================
    // is string
    // =========================================================================
    module.isString = function (obj) {
        return (typeof obj) === 'string';
    };

    // =========================================================================
    // is simple (= string, number  but not list, object, function)
    // =========================================================================
    module.isSimple = function (obj) {
        return (typeof obj) !== 'object' && (typeof obj) !== 'function';
    };

    // =========================================================================
    // Promise
    // =========================================================================
    module.Promise = Promise;

    // =========================================================================
    // helper: generate constructor function
    // =========================================================================
    var generateConstructorFunction = function () {
        var cf = (function () {
            return function () {
                if (arguments[0] === '_suppress_init_') {
                    return;
                }
                this._genericInit.apply(this, arguments);
            };
        })();
        return cf;
    };

    // =========================================================================
    // base class
    // =========================================================================
    var BaseClass = generateConstructorFunction();
    BaseClass.prototype = {

        _getClassHierarchyPrototypes: function () {
            var prototypes = [];
            var prototype = this.constructor.prototype;
            while (prototype) {
                prototypes.push(prototype);
                prototype = prototype.constructor.superPrototype;
            }
            prototypes.reverse();
            return prototypes;
        },

        _genericInit: function () {

            // generic init for class hierarchy
            var initProperties = arguments[0] || {};
            var prototypes = this._getClassHierarchyPrototypes();
            for (var i = 0; i < prototypes.length; ++i) {
                var prototype = prototypes[i];

                // before init
                if (prototype.hasOwnProperty('_beforeInitProperties')) {
                    prototype._beforeInitProperties.apply(this, arguments);
                }

                // init properties
                this._initPropertiesOfPrototype(prototype, initProperties);

                // after init
                if (prototype.hasOwnProperty('_afterInitProperties')) {
                    prototype._afterInitProperties.apply(this, arguments);
                }

            }

            // custom init
            if (this._init) {
                this._init.apply(this, arguments);
            }

        },

        _initPropertiesOfPrototype: function (prototype, initProperties) {

            var setParent = function (propertyMetadata, parent, propertyValue) {
                if (!propertyMetadata.aggregation) {
                    return;
                }
                if (!propertyValue) {
                    return;
                }
                if (module.isList(propertyValue)) {
                    for (var i = 0; i < propertyValue.length; ++i) {
                        var element = propertyValue[i];
                        element.parent = parent;
                    }
                } else {
                    propertyValue.parent = parent;
                }
            };

            // check for own meta data
            if (!prototype.hasOwnProperty('_meta') || !prototype._meta.properties) {
                return;
            }

            // process all properties
            for (var property in prototype._meta.properties) {
                var propertyMetadata = prototype._meta.properties[property];
                var initValue = initProperties[property];

                // set initilization value if supplied in construction parameters
                if (initValue !== undefined) {
                    this[property] = initValue;
                    setParent(propertyMetadata, this, this[property]);
                    continue;
                }

                // check required
                if (propertyMetadata.required) {
                    throw new module.Exception('initialization property missing:' + property);
                }

                // set default value
                if (propertyMetadata.default !== undefined) {
                    if (module.isFunction(propertyMetadata.default)) {
                        this[property] = propertyMetadata.default.apply(this, []);
                    } else {
                        this[property] = propertyMetadata.default;
                    }
                }

                // for aggregated properties set parent
                setParent(propertyMetadata, this, this[property]);

            }

        },

        _initClone: function () {

        },

        _equals: function (other) {
            if (!other) {
                return false;
            }
            if (!module.isObject(other)) {
                return false;
            }
            if (other.constructor !== this.constructor) {
                return false;
            }
            return true;
        },

        equals: function (other, mode) {
            var prototypes = this._getClassHierarchyPrototypes();
            for (var i = 0; i < prototypes.length; ++i) {
                var prototype = prototypes[i];
                if (!prototype.hasOwnProperty('_equals')) {
                    continue;
                }
                if (!prototype._equals.apply(this, [other, mode])) {
                    return false;
                }
            }
            return true;
        },

        clone: function () {
            var clone = new this.constructor('_suppress_init_');
            var prototypes = this._getClassHierarchyPrototypes();
            for (var i = 0; i < prototypes.length; ++i) {
                var prototype = prototypes[i];
                if (!prototype.hasOwnProperty('_initClone')) {
                    continue;
                }
                prototype._initClone.apply(clone, [this]);
            }
            return clone;
        }

    };
    BaseClass.prototype.constructor = BaseClass;

    // =========================================================================
    // helper: generate getter
    // =========================================================================
    var generateGetter = function (prototype, propertyName) {
        var methodName = 'get' + module.firstCharToUpper(propertyName, true);
        if (prototype[methodName]) {
            return;
        }
        prototype[methodName] = function (value) {
            return this[propertyName];
        };
    };

    // =========================================================================
    // helper: generate setter
    // =========================================================================
    var generateSetter = function (prototype, propertyName) {
        var methodName = 'set' + module.firstCharToUpper(propertyName, true);
        if (prototype[methodName]) {
            return;
        }
        prototype[methodName] = function (value) {
            this[propertyName] = value;
        };
    };

    // =========================================================================
    // helper: define setter/getter according to metadata
    // =========================================================================
    var generatePrototypeMethods = function (prototype) {

        if (!prototype.hasOwnProperty('_meta')) {
            return;
        }
        var properties = prototype._meta.properties;
        if (!properties) {
            return;
        }

        for (var property in properties) {
            var propertyMetadata = properties[property];
            if (propertyMetadata.getter) {
                generateGetter(prototype, property);
            }
            if (propertyMetadata.setter) {
                generateSetter(prototype, property);
            }
        }
    };

    // =========================================================================
    // helper: define class
    // =========================================================================
    var defineClassInternal = function (parentClass, prototype) {

        var Cls = generateConstructorFunction();
        if (!parentClass) {
            parentClass = BaseClass;
        }
        Cls.prototype = module.extend(new parentClass('_suppress_init_'), prototype); // eslint-disable-line new-cap
        Cls.superPrototype = parentClass.prototype;

        Cls.prototype.constructor = Cls;
        generatePrototypeMethods(Cls.prototype);
        Cls.derive = function (derivedPrototype) {
            return defineClassInternal(Cls, derivedPrototype);
        };
        return Cls;
    };

    // =========================================================================
    // create class
    // =========================================================================
    module.defineClass = function (prototype) {
        return defineClassInternal(null, prototype);
    };

    // =========================================================================
    // Exception
    // =========================================================================
    module.Exception = module.defineClass({
        _init: function (properties) {
            if (module.isString(properties)) {
                this.previous = null;
                this.message = properties;
                this.description = '';
                return;
            }
            this.previous = properties.previous;
            this.message = properties.message;
            this.description = properties.description || '';
        },
        toString: function () {
            if (this.description) {
                return this.message + '\n' + this.description;
            }
            return this.message;
        }
    });

    // =========================================================================
    // generic equals
    // =========================================================================
    module.equals = function (o1, o2, ordered) {
        if (module.isList(o1)) {
            return module._equalsList(o1, o2, ordered);
        }
        if (module.isObject(o1)) {
            return module._equalsObject(o1, o2, ordered);
        }
        return o1 === o2;
    };

    module._equalsList = function (l1, l2, ordered) {
        if (ordered === undefined) {
            ordered = true;
        }
        if (l1.length !== l2.length) {
            return false;
        }
        if (ordered) {
            // 1) consider order
            for (var i = 0; i < l1.length; ++i) {
                if (!module.equals(l1[i], l2[i], ordered)) {
                    return false;
                }
            }
            return true;
        }
        // 2) do not consider order
        var matched = {};
        for (var j = 0; j < l1.length; ++j) {
            var element1 = l1[j];
            var match = false;
            for (var k = 0; k < l2.length; ++k) {
                var element2 = l2[k];
                if (matched[k]) {
                    continue;
                }
                if (module.equals(element1, element2, ordered)) {
                    match = true;
                    matched[k] = true;
                    break;
                }
            }
            if (!match) {
                return false;
            }
        }
        return true;

    };

    module._equalsObject = function (o1, o2, ordered) {
        if (o1.equals) {
            return o1.equals(o2);
        }
        if (!module.isObject(o2)) {
            return false;
        }
        for (var property in o1) {
            var propertyValue1 = o1[property];
            var propertyValue2 = o2[property];
            if (!module.equals(propertyValue1, propertyValue2, ordered)) {
                return false;
            }
        }
        return true;
    };

    // =========================================================================
    // generic clone
    // =========================================================================
    module.clone = function (obj) {
        if (module.isList(obj)) {
            return module._cloneList(obj);
        }
        if (module.isObject(obj)) {
            return module._cloneObject(obj);
        }
        return obj;
    };

    module._cloneList = function (list) {
        var cloned = [];
        for (var i = 0; i < list.length; ++i) {
            var element = list[i];
            cloned.push(module.clone(element));
        }
        return cloned;
    };

    module._cloneObject = function (obj) {
        if (obj.clone) {
            return obj.clone();
        }
        var cloned = {};
        for (var property in obj) {
            var value = obj[property];
            cloned[property] = module.clone(value);
        }
        return cloned;
    };

    // =========================================================================
    // generate id
    // =========================================================================
    var maxId = 0;
    module.generateId = function () {
        return '#' + (++maxId);
    };

    // =========================================================================
    // generate guid
    // =========================================================================
    module.generateGuid = function () {
        return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16).toUpperCase();
        });
    };

    // =========================================================================
    // executeSequentialAsync
    // =========================================================================
    module.executeSequentialAsync = function (tasks, caller) {
        if (!tasks) {
            return module.Promise.resolve(); // eslint-disable-line new-cap
        }
        var execute = function (index) {
            if (index >= tasks.length) {
                return undefined;
            }
            var task = tasks[index];
            return Promise.resolve().then(function () {
                if (caller) {
                    return caller(task);
                }
                return task();
            }).then(function () {
                return execute(index + 1);
            });
        };
        return execute(0);
    };

    return module;
});
