/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - ALPWithParamsJourneyWithNavigation");

	opaTest("Check if the Analytical List Page with Params App is up", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppALPWithParams();
		Then.onTheFilterBar.isParameterApplied("$Parameter.P_DisplayCurrency","USD");
		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		When.onTheMainPage.iClickTheSegmentedButton("chart");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartChart", "sap.ui.comp.smartchart.SmartChart");
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		Then.onTheMainPage.iShouldSeeVariantControls();
	});

	opaTest("Check navigation from KPI constructed using UI.KPI", function(Given, When, Then) {
		When.onTheMainPage.iClickFilterBarHeader();
		When.onTheMainPage.iClickTheKPI("ActualCosts2");
		When.onTheMainPage.iClickKPIHeader();
		Then.onTheMainPage.checkAppTitle("Analytical List Page With Settings");
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		Then.onTheMainPage.checkAppTitle("Analytical List Page With Parameter");
	});



     opaTest("Check row actions", function(Given, When, Then) {
		//action
		When.onTheGenericAnalyticalListPage.iNavigateFromListItemByLineNo(0);
		//assertions
        Then.onTheMainPage.checkAppTitle("Error");
        Then.onTheMainPage.iClickBackButtonToNavigateToALP();
        Then.onTheMainPage.checkAppTitle("Analytical List Page With Parameter");
        When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to")
		When.onTheFilterBar.iAddValueInValuehelp("AR");
		Then.onTheFilterBar.iCloseTheVHDialog();
   	});

      opaTest("Check for Navigation from Table Column - DataFieldWithIBN and breakout for modifying Navigation context", function (Given, When, Then) {
		//AssertionsWhen.onTheMainPage.iClickTheSegmentedButton("table");
		When.onTheMainPage.iClickTheSegmentedButton("table");
		When.onTheTable.iSeeColumnWithIBN("Customer Country (IBN)");
		Then.onTheTable.iClickDataFieldWithIBN("AR");
		Then.onTheMainPage.checkAppTitle("Analytical List Page");
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		//Then.onTheVisualFilterDialog.iCheckChartMeasure("Difference");
		Then.onTheVisualFilterDialog.iCheckChartMeasureWithChartType("Difference","Bar");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckVFChartSelected("Line", "400020", "CostElement");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "US01", "ControllingArea");
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostElement", "400020");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("ControllingArea", "US01");
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		Then.onTheMainPage.checkAppTitle("Analytical List Page With Parameter");
	});

	opaTest("To check Save As Tile", function(Given, When, Then) {
		// actions
		When.onTheMainPage.iClickShareIcon();
		When.onTheMainPage.iClickSaveAsTile();
		When.onTheMainPage.iShouldSeeTheBookmarkDialog();
		When.onTheMainPage.iShouldEnterBookmarkDetails("ALP Demo");
		Then.onTheFilterBar.iCloseTheVHDialog();
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		When.onTheMainPage.iClickFLPTile("ALP Demo");
		// Assertions
		Then.onTheMainPage.iCheckFilterCountInOverflowToolbar("2");
	});
	opaTest("Check for Navigation from Sticky Table Toolbar - DataFieldForIBN", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		When.onTheTable.iSelectRowInTable();
		When.onTheTable.iClickTheDataFieldButton("Manage Products (STTA)");
		Then.onTheMainPage.checkAppTitle("Manage Products (Technical Application)");
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		Then.onTheMainPage.checkAppTitle("Analytical List Page With Parameter");
	});
	opaTest("Check for Navigation from Sticky Table Toolbar - Determining DataFieldForIBN", function (Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		When.onTheTable.iSelectRowInTable();
		When.onTheTable.iClickTheDataFieldButton("NavigateToALP");
		Then.onTheMainPage.checkAppTitle("Analytical List Page With Settings");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("WBSElement", "BLUE PRINT VALIDATION");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CompanyCode", "SAP");
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CompanyCode", "EASI");
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		Then.onTheMainPage.checkAppTitle("Analytical List Page With Parameter");
	});
	opaTest("Check KPI Card opening and navigation from KPI Card", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		When.onTheMainPage.iClickTheKPI("ActualCosts2");
		When.onTheMainPage.iSelectKPIChart();
		//P_DisplayCurrency is set USD in manifest, EUR in SV
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("DisplayCurrency", "EUR");
		//set via SV
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CustomerCountry", "AR");
		//chart selection
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CustomerCountryName", "Argentina");
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		//initial state of app
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CustomerCountry", "US");
	});
	opaTest("Check KPI chart selection when KPI card has no target defined", function(Given, When, Then) {
		When.onTheMainPage.iClickTheKPI("NetAmount1");
		When.onTheMainPage.iSelectKPIChart();
		Then.onTheMainPage.iCheckOpenKPICard();
	});
	opaTest("Check DP.IsPotentiallySensitive for KPI Card Header Navigation with main and KPI entityset are same ", function(Given, When, Then) {
		When.onTheFilterBar.iClickInputValuehelp("Product");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("HT-1003"); //no data filterable scenario
		Then.onTheFilterBar.iCloseTheVHDialog();
		When.onTheMainPage.iClickTheKPI("NetAmount2");
		Then.onTheMainPage.checkFiltersInFilterableKpi(["HT-1003", "USD"]);
		When.onTheMainPage.iClickKPIHeader();
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("Product", "HT-1003");
	});
	opaTest("Check DP.IsPotentiallySensitive for KPI Card Header Navigation with main and KPI entityset are different ", function(Given, When, Then) {
		When.onTheFilterBar.iClickInputValuehelp("Product");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("HT-1003"); //no data filterable scenario
		Then.onTheFilterBar.iCloseTheVHDialog();
		When.onTheMainPage.iClickTheKPI("NetAmount4");
		Then.onTheMainPage.checkFiltersInFilterableKpi(["HT-1003"]);
		When.onTheMainPage.iClickKPIHeader();
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("Product", "HT-1003");
	});
	opaTest("Check DP.IsPotentiallySensitive for Global KPI Card Chart Navigation with main and KPI entityset are Same ", function(Given, When, Then) {
		When.onTheMainPage.iClickTheKPI("ActualCosts2");
		When.onTheMainPage.iSelectKPIChart();
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CustomerCountryName", "Argentina");
		Then.onTheMainPage.iClickBackButtonToNavigateToALP();
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("CustomerCountryName", "Argentina");
	});
	//This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
});
