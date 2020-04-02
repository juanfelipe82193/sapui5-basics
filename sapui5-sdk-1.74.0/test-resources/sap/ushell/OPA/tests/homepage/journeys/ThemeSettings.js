// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/Device",
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/UserSettings"
], function (Device, opaTest, testUtils) {
    "use strict";

    /* global QUnit sinon*/
    QUnit.module("Theme settings change via user settings", {
        before: function () {
            this.defaultConfig = {
                 "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                            }
                        }
                    }
                }
            };

        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Content density should be enabled on not phone devices", function (Given, When, Then) {
            // Arrangements
            var oDensityStub;
            Given.iStartMyFLP(sAdapter, this.defaultConfig).then(function () {
                var oUser = sap.ushell.Container.getService("UserInfo").getUser();
                oDensityStub = sinon.stub(oUser, "getContentDensity").returns("cozy");

            });

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButtonWithTitle("Settings");
            When.onTheUserSettings.iPressOnTheAppearanceListItem()
                .and.iPressOnTheDisplaySettingsTab();

            // Assertions
            Then.onTheUserSettings.iShouldSeeContentDensitySwitchEnabled()
                .and.iShouldNotSeeSwitchOn("userPrefThemeSelector--contentDensitySwitch");
            Then.iTeardownMyFLP().then(function () {
                oDensityStub.restore();
            });
        });
    });

});
