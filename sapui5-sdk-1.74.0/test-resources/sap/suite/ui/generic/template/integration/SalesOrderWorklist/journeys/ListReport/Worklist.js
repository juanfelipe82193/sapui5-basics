sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/SalesOrderWorklist/utils/OpaManifest"],
	function (opaTest,OpaManifest) {
		"use strict";

		QUnit.module("Sales Order Worklist");

		var oManifestJSONModel = OpaManifest.demokit["sample.stta.sales.order.worklist"];
		var oGenericApp = oManifestJSONModel.getProperty("/sap.ui.generic.app").pages["ListReport|C_STTA_SalesOrder_WD_20"];
		var bSmartVariantManagement = oGenericApp.component.settings.smartVariantManagement;
		var bEnableTableFilterInPageVariant = oGenericApp.component.settings.enableTableFilterInPageVariant;

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();

			// actions
			When.onTheGenericListReport
				.iLookAtTheScreen();

			Then.onTheGenericListReport
				.theResultListIsVisible();

			Then.onTheListReportPage
				.theSalesOrdersAreLoadedInTheSmartTable();
		});

		opaTest("Searching for SalesOrder '500000003' in the Search Field should return 1 items", function (Given, When, Then) {
			// actions
			When.onTheListReportPage
				.iSetTheSearchField("500000003");

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(1);
		});

		opaTest("The Search with no Filter displays all items", function (Given, When, Then) {

			// actions
			When.onTheListReportPage.iSetTheSearchField("");

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(11);
		});

		opaTest("Check for personalisation buttons", function(Given, When, Then) {
			When.onTheListReportPage.iLookAtTheScreen();
			// assertions
			Then.onTheListReportPage
				.theSmartTableHasASortButton()
				.and
				.theSmartTableHasAColumnSettingButton()
				.and
				.theSmartTableHasAGroupButton();
			if (!bSmartVariantManagement || (bSmartVariantManagement && bEnableTableFilterInPageVariant)) {
				Then.onTheListReportPage.theSmartTableHasAFilterButton();
			}
		});

		opaTest("Check Sort Popup Dialog Comes Up", function(Given, When, Then) {
			// Action
			When.onTheListReportPage.iClickSmartTableSortButton();
			//Assertion
			Then.onTheListReportPage.theSmartTableHasViewSettingsDialogOpen("Define Sorting");

			// Action
			When.onTheListReportPage.iClickOnDialogButton("Cancel");
		});

		opaTest("Check Grouping Popup Dialog Comes Up", function(Given, When, Then) {
			// Action
			When.onTheListReportPage.iClickSmartTableGroupButton();
			//Assertion
			Then.onTheListReportPage.theSmartTableHasViewSettingsDialogOpen("Define Groups");

			// Action
			When.onTheListReportPage.iClickOnDialogButton("Cancel");
		});

		// filter dialog should be available irrespective of smartvariant management in worklist
		opaTest("Check Filter Popup Dialog Comes Up", function(Given, When, Then) {
			// Action
			When.onTheListReportPage.iClickSmartTableFilterButton();
			//Assertion
			Then.onTheListReportPage.theSmartTableHasViewSettingsDialogOpen("Define Filters");

			// Action
			When.onTheListReportPage
				.iClickOnDialogButton("Cancel");
		});

		opaTest("Check Column Settings Popup Dialog Comes Up", function(Given, When, Then) {
			// Action
			When.onTheListReportPage.iClickSmartTableColumnSettingButton();
			//Assertion
			Then.onTheListReportPage.theSmartTableHasViewSettingsDialogOpen("Define Column Properties");

			// Action
			When.onTheListReportPage.iClickOnDialogButton("Cancel");

			Then.onTheListReportPage.iTeardownMyApp();
		});
	}
);
