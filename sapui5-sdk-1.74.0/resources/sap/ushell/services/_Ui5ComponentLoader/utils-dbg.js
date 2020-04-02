// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Helper functions for <code>sap.ushell.services.Ui5ComponentLoader
 *  This is a shell-internal service and no public or application facing API!
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ui/thirdparty/jquery",
    "sap/base/util/UriParameters",
    "sap/ui/core/util/AsyncHintsHelper"
], function (jQuery, UriParameters, oAsyncHintsHelper) {
    "use strict";

    var O_DEFAULT_BUNDLE = {
        name: "core-ext-light",
        count: 4,
        debugName: "core-ext-light", //-dbg will be added by ui5loader
        path: "sap/fiori/"
    };

    /**
     * Creates a UI5 component instance asynchronously.
     *
     * @param {object} oComponentProperties
     *  the Ui5 component properties
     * @param {object} oComponentData
     *  the Ui5 component data
     * @return {jQuery.Deferred.promise}
     *  a jQuery promise which resolves with an instance of
     *  <code>sap.ui.component</code> containing the instantiated
     *  Ui5 component.
     *
     * @private
     */
    function createUi5Component (oComponentProperties, oComponentData) {
        var oDeferred = new jQuery.Deferred();

        oComponentProperties.componentData = oComponentData;
        oComponentProperties.async = true;

        sap.ui.component(oComponentProperties).then(function (oComponent) {
            oDeferred.resolve(oComponent);
        }, function (vError) {
            oDeferred.reject(vError);
        });

        return oDeferred.promise();
    }

    function shouldUseAmendedLoading (oServiceConfig) {
        // optimized loading (default libs, core-ext-light) is on by default, but can be switched off explicitly
        // by platforms which do not support it (sandbox, demo); productive platforms should use it by default
        // see BCP 1670249780 (no core-ext loading in cloud portal)
        var bAmendedLoading = (oServiceConfig && oServiceConfig.hasOwnProperty("amendedLoading"))
            ? oServiceConfig.amendedLoading
            : true;

        return bAmendedLoading;
    }

    function shouldLoadCoreExt (oAppProperties) {
        var bLoadCoreExt = true; /* default */
        if (oAppProperties.hasOwnProperty("loadCoreExt")) {
            bLoadCoreExt = oAppProperties.loadCoreExt;
        }
        return bLoadCoreExt;
    }

    function shouldLoadDefaultDependencies (oAppProperties, oServiceConfig, bAmendedLoading) {
        // default dependencies loading can be skipped explicitly (homepage component use case)
        var bLoadDefaultDependencies = true;
        if (oAppProperties.hasOwnProperty("loadDefaultDependencies")) {
            bLoadDefaultDependencies = oAppProperties.loadDefaultDependencies;
        }

        // or via service configuration (needed for unit tests)
        if (oServiceConfig && oServiceConfig.hasOwnProperty("loadDefaultDependencies")) {
            bLoadDefaultDependencies = bLoadDefaultDependencies && oServiceConfig.loadDefaultDependencies;
        }

        bLoadDefaultDependencies = bLoadDefaultDependencies && bAmendedLoading;

        return bLoadDefaultDependencies;
    }

    function constructAppComponentId (oParsedShellHash) {
        var sSemanticObject = oParsedShellHash.semanticObject || null;
        var sAction = oParsedShellHash.action || null;

        if (!sSemanticObject || !sAction) {
            return null;
        }

        return "application-" + sSemanticObject + "-" + sAction + "-component";
    }

    function urlHasParameters (sUrl) {
        return sUrl && sUrl.indexOf("?") >= 0;
    }

    /**
     * Removes the cachebuster token from the given URL if any is present.
     *
     * @param {string} sUrl
     *    The URL to remove the change buster token from
     *
     * @return {string}
     *    The URL without the cachebuster token. The same URL is returned if no cachebuster token was present in the original URL.
     */
    function removeCacheBusterTokenFromUrl (sUrl) {
        var rCacheBusterToken = new RegExp("[/]~[\\w-]+~[A-Z0-9]?");
        return sUrl.replace(rCacheBusterToken, "");
    }

    function removeParametersFromUrl (sUrl) {
        if (!sUrl) { return sUrl; }

        var iIndex = sUrl.indexOf("?");
        if (iIndex >= 0) {
            return sUrl.slice(0, iIndex);
        }
        return sUrl;
    }

    function isCoreExtAlreadyLoaded () {
        // TODO: migration not possible. jQuery.sap.isDeclared is deprecated. Please use <code>sap.ui.require</code> instead
        return jQuery.sap.isDeclared("sap.fiori.core", true)
            || jQuery.sap.isDeclared("sap.fiori.core-ext-light", true);
    }

    function logInstantiateComponentError (sApplicationName, sErrorMessage, sErrorStatus, sErrorStackTrace, sComponentProperties) {
        var sErrorReason = "The issue is most likely caused by application " + sApplicationName,
            sAppPropertiesErrorMsg = "Failed to load UI5 component with properties: '" + sComponentProperties + "'.";

        if (sErrorStackTrace) {
            sAppPropertiesErrorMsg += " Error likely caused by:\n" + sErrorStackTrace;
        } else {
            // Error usually appears in the stack trace if the app
            // threw with new Error... but if it didn't we add it here:
            sAppPropertiesErrorMsg += " Error: '" + sErrorMessage + "'";
        }

        if (sErrorStatus === "parsererror") {
            sErrorReason += ", as one or more of its resources could not be parsed";
        }
        sErrorReason += ". Please create a support incident and assign it to the support component of the respective application.";

        jQuery.sap.log.error(sErrorReason, sAppPropertiesErrorMsg, sApplicationName);
    }

    /**
     * Returns a map of all search parameters present in the search string of the given URL.
     *
     * @param {string} sUrl
     *   the URL
     * @returns {object}
     *   in member <code>startupParameters</code> <code>map&lt;string, string[]}></code> from key to array of values,
     *   in members <code>sap-xapp-state</code> an array of Cross application Navigation state keys, if present
     *   Note that this key is removed from startupParameters!
     * @private
     */
    function getParameterMap (sUrl) {
        var mParams = new UriParameters(sUrl || window.location.href).mParams,
            xAppState = mParams["sap-xapp-state"],
            oResult;
        delete mParams["sap-xapp-state"];
        oResult = {
            startupParameters: mParams
        };
        if (xAppState) {
            oResult["sap-xapp-state"] = xAppState;
        }
        return oResult;
    }

    function logAnyApplicationDependenciesMessages (sApplicationDependenciesName, aMessages) {
        if (!Array.isArray(aMessages)) {
            return;
        }

        aMessages.forEach(function (oMessage) {
            var sSeverity = String.prototype.toLowerCase.call(oMessage.severity || "");
            sSeverity = ["trace", "debug", "info", "warning", "error", "fatal"].indexOf(sSeverity) !== -1 ? sSeverity : "error";
            jQuery.sap.log[sSeverity](oMessage.text, oMessage.details, sApplicationDependenciesName);
        });
    }

    /**
     * Prepares the bundle Object used to trigger bundle loading based on the bootstrap configuration
     * If a bundle is provided in the config we use that one, if not we use core-ext-light as a default
     *
     * @param {object} oConfiguredBundle
     *   The configured bundle to validate
     *
     * @returns {Object} Prepared Object that can be used to trigger bundle loading
     */
    function prepareBundle (oConfiguredBundle) {
        var oBundle,
            oCoreResourcesComplementBundle = {
                name: "CoreResourcesComplement"
            };

        if (validateConfiguredBundle(oConfiguredBundle)) {
            oBundle = oConfiguredBundle;
        } else {
            oBundle = O_DEFAULT_BUNDLE;
        }

        if (window["sap-ui-debug"] === true) {
            oCoreResourcesComplementBundle.aResources = [oBundle.path + oBundle.debugName + ".js"];
        } else {
            oCoreResourcesComplementBundle.aResources = buildBundleResourcesArray(oBundle.name, oBundle.path, oBundle.count);
        }

        return oCoreResourcesComplementBundle;
    }

    /**
     * Constructs a proper Array of Resources based on the count of different
     * sub-modules of a Bundle respecting the provided Path
     *
     * Note: This method calls itself recursively
     * e.g. core-resources-complement with resource count 4:
     * ["core-resources-complement-0.js", "core-resources-complement-1.js", "core-resources-complement-2.js", "core-resources-complement-3.js"]
     *
     * @param {String} sBundleName
     *    The Name of the Bundle. e.g.: core-resources-complement
     * @param {String} sPath
     *    The path to the source file. e.g.: sap/fiori/
     * @param {Number} iResourceCount
     *    The amount of sub-modules of the bundle. See Description of the Method
     * @returns {Array}
     *    The actual Array of the Resources
     *
     * @private
     */
    function buildBundleResourcesArray (sBundleName, sPath, iResourceCount) {
        var aResourceArray = arguments[3] || [],
            sResourcePath = sPath;

        if (typeof sBundleName !== "string" ||typeof sResourcePath !== "string" || typeof iResourceCount !== "number") {
            jQuery.sap.log.error("Ui5ComponentLoader: _buildBundleResourcesArray called with invalid arguments");
            return null;
        }

        if (sResourcePath.substr(-1) !== "/") {
            sResourcePath += "/";
        }

        if (iResourceCount === 1) {
            aResourceArray.push(sResourcePath + sBundleName + ".js");
        }

        if (aResourceArray.length >= iResourceCount) {
            return aResourceArray;
        }

        aResourceArray.push(sResourcePath + sBundleName + "-" + aResourceArray.length + ".js");
        return buildBundleResourcesArray(sBundleName, sResourcePath, iResourceCount, aResourceArray);
    }

    /**
     * Validates that the configured CoreResourcesComplement bundle is
     * structurally correct and doesn't have wrong data types assigned
     *
     * @param {object} oConfiguredBundle
     *   The configured bundle to validate
     *
     * @returns {boolean}
     *   whether the configured bundle is valid
     *
     * @private
     */
    function validateConfiguredBundle (oConfiguredBundle) {
        var isValid = true;

        if (!oConfiguredBundle) {
            return false;
        }

        if (!oConfiguredBundle.name || typeof oConfiguredBundle.name !== "string") {
            jQuery.sap.log.error("Ui5ComponentLoader: Configured CoreResourcesComplement Bundle has incorrect 'name' property");
            isValid = false;
        }

        if (!oConfiguredBundle.count || typeof oConfiguredBundle.count !== "number") {
            jQuery.sap.log.error("Ui5ComponentLoader: Configured CoreResourcesComplement Bundle has incorrect 'count' property");
            isValid = false;
        }

        if (!oConfiguredBundle.debugName || typeof oConfiguredBundle.debugName !== "string") {
            jQuery.sap.log.error("Ui5ComponentLoader: Configured CoreResourcesComplement Bundle has incorrect 'debugName' property");
            isValid = false;
        }

        if (!oConfiguredBundle.path || typeof oConfiguredBundle.path !== "string") {
            jQuery.sap.log.error("Ui5ComponentLoader: Configured CoreResourcesComplement Bundle has incorrect 'path' property");
            isValid = false;
        }

        return isValid;
    }

    /**
     * Loads the specified Bundle asynchronously and triggers a Event in the EventHub
     * with the current status in a Object.
     * e.g. of the EventHub Data:
     * { status: "success" } / { status: "failed" }
     *
     * @param {Object} oBundle
     *    Represents the Bundle that needs to be loaded.
     *    {
     *        name: "TheBundleName", // The name of the Bundle.
     *        resources: [
     *            "SampleResource"
     *        ]
     *    }
     *
     * @returns {Promise} Promise that resolves as soon as the bundle is loaded.
     *
     * @private
     */
    function loadBundle (oBundle) {
        if (!oBundle || !Array.isArray(oBundle.aResources) || !oBundle.name) {
            jQuery.sap.log.error("Ui5ComponentLoader: loadBundle called with invalid arguments");
            return null;
        }

        var aPromises = [],
            oDeferred = new jQuery.Deferred();

        oBundle.aResources.forEach(function (sResource) {
            // since 1.46, multiple calls of jQuery.sap._loadJSResourceAsync
            // for the same module will return the same promise,
            // i.e. there is no need to check if the module has been loaded before
            // TODO: migration not possible. jQuery.sap._loadJSResourceAsync is deprecated and private.
            aPromises.push(jQuery.sap._loadJSResourceAsync(sResource));
        });

        Promise.all(aPromises)
            .then(function () {
                oDeferred.resolve();
            })
            .catch(function () {
                jQuery.sap.log.error("Ui5ComponentLoader: failed to load bundle: " + oBundle.name);
                oDeferred.reject();
            });

        return oDeferred.promise();
    }

    /*
     * Creates a componentProperties object that can be used to instantiate
     * a ui5 component.
     *
     * @return {object}
     *    The component properties that can be used to instantiate the UI5
     *    component.
     */
    function createComponentProperties (
        bAddCoreExtPreloadBundle,
        bLoadDefaultDependencies,
        bNoCachebusterTokens,
        aWaitForBeforeInstantiation,
        oApplicationDependencies,
        sUi5ComponentName,
        sComponentUrl,
        sAppComponentId,
        oCoreResourcesComplementBundle
    ) {
        // take over all properties of applicationDependencies to enable extensions in server w/o
        // necessary changes in client
        var oComponentProperties = jQuery.extend(true, {}, oApplicationDependencies);

        // set default library dependencies if no asyncHints defined (apps without manifest)
        // TODO: move fallback logic to server implementation
        if (!oComponentProperties.asyncHints) {
            oComponentProperties.asyncHints = bLoadDefaultDependencies
                ? { "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"] }
                : {};
        }

        if (bAddCoreExtPreloadBundle) {
            oComponentProperties.asyncHints.preloadBundles =
                oComponentProperties.asyncHints.preloadBundles || [];

            oComponentProperties.asyncHints.preloadBundles =
                oComponentProperties.asyncHints.preloadBundles.concat(oCoreResourcesComplementBundle.aResources);
        }

        if (aWaitForBeforeInstantiation) {
            oComponentProperties.asyncHints.waitFor = aWaitForBeforeInstantiation;
        }

        // Use component name from app properties (target mapping) only if no name
        // was provided in the component properties (applicationDependencies)
        // for supporting application variants, we have to differentiate between app ID
        // and component name
        if (!oComponentProperties.name) {
            oComponentProperties.name = sUi5ComponentName;
        }

        if (sComponentUrl) {
            oComponentProperties.url = removeParametersFromUrl(sComponentUrl);
        }

        if (sAppComponentId) {
            oComponentProperties.id = sAppComponentId;
        }

        if (bNoCachebusterTokens && oComponentProperties.asyncHints) {
            oAsyncHintsHelper.modifyUrls(oComponentProperties.asyncHints, removeCacheBusterTokenFromUrl);
        }

        return oComponentProperties;
    }


    /*
     * Creates a componentData object that can be used to instantiate a ui5
     * component.
     */
    function createComponentData (oBaseComponentData, sComponentUrl, oApplicationConfiguration, oTechnicalParameters) {
        var oComponentData = jQuery.extend(true, {
            startupParameters: {}
        }, oBaseComponentData);

        if (oApplicationConfiguration) {
            oComponentData.config = oApplicationConfiguration;
        }
        if (oTechnicalParameters) {
            oComponentData.technicalParameters = oTechnicalParameters;
        }

        if (urlHasParameters(sComponentUrl)) {
            var oUrlData = getParameterMap(sComponentUrl);

            // pass GET parameters of URL via component data as member
            // startupParameters and as xAppState (to allow blending with
            // other oComponentData usage, e.g. extensibility use case)
            oComponentData.startupParameters = oUrlData.startupParameters;
            if (oUrlData["sap-xapp-state"]) {
                oComponentData["sap-xapp-state"] = oUrlData["sap-xapp-state"];
            }
        }

        return oComponentData;
    }

    return {
        constructAppComponentId: constructAppComponentId,
        getParameterMap: getParameterMap,
        isCoreExtAlreadyLoaded: isCoreExtAlreadyLoaded,
        logAnyApplicationDependenciesMessages: logAnyApplicationDependenciesMessages,
        logInstantiateComponentError: logInstantiateComponentError,
        shouldLoadCoreExt: shouldLoadCoreExt,
        shouldLoadDefaultDependencies: shouldLoadDefaultDependencies,
        shouldUseAmendedLoading: shouldUseAmendedLoading,
        urlHasParameters: urlHasParameters,
        removeParametersFromUrl: removeParametersFromUrl,
        createUi5Component: createUi5Component,
        prepareBundle: prepareBundle,
        loadBundle: loadBundle,
        createComponentProperties: createComponentProperties,
        createComponentData: createComponentData,
        buildBundleResourcesArray: buildBundleResourcesArray
    };

}, false /* bExport */);
