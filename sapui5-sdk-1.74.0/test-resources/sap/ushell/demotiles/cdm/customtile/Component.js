// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /* global jQuery, sap, window */

    jQuery.sap.declare("sap.ushell.demotiles.cdm.customtile.Component");

    sap.ui.define([
        "sap/ui/core/UIComponent"
    ], function (UIComponent) {
        return UIComponent.extend("sap.ushell.demotiles.cdm.customtile.Component", {
            metadata: {
                "manifest": "json"
            },

            // new API
            tileSetVisible: function (bNewVisibility) {
                // forward to controller
                this._controller.visibleHandler(bNewVisibility);
            },

            // new API
            tileRefresh: function () {
                // forward to controller
                this._controller.refreshHandler(this._controller);
            },

            // new API
            tileSetVisualProperties: function (oNewVisualProperties) {
                // forward to controller
                this._controller.setVisualPropertiesHandler(oNewVisualProperties);
            },

            createContent: function () {
                // For better testing of the core-ext-light load logic
                // some dependencies from it are required here.
                // The core-ext-light should always be loaded before this file,
                // so in the network trace you should not see request for the files below.
                //
                // Note: during local development with the flp_proxy
                // this has the effect, that those files are always loaded
                // independent if core-ext-light was already loaded or not.
                // This is because core-ext-light is empty locally so that
                // local resources are not "hidden" by it.
                sap.ui.require([
                    "sap/m/Table",
                    "sap/m/TimePicker",
                    "sap/m/Tree"
                ], function () {
                    console.log("modules from core-ext-light.js have been loaded");
                });

                var oTile = sap.ui.view({
                    viewName: "sap.ushell.demotiles.cdm.customtile.DynamicTile",
                    type: sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
    });

}());