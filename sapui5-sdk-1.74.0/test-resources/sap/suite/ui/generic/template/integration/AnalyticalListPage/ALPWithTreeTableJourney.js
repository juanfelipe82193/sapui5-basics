/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - ALPWithTreeTableJourney");
	opaTest("Check if the Analytical List Page with TreeTable App is up", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppWithTreeTable();
		//Then.onTheMainPage.iShouldSeeTheAdaptFiltersInLivemode();
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
	});
	//To check if tree table is loaded.
	opaTest("Check if the table is Tree Table",function(Given,When,Then){
		// Assertions
		Then.onTheTable.checkTableType("TreeTable", "sap.ui.table.TreeTable");
	});

	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
});
