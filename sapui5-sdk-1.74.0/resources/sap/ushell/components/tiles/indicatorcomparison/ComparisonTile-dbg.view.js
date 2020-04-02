// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// Comparison Tile
sap.ui.define([
    "sap/suite/ui/microchart/ComparisonMicroChartData",
    "sap/suite/ui/microchart/ComparisonMicroChart",
    "sap/ushell/components/tiles/sbtilecontent",
    "sap/m/GenericTile",
    "sap/ui/model/json/JSONModel",
    "sap/m/library"
], function (
    ComparisonMicroChartData,
    ComparisonMicroChart,
    sbtilecontent,
    GenericTile,
    JSONModel,
    MobileLibrary
) {
    "use strict";

    sap.ui.getCore().loadLibrary("sap.suite.ui.microchart");

    sap.ui.jsview("sap.ushell.components.tiles.indicatorcomparison.ComparisonTile", {
        getControllerName: function () {
            return "sap.ushell.components.tiles.indicatorcomparison.ComparisonTile";
        },
        createContent: function () {
            this.setHeight("100%");
            this.setWidth("100%");
            var Size = MobileLibrary.Size;
            var that = this;

            that.oGenericTileData = {};

            that.oCmprsDataTmpl = new ComparisonMicroChartData({
                title: "{title}",
                value: "{value}",
                color: "{color}",
                displayValue: "{displayValue}"
            });

            that.oCmprsChrtTmpl = new ComparisonMicroChart({
                size: Size.Responsive,
                scale: "{/scale}",
                data: {
                    template: that.oCmprsDataTmpl,
                    path: "/data"
                }
            });
            that.oNVConfS = new sbtilecontent({
                unit: "{/unit}",
                size: "{/size}",
                footer: "{/footerComp}",
                content: that.oCmprsChrtTmpl
            });

            that.oGenericTile = new GenericTile({
                subheader: "{/subheader}",
                frameType: "{/frameType}",
                size: "{/size}",
                header: "{/header}",
                tileContent: [that.oNVConfS]
            });

            that.oGenericTileModel = new JSONModel();
            that.oGenericTileModel.setData(that.oGenericTileData);
            that.oGenericTile.setModel(that.oGenericTileModel);

            return that.oGenericTile;
        }
    });
}, /* bExport= */ true);
