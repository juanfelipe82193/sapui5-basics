sap.ui.define(
	[],
	function() {
		"use strict";

		QUnit.module("RTA");

		opaTest("Load the app and start RTA", function(Given, When, Then) {
			var sProductHash = "//SEPMRA_C_PD_Product(Product='HT-2001',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";

			// Arrangements
			Given.iStartTheApp({
				hash: sProductHash,
				urlParameters : "sap-rta-lrep-storage-type=sessionStorage"
			});
			Given.iEnableTheSessionLRep();

			// Actions
			When.onTheMasterPageWithRTA.iGoToMeArea().
			and.iUseTheStorageFromIFrame("application-masterDetail-display-component-appContent", undefined).
			and.iPressOnAdaptUi().
			and.iWaitUntilTheBusyIndicatorIsGone("mainShell", undefined);

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheToolbar().
			and.iShouldSeeTheOverlayForTheApp("application-masterDetail-display-component-appContent", undefined);
		});

		opaTest("Rename a Label in the SmartForm", function(Given, When, Then) {
			// Actions
			var sId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::ProductBaseUnit::GroupElement";
			var sId2 = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Depth::GroupElement";
			var sRenamedLabel = "New Value - Test";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(0).
			and.iEnterANewName(sRenamedLabel).
			and.iClickOnAnElementOverlay(sId2);
			//Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheGroupElementByLabel(sRenamedLabel);
		});

		opaTest("Delete a Field in the SmartForm", function(Given, When, Then) {
			//Actions
			var sId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Height::GroupElement";
			When.onTheMasterPageWithRTA.iClickOnAnElementOverlay(sId).
			and.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(2);

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldNotSeeTheElement(sId);
		});

		opaTest("Add a Field in the SmartForm - addODataProperty", function(Given, When, Then) {
			//Actions
			var sId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Width::GroupElement";
			var sId2 = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup_SEPMRA_C_PD_ProductType_MainProductCategory";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(1).
			and.iSelectAFieldByBindingPathInTheAddDialog("MainProductCategory").
			and.iPressOK();

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheElement(sId2).
			and.theGroupElementHasTheCorrectIndex(sId, sId2, false);
		});

		opaTest("Add a Field in the SmartForm - reveal", function(Given, When, Then) {
			//Actions
			var sId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Width::GroupElement";
			var sId2 = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Height::GroupElement";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(1).
			and.iSelectAFieldByBindingPathInTheAddDialog("Height").
			and.iPressOK();

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheElement(sId2).
			and.theGroupElementHasTheCorrectIndex(sId, sId2, false);
		});

		// Not working due to a bug! handled here: 1880639889
		// opaTest("Moving a Field via Cut and Paste to a GroupElement", function(Given, When, Then) {
		// 	//Actions
		// 	var sId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::ProductBaseUnit::GroupElement";
		// 	var sId2 = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Depth::GroupElement";
		// 	When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
		// 	and.iClickOnAContextMenuEntry(3).
		// 	and.iRightClickOnAnElementOverlay(sId2).
		// 	and.iClickOnAContextMenuEntry(4);

		// 	// Assertions
		// 	Then.onTheMasterPageWithRTA.theGroupElementHasTheCorrectIndex(sId2, sId, false);
		// });

		opaTest("Moving a Field via Cut and Paste to a Group", function(Given, When, Then) {
			//Actions
			var sId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Height::GroupElement";
			var sId2 = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(3).
			and.iRightClickOnAnAggregationOverlay(sId2, "formElements").
			and.iClickOnAContextMenuEntry(4);

			// Assertions
			Then.onTheMasterPageWithRTA.theGroupElementHasTheFirstIndex(sId);
		});

		opaTest("Creating a new Group", function(Given, When, Then) {
			var sId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--ProductCollectionFacetID::Form";
			var sNewTitle = "Renamed New Group";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(0).and.iEnterANewName(sNewTitle).
			and.iClickOnAnElementOverlay(sId);

			Then.onTheMasterPageWithRTA.iShouldSeeGroupsInSmartForm(sId, 2).and.iShouldSeeTheGroupByTitle(sNewTitle);
		});

		opaTest("Exiting RTA", function(Give, When, Then) {
			When.onTheMasterPageWithRTA.iExitRtaMode();

			Then.onTheMasterPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(8, "sap.ui.demoapps.rta.fiorielements.Component");
		});

		opaTest("Reloading the App", function(Given, When, Then) {
			var sProductHash = "//SEPMRA_C_PD_Product(Product='HT-2001',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";
			var sGroupId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup"
			var sId = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Height::GroupElement";
			var sId2 = "sap.ui.demoapps.rta.fiorielements::sap.suite.ui.generic.template.ObjectPage.view.Details::SEPMRA_C_PD_Product--com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::FormGroup_SEPMRA_C_PD_ProductType_MainProductCategory";

			Then.onTheMasterPageWithRTA.iTeardownTheAppFrame("mainShell", undefined, true, true);

			// Arrangements
			Given.iStartTheApp({
				hash: sProductHash,
				urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
			});

			When.onTheMasterPageWithRTA.iUseTheStorageFromIFrame("application-masterDetail-display-component-appContent", undefined);

			Then.onTheMasterPageWithRTA.iShouldSeeChangesInLRepWhenTheBusyIndicatorIsGone("mainShell", undefined, 8, "sap.ui.demoapps.rta.fiorielements.Component").
			and.iShouldSeeTheGroupElementByLabel("New Value - Test").
			and.theChangesToTheGroupShouldStillBeThere(sGroupId, sId, sId2, 6).
			and.iTeardownTheAppFrame("mainShell", undefined, true, true);
		});

	}
);