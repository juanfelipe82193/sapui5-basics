sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - Canvas Page");

		opaTest("Starting the app, navigating to the Canvas Page and calling Extension API refreshAncestor()", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport("manifestWithCanvas");

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field: "SalesOrder", Value: "500000000"});
			When.onTheObjectPage
				.iShouldChangeTheInputText();
			When.onTheObjectPage
				.iClickTheButtonInCanvas("RefreshAncestor");

			Then.onTheObjectPage
				.iShouldSeeRefreshedContextPath();
		});

		opaTest("Use Canvas Page Extension API onCustomStateChange()", function (Given, When, Then) {

			When.onTheObjectPage
				.iClickTheItemTabFilterInCanvas("Details");
			When.onTheObjectPage
				.iClickTheButtonInCanvas("Save Icon Tab Bar State");
			When.onTheObjectPage
				.iClickTheItemTabFilterInCanvas("Info");
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field: "SalesOrder", Value: "500000002"});

			Then.onTheObjectPage
			.iShouldSeeIconTabFilter("Details");

			Then.onTheGenericListReport
				.iTeardownMyApp();
        });
	}
);
