/* global window */
sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/ushell/services/Container"
], function (ObjectPath) {
    "use strict";

    // define ushell config
    ObjectPath.set(["sap-ushell-config"], {
        defaultRenderer: "fiori2",
        bootstrapPlugins: {
            "RuntimeAuthoringPlugin": {
                component: "sap.ushell.plugins.rta",
                config: {
                    validateAppVersion: false
                }
            },
            "PersonalizePlugin": {
                component: "sap.ushell.plugins.rta-personalize",
                config: {
                    validateAppVersion: false
                }
            }
        },
        renderers: {
            fiori2: {
                componentData: {
                    config: {
                        enableMergeAppAndShellHeaders: true,
                        enableSearch: false,
                        rootIntent: "Shell-home"
                    }
                }
            }
        },
        services: {
            "LaunchPage": {
                "adapter": {
                    "config": {
                        "groups": [{
                            "tiles": [{
                                "tileType": "sap.ushell.ui.tile.StaticTile",
                                "properties": {
                                    "title": "Worklist",
                                    "targetURL": "#Worklist-display"
                                }
                            }]
                        }]
                    }
                }
            },
            "ClientSideTargetResolution": {
                "adapter": {
                    "config": {
                        "inbounds": {
                            "Worklist-display": {
                                "semanticObject": "Worklist",
                                "action": "display",
                                "title": "Worklist",
                                "signature": {
                                    "parameters": {}
                                },
                                "resolutionResult": {
                                    "applicationType": "SAPUI5",
                                    "additionalInformation": "SAPUI5.Component=sap.ui.demo.worklist",
                                    "url": sap.ui.require.toUrl("sap/ui/demo/worklist")
                                }
                            }
                        }
                    }
                }
            },
            NavTargetResolution: {
                config: {
                    "runStandaloneAppFolderWhitelist": {
                        "*" : true
                    },
                    "allowTestUrlComponentConfig" : true,
                    "enableClientSideTargetResolution": true
                }
            },
            EndUserFeedback: {
                adapter: {
                    config: {
                        enabled: true
                    }
                }
            }
        }
    });

    var oFlpSandbox = {
        init: function () {
            /**
             * Initializes the FLP sandbox
             * @returns {Promise} a promise that is resolved when the sandbox bootstrap has finshed
             */
            // start sandbox and return a promise

            // sandbox is a singleton, so we can start it only once
            if (!this._oBootstrapFinished) {
                this._oBootstrapFinished = sap.ushell.bootstrap("local");
                this._oBootstrapFinished.then(function () {
                    sap.ushell.Container.createRenderer().placeAt("content");
                });
            }

            return this._oBootstrapFinished;
        }
    };

    return oFlpSandbox;
});