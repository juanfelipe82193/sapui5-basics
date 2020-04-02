// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Validates a given Url
 *
 */

sap.ui.define([], function () {
    "use strict";

    return fnValidateUrl;
    /**
     * Validates the given URL.
     *
     * The validation consists of two steps.
     *
     * 1. name validation, in which it is checked that the url is
     *    slash-separated, the filename is composed of an ASCII subset (i.e.,
     *    letters, numbers and underscore), and ending with a .json extension.
     *
     * 2. whitelisting, in which the URL prefix is searched in a whitelist
     * hardcoded in
     * <code>window["sap-ushell-config"].launchpadConfiguration.configurationFile.configurationFileFolderWhitelist</code>.
     *
     * NOTE: a falsy mWhitelist parameter causes this method to return an error message.
     *
     * @param {string} sUrl
     *   The url to validate
     * @param {object} mWhitelist
     *   A whitelist, mapping a url prefix to a boolean value that indicates
     *   whether a URL starting with that prefix should be allowed.
     * @return {string|undefined}
     *   The error message encountered during validation, or undefined if the url is valid.
     */

    function fnValidateUrl (sUrl, mWhitelist) {
        // Check for allowed characters in the json file name
        var aRequestUrlComponents = /^((.*)\/)?[A-Za-z0-9_]+\.json$/.exec(sUrl),
            sRequestUrlPrefix;

        if (!aRequestUrlComponents) {
            return "name of configuration URL is not valid. Url is:\"" + sUrl + "\"";
        }

        sRequestUrlPrefix = typeof aRequestUrlComponents[1] === "undefined" ? "" : aRequestUrlComponents[1];

        if ( !mWhitelist ||
             !mWhitelist.hasOwnProperty(sRequestUrlPrefix) ||
             !mWhitelist[sRequestUrlPrefix]) {

            return "URL for config file does not match restrictions. Url is:\"" + sUrl + "\"";
        }

        return undefined;
    }
});