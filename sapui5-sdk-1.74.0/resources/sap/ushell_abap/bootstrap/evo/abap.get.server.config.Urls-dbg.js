// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview a Getter to return an array of valid configuration URL
 */

sap.ui.define([
    "./abap.validate.Url",
    "sap/base/util/ObjectPath"
], function (fnValidateUrl, ObjectPath) {
    "use strict";

    return getServerConfigUrls;

    /**
     * Returns an array of valid configuration URLs. These URLs must point to a
     * JSON configuration file, and can be specified in three possible ways:
     *
     * 1. as an array, in window["sap-ushell-config"].launchpadConfiguration.configurationFile,
     * 2. as a string, in window["sap-ushell-config"].launchpadConfiguration.configurationFile,
     * 3. as a string via the sap-ushell-config-url URL parameter
     *
     * Precedence:
     *
     * Case 1 excludes case 2, i.e., the hardcoded url is ignored
     * Case 2 excludes case 3, i.e., the url parameter is ignored
     *
     * NOTE: if cases 3 and 1 occur at the same time, the url parameter is not
     * ignored, and will be returned as the last URL in the result array.
     *
     * Whitelist:
     *
     * For security reasons, in the cases #2 and #3 specified above, URL names
     * are validated (see fnValidateUrl). Validation is skipped in case #1.
     *
     * NOTE: an error is logged when duplicate URLs are found in the
     *       configuration array, but these duplicates are returned anyway.
     *
     * NOTE: this method always returns an array (empty when no valid URLs were found).
     *
     * @returns {array} an array of valid URLs.
     *
     * @private
     */
    function getServerConfigUrls () {
        var oConfig = ObjectPath.get("sap-ushell-config.launchpadConfiguration.configurationFile"),

            // can be string (hardcoded) OR array (coming from the server)
            vHardcodedUrlOrServerSideUrls = oConfig && oConfig["sap-ushell-config-url"],
            sHardcodedUrlOrParameterUrl,
            sValidationFailReason,
            aRequestUrls = [],
            mUrlCounts = {},
            aDuplicateUrls = [];

        if (Object.prototype.toString.call(vHardcodedUrlOrServerSideUrls) === "[object Array]") {

            // i.e., parameter comes from the server
            Array.prototype.push.apply(aRequestUrls, vHardcodedUrlOrServerSideUrls);
        } else if (typeof vHardcodedUrlOrServerSideUrls === "string") {

            // i.e., parameter was hardcoded
            sHardcodedUrlOrParameterUrl = vHardcodedUrlOrServerSideUrls;
        }

        // try url parameter if no hardcoded url
        sHardcodedUrlOrParameterUrl = sHardcodedUrlOrParameterUrl || (
            sap.ui2.srvc.getParameterMap()["sap-ushell-config-url"] && sap.ui2.srvc.getParameterMap()["sap-ushell-config-url"][0]
        );

        if (typeof sHardcodedUrlOrParameterUrl !== "undefined") {
            // NOTE: url parameter is last in array
            var oWhitelist = ObjectPath.get("sap-ushell-config.launchpadConfiguration.configurationFile.configurationFileFolderWhitelist");

            sValidationFailReason = fnValidateUrl(sHardcodedUrlOrParameterUrl, oWhitelist);
            if (typeof sValidationFailReason !== "undefined") {
                sap.ui2.srvc.log.error(sValidationFailReason, null, "sap.ushell_abap.bootstrap");
            } else {
                aRequestUrls.push(sHardcodedUrlOrParameterUrl);
            }
        }

        // check for duplicates and log error in case
        aRequestUrls.forEach(function (sUrl) {
            if (!mUrlCounts.hasOwnProperty(sUrl)) {
                mUrlCounts[sUrl] = 0;
            }
            mUrlCounts[sUrl]++;
            if (mUrlCounts[sUrl] === 2) {
                aDuplicateUrls.push(sUrl);
            }
        });
        if (aDuplicateUrls.length > 0) {
            sap.ui2.srvc.log.error([
                "Duplicate Urls found in server configuration:", aDuplicateUrls.join(", ")
            ].join(" "), null, "sap.ushell_abap.bootstrap");
        }

        return aRequestUrls;
    }
});