// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/UserSettings"
], function (opaTest, testUtils) {
    "use strict";

    /* global QUnit */
    QUnit.module("sizeBehavior change via user settings", {
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
        opaTest("Should set the small tile size", function (Given, When, Then) {
            // Arrangements
            var oConfig = testUtils.overrideObject(this.defaultConfig, {
                "/renderers/fiori2/componentData/config/sizeBehavior": "Responsive",
                "/renderers/fiori2/componentData/config/sizeBehaviorConfigurable": true
            });

            Given.iStartMyFLP(sAdapter, oConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButtonWithTitle("Settings");
            When.onTheUserSettings.iPressOnTheAppearanceListItem()
                .and.iPressOnTheDisplaySettingsTab()
                .and.iPressOnTheSmallTileSizeRadioButton()
                .and.iPressOnTheSaveButton();

            // Assertions
            Then.onTheHomepage.iShouldSeeSmallTiles();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should set the responsive tile size", function (Given, When, Then) {
            // Arrangements
            var oConfig = testUtils.overrideObject(this.defaultConfig, {
                "/renderers/fiori2/componentData/config/sizeBehavior": "Small",
                "/renderers/fiori2/componentData/config/sizeBehaviorConfigurable": true
            });

            Given.iStartMyFLP(sAdapter, oConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButtonWithTitle("Settings");
            When.onTheUserSettings.iPressOnTheAppearanceListItem()
                .and.iPressOnTheDisplaySettingsTab()
                .and.iPressOnTheResponsiveTileSizeRadioButton()
                .and.iPressOnTheSaveButton();

            // Assertions
            Then.onTheHomepage.iShouldSeeResponsiveTiles();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should not be able to change tile size", function (Given, When, Then) {
            // Arrangements
            var oConfig = testUtils.overrideObject(this.defaultConfig, {
                "/renderers/fiori2/componentData/config/sizeBehavior": "Responsive",
                "/renderers/fiori2/componentData/config/sizeBehaviorConfigurable": false
            });

            Given.iStartMyFLP(sAdapter, oConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButtonWithTitle("Settings");
            When.onTheUserSettings.iPressOnTheAppearanceListItem()
                .and.iPressOnTheDisplaySettingsTab();

            // Assertions
            Then.onTheUserSettings.iShouldNotSeeTheTileSizeSetting();
            Then.iTeardownMyFLP();
        });
    });
});
