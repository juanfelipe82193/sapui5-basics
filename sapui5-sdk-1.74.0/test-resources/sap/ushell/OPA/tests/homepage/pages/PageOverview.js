// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/ui/test/matchers/Properties"
], function (Opa5, Press, EnterText, Properties) {
    "use strict";

    var sViewName = "PageOverview";

    Opa5.createPageObjects({
        onThePageOverview: {
            actions: {
                iPressTheCreateButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "addButton",
                        actions: new Press()
                    });
                },
                iPressTheCopyButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "copyButton",
                        actions: new Press()
                    });
                },
                iPressTheDeleteButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "deleteButton",
                        actions: new Press()
                    });
                },
                iSelectPageWithIndex: function (iIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.RadioButton",
                        id: new RegExp("table-" + iIndex + "-selectSingle"),
                        actions: new Press()
                    });
                },
                iPressOnThePageWithIndex: function (iIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.ColumnListItem",
                        id: new RegExp("--table-" + iIndex),
                        actions: new Press()
                    });
                },
                iPressTheEditPageButtonWithIndex: function (iIndex) {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        id: new RegExp("--table-" + iIndex),
                        actions: new Press()
                    });
                },
                iSearchPageWithText: function (sText) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "searchField",
                        actions: [new EnterText({ text: sText })]
                    });
                },
                iGoToInexistentViewPage: function () {
                    return this.waitFor({
                        actions: function () {
                            Opa5.getWindow().location.hash += "&/view/INEXISTENT";
                        }
                    });
                },
                iGoToInexistentEditPage: function () {
                    return this.waitFor({
                        actions: function () {
                            Opa5.getWindow().location.hash += "&/edit/INEXISTENT";
                        }
                    });
                },
                iOpenTheViewSettingsSortDialog: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        id: "sortButton",
                        actions: new Press()
                    });
                },
                iOpenTheViewSettingsFilterDialog: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        id: "filterButton",
                        actions: new Press()
                    });
                },
                iOpenTheViewSettingsGroupDialog: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        controlType: "sap.m.Button",
                        id: "groupButton",
                        actions: new Press()
                    });
                },
                iSelectViewSetting: function (sTitle) {
                    return this.waitFor({
                        viewName: sViewName,
                        searchOpenDialogs: true,
                        controlType: "sap.m.StandardListItem",
                        matchers: new Properties({
                            title: sTitle
                        }),
                        actions: new Press()
                    });
                },
                iPressTheViewSettingsDialogCancelButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        id: /cancelbutton/,
                        actions: new Press()
                    });
                },
                iPressTheViewSettingsDialogConfirmButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        id: /acceptbutton/,
                        actions: new Press()
                    });
                },
                iPressTheViewSettingsDialogResetButton: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Button",
                        id: /resetbutton/,
                        actions: new Press()
                    });
                }
            },
            assertions: {
                iShouldSeeTheCreateButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "addButton",
                        enabled: bEnabled,
                        success: function () {
                            Opa5.assert.ok(true, "The create button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeTheCopyButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "copyButton",
                        enabled: bEnabled,
                        success: function () {
                            Opa5.assert.ok(true, "The copy button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeTheDeleteButton: function (bEnabled) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "deleteButton",
                        enabled: bEnabled,
                        success: function () {
                            Opa5.assert.ok(true, "The delete button is shown and in the correct state.");
                        }
                    });
                },
                iShouldSeeNoPage: function () {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "table",
                        check: function (oTable) {
                            return oTable.getBinding("items").getLength() === 0;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "No page should be shown.");
                        }
                    });
                },
                iShouldSeeTheNoDataText: function (sNoDataText) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "table",
                        check: function (oTable) {
                            return oTable.getNoDataText() === sNoDataText;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "No-data-text '" + sNoDataText + "' was found.");
                        }
                    });
                },
                iShouldNotSeePageWithTitle: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.ColumnListItem",
                        check: function (aColumnListItems) {
                            for (var i = 0; i < aColumnListItems.length; i++) {
                                if (aColumnListItems[i].getCells()[0].getTitle() === sText) {
                                    return false;
                                }
                            }
                            return true;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The Page with title " + sText + " was not found");
                        }
                    });
                },
                iShouldSeePageWithTitle: function (sText) {
                    return this.waitFor({
                        controlType: "sap.m.ColumnListItem",
                        check: function (aColumnListItems) {
                            for (var i = 0; i < aColumnListItems.length; i++) {
                                if (aColumnListItems[i].getCells()[0].getTitle() === sText) {
                                    return true;
                                }
                            }
                            return false;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The Page with title " + sText + " was found");
                        }
                    });
                },
                iShouldSeeThePageWithIdOnTop: function (sText) {
                    return this.waitFor({
                        viewName: sViewName,
                        id: "table",
                        check: function (oTable) {
                            return oTable.getItems()[0].getCells()[0].getTitle() === sText;
                        },
                        success: function () {
                            Opa5.assert.ok(true, "The page with ID " + sText + " was found on top.");
                        }

                    });
                },
                iShouldSeeTheViewSettingsDialog: function () {
                    return this.waitFor({
                        id: /viewSettingsDialog/,
                        searchOpenDialogs: true,
                        controlType: "sap.m.Dialog",
                        success: function () {
                            Opa5.assert.ok(true, "The viewsettings dialog is shown.");
                        }
                    });
                },
                iShouldSeeTheTabSelected: function (sTabId) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.SegmentedButton",
                        success: function (aSegmentedButton) {
                            Opa5.assert.ok(aSegmentedButton[0].getSelectedButton() === sTabId, "The correct view settings tab is selected.");
                        }
                    });
                },
                iShouldSeeViewSettingsSelected: function (aSettingNames) {
                    return this.waitFor({
                        searchOpenDialogs: true,
                        controlType: "sap.m.StandardListItem",
                        success: function (aViewSettingsItem) {
                            var oViewSettingItem,
                                sText;

                            for (var i = 0; i < aViewSettingsItem.length; i++) {
                                oViewSettingItem = aViewSettingsItem[i];
                                sText = oViewSettingItem.getDomRef().innerText;
                                if (aSettingNames.indexOf(sText) >= 0) {
                                    Opa5.assert.ok(oViewSettingItem.getSelected(), "Sort viewsettings " + sText + " is selected.");
                                } else {
                                    Opa5.assert.ok(!oViewSettingItem.getSelected(), "Sort viewsettings " + sText + " is not selected.");
                                }
                            }
                        }
                    });
                }
            }
        }
    });
});
