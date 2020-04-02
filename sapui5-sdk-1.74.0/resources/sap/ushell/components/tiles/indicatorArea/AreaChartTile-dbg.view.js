// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/suite/ui/microchart/AreaMicroChartItem",
    "sap/suite/ui/microchart/AreaMicroChartPoint",
    "sap/suite/ui/microchart/AreaMicroChartLabel",
    "sap/m/library",
    "sap/suite/ui/microchart/AreaMicroChart",
    "sap/ushell/components/tiles/sbtilecontent",
    "sap/m/GenericTile",
    "sap/ui/model/json/JSONModel"
], function (
    AreaMicroChartItem,
    AreaMicroChartPoint,
    AreaMicroChartLabel,
    MobileLibrary,
    AreaMicroChart,
    sbtilecontent,
    GenericTile,
    JSONModel
) {
    "use strict";

    // shortcut for sap.m.LoadState
    var LoadState = MobileLibrary.LoadState;

    sap.ui.getCore().loadLibrary("sap.suite.ui.microchart");

    sap.ui.jsview("sap.ushell.components.tiles.indicatorArea.AreaChartTile", {
        getControllerName: function () {
            return "sap.ushell.components.tiles.indicatorArea.AreaChartTile";
        },

        createContent: function (/*oController*/) {
            this.setHeight("100%");
            this.setWidth("100%");
            var header = "Lorem ipsum";
            var subheader = "Lorem ipsum";
            var Size = MobileLibrary.Size;

            var titleObj = sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(
                this.getViewData().chip);
            if (titleObj.title && titleObj.subTitle) {
                header = titleObj.title;
                subheader = titleObj.subTitle;
            }
            var buildChartItem = function (sName) {
                return new AreaMicroChartItem({
                    color: "Good",
                    points: {
                        path: "/" + sName + "/data",
                        template: new AreaMicroChartPoint({
                            x: "{day}",
                            y: "{balance}"

                        })
                    }
                });
            };

            var buildMACLabel = function (sName) {
                return new AreaMicroChartLabel({
                    label: "{/" + sName + "/label}",
                    color: "{/" + sName + "/color}"
                });
            };

            var oGenericTileData = {
                subheader: subheader,
                header: header,
                footerNum: "",
                footerComp: "",
                scale: "",
                unit: "",
                value: 8888,
                size: "Auto",
                frameType: "OneByOne",
                state: LoadState.Loading
            };

            this.oNVConfContS = new AreaMicroChart({
                width: "{/width}",
                height: "{/height}",
                size: Size.Responsive,
                target: buildChartItem("target"),
                innerMinThreshold: buildChartItem("innerMinThreshold"),
                innerMaxThreshold: buildChartItem("innerMaxThreshold"),
                minThreshold: buildChartItem("minThreshold"),
                maxThreshold: buildChartItem("maxThreshold"),
                chart: buildChartItem("chart"),
                minXValue: "{/minXValue}",
                maxXValue: "{/maxXValue}",
                minYValue: "{/minYValue}",
                maxYValue: "{/maxYValue}",
                firstXLabel: buildMACLabel("firstXLabel"),
                lastXLabel: buildMACLabel("lastXLabel"),
                firstYLabel: buildMACLabel("firstYLabel"),
                lastYLabel: buildMACLabel("lastYLabel"),
                minLabel: buildMACLabel("minLabel"),
                maxLabel: buildMACLabel("maxLabel")
            });

            this.oNVConfS = new sbtilecontent({
                unit: "{/unit}",
                size: "{/size}",
                footer: "{/footerNum}",
                content: this.oNVConfContS
            });

            this.oGenericTile = new GenericTile({
                subheader: "{/subheader}",
                frameType: "{/frameType}",
                size: "{/size}",
                header: "{/header}",
                tileContent: [this.oNVConfS]
            });

            var oGenericTileModel = new JSONModel();
            oGenericTileModel.setData(oGenericTileData);
            this.oGenericTile.setModel(oGenericTileModel);

            return this.oGenericTile;
        }
    });
}, /* bExport= */ true);
