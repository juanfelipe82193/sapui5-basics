/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - Regression Test 2 - Journey");
	// Add all the relative tests in SanityJourney.js
	
	// opaTest("With mandatory filter with no default value", function(Given, When, Then) {
	   //opa test to check if the table is in condensed mode.
	   opaTest("Check for condensed mode",function(Given,When,Then){
	 		Given.iStartMyApp();
		    Then.onTheVisualFilterDialog.iCheckDialogTitle("Adapt Filters", "Compact");
		    When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		    When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		    // Assertions
		    Then.onTheTable.iShouldSeeTheComponent("condensed mode", "sap.ui.comp.smarttable.SmartTable", {styleClass: "sapUiSizeCondensed"},undefined,"analytics2","sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage","ZCOSTCENTERCOSTSQUERY0020");
	});
	
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
    //opa to check if the table is in compact mode.
	opaTest("Check for compact mode",function(Given,When,Then){
		Given.iStartMyAppWithSettings();
		// Assertions
		Then.onTheTable.iShouldSeeTheComponent("compact mode", "sap.ui.comp.smarttable.SmartTable", {styleClass: "sapUiSizeCompact"},undefined,"analytics3","sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage","ZCOSTCENTERCOSTSQUERY0020");
	});

   opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
	
});
