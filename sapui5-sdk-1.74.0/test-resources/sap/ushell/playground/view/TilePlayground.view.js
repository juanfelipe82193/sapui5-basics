// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/launchpad/Tile",
    "sap/m/MessageToast"
], function (Tile, MessageToast) {
    "use strict";

    jQuery.sap.initMobile();

    sap.ui.jsview("sap.ushell.playground.view.TilePlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                visible: false,
                long: false,
                tileActionModeActive: false,
                target: "PlaygroundHomepage.html",
                animationRendered: true
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);

            var oVisibleLabel = new sap.m.Label({
                text: "Visible",
                labelFor: oVisibleSwitch
            });

            var oVisibleSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    oData.visible = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oLongLabel = new sap.m.Label({
                text: "Long",
                labelFor: oLongSwitch
            });

            var oLongSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    oData.long = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oTargetLabel = new sap.m.Label({
                text: "Target",
                labelFor: oTargetSelect
            });

            var oTargetSelect = new sap.m.Select("target-select", {
                items: [
                    new sap.ui.core.Item("pl-item", {
                        key: "playgroundHomepage",
                        text: "PlaygroundHomepage.html"
                    })
                ],
                selectedItem: "playgroundHomepage",
                change: function (oEvt) {
                    oData.target = oEvt.getParameter("selectedItem").getKey();
                    oModel.checkUpdate();
                }
            });

            var oTileActionModeActiveLabel = new sap.m.Label({
                text: "Tile Action Mode Active",
                labelFor: oTileActionModeActiveSwitch
            });

            var oTileActionModeActiveSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    oData.tileActionModeActive = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oPinButton = new sap.m.Button({
                text: "Pin Button",
                press: function () {
                    MessageToast.show("Pin button is pressed");
                }
            });

            var oPinButtonLabel = new sap.m.Label({
                text: "Show Pin Button",
                labelFor: oPinButtonSwitch
            });

            var oPinButtonSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    if (this.getState()) {
                        oTile.addPinButton(oPinButton);
                    } else {
                        oTile.removePinButton(0);
                    }
                }
            });

            var oTileView = new sap.m.Text({
                text: "Tile View"
            });

            var oTileViewLabel = new sap.m.Label({
                text: "Show Tile View",
                labelFor: oTileViewSwitch
            });

            var oTileViewSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    if (this.getState()) {
                        oTile.addTileView(oTileView);
                    } else {
                        oTile.removeTileView(0);
                    }
                }
            });

            var fnPress = function (oEvent) {
                MessageToast.show("Tile is pressed");
            };

            var oPressLabel = new sap.m.Label({
                text: "Press Action",
                labelFor: oPressSwitch
            });

            var oPressSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oTile.attachPress(fnPress);
                    } else {
                        oTile.detachPress(fnPress);
                    }
                }
            });

            var fnDeletePress = function (oEvent) {
                MessageToast.show("Delete is pressed");
            };

            var oDeletePressLabel = new sap.m.Label({
                text: "Delete Action",
                labelFor: oDeletePressSwitch
            });

            var oDeletePressSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oTile.attachDeletePress(fnDeletePress);
                    } else {
                        oTile.detachDeletePress(fnDeletePress);
                    }
                }
            });

            var fnAfterRendering = function (oEvent) {
                MessageToast.show("Tile has been rendered");
            };

            var oTile = new Tile({
                visible: "{/visible}",
                tileActionModeActive: "{/tileActionModeActive}",
                animationRendered: true,
                long: "{/long}",
                target: "{/target}",
                afterRendering: fnAfterRendering
            });

            oTile.addEventDelegate({
                onAfterRendering: function () {
                    this.setRgba("rgba(153, 204, 255, 0.3)");
                }.bind(oTile)
            });

            var oGrid = new sap.ui.layout.Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oTile]
            });

            var oForm = new sap.ui.layout.form.SimpleForm({
                title: "Modify Tile",
                editable: true,
                layout: "ColumnLayout",
                content: [
                    new sap.ui.core.Title({
                        text: "Modify Tile"
                    }),
                    oVisibleLabel, oVisibleSwitch, oLongLabel, oLongSwitch, oTargetLabel, oTargetSelect, oTileActionModeActiveLabel, oTileActionModeActiveSwitch,
                    oTileViewLabel, oTileViewSwitch, oPinButtonLabel, oPinButtonSwitch, oPressLabel, oPressSwitch,
                    oDeletePressLabel, oDeletePressSwitch
                ]
            });

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new sap.m.Page("tilePage", {
                title: "Tile Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});