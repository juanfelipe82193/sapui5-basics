sap.ui.define(
	[],
	function() {
		"use strict";

		QUnit.module("RTA Personalization");

		// Show the master view with product list
		opaTest("Start RTA Personalization", function(Given, When, Then) {
			// Arrangements
			Given.iStartTheApp({
				hash: "product/HT-1000",
				urlParameters: "sap-rta-lrep-storage-type=sessionStorage"
			});
			Given.iEnableTheSessionLRep();
			// Actions
			When.onTheMasterPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root").
			and.iUseTheStorageFromIFrame("idAppControl", "Root", true).
			and.iGoToMeArea().
			and.iPressOnAdaptUi(true);

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheToolbar().
			and.iShouldSeeTheOverlayForTheApp("idAppControl", "Root");
		});

		opaTest("Remove an Object Page Section using Context Menu", function(Given, When, Then) {
			// Actions
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay("application-masterDetail-display-component---ProductDetail--ObjectSectionSupplier").
			and.iClickOnAContextMenuEntry(1);
			//Assertions
			Then.onTheMasterPageWithRTA.iShouldNotSeeTheElement("application-masterDetail-display-component---ProductDetail--ObjectSectionSupplier");
		});

		opaTest("Add an Object Page Section using Context Menu", function(Given, When, Then){
			// Actions
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay("application-masterDetail-display-component---ProductDetail--ObjectSectionGeneral").
			and.iClickOnAContextMenuEntry(0).
			and.iSelectAFieldByLabelInTheAddSectionDialog("Technical Data").
			and.iPressOK();

			//Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheElement("application-masterDetail-display-component---ProductDetail--ObjectSectionTechnical");
		});

		opaTest("Move a section using cut&paste", function(Given, When, Then){
			// Actions
			When.onTheMasterPageWithRTA.iRightClickOnAnElementOverlay("application-masterDetail-display-component---ProductDetail--ObjectSectionGeneral").
			and.iClickOnAContextMenuEntry(2).
			and.iRightClickOnAnElementOverlay("application-masterDetail-display-component---ProductDetail--ObjectSectionTechnical").
			and.iClickOnAContextMenuEntry(3);

			// Assertions
			Then.onTheMasterPageWithRTA.theSectionShouldBeInTheFirstPosition("application-masterDetail-display-component---ProductDetail--ObjectSectionTechnical");
		});

		opaTest("Remove a section using Easy Remove", function(Given, When, Then){
			// Actions
			When.onTheMasterPageWithRTA.iPressOnRemoveSection("application-masterDetail-display-component---ProductDetail--ObjectSectionTechnical");

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldNotSeeTheElement("application-masterDetail-display-component---ProductDetail--ObjectSectionTechnical");
		});

		opaTest("Add a section using Easy Add", function(Given, When, Then){
			// Actions
			When.onTheMasterPageWithRTA.iPressOnAddSection("application-masterDetail-display-component---ProductDetail--ObjectSectionGeneral"). // The button under
			and.iSelectAFieldByLabelInTheAddSectionDialog("Technical Data").
			and.iPressOK();

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheElement("application-masterDetail-display-component---ProductDetail--ObjectSectionTechnical").
			and.theSectionShouldBeInTheFirstPosition("application-masterDetail-display-component---ProductDetail--ObjectSectionGeneral");
		});

		opaTest("Exit RTA Personalization", function(Given, When, Then) {
			When.onTheMasterPageWithRTA.iExitRtaPersonalizationMode();

			Then.onTheMasterPageWithRTA.iShouldSeeTheFLPToolbarAndChangesInLRep(6, "sap.ui.demoapps.rta.freestyle.Component");
		});

		opaTest("Start RTA", function(Given, When, Then) {
			// Actions
			When.onTheMasterPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root").
			and.iGoToMeArea().
			and.iPressOnAdaptUi();

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeThePopUp();
		});

		opaTest("App Reload without Personalization Changes (test reload)", function(Given, When, Then){
			// Actions
			When.onTheMasterPageWithRTA.iPressOK().and.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root");

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheElement("application-masterDetail-display-component---ProductDetail--ObjectSectionSupplier").
			and.iShouldNotSeeTheElement("application-masterDetail-display-component---ProductDetail--ObjectSectionTechnical").
			and.theSectionShouldBeInTheFirstPosition("application-masterDetail-display-component---ProductDetail--ObjectSectionGeneral");
		});

		opaTest("Exit RTA", function(Given, When, Then){
			// Actions
			When.onTheMasterPageWithRTA.iExitRtaMode();

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeThePopUp();
		});

		//TODO: Check why hash is read incorrectly (currently retrieving the hash from the window does not return the expected hash -> doesn't trigger reload)
		// opaTest("Start app again to see Personalization Changes", function(Given, When, Then){
		// 	// Actions
		// 	When.onTheMasterPageWithRTA.iPressReload().and.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root");

		// 	// Assertions
		// 	Then.onTheMasterPageWithRTA.iShouldSeeTheSection("application-masterDetail-display-component---ProductDetail--ObjectSectionTechnical");
		// });

		opaTest("Start app without Personalization Changes (test URL Parameter)", function(Given, When, Then){
			Then.onTheMasterPageWithRTA.iTeardownTheAppFrame("idAppControl", "Root", false, true);
			Given.iStartTheApp({
				hash: "product/HT-1000",
				urlParameters: "sap-rta-lrep-storage-type=sessionStorage",
				technicalParameters: "sap-ui-fl-max-layer=CUSTOMER"
			});

			// Actions
			When.onTheMasterPageWithRTA.iWaitUntilTheBusyIndicatorIsGone("idAppControl", "Root").
			and.iUseTheStorageFromIFrame("idAppControl", "Root");

			// Assertions
			Then.onTheMasterPageWithRTA.iShouldSeeTheSection("application-masterDetail-display-component---ProductDetail--ObjectSectionSupplier").
			and.iTeardownTheAppFrame("idAppControl", "Root", true, true);
		});
	}
);