// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function () {
    "use strict";
    /* global jQuery, sap, window */


    /*************************************
     *
     * THIS COMPONENT IS ONLY NEEDED IN ORDER TO MAKE THE BUILD STEP FOR
     * ZIPPING / COMPONENT-PRELOAD BUILDING WORK!
     * LATER THE GENERATED ZIP WILL BE AUTOMATICALLY UPLOADED TO BSP REPOSITORY
     *
    *************************************/

    jQuery.sap.declare("sap_ushell_demotiles_abap_customTileDynamic.Component");

    sap.ui.define([
        "sap/ui/core/UIComponent"
    ], function (UIComponent) {
        return UIComponent.extend("sap_ushell_demotiles_abap_customTileDynamic.Component", {
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
                var oTile = sap.ui.view({
                    viewName: "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile",
                    type: sap.ui.core.mvc.ViewType.JS
                });

                this._controller = oTile.getController();

                return oTile;
            }
        });
    });

}());