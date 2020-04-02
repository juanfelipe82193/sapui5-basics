// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview The Unified Shell's UI5 component loader service.
 * This is a shell-internal service and no public or application facing API!
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ushell/utils",
    "sap/ushell/services/Ui5ComponentHandle",
    "sap/ushell/services/_Ui5ComponentLoader/utils",
    "sap/ushell/EventHub",
    "sap/ui/thirdparty/jquery"
], function (oUshellUtils, Ui5ComponentHandle, oUtils, oEventHub, jQuery) {
    "use strict";

    /**
     * This method MUST be called by the Unified Shell's container only,
     * others MUST call <code>sap.ushell.Container.getService("Ui5ComponentLoader")</code>.
     * Constructs a new instance of the UI5 Component Loader service.
     *
     * @class The Unified Shell's UI5 Component Loader service
     *
     * Note: This loader adds some hardcoded libraries for the standard fiori packaging.
     * Notably scaffolding libraries and core-ext-light must be available.
     * This can be turned off explicitly by setting the <code>amendedLoading</code>
     * property to <code>false</code> in the service configuration:
     *   <pre>
     *   window["sap-ushell-config"] = {
     *     services : {
     *       "Ui5ComponentLoader": {
     *         config : {
     *           amendedLoading : false,
     *           coreResourcesComplement: {
     *             name: "core-ext-light-custom",          // Name of the Bundle
     *             count: 4,                               // Number of individual parts of the bundle
     *             debugName: "core-ext-light-custom-dbg", // Name of the debug resource
     *             path: "sap/fiori/"
     *           }
     *         }
     *       }
     *     }
     *   }
     *   </pre>
     *
     * @private
     * @constructor
     * @see sap.ushell.services.Container#getService
     * @since 1.38.0
     */
    function Ui5ComponentLoader (oContainerInterface, sParameter, oConfig) {
        this._oConfig = (oConfig && oConfig.config) || {};

        /**
         * Loads and creates the UI5 component from the specified application properties object
         * (the result of a navigation target resolution).
         *
         * @param {object} oAppProperties Application properties as typically produced by resolveHashFragment,
         *   note that some members of componentData are propagated, this is used in the myinbox scenario,
         *   see (CrossApplicationNavigation.createComponentInstance)
         * @param {object} oParsedShellHash The shell hash of the application that is to be opened already parsed via
         *   <code>sap.ushell.services.URLParsing#parseShellHash</code><code>sap.ushell.services.URLParsing#parseShellHash</code>.
         * @param {array} aWaitForBeforeInstantiation An array of promises which delays the instantiation of
         *   the Component class until those Promises are resolved.
         * @return {jQuery.Deferred.promise} a jQuery promise which resolves with the application properties object which is enriched
         *   with an <code>componentHandle<code> object that encapsulates the loaded component.
         *   If the UI5 core resources have been loaded completely as a result of this call
         *   (either amendedLoading is disabled or the core-ext-light.js module is loaded as part of this call or was already loaded),
         *   the result object also gets a flag <code>coreResourcesFullyLoaded</code> which is true.
         * @private
         */
        this.createComponent = function (oAppProperties, oParsedShellHash, aWaitForBeforeInstantiation) {
            var oAppPropertiesSafe = oAppProperties || {},
                bLoadCoreExt = oUtils.shouldLoadCoreExt(oAppPropertiesSafe),
                bAmendedLoading = oUtils.shouldUseAmendedLoading(this._oConfig),
                bLoadDefaultDependencies = oUtils.shouldLoadDefaultDependencies(oAppPropertiesSafe, this._oConfig, bAmendedLoading),
                bNoCachebusterTokens = oUshellUtils.getParameterValueBoolean("sap-ushell-nocb"),
                oApplicationDependencies = oAppPropertiesSafe.applicationDependencies || {};

            oUtils.logAnyApplicationDependenciesMessages(
                oApplicationDependencies.name,
                oApplicationDependencies.messages
            );

            if (!oAppPropertiesSafe.ui5ComponentName) {
                return new jQuery.Deferred().resolve(oAppProperties).promise();
            }

            // Avoid warnings in ApplicationContainer.
            // TODO: can be removed when ApplicationContainer construction is changed.
            delete oAppPropertiesSafe.loadCoreExt;
            delete oAppPropertiesSafe.loadDefaultDependencies;

            var oComponentData = oUtils.createComponentData(
                oAppPropertiesSafe.componentData || {},
                oAppPropertiesSafe.url,
                oAppPropertiesSafe.applicationConfiguration,
                oAppPropertiesSafe.reservedParameters
            );

            if (oAppPropertiesSafe.getExtensions) {
                oComponentData.getExtensions = oAppPropertiesSafe.getExtensions;
                delete oAppPropertiesSafe.getExtensions;
            }

            var sComponentId = oUtils.constructAppComponentId(oParsedShellHash || {}),
                bAddCoreExtPreloadBundle = bLoadCoreExt && bAmendedLoading,
                oCoreResourcesComplementBundle = oUtils.prepareBundle(this._oConfig.coreResourcesComplement),
                oComponentProperties = oUtils.createComponentProperties(
                    bAddCoreExtPreloadBundle,
                    bLoadDefaultDependencies,
                    bNoCachebusterTokens,
                    aWaitForBeforeInstantiation,
                    oAppPropertiesSafe.applicationDependencies || {},
                    oAppPropertiesSafe.ui5ComponentName,
                    oAppPropertiesSafe.url,
                    sComponentId,
                    oCoreResourcesComplementBundle
                );

            // notify we are about to create component
            Ui5ComponentHandle.onBeforeApplicationInstanceCreated.call(null, oComponentProperties);

            var oDeferred = new jQuery.Deferred();

            oUtils.createUi5Component(oComponentProperties, oComponentData)
                .then(function (oComponent) {
                    var oComponentHandle = new Ui5ComponentHandle(oComponent);
                    oAppPropertiesSafe.componentHandle = oComponentHandle;

                    var bCoreResourcesFullyLoaded = bLoadCoreExt;
                    if (bCoreResourcesFullyLoaded) {
                        oAppPropertiesSafe.coreResourcesFullyLoaded = bCoreResourcesFullyLoaded;
                        oEventHub.emit("CoreResourcesComplementLoaded", { status: "success" });
                    }

                    oDeferred.resolve(oAppPropertiesSafe);
                }, function (vError) {
                    var sComponentProperties = JSON.stringify(oComponentProperties, null, 4);

                    oUtils.logInstantiateComponentError(
                        oComponentProperties.name,
                        vError + "",
                        vError.status,
                        vError.stack,
                        sComponentProperties
                    );

                    oDeferred.reject(vError);
                });

            return oDeferred.promise();
        };

        /**
         * Loads a Bundle that complements the Core Resources as configured in the configuration (default core-ext-light)
         *
         * This should normally be triggered by the corresponding EventHub Event (loadCoreExtLight)
         * Can also be called directly and returns a promise if used that way.
         *
         * @returns {Promise} A Promise that resolves as soon as the Core Complements bundle is loaded
         * @private
         */
        this.loadCoreResourcesComplement = function () {
            if (this.loadCoreResourcesComplementPromise) {
                return this.loadCoreResourcesComplementPromise.promise();
            }

            var oCoreResourcesComplementBundle = oUtils.prepareBundle(this._oConfig.coreResourcesComplement),
                oDeferred = new jQuery.Deferred();

            oUtils.loadBundle(oCoreResourcesComplementBundle)
                .done(function () {
                    oEventHub.emit("CoreResourcesComplementLoaded", { status: "success" });
                    this.loadCoreResourcesComplementPromise = oDeferred;
                    oDeferred.resolve();
                }.bind(this))
                .fail(function () {
                    oEventHub.emit("CoreResourcesComplementLoaded", { status: "failed" });
                    oDeferred.reject();
                });

            return oDeferred.promise();
        };

        /**
         * Load the Core-Ext-Light bundle when the appropiate Event is emitted
         */
        oEventHub.once("loadCoreResourcesComplement")
            .do(function () {
                this.loadCoreResourcesComplement();
            }.bind(this));
    }

    Ui5ComponentLoader.hasNoAdapter = true;
    return Ui5ComponentLoader;
}, true /* bExport */);
