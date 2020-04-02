// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/util/MockServer"
], function (MockServer) {
    "use strict";

    var oResponseConfirmDataChanges =
    {
        "d": {
            "id": "/UI2/CONFIRM_CHANGES",
            "title": "FOO",
            "description": "This page is used for testing the pages runtime",
            "devclass": "/UI2/FLP_CONTENT_HOME",
            "transportId": "TEST-TRANSPORT-ID",
            "sections": {
                "__deferred": {
                    "uri": "/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/pageSet('%2FUI2%2FCONFIRM_CHANGES')/sections"
                }
            },
            "modifiedOn": "/Date(1566219775000)/",
            "__metadata": {
                "id": "/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/pageSet('%2FUI2%2FCONFIRM_CHANGES')",
                "type": ".UI2.FDM_PAGE_REPOSITORY_SRV.Page",
                "uri": "/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/pageSet('%2FUI2%2FCONFIRM_CHANGES')"
            },
            "roles": {
                "__deferred": {
                    "uri": "/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/pageSet('%2FUI2%2FCONFIRM_CHANGES')/roles"
                }
            }
        },
        "uri": "/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/pageSet('%2FUI2%2FCONFIRM_CHANGES')"
    };
    var mServers = {};

    return {
        init: function (sRootUri, vMockedRoutes) {
            sRootUri = sRootUri || "/";
            // create
            mServers[sRootUri] = new MockServer({
                rootUri: sRootUri
            });
            // configure
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: 0
            });

            if (Array.isArray(vMockedRoutes)) {
                mServers[sRootUri].setRequests(vMockedRoutes);
            } else {
                mServers[sRootUri].simulate(vMockedRoutes.sMetadataPath, {
                    sMockdataBaseUrl: vMockedRoutes.sMockDataFolderPath,
                    bGenerateMissingMockData: true
                });
            }

            var aRequests = mServers[sRootUri].getRequests();
                aRequests.push({
                    method: "POST",
                    path: new RegExp(".*pageSet.*"),
                    response: function (oXhr, sUrlParams) {
                        if (new RegExp("^{\"id\":\"/UI2/CONFIRM_CHANGES").test(oXhr.requestBody)) {
                            jQuery.sap.log.debug("Mock Server: Incoming request for external resource");
                            var oResponse = {
                                data: oResponseConfirmDataChanges,
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8"
                                },
                                status: 412,
                                statusText: "Precondition Failed"
                            };
                            oXhr.respond(oResponse.status, oResponse.headers,
                                JSON.stringify(oResponse.data)
                            );
                            return true;
                        }
                        return false;
                    }
                });

            mServers[sRootUri].setRequests(aRequests);
            // start
            mServers[sRootUri].start();



            return mServers[sRootUri];
        },

        get: function (sRootUri) {
            return mServers[sRootUri];
        },

        destroy: function (sRootUri) {
            mServers[sRootUri].destroy();
            delete mServers[sRootUri];
        },

        destroyAll: function () {
            var aProperties = Object.getOwnPropertyNames(mServers);
            for (var i = 0; i < aProperties.length; i++) {
                mServers[aProperties[i]].destroy();
            }
        }
    };
});