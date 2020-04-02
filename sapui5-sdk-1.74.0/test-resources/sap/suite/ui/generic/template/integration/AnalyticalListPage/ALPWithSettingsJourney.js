/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - ALPWithSettingsJourney");

	opaTest("Check if the Analytical List Page with Settings App is up", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppWithSettings();
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CompanyCode", "EASI");
		Then.onTheMainPage.iCheckOverlayForChart(true, "analytics3::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--chart");
		Then.onTheMainPage.iCheckOverlayForTable(true, "analytics3::sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage::ZCOSTCENTERCOSTSQUERY0020--table");

		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		When.onTheFilterBar.iClickGoButton();
		Then.onTheMainPage.iShouldSeeTheComponent("SmartChart", "sap.ui.comp.smartchart.SmartChart");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		//Then.onTheMainPage.iCheckOverlayAnuj(true, "MULTIPLE_CURRENCY_OVERLAY_MESSAGE", 1);

		Then.onTheMainPage.iShouldSeeVariantControls();
	});

	opaTest("Check the Component of CF", function(Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheComponent("SmartFilterBarExt", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt");
	});

	opaTest("Check the Visibility of CF and VF", function(Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheFilterVisibility();
	});

	//To the check the different Responsive table
	opaTest("Check if the table is Analytical Table",function(Given,When,Then){
		// Assertions
		Then.onTheTable.checkTableType("AnalyticalTable", "sap.ui.table.AnalyticalTable");
		//To-Do : Need to find a optimal way to check other tables(currently, Analytical or Responsive) is not loaded.
		//If we just put a negative condition i.e add two more conditions it delays the OPA excutions time.
	});

	//@author: Vignesh
	//To check if showDetails button is present in the smartChart, to have this test enableb
	//We need to open new application with settings.
	opaTest("Check for ShowDetails button", function(Given, When, Then) {
		// actions
		When.onTheMainPage.iClickTheSegmentedButton("chart");

		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("Show Details", "sap.m.SelectionDetails");
	});
	opaTest("Check for absence of Filter Switch Button", function(Given, When, Then) {
		//Assertion
		//Since hideVisualFilter = true, filter switch shouldn't come up
		Then.onTheMainPage.iCheckForFilterSwitch();
	});
	opaTest("Check dialog Cancel button functionality when VF is hidden", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Fiscal Month", "June");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("FiscalMonth", "June");
	});

	//@author: Vignesh
	//To check if inline action button is present in the smartTable
	opaTest("Check for Inline Action button", function(Given, When, Then) {
		// actions
		//Given.iStartMyAppWithSettings();
		When.onTheMainPage.iClickTheSegmentedButton("table");

		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("Inline", "sap.m.Button");
	});

	opaTest("Table Group By 'Company Code Crcy'", function (Given, When, Then) {
		// actions
		When.onTheTable.iClickOnColumnHeader("CompanyCodeCurrency")
		When.onTheTable.iSelectColumnMenuItem("CompanyCodeCurrency", "Group")

		// Assertions
		Then.onTheTable.iCheckGroupHeaderOnTable("CompanyCodeCurrency");
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 5);
	});

	opaTest("Table Ungroup 'Company Code Crcy'", function (Given, When, Then) {
		// actions
		When.onTheTable.iClickOnColumnHeader("CompanyCodeCurrency")
		When.onTheTable.iSelectColumnMenuItem("CompanyCodeCurrency", "Group")

		// Assertions
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 5); // no real check since there is no change
	});

	// FCL is failing in phantomjs, commenting this till we find a workaround.
	opaTest("Check Working of flexible column layout", function(Given, When, Then) {
		Then.onTheFilterBar.checkForSingleShareButton();
		When.onTheFilterBar.iClickGoButton();
		When.onTheMainPage.iClickRowActionDetails();
		Then.onTheFilterBar.checkForSingleShareButton();
		//No need of checking toolbar overflow, checkForSingleShareButton method will take care of that.
		//When.onTheMainPage.iClickCloseFCLButton();
		//Check for single share button after closing fcl
		//Then.onTheFilterBar.checkForSingleShareButton();
	});

	opaTest("Check for table compact mode",function(Given,When,Then){
		// Assertions
		Then.onTheTable.iShouldSeeTheComponent("check table compact mode", "sap.ui.comp.smarttable.SmartTable", {styleClass: "sapUiSizeCompact"});
	});

	opaTest("Check value axis labels", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("chart");
		Then.onTheMainPage.iShouldSeeTheComponent("Actual Cost", "sap.m.Label");
		Then.onTheMainPage.iShouldSeeTheComponent("Margin(%)", "sap.m.Label");
	});
	opaTest("Check for kpi tag indicator for filterable KPIs", function(Given, When, Then) {
		//global kpi
		/*Then.onTheMainPage.CheckKpiIndicator(0,"Good");*/
		//filterable kpi with hardcoded criticality calculation
		Then.onTheMainPage.CheckKpiIndicator(1,"Neutral");
		//filterable kpi with path based criticality calculation
		Then.onTheMainPage.CheckKpiIndicator(2,"Error");
	});
	
	opaTest("Check for default PV mising error scenario in kpi tag", function(Given, When, Then) {
		When.onTheMainPage.iCheckForHiddenKPI("ActualCost");
	});

	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
});