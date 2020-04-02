// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* globals opaTest QUnit */

sap.ui.test.Opa5.extendConfig({
    arrangements: new sap.ushell.test.opaTests.rta.Common(),
    autoWait: true,
    asyncPolling: true,
    timeout: 100
});

sap.ui.define(["sap/ui/test/Opa5"], function (Opa5) {
    "use strict";
    QUnit.module("Variants Navigation");

    opaTest("Load the app and navigate to detail screen", function (Given, When, Then) {
        // Arrangements
        Given.iStartTheApp({
            urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
        });
        Given.iEnableTheLocalLRep();
        Given.iClearTheSessionStorageFromRtaRestart();

        // Actions
        When.onTheProductListPage.iSelecttheFirstObject().
        and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeTheProductTitle();
    });

    opaTest("Start RTA on detail screen", function (Given, When, Then) {
        // Actions
        When.onTheMasterPageWithRTA.iGoToMeArea().
        and.iPressOnAdaptUi().
        and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeTheToolbarAndTheLogo().
        and.iShouldSeeTheOverlayForTheApp("application-Worklist-display-component---app", undefined);
    });

    opaTest("Duplicate variant and Exit RTA", function (Given, When, Then) {
        var sVMId = "application-Worklist-display-component---object--variantManagementPage";
        // Actions
        When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sVMId).
        and.iClickOnAContextMenuEntry(1).
        and.iEnterANewName("NewName").
        and.iExitRtaMode();

        // Assertions
        Then.onTheMasterPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined).
        and.iShouldSeeTheVariantURLParameter();

        Then.iTeardownMyAppFrame();
    });

    opaTest("Restart the app, navigate to detail screen and check the Variant URL parameter is not present", function (Given, When, Then) {
        // Arrangements
        Given.iStartTheApp({
            urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
        });

        // Actions
        When.onTheProductListPage.iSelecttheFirstObject().
        and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeTheProductTitle().
        and.iShouldNotSeeTheVariantURLParameter();
    });

    opaTest("Switch to duplicated view", function (Given, When, Then) {
        // Actions
        When.onTheMasterPageWithRTA.iClickOnTheVariantManagementControl().
        and.iSwitchToView(1);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeTheVariantURLParameter();
    });

    // Waiting for incident 1880428993
    opaTest("Switch to default view - URL parameter should disappear", function (Given, When, Then) {
        // Actions
        When.onTheMasterPageWithRTA.iClickOnTheVariantManagementControl().
        and.iSwitchToView(0);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldNotSeeTheVariantURLParameter();
    });

    opaTest("Switch back to duplicated view", function (Given, When, Then) {
        // Actions
        When.onTheMasterPageWithRTA.iClickOnTheVariantManagementControl().
        and.iSwitchToView(1);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeTheVariantURLParameter();
    });

    opaTest("Navigate back to list report screen and again forward to detail screen", function (Given, When, Then) {
        // Actions
        When.onTheMasterPageWithRTA.iPressTheBackButton().
        and.iPressTheForwardButton("application-Worklist-display-component---app");

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeTheProductTitle().
        and.iShouldSeeTheDuplicatedVariantName("NewName");
    });

    opaTest("Return to list report screen", function (Given, When, Then) {
        // Actions
        When.onTheMasterPageWithRTA.iPressTheBackButton();

        // Assertions
        Then.onTheProductListPage.noReloadShouldHaveHappened();

        Then.iTeardownMyAppFrame();
    });

    opaTest("Restart the app with Variant URL parameter, navigate to detail screen and check the Variant URL parameter is present", function (Given, When, Then) {
        // Arrangements
        Given.iAddTheVariantURLParameter();
        Given.iStartTheApp({
            hash: "?sap-ui-fl-control-variant-id=" + Opa5.getContext().variantId,
            urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
        });

        // Actions
        When.onTheProductListPage.iSelecttheFirstObject().
        and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeTheProductTitle().
        and.iShouldSeeTheVariantURLParameter();

        Then.iTeardownMyAppFrame();
    });
});