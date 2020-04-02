// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine, sinaRequire, sinaLog */
// start sina init
window.sinaRequire = window.sinaRequire || (window.sap && window.sap.ui && window.sap.ui.require) || window.require;
window.sinaDefine = window.sinaDefine || (window.sap && window.sap.ui && window.sap.ui.define) || window.define;
window.sinaLog = window.sinaLog || (window.jQuery && window.jQuery.sap && window.jQuery.sap.log) || window.console;
// end sina init

var modules = ['../core/core', '../core/util', './Sina'];
var isSapRequire = window.sap && window.sap.ui && window.sap.ui.require && window.sap.ui.require === window.sinaRequire;
if (!isSapRequire) {
    modules.push('module'); // for standard require: load module with module meta information
}

sinaDefine(modules, function (core, util, Sina, module) {
    "use strict";

    return {

        createAsync: function (configuration) {
            return this._normalizeConfiguration(configuration).then(function (configuration) {
                return new core.Promise(function (resolve, reject) {
                    sinaRequire([configuration.provider], function (providerClass) {
                        var providerInstance = new providerClass(); // eslint-disable-line new-cap
                        var sina = new Sina(providerInstance);
                        return sina._initAsync.apply(sina, [configuration]).then(function () {
                            resolve(sina);
                        }, function (error) {
                            reject(error);
                        });
                    }, function (err) {
                        sinaLog.error('require error: ' + err);
                        reject(err);
                    });
                });
            });
        },

        createByTrialAsync: function (inputConfigurations, checkSuccessCallback) {
            var configurations;

            // normalize configurations
            return Promise.all(core.map(inputConfigurations, this._normalizeConfiguration.bind(this))).then(function (normalizedConfigurations) {

                // mixin url configuration into configurations
                configurations = normalizedConfigurations;
                return this._mixinUrlConfiguration(configurations);

            }.bind(this)).then(function () {

                // recursive creation of sina by loop at configurations
                // (first configuration which successfully creates sina wins)
                return this._createSinaRecursively(configurations, checkSuccessCallback);

            }.bind(this));

        },

        _normalizeConfiguration: function (configuration) {

            return new core.Promise(function (resolve, reject) {

                // check whether configuration is a string with a javascript module name
                if (core.isString(configuration) && configuration.indexOf('/') >= 0 && configuration.indexOf('Provider') < 0 && configuration[0] !== '{') {
                    sinaRequire([configuration], function (configuration) {
                        this._normalizeConfiguration(configuration).then(function (configuration) {
                            resolve(configuration);
                        });
                    }.bind(this));
                    return;
                }

                // check whether configuration is a string with the provider name
                if (core.isString(configuration) && configuration[0] !== '{') {
                    configuration = '{ "provider" : "' + configuration + '"}';
                }

                // check whether the configuration is a json string
                if (core.isString(configuration)) {
                    configuration = JSON.parse(configuration);
                }

                // normalize provider path
                if (configuration.provider.indexOf('/') < 0) {
                    // no paths in the provider url ->
                    // assume this is a shortcut like 'inav2' and calculate real url
                    // we cannot use the relative url to sinaFactory.js because 'require' loads
                    // using absolute path or using relative to html page
                    if (isSapRequire) {
                        configuration.provider = this._calculateProviderUrlSap(configuration.provider);
                    } else {
                        configuration.provider = this._calculateProviderUrl(configuration.provider);
                    }
                }

                resolve(configuration);

            }.bind(this));
        },

        _calculateProviderUrlSap: function (provider) {
            // do not use path /sap/ushell/renderers/fiori2/search/sinaNext/providers
            //
            // in core-ex-light-0     sap/ushell/renderers/fiori2/search/sinaNext is included
            // which is different to /sap/ushell/renderers/fiori2/search/sinaNext
            //
            // using /sap/ushell/renderers/fiori2/search/sinaNext/providers
            // seems to work but causes modules to be loaded twice causing strange effects
            var prefix = 'sap/ushell/renderers/fiori2/search/sinaNext/providers/';
            var suffix = '/Provider';
            return prefix + provider + suffix;
        },

        _calculateProviderUrl: function (provider) {
            var prefix = module.uri.split('/').slice(0, -1).join('/') + '/../providers/';
            var suffix = '/Provider';
            return prefix + provider + suffix;
        },

        _readConfigurationFromUrl: function () {
            var sinaConfiguration = util.getUrlParameter('sinaConfiguration');
            if (sinaConfiguration) {
                return this._normalizeConfiguration(sinaConfiguration);
            }
            var sinaProvider = util.getUrlParameter('sinaProvider');
            if (sinaProvider) {
                return this._normalizeConfiguration(sinaProvider);
            }
            return core.Promise.resolve();
        },

        _createSinaRecursively: function (configurations, checkSuccessCallback) {

            // set default for checkSuccesCallback
            checkSuccessCallback = checkSuccessCallback || function () {
                return true;
            };

            // helper for recursion
            var doCreate = function (index) {
                if (index >= configurations.length) {
                    return core.Promise.reject(new core.Exception('sina creation by trial failed'));
                }
                var configuration = configurations[index];
                return this.createAsync(configuration).then(function (sina) {
                    if (checkSuccessCallback(sina)) {
                        return sina;
                    }
                    return doCreate(index + 1);
                }, function () {
                    return doCreate(index + 1);
                });
            }.bind(this);

            // start recursion
            return doCreate(0);

        },

        _mixinUrlConfiguration: function (configurations) {
            return this._readConfigurationFromUrl().then(function (configurationFromUrl) {
                if (!configurationFromUrl) {
                    return;
                }
                var found = false;
                for (var i = 0; i < configurations.length; ++i) {
                    var configuration = configurations[i];

                    // remove configurations not matching url parameter, always accept dummy provider
                    if (configuration.provider.indexOf('/dummy/Provider') < 0 && configuration.provider !== configurationFromUrl.provider) {
                        configurations.splice(i, 1);
                        i--;
                        continue;
                    }

                    // mixin configuration from url
                    if (configuration.provider === configurationFromUrl.provider) {
                        found = true;
                        this._mergeConfiguration(configuration, configurationFromUrl);
                    }

                }
                if (!found) {
                    configurations.splice(0, 0, configurationFromUrl);
                }
            }.bind(this));
        },

        _mergeConfiguration: function (configuration1, configuration2) {
            // TODO deep merge
            for (var property in configuration2) {
                configuration1[property] = configuration2[property];
            }
        }

    };


});
