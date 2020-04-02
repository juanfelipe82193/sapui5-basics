// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/header/pages/ShellHeader"
], function (opaTest) {
    "use strict";

    /* global QUnit */
    QUnit.module("EndItems overflow button", {
        before: function () {
            this.defaultConfig = {
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                "moveEditHomePageActionToShellHeader": true,
                                "moveAppFinderActionToShellHeader": true,
                                "moveUserSettingsActionToShellHeader": true,
                                "enableSearch": true,
                                "esearch": {
                                    "sinaConfiguration": "sample"
                                }
                            }
                        }
                    }
                },
                "services": {
                    "Search": {
                        "adapter": {
                            "module": "sap.ushell.adapters.local.SearchAdapter",
                            "searchResultPath": "./searchResults/record.json"
                        }
                    }
                }
            };
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Should show all configured end header items", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Assertions
            Then.onShellHeader.iShouldSeeSearchIcon() //need time to load search plugin
                .and.iShouldSeeHeaderEndItems(5); //edit button + appFinder + setting + search + MeArea
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should show hidden end items in popover", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onShellHeader.iSimulateResize("Phone")
                .and.iPressOnTheEndItemsOverflowBtn();

            // Assertions
            Then.onShellHeader.iShouldSeeHeaderEndItems(3) //search icon + overflow button + MeArea
                .and.iShouldSeeHiddenHeaderEndItemsInPopover(3); //edit button + appFinder + setting
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should show end header items after resizing", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onShellHeader.iSimulateResize("Phone")
                .and.iPressOnTheEndItemsOverflowBtn()
                .and.iSimulateResize("Desktop");

            // Assertions
            Then.onShellHeader.iShouldSeeHeaderEndItems(5); //edit button + appFinder + setting + search + MeArea
            Then.iTeardownMyFLP();
        });
    });
});
