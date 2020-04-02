sap.ui.define([
    "sap/ui/core/util/MockServer"
], function (MockServer) {
    "use strict";

    return {
        init: function () {

            // create
            var oMockServer = new MockServer({
                rootUri: "/here/goes/your/serviceUrl/"
            });

            // configure
            MockServer.config({
                autoRespond: true,
                autoRespondAfter: 1000
            });

            // simulate
            var sPath = jQuery.sap.getModulePath("TextInEditModeSource.mockserver");
            oMockServer.simulate(sPath + "/metadata.xml", sPath);

            // start
            oMockServer.start();
        }
    };
});