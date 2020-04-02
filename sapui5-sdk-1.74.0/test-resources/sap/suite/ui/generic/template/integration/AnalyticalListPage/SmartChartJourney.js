/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - SmartChartJourney");

	opaTest("Check if the Chart have all the defined buttons", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheVisualFilterDialog.iClickDialogButton("Go","SmartFilterBar-btnGoFilterDialog", "analytics2");
	});
	
	
	// opaTest("Chart selection", function(Given, When, Then) {
	// 	// actions
	// 	When.onTheChart.iSelectChart("CostElement", "400020");

	// 	// Assertions
	// 	Then.onTheMainPage.checkTableRowCount(9);
	// });
	// opaTest("Action Buttons", function(Given, When, Then) {
	// 	//Function call for chartOnly Action button to check if the button appears as given in the manifest
	// 	Then.onTheChart.checkChartActionButton("Chart Only");
	// 	Then.onTheTable.checkAbsenceOfActionButton("Chart Only", "table");
	// 	Then.onTheChart.checkChartActionButton("Chart Action");
	// 	Then.onTheTable.checkAbsenceOfActionButton("Chart Action", "table");
	// 	Then.onTheChart.checkChartActionButton("NavToLR");
	// 	Then.onTheTable.checkAbsenceOfActionButton("NavToLR", "table");
	// });
	opaTest("Check for hidden filters", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheMainPage.iAppylHiddenFilterToFilterBar("multiple", "Customer", "C000001");
		When.onTheFilterBar.iClickGoButton();
	});
	// This should be the last test case to execute, hence written here
	opaTest("OPA for checking direct navigation", function(Given, When, Then) {
		Then.iTeardownMyApp()
		Given.iStartMyAppALPWithDirectNavigation();
		Then.onTheMainPage.iShouldSeeObjectPageHeader();
	});
	//This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
});
