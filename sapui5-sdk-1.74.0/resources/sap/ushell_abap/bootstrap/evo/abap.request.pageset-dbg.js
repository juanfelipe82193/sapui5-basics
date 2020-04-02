// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "./abap.bootstrap.utils",
    "sap/ui/thirdparty/jquery"
], function (oAbapUtils, jQuery) {
    "use strict";
    /*global OData */

    var oPagesetHandler = {},
        S_PAGE_SETS_FALLBACK_URL_BASE = "/sap/opu/odata/UI2/PAGE_BUILDER_PERS",
        S_PAGE_SETS_FALLBACK_EXPAND = "Pages/PageChipInstances/Chip/ChipBags/ChipProperties,"
            + "Pages/PageChipInstances/RemoteCatalog,"
            + "Pages/PageChipInstances/ChipInstanceBags/ChipInstanceProperties,"
            + "AssignedPages,DefaultPage",
        S_PAGE_SETS_FALLBACK_URL_RELATIVE = "PageSets('%2FUI2%2FFiori2LaunchpadHome')";

    // Check (only once for this file) if sap-statistics is set in query parameter or local storage
    var bSapStatistics = oAbapUtils.isSapStatisticsSet();

    function requestPageSet (oStartupResult, bNoOData) {
        if (bNoOData) {
            return;
        }
        var sPageSetServiceUrl = getAndAdjustPageSetServiceURL(oStartupResult),
            oDeferred = createODataDeferred(sPageSetServiceUrl);//TODO make as Promise.all

        requestOData(sPageSetServiceUrl, oStartupResult, function (iStatus, sCsrfToken, sResponse) {
            processOData(oDeferred, iStatus, sCsrfToken, sResponse);
        });
    }

    /**
     * Determines the URL for the PageSets OData service from the startup service result. If the URL is not set
     * a hard-coded fallback URL is returned and set in the startupResult.
     */
    function getAndAdjustPageSetServiceURL (oStartupCallResult) {
        var sUI2CacheDisable = oAbapUtils.getUrlParameterValue("sap-ui2-cache-disable");
        if (sUI2CacheDisable && oStartupCallResult && oStartupCallResult.services && oStartupCallResult.services.pbFioriHome) {
            oStartupCallResult.services.pbFioriHome["sap-ui2-cache-disable"] = sUI2CacheDisable;
        }
        return getAndAdjustServiceURL(
            oStartupCallResult,
            "pbFioriHome",
            S_PAGE_SETS_FALLBACK_URL_BASE,
            S_PAGE_SETS_FALLBACK_URL_RELATIVE,
            S_PAGE_SETS_FALLBACK_EXPAND
        );
    }

    /**
     * Determines the URL for the PageSets OData service from the startup service result. If the URL is not set
     * a hard-coded fallback URL is returned and set in the startupResult.
     */
    function getAndAdjustServiceURL (oStartupCallResult, sServicePropertyName, sFallbackBaseUrl,
            sFallbackRelativeUrl, sFallbackExpand) {
        var sServiceUrl,
            oServiceData, // shortcut for oStartupCallResult.services[sServicePropetyName]
            bFallbackApplied = false;

        if (oStartupCallResult.services) {
            if (oStartupCallResult.services[sServicePropertyName]) {
                oServiceData = oStartupCallResult.services[sServicePropertyName];
            } else {
                oServiceData = {};
                oStartupCallResult.services[sServicePropertyName] = oServiceData;
                bFallbackApplied = true;
            }
        } else {
            oServiceData = {};
            oStartupCallResult.services = {};
            oStartupCallResult.services[sServicePropertyName] = oServiceData;
            bFallbackApplied = true;
        }

        if (!oServiceData.baseUrl || !oServiceData.relativeUrl) {
            oServiceData.baseUrl = sFallbackBaseUrl;
            oServiceData.relativeUrl = sFallbackRelativeUrl;
            bFallbackApplied = true;
        }

        if (bFallbackApplied) {
            jQuery.sap.log.warning(
                "URL for " + sServicePropertyName + " service not found in startup service result; fallback to default; cache invalidation might fail",
                null,
                "sap.ushell_abap.bootstrap"
            );
        }

        // clean trailing and leading slashes
        if (oServiceData.baseUrl.lastIndexOf("/") !== oServiceData.baseUrl.length - 1) {
            // modify the startUpResult, to simplify the adapter code later
            oServiceData.baseUrl += "/";
        }
        if (oServiceData.relativeUrl[0] === "/") {
            // modify the startUpResult, to simplify the adapter code later
            oServiceData.relativeUrl = oServiceData.relativeUrl.slice(1);
        }

        sServiceUrl = oServiceData.baseUrl + oServiceData.relativeUrl;

        // add parameters if needed
        // Note: order should always be 1. $expand, 2. sap-cache-id=, 3. additional params;
        // as OData.read.$cache may otherwise not work properly
        if (!/\$expand=/.test(sServiceUrl) && sFallbackExpand) {
            // no expand, add fallback expand (if not "")
            sServiceUrl += (sServiceUrl.indexOf("?") < 0 ? "?" : "&") + "$expand=" + sFallbackExpand;
        }
        if (oServiceData.cacheId) {
            sServiceUrl += (sServiceUrl.indexOf("?") < 0 ? "?" : "&") + "sap-cache-id=" + oServiceData.cacheId;
        }
        if (oServiceData["sap-ui2-cache-disable"]) {
            sServiceUrl += (sServiceUrl.indexOf("?") < 0 ? "?" : "&") + "sap-ui2-cache-disable=" + oServiceData["sap-ui2-cache-disable"];
        }
        return sServiceUrl;
    }

    /**
     * Processes the OData response.
     * @param {jQuery.Deferred} oDeferred
     *     the deferred object updating the cache in OData.read
     * @param {number} iStatus
     *     the status code
     * @param {string} sCsrfToken
     *    the CSRF token
     * @param {string} sResponse
     *    the response message
     */
    function processOData (oDeferred, iStatus, sCsrfToken, sResponse) {
        if (iStatus === 200) {
            oDeferred.resolve(JSON.parse(sResponse).d, sCsrfToken);
        } else {
            // rejecting the deferred will make the request later (in the ushell adapter) fail, so
            // the error handling there takes effect
            oDeferred.reject(sResponse);
        }
    }

    /**
     * Creates the Deferred in the OData.read cache to keep the result of the request with the
     * given URL.
     * @param {string} sUrl
     * @returns {jQuery.Deferred}
     *
     * @private
     */
    function createODataDeferred (sUrl) {
        var oDeferred = new jQuery.Deferred();
        // creating the deferred objects here should ensure that the ushell adapters later read
        // the responses from the "cache", even if UI5 bootstrap is faster than the
        // OData requests
        sap.ui.require(["sap/ui/thirdparty/datajs"], function (datajs) {
            OData.read.$cache = OData.read.$cache || new sap.ui2.srvc.Map();
            OData.read.$cache.put(sUrl, oDeferred.promise());
        });
        return oDeferred;
    }

    /**
     * Performs an OData GET request using a plain XHR.
     * @param {function(number, object, function)}
     *    callback function to be called when the request finished, taking the status code, the
     *    CSRF token and the response message
     */
    function requestOData (sUrl, oStartupResult, fnCallback) {
        var oXHR;
        oXHR = oAbapUtils.createAndOpenXHR(sUrl, oStartupResult);
        oXHR.setRequestHeader("X-CSRF-Token", "fetch");
        // set sap-statistics header, see
        // http://help.sap.com/saphelp_nw74/helpdata/de/40/93b81292194d6a926e105c10d5048d/content.htm
        if (bSapStatistics) {
            oXHR.setRequestHeader("sap-statistics", "true");
        }
        oXHR.onreadystatechange = function () {
            if (this.readyState !== /*DONE*/4) {
                return; // not yet DONE
            }
            fnCallback(oXHR.status, oXHR.getResponseHeader("x-csrf-token"), oXHR.responseText);
        };
        oXHR.send();
    }


    oPagesetHandler.requestPageSet = requestPageSet;
    oPagesetHandler._getAndAdjustServiceURL = getAndAdjustServiceURL; //Only for testing
    oPagesetHandler._getAndAdjustPageSetServiceURL = getAndAdjustPageSetServiceURL; //Only for testing
    oPagesetHandler._setSapStatistics = function (bValue) {
        bSapStatistics = bValue;
    }; //Only for testing
    return oPagesetHandler;


});