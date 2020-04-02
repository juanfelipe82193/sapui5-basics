sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/utils/OpaManifest",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/ListReport",
    "sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/ObjectPage",
], function (opaTest, OpaManifest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report");

		opaTest("Starting the app and loading data", function (Given, When, Then) {

			// arrangements
			Given.iStartTheListReport();

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible();

			Then.onTheListReportPage
				.theEntitySetOfTheTableIsCorrect(1);
		});

		opaTest("Filtering for Product = 'HT-1003'", function (Given, When, Then) {
			var iTabIndex = 1,
				sProduct = "Product",
				sValue = "HT-1003",
				iExpectedItems = 11;

			// actions
			When.onTheGenericListReport
				.iSetTheFilter({Field: sProduct,  Value: sValue})
				.and
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();

			// assertions
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(iExpectedItems, iTabIndex);

			Then.onTheListReportPage
				.theResultListFieldHasTheCorrectValue(iTabIndex, {Line: 1, Field: sProduct, Value: sValue});

			Then.onTheGenericListReport
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(2, 2)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(3, 1)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);
		});

		opaTest("Switching to Tab 2", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");

			Then.onTheGenericListReport
				.theResultListIsVisible();

			Then.onTheListReportPage
				.theEntitySetOfTheTableIsCorrect(2);

		});

		opaTest("Filtering for Product = 'HT-1007'", function (Given, When, Then) {
			var iTabIndex = 2,
				sProduct = "Product",
				sValue = "HT-1007",
				iExpectedItems = 2;

			// actions
			When.onTheGenericListReport
				.iSetTheFilter({Field: sProduct,  Value: sValue})
				.and
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();

			// assertions
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(iExpectedItems, iTabIndex);

			Then.onTheListReportPage
				.theResultListFieldHasTheCorrectValue(iTabIndex, {Line: 1, Field: sProduct, Value: sValue});

			Then.onTheGenericListReport
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 0)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(3, 1)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);
		});

		opaTest("Switching to Tab 3", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickOnIconTabFilter("3");

			Then.onTheListReportPage
				.theResultChartIsVisible();

			Then.onTheListReportPage
				.theEntitySetOfTheChartIsCorrect(3);

			Then.onTheListReportPage
				.theCustomDataIsSetForChart();
		});

		opaTest("Filtering for CurrencyCode = 'EUR'", function (Given, When, Then) {
			var iTabIndex = 3,
				sCurrencyCode = "CurrencyCode",
				sValue = "EUR",
				iExpectedItems = 6;

			// actions
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product",  Value: ""})
				.and
				.iSetTheFilter({Field: sCurrencyCode,  Value: sValue})
				.and
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage
				.theResultChartIsVisible();

			Then.onTheGenericListReport
				.theCountInTheIconTabBarHasTheCorrectValue(iTabIndex, iExpectedItems)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(1, 11)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(2, 11)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(4, 10)
				.and
				.theCountInTheIconTabBarHasTheCorrectValue(5, 10);
		});

		opaTest("Switching to Tab 4", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickOnIconTabFilter("4");

			Then.onTheGenericListReport
				.theResultListIsVisible();

			Then.onTheListReportPage
				.theEntitySetOfTheTableIsCorrect(4)
				.and
				.theUnAppliedFilterMessageIsVisible()
				.and
				.theMessageStripHasCorrectMessage("The filter \"ISO Currency Code\" is not relevant for the tab \"Sales Order Items SL\". Setting this filter has no effect on the results.");

		});

		opaTest("Switching to Tab 5", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickOnIconTabFilter("5");

			Then.onTheListReportPage
				.theResultChartIsVisible();

			Then.onTheListReportPage
				.theEntitySetOfTheChartIsCorrect(5)
				.and
				.theUnAppliedFilterMessageIsVisible()
				.and
				.theMessageStripHasCorrectMessage("The filter \"ISO Currency Code\" is not relevant for the tab \"Sales Order Items SL Chart\". Setting this filter has no effect on the results.");
		});

		opaTest("Switching back to Tab 1 and clear filters", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickOnIconTabFilter("1")
				.and
				.iSetTheFilter({Field: "CurrencyCode",  Value: ""})
				.and
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(11, 1);
		});

		opaTest("Set filter LifecycleStatus and load data", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickTheMultiComboBoxArrow("LifecycleStatus")
				.and
				.iSelectItemsFromMultiComboBox("LifecycleStatus", "Closed")
				.and
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(1, 1)
				.and
				.iTeardownMyApp();
		});

		var oManifestJSONModel = OpaManifest.demokit["sample.stta.sales.order.multi.entitysets"];
		var oGenericApp = oManifestJSONModel.getProperty("/sap.ui.generic.app");
		var bShowDraftToggle = oGenericApp.settings.showDraftToggle;
		if (bShowDraftToggle) {
			QUnit.module("Show Active Items Only");

			opaTest("Check for 'Show Active Items Only' Button on the List Report", function (Given, When, Then) {
				Given.iStartTheListReport();

				When.onTheGenericListReport
					.iExecuteTheSearch();

				Then.onTheListReportPage
					.theEntitySetOfTheTableIsCorrect(1);

			});

			opaTest("Switching to Tab 2", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iClickOnIconTabFilter("2");

				Then.onTheGenericListReport
					.theResultListIsVisible();

				Then.onTheListReportPage
					.theActiveButtonHasCorrectLabel("Hide Draft Values", 2);
			});

			opaTest("Switch to Active only state in Tab 2", function (Given, When, Then) {
				When.onTheListReportPage
					.iClickTheActiveButton(2);

				Then.onTheGenericListReport
					.theResultListIsVisible();

				Then.onTheListReportPage
					.theActiveButtonHasCorrectLabel("Show Draft Values", 2);

			});

			opaTest("Switching to Tab 1", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iClickOnIconTabFilter("1");

				Then.onTheGenericListReport
					.theResultListIsVisible();

				Then.onTheListReportPage
					.theActiveButtonHasCorrectLabel("Hide Draft Values", 1);
				Then.onTheGenericListReport
					.iTeardownMyApp();
			});
		}
	}
);
