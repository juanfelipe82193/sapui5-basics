// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
jQuery.sap.declare("sap.ushell.demo.demoTiles.Component");
jQuery.sap.require("sap.ui.core.UIComponent");
jQuery.sap.require("sap.ushell.ui.tile.StaticTile");

"use strict";
/*global jQuery, sap, window, hasher */
sap.ui.core.UIComponent.extend("sap.ushell.demo.demoTiles.Component", {
    metadata: {

        version: "1.74.0",

        library: "sap.ushell.demo.demoTiles",

        dependencies: {
            libs: ["sap.m"]
        },
        config: {
        }
    },

    createContent: function () {
        var oComponentData = this.getComponentData && this.getComponentData(),
            oTile = new sap.ushell.ui.tile.StaticTile(oComponentData.properties);
        oTile.attachPress(
            function () {
                if (typeof this.getTargetURL === 'function') {
                    var sTargetURL = this.getTargetURL();
                    if (sTargetURL) {
                        if (sTargetURL[0] === '#') {
                            hasher.setHash(sTargetURL);
                        } else {
                            window.open(sTargetURL, '_blank');
                        }
                    }
                }
            }
        );
        return oTile;
    }

});
