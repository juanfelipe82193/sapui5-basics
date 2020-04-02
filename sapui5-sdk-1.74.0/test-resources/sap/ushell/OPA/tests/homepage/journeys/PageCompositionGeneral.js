// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/resources",
    "sap/ushell/opa/tests/homepage/pages/i18n/resources",
    "sap/ushell/Config",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDialog",
    "sap/ushell/opa/tests/homepage/pages/PageOverview",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDetail",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDetailEdit",
    "sap/ushell/opa/tests/homepage/pages/PageComposerApplication"
], function (opaTest, UshellResources, resources) {
    "use strict";

    /* global QUnit */

    QUnit.module("Page Composition - Buttons, Dialogs and Page Details");

    var _iSetMyShellComposeArrangements = function () {
        window.location.hash = "Shell-compose";
    };

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("The correct PageDetail page is loaded and displays all relevant information.", function (Given, When, Then) {
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

            // Actions
            When.onThePageOverview.iPressOnThePageWithIndex(1);
            When.onThePageComposerDetailPage.iExpandTheHeaderIfCollapsed();

            // Assertions
            Then.onThePageComposerDetailPage.iShouldSeeATextWithID("pageInfoTitle", "UI2 FLP Demo - Test Page")
                .and.iShouldSeeThePageID("/UI2/FLP_DEMO_PAGE")
                .and.iShouldSeeAPageDescription("This page is used for testing the pages runtime")
                .and.iShouldSeeATextWithID("pageInfoCreatedByFullname", "Johnny Bravo", false)
                .and.iShouldSeeATextWithID("pageInfoModifiedByFullname", "Joanne Doe", false);

            Then.onThePageComposerDetailPage.iShouldSeeTheLayoutEditButton(true)
                .and.iShouldSeeTheCopyPageButton(true)
                .and.iShouldSeeTheDeletePageButton(true);
        });

        opaTest("On the PageDetail page, the delete button opens the delete dialog.", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailPage.iPressTheDeletePageButton();

            // Assertions
            Then.onThePageComposerApplication.iShouldSeeTheDeleteDialog();

            // Reset
            When.onADialog.iPressTheCancelButton();
        });

        opaTest("On the PageDetail page, the copy button opens the copy dialog.", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailPage.iPressTheCopyPageButton();

            // Assertions
            Then.onThePageComposerApplication.iShouldSeeTheCopyDialog();

            // Reset
            When.onADialog.iPressTheCancelButton();
        });

        opaTest("On the PageDetail page, the preview button opens the preview page dialog.", function (Given, When, Then) {
            When.onThePageComposerDetailPage.iPressThePagePreviewButton();
            Then.onThePageComposerApplication.iShouldSeeThePagePreviewDialog();
            When.onADialog.iPressTheClosePreviewButton();
        });

        opaTest("On the PageDetailEdit page, the preview dialog opens with selected scope.", function (Given, When, Then) {
            When.onThePageComposerDetailPage.iPressTheLayoutEditButton();

            When.onThePageComposerDetailEditPage.iToggleRoleContext(true).and.iPressThePagePreviewButton();
            Then.onThePageComposerApplication.iShouldSeeScopedTilesInThePreviewDialog();
            When.onADialog.iPressTheClosePreviewButton();

            When.onThePageComposerDetailEditPage.iToggleRoleContext(false);
            When.onThePageComposerDetailEditPage.iPressTheLayoutCancelButton(); // Go back to the list of pages
        });

        opaTest("The PageDetail page navigates to the correct PageDetailEdit page.", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iPressOnThePageWithIndex(1);
            When.onThePageComposerDetailPage.iPressTheLayoutEditButton();
            When.onThePageComposerDetailEditPage.iExpandTheHeaderIfCollapsed();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeThePageID("/UI2/FLP_DEMO_PAGE")
                .and.iShouldSeeAPageDescription("This page is used for testing the pages runtime")
                .and.iShouldSeeATextWithID("pageInfoTitle", "UI2 FLP Demo - Test Page")
                .and.iShouldSeeATextWithID("pageInfoCreatedByFullname", "Johnny Bravo", false)
                .and.iShouldSeeATextWithID("pageInfoModifiedByFullname", "Joanne Doe", false)
                .and.iShouldSeeTheLayoutSaveButton(false)
                .and.iShouldSeeTheLayoutCancelButton(true)
                .and.iShouldSeeTheToggleCatalogsButton(true);

            // Reset
            When.onThePageComposerDetailEditPage.iPressTheLayoutCancelButton();
        });

        opaTest("Search result isn't reset when I navigate to page detail and back", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSelectPageWithIndex(0)
                .and.iSearchPageWithText("/UI2/FLP_DEMO_PAGE_DUPLICATE")
                .and.iPressTheEditPageButtonWithIndex(0);
            When.onThePageComposerDetailEditPage.iPressTheLayoutCancelButton();

            // Assertions
            Then.onThePageOverview.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE");

            // Actions
            When.onThePageOverview.iSearchPageWithText("");
        });


        opaTest("Page Detail Edit Dialog - editing page details is possible.", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iPressTheEditPageButtonWithIndex(1);
            When.onThePageComposerDetailEditPage.iExpandTheHeaderIfCollapsed()
                .and.iPressTheEditHeaderButton();

            // Assertions
            Then.onADialog.iShouldSeeTheIdInputField()
                .and.iShouldSeeTheTitleInputField()
                .and.iShouldSeeTheDescriptionInputField();

            // Actions
            When.onADialog.iEnterTextIntoInputWithLabel("ABCD", resources.i18n.getText("Label.PageTitle"))
                .and.iEnterTextIntoInputWithLabel("EFGH", resources.i18n.getText("Label.Description"))
                .and.iPressTheConfirmButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeAPageDescription("EFGH")
                .and.iShouldSeeATextWithID("pageInfoTitle", "ABCD")
                .and.iShouldSeeTheLayoutSaveButton(true);

            // Reset
            When.onThePageComposerDetailEditPage.iPressTheLayoutSaveButton();
        });

        opaTest("MessagePopover - The MessagePopover button is hidden when there are no messages", function (Give, When, Then) {
            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheMessagePopoverButton(false);
        });

        opaTest("MessagePopover - The MessagePopover button is visible when there are messages", function (Give, When, Then) {
            // Actions
            When.onThePageComposerDetailEditPage.iRenameASection("Custom & Dynamic Tiles", "");

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheMessagePopoverButton(true);
        });

        opaTest("MessagePopover - Opening the MessagePopover is possible", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailEditPage.iPressTheMessagePopoverButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheMessagePopover();
        });

        opaTest("MessagePopover - The MessagePopover has a title and a description", function (Given, When, Then) {
            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheMessagePopoverTitleText()
                .and.iShouldSeeTheMessagePopoverDescriptionText();

            // Reset
            When.onThePageComposerDetailEditPage.iRenameASection("", "Custom & Dynamic Tiles");
        });

        opaTest("ContextSelector - Opening the ContextSelector is possible.", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailEditPage.iPressTheRoleContextButton();

            // Assertions
            Then.onThePageComposerApplication.iShouldSeeTheContextSelector();
        });

        opaTest("ContextSelector - Display the proper content in the dialog.", function (Given, When, Then) {
            Then.onADialog.iShouldSeeTheSelectButton(true)
                .and.iShouldSeeTheCancelButton(true)
                .and.iShouldSeeTheSearchField(true);
        });

        opaTest("ContextSelector - Search for role ID works.", function (Given, When, Then) {
            // Actions
            When.onADialog.iEnterTextIntoTheSearchField("TEST_ROLE_0");

            // Assertions
            Then.onADialog.iShouldSeeTheRoleWithId("TEST_ROLE_0")
                .and.iShouldNotSeeTheRoleWithId("TEST_ROLE_1");

            // Reset
            When.onADialog.iEnterTextIntoTheSearchField("");
        });

        opaTest("ContextSelector - Search for role title works.", function (Given, When, Then) {
            // Actions
            When.onADialog.iEnterTextIntoTheSearchField("First Test Role");

            // Assertions
            Then.onADialog.iShouldSeeTheRoleWithTitle("First Test Role")
                .and.iShouldNotSeeTheRoleWithTitle("Second Test Role");

            // Reset
            Then.iTeardownMyFLP();
        });
    });
});
