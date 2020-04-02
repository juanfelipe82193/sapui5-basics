// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/ShellHeader",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/playground/mock/ContainerMock",
    "sap/m/MessageToast"
], function (
    ShellHeader,
    ShellHeadItem,
    ShellAppTitle,
    ContainerMock,
    MessageToast
) {
    "use strict";

    jQuery.sap.initMobile();

    sap.ui.jsview("sap.ushell.playground.view.ShellHeaderPlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },
        _createPage: function () {
            var oData = {
                currentState: "",
                visible: false,
                logo: "",
                showLogo: false
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);
            sap.ui.getCore().setModel(oModel);

            sap.ushell.Container = new ContainerMock();

            var oShellHeaderVsbLabel = new sap.m.Label({
                text: "Shell Header",
                labelFor: oShellHeaderSwitch
            });

            var oShellHeaderSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    oData.visible = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oLogoLabel = new sap.m.Label({
                text: "Logo",
                labelFor: oLogoSwitch
            });

            var oLogoSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    oShellHeader.setShowLogo(this.getState());
                }
            });

            var oLogoSelect = new sap.m.Select("shell-header-icon-select", {
                change: function (oEvent) {
                    oData.logo = oEvent.getParameter("selectedItem").getKey();
                    oModel.checkUpdate();
                },
                items: [new sap.ui.core.Item("Logo-0-SH", {
                    key: "",
                    text: "No Logo"
                }), new sap.ui.core.Item("Logo-1-SH", {
                    key: "../../../../resources/sap/ushell/themes/base/img/sap_55x27.png",
                    text: "SAP"
                }), new sap.ui.core.Item("Logo-2-SH", {
                    key: "../../../../resources/sap/ushell/themes/base/img/launchpadDefaultIcon.jpg",
                    text: "Launchpad"
                })],
                selectedItem: "Logo-0-SH"
            });

            var oHeadItemLabel = new sap.m.Label({
                text: "Head Item",
                labelFor: oHeadItemAddBtn
            });

            var oHeadItemAddBtn = new sap.m.Button({
                text: "Add",
                press: function () {
                    var oShellHeadItem = new ShellHeadItem({
                        tooltip: "Shell Head Item",
                        icon: "sap-icon://activity-items",
                        press: function () {
                            MessageToast.show("Shell Head Item");
                        }
                    });

                    oShellHeader.addHeadItem(oShellHeadItem);
                }
            });

            var oHeadItemRemoveBtn = new sap.m.Button("HI-RM-BTN", {
                text: "Remove",
                type: sap.m.ButtonType.Reject,
                press: function () {
                    oShellHeader.removeHeadItem(oShellHeader.getHeadItems().length - 1);
                }
            });

            var oHeadEndItemLabel = new sap.m.Label({
                text: "Head End Item",
                labelFor: oHeadEndItemAddBtn
            });

            var oHeadEndItemAddBtn = new sap.m.Button({
                text: "Add",
                press: function () {
                    var oShellEndHeadItem = new ShellHeadItem({
                        tooltip: "Shell Head End Item",
                        icon: "sap-icon://activity-items",
                        press: function () {
                            MessageToast.show("Shell Head End Item");
                        }
                    });
                    oShellHeader.addHeadEndItem(oShellEndHeadItem);
                }
            });

            var oHeadEndItemRemoveBtn = new sap.m.Button("HEI-RM-BTN", {
                text: "Remove",
                type: sap.m.ButtonType.Reject,
                press: function () {
                    oShellHeader.removeHeadEndItem(oShellHeader.getHeadEndItems().length - 1);
                }
            });

            var oTitleLabel = new sap.m.Label({
                text: "Title",
                labelFor: oTitleText
            });

            var oTitleText = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter a shell title ...",
                change: function (oEvent) {
                    oShellHeader.setTitle(oTitleText.getValue());
                }
            });
            oTitleText.bindValue("/title");


            var oShellAppTitleLabel = new sap.m.Label({
                text: "Shell App Title",
                labelFor: oShellAppTitleText
            });

            var oShellAppTitleText = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter a shell app title ...",
                change: function (oEvent) {
                    if (!oShellAppTitleText.getValue() == "") {
                        oShellHeader.setAggregation("appTitle");
                        oShellHeader.setAppTitle(oShellAppTitle);
                    } else {
                        oShellHeader.setAggregation("appTitle");
                    }
                }
            });
            oShellAppTitleText.bindValue("/shellAppTitle");

            var oShellAppTitle = new ShellAppTitle({
                text: "{/shellAppTitle}",
                tooltip: "shell app title",
                press: function () {
                    MessageToast.show("Shell App Title");
                }
            });

            var oEditableSimpleForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                editable: true,
                title: "Modify Shell Header",
                content: [oShellHeaderVsbLabel, oShellHeaderSwitch, oLogoLabel, oLogoSwitch, oLogoSelect, oHeadItemLabel, oHeadItemAddBtn,
                    oHeadItemRemoveBtn, oHeadEndItemLabel, oHeadEndItemAddBtn,
                    oHeadEndItemRemoveBtn, oTitleLabel, oTitleText, oShellAppTitleLabel, oShellAppTitleText
                ]
            });

            var oShellHeader = new ShellHeader({
                visible: "{/visible}",
                logo: "{/logo}",
                showLogo: "{/showLogo}",
                showSeparators: false
            });

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oShellHeader,
                height: "400px"
            });

            var oPage = new sap.m.Page("shellHeaderPage", {
                title: "Shell Header Demo",
                backgroundDesign: "Solid",
                content: [oControlPanel, oEditableSimpleForm]
            }).setModel(oModel);

            oPage.addEventDelegate({
                "onAfterRendering": function () {
                    // Render the Shell Header
                    oShellHeader.createUIArea(oControlPanel.getId());
                }
            }, oPage);
            return oPage;
        }
    });
});