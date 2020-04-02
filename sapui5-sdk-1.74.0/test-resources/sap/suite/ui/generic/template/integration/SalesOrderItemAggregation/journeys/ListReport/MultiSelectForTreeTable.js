sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - MultiSelectForTreeTable: Single Select", function (hooks) {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements
				Given.iStartTheListReport("manifestTreeTable");

				// actions
				When.onTheGenericListReport
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theResultListIsVisible();

				Then.onTheListReportPage
					.checkTableType("TreeTable");
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iExecuteTheSearch()
					.and
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (1)");
			});

			opaTest("Select another item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iSelectListItemRange(10, 10, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (1)");
			});

			opaTest("Close dialog", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK");
				Then.onTheGenericListReport
					.theResultListIsVisible();
			});

			opaTest("Teardown ", function (Given, When, Then) {
				Given.iTeardownMyApp();
				Opa5.assert.expect(0);
			});
		});


		QUnit.module("Sales Order Item Aggregation - MultiSelectForTreeTable: Multi Select", function (hooks) {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements
				Given.iStartTheListReport("manifestTreeTableMS");

				// actions
				When.onTheGenericListReport
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theResultListIsVisible();

				Then.onTheListReportPage
					.checkTableType("TreeTable");
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (1)");
			});

			opaTest("Select multiple items and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iSelectListItemRange(0, 1, "_tab1")
					.and
					.iSelectListItemRange(5, 9, "_tab1")
					.and
					.iSelectListItemRange(11, 13, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (10)");
			});

			opaTest("Select all items and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iSelectAllListItems("_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (182)"); // all items
			});

			opaTest("Clear selection", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1");

				Then.onTheGenericListReport
					.theResultListIsVisible();
			});

			opaTest("Teardown ", function (Given, When, Then) {
				Given.iTeardownMyApp();
				Opa5.assert.expect(0);
			});
		});


		QUnit.module("Sales Order Item Aggregation - MultiSelectForTreeTable: Multi Select with Limit", function (hooks) {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements
				Given.iStartTheListReport("manifestTreeTableMSL");

				// actions
				When.onTheGenericListReport
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theResultListIsVisible();

				Then.onTheListReportPage
					.checkTableType("TreeTable");
			});

			opaTest("Select one item and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iSelectListItemRange(0, 0, "_tab1")
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (1)");
			});

			opaTest("Select multiple items below limit and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 9, "_tab1") // 10 items (limit)
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (10)");
			});

			opaTest("Select multiple items above limit and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(0, 10, "_tab1") // 11 items
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (10)"); // limited to 10
			});

			opaTest("Select multiple items above limit several times and show selected", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1")
					.and
					.iSelectListItemRange(1, 11, "_tab1") // 11 items, only 10 will be selected
					.and
					.iSelectListItemRange(13, 23, "_tab1") // 11 items, only 10 will be selected
					.and
					.iClickTheButtonWithId("ShowSelected-_tab1");

				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Show Selected");

				Then.onTheListReportPage
					.theHeaderTextOnListIsCorrect("Sales Order Items (20)"); // limited to 2*10
			});

			opaTest("Clear selection", function (Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iDeselectAllListItems("_tab1");

				Then.onTheGenericListReport
					.theResultListIsVisible();
			});

			opaTest("Teardown ", function (Given, When, Then) {
				Given.iTeardownMyApp();
				Opa5.assert.expect(0);
			});
		});
	}
);
