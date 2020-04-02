// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function (Opa5, Press) {
    "use strict";

    Opa5.createPageObjects({
        onTheHomepage: {
            actions: {
                iPressOnTheMeAreaButton: function () {
                    return this.waitFor({
                        id: "meAreaHeaderButton",
                        actions: new Press(),
                        errorMessage: "No me area button"
                    });
                },
                iPressOnTheCopilotButton: function () {
                    return this.waitFor({
                        id: "copilotBtn",
                        actions: new Press(),
                        errorMessage: "No copilot button"
                    });
                },
                iCloseLogoutDialog: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        actions: function (oDialog) {
                            oDialog.getButtons()[1].firePress(); // press the cancel button
                        },
                        errorMessage: "Sign out dialog was not found"
                    });
                },
                iCloseAboutDialog: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        actions: function (oDialog) {
                            oDialog.getBeginButton().firePress(); // press the OK button
                        },
                        errorMessage: "Sign out dialog was not found"
                    });
                },
                iPressOnThePlusTile: function () {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.PlusTile",
                        actions: new Press(),
                        errorMessage: "Plus Tile was not found"
                    });
                },
                iPressOnTheAddGroupButton: function () {
                    return this.waitFor({
                        id: "sapUshellAddGroupBtn",
                        actions: new Press(),
                        errorMessage: "Add Group button was not found"
                    });
                }
            },
            assertions: {
                iShouldSeeSmallTiles: function () {
                    return this.waitFor({
                        matchers: function () {
                            return document.querySelector(".sapMGT");
                        },
                        success: function (oElement) {
                            Opa5.assert.strictEqual(oElement.offsetWidth, 148, "tiles have a small size");
                            Opa5.assert.strictEqual(oElement.offsetHeight, 148, "tiles have a small size");
                        },
                        errorMessage: "Tiles have the wrong size"
                    });
                },
                iShouldSeeResponsiveTiles: function () {
                    return this.waitFor({
                        matchers: function () {
                            return document.querySelector(".sapMGT");
                        },
                        success: function (oElement) {
                            Opa5.assert.strictEqual(oElement.offsetWidth, 176, "tiles have a regular size");
                            Opa5.assert.strictEqual(oElement.offsetHeight, 176, "tiles have a regular size");
                        },
                        errorMessage: "Tiles have the wrong size"
                    });
                },
                iShouldSeeHomepageInEditMode: function () {
                    return this.waitFor({
                        id: "dashboardGroups",
                        success: function (oDashboard) {
                            Opa5.assert.ok(
                                oDashboard.getModel().getProperty("/tileActionModeActive"),
                                "tileActionModeActive in homepage model should be true"
                            );
                        },
                        errorMessage: "Dashboard was not found"
                    });
                },
                iShouldSeeTheCopilotButton: function () {
                    return this.waitFor({
                        id: "copilotBtn",
                        success: function (oCopilotBtn) {
                            Opa5.assert.ok(!!oCopilotBtn, "Copilot button should exist.");
                        },
                        errorMessage: "Copilot button was not found"
                    });
                },
                iShouldSeeFloatingContainer: function () {
                    return this.waitFor({
                        id: "shell-floatingContainer",
                        success: function (oFloatingContainer) {
                            var bIsVisible = oFloatingContainer.$().is(":visible");
                            var bIsFloating = oFloatingContainer.$().offset().top > 0;
                            Opa5.assert.ok(bIsVisible && bIsFloating, "FloatingContainer should be opened and floating.");
                        },
                        errorMessage: "FloatingContainer was not found"
                    });
                },
                iShouldNotSeeFloatingContainer: function () {
                    return this.waitFor({
                        matchers: function () {
                            return document.getElementById("shell-floatingContainer");
                        },
                        success: function (oFloatingContainer) {
                            var bIsClosed = !jQuery(oFloatingContainer).is(":visible");
                            Opa5.assert.ok(bIsClosed, "FloatingContainer should be closed");
                        },
                        errorMessage: "FloatingContainer was not found"
                    });
                },
                iShouldSeeFooterInEditMode: function () {
                    return this.waitFor({
                        id: "sapUshellDashboardFooter",
                        success: function (oFooter) {
                            Opa5.assert.ok(true, "Footer should be shown in edit mode");
                        },
                        errorMessage: "Footer was not found"
                    });
                },
                iShouldSeeLogoutDialog: function () {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(true, "Sign out dialog should be shown.");
                        },
                        errorMessage: "Sign out dialog was not found"
                    });
                },
                iShouldSeeQuickAccessDialog: function () {
                    return this.waitFor({
                        id: "quickAccess",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog.isOpen(), "Quick Access dialog should be opened.");
                        },
                        errorMessage: "Quick Access dialog was not found"
                    });
                },
                iShouldSeeAboutDialog: function () {
                    return this.waitFor({
                        id: "aboutContainerDialogID",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog.isOpen(), "About dialog was opened");
                        },
                        errorMessage: "About dialog was not found"
                    });
                },
                iShouldSeeTheGenericTileWithTitle: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.m.GenericTile",
                        matchers: function (oTile) {
                            return oTile.getHeader() === sTitle;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "Static tile is shown.");
                        },
                        errorMessage: "No generic tile with this title: " + sTitle + " was found"
                    });
                },
                iShouldSeeTheAddGroupButton: function () {
                    return this.waitFor({
                        id: "sapUshellAddGroupBtn",
                        errorMessage: "Add Group button was not found or disabled",
                        success: function (oButton) {
                            Opa5.assert.ok(oButton.getEnabled(), "Add Group button was found and enabled.");
                        }
                    });
                },
                iShouldSeeTheGroupWithTitle: function (sTitle) {
                    return this.waitFor({
                        controlType: "sap.ushell.ui.launchpad.TileContainer",
                        matchers: function (oTileContainer) {
                            return oTileContainer.getHeaderText() === sTitle;
                        },
                        success: function (oTileContainer) {
                            Opa5.assert.ok(oTileContainer, "TileContainer is shown.");
                        },
                        errorMessage: "No tile container found with this title: " + sTitle
                    });
                },
                iShouldSeeGroupActionButtonWithText: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.Button",
                        enabled: false,
                        matchers: function (oButton) {
                            return oButton.getText() === sText;
                        },
                        success: function (oButton) {
                            Opa5.assert.ok(oButton, "The '" + sText + "' button exists");
                        },
                        errorMessage: "The '" + sText + "' button was not found"
                    });
                }
            }
        }
    });
});
