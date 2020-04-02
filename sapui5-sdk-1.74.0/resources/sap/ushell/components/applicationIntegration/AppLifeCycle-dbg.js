// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview handle all the resources for the different applications.
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ushell/components/applicationIntegration/elements/model",
    "sap/ushell/components/applicationIntegration/Storage",
    "sap/ushell/components/applicationIntegration/application/BlueBoxHandler",
    "sap/ushell/ui5service/ShellUIService",
    "sap/ushell/components/applicationIntegration/application/Application",
    "sap/ushell/components/applicationIntegration/relatedServices/RelatedServices",
    "sap/ushell/components/applicationIntegration/relatedShellElements/RelatedShellElements",
    "sap/ushell/components/applicationIntegration/configuration/AppMeta",
    "sap/ushell/services/AppConfiguration",
    "sap/ushell/utils",
    "sap/ui/Device",
    "sap/ushell/Config",
    "sap/ushell/ui5service/AppIsolationService",
    "sap/ushell/ApplicationType",
    "sap/ushell/components/applicationIntegration/DelegationBootstrap",
    "sap/base/util/UriParameters",
    "sap/ui/thirdparty/jquery",
    "sap/base/Log"
], function (
    ElementsModel,
    Storage,
    BlueBoxHandler,
    ShellUIService,
    Application,
    RelatedServices,
    RelatedShellElements,
    AppMeta,
    AppConfiguration,
    utils,
    Device,
    Config,
    AppIsolationService,
    ApplicationType,
    DelegationBootstrap,
    UriParameters,
    jQuery,
    Log
) {
    "use strict";

    function AppLifeCycle () {
        //Dangling controls is a queue of requests to change shell elements attributes, requested by the application in the process of createContent before the actual application state was apply.
        var oViewPortContainer,
            aCachedAppTypes = ["URL"],
            sRootIntent,
            oShellUIService,
            appState,
            oIntentToStorageId = {},
            oAppIsolationService,
            disableHomeAppCache = false,
            oCurrentApplication = {},
            oActualElementsModelStateMap = {
                home: {
                    embedded: "embedded-home",
                    headerless: "headerless-home",
                    merged: "blank-home",
                    blank: "blank-home"
                },
                app: {
                    minimal: "minimal",
                    app: "app",
                    standalone: "standalone",
                    embedded: "embedded",
                    headerless: "headerless",
                    merged: "merged",
                    home: "home",
                    blank: "blank",
                    lean: "lean"
                }
            },
            oStatefulApplicationContainer,
            oGlobalShellCommunicationHandlers = [],
            oGlobalIframeCommunicationHandlers = {},
            isBackNavigationChanged = false;

        this.shellElements = function () {
            return RelatedShellElements;
        };

        this.service = function () {
            return RelatedServices;
        };

        ///////////////////APPLICATION INTEGRATION API///////////////////////////////
        ///////////////////END APPLICATION INTEGRATION API///////////////////////////////

        this.isCurrentApp = function (appId) {
            return (oCurrentApplication.appId === appId);
        };

        this.isAppWithSimilarShellHashInCache = function (appId, sFixedShellHash) {
            var oAppEntry = Storage.get(appId);

            if (oAppEntry) {
                if (oAppEntry.shellHash === sFixedShellHash) {
                    return true;
                }
                return false;
            }
            return false;
        };

        this.isAppInCache = function (appId) {
            return !!Storage.get(appId);
        };

        this.normalizeAppId = function (sAppId) {
            var sCmp = "-component",
                isCmp = sAppId.endsWith(sCmp);

            if (isCmp) {
                return sAppId.substring(0, sAppId.length - sCmp.length);
            }
            return sAppId;
        };

        this.onComponentCreated = function (oEvent, sChannel, oData) {
            var oApp = oData.component,
                sAppId = this.normalizeAppId(oApp.getId());

            if (this.isAppInCache(sAppId)) {
                Storage.get(sAppId).app = oApp;
                this.active(sAppId);
            } else {
                oCurrentApplication.app = oApp;

                if (oApp.active) {
                    oApp.active();
                }
            }
        };

        this.onGetMe = function (oEvent, sChannel, oData) {
            oData.AppLifeCycle = this;
        };

        this.store = function (sAppId) {
            var oStorageEntry = Storage.get(sAppId);

            if (oStorageEntry) {
                Application.store(oStorageEntry.app);
                RelatedServices.store(oStorageEntry.service);
                AppMeta.store(oStorageEntry.meta);
            }
        };

        this.destroy = function (sAppId, oFrom) {
            // TODO remove entry from cache (if it is in cache).
            // destroy all related resources.
            var oStorageEntry = Storage.get(sAppId),
                oInnerControl;

            function doDestroy() {
                Application.destroy(oFrom);
                RelatedShellElements.destroy(oFrom);
                AppMeta.destroy(oFrom);
            }

            this.removeControl(sAppId);

            if (oStorageEntry) {
                oInnerControl = BlueBoxHandler.getStateFul(oFrom.getUrl());

                if (oInnerControl && BlueBoxHandler.isStatefulContainerSupported(oInnerControl)) {
                    var oHandler = BlueBoxHandler.getHandler();

                    //in case this is a stateful container
                    //invoke destroy the application with the ID.
                    oHandler.destroy(oInnerControl, sAppId);
                    //TODO: then(check number instances === 0 evict BlueBox?????Think/plugins)
                } else {
                    //Once we destroy the container the application destroy will be create, no need to call Application.destroy(oStorageEntry.app)
                    oStorageEntry.container.destroy();
                    BlueBoxHandler.deleteStateFul(oFrom.getUrl());
                }

                //remove the entry from the LRU Storage
                Storage.remove(sAppId);
            } else {
                //If the application running in an iframe registered for "before close" event,
                // we first post it a message to prepare for closing (usually, the app will close
                // its session or release locks held on the server), and only when the iframe send a response
                // back that it finished processing the event, we will continue to destroy the app (iframe).
                //If the app in the iframe did not register to the event, we destroy the app immediately exactly
                // as it was done before.
                //Note that even if the response from the iframe is not successful, we still destroy the app
                // because the second app that we navigated to was already created so we can not stop
                // the actual navigation (this is the same behaviour that we had before).
                //This mechanism was added to solve the change made in Chrome to disallow Sync XHR on
                // browser close.
                var oPromise = oFrom && oFrom.sendBeforeAppCloseEvent && oFrom.sendBeforeAppCloseEvent();

                if (oPromise === undefined) {
                    doDestroy();
                } else {
                    oPromise.then(function () {
                        doDestroy();
                    }, function (sError) {
                        doDestroy();
                        jQuery.sap.log.error("FLP got a failed response from the iframe for the 'sap.ushell.services.CrossApplicationNavigation.beforeAppCloseEvent' message sent", sError, "sap.ushell.components.applicationIntegration.AppLifeCycle.js");
                    });
                }
            }
        };

        this.restore = function (sAppId) {
            var oStorageEntry = Storage.get(sAppId);

            if (oStorageEntry) {
                Application.restore(oStorageEntry.app);
                RelatedServices.restore(oStorageEntry.service);
                AppMeta.restore(oStorageEntry.meta);
            }
        };

        this.active = function (sAppId) {
            var oStorageEntry = Storage.get(sAppId);

            if (oStorageEntry) {
                Application.active(oStorageEntry.app);
            }
        };

        this.handleExitStateful = function (sFromId, oFrom) {
            var sBBStorageId,
                oHandlers = BlueBoxHandler.getHandler();

            if (Storage.get(sFromId)) {
                // in this case the store of the currently running application, so we do not need to pass the sCacheId
                sBBStorageId = BlueBoxHandler.getStorageKey(oFrom);

                if (sBBStorageId && BlueBoxHandler.isKeepAliveSupported(oFrom)) {
                    return oHandlers.store(oFrom, sBBStorageId);
                }

                return Promise.resolve();
            }
            // in this case the destroy of the currently running application, so we do not need to pass the sCacheId
            return oHandlers.destroy(oFrom);
        };

        this.handleExitApplication = function (sFromId, oFrom, handleExitApplication) {
            var bIsAppOfTypeCachable;

            if (sFromId && oFrom) { // FIXME oFrom.getApplicationType is not defined for Homepage and AppFinder in case disableHomeAppCache is true
                if (oFrom.getUrl() && BlueBoxHandler.isStatefulContainerSupported(BlueBoxHandler.getStateFul(oFrom.getUrl()))) {
                    // Update the code to load stateful according
                    this.handleExitStateful(sFromId, oFrom);
                } else if (Storage.get(sFromId)) {
                    this.store(sFromId);
                } else if ((oFrom.getIsStateful && oFrom.getIsStateful()) || (oFrom.getApplicationType && this.applicationIsStatefulType(oFrom.getApplicationType()))) {
                    //support lifecycle for statfull applciations.
                    //In case of navigation to home or appFinder, end the SAP gui session
                    if (handleExitApplication) {
                        oFrom.postMessageRequest("sap.gui.triggerCloseSessionImmediately");
                    }
                } else {
                    bIsAppOfTypeCachable = aCachedAppTypes.indexOf(oFrom.getApplicationType) >= 0;

                    //distroy the application and its resources
                    if (this.isAppOfTypeCached(sFromId, bIsAppOfTypeCachable) === false) {
                        this.destroy(sFromId, oFrom);
                    }
                }

                //handle the case of appFiner
                if (sFromId.indexOf("Shell-appfinder-component") > 0) {
                    sap.ui.getCore().getEventBus().publish("sap.ushell", "appFinderAfterNavigate");
                }
            }
        };

        //call lifecycle interface "setInitialConfiguration"
        this.onAfterNavigate = function (sFromId, oFrom, sToId, oTo) {
            //destroy the application if not cached or marked for reuse.
            var bIsShellApps = sToId.indexOf("Shell-appfinder-component") > 0 || sToId.indexOf("Shell-home-component") > 0;

            this.handleExitApplication(sFromId, oFrom, bIsShellApps);

            // invoke the life cycle interface "setInitialConfiguration" for the restored application
            if (sToId) {
                if (Storage.get(sToId)) {
                    this.restore(sToId);
                } else {
                    // this application is not cached
                    // here we can place code that handles the starting of the application in the after navigation life cycle.
                }
            }
        };

        this.storeApp = function (appId, oContainer, oTarget, sFixedShellHash) {
            if (!this.isAppInCache(appId)) {
                Storage.set(appId, {
                    service: RelatedServices.create(),
                    shellHash: sFixedShellHash,
                    appId: appId,
                    stt: "loading",
                    appRelatedElements: RelatedShellElements.getAppRelatedElement(),
                    container: oContainer,
                    meta: AppConfiguration.getMetadata(oTarget),
                    app: undefined
                });
                oIntentToStorageId[sFixedShellHash] = appId;
                // if (BlueBoxHandler.isStatefulContainerSupported(oContainer)) {
                //in case of stateful container - map BlueBox to storageKey
                BlueBoxHandler.setStorageKey(oContainer, appId);
                // }

                return true;
            }
            return false;
        };

        this.restoreApp = function (appId) {
            if (this.isAppInCache(appId)) {
                oCurrentApplication = Storage.get(appId);

                if (BlueBoxHandler.getStorageKey(oCurrentApplication.container)) {
                    //in case of stateful container - override BlueBox to storageKey
                    BlueBoxHandler.setStorageKey(oCurrentApplication.container, appId);
                }

                // TODO restore meta
                // restore elements model
                // restore appState
                // restore all related application resources
            }
        };

        this.isAppOfTypeCached = function (appId, bIsAppOfTypeCachable) {
            //handle the root intent
            if (!disableHomeAppCache && appId.indexOf(sRootIntent) !== -1) {
                return true;
            }
            if (!disableHomeAppCache && appId.indexOf("Shell-appfinder") !== -1) { // TODO consider to make intent configurable
                return true;
            }
            //TODO add by configuration a list of persisted applications

            //In order to enable application to play with the keep alive, we read the keep attribute of the hash, if it is true application is cachable.
            if (new UriParameters(window.location.href).get("sap-keep-alive") == "true" && bIsAppOfTypeCachable) {
                return true;
            }
            return false;
        };

        AppLifeCycle.prototype._getURLParsing = function () {
            if (!this._oURLParsing) {
                this._oURLParsing = sap.ushell.Container.getService("URLParsing");
            }
            return this._oURLParsing;
        };

        this.calculateAppType = function (oTarget) {
            if (oTarget.applicationType === "URL" && oTarget.additionalInformation && oTarget.additionalInformation.startsWith("SAPUI5.Component=")) {
                return "SAPUI5";
            }
            return oTarget.applicationType;
        };

        this.getStatefulCapabilities = function (oTarget) {
            if (oTarget.appCapabilities && oTarget.appCapabilities &&
                oTarget.appCapabilities.statefulContainer) {
                return oTarget.appCapabilities.statefulContainer;
            }

            return undefined;
        };

        this.isNotifyInnerAppRouteChangeEnabled = function (oTarget) {
            if (oTarget.appCapabilities && oTarget.appCapabilities.notifyInnerAppRouteChange) {
                return true;
            }

            return false;
        };

        this.isStatefulCapabilityEnabled = function (oTarget) {
            var oStatefulCap = this.getStatefulCapabilities(oTarget);

            if (oStatefulCap && (oStatefulCap.enabled === true || oStatefulCap === true)) {
                return true;
            }

            return false;
        };

        this.isGUICapabilityEnabled = function (oTarget) {
            var oStatefulCap = this.getStatefulCapabilities(oTarget);

            if (oStatefulCap && oStatefulCap.protocol === "GUI") {
                return true;
            }

            return false;
        };

        this.isFLPCapabilityEnabled = function (oTarget) {
            return !this.isGUICapabilityEnabled(oTarget) && this.isStatefulCapabilityEnabled(oTarget);
        };

        this.isGUIStatefulCapabilityEnabled = function (oTarget) {
            return this.isGUICapabilityEnabled(oTarget) && this.isStatefulCapabilityEnabled(oTarget);
        };

        this.openApp = function (inAppId, oTarget, oShellHash, sFixedShellHash) {
            var oContainer,
                sIntent,
                bIsAppOfTypeCachable = aCachedAppTypes.indexOf(oTarget.applicationType) >= 0;

            //format appId, the is the storage identifier
            var appId = "application" + inAppId;

            //this case will handle the stateful containers flow.
            oContainer = BlueBoxHandler.getStateFul(oTarget.url);

            if (oContainer && BlueBoxHandler.isStatefulContainerSupported(oContainer)) {
                if (this.isAppOfTypeCached(appId, bIsAppOfTypeCachable) || this.isCachedEnabledAsAppParameter(oShellHash, oTarget)) {
                    //this is the case where we have a stateful container and keep alive
                    //is cached application
                    if (!this.isAppInCache(appId)) {
                        this.storeApp(appId, oContainer, oTarget, sFixedShellHash);
                    }

                    this.restoreApp(appId);
                } else {
                    //create application that is not persisted and not cashed
                    oCurrentApplication = {
                        appId: appId,
                        stt: "loading",
                        container: oContainer,
                        meta: AppConfiguration.getMetadata(oTarget),
                        app: undefined
                    };
                }
            } else if (this.isAppOfTypeCached(appId, bIsAppOfTypeCachable) || this.isCachedEnabledAsAppParameter(oShellHash, oTarget)) {
                //is cached application
                if (!this.isAppInCache(appId)) {
                    oContainer = this.createApplicationContainer(inAppId, oTarget);
                    this.storeApp(appId, oContainer, oTarget, sFixedShellHash);
                    BlueBoxHandler.set(oTarget.url, oContainer);
                }

                this.restoreApp(appId);
            } else if (this.applicationIsStatefulType(oTarget.applicationType) || BlueBoxHandler.isCapByTarget(oTarget, "isGUIStateful")) {
                //This option should be deprecated and always use the ColdStart stateful (BlueBoxHandler.isTypeSupported, the case above)
                //is cached application
                oContainer = this.getStatefulContainer(oTarget.applicationType);
                if (!oContainer) {
                    oContainer = this.createApplicationContainer(inAppId, oTarget);
                    this.setStatefulContainer(oTarget.applicationType, oContainer);
                    oContainer.setIsStateful(true);
                }

                //create application that is not persisted and not cashed
                oCurrentApplication = {
                    appId: appId,
                    stt: "loading",
                    container: oContainer,
                    meta: AppConfiguration.getMetadata(oTarget),
                    app: undefined
                };
            } else {
                if (oContainer) {
                    sIntent = oShellHash.semanticObject + "-" + oShellHash.action;
                    this.removeApplication(sIntent);
                }
                oContainer = this.createApplicationContainer(inAppId, oTarget);
                BlueBoxHandler.set(oTarget.url, oContainer);

                if (BlueBoxHandler.isCapUT(oContainer, "isFLP")) {
                    BlueBoxHandler.setCapabilities(oContainer, [
                        {
                            service: "sap.ushell.services.appLifeCycle",
                            action: "create"
                        },
                        {
                            service: "sap.ushell.services.appLifeCycle",
                            action: "destroy"
                        }
                    ]);
                }

                // //create application that is not persisted and not cashed
                oCurrentApplication = {
                    appId: appId,
                    stt: "loading",
                    container: oContainer,
                    meta: AppConfiguration.getMetadata(oTarget),
                    app: undefined
                };
            }
        };

        this.getAppMeta = function () {
            return AppMeta;
        };

        this.evict = function (oEntry) {
            var oInnerControl,
                oStorageEntry = oEntry.value,
                sAppId = oEntry.key;

            this.removeControl(sAppId);

            if (oStorageEntry.container.getUrl && oStorageEntry.container.getUrl()) {
                oInnerControl = BlueBoxHandler.getStateFul(oStorageEntry.container.getUrl());
            }

            if (oInnerControl) {
                var oHandler = BlueBoxHandler.getHandler();

                //in case this is a stateful container
                //invoke destroy the application with the ID.
                oHandler.destroy(oInnerControl, sAppId);
                //TODO: then(check number instances === 0 evict BlueBox?????Think/plugins)
            } else {
                //Once we destroy the container the application destroy will be create, no need to call Application.destroy(oStorageEntry.app)
                oStorageEntry.container.destroy();
            }
        };

        this.init = function (inAppState, oInViewPortContainer, inSRootIntent, inDisableHomeAppCache, oShellUIServiceChange, aActions, oCacheConfigurations) {
            var that = this,
                nCacheSize;

            // calculate Cache size
            if (Device.system.phone) {
                nCacheSize = 10;

                if (oCacheConfigurations && oCacheConfigurations.limit && oCacheConfigurations.limit.phone) {
                    nCacheSize = oCacheConfigurations.limit.phone;
                }
            } else if (Device.system.tablet) {
                nCacheSize = 10;

                if (oCacheConfigurations && oCacheConfigurations.limit && oCacheConfigurations.limit.tablet) {
                    nCacheSize = oCacheConfigurations.limit.tablet;
                }
            } else if (Device.system.desktop) {
                nCacheSize = 15;

                if (oCacheConfigurations && oCacheConfigurations.limit && oCacheConfigurations.limit.desktop) {
                    nCacheSize = oCacheConfigurations.limit.desktop;
                }
            } else {
                nCacheSize = 10;
            }

            DelegationBootstrap.init(this.registerShellCommunicationHandler, this.postMessageToIframeApp);
            DelegationBootstrap.bootstrap();

            oShellUIService = new ShellUIService({
                scopeObject: oShellUIServiceChange.ownerComponent,
                scopeType: "component"
            });

            oAppIsolationService = new AppIsolationService({
                scopeObject: oShellUIServiceChange.ownerComponent,
                scopeType: "component"
            });

            appState = inAppState;
            oViewPortContainer = oInViewPortContainer;
            sRootIntent = inSRootIntent;
            AppMeta.init(sRootIntent);
            disableHomeAppCache = inDisableHomeAppCache;

            BlueBoxHandler.init({
                oShellUIService: oShellUIService,
                oAppIsolationService: oAppIsolationService
            }, oCacheConfigurations, this);

            //Init storage, and register evict functionality.
            Storage.init(nCacheSize, function (evictObj) {
                this.evict(evictObj);
            }.bind(this));

            //setup & register communication
            this.registerShellCommunicationHandler({
                "sap.ushell.services.appLifeCycle": {
                    oRequestCalls: {
                        "create": {
                            isActiveOnly: true,
                            distributionType: ["URL"],
                            fnResponseHandler: function (oPromoise) {
                                oPromoise.then(function (oRespData) {
                                    Log.info("sap.ushell.services.appLifeCycle.create:" + oRespData);
                                }).catch(function (oError) {
                                    Log.error("Error: sap.ushell.services.appLifeCycle.create:" + oError);
                                });
                            }
                        },
                        "destroy": {
                            isActiveOnly: true,
                            distributionType: ["URL"],
                            fnResponseHandler: function (oPromoise) {
                                oPromoise.then(function (oRespData) {
                                    Log.info("sap.ushell.services.appLifeCycle.destroy:" + oRespData);
                                }).catch(function (oError) {
                                    Log.error("Error: sap.ushell.services.appLifeCycle.destroy:" + oError);
                                });
                            }
                        },
                        "store": {
                            isActiveOnly: true,
                            distributionType: ["URL"],
                            fnResponseHandler: function (oPromoise) {
                                oPromoise.then(function (oRespData) {
                                    Log.info("sap.ushell.services.appLifeCycle.store:" + oRespData);
                                }).catch(function (oError) {
                                    Log.error("Error: sap.ushell.services.appLifeCycle.store:" + oError);
                                });
                            }
                        },
                        "restore": {
                            isActiveOnly: true,
                            distributionType: ["URL"],
                            fnResponseHandler: function (oPromoise) {
                                oPromoise.then(function (oRespData) {
                                    Log.info("sap.ushell.services.appLifeCycle.restore:" + oRespData);
                                }).catch(function (oError) {
                                    Log.error("Error: sap.ushell.services.appLifeCycle.restore:" + oError);
                                });
                            }
                        }
                    },
                    oServiceCalls: {
                        "subscribe": {
                            executeServiceCallFn: function (oServiceParams) {
                                BlueBoxHandler.mapCapabilities(oServiceParams.oContainer, oServiceParams.oMessageData.body);
                                return new jQuery.Deferred().resolve({}).promise();
                            }
                        },
                        "setup": {
                            executeServiceCallFn: function (oServiceParams) {
                                return new jQuery.Deferred().resolve().promise();
                            }
                        }
                    }
                }
            });


            this.registerShellCommunicationHandler({
                "sap.ushell.eventDelegation": {
                    oRequestCalls: {
                        "registerEventHandler": {
                            isActiveOnly: false,
                            distributionType: ["URL"]
                        }
                    },
                    oServiceCalls: {
                        "registerEventHandler": {
                            executeServiceCallFn: function (oServiceParams) {
                                var oResp = registerEventHandlerFunctionCall(oServiceParams);
                                return new jQuery.Deferred().resolve(oResp).promise();
                            }
                        }
                    }
                }
            });

            function registerEventHandlerFunctionCall (oServiceParams) {
                var eventObj = oServiceParams.oMessageData.body.eventSerObj;
                return that.registerEventHandler(eventObj);
            }

            //TODO add unsubscribe
            sap.ui.getCore().getEventBus().subscribe("sap.ushell", "appComponentLoaded", this.onComponentCreated, this);
            sap.ui.getCore().getEventBus().subscribe("sap.ushell", "getAppLifeCycle", this.onGetMe, this);

            RelatedShellElements.init(this.getElementsModel(), aActions);
        };

        this.addControl = function (oControl) {
            oViewPortContainer.addCenterViewPort(oControl);
        };

        this.removeControl = function (sId) {
            var oBlueBox = BlueBoxHandler.getById(sId),
                bIsStatefull = BlueBoxHandler.isStatefulContainerSupported(oBlueBox);

            if (!bIsStatefull) {
                oViewPortContainer.removeCenterViewPort(sId, true);
            }
        };

        this.removeApplication = function (sIntent) {
            var oInnerControl = this.getControl(sIntent);

            if (oInnerControl) {
                this.removeControl(oInnerControl.getId());
                oInnerControl.destroy();
            }
        };

        this.getControl = function (sIntent) {
            return oViewPortContainer
                && (oViewPortContainer.getViewPortControl("centerViewPort", "application-" + sIntent)
                    || oViewPortContainer.getViewPortControl("centerViewPort", "applicationShellPage-" + sIntent));
        };

        this.getViewPortContainer = function () {
            return oViewPortContainer;
        };

        this.navTo = function (sId) {
            oViewPortContainer.navTo("centerViewPort", sId, "show");
        };

        this.getCurrentApplication = function () {
            return oCurrentApplication;
        };

        this.setApplicationFullWidth = function (bIsFull) {
            var oCurrent = this.getCurrentApplication();

            //validate that we have a valid applicationContainer
            if (oCurrent.container) {
                oCurrent.container.toggleStyleClass("sapUShellApplicationContainerLimitedWidth", !bIsFull);
            }
        };

        // FIXME: It would be better to call a function that simply
        // and intentionally loads the dependencies of the UI5
        // application, rather than creating a component and expecting
        // the dependencies to be loaded as a side effect.
        // Moreover, the comment reads "load ui5 component via shell service"
        // however that is 'not needed' since the loaded component
        // is not used. We should evaluate the possible performance
        // hit taken due to this implicit means to an end.
        this.createComponent = function (oResolvedHashFragment, oParsedShellHash) {
            this.shellElements().setDangling(true);
            return Application.createComponent(oResolvedHashFragment, oParsedShellHash);
        };

        this.getAppContainer = function (sAppId, oResolvedNavigationTarget, bIsColdStart, oShellHash, sFixedShellHash) {
            oResolvedNavigationTarget.shellUIService = oShellUIService.getInterface();
            oResolvedNavigationTarget.appIsolationService = oAppIsolationService.getInterface();

            /*
             * The external navigation mode in the resolution result is calculated
             * statically, and indicates a future state. It currently answers the
             * question: "is the application going to be opened explace?".
             *
             * The target navigation mode, instead, answers the question: "was
             * the application opened explace?".
             *
             * We need to have this logic, because embedded applications do not
             * check the coldstart condition.
             */
            oResolvedNavigationTarget.targetNavigationMode = bIsColdStart ? "explace" : "inplace";

            this.openApp(sAppId, oResolvedNavigationTarget, oShellHash, sFixedShellHash);
            if (oGlobalShellCommunicationHandlers.length > 0) {
                oCurrentApplication.container.registerShellCommunicationHandler(oGlobalShellCommunicationHandlers);
            }
            if (oGlobalIframeCommunicationHandlers.UI5APP) {
                oCurrentApplication.container.setIframeHandlers(oGlobalIframeCommunicationHandlers.UI5APP);
            }
            return oCurrentApplication.container;
        };

        this.getShellUIService = function () {
            return oShellUIService;
        };

        this.getAppIsolationService = function () {
            return oAppIsolationService;
        };

        this.initShellUIService = function (oShellUIServiceChange) {
            oShellUIService._attachHierarchyChanged(AppMeta.onHierarchyChange.bind(this));
            oShellUIService._attachTitleChanged(AppMeta.onTitleChange.bind(this));
            oShellUIService._attachRelatedAppsChanged(AppMeta.onRelatedAppsChange.bind(this));
            oShellUIService._attachBackNavigationChanged(oShellUIServiceChange.fnOnBackNavigationChange.bind(this));
        };

        /* Start Statefull API */

        /**
         * Reads and adjusts the user configuration related to stateful
         * application containers.
         *
         * @param {object} oStatefulApplicationContainer
         *
         * @return {object}
         *   A configuration like: <code>{
         *     <applicationType>: null
         *   }</code>
         *
         * Where null indicates that stateful containers are enabled for a
         * certain application type and container will be added at the time
         * the first application of that type is opened.
         */
        this.parseStatefulContainerConfiguration = function (oConfStatefulApplicationContainer) {
            var oStatefulApplicationContainerConsolidatedCopy = {};

            if (oConfStatefulApplicationContainer) {
                var oAllowedConfigurations = {
                    //"NWBC": true,
                    "GUI": true
                };

                Object.keys(oConfStatefulApplicationContainer)
                    .filter(function (sApplicationType) {
                        return oConfStatefulApplicationContainer[sApplicationType] === true
                            && oAllowedConfigurations[sApplicationType];
                    })
                    .map(function (sUserConfigurationKey) {
                        var sApplicationType = sUserConfigurationKey;
                        if (sApplicationType === "GUI") {
                            sApplicationType = "TR";
                        }

                        return sApplicationType;
                    })
                    .forEach(function (sApplicationType) {
                        oStatefulApplicationContainerConsolidatedCopy[sApplicationType] = null;
                    });
            }

            oStatefulApplicationContainer = oStatefulApplicationContainerConsolidatedCopy;
        };

        this.setStatefulApplicationContainer = function (inOStatefulApplicationContainer) {
            oStatefulApplicationContainer = inOStatefulApplicationContainer;
        };

        this.getStatefulApplicationContainer = function () {
            return oStatefulApplicationContainer;
        };

        this.applicationIsStatefulType = function (sApplicationType) {
            return oStatefulApplicationContainer.hasOwnProperty(sApplicationType);
        };

        this.getStatefulContainer = function (sApplicationType) {
            return oStatefulApplicationContainer[sApplicationType];
        };

        this.setStatefulContainer = function (sApplicationType, oApplicationContainer) {
            oStatefulApplicationContainer[sApplicationType] = oApplicationContainer;
        };

        this.statefulContainerForTypeExists = function (sApplicationType) {
            return !!this.getStatefulContainer(sApplicationType);
        };

        /**
         * Finds and returns all existing application containers.
         *
         * @param {object} oStatefulApplicationContainer
         *  All stateful application containers
         *
         * @return {array}
         *  An array containing all the application container objects.
         */
        this.getAllApplicationContainers = function () {
            return Object.keys(oStatefulApplicationContainer).map(function (sKey) {
                return oStatefulApplicationContainer[sKey];
            }).filter(function (oApplicationContainer) {
                return !!oApplicationContainer;
            });
        };

        /* End Statefull API */

        this.getElementsModel = function () {
            return ElementsModel;
        };

        /**
         * In the FLP, only one container at a time can be active. If we have
         * multiple ApplicationContainers, they may still be active in the
         * background, and still be able to send/receive postMessages (e.g.,
         * change the title while the user is on the FLP home).
         *
         * Also, we distinguish between visible containers and active
         * containers. As it is desirable that when a container is being opened
         * it starts setting the FLP title for example. It results in better
         * perceived performance.
         *
         * This method sets only one container as active and de-activates all
         * other application containers around.
         *
         * @param {object} oApplicationContainer
         *   The application container to activate. Pass <code>null</code> in
         *   case no application container must be activated.
         *
         * @param {array} aAllApplicationContainers
         *   All existing application containers
         *
         * @private
         */
        this.activeContainer = function (oApplicationContainer) {
            var aAllApplicationContainers = this.getAllApplicationContainers();

            // deactivate all
            aAllApplicationContainers.forEach(function (oApplicationContainerToDeactivate) {
                Log.info("Deactivating container " + oApplicationContainerToDeactivate.getId());
                oApplicationContainerToDeactivate.setActive(false);
            });

            if (oApplicationContainer) {
                Log.info("Activating container " + oApplicationContainer.getId());
                oApplicationContainer.setActive(true);
            }
        };

        this.showApplicationContainer = function (oApplicationContainer) {
            this.navTo(oApplicationContainer.getId());
            //Added this because in cases when navigating to the same id (can happen when stateful container, I need the on onAfterNavigate)
            oApplicationContainer.toggleStyleClass("hidden", false);
            Log.info("New application context opened successfully in an existing transaction UI session.");
        };

        this.reuseStateFulContainerAndRestore = function (oApplicationContainer, sToId, oHandler, sFixedShellHash) {
            var that = this,
                //Get the real Storage Id according to the hash maps for the restore
                sStorageId = oIntentToStorageId[sFixedShellHash];

            if (BlueBoxHandler.getStorageKey(oApplicationContainer)) {
                //in case of stateful container - map BlueBox to storageKey
                BlueBoxHandler.setStorageKey(oApplicationContainer, sStorageId);
            }

            // invoke the life cycle interface "setInitialConfiguration" for the restored application
            return oHandler.restore(oApplicationContainer, sStorageId)
                .then(function () {
                    that.showApplicationContainer(oApplicationContainer);
                }, function (vError) {
                    Log.error(vError && vError.message || vError);
                });
        };

        this.reuseStateFulContainer = function (oApplicationContainer, url, sToId, oHandler, sFixedShellHash) {
            var that = this;

            //Store the storage id associated with the hash
            oIntentToStorageId[sFixedShellHash] = sToId;

            if (BlueBoxHandler.getStorageKey(oApplicationContainer)) {
                //in case of stateful container - map BlueBox to storageKey
                BlueBoxHandler.setStorageKey(oApplicationContainer, sToId);
            }

            this.initAppMetaParams();

            // invoke the life cycle interface "setInitialConfiguration" for the restored application
            return oHandler.create(oApplicationContainer, url, sToId)
                .then(function () {
                    that.showApplicationContainer(oApplicationContainer);
                }, function (vError) {
                    Log.error(vError && vError.message || vError);
                });
        };

        this.initAppMetaParams = function () {
            if (!this.getAppMeta().getIsHierarchyChanged()) {
                oShellUIService.setHierarchy();
            }
            if (!this.getAppMeta().getIsTitleChanged()) {
                oShellUIService.setTitle();
            }
            if (!this.getAppMeta().getIsRelatedAppsChanged()) {
                oShellUIService.setRelatedApps();
            }
            if (!isBackNavigationChanged) {
                oShellUIService.setBackNavigation();
            }
        };

        this.reuseApplicationContainer = function (oApplicationContainer, applicationType, url) {
            var that = this;
            return oApplicationContainer
                .setNewApplicationContext(applicationType, url)
                .then(function () {
                    that.navTo(oApplicationContainer.getId());
                    oApplicationContainer.toggleStyleClass("hidden", false);
                    Log.info("New application context opened successfully in an existing transaction UI session.");
                }, function (vError) {
                    Log.error(vError && vError.message || vError);
                });
        };

        this.createApplicationContainer = function (sAppId, oResolvedNavigationTarget) {
            return Application.createApplicationContainer(sAppId, oResolvedNavigationTarget);
        };

        this.publishNavigationStateEvents = function (oAppContainer, oApplication, fnOnAfterRendering) {
            //after the app container is rendered, publish an event to notify
            //that an app was opened
            var origExit,
                sId = oAppContainer.getId ? oAppContainer.getId() : "",
                that = this;
            var appMetaData = AppConfiguration.getMetadata(),
                sIcon = appMetaData.icon,
                sTitle = appMetaData.title;

            //Attach an event handler which will be called onAfterRendering
            oAppContainer.addEventDelegate({ onAfterRendering: fnOnAfterRendering });

            //after the app container exit, publish an event to notify
            //that an app was closed
            origExit = oAppContainer.exit;
            oAppContainer.exit = function () {
                if (origExit) {
                    origExit.apply(this, arguments);
                }
                //apply the original density settings
                that.getAppMeta()._applyContentDensityByPriority();

                //wrapped in setTimeout since "publish" is not async
                setTimeout(function () {
                    // TODO: do not mutate an internal structure (in a Timeout!),
                    // create a new object
                    var oEventData = jQuery.extend(true, {}, oApplication);
                    delete oEventData.componentHandle;
                    oEventData.appId = sId;
                    oEventData.usageIcon = sIcon;
                    oEventData.usageTitle = sTitle;
                    sap.ui.getCore().getEventBus().publish("sap.ushell", "appClosed", oEventData);
                    Log.info("app was closed");
                }, 0);

                // the former code leaked an *internal* data structure, making it part of a public API
                // restrict hte public api to the minimal set of precise documented properties which can be retained under
                // under future evolutions
                var oPublicEventData = that._publicEventDataFromResolutionResult(oApplication);
                //publish the event externally
                sap.ushell.renderers.fiori2.utils.publishExternalEvent("appClosed", oPublicEventData);
            };
        };

        /**
         * Creates a new object Expose a minimal set of values to public external stakeholders
         * only expose what you can guarantee under any evolution of the unified shell on all platforms
         * @param {object} oApplication an internal result of NavTargetResolution
         * @returns {object} an object exposing certain information to external stakeholders
         */
        this._publicEventDataFromResolutionResult = function (oApplication) {
            var oPublicEventData = {};
            if (!oApplication) {
                return oApplication;
            }
            ["applicationType", "ui5ComponentName", "url", "additionalInformation", "text"].forEach(function (sProp) {
                oPublicEventData[sProp] = oApplication[sProp];
            });
            Object.freeze(oPublicEventData);
            return oPublicEventData;
        };

        this.isCachedEnabledAsAppParameter = function (oShellHash, oTarget) {
            if (oShellHash && oShellHash.params && oShellHash.params["sap-keep-alive"]) {
                if (oShellHash.params["sap-keep-alive"] == "true") {
                    return true;
                }
            }

            if (oTarget && oTarget.url) {
                if (new UriParameters(oTarget.url).get("sap-keep-alive") == "true") {
                    return true;
                }
            }

            return false;
        };

        this.getInMemoryInstance = function (sIntent, sFixedShellHash) {
            var sFullAppId = "application-" + sIntent,
                oAppEntry = Storage.get(sFullAppId);

            //remove application from cache if has different parameters
            if (oAppEntry) {
                if (oAppEntry.shellHash === sFixedShellHash) {
                    return {
                        isInstanceSupported: true,
                        appId: oAppEntry.appId,
                        container: oAppEntry.container
                    };
                }
                return {
                    isInstanceSupported: false,
                    appId: oAppEntry.appId,
                    container: oAppEntry.container
                };
            }

            return {
                isInstanceSupported: false,
                appId: undefined,
                container: undefined
            };
        };

        this.handleOpenStateful = function (bIsInitial, bIsInCache, sToId, oInnerControl, oTarget, sFixedShellHash) {
            var oHandler = BlueBoxHandler.getHandler();

            if (Storage.get(sToId) && bIsInitial === false) {
                this.reuseStateFulContainerAndRestore(oInnerControl, sToId, oHandler, sFixedShellHash);
            } else {
                this.reuseStateFulContainer(oInnerControl, oTarget.url, sToId, oHandler, sFixedShellHash);

                //creating a new application check if needs to be keep (for the keep alive), and if so store the application
                if (bIsInCache) {
                    if (!this.isAppInCache(sToId)) {
                        this.storeApp(sToId, oInnerControl, oTarget, sFixedShellHash);
                    }
                }
            }
        };

        this.leave = function (oAppCont, sAppId) {
            var bReuseStatefulContainer = BlueBoxHandler.isStatefulContainerSupported(oAppCont);

            if (bReuseStatefulContainer) {
                return this.handleExitStateful(sAppId, oAppCont);
            }

            return Promise.resolve();
        };

        this.open = function (sIntent, sAppId, oShellHash, oTarget, fnWrapper, sFixedShellHash, oMetadata) {
            var oInnerControl,
                bReuseAnExistingAppSession = this.statefulContainerForTypeExists(oTarget.applicationType),
                bReuseStatefulContainer,
                bIsAppOfTypeCachable = aCachedAppTypes.indexOf(oTarget.applicationType) >= 0,
                sFullAppId = "application-" + sIntent,
                oCachedEntry,
                bIsInCache = this.isAppOfTypeCached(sFullAppId, bIsAppOfTypeCachable) || this.isCachedEnabledAsAppParameter(oShellHash, oTarget),
                sAppType,
                bIsInitial = false,
                bDefaultFullWidth;

            //set the default full width value
            sAppType = this.calculateAppType(oTarget);
            bDefaultFullWidth = ApplicationType.getDefaultFullWidthSetting(sAppType);

            oInnerControl = BlueBoxHandler.getStateFul(oTarget.url);
            bReuseStatefulContainer = BlueBoxHandler.isStatefulContainerSupported(oInnerControl);

            if (!bReuseStatefulContainer) {
                oInnerControl = undefined;
                oCachedEntry = Storage.get("application" + sAppId);

                if (oCachedEntry) {
                    oInnerControl = oCachedEntry.container;
                }
            }

            if (bReuseStatefulContainer) {
                if (!oInnerControl) {
                    oInnerControl = fnWrapper(
                        sIntent,
                        oMetadata,
                        oShellHash,
                        oTarget,
                        sAppId,
                        oTarget.fullWidth || oMetadata.fullWidth || bDefaultFullWidth,
                        sFixedShellHash
                    );

                    this.restoreApp(oInnerControl.getId());
                    this.navTo(oInnerControl.getId());

                    bIsInitial = true;
                }
            } else if (!bReuseAnExistingAppSession && oInnerControl && !bIsInCache) {
                //this case this controler cant be reused and we need it to be embed, so delete it.
                this.destroy(oInnerControl.getId(), oInnerControl);

                // The immediately following method call internally calls
                // `this.oViewPortContainer.addCenterViewPort(oAppContainer)`
                // when `bReuseAnExistingAppSession` is true, and in that case
                // `oInnerControl` will be the component control of an existing session.
                oInnerControl = fnWrapper(
                    sIntent,
                    oMetadata,
                    oShellHash,
                    oTarget,
                    sAppId,
                    oTarget.fullWidth || oMetadata.fullWidth || bDefaultFullWidth,
                    sFixedShellHash
                );
            } else if (!oInnerControl) {
                // The immediately following method call internally calls
                // `this.oViewPortContainer.addCenterViewPort(oAppContainer)`
                // when `bReuseAnExistingAppSession` is true, and in that case
                // `oInnerControl` will be the component control of an existing session.
                oInnerControl = fnWrapper(
                    sIntent,
                    oMetadata,
                    oShellHash,
                    oTarget,
                    sAppId,
                    oTarget.fullWidth || oMetadata.fullWidth || bDefaultFullWidth,
                    sFixedShellHash
                );
            }

            if (!bReuseAnExistingAppSession && !bReuseStatefulContainer) {
                this.restoreApp(oInnerControl.getId());
                this.navTo(oInnerControl.getId());
            }

            oViewPortContainer.switchState("Center");
            utils.setPerformanceMark("FLP -- centerViewPort");
            // Activate container before showing it (start reacting to postMessage calls)
            this.activeContainer(oInnerControl);

            // Assuming a previously existing TR container existed and is now
            // going to be reused, we prompt the container to load the new application context.
            if (bReuseStatefulContainer) {
                this.handleOpenStateful(bIsInitial, bIsInCache, "application" + sAppId, oInnerControl, oTarget, sFixedShellHash);
            } else if (bReuseAnExistingAppSession) {
                this.reuseApplicationContainer(oInnerControl, oTarget.applicationType, oTarget.url);
            }

            return Promise.resolve();
        };

        this.handleControl = function (sIntent, sAppId, oShellHash, oTarget, fnWrapper, sFixedShellHash) {
            var that = this,
                oMetadata = AppConfiguration.getMetadata(oTarget),
                sCurrentPageId = oViewPortContainer.getCurrentCenterPage? oViewPortContainer.getCurrentCenterPage(): undefined,
                oCurrentPage = sap.ui.getCore().byId(sCurrentPageId);

            var oPromise = that.leave(oCurrentPage, sCurrentPageId).then(function() {
                that.open(sIntent, sAppId, oShellHash, oTarget, fnWrapper, sFixedShellHash, oMetadata);
            }, function (vError) {
                Log.error(vError && vError.message || vError);
            });

            return oPromise;
        };

        this.switchViewState = function (sState, bSaveLastState, sAppId) {
            var sActualState = sState,
                oStorageEntry;

            if (oActualElementsModelStateMap[sState] && oActualElementsModelStateMap[sState][appState]) {
                sActualState = oActualElementsModelStateMap[sState][appState];
            }

            var bIsCurrentStateHome = Config.last("/core/shell/model/currentState/stateName") === "home";

            if (!bIsCurrentStateHome && (!oCurrentApplication.appId || !Storage.get(oCurrentApplication.appId))) {
                ElementsModel.destroyManageQueue();
            }
            //change the application related shell model.
            oStorageEntry = Storage.get("application" + sAppId);

            if (oStorageEntry) {
                RelatedShellElements.restore(oStorageEntry);
            } else {
                RelatedShellElements.assignNew(sState);
            }

            ElementsModel.switchState(sActualState, bSaveLastState, sAppId);

            //Process Dangling UI elements.
            this.shellElements().setDangling(false);
            this.shellElements().processDangling();

            if (sState === "searchResults") {
                this.getElementsModel().setProperty("/lastSearchScreen", "");
                if (!window.hasher.getHash().indexOf("Action-search") === 0) {
                    var searchModel = sap.ui.getCore().getModel("searchModel");
                    window.hasher.setHash("Action-search&/searchTerm=" + searchModel.getProperty("/uiFilter/searchTerms") + "&dataSource=" + JSON.stringify(searchModel.getProperty("/uiFilter/dataSource").getJson()));
                }
            }
        };

        this.registerShellCommunicationHandler = function (oCommunicationHandler) {
            Application.registerShellCommunicationHandler(oCommunicationHandler);
        };

        this.registerIframeCommunicationHandler = function (sHandlers, sType) {
            oGlobalIframeCommunicationHandlers[sType] = sHandlers;
        };

        this.postMessageToIframeApp = function (sServiceName, sInterface, oMessageBody, bWaitForResponse) {
            var fnCallBackHandler,
                oContainer = Application.getActiveAppContainer(),
                aContainers = [];
            if (BlueBoxHandler.hasIFrame(oContainer) && (BlueBoxHandler.isCapabilitySupported(oContainer, sServiceName, sInterface) || Application.isAppTypeSupported(oContainer, sServiceName, sInterface))) {
                aContainers.push(
                    Application.postMessageToIframeApp(oContainer, sServiceName, sInterface, oMessageBody, bWaitForResponse)
                );
            }

            //for all other stored applications
            if (!Application.isActiveOnly(sServiceName, sInterface)) {
                BlueBoxHandler.forEach(function (OBBContainer) {
                    if (BlueBoxHandler.hasIFrame(OBBContainer)) {
                        if (BlueBoxHandler.isCapabilitySupported(OBBContainer, sServiceName, sInterface) || Application.isAppTypeSupported(OBBContainer, sServiceName, sInterface)) {
                            aContainers.push(
                                Application.postMessageToIframeApp(OBBContainer, sServiceName, sInterface, oMessageBody, bWaitForResponse)
                            );
                        }
                    }
                });
            }

            fnCallBackHandler = Application.getResponseHandler(sServiceName, sInterface);

            var oAllProm = Promise.all(aContainers);

            if (fnCallBackHandler) {
                fnCallBackHandler(oAllProm);
            }
            return oAllProm;
        };

        this.postMessageToIframeAppAccordingToPolicy = function (sServiceName, sInterface, oMessageBody,
                                                                 bWaitForResponse, oPolicy) {
            var fnCallBackHandler,
                oContainer = Application.getActiveAppContainer(),
                aContainers = [];

            if (BlueBoxHandler.hasIFrame(oContainer) && Application.isAppTypeSupportedByPolicy(oContainer, oPolicy)) {
                aContainers.push(
                    Application.postMessageToIframeApp(oContainer, sServiceName, sInterface, oMessageBody, bWaitForResponse)
                );
            }

            //for all other stored applications
            if (!oPolicy.isActiveOnly) {
                BlueBoxHandler.forEach(function (OBBContainer) {
                    if (BlueBoxHandler.hasIFrame(OBBContainer)) {
                        if (BlueBoxHandler.isCapabilitySupported(OBBContainer, sServiceName, sInterface) || Application.isAppTypeSupported(OBBContainer, sServiceName, sInterface)) {
                            aContainers.push(
                                Application.postMessageToIframeApp(OBBContainer, sServiceName, sInterface, oMessageBody, bWaitForResponse)
                            );
                        }
                    }
                });
            }

            fnCallBackHandler = Application.getResponseHandler(sServiceName, sInterface);

            var oAllProm = Promise.all(aContainers);

            if (fnCallBackHandler) {
                fnCallBackHandler(oAllProm);
            }
            return oAllProm;
        };

        this.registerTunnels = function (oTunnels) {
            DelegationBootstrap.registerTunnels(oTunnels, this.registerShellCommunicationHandler);
        };

        this.registerEvents = function (oEventRegistries) {
            DelegationBootstrap.registerEvents(oEventRegistries, this.registerShellCommunicationHandler);
        };

        this.setBackNavigationChanged = function (isBackNavigationChangedValue) {
            isBackNavigationChanged = isBackNavigationChangedValue;
        };

        this.getBackNavigationChanged = function () {
            return isBackNavigationChanged;
        };

    }

    return new AppLifeCycle();
}, /* bExport= */ true);
