// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/base/Object",
    "sap/ushell/Utils",
    "sap/ushell/EventHub",
    "sap/ushell/services/ClientSideTargetResolution",
    "sap/base/util/ObjectPath",
    "sap/ui/thirdparty/jquery"
], function (
    Object,
    utils,
    Hub,
    ClientSideTargetResolution,
    ObjectPath,
    jQuery
) {
    "use strict";

    // need to emit this event otherwise the Custom Tiles are not loaded.
    // might not be needed in other scnearions therefore to challenge
    Hub.emit("CoreResourcesComplementLoaded");
    var mPlatformPackages,
        // a set of services need some config to run properly.
        // could be replaced by other mechanism going forward, maybe use plattform defaultds for this.
        oConfig = {
            services: {
                Personalization: { adapter: { module: "sap.ushell.adapters.local.PersonalizationAdapter" } },
                CommonDataModel: {
                    adapter: {
                        config: {
                            allowSiteSourceFromURLParameter: true,
                            ignoreSiteDataPersonalization: true,
                            siteDataUrl: "../../cdmSiteData/CommonDataModelAdapterData.json"
                        }
                    }
                },
                AppState: { adapter: { module: "sap.ushell.adapters.local.AppStateAdapter" } }
            }
        },
        mServicesByName = new utils.Map(),
        oSystem = {
            getPlatform: function () {
                // need to make this configurable.
                return "cdm";
            }
        },
        oAdapter = {
            getSystem: function () {
                return oSystem;
            }
        };

    function createAdapter (sName, oSystem, sParameter, bAsync) {
        var oAdapterConfig = getServiceConfig(sName).adapter || {},
            sAdapterName = oAdapterConfig.module || getPlatformPackage(oSystem.getPlatform()) + "." + sName + "Adapter";

        function getAdapterInstance () {
            return new (ObjectPath.get(sAdapterName || ""))(
                oSystem,
                sParameter,
                { config: oAdapterConfig.config || {} }
            );
        }

        if (bAsync) {
            return new Promise(function (resolve, reject) {
                var sModule = sAdapterName.replace(/\./g, "/");

                sap.ui.require([sModule], function () {
                    try {
                        resolve(getAdapterInstance());
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }
        sap.ui.require([
            sAdapterName
        ], function () {
            return getAdapterInstance();
        });
    }

    function getServiceConfig (sServiceName) {
        return (oConfig.services && oConfig.services[sServiceName]) || {};
    }

    function getPlatformPackage (sPlatform) {
        if (mPlatformPackages && mPlatformPackages[sPlatform]) {
            return mPlatformPackages[sPlatform];
        }
        return "sap.ushell.adapters." + sPlatform;
    }

    return Object.extend("sap.ushell.Container", {
        isMock: true, // For detecting if the Homepage/AppFinder components run standalone

        constructor: function () { },

        getServiceAsync: function (sServiceName, sParameter) {
            return Promise.resolve(this.getService(sServiceName, sParameter, true));
        },

        getService: function (sServiceName, sParameter, bAsync) {
            this._overrideCSTRResolution();

            /**
             * @class This is a virtual type for the callback interface passed by {@link sap.ui.Container.getService()} to any newly created service.
             * @name sap.ushell.services.ContainerInterface
             * @see sap.ushell.services.Container#getService
             * @since 1.15.0
             * @public
             */
            var oContainerInterface = {},
                sModuleName,
                sKey,
                Service, // Service constructor function
                oServiceAdapter,
                oServiceConfig,
                oServiceProperties;

            /**
             * For the given remote system, creates a new adapter that corresponds to the service
             * to which this container interface was passed at construction time.
             *
             * @param {sap.ushell.System} oSystem information about the remote system to which the resulting adapter should connect
             * @returns {jQuery.Deferred} A <code>jQuery.Deferred</code> object's promise receiving the remote adapter.
             * @methodOf sap.ushell.services.ContainerInterface#
             * @name createAdapter
             * @since 1.15.0
             * @public
             */
            function createRemoteAdapter (oSystem) {
                var oDeferred = new jQuery.Deferred();
                if (!oSystem) {
                    throw new Error("Missing system");
                }
                // Note: this might become really asynchronous once the remote adapter is loaded from the remote system itself
                oDeferred.resolve(createAdapter(sServiceName, oSystem, sParameter));
                sap.ushell.Container.addRemoteSystem(oSystem);
                return oDeferred.promise();
            }

            if (!sServiceName) {
                throw new Error("Missing service name");
            }
            if (sServiceName.indexOf(".") >= 0) {
                //TODO support this once we have some configuration and can thus find adapters
                throw new Error("Unsupported service name");
            }
            oServiceConfig = getServiceConfig(sServiceName);
            sModuleName = oServiceConfig.module || "sap.ushell.services." + sServiceName;
            sKey = sModuleName + "/" + (sParameter || "");
            oServiceProperties = { config: oServiceConfig.config || {} };

            function createService (ServiceClass, oServiceAdapter) {
                oContainerInterface.createAdapter = createRemoteAdapter;
                return new ServiceClass(oServiceAdapter, oContainerInterface, sParameter, oServiceProperties);
            }

            function getServiceInstance (Service, bAsync) {
                var oService;
                // create the service
                if (Service.hasNoAdapter) {
                    // has no adapter: don't create and don't pass one
                    oService = new Service(oContainerInterface, sParameter, oServiceProperties);
                } else {
                    // create and pass adapter for logon system as first parameter
                    oServiceAdapter = createAdapter(sServiceName, oAdapter.getSystem(), sParameter, bAsync);
                    if (bAsync) {
                        return oServiceAdapter.then(function (serviceAdapter) {
                            var oService = createService(Service, serviceAdapter);
                            mServicesByName.put(sKey, oService);
                            return oService;
                        });
                    }
                    oService = createService(Service, oServiceAdapter);
                }

                mServicesByName.put(sKey, oService);
                return bAsync ? Promise.resolve(oService) : oService;
            }

            if (!mServicesByName.containsKey(sKey)) {
                // extract information about the requested service
                if (bAsync) {
                    return new Promise(function (resolve) {
                        sap.ui.require([sModuleName.replace(/[.]/g, "/")], function (ServiceClass) {
                            resolve(getServiceInstance(ServiceClass, true));
                        });
                    });
                }
                Service = sap.ui.requireSync(sModuleName.replace(/[.]/g, "/"));
                return getServiceInstance(Service);
            }
            if (bAsync) {
                return Promise.resolve(mServicesByName.get(sKey));
            }
            return mServicesByName.get(sKey);
        },

        _overrideCSTRResolution: function () {
            ClientSideTargetResolution.prototype.getEasyAccessSystems = function () {
                var oDeferred = new jQuery.Deferred(),
                    oResult = {
                        "U1Y_000": {
                            "appType": {
                                "TR": true,
                                "WDA": true
                            },
                            "text": "U1Y Client 000"
                        },
                        "FLPINTEGRATION2015_588": {
                            "appType": { "URL": true },
                            "text": "Business Objects Demo"
                        },
                        "GOOGLE": {
                            "appType": { "URL": true },
                            "text": "Google Searches"
                        }
                    };
                oDeferred.resolve(oResult);

                return oDeferred.promise();
            };
        },

        getUser: function () {
            return {
                getLanguage: function () {
                    return "en";
                }
            };
        },

        getRenderer: function () {
            return {
                createExtendedShellState: function () { },
                applyExtendedShellState: function () { }
            };
        },

        getLogonSystem: function () {
            return false;
        }
    });
}, true);
