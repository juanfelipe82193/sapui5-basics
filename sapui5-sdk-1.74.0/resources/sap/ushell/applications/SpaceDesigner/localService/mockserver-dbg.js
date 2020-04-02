// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define(["sap/ui/core/util/MockServer"], function (MockServer) {
    "use strict";

    return {
        init: function (sRootUri, sMetadataUrl, config) {
            sRootUri = sRootUri || "/";

            var oMockServer = new MockServer({
                rootUri: sRootUri
            });

            MockServer.config({
                autoRespond: true,
                autoRespondAfter: 0
            });

            oMockServer.simulate(sMetadataUrl, config);

            oMockServer.start();
        }
    };
});