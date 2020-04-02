/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */

// Implementation of an AppInfoAdapter for the ABAP platform
// Loads UI5 app index data for the UI5 app runtime
sap.ui.define([
    "sap/base/Log",
    "sap/ui/thirdparty/URI",
    "sap/ui/thirdparty/jquery",
    "sap/base/util/UriParameters"
], function (
    Log,
    URI,
    jQuery,
    UriParameters
) {
        "use strict";

        var oLogger = Log.getLogger("sap/ushell_abap/ui5appruntime/AppInfoAdapter", Log.Level.INFO);

        function AppInfoAdapter () {

        }

        /**
         * Returns the app info (ui5 app index data) for the app
         * with specified id.
         *
         * @param {string} aAppId - the ID of the app which is loaded
         * @returns {Promise<object>} a Promise resolving with the app data
         */
        AppInfoAdapter.prototype.getAppInfo = function (sAppId) {
            var oUrlParams = new UriParameters(window.location.href);

            // TODO: app ID should always be passed by caller
            if (sAppId === undefined) {
                sAppId = oUrlParams.get("sap-ui-app-id");
            }

            if (sAppId) {
                return this._loadAppIndexData("/sap/bc/ui2/app_index/ui5_app_info_json", sAppId);
            }
            return Promise.reject(new Error("Cannot load app info - no app-id provided and URL parameter 'sap-ui-app-id' not set"));
        };

        AppInfoAdapter.prototype._loadAppIndexData = function (sServiceUrl, sAppId) {

            var sUri = new URI(sServiceUrl).query({
                "id": sAppId
            }).toString();

            return new Promise(function (resolve, reject) {
                jQuery.ajax({
                    type: "GET",
                    dataType: "json",
                    url: sUri
                }).done(function (oResponseData) {
                    var oAppData = oResponseData[sAppId];

                    if (oAppData) {
                        resolve(oResponseData[sAppId]);
                    } else {
                        // TODO: extract error messages from app index response
                        reject(new Error("UI5 app index data loaded from " + sUri + " does not contain app " + sAppId));
                    }
                }).fail(function (oError) {
                    oLogger.error(oError.responseText);
                    reject(new Error("Failed to load UI5 app index data loaded from " + sUri + ": " + oError.responseText));
                });
            });
        };

        return new AppInfoAdapter();

    }, false);