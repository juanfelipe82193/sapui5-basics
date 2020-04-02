// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/test/opaQunit",
    "sap/ushell/opa/tests/homepage/pages/i18n/resources",
    "sap/ushell/Config",
    "sap/ushell/opa/tests/header/pages/MeArea",
    "sap/ushell/opa/tests/homepage/pages/Homepage",
    "sap/ushell/opa/tests/homepage/pages/PageOverview",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDetailEdit",
    "sap/ushell/opa/tests/homepage/pages/PageComposerDialog",
    "sap/ushell/opa/tests/homepage/pages/PageComposerApplication"
], function (opaTest, oResources) {
    "use strict";

    /* global QUnit */

    QUnit.module("Page Composer - Confirm overwriting changes");

    var _iSetMyShellComposeArrangements = function () {
        window.location.hash = "Shell-compose";
    };

    // add other adapters here, once supported
    var aAdapters = ["cdm"];
    aAdapters.forEach(function (sAdapter) {

        opaTest("Page Detail Edit Dialog - confirm overwriting changes", function (Given, When, Then) {
          // Arrangements
          Given.iStartMyMockServer("/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/", {
            sMetadataPath: "../../../../test-resources/sap/ushell/OPA/localService/pageComposer/pages/metadata.xml",
            sMockDataFolderPath: "../../../../test-resources/sap/ushell/OPA/localService/pageComposer/pages/mockData/confirmChanges"
        });
        Given.iStartMyMockServer("/sap/opu/odata/UI2/FDM_VALUE_HELP_SRV/", {
            sMetadataPath: "../../../../test-resources/sap/ushell/OPA/localService/pageComposer/transport/metadata.xml",
            sMockDataFolderPath: "../../../../test-resources/sap/ushell/OPA/localService/pageComposer/transport/mockData"
        });
        Given.iStartMyFLP(sAdapter).then(_iSetMyShellComposeArrangements);

            // Actions
            When.onThePageOverview.iPressTheEditPageButtonWithIndex(0);
            When.onThePageComposerDetailEditPage.iExpandTheHeaderIfCollapsed();
            When.onThePageComposerDetailEditPage.iPressTheEditHeaderButton();

            // Change Title and Description
            When.onADialog.iEnterTextIntoInputWithLabel("some Change", oResources.i18n.getText("Label.PageTitle"));

            // Close the dialog
            When.onADialog.iPressTheConfirmButton();

            // Exit edit mode
            When.onThePageComposerDetailEditPage.iPressTheLayoutSaveButton();

            // Assertion
            Then.onThePageComposerApplication.iShouldSeeTheConfirmChangesDialog();

            // Reset
            When.onADialog.iPressTheCancelButton();
            Then.iTeardownMyFLP();
        });
    });
});
