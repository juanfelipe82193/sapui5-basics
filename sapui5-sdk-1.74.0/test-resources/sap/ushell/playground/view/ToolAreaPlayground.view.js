// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/shell/ToolArea",
    "sap/ushell/ui/shell/ToolAreaItem",
    "sap/m/MessageToast"
], function (ToolArea, ToolAreaItem, MessageToast) {
    "use strict";

    jQuery.sap.initMobile();

    sap.ui.jsview("sap.ushell.playground.view.ToolAreaPlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {

            var oData = {
                size: "56px",
                textVisible: false
            };
            var oModel = new sap.ui.model.json.JSONModel(oData);

            var oSiazeLabel = new sap.m.Label({
                text: "Size",
                labelFor: oSizeInput
            });

            var oSizeInput = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter a size ..."
            });
            oSizeInput.bindValue("/size");

            var oTextVisibleLabel = new sap.m.Label({
                text: "Text Visible",
                labelFor: oTextVisibleSwitch
            });

            var oTextVisibleSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    oData.textVisible = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oToolAreaItemLabel = new sap.m.Label({
                text: "Tool Area Item",
                labelFor: oItemAddButton
            });

            var oItemAddButton = new sap.m.Button({
                text: "Add",
                press: function () {
                    var oItem = new ToolAreaItem({
                        icon: "sap-icon://activity-items",
                        text: "Tool Area Item",
                        press: function () {
                            MessageToast.show("Tool Area Item");
                        }
                    });
                    oToolArea.addToolAreaItem(oItem);
                }
            });

            var oItemRemoveButton = new sap.m.Button("toolAreaItemRemove", {
                text: "Remove",
                type: sap.m.ButtonType.Reject,
                press: function () {
                    oToolArea.removeToolAreaItem(0);
                }
            });

            var oToolArea = new ToolArea({
                size: "{/size}",
                textVisible: "{/textVisible}"
            });

            var oGrid = new sap.ui.layout.Grid({
                defaultSpan: "XL4 L4 M6 S12",
                content: [oToolArea]
            });

            var oForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                title: "Modify Tool Area",
                editable: true,
                content: [oSiazeLabel, oSizeInput, oTextVisibleLabel, oTextVisibleSwitch,
                    oToolAreaItemLabel, oItemAddButton, oItemRemoveButton
                ]
            });

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oGrid,
                height: "400px"
            });

            var oPage = new sap.m.Page("toolAreaPage", {
                title: "Tool Area Demo",
                content: [oControlPanel, oForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});