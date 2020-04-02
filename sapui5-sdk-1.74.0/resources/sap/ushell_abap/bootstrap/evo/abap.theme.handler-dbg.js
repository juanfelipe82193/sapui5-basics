// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview
 * Returns a function <code>isThemeRootSafe</code> to validate
 * the origin of a given theme root string.
 */

sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/base/Log",
    "sap/ushell/bootstrap/common/common.read.metatags"
],
    function (URI, Log, oMetaTagHandler) {
    "use strict";

    var oThemeHandler = {};

    function validateThemeOrigin (sOrigin) {
        var aArrayOfAllowedOrigins = oMetaTagHandler.readMetaTags(
            "sap-allowedThemeOrigins",
            // only one allowed origin shall be provided
            function (sMetaNodeContent) {
                return sMetaNodeContent.trim();
            }
        );
        var sAllowedOrigin = "";
        // only one meta tag of this type shall be provided
        if (aArrayOfAllowedOrigins.length > 0) {
            sAllowedOrigin = aArrayOfAllowedOrigins[0];
        } else {
            Log.debug("no meta tag allowedThemeOrigins was found so theme-url was not applied.");
        }

        return sOrigin === sAllowedOrigin.trim();
    }


    /**
     * Checks if the origin of the theme root string passed on entry
     * is regarded safe.
     *
     * The function returns
     * > false if the white list check failed
     * > true if it passed
     *   or if the theme root is server relative
     * > false if a whitelist was not specified
     *
     * The whitelist is taken from the value of the meta tag
     * <code><meta name="allowedThemeOrigins" value=...></code>.
     *
     * @param {string} themeRoot Theme root string to be verified
     * @returns {boolean}
     *   true/false if the whitelist check passed/failed
     *   false in case no white list was specified, not producible by flp-handler
     */
    oThemeHandler.isThemeRootSafe = function (themeRoot) {
        var oURI = new URI(themeRoot),
            sOrigin = oURI.origin().toString();

            // Return true if the theme root is server relative
            if ( sOrigin === "") {
                return true;
            }
            return validateThemeOrigin(sOrigin);
    };

    return oThemeHandler;

});