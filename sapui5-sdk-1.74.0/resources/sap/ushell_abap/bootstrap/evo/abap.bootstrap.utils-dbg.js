// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
//TODO should be replaced by sap/ushell/utils
sap.ui.define([
    "sap/ushell/utils",
    "sap/ui2/srvc/utils"
], function (oUshellUtils/*, oUi2Utils*/) {
    "use strict";
    /*global jQuery, window, XMLHttpRequest */

    var utils = {};

    /**
     * Returns the [first] parameter value or undefined
     * @param {string} sValue the value to retrieve
     * @param {object} mMap optional, a parameter map
     * @returns {string}
     *     the first parameter value, if present
     *
     * @private
     */
    utils.getUrlParameterValue = function (sValue, mMap) {
        var mParameterMap = mMap || sap.ui2.srvc.getParameterMap();
        return mParameterMap[sValue] && mParameterMap[sValue][0];
    };

    /**
     * Creates and opens a new XMLHttpRequest object.
     *
     * @param {string} sUrl
     *  The URL the XHR object should request from.
     * @param {object} oStartupParameters
     *   The start_up parameters. This object must
     *   contain at least the following fields:
     * <pre>
     * {
     *     "client": "<client>",
     *     "language": "<language>"
     * }
     * </pre>
     *
     * @param {string} [sHttpMethod]
     *  The Http method name with default value "GET".
     * @returns {object}
     *   The oXHR object.
     */
    utils.createAndOpenXHR = function (sUrl, oStartupParameters, sHttpMethod) {
        sHttpMethod = sHttpMethod || "GET";
        var oXHR = new XMLHttpRequest();
        oXHR.open(sHttpMethod, sUrl, /*async=*/true);
        if (oStartupParameters) {
            utils.addCommonHeadersToXHR(oXHR, oStartupParameters);
        }
        return oXHR;
    };

    /**
     * Adds common headers to the given XHR object. This method is ideal to be used whenever the request should be made with certain headers.
     *
     * @param {object} oXHR Instance of XMLHttpRequest object
     *
     * @param {object} oStartupResultLikeObject
     *   An object that looks like the start_up result. This object must
     *   contain at least the following fields:
     * <pre>
     * {
     *     "client": "<client>",
     *     "language": "<language>"
     * }
     * </pre>
     *
     * @returns {object}
     *   The input oXHR object amended with headers.
     */
    utils.addCommonHeadersToXHR = function (oXHR, oStartupResultLikeObject) {
        oXHR.setRequestHeader("Accept", "application/json");
        if (oStartupResultLikeObject.client) {
            oXHR.setRequestHeader("sap-client", oStartupResultLikeObject.client);
        }
        if (oStartupResultLikeObject.language) {
            oXHR.setRequestHeader("sap-language", oStartupResultLikeObject.language);
        }
        return oXHR;
    };

    /**
     * Get cacheId from startup config and return it as query parameter like "&sap-cache-id=xxxx"
     * If cacheId not found in config, return empty string
     * @param {Object} oStartupConfig startup config
     * @returns {String} "&sap-cache-id=xxxx" if found, otherwise ""
     */
    utils.getCacheIdAsQueryParameter = function (oStartupConfig) {
        var sCacheId = jQuery.sap.getObject("services.targetMappings.cacheId", NaN, oStartupConfig);
        if (typeof sCacheId === "string") {
            return "&sap-cache-id=" + sCacheId;
        }
        return "";
    };

    /**
     * Checks if the sap-statistics setting as query parameter or via local storage, as
     * UI5 does it in some cases.
     * @param {String} sQueryToTest String to test. By default, take the window.location.search
     * @returns {Boolean} true if the sap-statistics is set as query parameter or via local storage
     * @private
     */
    utils.isSapStatisticsSet = function (sQueryToTest) {
        var sWindowLocationSearch = sQueryToTest || window.location.search,
            bSapStatistics = /sap-statistics=(true|x|X)/.test(sWindowLocationSearch);
        try {
            // UI5's config cannot be used here, so check local storage
            bSapStatistics = bSapStatistics || (oUshellUtils.getLocalStorageItem("sap-ui-statistics") === "X");
        } catch (e) {
            jQuery.sap.log.warning(
                "failed to read sap-statistics setting from local storage",
                null,
                "sap.ushell_abap.bootstrap"
            );
        }
        return bSapStatistics; // needed for tests only
    };

    /**
     * Merge the object oConfigToMerge into oMutatedConfig according to
     * sap-ushell-config merge rules Note that the JSON serialized content of
     * oConfigToMerge is used, thus JSON serialization limitations apply (e.g.
     * Infinity -> null ) Note that it is thus not possible to remove a
     * property definition or overriding with  {"propname" : undefined}, one
     * has to override with null or 0 etc.
     *
     * Note: Do not use this method for general merging of other objects, as
     * the rules may be enhanced/altered
     *
     * @param {object} oMutatedBaseConfig
     *     the configuration to merge into, modified in place
     * @param {object} oConfigToMerge
     *     the configuration to be merged with oMutatedBaseConfig
     * @param {boolean} bCloneConfigToMerge
     *     whether the oConfigToMerge must be cloned prior the merge
     * @private
     */
    utils.mergeConfig = function (oMutatedBaseConfig, oConfigToMerge, bCloneConfigToMerge) {
        var oActualConfigToMerge = bCloneConfigToMerge
            ? JSON.parse(JSON.stringify(oConfigToMerge))
            : oConfigToMerge;

        if (typeof oConfigToMerge !== "object") {
            return;
        }

        Object.keys(oActualConfigToMerge).forEach(function (sKey) {
            if (Object.prototype.toString.apply(oMutatedBaseConfig[sKey]) === "[object Object]" &&
                Object.prototype.toString.apply(oActualConfigToMerge[sKey]) === "[object Object]") {

                utils.mergeConfig(oMutatedBaseConfig[sKey], oActualConfigToMerge[sKey], false);
                return;
            }
            oMutatedBaseConfig[sKey] = oActualConfigToMerge[sKey];
        });
    };

    /**
     * Returns the location origin.
     *
     * @returns {string}
     *     the location origin
     *
     * @private
     */
    utils.getLocationOrigin = function () {
        // location.origin might not be supported by all browsers
        return location.protocol + "//" + location.host;
    };

    /**
     * Returns the location href.
     *
     * @returns {string}
     *     the location href
     *
     * @private
     */
    utils.getLocationHref = function () {
        return location.href;
    };

    return utils;
});