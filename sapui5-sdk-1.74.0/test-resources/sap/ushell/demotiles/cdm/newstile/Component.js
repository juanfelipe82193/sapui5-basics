// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
(function() {
"use strict";
/* global jQuery, sap, window */

jQuery.sap.declare("sap.ushell.demotiles.cdm.newstile.Component");

sap.ui.define([
               "sap/ui/core/UIComponent"
    ], function(UIComponent) {
        return UIComponent.extend("sap.ushell.demotiles.cdm.newstile.Component", {
            metadata : {
                "manifest": "json"
            },

            // new API (optional)
            tileSetVisible : function(bNewVisibility) {
                // forward to controller
                // not implemented
                //this._controller.visibleHandler(bNewVisibility);
            },

            // new API (optional)
            tileRefresh : function() {
                // forward to controller
                this._controller.refresh(this._controller);
            },

            // new API (mandatory)
            tileSetVisualProperties : function(oNewVisualProperties) {
                // forward to controller
                // NOP: visual properties are not displayed on the tile
            },

            createContent : function() {
                var oTile = sap.ui.view({
                    viewName : "sap.ushell.demotiles.cdm.newstile.NewsTile",
                    type : sap.ui.core.mvc.ViewType.JS,
                    async: true
                });

                oTile.loaded().then(function (oView) {
                    this._controller = oTile.getController();
                }.bind(this));

                return oTile;
            }
        });
});
}());