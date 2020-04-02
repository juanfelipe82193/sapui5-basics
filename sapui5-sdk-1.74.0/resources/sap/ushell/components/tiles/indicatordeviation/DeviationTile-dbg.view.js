// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/suite/ui/microchart/BulletMicroChartData",
    "sap/suite/ui/microchart/BulletMicroChart",
    "sap/ushell/components/tiles/sbtilecontent",
    "sap/m/GenericTile",
    "sap/ui/model/json/JSONModel"
], function (
    MobileLibrary,
    BulletMicroChartData,
    BulletMicroChart,
    sbtilecontent,
    GenericTile,
    JSONModel
) {
    "use strict";

    // shortcut for sap.m.Size
    var Size = MobileLibrary.Size;

    // shortcut for sap.m.LoadState
    var LoadState = MobileLibrary.LoadState;

    sap.ui.getCore().loadLibrary("sap.suite.ui.microchart");

    sap.ui.jsview("sap.ushell.components.tiles.indicatordeviation.DeviationTile", {
        getControllerName: function () {
            return "sap.ushell.components.tiles.indicatordeviation.DeviationTile";
        },
        createContent: function (/*oController*/) {
            this.setHeight("100%");
            this.setWidth("100%");
            var header = "Lorem ipsum";
            var subheader = "Lorem ipsum";
            var titleObj = sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(this.getViewData().chip);
            if (titleObj.title && titleObj.subTitle) {
                header = titleObj.title;
                subheader = titleObj.subTitle;
            }
            var deviationTileData = {
                subheader: subheader,
                header: header,
                footerNum: "",
                footerComp: "",
                frameType: "OneByOne",
                state: LoadState.Loading,
                scale: ""
            };

            var oBCDataTmpl = new BulletMicroChartData({
                value: "{value}",
                color: "{color}"
            });

            this.oBCTmpl = new BulletMicroChart({
                size: Size.Responsive,
                scale: "{/scale}",
                actual: {
                    value: "{/actual/value}",
                    color: "{/actual/color}"
                },
                targetValue: "{/targetValue}",
                actualValueLabel: "{/actualValueLabel}",
                targetValueLabel: "{/targetValueLabel}",
                thresholds: {
                    template: oBCDataTmpl,
                    path: "/thresholds"
                },
                state: "{/state}",
                showActualValue: "{/showActualValue}",
                showTargetValue: "{/showTargetValue}"
            });

            this.oNVConfS = new sbtilecontent({
                unit: "{/unit}",
                size: "{/size}",
                footer: "{/footerNum}",
                content: this.oBCTmpl
            });

            this.oGenericTile = new GenericTile({
                subheader: "{/subheader}",
                frameType: "{/frameType}",
                size: "{/size}",
                header: "{/header}",
                tileContent: [this.oNVConfS]
            });

            var oGenericTileModel = new JSONModel();
            oGenericTileModel.setData(deviationTileData);
            this.oGenericTile.setModel(oGenericTileModel);

            return this.oGenericTile;
        }
    });
}, /* bExport= */ true);
