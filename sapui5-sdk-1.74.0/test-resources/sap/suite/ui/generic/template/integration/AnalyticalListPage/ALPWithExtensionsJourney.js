/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - ALPWithExtensionsJourney");

	opaTest("Check if the Analytical List Page Extension App is up", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInIframeWithDim("analytics4", 1100, 600);

		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iShouldSeeVariantControls();
	});

	opaTest("KpiTagTooltipCheck for Undetermined", function(Given, When, Then) {
		// both  criticality or criticality calculation is undefined
		Then.onTheMainPage.iCheckKpiTagTooltip(0,"Actual Cost 2,000.00 EUR", "Error");
		//  criticality is undefined and criticality calculation is defined but is not determined
		Then.onTheMainPage.iCheckKpiTagTooltip(1,"Actual Margin Relative 0.31", "Neutral");
		//  criticality is defined and criticality calculation is undefined
		Then.onTheMainPage.iCheckKpiTagTooltip(2,"TargetMargin 800.00", "Risk");
	});  
	

	opaTest("Check the Adapt Filters visibility in VF Live mode if FiletrBar collapsed", function(Given, When, Then) {
		When.onTheMainPage.iClickFilterBarHeader();
		Then.onTheMainPage.iShouldSeeTheAdaptFiltersVisibilityInLivemode();
		When.onTheMainPage.iClickFilterBarHeader();
		Then.onTheMainPage.iShouldSeeTheAdaptFiltersVisibilityInLivemode();
	});

	opaTest("Check VF Labels in FilterBar as per Text Arrangement Annotation", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextLast", false);
	});
	opaTest("Check if the table is Grid Table",function(Given,When,Then){
		// Assertions
		Then.onTheTable.checkTableType("GridTable", "sap.ui.table.Table");
		//To-Do : Need to find a optimal way to check other tables(currently, Grid or Analytical) is not loaded.
		//If we just put a negative condition i.e add two more conditions it delays the OPA excutions time.
	});
	opaTest("Check tooltip for value help button on the VF bar - only VH", function(Given, When, Then) {

		Then.onTheFilterBar.iCheckVHTooltip("Line", "Start Date", "DP_WITHOUT_SELECTIONS");
	});
	opaTest("Check tooltip for value help button on the VF bar - no VH, no Selections", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITHOUT_SELECTIONS");
	});
	opaTest("Check Restore button on dialog", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButtonInOverflowToolbar();
		When.onTheVisualFilterDialog.icheckChartButtonAnuj("Restore");
		/*Then.onTheMainPage.iCheckFilterCountInOverflowToolbar("1");
		Given.onTheFilterBar.iClickTheFilterButtonInOverflowToolbar();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "100-1100",  true, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "100-1100", "CostCenter");
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(1, "Cost Center");
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(false,1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Restore");
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBoxState(true,1);*/
	});

	opaTest("Check Cancel button on dialog", function(Given, When, Then) {

		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheMainPage.iCheckFilterCountInOverflowToolbar("1");
	});
	opaTest("Check Date format", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckDateFormat("StartDate");
	});

	opaTest("Valid/Invalid Measure - Donut Chart", function(Given, When, Then) {
		//check overlay is only on the donut chart
		Then.onTheFilterBar.iCheckNoOverlayForChart(false, 2);
		Then.onTheFilterBar.iCheckNoOverlayForChart(false, 4);
		//Open the dialog
		Given.onTheFilterBar.iClickTheFilterButton();
		//check overlay
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 0);
		//Change the measure to non accumulative for donut chart
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		//Change the Line chart type to donut
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 3);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 2);
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 3);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 2);
		When.onTheVisualFilterDialog.iClickDialogButton('Cancel', "SmartFilterBar-btnCancelFilterDialog", "analytics4");

	});
	//VF Selected Button check for value-help
	opaTest("Check VF Select button count for value-help", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "200-3000", false, "CostCenter");

		When.onTheGenericAnalyticalListPage.iSelectVFChart("line", "400020", false, "CostElement")
			.and.iSelectVFChart("line", "400021", false, "CostElement")
			.and.iSelectVFChart("line", "410050", false, "CostElement");
		Then.onTheFilterBar.iCheckVFChartSelected("line", "400021", "CostElement").and.iCheckVFChartSelected("line", "410050", "CostElement");
		Then.onTheFilterBar.iCheckSelectedButtonCount(3, "Cost Element");
		Then.onTheFilterBar.iCheckVHTooltip("Line", "Cost Element", "VH_MULTI_SELECTED", 3);
	});
	opaTest("Check VF Select button delete value-help", function(Given, When, Then) {
		Given.onTheFilterBar.iClickSelectedButton(3);
		Given.onTheFilterBar.iClickSelectedButtonDeleteIcon(1);
		Then.onTheFilterBar.iCloseTheVHDialog();
	});
	opaTest("Check VF Select button Clear All value-help", function(Given, When, Then) {
		Given.onTheFilterBar.iClickSelectedButton(2);
		Given.onTheFilterBar.iClickSelectedButtonRemove();
		Then.onTheFilterBar.iCloseTheVHDialog();
	});
	//VFD Selected Button check for value-help
	opaTest("Check VFD Select button count for value-help", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButtonInOverflowToolbar();
		When.onTheGenericAnalyticalListPage.iSelectVFChart("line", "400020", true, "CostElement")
			.and.iSelectVFChart("line", "400021", true, "CostElement")
			.and.iSelectVFChart("line", "410050", true, "CostElement");
		Then.onTheFilterBar.iCheckVFChartSelected("line", "400021", "CostElement").and.iCheckVFChartSelected("line", "410050", "CostElement");
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(3, "Cost Element");
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Line", "Cost Element", "VH_MULTI_SELECTED", 3);
	});
	opaTest("Check VFD Select button delete value-help", function(Given, When, Then) {
		Given.onTheVisualFilterDialog.iClickSelectedButton(3);
		Given.onTheVisualFilterDialog.iClickSelectedButtonDeleteIcon(1);
		Then.onTheVisualFilterDialog.iCloseTheVHDialog();
	});
	opaTest("Check VFD Select button Clear All value-help", function(Given, When, Then) {
		Given.onTheVisualFilterDialog.iClickSelectedButton(2);
		Given.onTheVisualFilterDialog.iClickSelectedButtonRemove();
		Then.onTheVisualFilterDialog.iCloseTheVHDialog();
	});
	opaTest("Check tooltip for value help button on the VFD - no VH, no Selections", function(Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Line", "Cost Element", "VALUE_HELP");
	});
	//VFD Selected Button check for non value-help
	opaTest("Check VFD Select button count for non value-help", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "200-3000", true, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("bar", "200-3000", "CostCenter");
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2, "Cost Center");
	});
	opaTest("Check tooltip for selections button on the VFD - only selections", function(Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITH_SELECTIONS", 2);
	});
	opaTest("Check VF Labels in VFD as per Text Arrangement Annotation", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextLast", true);
	});
	opaTest("Check VF Labels in VFD popover as per Text Arrangement Annotation", function(Given, When, Then) {
		Given.onTheVisualFilterDialog.iClickSelectedButton(2);
		Then.onTheFilterBar.iCheckPopoverLabelforTextArangement(true);
	});

	opaTest("Check VFD Select button Clear All non value-help", function(Given, When, Then) {
		Given.onTheVisualFilterDialog.iClickSelectedButton(2);
		Given.onTheFilterBar.iClickSelectedButtonClearAll();
		When.onTheFilterBar.iClickDropdownPopoverOk();
		Then.onTheVisualFilterDialog.iCheckBarChartSelection();
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
	});
	//VF Selected Button check for non value-help
	opaTest("Check VF Select button count for non value-help", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "200-3000", false, "CostCenter")
			.and.iSelectVFChart("bar", "100-1100", false, "CostCenter");
		Then.onTheFilterBar.iCheckVFChartSelected("Bar", "200-3000", "CostCenter").and.iCheckVFChartSelected("Bar", "100-1100", "CostCenter");
		Then.onTheFilterBar.iCheckSelectedButtonCount(2, "Cost Center");
	});
	//Commenting as need to be considered for drop down scenarios and write it
	opaTest("Check tooltip for selections button on the VF bar - only selections", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Bar", "Cost Center", "DROPDOWN_WITH_SELECTIONS", 2);
	});
	opaTest("Check tooltip for value help button on the VFD - no VH, no Selections", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVHTooltip("Line", "Cost Element", "VALUE_HELP");
	});
	opaTest("Check if chart is NOT colored when ChartMeasureAttributes are missing", function(Given, When, Then) {
		// Assertions
		Then.onTheFilterBar.isChartColored("InteractiveLineChart", "StartDate", ["Neutral", "Neutral", "Neutral", "Neutral", "Neutral","Neutral"]);
	});
	opaTest("Check if chart is NOT colored when ChartMeasureAttributes is present but Datapoint is missing", function(Given, When, Then) {
		// Assertions
		Then.onTheFilterBar.isChartColored("InteractiveLineChart", "CostElement", ["Neutral", "Neutral", "Neutral", "Neutral", "Neutral", "Neutral"]);
	});
	//Currently commented out now drop down feature should be considered in this case.
	opaTest("Check VF Labels in FilterBar popover as per Text Arrangement Annotation", function(Given, When, Then) {
		Given.onTheFilterBar.iClickSelectedButton(2);
		Then.onTheFilterBar.iCheckPopoverLabelforTextArangement();
	});
	opaTest("Check VF Select button delete non value-help", function(Given, When, Then) {
		Given.onTheFilterBar.iClickDropdownList(1);
		When.onTheFilterBar.iClickDropdownPopoverSearchFieldWithFilter('$$$');
		When.onTheFilterBar.iSeeDropdownListItems(0);
		When.onTheFilterBar.iClickDropdownPopoverSearchFieldWithFilter('');
		When.onTheFilterBar.iSeeDropdownListItems(5);
		When.onTheFilterBar.iClickDropdownPopoverOk();
		Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Cost Center");
	});
	opaTest("Check VF Select button Clear All non value-help", function(Given, When, Then) {
		Given.onTheFilterBar.iClickSelectedButton(1);
		Given.onTheFilterBar.iClickSelectedButtonClearAll();
		When.onTheFilterBar.iClickDropdownPopoverOk();
		Then.onTheFilterBar.iCheckBarChartSelection();
	});


	opaTest("Check unit field", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckChartTitleInTheBar("Actual Costs by Supplier | K USD");
		Given.onTheFilterBar.iClickTheFilterButtonInOverflowToolbar();
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Actual Costs by Supplier | K USD");
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		When.onTheVisualFilterDialog.iChangeChartProperty(3);
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Difference (%) by StringDate");
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Planned Costs by StringDate | K EUR");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckChartTitleInTheBar("Planned Costs by StringDate | K EUR");
		Then.onTheFilterBar.iCheckUnitFieldInChart("K", "bar", "CostCenter");
	});
	opaTest("Check for customviews", function(Given, When, Then) {
		When.onTheMainPage.iCheckCustomViewButton("Chart and Table View");
		Then.onTheMainPage.checkContentViewButtonsToolbar("masterViewExtensionToolbar");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 1");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 2");
		When.onTheMainPage.iCheckCustomViewButton("Chart View");
		Then.onTheMainPage.checkContentViewButtonsToolbar("masterViewExtensionToolbar");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 1");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 2");
		When.onTheMainPage.iCheckCustomViewButton("Custom View 1");
		Then.onTheMainPage.checkContentViewButtonsToolbar("contentViewExtensionToolbar");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 1");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 2");
		When.onTheMainPage.iCheckCustomViewButton("Custom View 2");
		Then.onTheMainPage.checkContentViewButtonsToolbar("contentViewExtension2Toolbar");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 1");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 2");
		When.onTheMainPage.iCheckCustomViewButton("Table View");
		Then.onTheMainPage.checkContentViewButtonsToolbar("TableToolbar");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 1");
		Then.onTheMainPage.checkCustomViewButtonInAllViews("Custom View 2");
	});
	// Filterable KPI section for master extension view is not supported yet
	// So commenting this test as it fails when the filterable KPI is removed

	// This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
	opaTest("Check if the Analytical List Page Extension App is up", function(Given, When, Then) {
		// Arrangements
		//launching this in custom width and height as this is passing locally but failing on the build
		Given.iStartMyAppWithExtensions();
		Then.onTheFilterBar.isFilterAppliedOnFilterBar("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
	});
	opaTest("Check if Filtering with Empty Values work as expected",function(Given,When,Then){
		Then.onTheMainPage.checkTableRowCount("Table", 106);
		When.onTheGenericAnalyticalListPage.iSelectVFChart("donut", "", false, "Supplier");
		Then.onTheMainPage.checkTableRowCount("Table", 9);
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("donut", "", false, "Supplier");
		Then.onTheMainPage.checkTableRowCount("Table", 106);
	});
	opaTest("Absence of datepicker/datetimepicker on filterbar",function(Given,When,Then){
		Given.onTheFilterBar.iClickTheFilterButton();
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (4)");
	 	Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Quantity by Delivery Time",true, false);
	 	Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Quantity by Delivery Date",true, false);
	 	Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		When.onTheMainPage.iCheckAbsenceOfValueHelpButton("Delivery Time", true);
		When.onTheMainPage.iCheckAbsenceOfValueHelpButton("Delivery Date", true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		When.onTheMainPage.iCheckAbsenceOfValueHelpButton("Delivery Time");
		When.onTheMainPage.iCheckAbsenceOfValueHelpButton("Delivery Date");
	});
	opaTest("Check YearMonth semantics Label & Tooltip", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButton();
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (2)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Actual Costs by YearMonth",true, false);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckDateFormat("YearMonth");
	});
	opaTest("Check UI.Hidden fields are not passed to FilterableKPIs from SFB", function(Given, When, Then) {
		Given.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Given.onTheFilterBar.iClickTheFilterButton();
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (3)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Sales Order Item",true, true);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Sales Order Item", "10");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		When.onTheMainPage.iClickTheKPI("KPIRevenue1");
		Then.onTheMainPage.checkFiltersInFilterableKpi([""]);
	});
	opaTest("Check empty place holder in VF/VFD",function(Given,When,Then){
		Given.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Given.onTheFilterBar.iClickTheFilterButton();
		Then.onTheFilterBar.iCheckVFLabelAndTooltipChart("Donut","Supplier","Not Assigned", true);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheFilterBar.iCheckVFLabelAndTooltipChart("Donut","Supplier","Not Assigned");
	});
	/*
	OPA TEST CASE FOR DATE AND DATETIMEOFFSET -
	OPAs failing only on the build as local time being considered.
	Commenting them for now.
	*/
	// opaTest("Check chart selection on filterbar", function(Given, When, Then) {
	// 	When.onTheGenericAnalyticalListPage.iSelectVFChart("line", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)",  false, "DeliveryDateTime");
	// 	Then.onTheFilterBar.iCheckVFChartSelected("line", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)", "DeliveryDateTime", false);
	// 	Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Delivery Time");
	// 	When.onTheGenericAnalyticalListPage.iSelectVFChart("line", "Mon Nov 26 2018 05:30:00 GMT+0530 (India Standard Time)",  false, "DeliveryCalendarDate");
	// 	Then.onTheFilterBar.iCheckVFChartSelected("line", "Mon Nov 26 2018 05:30:00 GMT+0530 (India Standard Time)", "DeliveryCalendarDate", false);
	// 	Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Delivery Date");
	// });
	// opaTest("Check sync of Date values in cf-vf on selection in filterbar", function(Given, When, Then) {
	// 	When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
	// 	Then.onTheFilterBar.isFilterAppliedOnFilterBar("DeliveryDateTime", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)");
	// 	Then.onTheFilterBar.isFilterAppliedOnFilterBar("DeliveryCalendarDate", "Mon Nov 26 2018 00:00:00 GMT+0530 (India Standard Time)");
	// });
	// opaTest("Check chart deselection - Date/DateTime fields in filterbar", function(Given, When, Then) {
	// 	When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
	// 	When.onTheGenericAnalyticalListPage.iDeselectVFChart("line", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)", false, "DeliveryDateTime");
	// 	When.onTheMainPage.iClickTheKPI(3);
	// 	Then.onTheMainPage.checkFiltersInFilterableKpi(["Nov 26, 2018"])
	// 	When.onTheGenericAnalyticalListPage.iDeselectVFChart("line", "Mon Nov 26 2018 05:30:00 GMT+0530 (India Standard Time)", false, "DeliveryCalendarDate");
	// });
	// opaTest("Check sync of Date values in cf-vf on deselection in filterbar", function(Given, When, Then) {
	// 	When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
	// 	Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("DeliveryDateTime", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)");
	// 	Then.onTheFilterBar.isFilterNotAppliedOnFilterBar("DeliveryCalendarDate", "Mon Nov 26 2018 05:30:00 GMT+0530 (India Standard Time)");
	// });

	// opaTest("Check chart selection on dialog", function(Given, When, Then) {
	// 	When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
	// 	Given.onTheFilterBar.iClickTheFilterButton();
	// 	When.onTheGenericAnalyticalListPage.iSelectVFChart("line", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)",  true, "DeliveryDateTime");
	// 	Then.onTheFilterBar.iCheckVFChartSelected("line", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)", "DeliveryDateTime", false);
	// 	Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Delivery Time");
	// 	When.onTheGenericAnalyticalListPage.iSelectVFChart("line", "Mon Nov 26 2018 05:30:00 GMT+0530 (India Standard Time)",  true, "DeliveryCalendarDate");
	// 	Then.onTheFilterBar.iCheckVFChartSelected("line", "Mon Nov 26 2018 05:30:00 GMT+0530 (India Standard Time)", "DeliveryCalendarDate", false);
	// 	Then.onTheFilterBar.iCheckSelectedButtonCount(1, "Delivery Date");
	// });
	// opaTest("Check sync of Date values in cf-vf on selection in dialog", function(Given, When, Then) {
	// 	When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
	// 	Then.onTheVisualFilterDialog.iCheckForFiltersAppliedInDialog("DeliveryDateTime", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)");
	// 	Then.onTheVisualFilterDialog.iCheckForFiltersAppliedInDialog("DeliveryCalendarDate", "Nov 26, 2018, 12:00:00 AM");
	// });
	// opaTest("Check chart deselection - Date/DateTime fields in dialog", function(Given, When, Then) {
	// 	When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
	// 	When.onTheGenericAnalyticalListPage.iDeselectVFChart("line", "Thu Nov 15 2018 04:30:00 GMT+0530 (India Standard Time)", true, "DeliveryDateTime");
	// 	When.onTheGenericAnalyticalListPage.iDeselectVFChart("line", "Mon Nov 26 2018 05:30:00 GMT+0530 (India Standard Time)", true, "DeliveryCalendarDate");
	// });
	// opaTest("Check sync of Date values in cf-vf on deselection in filterbar", function(Given, When, Then) {
	// 	When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
	// 	Then.onTheVisualFilterDialog.iCheckForFiltersAppliedInDialog("DeliveryDateTime", "", true);
	// 	Then.onTheVisualFilterDialog.iCheckForFiltersAppliedInDialog("DeliveryCalendarDate", "", true);
	// });
	//This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
});
