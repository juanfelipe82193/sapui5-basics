sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {
		"use strict";

		QUnit.module("External Navigation Inbound 6");

		opaTest("Check Related Apps", function(Given, When, Then) {
			// arrangements
			Given.iStartTheListReportInFlpSandbox();
			// assertions
			When.onTheListReportPage
				.iClickTheButton("Go")
				.and
				.iClickTheItemInTheTable(0);
			When.onTheGenericObjectPage
				.iClickTheRelatedAppMenuButton("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--relatedApps");
			
			Then.onTheObjectPage.theRelatedAppsShouldListTheCorrectItems()
				.and
				.iTeardownMyApp();
		});
				
		opaTest("Check Related Apps UnavailableActions", function (Given, When, Then) {
					// arrangements
			Given.iStartTheListReportInFlpSandbox();
			// assertions
			When.onTheListReportPage
				.iClickTheButton("Go")
				.and
				.iClickTheItemInTheTable(0);
			When.onTheGenericObjectPage
				.iClickTheRelatedAppMenuButton("STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--relatedApps");

			Then.onTheObjectPage.theRelatedAppsShouldNotShowUnavailableActions()
				.and
				.iTeardownMyApp();
		});

		/* these tests (2, 2a) do not open the draft resume popup anymore -> to be investigated
		opaTest("2. ExtNav_TK_CallonExistingActiveObjectButAlsoDraftExist", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonExistingActiveObjectButAlsoDraftExist();
			// assertions
			Then.onTheObjectPage.theDraftResumeDialogShouldBeDisplayed()
			    .and
				.iTeardownMyApp();
		});
		opaTest("2a. ExtNav_SK_CallonExistingActiveObjectButAlsoDraftExist", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_SK_CallonExistingActiveObjectButAlsoDraftExist();
			// assertions
			Then.onTheObjectPage.theDraftResumeDialogShouldBeDisplayed()
			    .and
				.iTeardownMyApp();
		});

		/* these tests (3, 3a, 4, 5, 5a, 5b, 10) lead sometimes to a timeout after 300 seconds even on push voter (originally only on nightly build)
		//also here the active object should be displayed, we always show the active doc
		opaTest("3. ExtNav_TK_CallonExistingDraftObjectButAlsoActiveExist", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonExistingDraftObjectButAlsoActiveExist();
			// assertions
			Then.onTheObjectPage.theDraftResumeDialogShouldBeDisplayed()
			    .and
				.iTeardownMyApp();
		});

		opaTest("3a. ExtNav_TK_CallonExistingDraftObjectButAlsoActiveExist_LegacyDraftUUID", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonExistingDraftObjectButAlsoActiveExist_LegacyDraftUUID();
			// assertions
			Then.onTheObjectPage.theDraftResumeDialogShouldBeDisplayed()
			    .and
				.iTeardownMyApp();
		});


		opaTest("4. ExtNav_TK_CallonOldWrongDraftObjectButAlsoActiveExist", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonOldWrongDraftObjectButAlsoActiveExist();
			// assertions
			Then.onTheObjectPage.theDraftResumeDialogShouldBeDisplayed()
			    .and
				.iTeardownMyApp();
		});
		
		//exception to navigate to a newly created draft
		opaTest("5. ExtNav_TK_CallonNewDraftObjectAndActiveNotExist", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonNewDraftObjectAndActiveNotExist();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened()
				.and
				.thePageShouldBeInEditMode()
			    .and
				.iTeardownMyApp();
		});
		
		//exception to navigate to a newly created draft
		opaTest("5a. ExtNav_SK_CallonNewDraftObjectAndActiveNotExist", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_SK_CallonNewDraftObjectAndActiveNotExist();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened()
				.and
				.thePageShouldBeInEditMode()
			    .and
				.iTeardownMyApp();
		});

		opaTest("5b. ExtNav_SK_CallonNewDraftObject_SKEmpty_AndActiveNotExist", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_SK_CallonNewDraft_SKEmpty_ObjectAndActiveNotExist();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened()
			.and
			.thePageShouldBeInEditMode()
		    .and
			.iTeardownMyApp();
		});

		opaTest("10. ExtNav_CREATE_Call", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_CREATE_Call();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened()
		    .and
			.iTeardownMyApp();
		});*/

		/*
		 * these tests (11, 11a and 12) are not possible with having multiple apps in flpSandbox.html
		 * if you remove the other apps then this test can be executed
		 *
		opaTest("11. ExtNav_EDIT_TK_CallonExistingActiveObject", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_EDIT_TK_CallonExistingActiveObject();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened()
			.and
			.thePageShouldBeInEditMode()
		    .and
			.iTeardownMyApp();
		});
		opaTest("11a. ExtNav_EDIT_SK_CallonExistingActiveObject", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_EDIT_SK_CallonExistingActiveObject();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened()
			.and
			.thePageShouldBeInEditMode()
		    .and
			.iTeardownMyApp();
		});

		opaTest("12. ExtNav_EDIT_TK_CallonExistingActiveObjectButForeignDraftExist", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_EDIT_TK_CallonExistingActiveObjectButForeignDraftExist();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened()
		    .and
			.iTeardownMyApp();
		});	*/
	}
);
