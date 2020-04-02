// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/* global */
sap.ui.define([
    "sap/ushell/bootstrap/cdm/cdm.constants",
    "sap/ushell/bootstrap/common/common.boot.task",
    "sap/ushell/bootstrap/common/common.configure.ushell",
    "sap/ushell/bootstrap/common/common.load.launchpad",
    "sap/ushell/bootstrap/common/common.util",
    "sap/ushell/Config",
    "sap/ushell/bootstrap/common/common.create.configcontract.core",
    "sap/ui/model/json/JSONModel"
], function (oConstants, fnBootTask, fnConfigureUShell, fnLoadLaunchpad, oUtil, Config, CommonCreateConfigcontract, JSONModel) {
    "use strict";

    // merge cdm bootstrap config with sandbox defaults, further overrides can be done via the init method.
    function _getConfiguration(oAdditionalConfiguration, bNoSandboxDefaultConfiguration) {
        var oConfiguration = JSON.parse(JSON.stringify(oConstants.defaultConfig));
        return new Promise(function (fnResolve) {
            var aConfigurationPromises = [];
            if (!bNoSandboxDefaultConfiguration) {
                aConfigurationPromises.push(_loadConfiguration("flpSandbox/cdmFlpSandboxConfiguration.json"));
            }

            if (oAdditionalConfiguration) {
                if (typeof oAdditionalConfiguration === "string") {
                    aConfigurationPromises.push(_loadConfiguration(oAdditionalConfiguration));
                } else {
                    aConfigurationPromises.push(Promise.resolve(oAdditionalConfiguration));
                }
            }

            Promise.all(aConfigurationPromises).then(function (aConfigs) {
                oUtil.mergeConfig(oConfiguration, aConfigs[0], true);
                if (aConfigs.length > 1) {
                    oUtil.mergeConfig(oConfiguration, aConfigs[1], true);
                }

                fnResolve(oConfiguration);
            });
        });
    }

    function _loadConfiguration(sPath) {
        return new Promise(function (fnResolve) {
            var oModel = new JSONModel(sPath);
            oModel.attachRequestCompleted(function () {
                fnResolve(oModel.getData());
            });
        });
    }

    function _applyConfiguration(oConfiguration) {
        Config._reset();
        Config.registerConfiguration(null, CommonCreateConfigcontract.createConfigContract(oConfiguration));
    }

    function _cleanupControlInstances() {
        var fnDestroy = function (sId) {
            var oControl = sap.ui.getCore().byId(sId);
            if (oControl) {
                oControl.destroy();
            }
        };

        fnDestroy("userProfilingView");
        fnDestroy("defaultParametersSelector");
        fnDestroy("userSettingsDialog");
        fnDestroy("aboutBtn");
        fnDestroy("userPrefThemeSelector");
        fnDestroy("detailuserPrefThemeSelector");

        jQuery("#sapUshellFloatingContainerWrapper").remove();

        //MeArea
        fnDestroy("sapUshellMeAreaPopover");
        fnDestroy("logoutBtn");
        fnDestroy("openCatalogBtn");
        fnDestroy("userSettingsBtn");
        fnDestroy("ActionModeBtn");
    }

    return {
        // currently only CDM is supported
        ADAPTER: {
            //abap: "abap",
            //local: "local",
            cdm: "cdm"
        },
        /**
         * Initializes the FLP sandbox
         * @returns {Promise} a promise that is resolved when the sandbox bootstrap has finished
         */
        init: function (sAdapter, oConfiguration, bNoSandboxDefaultConfiguration) {
            var that = this;
            // currently only CDM is supported
            sAdapter = this.ADAPTER.cdm;
            // start sandbox and return a promise
            // sandbox is a singleton, so we can start it only once
            if (!that._oBootstrapFinished) {
                // sap.ushell.Container must be deleted to allow the boot-task to properly start.
                // if this does not happen, not all launchpad services will be recovered correctly
                delete sap.ushell.Container;
                that._oBootstrapFinished = new Promise(function (fnResolve) {
                    _getConfiguration(oConfiguration, bNoSandboxDefaultConfiguration).then(function (oConfiguration) {
                        // the configuration must be set to the window object, otherwise, the CDM data is not loaded.
                        window["sap-ushell-config"] = oConfiguration;

                        fnBootTask(sAdapter, function () {
                            // clear the personalization for a clean sandbox
                            sap.ushell.Container.getService("Personalization").delPersonalizationContainer("flp.settings.FlpSettings");
                            _applyConfiguration(oConfiguration);
                            fnResolve();
                        }.bind(this));
                    }.bind(this));
                });
            }
            return this._oBootstrapFinished;
        },

        placeAt: function (sDomId) {
            this.init().then(fnLoadLaunchpad.bind(null, sDomId));
        },

        applyConfiguration: function (oConfiguration, bNoSandboxDefaultConfiguration) {
            var oTargetConfiguration = _getConfiguration(oConfiguration, bNoSandboxDefaultConfiguration);
            // the configuration must be set to the window object, otherwise, the CDM data is not loaded.
            window["sap-ushell-config"] = oTargetConfiguration;

            _applyConfiguration(oTargetConfiguration);
            return Promise.resolve();
        },

        exit: function () {
            this._oBootstrapFinished = null;
            sap.ushell.Container.getRenderer("fiori2").destroy();
            sap.ui.getCore().getEventBus().destroy();
            _cleanupControlInstances();
            if (window.hasher && window.hasher.setHash) {
                window.hasher.setHash("Shell-home");
            }
        }
    };
});
