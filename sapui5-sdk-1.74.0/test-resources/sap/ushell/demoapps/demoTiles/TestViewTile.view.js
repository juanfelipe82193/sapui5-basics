// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";

    jQuery.sap.require("sap.ushell.ui.tile.StaticTile");

    sap.ui.jsview("sap.ushell.demo.demoTiles.TestViewTile", {
        createContent: function (oController) {
            this.setDisplayBlock(true);
            var oViewData = this.getViewData && this.getViewData(),
                oTile = new sap.ushell.ui.tile.StaticTile(oViewData.properties);
            oController._handleTilePress(oTile);

            return oTile;
        },

        getControllerName: function () {
            return "sap.ushell.demo.demoTiles.TestViewTile";
        }
    });
}());
