// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/GenericTile",
], function (GenericTile) {
    "use strict";

    sap.ui.jsview("sap.ushell.demotiles.abap.customTileDynamic.DynamicTile", {
        getControllerName: function () {
            return "sap.ushell.demotiles.abap.customTileDynamic.DynamicTile";
        },

        createContent: function (/*oController*/) {
            this.setHeight("100%");
            this.setWidth("100%");

            return this.getTileControl();
        },

        getTileControl: function () {
            var oController = this.getController();

            return new GenericTile({
                mode: "{/mode}",
                header: "{/data/display_title_text}",
                subheader: "{/data/display_subtitle_text}",
                size: "Auto",
                sizeBehavior: "{/sizeBehavior}",
                backgroundImage: "{/backgroundImage}",
                tileContent: [new sap.m.TileContent({
                    size: "Auto",
                    footer: "{/data/display_info_text}",
                    footerColor: {
                        path: "/data/display_info_state",
                        formatter: function (sFootterColor) {
                            if (!sap.m.ValueColor[sFootterColor]) {
                                sFootterColor = sap.m.ValueColor.Neutral;
                            }
                            return sFootterColor;
                        }
                    },
                    unit: "{/data/display_number_unit}",
                    // We'll utilize NumericContent for the "Dynamic" content.
                    content: [new sap.m.NumericContent({
                        scale: "{/data/display_number_factor}",
                        value: "{/data/display_number_value}",
                        truncateValueTo: 5, // Otherwise, The default value is 4.
                        indicator: "{/data/display_state_arrow}",
                        valueColor: {
                            path: "/data/display_number_state",
                            formatter: function (sValueColor) {
                                if (!sap.m.ValueColor[sValueColor]) {
                                    sValueColor = sap.m.ValueColor.Neutral;
                                }
                                return sValueColor;
                            }
                        },
                        icon: "{/data/display_icon_url}",
                        width: "100%"
                    })]
                })],
                press: [oController.onPress, oController]
            });
        },

        /*
        We should change the color of the text in the footer ("info") to be as received in the tile data in the property (infostate).
        We used to have this functionality when we used the BaseTile. (we added a class which change the text color).
        Today The GenericTile doesn't support this feature, and it is impossible to change the text color.
        Since this feature is documented, we should support it - See BCP:1780008386.
        */
        onAfterRendering: function () {
            var oModel = this.getModel(),
                sDisplayInfoState = oModel.getProperty("/data/display_info_state"),
                elDomRef = this.getDomRef(),
                elFooterInfo = elDomRef ? elDomRef.getElementsByClassName("sapMTileCntFtrTxt")[0] : null;

            if (elFooterInfo) {
                switch (sDisplayInfoState) {
                    case "Negative":
                        //add class for Negative.
                        elFooterInfo.classList.add("sapUshellTileFooterInfoNegative");
                        break;
                    case "Neutral":
                        //add class for Neutral.
                        elFooterInfo.classList.add("sapUshellTileFooterInfoNeutral");
                        break;
                    case "Positive":
                        //add class for Positive.
                        elFooterInfo.classList.add("sapUshellTileFooterInfoPositive");
                        break;
                    case "Critical":
                        //add class for Critical.
                        elFooterInfo.classList.add("sapUshellTileFooterInfoCritical");
                        break;
                    default:
                        return;
                }
            }
        }
    });
});
