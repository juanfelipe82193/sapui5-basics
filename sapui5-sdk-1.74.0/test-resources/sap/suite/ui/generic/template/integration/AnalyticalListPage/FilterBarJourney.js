/*global opaTest QUnit */
sap.ui.define([
	"sap/ui/test/opaQunit"
], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - Filter Bar Journey");
	// Add all the relative tests in filterBarExtension.js
	opaTest("Go Button Test", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInIframeWithDim("analytics2", 1000, 500);
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("DisplayCurrency", "USD");
		When.onTheMainPage.iAppylHiddenFilterToFilterBar("multiple", "Customer", "C000001")
		// actions
		Then.onTheFilterBar.checkGoButton();
		When.onTheFilterBar.iFilterBarFilter("CostCenter", "100-1000");
		When.onTheFilterBar.iFilterBarFilter("TotaledProperties", "");
		When.onTheFilterBar.iClickGoButton();
		// Assertions
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);
	});

	/*
	// Visual Filter test cases - STARTS
	*/
	opaTest("Apply filter to visual filter", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheMainPage.iClickTheSegmentedButton("charttable");
		// actions
		// onTheFilterBar.iFilterBarFilter("CostCenter", "100-1000") is already done in previous test,
		// add an extra filter using the VF
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("bar", "100-1100", "CostCenter");
		//collapse FB and check filtered by text
		// When.onTheMainPage.iClickFilterBarHeader();
		// Then.onTheFilterBar.iCheckFilterBarCollapsedText("Filtered By (3): Cost Element, Display Currency, Cost Center");
		// When.onTheMainPage.iClickFilterBarHeader();
		//
		When.onTheFilterBar.iClickGoButton();
		// Assertions
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);
		// See that Bar chart is seen even if chart type in annotation is given as Column
		Then.onTheMainPage.iShouldSeeTheComponent("Bar Chart", "sap.suite.ui.microchart.InteractiveBarChart");
	});

	opaTest("Clear filter in the visual filter via unset", function(Given, When, Then) {
		// actions
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("bar", "100-1100", false, "CostCenter");
		//When.onTheFilterBar.iFilterBarFilter("CostCenter", ""); //Clear compact filter
		When.onTheFilterBar.iClickGoButton();
		// Assertions
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1); //Count is 1 because compact filter is still set
	});
	opaTest("Clear filter in the compact filter via unset", function(Given, When, Then) {
		// actions
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("CostCenter", "");
		When.onTheFilterBar.iClickGoButton();
		// Assertions
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);
	});

	opaTest("VF Title check", function(Given, When, Then) {
		// actions
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheFilterBar.iCheckMandatoryFilter();
		Then.onTheFilterBar.checkVFTitle("ActualCosts", "CostCenter", "title", "Actual Costs by Cost Center | USD");
		Then.onTheFilterBar.checkVFTitle("ActualCosts", "CostElement", "title", "Actual Costs by Cost Element | USD");

	});
	opaTest("Number of fractional digits in VF", function(Given, When, Then) {
		// actions
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		When.onTheFilterBar.iCountDecimalPrecision(0);
	});
	opaTest("Check Support of Value help button", function(Given, When, Then) {
		//Arrangement: Check for open dialog
		Given.onTheFilterBar.iCheckForValuehelp("sap-icon://value-help", "CostCenter");
		When.onTheFilterBar.iClickGoButton(true);
		//arrangement: wait till items are loaded in the items table in vhd
		Given.onTheFilterBar.iSearchForItemsTable();
		//once loaded, make selection.
		Given.onTheFilterBar.iMakeSelection(12, "/ZCOSTCENTERCOSTSQUERY0021('0021')");
		//Assertions: Close the dialog and check selected link
		Then.onTheFilterBar.iCloseTheVHDialog();
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Cost Center");
	});
	opaTest("Check tooltip for value help button on the VF bar - VH with selections", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "VH_SINGLE_SELECTED", 1);
	});
	opaTest("Check VF Labels as per Text Arrangement Annotation", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextFirst", false);
	});

	opaTest("VF Tooltip", function(Given, When, Then) {
		Then.onTheFilterBar.checkVFTitle("ActualCosts", "CostCenter", "tooltip", "Actual Costs by Cost Center in USD");
		Then.onTheFilterBar.checkVFTitle("ActualCosts", "CostElement", "tooltip", "Actual Costs by Cost Element in USD");
	});


	opaTest("Check Tooltip of Adapt Filter and Go button in Smart Visual Filter bar",function(Given, When, Then){
		Then.onTheMainPage.iCheckTooltip("Adapt Filter Button", "SmartVisualFilterbar");
		Then.onTheMainPage.iCheckTooltip("Go Button", "SmartVisualFilterbar");

	});

	/*
	// Visual Filter test cases - ENDS
	*/

	/*
	//Compact Filter test cases - STARTS
	*/

	opaTest("Adapt Filters Button Count", function(Given, When, Then) {
		// actions
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("CostCenter", "100-1100");
		When.onTheFilterBar.iClickGoButton();
		// Assertions
		Then.onTheMainPage.iCheckFilterCount("3");
	});


	opaTest("Switch filter mode to Compact Filter and check if Default Values are applied from Annotation", function(Given, When, Then) {
		// actions
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("SmartFilterBarExt", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt");
		Then.onTheFilterBar.iFilterBarFilterIsApplied({"DisplayCurrency": "USD"});
	});

	opaTest("Apply filter to compact filter", function(Given, When, Then) {
		// actions
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("CostCenter", "100-1000");
		When.onTheFilterBar.iClickGoButton();

		// Assertions
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);
	});
	opaTest("Apply URL Parameter to Currency Filter and Check Overlay", function(Given, When, Then) {
		// actions
		//When.onTheMainPage.iClickTheSegmentedButton("compact");
		// Assertions
		Then.onTheFilterBar.iFilterBarFilterIsApplied({"DisplayCurrency": "USD"});
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		//iCheckOverlay
		Then.onTheFilterBar.iCheckOverlay(false, "Refine filter to set single currency.", 1);
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		// actions
		//When.onTheMainPage.iClickTheSegmentedButton("visual");
		//Then.onTheMainPage.iShouldSeeTheComponent("Line Chart", "sap.suite.ui.microchart.InteractiveLineChart");
	});



	/*
	//Compact Filter test cases - ENDS
	*/
});
