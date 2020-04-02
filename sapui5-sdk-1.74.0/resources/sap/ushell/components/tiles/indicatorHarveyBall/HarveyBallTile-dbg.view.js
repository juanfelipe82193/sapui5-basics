// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.require([
    "sap/suite/ui/commons/HarveyBallMicroChart",
    "sap/suite/ui/commons/HarveyBallMicroChartItem",
    "sap/suite/ui/commons/TileContent",
    "sap/suite/ui/commons/GenericTile"
], function (
    HarveyBallMicroChart,
    HarveyBallMicroChartItem,
    TileContent,
    GenericTile
) {
    "use strict";

    sap.ui.jsview("tiles.indicatorHarveyBall.HarveyBallTile", {
        getControllerName: function () {
            //return "tiles.indicatorHarveyBall.HarveyBallTile"; // comment to prevent the tile from loading
        },

        createContent: function (/*oController*/) {
            var microChart = new HarveyBallMicroChart({
                total: "{/value}",
                size: "{/size}",
                totalLabel: "{/totalLabel}",
                items: [new HarveyBallMicroChartItem({
                    fraction: "{/fractionValue}",
                    fractionLabel: "{/fractionLabel}",
                    color: "{/color}"
                })]
            });

            var tileContent = new TileContent({
                size: "{/size}",
                content: microChart
            });

            this.oTile = new GenericTile({
                subheader: "{/subheader}",
                frameType: "{/frameType}",
                size: "{/size}",
                header: "{/header}",
                tileContent: [tileContent]
            });
            //return this.oTile; // comment to prevent the tile from loading
        }
    });
});
