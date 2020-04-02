// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.require([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/header/pages/ShellHeader",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/UserSettings"
], function (opaTest) {
    "use strict";

    /* global QUnit */
    QUnit.module("MeArea in Fiori3", {
        before: function () {
            this.defaultConfig = {
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                "enableHelp": true
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
        opaTest("Open popover when click on MeArea icon", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();

            // Assertions
            Then.onTheMeArea.iShouldSeeMeAreaPopover();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Close popover when click on MeArea icon twice", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton()
                .and.iPressOnTheMeAreaButton();

            // Assertions
            Then.onTheMeArea.iShouldNotSeeMeAreaPopover();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("AppFinder is opened when press AppFinder button in MeArea", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButton("openCatalogBtn");

            // Assertions
            Then.onTheMeArea.iShouldNotSeeMeAreaPopover();
            Then.onShellHeader.iShouldSeeTitle("App Finder");
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Settings dialog is opened when press settings button in MeArea", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButton("userSettingsBtn");

            // Assertions
            Then.onTheMeArea.iShouldNotSeeMeAreaPopover();
            Then.onTheUserSettings.iShouldSeeSettingsDialog();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Edit mode is opened when press edit button in MeArea", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButton("ActionModeBtn");

            // Assertions
            Then.onTheMeArea.iShouldNotSeeMeAreaPopover();
            Then.onTheHomepage.iShouldSeeHomepageInEditMode()
                .and.iShouldSeeFooterInEditMode();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("About dialog is opened when about button is pressed in MeArea", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButton("aboutBtn");

            // Assertions
            Then.onTheMeArea.iShouldNotSeeMeAreaPopover();
            Then.onTheHomepage.iShouldSeeAboutDialog();

            When.onTheHomepage.iCloseAboutDialog();
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Logout dialog is opened when press logout button in MeArea", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButton("logoutBtn");

            // Assertions
            Then.onTheMeArea.iShouldNotSeeMeAreaPopover();
            Then.onTheHomepage.iShouldSeeLogoutDialog();

            When.onTheHomepage.iCloseLogoutDialog();
            Then.onTheMeArea.iShouldNotSeeMeAreaPopover();

            Then.iTeardownMyFLP();
        });
    });

});
