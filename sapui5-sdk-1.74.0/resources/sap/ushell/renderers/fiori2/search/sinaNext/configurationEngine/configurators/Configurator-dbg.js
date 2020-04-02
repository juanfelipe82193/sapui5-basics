// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core'], function (core) {
    "use strict";

    return core.defineClass({

        _init: function (options) {
            this.type = options.type;
            this.typeContext = options.typeContext;
            this.configuration = options.configuration;
            this.createConfiguratorAsync = options.createConfiguratorAsync;
        },

        createContext: function (oldCtx, obj) {
            if (!oldCtx) {
                return {
                    objectStack: [obj],
                    configuratorStack: [this]
                };
            }
            var objectStack = oldCtx.objectStack.slice();
            objectStack.push(obj);
            var configuratorStack = oldCtx.configuratorStack.slice();
            configuratorStack.push(this);
            return {
                objectStack: objectStack,
                configuratorStack: configuratorStack
            };
        },

        getResourceBundle: function (ctx) {
            for (var i = ctx.configuratorStack.length - 1; i >= 0; --i) {
                var configurator = ctx.configuratorStack[i];
                if (configurator.resourceBundle) {
                    return configurator.resourceBundle;
                }
            }
        },

        getEvaluateTemplateFunction: function (ctx) {
            var createFunction = function (evaluateTemplate, obj) {
                return function (template) {
                    return evaluateTemplate(template, obj);
                };
            };
            for (var i = ctx.configuratorStack.length - 1; i >= 0; --i) {
                var configurator = ctx.configuratorStack[i];
                var obj = ctx.objectStack[i];
                if (configurator.type && configurator.type.evaluateTemplate) {
                    return createFunction(configurator.type.evaluateTemplate, obj);
                }
            }
        },

        initResourceBundleAsync: function () {
            if (!this.configuration.resourceBundle) {
                return undefined;
            }
            return this.loadResourceBundleAsync(this.configuration.resourceBundle).then(function (resourceBundle) {
                this.resourceBundle = resourceBundle;
            }.bind(this));
        },

        loadResourceBundleAsync: function (url) {
            // for test mode
            if (!window.jQuery) {
                return core.Promise.resolve({
                    getText: function (id) {
                        return id;
                    }
                });
            }
            // load bundle + convert jquery promise to standard promise
            return new core.Promise(function (resolve, reject) {
                jQuery.sap.resources({
                    url: url,
                    async: true
                }).then(function (bundle) {
                    resolve(bundle);
                }, function (error) {
                    reject(error);
                });
            });
        },

        configure: function () {},

        configureAsync: function () {
            var args = arguments;
            return core.Promise.resolve().then(function () {
                return this.configure.apply(this, args);
            }.bind(this));
        },

        isInitialOrForced: function (value) {
            if (this.force ||
                typeof value === 'undefined' ||
                (core.isObject(value) && value === null) ||
                (core.isString(value) && value.length === 0)) {
                return true;
            }
            return false;
        }

    });

});
