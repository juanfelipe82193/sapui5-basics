// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/Config",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDialog",
    "sap/ushell/opa/tests/homepage/pages/PageOverview",
    "sap/ushell/opa/tests/homepage/pages/PageComposerApplication"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("Page Overview - Buttons and Dialogs");

    var _iSetMyShellComposeArrangements = function () {
        window.location.hash = "Shell-compose";
    };

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Should display buttons in the correct states", function (Given, When, Then) {
            // Arrangements
            Given.iStartMyMockServer("/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/", {
                sMetadataPath: "../../../../test-resources/sap/ushell/OPA/localService/pageComposer/pages/metadata.xml",
                sMockDataFolderPath: "../../../../test-resources/sap/ushell/OPA/localService/pageComposer/pages/mockData"
            });
            Given.iStartMyMockServer("/sap/opu/odata/UI2/FDM_VALUE_HELP_SRV/", {
                sMetadataPath: "../../../../test-resources/sap/ushell/OPA/localService/pageComposer/transport/metadata.xml",
                sMockDataFolderPath: "../../../../test-resources/sap/ushell/OPA/localService/pageComposer/transport/mockData"
            });
            Given.iStartMyFLP(sAdapter).then(_iSetMyShellComposeArrangements);

            // Assertions
            Then.onThePageOverview.iShouldSeeTheCreateButton(true)
                .and.iShouldSeeTheCopyButton(false)
                .and.iShouldSeeTheDeleteButton(false);
        });

        opaTest("Create Page Dialog - Should open the dialog", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iPressTheCreateButton();

            // Assertions
            Then.onThePageComposerApplication.iShouldSeeTheCreateDialog();
        });

        opaTest("Create Page Dialog - Should display buttons in correct state depending on input", function (Given, When, Then) {
            // Assertions
            Then.onADialog.iShouldSeeTheIdInputField()
                .and.iShouldSeeTheTitleInputField()
                .and.iShouldSeeTheDescriptionInputField()
                .and.iShouldSeeTheCreateButton(false);

            // Actions
            When.onADialog.iTypeIntoTheIdInputField("TEST");

            // Assertions
            Then.onADialog.iShouldSeeTheCreateButton(false);

            // Actions
            When.onADialog.iTypeIntoTheDescriptionInputField("TEST");

            // Assertions
            Then.onADialog.iShouldSeeTheCreateButton(false);

            // Actions
            When.onADialog.iTypeIntoTheTitleInputField("TEST");

            // Assertions
            Then.onADialog.iShouldSeeTheCreateButton(true);

            // Actions
            When.onADialog.iTypeIntoTheIdInputField("");

            // Assertions
            Then.onADialog.iShouldSeeTheCreateButton(false);

            // Reset
            When.onADialog.iPressTheCancelButton();
        });

        opaTest("The delete button should be in the correct state when one page is selected", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSelectPageWithIndex(0);

            // Assertions
            Then.onThePageOverview.iShouldSeeTheDeleteButton(true);
        });

        opaTest("The delete button should be disabled when search filters out the selected page", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSelectPageWithIndex(1)
                .and.iSearchPageWithText("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            // Assertions
            Then.onThePageOverview.iShouldSeeTheDeleteButton(false)
                .and.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE");
        });

        opaTest("The delete button should remain disabled when search filters out the selected page", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("");

            // Assertions
            Then.onThePageOverview.iShouldSeeTheDeleteButton(false);
        });

        opaTest("The delete dialog is shown", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSelectPageWithIndex(0)
                .and.iPressTheDeleteButton();

            // Assertions
            Then.onThePageComposerApplication.iShouldSeeTheDeleteDialog();

            // Reset
            When.onADialog.iPressTheCancelButton();
        });

        opaTest("The copy button should be in the correct state when one page is selected", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSelectPageWithIndex(0);

            // Assertions
            Then.onThePageOverview.iShouldSeeTheCopyButton(true);
        });

        opaTest("The copy button should be disabled when search filters out the selected page", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSelectPageWithIndex(1)
                .and.iSearchPageWithText("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            // Assertions
            Then.onThePageOverview.iShouldSeeTheCopyButton(false)
                .and.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE");
        });

        opaTest("The copy button should remain disabled when search filters out the selected page", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("");

            // Assertions
            Then.onThePageOverview.iShouldSeeTheCopyButton(false);
        });

        opaTest("The copy dialog is shown", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSelectPageWithIndex(0)
                .and.iPressTheCopyButton();

            // Assertions
            Then.onThePageComposerApplication.iShouldSeeTheCopyDialog();

            // Reset
            When.onADialog.iPressTheCancelButton();
            Then.iTeardownMyFLP();
        });
    });
});
