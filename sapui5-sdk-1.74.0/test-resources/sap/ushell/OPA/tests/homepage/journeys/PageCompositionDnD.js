// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/Config",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/PageOverview",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDetail",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDetailEdit",
    "sap/ushell/opa/tests/homepage/pages/PageComposerApplication"
], function (opaTest) {
    "use strict";

    /* global QUnit */

    QUnit.module("Page Composition - Drag'n'Drop");

    var _iSetMyShellComposeArrangements = function () {
        window.location.hash = "Shell-compose";
    };

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {
        opaTest("Drag and drop of a tile from the TileSelector to a section that already contains tiles is possible.",
            function (Given, When, Then) {
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

            When.onThePageOverview.iPressTheEditPageButtonWithIndex(1);

            var sTestSectionName = "Navigation",
                sTileTitle = "Create Sales Order";

            // Actions
            When.onThePageComposerDetailEditPage.iDragATileFromTheTileSelectorToASection(sTileTitle, sTestSectionName);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeATileInASection(sTileTitle, sTestSectionName, 2)
                .and.iShouldSeeATileInTheTileSelector(sTileTitle, 4)
                .and.iShouldSeeTheLayoutSaveButton(true);
        });

        opaTest("Drag and drop of a tile from the TileSelector to an empty section is possible.", function (Given, When, Then) {
            // Arrangements
            var sTestSectionName = "Test Section 0",
                sTileTitle = "Create Sales Order";

            // Actions
            When.onThePageComposerDetailEditPage.iPressTheAddSectionButtonWithIndex(0)
                .and.iRenameASection("", sTestSectionName)
                .and.iDragATileFromTheTileSelectorToASection(sTileTitle, sTestSectionName);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeATileInASection(sTileTitle, sTestSectionName, 1)
                .and.iShouldSeeTheLayoutSaveButton(true);
        });

        opaTest("Drag and drop of a tile between sections is possible.", function (Given, When, Then) {
            // Arrangements
            var sTileTitle = "Create Sales Order",
                sOldSectionTitle = "Test Section 0",
                sNewSectionTitle = "Navigation";

            // Actions
            When.onThePageComposerDetailEditPage.iDragATileFromSectionToSection(sTileTitle, sOldSectionTitle, sNewSectionTitle);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldNotSeeTileInSection(sTileTitle, sOldSectionTitle)
                .and.iShouldSeeATileInASection(sTileTitle, sNewSectionTitle, 3)
                .and.iShouldSeeTheLayoutSaveButton(true);
        });

        opaTest("Drag and drop of a tile withing a section is possible.", function (Given, When, Then) {
            // Arrangements
            var sTileTitle = "FLP - Test App",
                sSectionTitle = "Navigation";

            // Actions
            When.onThePageComposerDetailEditPage.iDragATileFromSectionToSection(sTileTitle, sSectionTitle, sSectionTitle);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeATileInASectionAtIndex(sTileTitle, sSectionTitle, 3)
                .and.iShouldSeeTheLayoutSaveButton(true);
        });

        opaTest("Drag and drop of a section is possible.", function (Given, When, Then) {
            var sSection0 = "Custom & Dynamic Tiles",
                sSection1 = "Test Section 0";

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeSectionAtIndex(sSection0, 0)
                .and.iShouldSeeSectionAtIndex(sSection1, 1);

            // Actions
            When.onThePageComposerDetailEditPage.iDragASection(0, 1);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeSectionAtIndex(sSection0, 1)
                .and.iShouldSeeSectionAtIndex(sSection1, 0)
                .and.iShouldSeeTheLayoutSaveButton(true);

            // Reset
            When.onThePageComposerDetailEditPage.iDragASection(1, 0);
        });

        opaTest("Drag and drop of a tile onto the TileSelector is not possible.", function (Given, When, Then) {
            var sTileTitle = "Create Sales Order";

            // Actions
            When.onThePageComposerDetailEditPage.iDragATileFromTheTileSelectorToTheTileSelector(1);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldSeeATileInTheTileSelector(sTileTitle, 4);
        });

        opaTest("Drag and drop of a tile onto the Header is not possible.", function (Given, When, Then) {
            // Actions
            When.onThePageComposerDetailEditPage.iDragATileFromTheTileSelectorToTheHeader(1);

            // Assertions
            Then.onThePageComposerDetailEditPage.iShouldNotSeeAdditionalContentInTheHeader(1);

            // Reset (Saving is necessary since the DirtyFlag suppresses navigation)
            When.onThePageComposerDetailEditPage.iPressTheLayoutSaveButton();
            Then.iTeardownMyFLP();
        });
    });
});
