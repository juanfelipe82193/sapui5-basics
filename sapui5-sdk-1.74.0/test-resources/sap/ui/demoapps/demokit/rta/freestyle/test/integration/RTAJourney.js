/* global opaTest */
sap.ui.define(
	function() {
		"use strict";

		QUnit.module("RTA");

		// Show the master view with product list
		opaTest("Start RTA", function(Given, When, Then) {
			// Arrangements
			Given.iStartTheApp({
				hash: "product/HT-1000",
				urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
			});
			Given.iEnableTheSessionLRep();

			// Actions
			When.onTheMasterPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root").
			and.iUseTheStorageFromIFrame("idAppControl", "Root").
			and.iGoToMeArea().
			and.iPressOnAdaptUi();

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheToolbar().
			and.iShouldSeeTheOverlayForTheApp("idAppControl", "Root");
		});

		// Currently failing (only in the voter!) -> find an alternative or ask for help from TA team
		// TODO: Adapt the number of changes and the label check on the following steps when solution was found
		// opaTest("Rename a Label in the SimpleForm with double-click", function(Given, When, Then) {
		// 	// Actions
		// 	When.onTheMasterPageWithRTA.
		// 	iClickOnAnElementOverlay("application-masterDetail-display-component---ProductDetail--GeneralForm--productLabel").
		// 	and.iWaitUntilTheCompactContextMenuAppears("sap-icon://edit", "Rename").
		// 	and.iClickOnAnElementOverlay("application-masterDetail-display-component---ProductDetail--GeneralForm--productLabel").
		// 	and.iClickOnAnElementOverlay("application-masterDetail-display-component---ProductDetail--GeneralForm--productLabel").
		// 	and.iEnterANewName("Changed by double-click");
		// 	//Assertions
		// 	Then.onTheMasterPageWithRTA.iShouldSeeTheGroupElementByLabel("Changed by double-click");
		// });

		opaTest("Rename a Label in the SmartForm via context menu", function(Given, When, Then) {
			// Actions
			When.onTheMasterPageWithRTA.iScrollDown("application-masterDetail-display-component---ProductDetail--ObjectSectionSupplier").and.
			iRightClickOnAnElementOverlay("application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.FirstName").
			and.iClickOnAContextMenuEntry(0).
			and.iEnterANewName("New Value - Test");
			//Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheGroupElementByLabel("New Value - Test");
		});

		opaTest("Delete a Field in the SmartForm", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.LastName";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(2);

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldNotSeeTheElement(sId);
		});

		opaTest("Add a Field in the SmartForm - addODataProperty", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.PhoneNumber";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPersonGroup_SEPMRA_I_ContactPersonType_FormattedContactName";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(1).
			and.iSelectAFieldByBindingPathInTheAddDialog("FormattedContactName").
			and.iPressOK();

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheElement(sId2).
			and.theGroupElementHasTheCorrectIndex(sId, sId2, false);
		});

		opaTest("Add a Field in the SmartForm - reveal", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.PhoneNumber";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.LastName";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(1).
			and.iSelectAFieldByBindingPathInTheAddDialog("LastName").
			and.iPressOK();

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheElement(sId2).
			and.theGroupElementHasTheCorrectIndex(sId, sId2, false);
		});

		opaTest("Moving a Field via Cut and Paste to a GroupElement", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.EmailAddress";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.FirstName";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(3).
			and.iRightClickOnAnElementOverlay(sId2).
			and.iClickOnAContextMenuEntry(4);

			// Assertions
			Then.onTheMasterPageWithRTA.theGroupElementHasTheCorrectIndex(sId2, sId, false);
		});

		opaTest("Moving a Field via Cut and Paste to a Group", function(Given, When, Then) {
			//Actions
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.EmailAddress";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPersonGroup";
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay(sId).
			and.iClickOnAContextMenuEntry(3).
			and.iRightClickOnAnAggregationOverlay(sId2, "formElements").
			and.iClickOnAContextMenuEntry(5);

			// Assertions
			Then.onTheMasterPageWithRTA.theGroupElementHasTheFirstIndex(sId);
		});

		opaTest("Exiting RTA", function(Give, When, Then) {
			When.onTheMasterPageWithRTA.iExitRtaMode();

			Then.onTheMasterPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(7, "sap.ui.demoapps.rta.freestyle.Component");
		});

		opaTest("Reloading the App", function(Given, When, Then) {
			var sGroupId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPersonGroup";
			var sId = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPerson.EmailAddress";
			var sId2 = "application-masterDetail-display-component---ProductDetail--SupplierForm--SupplierFormPersonGroup_SEPMRA_I_ContactPersonType_FormattedContactName";

			Then.onTheMasterPageWithRTA.iTeardownTheAppFrame("idAppControl", "Root", true, true);
			Given.iStartTheApp({
				hash: "product/HT-1000",
				urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
			});

			When.onTheMasterPageWithRTA.iUseTheStorageFromIFrame("idAppControl", "Root").
			and.iScrollDown("application-masterDetail-display-component---ProductDetail--ObjectSectionSupplier");

			Then.onTheMasterPageWithRTA.iShouldSeeChangesInLRepWhenTheBusyIndicatorIsGone("idAppControl", "Root", 7, "sap.ui.demoapps.rta.freestyle.Component").
			and.iShouldSeeTheGroupElementByLabel("New Value - Test").
			// and.iShouldSeeTheGroupElementByLabel("Changed by double-click").
			and.theChangesToTheGroupShouldStillBeThere(sGroupId, sId, sId2, 5).
			and.iTeardownTheAppFrame("idAppControl", "Root", true, true);
		});

	}
);