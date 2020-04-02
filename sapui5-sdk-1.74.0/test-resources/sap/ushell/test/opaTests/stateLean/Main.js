// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global QUnit */
sap.ui.require([
    "sap/ui/test/Opa5"
], function (Opa5) {

    "use strict";

    Opa5.createPageObjects({
        onTheMainPage: {
            actions: {

                ClickOnAppTitle: function (sAppTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.shell.ShellAppTitle",
                        success: function (appTitles) {
                            appTitles.forEach(function (appTitle) {
                                if (appTitle.getText() === sAppTitle) {
                                    appTitle.$().trigger("click");
                                    QUnit.ok(true, "App Title '" + sAppTitle + "' Clicked");
                                }
                            });
                        },
                        errorMessage: "Action1 error"
                    });
                }
            },

            assertions: {

                CheckHeaderItems: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.ShellHeader",
                        success: function (headers) {
                            QUnit.ok(headers && headers.length === 1, "shell header exists in the page");
                            QUnit.ok(headers[0].getVisible() === true, "shell header is visible");
                            QUnit.ok(headers[0].getShowLogo() === true, "shell header logo is visible");
                            QUnit.ok(headers[0].getHeadItems().length === 0, "shell header does not contain");
                            QUnit.ok(headers[0].getHeadEndItems().some(function (oItem) {
                                return oItem.getId() === "meAreaHeaderButton";
                            }), "'meAreaHeaderButton' is shown on the right side");
                        },
                        errorMessage: "CheckHeaderItems test failed"
                    });
                },

                CheckThatInAppTitleMenuShown: function () {
                    return this.waitFor({
                        controlType: "sap.m.Popover",
                        success: function (popOvers) {
                            popOvers.forEach(function (popOver) {
                                if (popOver.getId() === "sapUshellAppTitlePopover") {
                                    QUnit.ok(true, "Application title pop over menu opened");
                                }
                            });
                        },
                        errorMessage: "CheckThatInAppTitleMenuShown test failed"
                    });
                },

                CheckThatRelatedApplicationIsHidden: function () {
                    return this.waitFor({
                        controlType: "sap.m.VBox",
                        success: function (vBoxes) {
                            var bFound = false;
                            vBoxes.forEach(function (vBox) {
                                if (vBox.getId() === "sapUshellRelatedAppsItems") {
                                    bFound = true;
                                }
                            });
                            QUnit.ok(bFound === false, "Related applications vbox is hidden");
                        },
                        errorMessage: "CheckThatRelatedApplicationIsHidden test failed"
                    });
                },

                CheckThatAllMyAppsIsHidden: function () {
                    return this.waitFor({
                        controlType: "sap.m.Bar",
                        success: function (bars) {
                            var bFound = false;
                            bars.forEach(function (bar) {
                                if (bar.getId() === "shellpopoverFooter") {
                                    bFound = true;
                                }
                            });
                            QUnit.ok(bFound === false, "All my apps bar is hidden");
                        },
                        errorMessage: "CheckThatAllMyAppsIsHidden test failed"
                    });
                }
            }
        }
    });
});
