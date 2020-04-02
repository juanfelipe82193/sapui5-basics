/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - SanityTest Journey");
	// Add all the relative tests in SanityJourney.js

	opaTest("Single Selection in VF Chart", function(Given, When, Then) {
		Given.iStartMyApp();
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

		Then.onTheFilterBar.iCheckOverlayForChart(true,"MULTIPLE_CURRENCY_OVERLAY_MESSAGE",1);

		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "VH_SINGLE_SELECTED", 1);

		When.onTheFilterBar.iClickGoButton();

		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "100-1100");

		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);

		When.onTheMainPage.iClickFilterBarHeader();
   		Then.onTheFilterBar.iCheckFilterBarCollapsedText("Filtered By (2): Cost Element, Cost Center");
    	When.onTheMainPage.iClickFilterBarHeader();
    	Then.onTheMainPage.iCheckFilterCount(2);

    	When.onTheMainPage.iClickTheSegmentedButton("visual");
    	Given.onTheFilterBar.iClickTheFilterButton();


		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");

	});

	opaTest("Interaction between related charts", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVFChartSelected("Line", "400020", "CostElement");

		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);

		// Then.onTheFilterBar.iCheckOverlay(false, "MULTIPLE_CURRENCY_OVERLAY_MESSAGE", 2);

		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostElement", "400020");

	});

	opaTest("Multiple Selections in VF Chart", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "300-1000", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "300-1000", "CostCenter");
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "VH_MULTI_SELECTED", 2);

		When.onTheFilterBar.iClickGoButton();

		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "300-1000");

		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 2);

		When.onTheMainPage.iClickTheSegmentedButton("visual");
    	Given.onTheFilterBar.iClickTheFilterButton();

		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	opaTest("Selections in Chart After Chart Type Change", function(Given,When,Then){
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("Donut","CostCenter");
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "300-1000", "CostCenter");
		Then.onTheFilterBar.iCheckVHTooltip("Donut", "Cost Center", "VH_MULTI_SELECTED", 2);

		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "100-1100");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "300-1000");

		When.onTheFilterBar.iClickGoButton();
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable",2);
	});

	opaTest("Others Selection in Donut Chart",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "__IS_OTHER__", false, "CostCenter");

		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "__IS_OTHER__", "CostCenter");

		When.onTheFilterBar.iCheckForValuehelp("sap-icon://value-help", "CostCenter");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["!(=300-1000)", "!(=100-1100)"]);
		Then.onTheFilterBar.iCloseTheVHDialog();

		When.onTheFilterBar.iClickGoButton();
		Then.onTheMainPage.iCheckFilterCount(2);

		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 7);
	});

	opaTest("Removal of Others Selection in Donut Chart",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "100-1100", false, "CostCenter");

		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "__IS_OTHER__", "CostCenter", true);
		Then.onTheFilterBar.iCheckVHTooltip("Donut", "Cost Center", "VH_SINGLE_SELECTED", 1);

		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "100-1100");

		When.onTheFilterBar.iClickGoButton();
		Then.onTheMainPage.iCheckFilterCount(2);
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);
	});

	opaTest("Remove Selection from VF Dialog",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Donut", "100-1100", true, "CostCenter");
		// Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(0);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckOverlayForChart(true,"MULTIPLE_CURRENCY_OVERLAY_MESSAGE",1);
		Then.onTheMainPage.iCheckFilterCount(1);
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 9);

	});

	opaTest("Apply Selection from VF Dialog",function(Given,When,Then){
		// When.onTheMainPage.iClickTheSegmentedButton("visual");
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Donut", "100-1100", true, "CostCenter");
		// Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(0);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckNoOverlayForChart(false,1);
		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "100-1100", "CostCenter");
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 1);

	});

	opaTest("Sync CF-VF",function(Given,When,Then){

		Given.onTheMainPage.iClickTheSegmentedButton("compact");
		When.onTheFilterBar.iFilterBarFilter("CostCenter","300-1000");
		Given.onTheMainPage.iClickTheSegmentedButton("visual");

		Then.onTheFilterBar.iCheckVFChartSelected("Donut", "300-1000", "CostCenter");

		When.onTheFilterBar.iClickGoButton();
		Then.onTheMainPage.iCheckFilterCount(2);
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 2);

	});

	opaTest("Drilldown in chart does not result in table rebind",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("chart-btnDrillDownText");
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 2);
		When.onTheChart.iDrillDownChart("Cost Center");
		Then.onTheChart.iShouldSeeChartDrilledDown("CostCenter", true);
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 2);

	});

	opaTest("p13n Changes in Chart does not reload the Table",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("chart-btnPersonalisation");
		When.onTheChart.iAddDimensionFromP13nDialog("Controlling Area");
		When.onTheMainPage.iClickOKButton();
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 2);
		Then.onTheChart.iShouldSeeChartDrilledDown("ControllingArea", true);
		Then.onTheChart.iCheckChartBreadCrumbs(2);
	});

	opaTest("p13n Changes in Table does not reload the Chart",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("table-btnPersonalisation");
		When.onTheTable.iAddColumnFromP13nDialog("Customer");
		When.onTheMainPage.iClickOKButton();
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 2);
		Then.onTheChart.iShouldSeeChartDrilledDown("Customer", false);
		Then.onTheChart.iCheckChartBreadCrumbs(2);
	});


	opaTest("Grouping in Table With Selection in Chart",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("table-btnPersonalisation");
		When.onTheTable.iSelectSettingInP13nDialog("Group");
		When.onTheTable.iClickComboBox();
		When.onTheTable.iSelectProperty("Display Currency");
		Then.onTheVisualFilterDialog.iCloseTheVHDialog();
		Then.onTheTable.iCheckGroupHeaderOnTable("DisplayCurrency");
		When.onTheMainPage.iClickTheSegmentedButton("filter");
		Then.onTheMainPage.checkTableRowCount("AnalyticalTable", 2);
		Then.onTheChart.iShouldSeeChartDrilledDown("DisplayCurrency", false);

	});

	// opaTest("Content Area Chart Selection Applied to Table",function(Given,When,Then){
	// 	When.onTheGenericAnalyticalListPage.iSelectVFChart("Line", "400021", false, "CostElement");
	// 	Then.onTheFilterBar.iCheckVFChartSelected("Line", "400021", "CostElement");
	// 	When.onTheFilterBar.iClickGoButton();
	// 	Then.onTheMainPage.checkTableRowCount(4);
	// 	When.onTheChart.iSelectChart("CostElement", "400021");
	// 	Then.onTheMainPage.checkTableRowCount(2);

	// });

	opaTest("KPI Tag Title",function(Given,When,Then){

		Then.onTheMainPage.CheckKpiIndicator(0,"Good");
		Then.onTheMainPage.iCheckKpiTagTooltip(0, "Actual Cost 2,000.00 EUR ", "Good");
		Then.onTheMainPage.iCheckKpiScaleFactor("ActualCosts","K");
		Then.onTheMainPage.iCheckNumberofFractionalDigit("ActualCosts",1);
	});

	opaTest("KPI Card Title",function(Given,When,Then){
		When.onTheMainPage.iClickTheKPI("ActualCosts");
		Then.onTheMainPage.iCheckKpiTitleInCard("Actual Cost");
		Then.onTheMainPage.iCheckCriticalityInKPICard("Good");
		When.onTheMainPage.iCloseTheKPIPopover();
	});


	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});

	opaTest("Selecting a vlaue from DropDown in VF",function(Given,When,Then){
		Given.iStartMyAppInIframeWithDim("analytics4", 1500, 900);
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITHOUT_SELECTIONS");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "200-3000", false, "CostCenter");
		Given.onTheFilterBar.iClickSelectedButton(1);


		When.onTheFilterBar.iClickDropdownPopoverOk();

		Given.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");

		When.onTheMainPage.iClickTheSegmentedButton("compact");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("CostCenter", "200-3000");

		//Then.onTheMainPage.checkGridTableRowCount(23);

	});

	opaTest("Check for global actions and determining buttons not seen on table toolbar", function(Given, When, Then) {
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheMainPage.theCustomToolbarForTheSmartTableIsRenderedWithoutGlobalAndDetermining();
	});

	opaTest("Check for global actions on the dynamic header", function(Given, When, Then) {
		Then.onTheMainPage.isTheDynamicHeaderRenderingGlobalActions();
	});

	opaTest("Check for determining buttons on footer", function(Given, When, Then) {

		Then.onTheMainPage.isTheFooterBarHasDeterminingButtonsCorrectly();
		When.onTheMainPage.iClickTheSegmentedButton("chart");
		Then.onTheMainPage.isTheFooterBarHasDeterminingButtonsCorrectly();
		When.onTheMainPage.iClickTheSegmentedButton("charttable");
		Then.onTheMainPage.isTheFooterBarHasDeterminingButtonsCorrectly();
		When.onTheMainPage.iClickTheSegmentedButton("table");
		Then.onTheMainPage.isTheFooterBarHasDeterminingButtonsCorrectly();
	});

	opaTest("Removal of selections from DropDown in VF",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Given.onTheFilterBar.iClickSelectedButton(1);
		Given.onTheFilterBar.iClickSelectedButtonClearAll();
		When.onTheFilterBar.iClickDropdownPopoverOk();
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITHOUT_SELECTIONS");
		//Then.onTheMainPage.checkGridTableRowCount(19);
	});

	opaTest("Check DatePicker button rendered for DateTime field in VF,VFD and selected values are synced from CF to VF",function(Given,When,Then){
		When.onTheMainPage.iClickTheSegmentedButton("compact");
		When.onTheFilterBar.iFilterBarFilter("StartDate", "Dec 10, 2016");
		When.onTheMainPage.iClickTheSegmentedButton("visual");
		Then.onTheFilterBar.iCheckVFLabelAndTooltip("Line", "StartDate", "Dec 10, 2016");
		When.onTheFilterBar.iCheckForDatePicker("sap-icon://appointment-2", "1 item selected for Date", false);
		When.onTheFilterBar.iCheckForCalendar(new Date("Dec 10, 2016"), false);
		Then.onTheMainPage.iCheckFilterCountInOverflowToolbar("2");
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheFilterBar.iCheckForDatePicker("sap-icon://appointment-2", "1 item selected for Date", true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
	});

	opaTest("Close Application",function(Given,When,Then){
		Given.iTeardownMyApp();
		expect(0);
	});

	opaTest("Check for mandatory fields missing info message for KPI entityset different than main entityset with matching fields", function (Given, When, Then) {
		//OPA to check for Unable to load KPI due to a technical issue condition
		Given.iStartMyAppALPWithParamsWoDisplayCurrency();
		When.onTheMainPage.iClickTheKPI("NetAmount4");
		Then.onTheMainPage.iCheckKpiErrorText("KPI_INFO_FOR_MISSING_MANDATE_FILTPAR");
		Then.onTheMainPage.CheckKpiIndicator(4, "Neutral");
		When.onTheMainPage.iCloseTheKPIPopover();
		When.onTheMainPage.iPassParameter("P_DisplayCurrency");
	});

	opaTest("Apply Filters on Filterable KPIs and check the values",function(Given,When,Then){

		Then.onTheMainPage.iCheckKpiValue("NetAmount2","309.8K");
		Then.onTheMainPage.iCheckKpiScaleFactor("NetAmount2","K");
		Then.onTheMainPage.iCheckNumberofFractionalDigit("NetAmount2",1);
		When.onTheFilterBar.iFilterBarFilter("DisplayCurrency", "EUR");
		When.onTheFilterBar.iClickInputValuehelp("CustomerCountry");
		When.onTheFilterBar.iSelectOperatorInVH("equal to");
		When.onTheFilterBar.iAddValueInValuehelp("BR"); //no data filterable scenario
		Then.onTheFilterBar.iCloseTheVHDialog();
		Then.onTheMainPage.iCheckKpiValue("NetAmount2","2.6M");
		Then.onTheMainPage.iCheckKpiScaleFactor("NetAmount2","M");
		Then.onTheMainPage.iCheckNumberofFractionalDigit("NetAmount2",1);

	});

    opaTest("Close Application",function(Given,When,Then){
		Given.iTeardownMyApp();
		expect(0);
	});


});
