// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './Configurator'], function (core, Configurator) {
    "use strict";

    return Configurator.derive({

        initAsync: function (options) {
            this.properties = [];
            var promises = [];
            for (var i = 0; i < this.type.properties.length; ++i) {
                var property = this.type.properties[i];
                var propertyConfiguration = this.configuration[property.name];
                if (!propertyConfiguration) {
                    continue;
                }
                promises.push(this.createPropertyConfiguratorAsync(property, propertyConfiguration));
            }
            return core.Promise.all(promises);
        },

        createPropertyConfiguratorAsync: function (property, propertyConfiguration) {
            return this.createConfiguratorAsync({
                type: property.type,
                typeContext: property,
                configuration: propertyConfiguration
            }).then(function (configurator) {
                this.properties.push({
                    name: property.name,
                    configurator: configurator
                });
            }.bind(this));
        },

        isSuitable: function (options) {
            if (core.isObject(options.configuration) && core.isObject(options.type) && options.type.type === 'object') {
                return true;
            }
        },

        configure: function (obj, ctx) {
            ctx = this.createContext(ctx, obj);
            this.object = obj;
            for (var i = 0; i < this.properties.length; ++i) {
                var property = this.properties[i];
                obj[property.name] = property.configurator.configure(obj[property.name], ctx);
            }
            return obj;
        },

        configureAsync: function (obj, ctx) {
            ctx = this.createContext(ctx, obj);
            this.object = obj;
            var configureProperty = function (property) {
                return core.Promise.resolve().then(function () {
                    return property.configurator.configureAsync(obj[property.name], ctx);
                }).then(function (value) {
                    obj[property.name] = value;
                });
            };
            return core.Promise.all(core.map(this.properties, configureProperty)).then(function () {
                return obj;
            });
        }

    });

});
