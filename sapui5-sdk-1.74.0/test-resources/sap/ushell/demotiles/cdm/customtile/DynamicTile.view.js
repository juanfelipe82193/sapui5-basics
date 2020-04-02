// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

(function () {
    "use strict";

    sap.ui.jsview("sap.ushell.demotiles.cdm.customtile.DynamicTile", {
        getControllerName: function () {
            return "sap.ushell.demotiles.cdm.customtile.DynamicTile";
        },

        createContent: function () {
            this.setHeight("100%");
            this.setWidth("100%");
        },

        getTileControl: function () {
            jQuery.sap.require("sap.m.GenericTile");
            var oController = this.getController();

            var oTile = new sap.m.GenericTile({
                mode: sap.m.GenericTileMode.ContentMode,
                header: "{/data/display_title_text}",
                subheader: "{/data/display_subtitle_text}",
                size: "Auto",
                sizeBehavior: "{/sizeBehavior}",
                // custom tile tag:
                backgroundImage: "{/backgroundImage}",
                tileContent: [new sap.m.TileContent({
                    size: "Auto",
                    footer: "{/data/display_info_text}",
                    unit: "{/data/display_number_unit}",
                    // We'll utilize NumericContent for the "Dynamic" content.
                    content: [new sap.m.NumericContent({
                        scale: "{/data/display_number_factor}",
                        value: "{/data/display_number_value}",
                        truncateValueTo: 5, // Otherwise, The default value is 4.
                        indicator: "{/data/display_state_arrow}",
                        valueColor: "{/data/display_number_state}",
                        icon: "{/data/display_icon_url}",
                        width: "100%"
                    })]
                })],
                press: [oController.onPress, oController]
            });
            return oTile;
        }
    });
}());
