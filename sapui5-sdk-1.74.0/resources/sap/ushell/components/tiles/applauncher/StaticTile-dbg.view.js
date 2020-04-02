// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/GenericTile",
    "sap/m/ImageContent",
    "sap/m/TileContent"
], function (GenericTile, ImageContent, TileContent) {
    "use strict";

    sap.ui.jsview("sap.ushell.components.tiles.applauncher.StaticTile", {
        getControllerName: function () {
            return "sap.ushell.components.tiles.applauncher.StaticTile";
        },
        createContent: function (/*oController*/) {
            this.setHeight("100%");
            this.setWidth("100%");

            return this.getTileControl();
        },
        getTileControl: function () {
            var oController = this.getController();

            return new GenericTile({
                mode: "{= ${/mode} || (${/config/display_icon_url} ? 'ContentMode' : 'HeaderMode') }",
                header: "{/config/display_title_text}",
                subheader: "{/config/display_subtitle_text}",
                sizeBehavior: "{/sizeBehavior}",
                wrappingType: "{/wrappingType}",
                size: "Auto",
                tileContent: new TileContent({
                    size: "Auto",
                    footer: "{/config/display_info_text}",
                    content: new ImageContent({
                        src: "{/config/display_icon_url}"
                    })
                }),
                press: [oController.onPress, oController]
            });
        },
        getMode: function () {
            return this.getModel().getProperty("/mode")
                || (this.getModel().getProperty("/config/display_icon_url") ? "ContentMode" : "HeaderMode");
        }
    });
});
