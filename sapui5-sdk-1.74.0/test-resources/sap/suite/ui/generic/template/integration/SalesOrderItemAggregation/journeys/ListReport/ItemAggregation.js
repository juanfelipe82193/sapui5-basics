sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - List Report");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(182,"_tab1")
				.and
				.theResultListFieldHasTheCorrectValue({Line:1, Field:"ProductId", Value:"HT-1003"},"_tab1")
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1,182);
		});

		//TODO temporarily deactivated
		opaTest("Switching to _tab2", function (Given, When, Then) {

//			// actions
			When.onTheGenericListReport
				.iClickOnIconTabFilter("_tab2");

			Then.onTheListReportPage
				.theResultChartIsVisible();

			Then.onTheListReportPage
				.theCustomDataIsSetForChart();
		});
		//

		opaTest("Switching to _tab3", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickOnIconTabFilter("_tab3");

			Then.onTheGenericListReport
				.theResultListIsVisible();
		});
		//TODO temporarily deactivated
		opaTest("Switching to _tab4", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickOnIconTabFilter("_tab4");

			Then.onTheListReportPage
				.theResultChartIsVisible();

			Then.onTheListReportPage.iTeardownMyApp();
		});//
	}
);
