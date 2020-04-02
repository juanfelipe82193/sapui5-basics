// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ushell/ui/shell/ShellAppTitle",
    "sap/ushell/playground/mock/ContainerMock",
    "sap/ushell/ui/shell/ShellNavigationMenu",
    "sap/m/MessageToast"
], function (ShellAppTitle, ContainerMock, ShellNavigationMenu, MessageToast) {
    "use strict";

    jQuery.sap.initMobile();

    sap.ui.jsview("sap.ushell.playground.view.ShellAppTitlePlayground", {
        createContent: function (oController) {
            var oPage = this._createPage();
            return oPage;
        },

        _createPage: function () {
            var oData = {
                visible: true,
                navMenuVis: true,
                shellAppTitleText: "Shell App Title Text",
                currentState: {
                    stateName: "app"
                },
                shellAppTitletooltip: "Shell App Title tooltip",
                title: "Shell App Title",
                ShellAppTitleState: "",
                icon: "sap-icon://world",
                showTitle: false,
                showRelatedApps: true,
                allMyApps: false
            };

            var oModel = new sap.ui.model.json.JSONModel(oData);
            sap.ui.getCore().setModel(oModel);

            sap.ushell.Container = new ContainerMock();

            var oVisibleLabel = new sap.m.Label({
                text: "Shell App Title Visible",
                labelFor: oVisibleSwitch
            });

            var oVisibleSwitch = new sap.m.Switch({
                state: true,
                change: function (oEvent) {
                    oData.visible = this.getState();
                    oModel.checkUpdate();
                }
            });

            var oShellAppTitleTextLabel = new sap.m.Label({
                text: "Shell App Title Text",
                labelFor: oShellAppTitleTextInput
            });

            var oShellAppTitleTextInput = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter a shell app title ..."
            });
            oShellAppTitleTextInput.bindValue("/shellAppTitleText");

            var oShellAppTitleTooltipLabel = new sap.m.Label({
                text: "Shell App Title Tooltip Text",
                labelFor: oShellAppTitleTooltipTextInput
            });

            var oShellAppTitleTooltipTextInput = new sap.m.Input({
                type: sap.m.InputType.Text,
                placeholder: "Enter a shell app title tooltip ..."
            });
            oShellAppTitleTooltipTextInput.bindValue("/shellAppTitletooltip");

            var oShellAppTitleNavMenuLabel = new sap.m.Label({
                text: "Shell App Title Navigation Menu",
                labelFor: oShellNavigationMenuVisibleSwitch
            });

            var oShellNavigationMenuVisibleSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    if (this.getState()) {
                        if (!oShellAppTitle.getAllMyApps()) {
                            oData.currentState.stateName = "app";
                            oData.allMyApps = this.getState();
                            oShellAppTitle.setAllMyApps(oAllMyAppsView);
                            oData.currentState.stateName = "";
                            oData.allMyApps = this.getState();
                            oShellAppTitle.setAllMyApps(null);
                        }
                        oShellAppTitle.setNavigationMenu(oShellNavigationMenu);
                    } else {
                        oShellAppTitle.setNavigationMenu(null);
                    }
                }
            });

            var oShellNavigationMenu = new ShellNavigationMenu({
                title: "{/title}",
                icon: "{/icon}",
                showTitle: "{/showTitle}",
                showRelatedApps: "{/showRelatedApps}",
                visible: "{/navMenuVis}",
                items: [
                    new sap.m.StandardListItem({
                        icon: "sap-icon://navigation-right-arrow",
                        title: "Navigation Item 1"
                    }),
                    new sap.m.StandardListItem({
                        icon: "sap-icon://navigation-right-arrow",
                        title: "Navigation Item 2"
                    })
                ]
            });

            var oAllMyAppsLabel = new sap.m.Label({
                text: "Shell App Title All My Apps View",
                labelFor: oAllMyAppsSwitch
            });

            var oAllMyAppsSwitch = new sap.m.Switch({
                state: false,
                change: function (oEvent) {
                    if (this.getState()) {
                        oData.currentState.stateName = "app";
                        oData.allMyApps = this.getState();
                        oShellAppTitle.setAllMyApps(oAllMyAppsView);
                    } else {
                        oData.currentState.stateName = "";
                        oData.allMyApps = this.getState();
                        oShellAppTitle.setAllMyApps(null);
                    }
                }
            });

            sap.ui.jsview("com.sap.allMyApps", {
                createContent: function (oController) {
                    var oText = new sap.m.Text({
                        text: "Hello JS View"
                    });
                    return oText;
                },
                _afterOpen: function (oController) {}
            });

            var oAllMyAppsView = sap.ui.view("allMyAppsView", {
                type: sap.ui.core.mvc.ViewType.JS,
                viewName: "com.sap.allMyApps",
                async: true,
                height: "100%"
            });

            oAllMyAppsView.getController = function () {
                return {};
            };

            var oShellAppTitle = new ShellAppTitle({
                text: "{/shellAppTitleText}",
                tooltip: "{/shellAppTitletooltip}",
                visible: "{/visible}",
                press: function () {
                    MessageToast.show("Shell App Title has been pressed");
                },
                textChanged: function () {
                    MessageToast.show("Shell App Title text has been changed");
                }
            });

            var oEditableSimpleForm = new sap.ui.layout.form.SimpleForm({
                layout: "ColumnLayout",
                maxContainerCols: 2,
                editable: true,
                title:"Modify Shell App Title",
                content: [oVisibleLabel, oVisibleSwitch, oShellAppTitleTextLabel, oShellAppTitleTextInput, oShellAppTitleTooltipLabel, oShellAppTitleTooltipTextInput,
                    oShellAppTitleNavMenuLabel, oShellNavigationMenuVisibleSwitch, oAllMyAppsLabel, oAllMyAppsSwitch
                ]
            });

            var oControlPanel = new sap.m.Panel({
                backgroundDesign: "Solid",
                content: oShellAppTitle,
                height: "400px"
            });

            var oPage = new sap.m.Page("shellAppTitlePage", {
                title: "Shell App Title Demo",
                content: [oControlPanel, oEditableSimpleForm]
            }).setModel(oModel);

            return oPage;
        }
    });
});