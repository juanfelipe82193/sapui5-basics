sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Flexible Column Layout Mid Column FullScreen Navigation");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport({
				manifest: "MidColumnFullScreen"
			});

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();

			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000012"});

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000012")
				.and
				.iShouldSeeTheSections(["Sales Order Items","ProductTableReuse"])
				.and
				.iShouldSeeTheButtonWithId("exitFullScreen");
		});
		
		opaTest("Verify sap.m.Select Control when number of quickVariantSelection is more than 3", function (Given, When, Then) {
			When.onTheObjectPage
				.iLookAtTheScreen();
			Then.onTheObjectPage
				.iShouldSeeSelectControlHavingSelectedItem("Greater than 3000 and Less than 5000 (2)")
				.and
				.iShouldSeeCorrectValuesRenderedInTableAfterQuickVariantSelectionApplied(0,3,"3,998.00 ");
		});
		
		opaTest("Verify sap.m.Select Control when number of quickVariantSelection is more than 3 and selected Item Changed", function (Given, When, Then) {
			When.onTheObjectPage
				.iChangeTheSelectedItemInSelectControl("_tab5");
			Then.onTheObjectPage
				.iShouldSeeSelectControlHavingSelectedItem("Net Amount greater than  1000 and Tax Amount less than equal to 600 (3)")
				.and
				.iShouldSeeCorrectValuesRenderedInTableAfterQuickVariantSelectionApplied(0,2,"3,736.60 ")
				.and
				.iShouldSeeCorrectValuesRenderedInTableAfterQuickVariantSelectionApplied(0,3,"3,140.00 ");
		});

		opaTest("Minimize the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("exitFullScreen");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("fullScreen")
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Expand the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");
		});

		opaTest("Collapse the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Navigate to items Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"30"});

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"])
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");
		});

		opaTest("Expand the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-left");
		});

		opaTest("Collapse the Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://slim-arrow-left");

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right");

			Then.onTheListReportPage.iTeardownMyApp();
		});
	}
);
