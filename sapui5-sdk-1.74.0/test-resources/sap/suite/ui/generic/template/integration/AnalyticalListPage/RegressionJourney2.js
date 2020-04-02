/*global opaTest QUnit */
sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/RegressionJourney"
], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - Regression Test 2 - Journey");
		// Add all the regression test cases related to visual filter dialog (as part of ALP Regression Test Suite Excel)

	opaTest("Value help icon with counter in filter dialog", function(Given, When, Then) {
		Given.iStartMyApp();
		When.onTheMainPage.iShouldSeeTheDialog();
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");


		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "100-1100","CostCenter",false);
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar","Cost Center","VH_SINGLE_SELECTED",1);

		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "300-1000", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "300-1000","CostCenter",false);
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar","Cost Center","VH_MULTI_SELECTED",2);

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");

	});

	opaTest("Filter Dialog - Select/Unselect one chart",function(Given,When,Then){

		Then.onTheMainPage.iCheckVisualFilterCharts(2);
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");

		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(false,0);
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBoxState(false,0);

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheMainPage.iCheckVisualFilterCharts(1);

		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(true,0);
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBoxState(true,0);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheMainPage.iCheckVisualFilterCharts(2);


	});

	opaTest("Filter Dialog - Select/Unselect all charts",function(Given,When,Then){

		/* Disabling all charts in VFD */
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(false,0);
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBoxState(false,0);
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(false,1);
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBoxState(false,1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheMainPage.iCheckVisualFilterCharts(0);

		/* Enabling all charts in VFD */
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(true,0);
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBoxState(true,0);
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(true,1);
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBoxState(true,1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheMainPage.iCheckVisualFilterCharts(2);

	});

	opaTest("Visual Filter Dialog Chart Sort Options",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", true, "CostCenter");
		Then.onTheVisualFilterDialog.iCheckVFChartSelected("Bar", "100-1100","CostCenter",false,true);

		Then.onTheVisualFilterDialog.iCheckVHTooltip("Line","Cost Element","VH_SINGLE_SELECTED",1);

		When.onTheVisualFilterDialog.iClickToolbarButton("Sort Order",0);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Line","Cost Element","VH_SINGLE_SELECTED",1);
		When.onTheVisualFilterDialog.iClickToolbarButton("Sort Order",0);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);

		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Line", "400021", false, "CostElement");

		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Display Currency", "USD");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");

		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar","Cost Center","VH_SINGLE_SELECTED",1);

		When.onTheVisualFilterDialog.iClickToolbarButton("Sort Order",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar","Cost Center","VH_SINGLE_SELECTED",1);

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");

	});

	opaTest("Visual Filter Dialog - Chart Type Options",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Display Currency", "USD");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");

		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostCenter");

		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Line","CostCenter");

		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Bar","CostCenter");

	});

	opaTest("Go, Clear, Save Restore, Cancel buttons Testing",function(Given,When,Then){
		/* Go, and Cancel button already covered previously */
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Restore");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
	});

	opaTest("Restore Button - Normal Condition(with compact filter selection)",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		When.onTheFilterBar.iFilterBarFilter("CostCenter","100-1100");
		When.onTheMainPage.iClickTheSegmentedButton("visual");

		When.onTheFilterBar.iClickGoButton();
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);

		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "300-1000", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "300-1000","CostCenter",false);

		When.onTheFilterBar.iClickGoButton();
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 2);

		When.onTheFilterBar.iClickTheFilterButton();

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Restore");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 9);

	});

	opaTest("Charts having decimal point = 0 and changing chart types",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();

		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Display Currency", "USD");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");

		When.onTheFilterBar.iCountVFDecimalPrecision("Bar",0,true);

		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostCenter");
		When.onTheFilterBar.iCountVFDecimalPrecision("Donut",0,true);

		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Line","CostCenter");
		When.onTheFilterBar.iCountVFDecimalPrecision("Line",0,true);

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Restore");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

	});

	opaTest("Display of value help in VFD with selection counter",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iCheckForValuehelp("CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");

		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", true, "CostCenter");
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar","Cost Center","VH_SINGLE_SELECTED",1);

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Restore");

		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");


		//When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");

	});

	opaTest("Filters sync between cfd and vfd",function(Givne,When,Then){

		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", true, "CostCenter");

		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");

		When.onTheVisualFilterDialog.iRemoveFilterValueInCompactDialog("4");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Center", "100-1100");
		Then.onTheVisualFilterDialog.isFiltersAppliedInDialog("CostCenter","100-1100",false);
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
		Then.onTheVisualFilterDialog.iCheckVFChartSelected("Bar", "100-1100","CostCenter",false,true);
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Bar", "100-1100", true, "CostCenter");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		Then.onTheVisualFilterDialog.isFiltersAppliedInDialog("CostCenter","",true);



	});

	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});


});
