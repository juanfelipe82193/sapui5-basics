// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/tile/TileBase",
    "sap/m/MessageToast"
], function (TileBase, MessageToast) {
    "use strict";

    jQuery.sap.initMobile();
    sap.ui.jsview("sap.ushell.playground.view.TileBasePlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {

            var oData = {
                title: "title",
                subtitle: "subtitle",
                icon: "sap-icon://world",
                info: "Tile Base Info",
                highlightTerms: "highlightTerms"
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);

            var oTileBase = new TileBase({
                title: "{/title}",
                subtitle: "{/subtitle}",
                icon: "{/icon}",
                info: "{/info}",
                highlightTerms: "{/highlightTerms}"
            });

            var oPressLabel = new sap.m.Label({
                text: "Press Action",
                labelFor: oPressSwitch
            });

            var oPressSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oTileBase.attachPress(fnPress);
                    } else {
                        oTileBase.detachPress(fnPress);
                    }
                }
            });

            var fnPress = function (oEvent) {
                MessageToast.show("Tile Base is pressed");
            };

            var oIconLabel = new sap.m.Label({
                text: "Icon",
                labelFor: oIconSelect
            });

            var oIconSelect = new sap.m.Select("tile-base-icon-select", {
                items: [
                    new sap.ui.core.Item("world-item", {
                        key: "sap-icon://world",
                        text: "world"
                    }),
                    new sap.ui.core.Item({
                        key: "",
                        text: "none"
                    }),
                    new sap.ui.core.Item({
                        key: "sap-icon://delete",
                        text: "delete"
                    }),
                    new sap.ui.core.Item({
                        key: "sap-icon://refresh",
                        text: "refresh"
                    })
                ],
                change: function (oEvt) {
                    oData.icon = oEvt.getParameter("selectedItem").getKey();
                    oModel.checkUpdate();
                }
            });

            var oTitleLabel = new sap.m.Label({
                text: "Tile Base Title",
                labelFor: oTitleInput
            });

            var oTitleInput = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter tile base title ..."
            });
            oTitleInput.bindValue("/title");

            var oSubtitleLabel = new sap.m.Label({
                text: "Tile Base Subitle",
                labelFor: oSubtitleInput
            });

            var oSubtitleInput = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter tile base subtitle ..."
            });
            oSubtitleInput.bindValue("/subtitle");

            var oInfoLabel = new sap.m.Label({
                text: "Tile Base Info",
                labelFor: oInfoInput
            });

            var oInfoInput = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter tile base info ..."
            });
            oInfoInput.bindValue("/info");

            var oHighlightTermsLabel = new sap.m.Label({
                text: "Tile Highlight Terms",
                labelFor: oHighlightTermsInput
            });

            var oHighlightTermsInput = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter highlight terms ..."
            });
            oHighlightTermsInput.bindValue("/highlightTerms");

            var oGrid = new sap.ui.layout.Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oTileBase]
            });

            var oForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Tile Base",
                editable: true,
                content: [oIconLabel, oIconSelect, oTitleLabel, oTitleInput, oSubtitleLabel, oSubtitleInput, oInfoLabel, oInfoInput, oPressLabel, oPressSwitch, oHighlightTermsLabel, oHighlightTermsInput
                ]
            });

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new sap.m.Page("tileBasePage", {
                title: "Tile Base Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});