/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function () {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - ALPWithParamsJourney");
	/*
		This journey does NOT run on flpSandBox. For navigation related test cases, please add them to
		ALPWithParamsJourneyWithNavigation which runs on flpSandBox.
	*/

	opaTest("Check if the Analytical List Page with Params App without setting display currency in url", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppALPWithParamsWoDisplayCurrency();
		When.onTheMainPage.iClickTheKPI("ActualCosts");
		Then.onTheMainPage.CheckKpiIndicator(0, "Neutral");
	});

	opaTest("Check for Authorization error scenario in kpi tag", function (Given, When, Then) {
		When.onTheMainPage.iCheckForHiddenKPI("ActualCosts3");
	});

	opaTest("Check for technical error condition in KPI", function (Given, When, Then) {
		//OPA to check for Unable to load KPI due to a technical issue condition
		When.onTheMainPage.iClickTheKPI("ActualCosts");
		Then.onTheMainPage.iCheckKpiErrorText("KPI_GENERIC_ERROR_MESSAGE");
		Then.onTheMainPage.CheckKpiIndicator(0, "Neutral");
		When.onTheMainPage.iCloseTheKPIPopover();
	});

	opaTest("Check for mandatory fields missing info message for KPI entityset different than main entityset with matching fields", function (Given, When, Then) {
		//OPA to check for Unable to load KPI due to a technical issue condition
		When.onTheMainPage.iClickTheKPI("NetAmount4");
		Then.onTheMainPage.iCheckKpiErrorText("KPI_INFO_FOR_MISSING_MANDATE_FILTPAR");
		Then.onTheMainPage.CheckKpiIndicator(4, "Neutral");
		When.onTheMainPage.iCloseTheKPIPopover();
		When.onTheMainPage.iPassParameter("P_DisplayCurrency");
	});
	opaTest("Check if values are applied in visual filter via onBeforeRebindVisualFilterExtension", function (Given, When, Then) {
		//OPA to check if the values defined in onBeforeRebindVisualFilterExtension are applied to visual filters
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckValuesFromExtensionAreApplied("CustomerCountry", "Donut");
	});
	opaTest("Check if InvisibleText is present on visual filter on the bar", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(0, "visualFilterBarInvisibleTextCustomerName", "", "")
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(1, "visualFilterBarInvisibleTextCustomer", "", "REQUIRED_VH_FIELDS_OVERLAY_MESSAGE");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(2, "visualFilterBarInvisibleTextCustomerCountry", "", "");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(3, "visualFilterBarInvisibleTextCustomerCountryName", "", "MULTIPLE_CURRENCY_OVERLAY_MESSAGE");
	});
	opaTest("Check if InvisibleText is present on visual filter on the dialog", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCustomerName", "")
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCustomer", "");
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCustomerCountry", "");
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCustomerCountryName", "");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	/*TODO: please fix "Cannot read property '' of null"*/

	opaTest("Check if multiple action buttons are rendered in a column", function (Given, When, Then) {
		Then.onTheTable.iSeeMultipleActionsInAColumn();
	});

	opaTest("Check if image control is rendered in a column", function (Given, When, Then) {
		Then.onTheTable.checkControlTypeInColumn("sap.f.Avatar");
	});

	opaTest("Check if chart control is rendered in a column", function (Given, When, Then) {
		Then.onTheTable.checkControlTypeInColumn("sap.ui.comp.smartmicrochart.SmartMicroChart");
	});

	opaTest("Check for no data condition in KPI", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("BK"); //no data filterable scenario
		Then.onTheFilterBar.iCloseTheVHDialog();
		When.onTheMainPage.iClickTheKPI("NetAmount2");
		Then.onTheMainPage.iCheckKpiErrorText("KPI_NO_DATA");
		Then.onTheMainPage.CheckKpiErrorType(3, "Warning");
		When.onTheMainPage.iCloseTheKPIPopover();
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("");
		Then.onTheFilterBar.iCloseTheVHDialog();
	});

	opaTest("Check default values are applied from annotation", function (Given, When, Then) {
		Then.onTheFilterBar.isParameterApplied("$Parameter.P_DisplayCurrency", "USD");
	});

	opaTest("Check VF from different entity set has mandatory filters/parameters set from SV", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iCheckVFMandatoryFilter("CustomerName", "SalesOrder", "Bar", "500000000", false);
	});

	opaTest("Check VF from different entity set has mandatory filters/parameters passed from IN param", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("SalesOrder", "500000012");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iCheckVFMandatoryFilter("CustomerName", "SalesOrder", "Bar", "500000012", false);
	});

	opaTest("Check overlay is displayed for VF having mandatory filters/parameters not set ", function (Given, When, Then) {
		Then.onTheFilterBar.iCheckOverlay(true, "REQUIRED_VH_FIELDS_OVERLAY_MESSAGE", 1);
		Then.onTheMainPage.iCheckVisualFilterVHButtonDisabled(false, "Quantity by Customer");
		Given.onTheFilterBar.iClickTheFilterButton();
		Then.onTheMainPage.iCheckVisualFilterVHButtonDisabled(true, "Quantity by Customer");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
	});

	opaTest("Check Selection Variant in VF", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		//CustomerCountry has SV -> CustomerCountry="AR"
		When.onTheFilterBar.iCheckVFWithSelectionVariant("Donut", "AR", "CustomerCountry");
		//CustomerCountryName has SV -> CustomerCountry="BR"
		When.onTheFilterBar.iCheckVFWithSelectionVariant("Bar", "Argentina", "CustomerCountryName");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");

		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("BR"); //no data filterable scenario
		Then.onTheFilterBar.iCloseTheVHDialog();

		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		// Given.onTheVisualFilterDialog.iClickDialogButton("Cancel","SmartFilterBar-btnCancelFilterDialog", "sample.analytical.list.page.with.params", "ZEPM_C_SALESORDERITEMQUERYResults");
		When.onTheFilterBar.iCheckVFWithSelectionVariant("Donut", "AR", "CustomerCountry");
		//Adding Customer Country = BR changes chart visualization for CustomerCountryName
		When.onTheFilterBar.iCheckVFWithSelectionVariant("Bar", "Brazil", "CustomerCountryName");
		//Adding Customer Country = BR shows up in valehelp but does not change chart visualization for CustomerCountry
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Customer Country");
		When.onTheFilterBar.iCheckForValuehelp("sap-icon://value-help", "CustomerCountry");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["=BR"]);
		Then.onTheFilterBar.iCloseTheVHDialog();
	});

	opaTest("Check for mandatory fields missing error for KPI entityset different than main entityset with no matching fields", function (Given, When, Then) {
		//OPA to check for Unable to load KPI due to a technical issue condition
		When.onTheMainPage.iClickTheKPI("NetAmount6");
		Then.onTheMainPage.iCheckKpiErrorText("REQUIRED_VH_FIELDS_OVERLAY_MESSAGE");
		When.onTheMainPage.iCloseTheKPIPopover();
	});

	opaTest("Check  KPI entityset diffrent than main entityset is showing value with CustomerCountry change", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("BR"); //no data filterable scenario
		Then.onTheFilterBar.iCloseTheVHDialog();
		When.onTheMainPage.iClickTheKPI("NetAmount4");
		Then.onTheMainPage.iCheckKpiValue("NetAmount4", "2.9M");
		Then.onTheMainPage.iCheckKpiScaleFactor("NetAmount2", "M");
		Then.onTheMainPage.iCheckNumberofFractionalDigit("NetAmount2", 1);
	});

	//To the check the different table type
	opaTest("Check if the table is Responsive Table", function (Given, When, Then) {
		// Assertions
		Then.onTheTable.checkTableType("ResponsiveTable", "sap.m.Table");
		//To-Do : Need to find a optimal way to check other tables(currently, Grid or Responsive) is not loaded.
		//If we just put a negative condition i.e add two more conditions it delays the OPA excutions time.
	});
	opaTest("Check if the Analytical List Page With Params App have Interactive Charts", function (Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheFilterBar.iCheckPresenceOfChart();
	});

	opaTest("Check for selection column", function (Given, when, Then) {
		Then.onTheMainPage.checkSelectionColumn();
	});

	//This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function (Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
});
