sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/pages/ListReport",
	"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/pages/ObjectPage",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Table Tabs - List Report");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();

			When.onTheGenericListReport
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.theResultListContainsTheCorrectNumberOfItems(3, 1);

			Then.onTheListReportPage
				.theRightTabFromExtensionIsSelected()
				.theSalesOrdersAreLoadedInTheSmartTable();
		});

		opaTest("Clicking on Tab2", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.theResultListContainsTheCorrectNumberOfItems(6, 2); //actual 39 but limited with table top 25
		});

		opaTest("Check that the editing status is shown", function (Given, When, Then) {
			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectObjectMarkerEditingStatus({Line:0, Field:"SalesOrder", Value:"Flagged"});
		});

		opaTest("Check LR custom header title", function (Given, When, Then) {
			Then.onTheListReportPage
				.checkCustomTitle();
		});

		opaTest("TabRefresh: Select a SalesOrder and click Raise Gross Amount button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3],true,2)
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Raisegrossamount-2");

			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(6, 2);
		});


		opaTest("Clicking on Tab1", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1");

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(3, 1)  // one less because the selected cheap entry is now expensive!
				.and
				.theResultListFieldHasTheCorrectValue({Line:0, Field:"GrossAmount", Value:"14602.49"},1)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 3);
		});

		opaTest("Tear down the application", function (Given, When, Then) {
			Then.onTheListReportPage.iTeardownMyApp();
			expect(0);
		});
	}
);
