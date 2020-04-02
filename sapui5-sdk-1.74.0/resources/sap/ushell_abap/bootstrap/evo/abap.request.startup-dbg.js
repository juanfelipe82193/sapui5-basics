// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/utils",
    "./abap.bootstrap.utils",
    "sap/base/util/ObjectPath",
    "sap/base/Log",
    "sap/ui2/srvc/utils"
], function (oUshellUtils, oAbapUtils/*, oUi2Utils*/, ObjectPath, Log) {
    "use strict";

    var oStartupHandler = {};

    /**
     * Performs the start-up request.
     * @param {String} sQuery
     *    String which is added to the "/sap/bc/ui2/start_up?"
     * @param {Array} aParametertsFromUrl
     *    The List of parameters which should be copied to the requested url
     * @param {Object} oStartupConfig
     *    Startup object, used to take cacheId and other parameters
     *
     * @returns {Promise}
     *    Result of the GET request should be resolved
     */
    function requestStartup (sQuery, aParametertsFromUrl, oStartupConfig) {
        var sRequestUrl = "/sap/bc/ui2/start_up?",
            mParameterMap = sap.ui2.srvc.getParameterMap(),
            oXHR;

        if (sQuery) {
            sRequestUrl += sQuery + "&";
        }

        /*
         * Copies the URL parameter with the given name from <code>mParameterMap</code> to
         * <code>sRequestUrl</code>.
         *
         * @param {string} sName
         *   URL parameter name
         * @private
         */
        function copyParameter (sName) {
            var sValue = mParameterMap[sName];
            if (sValue) {
                sRequestUrl += sName + "=" + encodeURIComponent(sValue[0]) + "&";
            }
        }

        aParametertsFromUrl.forEach(copyParameter);
        sRequestUrl += "shellType=" + sap.ushell_abap.getShellType() + "&depth=0";
        if (oStartupConfig) {
            sRequestUrl += oAbapUtils.getCacheIdAsQueryParameter(oStartupConfig);
            oXHR = oAbapUtils.createAndOpenXHR(sRequestUrl, oStartupConfig); // XMLHttpRequest + headers
        }

        return new Promise(function (resolve, reject) {
            sap.ui2.srvc.get(
                sRequestUrl,
                false, /*xml=*/
                function (sStartupCallResult) {
                    var oStartupResult = JSON.parse(sStartupCallResult);
                    resolve(oStartupResult);
                },
                reject,
                oXHR
            );
        });
    }

    /**
     * Performs the start-up request without so and action.
     *
     * @returns {Promise}
     *    Result of the GET request should be resolved
     */
    oStartupHandler.requestStartupConfig = function () {
        var oServerSideConfigStartup = ObjectPath.get("sap-ushell-config.services.Container.adapter.config"); // do not create
        if (oServerSideConfigStartup) {
            return Promise.resolve(oServerSideConfigStartup);
        }

        return requestStartup("", ["sap-language", "sap-client"]);
    };

    /**
     * Performs the compact start-up request (so=%2A&action=%2A&tm-compact=true).
     *
     * @param {Object} oStartupConfig
     *    Startup object, used to take cacheId and other parameters
     * @param {Boolean} bNoOData
     *    If Odata is not allowed. If true - return rejected promise.
     *
     * @returns {Promise}
     *    Result of the GET request should be resolved
     */
    oStartupHandler.requestCompactTM = function (oStartupConfig, bNoOData) {
        if (bNoOData) {
            return Promise.reject(); //TODO handling noOData???
        }

        oUshellUtils.addTime("RequestCompactTM");

        return requestStartup("so=%2A&action=%2A&tm-compact=true", ["sap-language", "sap-client", "sap-ui2-cache-disable"], oStartupConfig).then(function (oResult) {
            oUshellUtils.addTime("ReceiveCompactTM");
            if (oResult.targetMappings) {
                return Promise.resolve(oResult.targetMappings);
            }
            return Promise.resolve({});
        }, function (sError) {
            Log.error("compactTMPromise rejected: " + sError);
            return Promise.reject(sError);
        });

    };

    /**
     * Performs the full start-up request (so=%2A&action=%2A).
     *
     * @param {Object} oStartupConfig
     *    Startup object, used to take cacheId and other parameters
     * @param {Boolean} bNoOData
     *    If Odata is not allowed. If true - return rejected promise.
     *
     * @returns {Promise}
     *    Result of the GET request should be resolved
     */
    oStartupHandler.requestFullTM = function (oStartupConfig, bNoOData) {
        if (bNoOData) {
            return Promise.reject(); //TODO handling noOData???
        }

        oUshellUtils.addTime("RequestFullTM");
        return requestStartup("so=%2A&action=%2A&systemAliasesFormat=object", ["sap-language", "sap-client", "sap-ui2-cache-disable"], oStartupConfig).then(function (oResult) {
            if (oResult) {
                if (oResult.client) { // double check we get the correct response
                                       // TODO: move this to integration test perhaps
                    return Promise.reject("A start up response was returned in a target mappings request.");
                }
                return Promise.resolve(oResult);
            }
            return Promise.resolve({});
        }, function (sError) {
            Log.error("navTargetDataPromise rejected: " + sError);
            return Promise.reject(sError);
        });

    };

    /**
     * Performs an extra request to retreive a direct Start Request.
     *
     * @param {Object} oStartupConfig
     *    Startup object, used to take cacheId and other parameters
     * @param {Boolean} bNoOData
     *    If Odata is not allowed. If true - return rejected promise.
     * @param {Object} oParsedShellHash
     *    The parsed shell hash object. The object must contain semanticObject and action
     * @param {Object} oInitialKeys
     *    The parameters which shold be copyed to the requested url
     *
     *  @returns {Promise}
     *    Result of the GET request should be resolved
     */
    oStartupHandler.requestDirectStart = function (oStartupConfig, bNoOData, oParsedShellHash, oInitialKeys) {
        if (bNoOData) {
            return Promise.reject(); //TODO handling noOData???
        }

        var sFormFactor = sap.ui2.srvc.getFormFactor(),
            sQueryPath = "";

        sQueryPath = "so=" + oParsedShellHash.semanticObject + "&action=" + oParsedShellHash.action;
        sQueryPath += "&systemAliasesFormat=object";
        Object.keys(oInitialKeys).forEach(function (sKey) {
            sQueryPath += "&" + sKey + "=" + oInitialKeys[sKey];
        });
        if (sFormFactor) {
            sQueryPath += "&formFactor=" + encodeURIComponent(sFormFactor);
        }

        oUshellUtils.addTime("RequestDirectStart");
        return requestStartup(sQueryPath, ["sap-language", "sap-client"], oStartupConfig).then(function (oResult) {
            oUshellUtils.addTime("ReceiveDirectStart");
            return Promise.resolve(oResult);
        });

    };

    return oStartupHandler;

});