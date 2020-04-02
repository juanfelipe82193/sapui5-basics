sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - MultiSelectForAnalyticalTable: Single Select", function (hooks) {

			opaTest("Starting the app (Object Page)", function (Given, When, Then) {
				// arrangements
				Given.iStartTheObjectPage("manifestAnalyticalTable");
				// assertions
				Then.onTheObjectPage
					.checkTableType("AnalyticalTable");
			});

			/**
			 * Mock server is currently not capable of requesting data for AnalyticalTable and TreeTable on Object Page.
			 * Once the mock server can do so, OPA tests should be added in a similar way as for grid table (see MultiSelectForGridTable.js)
			 */
			/*
			opaTest("Select one item and select another one", function (Given, When, Then) {
				// actions
				When.onTheGenericObjectPage
					.iSelectListItemsByLineNo([0], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::analyticalTable")
					.and
					.iSelectListItemsByLineNo([1], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::analyticalTable")
					.and
					.iClickTheButtonWithLabel("Show Selected Count");
				// assertions
				Then.onTheObjectPage
					.theTextInTheMessageBoxIsCorrect("1");
			});
			*/

			opaTest("Teardown", function (Given, When, Then) {
				Given.iTeardownMyApp();
				Opa5.assert.expect(0);
			});
		});
	}
);
