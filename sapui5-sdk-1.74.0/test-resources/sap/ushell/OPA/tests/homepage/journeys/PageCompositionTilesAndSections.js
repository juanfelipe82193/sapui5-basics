// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/Config",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDialog",
    "sap/ushell/opa/tests/homepage/pages/ErrorPage",
    "sap/ushell/opa/tests/homepage/pages/PageOverview",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDetail",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDetailEdit",
    "sap/ushell/opa/tests/homepage/pages/PageComposerApplication"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("Page Composition - Tiles and Sections");

    var _iSetMyShellComposeArrangements = function () {
        window.location.hash = "Shell-compose";
    };

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("The catalogs can be hidden and shown by pressing the corresponding button.", function (Given, When, Then) {
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
            When.onThePageOverview.iPressTheEditPageButtonWithIndex(1);
            When.onThePageComposerDetailEditPage.iPressTheToggleCatalogsButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileSelector(false);

            // Actions
            When.onThePageComposerDetailEditPage.iPressTheToggleCatalogsButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileSelector(true);
        });

        opaTest("TileSelector - Should see toolbar content", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailEditPage.iPressTheTileSelectorToolbarOverflowButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileSelectorToolbarSearchField();
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileSelectorToolbarAddButton();
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileSelectorToolbarSortButton();
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileSelectorToolbarCollapseButton();
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileSelectorToolbarExpandButton();

            // Reset
            When.onThePageComposerDetailEditPage.iCloseTheTileSelectorToolbarOverflowPopover();
        });

        opaTest("TileSelector - Should see content", function (Given, When, Then) {
            // Arrangements
            var iCatalogQuantity = 4,
                iTileQuantity = 8;

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTileSelectorCatalogTitles(iCatalogQuantity);
            Then.onThePageComposerDetailEditPage.iShouldSeeTileSelectorTileTitles(iTileQuantity);
            Then.onThePageComposerDetailEditPage.iShouldSeeTileSelectorTileSubtitles(iTileQuantity);
            Then.onThePageComposerDetailEditPage.iShouldSeeTileSelectorTileInfoButtons(iTileQuantity);
            Then.onThePageComposerDetailEditPage.iShouldSeeTileSelectorTileAddButtons(iTileQuantity);
        });

        opaTest("TileSelector - Should see tile info popover", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailEditPage.iPressATileSelectorTileInfoButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileInfoPopover();

            // Reset
            When.onThePageComposerDetailEditPage.iCloseTheTileInfoPopover();
        });

        opaTest("Page Layout Editor - Should see tile info popover", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailEditPage.iPressASectionTile();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheTileInfoPopover();

            // Reset
            When.onThePageComposerDetailEditPage.iCloseTheTileInfoPopover();
        });

        opaTest("Page Layout Editor - Changing the title of a section should be possible.", function (Given, When, Then) {
            // Arrangements
            var sTestSectionName = "Test Section 0";

            // Actions
            When.onThePageComposerDetailEditPage.iPressTheAddSectionButtonWithIndex(0);
            When.onThePageComposerDetailEditPage.iRenameASection("", sTestSectionName);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheSectionWithTitle(sTestSectionName);
        });

        opaTest("Page Layout Editor - \"Save button\" should be enabled after changing a section's title", function (Given, When, Then) {
            // Arrangements
            var sTestSectionName = "Test Section 0";
            var sTestSectionNameNew = "Test Section 1";

            // Actions
            When.onThePageComposerDetailEditPage.iRenameASection(sTestSectionName, sTestSectionNameNew);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheLayoutSaveButton(true);

            // Actions
            When.onThePageComposerDetailEditPage.iRenameASection(sTestSectionNameNew, sTestSectionName)
                .and.iPressTheLayoutSaveButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheLayoutSaveButton(false);
        });

        opaTest("Page Layout Editor - Deleting a section should be possible.", function (Given, When, Then) {
            // Arrangements
            var sTestSectionName = "Test Section 0";

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheSectionWithTitle(sTestSectionName);

            // Actions
            When.onThePageComposerDetailEditPage.iPressTheDeleteSectionButtonWithIndex(1);

            // Assertions
            Then.onADialog.iShouldSeeTheSectionDeleteButton(true);

            // Actions
            When.onADialog.iPressTheSectionDeleteButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldNotSeeTheSectionWithTitle(sTestSectionName);

            // Reset
            When.onThePageComposerDetailEditPage.iPressTheLayoutSaveButton();
        });

        opaTest("Page Layout Editor - The Save Button is disabled after saving the page.", function (Given, When, Then) {
            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeTheLayoutSaveButton(false);
        });

        opaTest("ContextSelector - Opening the ContextSelector is possible.", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailEditPage.iPressTheRoleContextButton();

            // Assertions
            Then.onThePageComposerApplication.iShouldSeeTheContextSelector();
        });

        opaTest("ContextSelector - Selecting no role at all is not possible.", function (Given, When, Then) {
            // Actions
            When.onADialog.iSelectRoleWithIndex(0)
                .and.iSelectRoleWithIndex(1);

            // Assertions
            Then.onADialog.iShouldSeeTheSelectButton(false)
                .and.iShouldSeeTheContextSelectorInfoToolbar(true);
        });

        opaTest("ContextSelector - Changing the role context will update the TileSelector.", function (Given, When, Then) {
            // Arrangements
            var sTileTitle = "Create Sales Order";

            // Actions
            When.onADialog.iSelectRoleWithIndex(1)
                .and.iPressTheSelectButton();

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeATileInTheTileSelector(sTileTitle, 2)
                .and.iShouldSeeTheTileSelectorInfoToolbar(true);

            // Reset
            Then.iTeardownMyFLP();
        });
    });
});
