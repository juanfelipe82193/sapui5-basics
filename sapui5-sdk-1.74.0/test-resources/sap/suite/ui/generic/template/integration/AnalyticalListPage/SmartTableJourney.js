/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - SmartTableJourney");

	opaTest("Check if the table have all the defined buttons", function(Given, When, Then) {
		Given.iStartMyApp();
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheVisualFilterDialog.iClickDialogButton("Go","SmartFilterBar-btnGoFilterDialog", "analytics2");
		//Assertions
		Then.onTheTable.checkActionButton("Standard");
		Then.onTheTable.checkAbsenceOfActionButton("Standard", "chart", true);
		//initially RequiresSelection button is disabled
		Then.onTheTable.checkActionButton("Requires Selection", false);
		Then.onTheTable.checkAbsenceOfActionButton("Requires Selection", "chart");
		Then.onTheTable.checkActionButton("Common");
		Then.onTheTable.checkAbsenceOfActionButton("Common", "chart");
		Then.onTheTable.checkActionButton("Table Only");
		Then.onTheTable.checkAbsenceOfActionButton("Table Only", "chart");
	});

	//To the check the different table type
	opaTest("Check if the table is AnalyticalTable",function(Given,When,Then){
		// Assertions
		Then.onTheTable.checkTableType("AnalyticalTable", "sap.ui.table.AnalyticalTable");
		//To-Do : Need to find a optimal way to check other tables(currently, Grid or Responsive) is not loaded.
		//If we just put a negative condition i.e add two more conditions it delays the OPA excutions time.
	});

	opaTest("Check if the table have defined extended column",function(Given,When,Then){
		// Assertions
		Then.onTheTable.iShouldSeeTheComponent("extended column", "sap.ui.table.AnalyticalColumn", {id: "extCol"},undefined,"analytics2","sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage","ZCOSTCENTERCOSTSQUERY0020");
	});

	opaTest("Check if Both Rating and Progress Indicator are shown in one column",function(Given,When,Then){
		// Assertions
		Then.onTheTable.checkIndicatorControlsInACol("VisualizationGroup");
	});

	opaTest("Check for condensed mode",function(Given,When,Then){
		// Assertions
		Then.onTheTable.iShouldSeeTheComponent("check condensed mode", "sap.ui.comp.smarttable.SmartTable", {styleClass: "sapUiSizeCondensed"},undefined,"analytics2","sap.suite.ui.generic.template.AnalyticalListPage.view.AnalyticalListPage","ZCOSTCENTERCOSTSQUERY0020");
	});
	opaTest("Check table grouping before chart selection", function(Given, When, Then) {
		Then.onTheTable.iCheckGroupHeaderOnTable();
	});
	opaTest("Add filters to CostElement and prepare for chart selection", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Given.onTheFilterBar.iCheckForValuehelp("sap-icon://value-help", "CostElement");
		When.onTheFilterBar.iClickGoButton(true);
		//arrangement: wait till items are loaded in the items table in vhd
		Given.onTheFilterBar.iSearchForItemsTable();
		Given.onTheFilterBar.iMakeSelection(1, "/ZCOSTCENTERCOSTSQUERY0020('0020')");
		//once loaded, make selection.
		Given.onTheFilterBar.iMakeSelection(12, "/ZCOSTCENTERCOSTSQUERY0020('0021')");
		//Assertions: Close the dialog and check selected link
		Then.onTheFilterBar.iCloseTheVHDialog();
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iClickGoButton();
	});
	// opaTest("check for eye icon tests here", function(Given, When, Then) {
	// 	When.onTheChart.iSelectChart("CostElement", "400020");
	// 	Then.onTheMainPage.checkTableRowCount(9);
	// 	When.onTheMainPage.iClickTheSegmentedButton("highlight");
	// 	Then.onTheMainPage.checkTableRowCount(18);
	// });

	opaTest("Check row actions", function(Given, When, Then) {
		// actions
		//	When.onTheMainPage.iClickGoButton();
		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("rowActions", "sap.ui.table.RowAction");
	});


	

	opaTest("Check enablement of RequiresSelection breakout action button", function(Given, When, Then) {
		When.onTheTable.iSelectARow();
		Then.onTheTable.checkActionButton("Requires Selection", true);
	});

	opaTest("Apply AnalyticalTable Column Filter", function(Given, When, Then) {
		// actions
		When.onTheTable.iClickOnColumnHeader("DisplayCurrency")
		    .and
		    .iSelectColumnMenuItem("DisplayCurrency", "Filter...")
		    .and
		    .iEnterFilterValue("EUR");
		// Assertions
		Then.onTheFilterBar.iCloseTheVHDialog();
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 18);
	});

	
	opaTest("Check quick view Contact card", function(Given, When, Then) {
		When.onTheTable.iClickOnLineItemWithSmartLink("OXFORD");
		Then.onTheTable.iShouldSeeTheComponent("ContactCard", "sap.m.Popover");
		Then.onTheTable.checkQuickViewCard(["CONTACT_EMAIL", "CONTACT_PHONE" , "CONTACT_FAX"]);
		//close the popover
		When.onTheMainPage.iClickFilterBarHeader();
	 });
	
	//This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
});
