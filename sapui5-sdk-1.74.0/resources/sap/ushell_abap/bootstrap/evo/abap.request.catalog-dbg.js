// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "./abap.bootstrap.utils"
],
function (oAbapUtils) {
    "use strict";
    /* global OData */

    var oCatalogHandler = {},
        bSapStatistics = oAbapUtils.isSapStatisticsSet();

    /**
     * Performs an OData GET request using a plain XHR.
     *
     * @param {string} sUrl Tge all catalogs service url
     * @param {object} oStartupResult The startup result
     * @param {function} fnCallback The callback function to be called when the request finished, taking the status
     * code, the CSRF token and the response message
     *
     * @private
     * @since 1.70.0
     */
    function _requestOData (sUrl, oStartupResult, fnCallback) {
        var oXHR;
        oXHR = oAbapUtils.createAndOpenXHR(sUrl, oStartupResult);
        oXHR.setRequestHeader("X-CSRF-Token", "fetch");
        // set sap-statistics header, see
        // http://help.sap.com/saphelp_nw74/helpdata/de/40/93b81292194d6a926e105c10d5048d/content.htm
        if (bSapStatistics) {
            oXHR.setRequestHeader("sap-statistics", "true");
        }
        oXHR.onreadystatechange = function () {
            if (this.readyState !== /*DONE*/ 4) {
                return; // not yet DONE
            }
            fnCallback(oXHR.status, oXHR.getResponseHeader("x-csrf-token"), oXHR.responseText);
        };
        oXHR.send();
    }

    /**
     * Processes the OData response.
     *
     * @param {jQuery.Deferred} oDeferred  The deferred object updating the cache in OData.read
     * @param {number} iStatus The status code
     * @param {string} sCsrfToken The CSRF token
     * @param {string} sResponse The response message
     *
     * @private
     * @since 1.70.0
     */
    function _processOData (oDeferred, iStatus, sCsrfToken, sResponse) {
        if (iStatus === 200) {
            oDeferred.resolve(JSON.parse(sResponse).d, sCsrfToken);
        } else {
            // rejecting the deferred will make the request later (in the ushell adapter) fail, so
            // the error handling there takes effect
            oDeferred.reject(sResponse);
        }
    }

    /**
     * Determines the URL for the AllCatalogs OData service;
     *
     * @param {object} oStartupResult The startup result
     * @param {string} sServicePropertyName The service property name
     *
     * @return {string} The AllCatalogs OData service url.
     *
     * @private
     * @since 1.70.0
     */
    function _getAllCatalogsUrl (oStartupResult, sServicePropertyName) {

        var S_DEFAULT_SORTING_CONDITION = "title",
            S_DEFAULT_FILTERING_CONDITION = "type eq 'CATALOG_PAGE' or type eq 'H' or type eq 'SM_CATALOG' or type eq 'REMOTE'",
            S_DEFAULT_PAGE_ID = "/UI2/Fiori2LaunchpadHome",
            sServiceUrl,
            oServiceData = oStartupResult.services[sServicePropertyName],
            sTargetMappingCacheId = oStartupResult.services.targetMappings.cacheId,
            sUI2CacheDisable = oAbapUtils.getUrlParameterValue("sap-ui2-cache-disable");

        sServiceUrl = oServiceData.baseUrl + "/Pages('" + encodeURIComponent(S_DEFAULT_PAGE_ID) +
        "')/allCatalogs?$expand=Chips/ChipBags/ChipProperties&" +
        "$orderby=" + S_DEFAULT_SORTING_CONDITION;

        sServiceUrl = sServiceUrl + "&$filter=" + encodeURIComponent(S_DEFAULT_FILTERING_CONDITION);


        if (sUI2CacheDisable) {
            sServiceUrl += (sServiceUrl.indexOf("?") < 0 ? "?" : "&") + "sap-ui2-cache-disable=" + oServiceData["sap-ui2-cache-disable"];
        }

        if (sTargetMappingCacheId) {
            sServiceUrl += (sServiceUrl.indexOf("?") < 0 ? "?" : "&") + "sap-cache-id=" + sTargetMappingCacheId;
        }

        return sServiceUrl;
    }

    /**
     * Creates the Deferred in the OData.read cache to keep the result of the request with the
     * given URL.
     *
     * @param {string} sUrl The AllCatalogs OData service url
     * @returns {jQuery.Deferred} resolved when the response is cached
     *
     * @private
     * @since 1.70 .0
     */
    function _createODataDeferred (sUrl) {
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
     * Requests for AllCatalogs.
     *
     * @param {object} oStartupResult The startup result
     * @param {boolean} bNoOData Not use OData
     *
     * @private
     * @since 1.70.0
     */
    function requestAllCatalogs (oStartupResult, bNoOData) {
        if (bNoOData) {
            return;
        }

        var sAllCatalogServiceUrl = _getAllCatalogsUrl(oStartupResult, "pbFioriHome"),
            oDeferred = _createODataDeferred(sAllCatalogServiceUrl); //TODO make as Promise.all

        _requestOData(sAllCatalogServiceUrl, oStartupResult, function (iStatus, sCsrfToken, sResponse) {
            _processOData(oDeferred, iStatus, sCsrfToken, sResponse);
        });
    }

    oCatalogHandler.requestAllCatalogs = requestAllCatalogs;
    oCatalogHandler._getAllCatalogsUrl = _getAllCatalogsUrl; //Only for testing
    oCatalogHandler._createODataDeferred = _createODataDeferred; //Only for testing
    oCatalogHandler._requestOData = _requestOData; //Only for testing
    oCatalogHandler._processOData = _processOData; //Only for testing
    oCatalogHandler._setSapStatistics = function (bValue) {
        bSapStatistics = bValue;
    }; //Only for testing

    return oCatalogHandler;
});