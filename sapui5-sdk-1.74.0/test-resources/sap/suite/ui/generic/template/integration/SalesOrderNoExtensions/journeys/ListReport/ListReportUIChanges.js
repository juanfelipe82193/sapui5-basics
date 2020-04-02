sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report UI Changes");

		opaTest("#1: Starting the app, loading data and checking the Excel button", function (Given, When, Then) {
			// arrangements
			//Given.iStartTheListReportWithChange();			// starting with demokit.html
			Given.iStartTheListReportInFlpSandboxWithChange();	// starting with flpSandbox.html

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.iShouldSeeTheButtonWithId("listReport-btnExcelExport");
				// .iShouldSeeTheExcelButton();  // also working but checks for icon
		});

		
		QUnit.module("Sales Order No Extensions - External Navigation");

		opaTest("#2: Click Business Partner link for external navigation", function (Given, When, Then) {

			// actions
			When.onTheGenericListReport
				.iClickTheLink("100000006")
				.and
				.iLookAtTheScreen();

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("100000006");
		});

		opaTest("#3: Navigate back to Sales Order List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheBackButtonOnFLP();

			Then.onTheGenericListReport
				.theResultListIsVisible();
		});
		
		opaTest("Check for Delete Object Confirmation Pop up message", function (Given, When, Then) {
		
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([0]);

			When.onTheListReportPage
				.iClickTheButtonInTheSmartTableToolbar("Delete");

			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithContent("Delete object 500000000 (SalesOrder)?");
		});

		QUnit.module("Sales Order No Extensions - List Report UI Changes: Teardown");

		opaTest("Teardown ", function (Given, When, Then) {
			Given.iTeardownMyApp();
			Opa5.assert.expect(0);
		});
	}
);
