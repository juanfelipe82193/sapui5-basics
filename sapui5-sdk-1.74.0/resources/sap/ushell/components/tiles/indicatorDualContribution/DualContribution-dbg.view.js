// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Comparison Tile
sap.ui.define([
    "sap/m/NumericContent",
    "sap/m/TileContent",
    "sap/suite/ui/microchart/ComparisonMicroChartData",
    "sap/suite/ui/microchart/ComparisonMicroChart",
    "sap/m/GenericTile",
    "sap/ui/model/json/JSONModel"
], function (
    NumericContent,
    TileContent,
    ComparisonMicroChartData,
    ComparisonMicroChart,
    GenericTile,
    JSONModel
) {
    "use strict";

    sap.ui.getCore().loadLibrary("sap.suite.ui.microchart");

    sap.ui.jsview("tiles.indicatorDualContribution.DualContribution", {
        getControllerName: function () {
            return "tiles.indicatorDualContribution.DualContribution";
        },

        createContent: function () {
            this.setHeight("100%");
            this.setWidth("100%");

            var that = this;

            that.oGenericTileData = {};

            that.oNumericContent = new NumericContent({
                value: "{/value}",
                scale: "{/scale}",
                indicator: "{/indicator}",
                size: "{/size}",
                formatterValue: true,
                truncateValueTo: 6,
                valueColor: "{/valueColor}"
            });

            that.oNumericTile = new TileContent({
                unit: "{/unitNumeric}",
                size: "{/size}",
                footer: "{/footerNum}",
                content: that.oNumericContent
            });

            that.oCmprsDataTmpl = new ComparisonMicroChartData({
                title: "{title}",
                value: "{value}",
                color: "{color}",
                displayValue: "{displayValue}"
            });

            that.oCmprsChrtTmpl = new ComparisonMicroChart({
                size: "{/size}",
                scale: "{/scale}",
                data: {
                    template: that.oCmprsDataTmpl,
                    path: "/data"
                }
            });

            that.oComparisonTile = new TileContent({
                unit: "{/unitContribution}",
                size: "{/size}",
                footer: "{/footerComp}",
                content: that.oCmprsChrtTmpl
            });

            that.oGenericTile = new GenericTile({
                subheader: "{/subheader}",
                frameType: "{/frameType}",
                size: "{/size}",
                header: "{/header}",
                tileContent: [that.oNumericTile, that.oComparisonTile]
            });

            that.oGenericTileModel = new JSONModel();
            that.oGenericTileModel.setData(that.oGenericTileData);
            that.oGenericTile.setModel(that.oGenericTileModel);

            return that.oGenericTile;
        }
    });
}, /* bExport= */ true);
