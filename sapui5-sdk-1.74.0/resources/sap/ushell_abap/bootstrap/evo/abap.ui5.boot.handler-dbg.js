// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/base/Log",
    "sap/ui2/srvc/utils"
], function (Log/*, oUtil */) {
    "use strict";

    var oBootHandler = {},
        oBootPromise,
        fnResolve; //resolver of the Promise

    /**
     * Overwrites jQuery.sap.registerModulePath to add a cache buster token on each call to the
     * URL prefix path.
     *
     * Note:
     * The sap-ushell-config defines the rules for adding a token to the URL.
     * This is a temporary solution. Ideally UI5 will provide this functionality.
     *
     * @private
     */
    function overwriteRegisterModulePath () {
        var fnRegisterModulePath = jQuery.sap.registerModulePath;

        function normalizeUrlAndAddCacheBusterToken (sUrlPrefix) {
            // Removing cache buster token (if available) of url and normalize the url afterwards
            var sNormalizedUrl = sap.ui2.srvc.removeCBAndNormalizeUrl(sUrlPrefix),
                sUrlPrefixModified = sap.ui2.srvc.addCacheBusterTokenUsingUshellConfig(sNormalizedUrl);
            return sUrlPrefixModified;
        }

        jQuery.sap.registerModulePath = function (sModuleName, vUrlPrefix) {
            // since 1.28, registerModulePath can take either a URL string or an object of form {url: "url", "final": true}
            if (typeof vUrlPrefix === "object") {
                vUrlPrefix.url = normalizeUrlAndAddCacheBusterToken(vUrlPrefix.url);
            } else if (typeof vUrlPrefix === "string") {
                vUrlPrefix = normalizeUrlAndAddCacheBusterToken(vUrlPrefix);
            }
            // any other types are just passed through

            fnRegisterModulePath(sModuleName, vUrlPrefix);
        };
    }

    /**
     * Work around to use promise for booting the ui5.
     * Singleton.
     * Createed promise will be resolved after calling the resolveBootPromise method
     *
     * @returns {Promise}
     *   Promise will resolved after calling the resolveBootPromise
     */
    oBootHandler.createUi5BootPromise = function () {
        if (!oBootPromise) {
            oBootPromise = new Promise(function (resolve, reject) {
                fnResolve = resolve;
            });
        }
        return oBootPromise;

    };

    /**
     * The SAPUI5 boot task when bootstrapping Unified Shell for ABAP. The resolve the promise, which was created before by
     * createUi5BootPromise method. If createUi5BootPromise was not called before, that fnCallback will be called.
     * @param {function} fnCallback
     *     the function by which SAPUI5 is notified that this task is finished
     */
    oBootHandler.resolveBootPromise = function (fnCallback) {
        overwriteRegisterModulePath();
        // add nice logging for sap/net/xhr.js
        XMLHttpRequest.logger = Log.getLogger("sap.net.xhr");
        if (fnResolve) {
            fnResolve(fnCallback);
        } else {
            fnCallback();
        }

    };

    return oBootHandler;
});