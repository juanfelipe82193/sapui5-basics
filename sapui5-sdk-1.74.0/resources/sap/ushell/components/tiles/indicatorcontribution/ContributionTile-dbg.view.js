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

    sap.ui.jsview("sap.ushell.components.tiles.indicatorcontribution.ContributionTile", {
        getControllerName: function () {
            return "sap.ushell.components.tiles.indicatorcontribution.ContributionTile";
        },

        createContent: function () {
            this.setHeight("100%");
            this.setWidth("100%");
            var Size = MobileLibrary.Size;
            var that = this;

            that.oGenericTileData = {
                /*
                subheader : "Lorem Ipsum SubHeader",
                header : "Lorem Ipsum Header",
                value: 8888,
                size: sap.suite.ui.commons.InfoTileSize.Auto,
                frameType:"OneByOne",
                state: sap.suite.ui.commons.LoadState.Loading,
                valueColor:sap.suite.ui.commons.InfoTileValueColor.Error,
                indicator: sap.suite.ui.commons.DeviationIndicator.None,
                title : "US Profit Margin",
                footer : "Current Quarter",
                description: "Maximum deviation",
                data: [
                    { title: "Americas", value: 10, color: "Neutral" },
                    { title: "EMEA", value: 50, color: "Neutral" },
                    { title: "APAC", value: -20, color: "Neutral" }
                ]
                */
            };

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
            //oComparisonTile
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
