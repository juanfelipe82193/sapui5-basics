sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Single Select", function (hooks) {

			opaTest("Starting the app (Object Page)", function (Given, When, Then) {
				// arrangements
				Given.iStartTheObjectPage("manifestGridTable");
				// assertions
				Then.onTheObjectPage
					.checkTableType("GridTable");
			});

			opaTest("Select one item and select another one", function (Given, When, Then) {
				// actions
				When.onTheGenericObjectPage
					.iSelectListItemsByLineNo([0], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable")
					.and
					.iSelectListItemsByLineNo([1], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable")
					.and
					.iClickTheButtonWithLabel("Show Selected Count");
				// assertions
				Then.onTheObjectPage
					.theTextInTheMessageBoxIsCorrect("1");
			});

			opaTest("Teardown", function (Given, When, Then) {
				Given.iTeardownMyApp();
				Opa5.assert.expect(0);
			});
		});

		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Multi Select", function (hooks) {

			opaTest("Starting the app (Object Page)", function (Given, When, Then) {
				// arrangements
				Given.iStartTheObjectPage("manifestGridTableMS");
				// assertions
				Then.onTheObjectPage
					.checkTableType("GridTable");
			});

			opaTest("Select one item and select a range of 12", function (Given, When, Then) {
				// actions
				When.onTheGenericObjectPage
					.iSelectListItemsByLineNo([0], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable")
					.and
					.iSelectItemRange("SOITMAGGR::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_ItemAggr--to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable", 1, 12)
					.and
					.iClickTheButtonWithLabel("Show Selected Count");
				// assertions
				Then.onTheObjectPage
					.theTextInTheMessageBoxIsCorrect("13");
			});

			opaTest("Teardown", function (Given, When, Then) {
				Given.iTeardownMyApp();
				Opa5.assert.expect(0);
			});
		});

		QUnit.module("Sales Order Item Aggregation - MultiSelectForGridTable: Multi Select with Limit", function (hooks) {

			opaTest("Starting the app (Object Page)", function (Given, When, Then) {
				// arrangements
				Given.iStartTheObjectPage("manifestGridTableMSL");
				// assertions
				Then.onTheObjectPage
					.checkTableType("GridTable");
			});

			opaTest("Select one item and select another one", function (Given, When, Then) {
				// actions
				When.onTheGenericObjectPage
					.iSelectListItemsByLineNo([0], true, "to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable")
					.and
					.iSelectItemRange("SOITMAGGR::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_ItemAggr--to_ScheduleLine::com.sap.vocabularies.UI.v1.LineItem::gridTable", 1, 12)
					.and
					.iClickTheButtonWithLabel("Show Selected Count");
				// assertions
				Then.onTheObjectPage
					.theTextInTheMessageBoxIsCorrect("11");
			});

			opaTest("Teardown", function (Given, When, Then) {
				Given.iTeardownMyApp();
				Opa5.assert.expect(0);
			});
		});
	}
);
