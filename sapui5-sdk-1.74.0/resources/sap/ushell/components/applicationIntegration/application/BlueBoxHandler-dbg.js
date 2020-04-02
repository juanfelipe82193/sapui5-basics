// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ushell/components/applicationIntegration/application/Application",
    "sap/ui/thirdparty/URI",
    "sap/ui/thirdparty/jquery"
], function (Application, URI, jQuery) {
    "use strict";

    function BlueBoxHandler () {
        var oCacheStorage,
            that = this,
            AppLifeCycle,
            oCustomCapabilitiesHandlers = {
                "isStateful": {
                    handler: function (appCapabilities, oContainer) {
                        if (appCapabilities && (appCapabilities.enabled === true || appCapabilities === true)) {
                            return true;
                        }

                        return false;
                    }
                },
                "isGUI": {
                    handler: function (appCapabilities, oContainer) {
                        if (appCapabilities && appCapabilities.protocol === "GUI") {
                            return true;
                        }

                        return false;
                    }
                },
                "isGUIStateful": {
                    handler: function (appCapabilities, oContainer) {
                        return that.isCapUT(oContainer, "isGUI") && that.isCapUT(oContainer, "isStateful");
                    }
                },
                "isFLP": {
                    handler: function (appCapabilities, oContainer) {
                        return !that.isCapUT(oContainer, "isGUI") && that.isCapUT(oContainer, "isStateful");
                    }
                }
            },
            oBlueBoxContainer = {},
            oSupportedTypes = {
            },
            oHandlers = {
            //Default is the base for every type
                "DEFAULT": {
                    //hash code generator.
                    storageIdentifier: function (sUrl) {
                        return this._stripURL(sUrl);
                    },
                    //Enables to alter and embed parameters to the URL for the Initialization process of the BLueBox
                    //parameters are the url of the container and the newly created container.
                    setup: function (oTarget, sStorageKey) {
                    },
                    //hash code generator.
                    //loading takes place in two steps, creating the container and then lcreating the application
                    //In some cases when we create the BlueBox RT it will load the initial application, in order to save performance
                    //true: will prevent from creating the application in the first interaction of creating the stateful container
                    //false: will perform the step of crating the application
                    //attributes
                    // oInnerControl: the Stateful container
                    isContentLoaded: function (oInnerControl) {
                        return false;
                    },
                    //define actions to perform in order to communicate the creation of the application
                    //attributes
                    // oInnerControl: the Stateful container
                    // sType: the content type
                    // url as created by the urlTemeplate to be passed to the BlueBox
                    // return:
                    // return a promise
                    create: function (oInnerControl, sUrl, sStorageKey) {
                        return Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "create", {
                            sCacheId: sStorageKey,
                            sUrl: sUrl,
                            sHash: window.hasher.getHash()
                        });
                    },
                    //Defines message to pass, in order to send a destroy application massage to the bluebox.
                    //attributes
                    // oInnerControl: the Stateful container
                    // return:
                    // return a promise
                    destroy: function (oInnerControl) {
                        return Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "destroy", {});
                    },
                    //Defines message to pass, in order to send a store request to the bluebox.
                    //attributes
                    // oInnerControl: the Stateful container
                    // return:
                    // return a promise
                    store: function (oInnerControl, sStorageKey) {
                        // return Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "store", {});
                    },
                    //Defines message to pass, in order to send a restore request to the bluebox.
                    //attributes
                    // oInnerControl: the Stateful container
                    // return:
                    // return a promise
                    restore: function (oInnerControl, sStorageKey) {
                        // return Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "restore", {});
                    }
                },
                "URL": {
                    setup: function (oTarget, sStorageKey) {
                        // var sUrl = oTarget.url,
                        //     oUrl = URI(sUrl);
                        //
                        // oUrl.addSearch("storage-key", sStorageKey);
                        // oTarget.url = oUrl.toString();
                    },
                    //we dont know the app Id we pass te hole url, in the Storage we manage it using sCacheId (this is for the keep alive)
                    create: function (oInnerControl, sUrl, sStorageKey) {
                        // to send the iframe the application parameters in case of ui5 app isolation
                        var oURI = new URI();

                        if (oURI.query(true).hasOwnProperty("sap-isolation-enabled")) {
                            var oParser = sap.ushell.Container.getService("URLParsing"),
                                sHash = oParser.getHash(oURI.toString());

                            if (sHash) {
                                var oHash = oParser.parseShellHash("#" + sHash),
                                    sParams = oParser.paramsToString(oHash.params);
                                if (sParams && sParams.length >= 0) {
                                    var oState1 = sap.ushell.Container.getService("AppState").createEmptyAppState(),
                                        oState2 = sap.ushell.Container.getService("AppState").createEmptyAppState(),
                                        sStartupParams = "";
                                    if (sParams.indexOf("sap-intent-param") >= 0) {
                                        sStartupParams = encodeURIComponent(sParams);
                                    } else {
                                        oState1.setData(sParams);
                                        oState1.save();
                                        sStartupParams = encodeURIComponent("sap-intent-param=" + oState1.getKey());
                                    }
                                    oState2.setData("sap-startup-params=" + sStartupParams);
                                    oState2.save();
                                    sUrl = sUrl.split("#")[0] + "&sap-intent-param=" + oState2.getKey() + "#" + window.hasher.getHash();
                                } else {
                                    sUrl = sUrl.split("#")[0] + "#" + window.hasher.getHash();
                                }
                            } else {
                                sUrl += "#" + window.hasher.getHash();
                            }
                        }

                        return Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "create", {
                            sCacheId: sStorageKey,
                            sUrl: sUrl,
                            sHash: window.hasher.getHash()
                        }, true);
                    },
                    destroy: function (oInnerControl, sStorageKey) {
                        return Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "destroy", {
                            sCacheId: sStorageKey
                        }, true);
                    },
                    store: function (oInnerControl, sStorageKey) {
                        return Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "store", {
                            sCacheId: sStorageKey
                        }, true);
                    },
                    restore: function (oInnerControl, sStorageKey) {
                        return Application.postMessageToIframeApp(oInnerControl, "sap.ushell.services.appLifeCycle", "restore", {
                            sCacheId: sStorageKey,
                            sHash: window.hasher.getHash()
                        }, true);
                    }
                }
            };


        //API:
        //
        //LRU(limit)
        //  Initialize LRU cache with default limit being 10 items
        this.init = function (oSetup, inConfig, inAppLifeCycle) {
            oCacheStorage = {};
            Application.init(this);
            AppLifeCycle = inAppLifeCycle;

            if (inConfig) {
                oSupportedTypes = jQuery.extend(true, oSupportedTypes, inConfig.supportedTypes);
            }
        };

        this.isStatefulContainerSupported = function  (oBlueBox) {
            var bIsSupported =
                this.isCapabilitySupported(oBlueBox, "sap.ushell.services.appLifeCycle", "create") &&
                this.isCapabilitySupported(oBlueBox, "sap.ushell.services.appLifeCycle", "destroy");

            return bIsSupported;
        };

        this.isKeepAliveSupported = function  (oBlueBox) {
            var bIsSupported =
                this.isCapabilitySupported(oBlueBox, "sap.ushell.services.appLifeCycle", "store") &&
                this.isCapabilitySupported(oBlueBox, "sap.ushell.services.appLifeCycle", "restore");

            return bIsSupported;
        };

        this.mapCapabilities= function (oContainer, aCaps) {
            this.setCapabilities(oContainer, aCaps);
        };

        this.getCapabilities = function (oBlueBox) {
            return oBlueBoxContainer[oBlueBox].oCapMap;
        };

        this.isCapabilitySupported = function (oBlueBox, sServiceName, sInterface) {
            if (oBlueBoxContainer[oBlueBox] && oBlueBoxContainer[oBlueBox].oCapMap && oBlueBoxContainer[oBlueBox].oCapMap[sServiceName]) {
                    return !!oBlueBoxContainer[oBlueBox].oCapMap[sServiceName][sInterface];
            }

            return false;
        };

        this.setCapabilities = function (oBlueBox, oCap) {
            var oCapMap;

            if (!oBlueBoxContainer[oBlueBox]) {
                oBlueBoxContainer[oBlueBox] = {
                    BlueBox: oBlueBox
                };
            }

            if (!oBlueBoxContainer[oBlueBox].oCapMap) {
                oBlueBoxContainer[oBlueBox].oCapMap = {};
            }

            oCapMap = oBlueBoxContainer[oBlueBox].oCapMap;

            Object.keys(oCap).forEach(function (key) {
                var  oCapEntry = oCap[key],
                    oCapMapService;

                if (!oCapMap[oCapEntry.service]) {
                    oCapMap[oCapEntry.service] = {};
                }

                oCapMapService = oCapMap[oCapEntry.service];

                oCapMapService[oCapEntry.action] = true;

            });

            // set stateful in order to disable rendering of container
            if (!oBlueBox.getIsStateful() && this.isStatefulContainerSupported(oBlueBox)) {
                oBlueBox.setIsStateful(true);
            }

        };

        this.hasIFrame = function (oBlueBox) {
            if (oBlueBox && oBlueBox._getIFrame) {
                return true;
            }

            return false;
        };

        this.getStorageKey = function (oBlueBox) {
            return oBlueBoxContainer[oBlueBox].sStorageKey;
        };

        this.setAppCapabilities = function (oBlueBox, appCapabilities) {
            if (!oBlueBoxContainer[oBlueBox]) {
                oBlueBoxContainer[oBlueBox] = {
                    BlueBox: oBlueBox
                };
            }

            oBlueBoxContainer[oBlueBox].appCapabilities = appCapabilities;
        };

        this.forEach = function (callback) {
            var key;

            for (key in oBlueBoxContainer) {
                if (oBlueBoxContainer.hasOwnProperty(key)) {
                    callback(oBlueBoxContainer[key].BlueBox);
                }
            }
        };

        this.isCapByTarget = function (oTarget, attr) {
            // check if we have custom handling for this attribute
            if (oTarget.appCapabilities === undefined) {
                return false;
            }

            if (oCustomCapabilitiesHandlers[attr] && oTarget && oTarget.appCapabilities) {
                return oCustomCapabilitiesHandlers[attr].handler(oTarget.appCapabilities);
            }
            // get the attribute value from the appCapabilities
            // if not define return false
            return oTarget.appCapabilities[attr] || false;
        };

        this.isCapUT = function (oBlueBox, attr) {
            // check if we have custom handling for this attribute
            var oBBInstance = oBlueBoxContainer[oBlueBox];

            // check if we have custom handling for this attribute
            if (oBBInstance  === undefined|| oBBInstance.appCapabilities === undefined) {
                return false;
            }

            if (oCustomCapabilitiesHandlers[attr] && oBBInstance) {
                return oCustomCapabilitiesHandlers[attr].handler(oBBInstance.appCapabilities, oBlueBox);
            }
            // get the attribute value from the appCapabilities
            // if not define return false
            return oBBInstance.appCapabilities[attr] || false;
        };

        this.setStorageKey = function (oBlueBox, setStorageKey) {
            if (!oBlueBoxContainer[oBlueBox]) {
                oBlueBoxContainer[oBlueBox] = {
                    BlueBox: oBlueBox
                };
            }

            oBlueBoxContainer[oBlueBox].sStorageKey = setStorageKey;
        };

        this.getStorageKey = function (oBlueBox) {
            if (!oBlueBoxContainer[oBlueBox]) {
                return undefined;
            }
            return oBlueBoxContainer[oBlueBox].sStorageKey;
        };

        this.getHandler = function () {
            //Default is the base for every Type
            return jQuery.extend(true, oHandlers.DEFAULT, oHandlers["URL"]);
        };

        this._stripURL = function (sUrl) {
            var nDomainParamStart = sUrl.indexOf("?"),
                nDomainHashStart = sUrl.indexOf("#"),
                domainUrl;

            if (nDomainParamStart >= 0) {
                domainUrl = sUrl.substr(0, nDomainParamStart);
            } else if (nDomainHashStart >= 0) {
                domainUrl = sUrl.substr(0, nDomainHashStart);
            } else {
                domainUrl = sUrl;
            }

            return domainUrl;
        };

        this.deleteStateFul = function (sUrl) {
            var sDomainUrl = this._stripURL(sUrl);

            return this.delete(sDomainUrl);
        };

        this.getStateFul = function (sUrl) {
            var sDomainUrl = this._stripURL(sUrl);

            return this.get(sDomainUrl);
        };

        // this.createCachedInstance = function (oConfig) {
        //     var oAppContainer = Application.createApplicationContainer(oConfig.setup.id, {
        //         additionalInformation: undefined,
        //         applicationConfiguration: undefined,
        //         applicationType: "URL",
        //         fullWidth: undefined,
        //         navigationMode: "embedded",
        //         targetNavigationMode: "explace",
        //         text: undefined,
        //         url: oConfig.setup.sUrl,
        //         shellUIService: oSetup.oShellUIService.getInterface(),
        //         appIsolationService: oSetup.oAppIsolationService.getInterface()
        //     }, this);
        //
        //     oCacheStorage[oConfig.setup.sUrl] = oAppContainer;
        //     AppLifeCycle.addControl(oAppContainer);
        // };

        this.destroyApp = function (sAppId) {
            AppLifeCycle.postMessageToIframeApp("sap.ushell.services.appLifeCycle", "destroy", {
                appId: sAppId
            });
        };

        this.openApp = function (sAppId) {
            AppLifeCycle.postMessageToIframeApp("sap.ushell.services.appLifeCycle", "create", {
                appId: sAppId,
                sHash: window.hasher.getHash()
            });
        };

        this.storeApp = function (sAppId) {
            //TODO: support store messasge
            AppLifeCycle.postMessageToIframeApp("sap.ushell.services.appLifeCycle", "store", {
                appId: sAppId,
                sHash: window.hasher.getHash()
            });
        };

        this.restoreApp = function (sAppId) {
            //TODO: support restore messasge
            AppLifeCycle.postMessageToIframeApp("sap.ushell.services.appLifeCycle", "restore", {
                appId: sAppId,
                sHash: window.hasher.getHash()
            });
        };

        //delete(sUrl)
        //  delete a single entry from the cols start cache
        this.delete = function (sUrl) {
            if (oCacheStorage[sUrl]) {
                delete oCacheStorage[sUrl];
            }
        };


        //get(sUrl)
        //  Retrieve a single entry from the cols start cache
        this.get = function (sUrl) {
            return oCacheStorage[sUrl];
        };

        this.getById = function (sId) {
            for (var sKey in oCacheStorage) {
                if (oCacheStorage.hasOwnProperty(sKey)) {
                    var oEntry = oCacheStorage[sKey];

                    if (oEntry.sId === sId) {
                        return oEntry;
                    }
                }
            }
        };

        //set(key, value)
        //  Change or add a new value in the cache
        //  We overwrite the entry if it already exists
        this.set = function (sUrl, oIframe) {
            var sStripUrl = this._stripURL(sUrl);

            oCacheStorage[sStripUrl] = oIframe;
        };

        //forEach(function(){})
        //  Traverse through the cache elements using a callback function
        //  Returns args [node element, element number, cache instance] for the callback function to use
        // this.forEach = function (callback) {
        //     oCacheStorage.forEach(callback);
        // };

        //toJSON()
        //  Returns a JSON representation of the cache

        //toString()
        //  Returns a String representation of the cache

    }


    return new BlueBoxHandler();
}, /* bExport= */ true);