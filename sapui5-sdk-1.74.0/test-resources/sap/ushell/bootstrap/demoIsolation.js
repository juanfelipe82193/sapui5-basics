// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, window */

    window['sap-ui-config'] = {
        "xx-bootTask": function (fnCallback) {
            jQuery.sap.require("sap.ushell.services.Container");
            sap.ushell.bootstrap("local").done(fnCallback);

            jQuery.sap.registerModulePath("sap.ushell.shells.demo", ".");
            jQuery.sap.require("sap.ushell.shells.demo.fioriDemoConfig");
        }
    };
}());
