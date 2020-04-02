sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - List Report");

		opaTest("#1: Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReportIfNeeded();

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line:2, Field:"TaxAmount", Value:"899.08"})
				.and
				.theResultListFieldHasTheCorrectValue({Line:11, Field:"CurrencyCode", Value:"USD"});

			Then.onTheListReportPage
				.iShouldSeeTheCorrectTextForISOCurrencyCode(11, "United States Dollar (USD)");
		});

		opaTest("#2: Parameter-Dialog - Select a draft item and press the action", function (Given, When, Then) {

			// actions
			When.onTheListReportPage
				.iSelectAnItemWithDraftStatus("Draft")
				.and
				.iClickTheButtonInTheSmartTableToolbar("Set Opportunity 'ID");

			When.onTheGenericListReport
				.iLookAtTheScreen();

			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
		});

		opaTest("#3: Parameter-Dialog - Wait for the dialog and press the cancel button", function (Given, When, Then) {

			// actions
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("Cancel");

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);

		});

		opaTest("#4: ApplicablePath - Select 3rd sales order and check button enablement", function (Given, When, Then) {

			// actions
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([2]);

			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:2, Field:"EnabledStatus", Value:false})
				.and
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setenabledstatus")
				.and
				.theOverflowToolBarButtonIsEnabled("Disable", false);
		});

		opaTest("#5: ApplicablePath - Press Enable and check buttons and field", function (Given, When, Then) {

			// actions
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setenabledstatus");

			Then.onTheGenericListReport
				.theResultListFieldHasTheCorrectValue({Line:2, Field:"EnabledStatus", Value:true})
				.and
				.theOverflowToolBarButtonIsEnabled("Enable", false)
				.and
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setdisabledstatus");
		});

		QUnit.module("Sales Order No Extensions - List Report: Context Independent Action WITH NO selection");

		opaTest("Button is enabled without selection", function (Given, When, Then) {
			Given.iStartTheListReportIfNeeded();

			Then.onTheGenericListReport
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple")
		});

		opaTest("Context independent action is triggered without selection", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple");

			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Context independent determining action is triggered without selection", function (Given, When, Then) {
			// close popup first
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");

			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple::Determining");

			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Close dialog", function (Given, When, Then) {
			// close popup
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
		});

		QUnit.module("Sales Order No Extensions - List Report: Context Independent Action WITH selection");

		opaTest("Press Go button, select an item, then check if button is enabled", function (Given, When, Then) {
			Given.iStartTheListReportIfNeeded();

			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iSelectListItemsByLineNo(1);

			Then.onTheGenericListReport
				.theButtonWithIdIsEnabled("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple")
		});

		opaTest("Context independent action is triggered", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple");

			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Context independent determining action is triggered", function (Given, When, Then) {
			// close popup first
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");

			When.onTheGenericListReport
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Create_simple::Determining");

			Then.onTheGenericListReport
				.iShouldSeeTheDialogWithTitle("C_STTA_SalesOrder_WD_20");
		});

		opaTest("Close dialog", function (Given, When, Then) {
			// close popup
			When.onTheGenericListReport
				.iClickTheButtonOnTheDialog("OK");
		});

		QUnit.module("Sales Order No Extensions - List Report: Smart Variant");

		opaTest("#10: Smart Variant - rendering on start-up", function (Given, When, Then) {
			Given.iStartTheListReportIfNeeded();

			// actions
			When.onTheGenericListReport
				.iLookAtTheScreen();

			Then.onTheListReportPage
			.theSmartVariantManagementIsRendered()
			.and
			.theCorrectSmartVariantIsSelected("Standard");


		});

		opaTest("#11: Smart Variant - Change on applying search", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheSearchField("500000000");

			Then.onTheListReportPage
				.theSmartTableShouldLoadCorrectData("1")
				.and
				.theCorrectSmartVariantIsSelected("Standard");
		});

		opaTest("#12: Smart Variant - Creating a new Smart Variant", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnSmartVariantManagementSelection();

			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save As");

			When.onTheListReportPage
				.iNameTheVariantWhileSaving("Test");

			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Save");

			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test");
		});

		opaTest("#13: Smart Variant - Check Table data when New Smart Variant is selected", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Go");

			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Test")
				.and
				.theSmartTableShouldLoadCorrectData("1");
		});

		opaTest("#14: Smart Variant - Switch Smart Variant back to standard and check table data", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnSmartVariantManagementSelection()
				.and
				.iSelectTheVariantFromMyViews("Standard");

			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Go");

			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard")
				.and
				.theSmartTableShouldLoadCorrectData("20");
		});

		opaTest("#15: Smart Variant - Delete created variant and check table data", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickOnSmartVariantManagementSelection();

			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Manage")
				.and
				.iClickTheButtonWithIcon("sap-icon://sys-cancel")
				.and
				.iClickTheButtonHavingLabel("OK");

			Then.onTheListReportPage
				.theCorrectSmartVariantIsSelected("Standard")
				.and
				.theSmartTableShouldLoadCorrectData("20");
		});


		QUnit.module("Sales Order No Extensions - List Report: Grouping");

		opaTest("#16: List Report Table Group By 'Sales Order Id'", function (Given, When, Then) {
			Given.iStartTheListReportIfNeeded();

			// actions
			When.onTheGenericListReport
				.iClickTheOverflowToolbarButton("Settings")
				.and
				.iClickTheButtonHavingLabel("Group")
				.and
				.iChoosetheItemInComboBox("Sales Order ID")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.theGroupHeaderListItemIsDisplayed("Sales Order ID: 500000000")
				.and
				.theColumnListItemInTableIsDisplayed("500000000");

		});

		opaTest("#17: List Report Table Group By 'Created At'", function (Given, When, Then) {

			// actions
			When.onTheGenericListReport
				.iClickTheOverflowToolbarButton("Settings")
				.and
				.iClickTheButtonHavingLabel("Group")
				.and
				.iChoosetheItemInComboBox("Created At")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.theGroupHeaderListItemIsDisplayed("Created At: Jan 27, 2017, 12:00:00 AM");

		});

		opaTest("#18: List Report Table Group By '(None)'", function (Given, When, Then) {

			// actions
			When.onTheGenericListReport
				.iClickTheOverflowToolbarButton("Settings")
				.and
				.iClickTheButtonHavingLabel("Group")
				.and
				.iChoosetheItemInComboBox("(none)")
				.and
				.iClickTheButtonHavingLabel("OK")
				.and
				.iExecuteTheSearch();

			Then.onTheListReportPage
				.theSalesOrdersAreLoadedInTheSmartTable()
				.and
				.theColumnListItemInTableIsDisplayed("500000000");
		});


		QUnit.module("Sales Order No Extensions - List Report: Teardown");

		opaTest("Teardown ", function (Given, When, Then) {
			Given.iStartTheListReportIfNeeded();

			When.onTheGenericListReport
				.iLookAtTheScreen();

			Given.iTeardownMyAppIfNeeded();
			Opa5.assert.expect(0);
		});

	}
);
