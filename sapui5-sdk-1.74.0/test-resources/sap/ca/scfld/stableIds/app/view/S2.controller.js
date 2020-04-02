// Copyright (C) 2015 SAP SE or an SAP affiliate company. All rights reserved
(function () {
    "use strict";
    /*global jQuery, sap*/

    jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
    jQuery.sap.require("sap.ca.scfld.stableids.app.view.HeaderFooterOptionsCreator");

    sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.ca.scfld.stableids.app.view.S2", {
        onInit : function () {
        },

        getHeaderFooterOptions : function () {
            return sap.ca.scfld.stableids.app.view.HeaderFooterOptionsCreator
                .createHeaderFooterOptions("master") || {};
        }
    });
}());