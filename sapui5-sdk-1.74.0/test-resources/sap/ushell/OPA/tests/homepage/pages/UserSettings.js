// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"
], function (Opa5, Press) {
    "use strict";

    function checkboxCheckProperty (iRow, sPropertyName, bValue) {
        return this.waitFor({
            id: "notificationSettingsTable",
            matchers: function (oTable) {
                var oItem = oTable.getItems()[iRow];
                return oItem.getCells()[2];
            },
            success: function (oElement) {
                Opa5.assert.strictEqual(oElement.getProperty(sPropertyName),
                bValue, "Checkbox is " + (bValue ? " " : "not ") + sPropertyName + ": " +
                    oElement.getBindingContext().getProperty("NotificationTypeDesc"));
            },
            errorMessage: "No Checkbox found"
        });
    }



    Opa5.createPageObjects({
        onTheUserSettings: {
            actions: {
                iPressOnTheNotificationsListItem: function () {
                    return this.waitFor({
                        id: "sapFlpUserSettings-View--userSettingEntryList",
                        matchers: function (oList) {
                            var aItems = oList.getItems();
                            for (var i = 0; i < aItems.length; i++) {
                                if (aItems[i].getIcon() === "sap-icon://bell") {
                                    return aItems[i];
                                }
                            }
                        },
                        actions: new Press(),
                        errorMessage: "No notifications list item"
                    });
                },
                iPressOnTheCancelButton: function () {
                    return this.waitFor({
                        id: "sapFlpUserSettings-View--userSettingCancelButton",
                        actions: new Press(),
                        errorMessage: "No cancel button"
                    });
                },
                iPressOnTheSaveButton: function () {
                    return this.waitFor({
                        id: "sapFlpUserSettings-View--userSettingSaveButton",
                        actions: new Press(),
                        errorMessage: "No save button"
                    });
                },
                iPressOnTheAppearanceListItem: function () {
                    return this.waitFor({
                        id: "sapFlpUserSettings-View--userSettingEntryList",
                        matchers: function (oList) {
                            return oList.getItems()[1];
                        },
                        actions: new Press(),
                        errorMessage: "No list item at second position"
                    });
                },
                iPressOnTheDisplaySettingsTab: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("idIconTabBar").getItems()[1];
                        },
                        actions: new Press(),
                        errorMessage: "No list item at second position"
                    });
                },
                iPressOnTheSmallTileSizeRadioButton: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("tileSizeRadioButtonGroup").getButtons()[0];
                        },
                        actions: new Press(),
                        errorMessage: "No radio button at first position"
                    });
                },
                iPressOnTheResponsiveTileSizeRadioButton: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        matchers: function (oView) {
                            return oView.byId("tileSizeRadioButtonGroup").getButtons()[1];
                        },
                        actions: new Press(),
                        errorMessage: "No radio button at second position"
                    });
                }
            },
            assertions: {
                iShouldNotSeeTheTileSizeSetting: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector",
                        success: function (oElement) {
                            Opa5.assert.ok(!oElement.byId("tileSizeRadioButtonGroup").getDomRef(), "No tile size selector");
                        },
                        errorMessage: "Tiles size selector visible but should not."
                    });
                },
                iShouldSeeNoEmailColumn: function () {
                    return this.waitFor({
                        id: "notificationSettingsTable",
                        matchers: function (oTable) {
                            return oTable.getColumns()[2];
                        },
                        success: function (oElement) {
                            Opa5.assert.strictEqual(oElement.getVisible(), false, "no email column visible");
                        },
                        errorMessage: "no notification settings table found"
                    });
                },
                iShouldSeeAnEnabledCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "enabled", true);
                },
                iShouldSeeASelectedCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "selected", true);
                },
                iShouldSeeAnUnselectedCheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "selected", false);
                },
                iShouldNotSeeACheckbox: function (iRow) {
                    return checkboxCheckProperty.call(this, iRow, "visible", false);
                },
                iShouldSeeSettingsDialog: function () {
                    return this.waitFor({
                        id: "sapFlpUserSettings-View--userSettingsDialog",
                        success: function (oDialog) {
                            Opa5.assert.ok(oDialog.isOpen(), "userSettingsDialog was opened");
                        },
                        errorMessage: "userSettingsDialog was not found"
                    });
                },
                iShouldNotSeeSwitchOn: function (sId) {
                    return this.waitFor({
                        id: sId,
                        controlType: "sap.m.Switch",
                        success: function (oSwitch) {
                            Opa5.assert.ok(oSwitch.getState(), "Switch with id=" + sId+" should be ON.");
                        },
                        errorMessage: "Switch with id=" + sId +" was not found."
                    });
                },
                iShouldSeeContentDensitySwitchEnabled: function () {
                    return this.waitFor({
                        id: "userPrefThemeSelector--contentDensitySwitch",
                        controlType: "sap.m.Switch",
                        enabled: true,
                        success: function () {
                            Opa5.assert.ok(true, "contentDensitySwitch should be enabled.");
                        },
                        errorMessage: "contentDensitySwitch was not found."
                    });
                }
            }
        }
    });
});