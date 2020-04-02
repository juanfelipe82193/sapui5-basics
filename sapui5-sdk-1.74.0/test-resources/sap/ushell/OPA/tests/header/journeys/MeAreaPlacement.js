// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/ShellHeader"
], function (opaTest) {
    "use strict";

    /* global QUnit */
    QUnit.module("MeArea placement", {
        before: function () {
            this.fiori3Config = {
                "renderers": {
                    "fiori2": {
                        "componentData": {
                            "config": {
                                "moveEditHomePageActionToShellHeader": true,
                                "moveAppFinderActionToShellHeader": true,
                                "moveUserSettingsActionToShellHeader": true,
                                "enableSearch": true
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
        opaTest("Should show MeArea in Shell Header End Items in Fiori 3", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.fiori3Config);

            // Assertions
            Then.onShellHeader.iShouldSeeHeaderItems(0); // No MeArea
            Then.onShellHeader.iShouldSeeSearchIcon()
                .and.iShouldSeeHeaderEndItems(5); // MeArea + edit button + appFinder + setting + search
            Then.iTeardownMyFLP();
        });
    });

    aAdapters.forEach(function (sAdapter) {
        opaTest("Should show MeArea in Shell Header End Items in Fiori 3 on a Phone", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.fiori3Config);

            // Actions
            When.onShellHeader.iSimulateResize("Phone");

            // Assertions
            Then.onShellHeader.iShouldSeeHeaderItems(0); // No MeArea
            Then.onShellHeader.iShouldSeeSearchIcon()
                .and.iShouldSeeHeaderEndItems(3); // MeArea + overflow button + search
            Then.iTeardownMyFLP();
        });
    });
});