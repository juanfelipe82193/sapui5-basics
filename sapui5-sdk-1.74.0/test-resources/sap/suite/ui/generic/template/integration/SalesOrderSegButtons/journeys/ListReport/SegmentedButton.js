sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - List Report");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();
			
			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();
			
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(7)
				.and
				.iShouldSeeTheSegmentedButtonWithLabel("Expensive (7)");
		});

		opaTest("Click on segmented button 2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("_tab2");

			Then.onTheGenericListReport
				.theResultListIsVisible();
				//.theResultListContainsTheCorrectNumberOfItems(39);
		});

		opaTest("Click on segmented button 1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnSegmentedButton("_tab1");

			Then.onTheGenericListReport
				.theResultListIsVisible();
				//.theResultListContainsTheCorrectNumberOfItems(61);

		});

		opaTest("Click a draft link in the ListReport", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheLink("Draft");

			Then.onTheListReportPage
				.theDraftPopoverIsVisible("Draft");
		});

		opaTest("ApplicablePath - Select 3rd sales order and check extension button enablement", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://decline")
				.and
				.iSelectListItemsByLineNo([0]);

			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:0, Field:"EnabledStatus", Value:false})
				.and
				.theButtonWithIdIsEnabled("EnableExt")
				.and
				.theOverflowToolBarButtonIsEnabled("Disable via Extension", false);
		});

		opaTest("ApplicablePath - Press Enable via Extension and check buttons and field", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("EnableExt");
			
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:0, Field:"EnabledStatus", Value:true})
				.and
				.theOverflowToolBarButtonIsEnabled("Enable via Extension", false)
				.and
				.theButtonWithIdIsEnabled("DisableExt");
		});

		opaTest("Click the unsaved changes link in the ListReport", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheLink("Unsaved Changes by Cristian Croitoru");

			Then.onTheListReportPage
				.theDraftPopoverIsVisible("Unsaved Changes");

			Then.onTheListReportPage.iTeardownMyApp();
		});
		
	}
);