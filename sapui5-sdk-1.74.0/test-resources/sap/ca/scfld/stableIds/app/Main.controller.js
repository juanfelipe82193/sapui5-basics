// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
(function () {
    "use strict";
    /*global jQuery, sap*/
    sap.ui.controller("sap.ca.scfld.stableids.app.Main", {

        onInit : function () {
            jQuery.sap.require("sap.ca.scfld.md.Startup");
            sap.ca.scfld.md.Startup.init('sap.ca.scfld.stableids.app', this);
        }
    });
}());