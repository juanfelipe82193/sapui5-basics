sap.ui.define(["sap/ui/test/opaQunit", "sap/f/FlexibleColumnLayout"],
	function (opaTest) {
		"use strict";

		QUnit.module("Flexible Column Layout: LR is not part of the FCL");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport({
				manifest: "FCLObjectPageOnly"
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
				.theFCLHasLayout(sap.f.LayoutType.OneColumn);
		});

		opaTest("Navigate to items Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"20"});

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"])
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right")
				.and
				.theFCLHasLayout(sap.f.LayoutType.TwoColumnsMidExpanded);				
		});

		opaTest("Navigate to schedule lines Sub-Sub-ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_SalesOrderItemSL", {Field:"QuantityUnitCode", Value:"EA"}, "C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Schedule Lines"])
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://slim-arrow-right")
				.and
				.theFCLHasLayout(sap.f.LayoutType.ThreeColumnsEndExpanded);
				
				
			Then.onTheListReportPage.iTeardownMyApp();
		});


	}
);
