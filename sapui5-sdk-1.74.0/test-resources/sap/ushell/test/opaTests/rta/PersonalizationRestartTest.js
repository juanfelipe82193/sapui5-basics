// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* globals opaTest QUnit */

sap.ui.test.Opa5.extendConfig({
    arrangements: new sap.ushell.test.opaTests.rta.Common(),
    autoWait: true,
    asyncPolling: true,
    timeout: 100
});

sap.ui.define([], function () {
    "use strict";
    QUnit.module("Personalization Restart");

    opaTest("Start personalization on detail screen", function (Given, When, Then) {
        var sProductHash = "&/Objects/ObjectID_3";

        // Arrangements
        Given.iStartTheApp({
            hash: sProductHash,
            urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
        });
        Given.iEnableTheLocalLRep();
        Given.iClearTheSessionStorageFromRtaRestart();

        // Actions
        When.onTheMasterPageWithRTA.iGoToMeArea().
        and.iPressOnAdaptUi(true).
        and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeTheToolbar().
        and.iShouldSeeTheOverlayForTheApp("application-Worklist-display-component---app", undefined);
    });

    opaTest("Remove an Object Page Section", function (Given, When, Then) {
        var sSectionId = "application-Worklist-display-component---object--ObjectPageSectionWithButtons2";

        // Actions
        When.onTheMasterPageWithRTA.iPressOnRemoveSection(sSectionId);

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldNotSeeTheElement(sSectionId);
    });

    opaTest("Exit RTA Personalization", function (Given, When, Then) {
        When.onTheMasterPageWithRTA.iExitRtaPersonalizationMode();

        Then.onTheMasterPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);
    });

    opaTest("Start RTA on detail screen", function (Given, When, Then) {
        var sSectionId = "application-Worklist-display-component---object--ObjectPageSectionWithButtons2";

        // Actions
        When.onTheMasterPageWithRTA.iGoToMeArea().
        and.iPressOnAdaptUi().
        and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

        // The pop up for the reload
        Then.onTheMasterPageWithRTA.iShouldSeeThePopUp();

        // RTA starts automatically after the reload
        Then.onTheMasterPageWithRTA.iShouldSeeTheToolbar().
        and.iShouldSeeTheMaxLayerURLParameter().
        and.iShouldSeeTheOverlayForTheApp("application-Worklist-display-component---app", undefined).
        and.iShouldSeeTheSectionAfterReload(sSectionId);
    });

    opaTest("Exit RTA", function (Given, When, Then) {
        var sSectionId = "application-Worklist-display-component---object--ObjectPageSectionWithButtons2";
        // Actions
        When.onTheMasterPageWithRTA.iExitRtaMode();

        // Assertions
        Then.onTheMasterPageWithRTA.iShouldSeeThePopUp().
        and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined).
        and.iShouldNotSeeTheElement(sSectionId).
        and.iShouldNotSeeTheMaxLayerURLParameter();
        Then.iTeardownMyAppFrame();
    });
});