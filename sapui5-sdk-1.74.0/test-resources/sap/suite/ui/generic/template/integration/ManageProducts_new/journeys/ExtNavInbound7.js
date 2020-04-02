sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function(opaTest, Opa5) {
		"use strict";

		QUnit.module("External Navigation Inbound 7: Filters");

		opaTest("Check default filter", function (Given, When, Then) {
			Given.iStartTheListReportInFlpSandbox();

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();

			// assertions
			Then.onTheGenericListReport
				.iSeeTheButtonWithLabel("Adapt Filters (1)");
		});

		opaTest("Filter with CustomPriceFilter=500-1000", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: "HT-1000"})
				.and
				.iSetTheFilter({Field: "combobox", Value: 2}) // "CustomPriceFilter-combobox" "Price between 500-1000"
				.and
				.iExecuteTheSearch();

			// assertions
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(1)
				.and
				.theAvailableNumberOfItemsIsCorrect(1)
				.and
				.iSeeTheButtonWithLabel("Adapt Filters (3)");
		});

		opaTest("Navigate external to the ObjectPage via button", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithLabel("Manage Products (ST)"); // HT-1000

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
		});

		opaTest("Navigate back", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();

			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(1);
		});

		opaTest("Expand header: Same filter count", function(Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("template:::ListReportPage:::DynamicPageTitle-expandBtn");

			Then.onTheGenericListReport
				.iSeeTheButtonWithLabel("Adapt Filters (3)");
		});

		opaTest("Remove filters", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iSetTheFilter({Field: "Product", Value: ""})
				.and
				.iSetTheFilter({Field: "combobox", Value: ""}) // "CustomPriceFilter-combobox"
				.and
				.iExecuteTheSearch();

			// assertions
			Then.onTheGenericListReport
				.iSeeTheButtonWithLabel("Adapt Filters (1)");
		});


		QUnit.module("External Navigation Inbound 7: Teardown");

		opaTest("Teardown ", function (Given, When, Then) {

			When.onTheGenericListReport
				.iLookAtTheScreen();

			Given.iTeardownMyApp();
			Opa5.assert.expect(0);
		});

	}
);
