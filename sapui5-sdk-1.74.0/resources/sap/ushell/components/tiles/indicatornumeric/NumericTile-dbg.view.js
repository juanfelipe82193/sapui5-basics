// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/m/library",
    "sap/m/NumericContent",
    "sap/ushell/components/tiles/sbtilecontent",
    "sap/m/GenericTile",
    "sap/ui/model/json/JSONModel"
], function (
    mobileLibrary,
    NumericContent,
    sbtilecontent,
    GenericTile,
    JSONModel
) {
    "use strict";

    // shortcut for sap.m.DeviationIndicator
    var DeviationIndicator = mobileLibrary.DeviationIndicator;

    // shortcut for sap.m.ValueColor
    var ValueColor = mobileLibrary.ValueColor;

    // shortcut for sap.m.LoadState
    var LoadState = mobileLibrary.LoadState;

    sap.ui.getCore().loadLibrary("sap.suite.ui.commons");

    sap.ui.jsview("sap.ushell.components.tiles.indicatornumeric.NumericTile", {
        getControllerName: function () {
            return "sap.ushell.components.tiles.indicatornumeric.NumericTile";
        },
        createContent: function () {
            var header = "Lorem ipsum";
            var subheader = "Lorem ipsum";

            var titleObj = sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(this.getViewData().chip);
            if (titleObj.title && titleObj.subTitle) {
                header = titleObj.title;
                subheader = titleObj.subTitle;
            }
            var oGenericTileData = {
                subheader: subheader,
                header: header,
                footerNum: "",
                footerComp: "",
                scale: "",
                unit: "",
                value: "",
                size: "Auto",
                frameType: "OneByOne",
                state: LoadState.Loading,
                valueColor: ValueColor.Neutral,
                indicator: DeviationIndicator.None,
                title: "",
                footer: "",
                description: ""
            };

            this.oNVConfContS = new NumericContent({
                value: "{/value}",
                scale: "{/scale}",
                unit: "{/unit}",
                indicator: "{/indicator}",
                valueColor: "{/valueColor}",
                size: "{/size}",
                formatterValue: true,
                truncateValueTo: 5,
                nullifyValue: false
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
