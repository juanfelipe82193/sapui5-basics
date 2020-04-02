/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - Regression Test - Journey");
	// Add all the regression test cases related to visual filters (as part of ALP Regression Test Suite Excel)
	
	opaTest("With mandatory filter with no default value", function(Given, When, Then) {
		Given.iStartMyApp();
		When.onTheMainPage.iShouldSeeTheDialog();
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheMainPage.iCheckDialogIsClosed();


	});

	opaTest("Display of Charts in VF when chart measure has more than 1 UoM",function(Given,When,Then){
		Then.onTheFilterBar.iCheckOverlay(true,"MULTIPLE_CURRENCY_OVERLAY_MESSAGE",2);
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");		
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
		Then.onTheVisualFilterDialog.iCheckForOverlayOnChart(true,"MULTIPLE_CURRENCY_OVERLAY_MESSAGE",1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckOverlayForChart(true,"MULTIPLE_CURRENCY_OVERLAY_MESSAGE",1);


	});

	opaTest("Chart Overlay removal",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "100-1100","CostCenter",false);
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);

		
	});

	opaTest("Check for Visual Filter Chart' Title,Label and value",function(Given,When,Then){

		Then.onTheVisualFilterDialog.iCheckRenderedChart("Bar","CostCenter",false);
		Then.onTheFilterBar.iCheckVFLabelForChart("Bar",false);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheFilterBar.iCheckVFLabelForChart("Bar",true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

	});

	opaTest("Multiple selections across all charts",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "300-1000", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "300-1000", "CostCenter", false);
		
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Line", "400021", false, "CostElement");
		Then.onTheFilterBar.iCheckVFChartSelected("Line", "400021","CostElement",false);
		
		When.onTheFilterBar.iClickGoButton();
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);
		Then.onTheFilterBar.iCheckOverlayForChart(true,"MULTIPLE_CURRENCY_OVERLAY_MESSAGE",2);

	});



	opaTest("De-Selection of selected items in charts",function(When,Given,Then){
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Line", "400021", false, "CostElement");
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,2);
		Then.onTheMainPage.iCheckFilterCount(2);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckOverlay(false,"MULTIPLE_CURRENCY_OVERLAY_MESSAGE",2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,2);
		

	});

	opaTest("De-Selection of Items from CFD",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iRemoveFilterValueInCompactDialog("4");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);
	});
	

	opaTest("Default Sort Order of All Chart Types",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckDefaultSortOrder("Bar",true);
		Then.onTheVisualFilterDialog.iCheckDefaultSortOrder("Line",false);

		When.onTheVisualFilterDialog.iClickChartButton("Chart Type");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostCenter");
		Then.onTheVisualFilterDialog.iCheckDefaultSortOrder("Donut",true);

		When.onTheVisualFilterDialog.iClickChartButton("Chart Type");
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Bar","CostCenter");

		Then.onTheVisualFilterDialog.iCheckDefaultSortOrder("Bar",true);

	});

	opaTest("Change in sort order - Line chart (non time based dimension)",function(Given,When,Then){
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckChartMeasureWithChartType("Difference","Bar");
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Difference by Cost Center | K");

		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Bar","CostCenter");

		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckChartMeasureWithChartType("ActualCosts","Bar");
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Actual Costs by Cost Center | USD");

		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Bar","CostCenter");

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");


	});

	opaTest("Decimal Precision for Visual Filter Charts in VF Bar and VFD",function(Given,When,Then){
		
		When.onTheFilterBar.iCountVFDecimalPrecision("Line",0,false);
		When.onTheFilterBar.iCountVFDecimalPrecision("Bar",0,false);

		When.onTheFilterBar.iClickTheFilterButton();

		When.onTheFilterBar.iCountVFDecimalPrecision("Line",0,true);
		When.onTheFilterBar.iCountVFDecimalPrecision("Bar",0,true);

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

	});

	opaTest("Display of Value Help in Visual Filters",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "300-1000", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "300-1000","CostCenter",false);
		Then.onTheFilterBar.iCheckVHTooltip("Bar","Cost Center","VH_MULTI_SELECTED",2);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar","Cost Center","VH_MULTI_SELECTED",2);
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2,"Cost Center");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Bar", "300-1000", false, "CostCenter");
		When.onTheFilterBar.iClickGoButton();
	});

	opaTest("Tooltip check for donut chart in VF bar",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickChartButton("Chart Type");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckVFLabelAndTooltipChart("Donut","CostCenter","United States Dollar (100-1100)");
	});

	opaTest("Removal of Others selection -Full",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "__IS_OTHER__", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "__IS_OTHER__", "CostCenter");

		When.onTheFilterBar.iCheckForValuehelp("sap-icon://value-help", "CostCenter");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["!(=300-1000)", "!(=100-1100)"]);
		Then.onTheFilterBar.iCloseTheVHDialog();

		When.onTheFilterBar.iClickGoButton();

		Then.onTheMainPage.iCheckFilterCount(2);
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 7);

		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Donut", "__IS_OTHER__", false, "CostCenter");
		// Then.onTheFilterBar.iCheckVHTooltip("Bar","Cost Center","VALUE_HELP",0);

		When.onTheFilterBar.iClickGoButton();

		Then.onTheMainPage.iCheckFilterCount(1);
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 9);
	});


	opaTest("Removal of Others selection -Partial",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "__IS_OTHER__", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "__IS_OTHER__", "CostCenter");

		When.onTheFilterBar.iCheckForValuehelp("sap-icon://value-help", "CostCenter");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["!(=300-1000)", "!(=100-1100)"]);
		Then.onTheFilterBar.iCloseTheVHDialog();

		When.onTheFilterBar.iClickGoButton();

		Then.onTheMainPage.iCheckFilterCount(2);
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 7);

		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "300-1000", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "300-1000", "CostCenter");

		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "300-1000");

		When.onTheMainPage.iClickTheSegmentedButton("visual");

		When.onTheFilterBar.iClickGoButton();

		Then.onTheMainPage.iCheckFilterCount(2);
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);
	});

	opaTest("TextArrangement:TextFirst - All Charts",function(Given,When,Then){
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Line","TextFirst",false);
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Donut","TextFirst",false);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Line","TextFirst",true);
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Donut","TextFirst",true);
		
		When.onTheVisualFilterDialog.iClickChartButton("Chart Type");
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Bar","CostCenter");

		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextFirst",true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextFirst",false);

	});

	opaTest("Others selection - selections apart from others",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickChartButton("Chart Type");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "300-1000", "CostCenter");

		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "__IS_OTHER__", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "__IS_OTHER__", "CostCenter");


		When.onTheFilterBar.iCheckForValuehelp("sap-icon://value-help", "CostCenter");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["!(=300-1000)", "!(=100-1100)"]);
		Then.onTheFilterBar.iCloseTheVHDialog();

	});

	opaTest("Semantic Color-VF Charts",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);
		Then.onTheFilterBar.isChartColored("InteractiveDonutChart", "CostCenter", ["Error","Good","Critical"], false);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheFilterBar.isChartColored("InteractiveDonutChart", "CostCenter", ["Error","Good","Critical"], true);

		When.onTheGenericAnalyticalListPage.iSelectVFChart("Line", "417900", false, "CostElement");
		Then.onTheFilterBar.iCheckVFChartSelected("Line", "417900","CostElement",false);
		Then.onTheFilterBar.isChartColored("InteractiveDonutChart", "CostCenter", ["Good","Error","Critical"], true);

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.isChartColored("InteractiveDonutChart", "CostCenter", ["Good","Error","Good"], false);

		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickChartButton("Chart Type");
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Bar","CostCenter");

		Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Good","Error","Good"], true);
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Line", "417900", true, "CostElement");
		Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Error","Good","Good"], true);

		 When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		 Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Error","Good","Good"], false);

		
	});


	opaTest("Order of visual filters",function(Given,When,Then){
		Then.onTheFilterBar.checkVFSortOrder("Cost Element","Cost Center",false);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheFilterBar.checkVFSortOrder("Cost Element","Cost Center",true);
	});

	opaTest("Close application",function(Given,When,Then){
		Given.iTeardownMyApp();
		expect(0);
	});

	opaTest("Common filterDefaultValue",function(Given,When,Then){
		Given.iStartMyAppWithSettings();
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CompanyCode", "EASI");
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckFilterOnDialog("=EASI");
	 When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

	});

	opaTest("Close application",function(Given,When,Then){
		Given.iTeardownMyApp();
		expect(0);
	});

	opaTest("TextArrangement:TextLast - All Charts",function(Given,When,Then){
		Given.iStartMyAppWithExtensions();
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextLast",false);
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextLast",true);
		
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Bar","CostCenter");
		
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostCenter");
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Donut","TextLast",true);

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Donut","TextLast",false);

		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Line","CostCenter");
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Line","TextLast",true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Line","TextLast",false);

		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",1);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Bar","CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");


	});

	opaTest("Change measure - Line chart -Time based dimension",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();

		When.onTheVisualFilterDialog.iClickToolbarButton("Measure",2);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		Then.onTheVisualFilterDialog.iCheckChartMeasureWithChartType("Difference","Line");
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Difference by Date");

		When.onTheVisualFilterDialog.iClickToolbarButton("Measure",2);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckChartMeasureWithChartType("ActualCosts","Line");

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

		
	});

	opaTest("Header Title of VF bar is shown in new format",function(Given,When,Then){
		Then.onTheVisualFilterDialog.iCheckChartTitle(false, "Actual Costs by Cost Center | K USD");
		When.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Actual Costs by Cost Center | K USD");
		
	});

	opaTest("Ensure OK and  Cancel button show up",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		When.onTheFilterBar.iClickDropDownIcon(true);
		Given.onTheFilterBar.iClickDropdownList(1);

		Then.onTheFilterBar.iShouldSeePopOverBtns("OK");
		Then.onTheFilterBar.iShouldSeePopOverBtns("Cancel");
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheFilterBar.iClickDropDownIcon(false);
		Then.onTheFilterBar.iShouldSeePopOverBtns("OK");
		Then.onTheFilterBar.iShouldSeePopOverBtns("Cancel");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	opaTest("Decimal Precision for Visual Filter Charts in VF Bar and VFD",function(Given,When,Then){
		
		When.onTheFilterBar.iCountVFDecimalPrecision("Line",1,false);
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheFilterBar.iCountVFDecimalPrecision("Line",1,true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");

		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "200-3000", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "200-3000", "CostCenter");

		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type",0);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostElement");

		When.onTheFilterBar.iCountVFDecimalPrecision("Donut",1,true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		When.onTheFilterBar.iCountVFDecimalPrecision("Donut",1,false);


	});

	opaTest("Check show selection button on single selection inside drop down dialog box",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Bar", "200-3000", false, "CostCenter");
		When.onTheFilterBar.iClickDropDownIcon(true);
		Given.onTheFilterBar.iClickDropdownList(1);
		Then.onTheFilterBar.iShouldSeeSelButn(true,true);

		Then.onTheFilterBar.iShouldSeeSelectionText(1);
	});

	opaTest("Close application",function(Given,When,Then){
		Given.iTeardownMyApp();
		expect(0);
	});

	


});
