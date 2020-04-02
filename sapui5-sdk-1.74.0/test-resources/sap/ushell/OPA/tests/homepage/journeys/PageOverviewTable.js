// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/resources",
    "sap/ushell/opa/tests/homepage/pages/i18n/resources",
    "sap/ushell/Config",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/ErrorPage",
    "sap/ushell/opa/tests/homepage/pages/PageOverview",
    "sap/ushell/opa/tests/homepage/pages/PageComposerApplication"
], function (opaTest, UshellResources, oResources) {
    "use strict";

    /* global QUnit */

    QUnit.module("Page Overview - Table Functionality");

    var _iSetMyShellComposeArrangements = function () {
        window.location.hash = "Shell-compose";
    };

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {

        opaTest("Open a non-existing page and redirect to the Error page", function (Given, When, Then) {
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
            When.onThePageOverview.iGoToInexistentViewPage();

            // Assertions
            Then.onTheErrorPage.iShouldSeeErrorText()
                .and.iShouldSeeErrorLink();

            // Actions
            When.onTheErrorPage.iGoBack();
            When.onThePageOverview.iGoToInexistentEditPage();

            // Assertions
            Then.onTheErrorPage.iShouldSeeErrorText()
                .and.iShouldSeeErrorLink();

            // Reset
            When.onTheErrorPage.iGoBack();
        });

        opaTest("The most recent changed page should be displayed on top", function (Given, When, Then) {
            // Assertions
            Then.onThePageOverview.iShouldSeeThePageWithIdOnTop("/UI2/FLP_DEMO_PAGE_DUPLICATE");
        });

        opaTest("The search for \"page ID\" works", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            // Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE")
                .and.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE");

            //Reset
            When.onThePageOverview.iSearchPageWithText("");
        });

        opaTest("The search for \"page title\" works", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("UI2 FLP Demo - Test Page");

            // Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            //Reset
            When.onThePageOverview.iSearchPageWithText("");
        });

        opaTest("The search for \"description\" works", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("This page is used for testing the pages runtime");

            // Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            //Reset
            When.onThePageOverview.iSearchPageWithText("");
        });

        opaTest("The search for \"created by\" (user ID) should not match", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("TESTUSER");

            // Assertions
            Then.onThePageOverview.iShouldSeeNoPage();
        });

        opaTest("The search for \"created by fullname\" works", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("Test User");

            // Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE")
                .and.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE");
        });

        opaTest("The search for \"changed by\" (user ID) should not match", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("DOEJO");

            // Assertions
            Then.onThePageOverview.iShouldSeeNoPage();
        });

        opaTest("The search for \"changed by fullname\" works", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("Joanne Doe");

            // Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            //Reset
            When.onThePageOverview.iSearchPageWithText("");
        });

        opaTest("The no-data-text is set correctly.", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iSearchPageWithText("trololololo lololo lololooo trololololooo");

            // Assertions
            Then.onThePageOverview.iShouldSeeNoPage()
                .and.iShouldSeeTheNoDataText(oResources.i18n.getText("Message.NoPagesFound"));

            // Reset
            When.onThePageOverview.iSearchPageWithText("");
        });

        opaTest("The viewsettings dialog is opening correctly when the sort button is pressed", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iOpenTheViewSettingsSortDialog();

            // Assertions
            Then.onThePageOverview.iShouldSeeTheViewSettingsDialog()
                .and.iShouldSeeTheTabSelected("viewSettingsDialog-sortbutton")
                .and.iShouldSeeViewSettingsSelected([
                    "Descending",
                    oResources.i18n.getText("Column.PageChangedOn")
                ]);

            //Reset
            When.onThePageOverview.iPressTheViewSettingsDialogCancelButton();
        });

        opaTest("The viewsettings dialog is opening correctly when the filter button is pressed", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iOpenTheViewSettingsFilterDialog();

            // Assertions
            Then.onThePageOverview.iShouldSeeTheViewSettingsDialog()
                .and.iShouldSeeTheTabSelected("viewSettingsDialog-filterbutton")
                .and.iShouldSeeViewSettingsSelected([]);

            //Reset
            When.onThePageOverview.iPressTheViewSettingsDialogCancelButton();
        });

        opaTest("The viewsettings dialog is opening correctly when the group button is pressed", function (Given, When, Then) {
            // Actions
            When.onThePageOverview.iOpenTheViewSettingsGroupDialog();

            // Assertions
            Then.onThePageOverview.iShouldSeeTheViewSettingsDialog()
                .and.iShouldSeeTheTabSelected("viewSettingsDialog-groupbutton")
                .and.iShouldSeeViewSettingsSelected([
                    "Ascending",
                    "None"
                ]);

            //Reset
            When.onThePageOverview.iPressTheViewSettingsDialogCancelButton();
        });

        opaTest("The viewsettings dialog filter is working correctly", function (Given, When, Then) {
            // Before Action - Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            // Actions
            When.onThePageOverview.iOpenTheViewSettingsFilterDialog()
                .and.iSelectViewSetting(oResources.i18n.getText("Column.PageCreatedBy"))
                .and.iSelectViewSetting("Johnny Bravo")
                .and.iPressTheViewSettingsDialogConfirmButton();

            // Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            //Reset
            When.onThePageOverview.iOpenTheViewSettingsFilterDialog()
                .and.iPressTheViewSettingsDialogResetButton()
                .and.iPressTheViewSettingsDialogConfirmButton();

            // Reset - Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");
        });

        opaTest("The viewsettings dialog filter is working correctly with the search", function (Given, When, Then) {
            // Before Action - Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            // Actions
            When.onThePageOverview.iOpenTheViewSettingsFilterDialog()
                .and.iSelectViewSetting(oResources.i18n.getText("Column.PageCreatedBy"))
                .and.iSelectViewSetting("Johnny Bravo")
                .and.iPressTheViewSettingsDialogConfirmButton()
                .and.iSearchPageWithText("DEMO");

            // Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldNotSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            //Reset
            When.onThePageOverview.iOpenTheViewSettingsFilterDialog()
                .and.iPressTheViewSettingsDialogResetButton()
                .and.iPressTheViewSettingsDialogConfirmButton()
                .and.iSearchPageWithText("");

            // Reset - Assertions
            Then.onThePageOverview.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE")
                .and.iShouldSeePageWithTitle("/UI2/FLP_DEMO_PAGE_DUPLICATE");

            Then.iTeardownMyFLP();
        });

    });
});
