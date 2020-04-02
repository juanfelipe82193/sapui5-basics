/*global sap, jQuery */
// define a root UIComponent which exposes the main view

sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.AppPersSample.Component", {

        oMainView : null,

        metadata : {
            manifest: "json"
        },

        createContent : function () {
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample.App");
            return this.oMainView;
        }

    });

});

