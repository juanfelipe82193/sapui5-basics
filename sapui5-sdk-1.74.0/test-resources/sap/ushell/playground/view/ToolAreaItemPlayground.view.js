// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/shell/ToolAreaItem",
    "sap/m/MessageToast"
], function (ToolAreaItem, MessageToast) {
    "use strict";

    jQuery.sap.initMobile();

    sap.ui.jsview("sap.ushell.playground.view.ToolAreaItemPlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                icon: "sap-icon://world",
                selected: false,
                text: "Tool Area Item",
                visible: false,
                expandable: false
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);

            var oToolAreaItem = new ToolAreaItem({
                icon: "{/icon}",
                selected: "{/selected}",
                text: "{/text}",
                visible: "{/visible}",
                expandable: "{/expandable}"
            });

            var oGrid = new sap.ui.layout.Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oToolAreaItem]
            });

            var oIconLabel = new sap.m.Label({
                text: "Icon",
                labelFor: oIconSelect
            });

            var oIconSelect = new sap.m.Select("tool-area-item-icon-select", {
                items: [
                    new sap.ui.core.Item({
                        key: "sap-icon://world",
                        text: "world"
                    }),
                    new sap.ui.core.Item({
                        key: "",
                        text: "none"
                    }),
                    new sap.ui.core.Item("deleteItem", {
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

            var oTextLabel = new sap.m.Label({
                text: "Tool Area item Title",
                labelFor: oTextInput
            });

            var oTextInput = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter a Tool Area Item text ..."
            });
            oTextInput.bindValue("/text");

            var oExpandableLabel = new sap.m.Label({
                text: "Expandable",
                labelFor: oExpandableSwitch
            });

            var oExpandableSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    oData.expandable = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oSelectLabel = new sap.m.Label({
                text: "Selected",
                labelFor: oSelectSwitch
            });

            var oSelectSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    oData.selected = this.getState();
                    oModel.checkUpdate();
                }
            });

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

            var oPressLabel = new sap.m.Label({
                text: "Press Action",
                labelFor: "press-action"
            });

            var oPressSwitch = new sap.m.Switch({
                id: "press-action",
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oToolAreaItem.attachPress(fnPress);
                    } else {
                        oToolAreaItem.detachPress(fnPress);
                    }
                }
            });

            var oExpandLabel = new sap.m.Label({
                text: "Expand Action",
                labelFor: "press-action"
            });

            var oExpandSwitch = new sap.m.Switch({
                id: "expand-action",
                state: false,
                change: function (oEvent) {
                    var bState = oEvent.getParameter("state");
                    if (bState) {
                        oToolAreaItem.attachExpand(fnExpand);
                    } else {
                        oToolAreaItem.detachExpand(fnExpand);
                    }
                }
            });

            var fnPress = function (oEvent) {
                MessageToast.show("Tool area item is pressed");
            };

            var fnExpand = function (oEvent) {
                MessageToast.show("Expand tool area item");
            };

            var oForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Tool Area Item",
                editable: true,
                content: [oIconLabel, oIconSelect, oTextLabel, oTextInput, oExpandableLabel, oExpandableSwitch, oSelectLabel, oSelectSwitch,
                    oVisibleLabel, oVisibleSwitch, oPressLabel, oPressSwitch, oExpandLabel, oExpandSwitch
                ]
            });

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new sap.m.Page("toolAreaItemPage", {
                title: "Tool Area Item Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});