// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Requests and parses the configuration associated to one or more server
 * configuration URLs
 */
sap.ui.define([
    "./abap.get.server.config.Urls",
    "sap/ui2/srvc/utils"
], function (fnGetServerConfigUrls /*, oUtil */) {
    "use strict";
    return requestServerConfig;

    /**
     * Requests and parses the configuration associated to one or more server
     * configuration URLs asynchronously (see getServerConfigUrls method). Return the promise,
     * which is resolved successful if ALL content (urls) is retrieved and parsed
     * successfully. The reject is, if any of the contents
     * could not be retrieved or parsed.
     *
     * @param {function} getServerConfigUrls
     *    function to get urls with server configs. If argument is not defined then abap.get.server.config.Urls is used
     * @returns {Promise}
     *    Promise is resolved successful if all urls is retrieved and parsed successfully. Reject - if any of the contents
     *    could not be retrieved or parsed. Return resolved promise with empty array, if there were no urls in configuration.
     *
     * @private
     */
    function requestServerConfig (getServerConfigUrls) {
        var aConfigUrls,
            aRequestedPromise = [];

        getServerConfigUrls = getServerConfigUrls || fnGetServerConfigUrls;
        aConfigUrls = getServerConfigUrls();

        // return immediately if there are no urls
        if (aConfigUrls.length === 0) {
            return Promise.resolve([]);
        }

        aRequestedPromise = aConfigUrls.map(function (sUrl, iIdx) {
            return new Promise(function (resolve, reject) {
                sap.ui2.srvc.get(
                    sUrl,
                    false, /*xml=*/
                    function (sResponseText) {
                        var oParsedResponse;
                        try {
                            oParsedResponse = JSON.parse(sResponseText);
                        } catch (e) {
                            reject(["parse error in server config file", "'" + sUrl + "'",
                                "with content:", "'" + sResponseText + "'"].join(" "));
                        }
                        resolve(oParsedResponse);
                    },
                    reject
                );
            });
        });

        return Promise.all(aRequestedPromise);

    }

 });