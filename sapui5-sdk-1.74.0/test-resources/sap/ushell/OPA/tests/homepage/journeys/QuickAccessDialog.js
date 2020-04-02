// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/testUtils",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/QuickAccessDialog"
], function (opaTest) {
    "use strict";

    /* global QUnit */
    QUnit.module("Quick Access Dialog: ", {
        before: function () {
            this.defaultConfig = {};
        }
    });

    // add other adapters here, once supported
    var aAdapters = ["cdm"];

    aAdapters.forEach(function (sAdapter) {
        opaTest("Popover contains Quick Access items when click on MeArea icon", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyFLP(sAdapter, this.defaultConfig);

            // Actions
            When.onTheHomepage.iPressOnTheMeAreaButton();

            // Assertions
            Then.onTheMeArea.iShouldSeeMeAreaPopover();
            Then.onTheMeArea.iShouldSeeItemInMeAreaWithTitle("Recent Activities");
            Then.onTheMeArea.iShouldSeeItemInMeAreaWithTitle("Frequently Used");
        });

        opaTest("The Quick Access dialog opens when pressing the Recent Activities item", function (Given, When, Then) {
            // Actions
            When.onTheMeArea.iPressOnActionButtonWithTitle("Recent Activities");

            // Assertions
            Then.onTheHomepage.iShouldSeeQuickAccessDialog();
            Then.onTheQuickAccessDialog.iShouldSeeTabSelectedWithId("recentActivityFilter");
        });

        opaTest("The Quick Access dialog opens when pressing the Frequently Used item", function (Given, When, Then) {
            // Actions
            When.onTheQuickAccessDialog.iPressOnTheCloseButton();
            When.onTheHomepage.iPressOnTheMeAreaButton();
            When.onTheMeArea.iPressOnActionButtonWithTitle("Frequently Used");

            // Assertions
            Then.onTheHomepage.iShouldSeeQuickAccessDialog();
            Then.onTheQuickAccessDialog.iShouldSeeTabSelectedWithId("frequentlyUsedFilter");

            When.onTheQuickAccessDialog.iPressOnTheCloseButton();
            Then.iTeardownMyFLP();
        });
    });
});