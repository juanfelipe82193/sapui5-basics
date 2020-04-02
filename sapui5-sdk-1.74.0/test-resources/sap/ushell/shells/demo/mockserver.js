(function () {
    "use strict";
    /*global jQuery, sap */

    jQuery.sap.declare("sap.ushell.shells.demo.mockserver");
    jQuery.sap.require("sap.ui.core.util.MockServer");

    sap.ushell.shells.demo.mockserver = {};

    sap.ushell.shells.demo.mockserver.loadMockServer = function (sMockServerBaseUri, rootUri){
        this.mockServer = new sap.ui.core.util.MockServer({rootUri: rootUri});
        this.mockServer.simulate(/* sServiceUri?!*/sMockServerBaseUri + "metadata.xml", {
            sMockdataBaseUrl: sMockServerBaseUri,
            bGenerateMissingMockData: true
        });
        this.mockServer.start();
    };

    sap.ushell.shells.demo.mockserver.close = function (namespace) {
        this.mockserver.destroy();
    };

}());
