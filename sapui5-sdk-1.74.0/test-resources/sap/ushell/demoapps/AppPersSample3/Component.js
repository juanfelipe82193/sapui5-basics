// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap*/

    // define a root UIComponent which exposes the main view
    jQuery.sap.declare("sap.ushell.demo.AppPersSample3.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    // new Component
    sap.ui.core.UIComponent.extend("sap.ushell.demo.AppPersSample3.Component", {

        oMainView : null,

        metadata : {
            manifest: "json"
        },

        createContent : function () {
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample3.App");
            return this.oMainView;
        }
    });

}());