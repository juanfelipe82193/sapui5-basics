/*global opaTest QUnit */
sap.ui.define(["sap/ui/test/opaQunit"], function() {

	"use strict";

	QUnit.module("Journey - AnalyticalListPage - MainJourney");

	opaTest("Check if the Analytical List Page is displaying with components", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInIframeWithDim("analytics2", 1500, 900);
		Then.onTheVisualFilterDialog.iCheckDialogTitle("Adapt Filters", "Compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		// Assertions
		Then.onTheFilterBar.iCheckHiddenFilters(3);
		Then.onTheMainPage.iShouldSeeTheComponent("KPI", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartChart", "sap.ui.comp.smartchart.SmartChart");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartTable", "sap.ui.comp.smarttable.SmartTable");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartCompactFilterBar", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartFilterBarExt");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Then.onTheMainPage.iShouldSeeTheComponent("SmartVisualFilterBar", "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar");
		Then.onTheMainPage.iShouldSeeVariantControls();
	});
	opaTest("Check the Visibility of CF and VF", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckChartTitleInTheBar("Actual Costs by Cost Center | USD");
		Then.onTheFilterBar.iCheckUnitFieldInChart("K", "bar", "CostCenter", true);
	});
	opaTest("Check if selection exists after an in-param chart is selected", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "300-2000", false, "CostCenter");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Line", "435000", false, "CostElement");
		When.onTheFilterBar.iCheckForValuehelp("sap-icon://value-help", "CostCenter");
		Then.onTheMainPage.iCheckValueHelpDialogForTokens(["United States Dollar (300-2000)"]);
		Then.onTheFilterBar.iCloseTheVHDialog();
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Line", "435000", false, "CostElement");
		When.onTheGenericAnalyticalListPage.iDeselectVFChart("Bar", "300-2000", false, "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		Then.onTheFilterBar.iCheckTokensAreApplied("CostCenter", []);
		Then.onTheFilterBar.iCheckTokensAreApplied("CostElement", []);
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
	});
	opaTest("Check the Visibility of CF and VF", function(Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheFilterVisibility();
	});

	opaTest("Check the Adapt Filters button in CF Go button mode", function(Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheAdaptFiltersInGoButtonmode();
	});
	opaTest("Check if InvisibleText is present on mandatory visual filter on the dialog and on adding new visual filter", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextCostElement", "CostElement");
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (2)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Totalled Properties",true, false);
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Controlling Area",true, false);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextTotaledProperties", "");
		Then.onTheVisualFilterDialog.iCheckVisualFilterDialogInvisibleText("visualFilterDialogInvisibleTextControllingArea", "");
	});
	opaTest("Check if InvisibleText is present on mandatory visual filter on the bar and on adding new visual filter", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(0, "visualFilterBarInvisibleTextCostElement", "CostElement", "MULTIPLE_CURRENCY_OVERLAY_MESSAGE");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(3, "visualFilterBarInvisibleTextTotaledProperties", "", "TECHNICAL_ISSUES_OVERLAY_MESSAGE");
		Then.onTheFilterBar.iCheckVisualFilterBarInvisibleText(4, "visualFilterBarInvisibleTextControllingArea", "", "HIDDEN_MEASURE_OVERLAY_MESSAGE");
		Given.onTheFilterBar.iClickTheFilterButton();
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("Change Filters");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Totalled Properties",false, false);
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Controlling Area",false, false);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
	});
	opaTest("Check if cancel button closes dialog in case nothing is changed inside",function(Given,When,Then){
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheMainPage.iShouldSeeTheDialog();
		// Then.onTheMainPage.iCheckDialogClosed();
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheMainPage.iCheckDialogIsClosed();
	});

	opaTest("Check if Cancel button cancel's the changes made",function(Given,When,Then){
		When.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", true, "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Cancel");
		Then.onTheVisualFilterDialog.iCheckBarChartSelection();
	});

	opaTest("Switch filter mode to Visual Filter", function(Given, When, Then) {
		//@Jithin please complete TODO;
		// actions
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("SmartVisualFilterBar", "sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar");
	});

	opaTest("Check the Adapt Filters button in VF Go button mode", function(Given, When, Then) {
		Then.onTheMainPage.iShouldSeeTheAdaptFiltersInGoButtonmode();
	});

	opaTest("Check hidden visual filters are not part of visualfilterbar", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckHiddenFilters(3);
	});

	opaTest("Check if mandatory filter field values are passed to Visual filter chart even if they are not defined as In Parameter", function(Given, When, Then){
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", false, "CostCenter");
		Then.onTheMainPage.iCheckVFMandatoryFilter("CostCenter", "CostElement", "Bar", "400020", true);
	});

	opaTest("Check hidden visual filters are part of visualfilterbar after enable", function(Given, When, Then) {
        Given.onTheFilterBar.iClickTheFilterButton();
        Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (2)");
        Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Controlling Area ", true, false);
        Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "HIDDEN_MEASURE_OVERLAY_MESSAGE", 1);
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
        When.onTheVisualFilterDialog.iChangeChartProperty(0);
        When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
        Then.onTheFilterBar.iCheckHiddenFilters(4);
    });

	opaTest("Check hidden visual filters are not part of visualfilterbar after disable", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButton();
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (1)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Actual Costs by Controlling Area   ", false, false);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheFilterBar.iCheckHiddenFilters(3);
	});

	opaTest("Check Visibility sync: Make Visual Visible and check if Value Help shows up for chart freshly made visible", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButton();
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (2)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Actual Costs by Controlling Area ", true, false);
        Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		Given.onTheVisualFilterDialog.iCheckForValuehelp("ControllingArea");
		Then.onTheVisualFilterDialog.iCloseTheVHDialog();
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Given.onTheFilterBar.iCheckForValuehelp("sap-icon://slim-arrow-down", "ControllingArea");
		Then.onTheFilterBar.iCloseTheVHDialog();
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		Then.onTheVisualFilterDialog.iCompactReflectVisibility("Controlling Area", true, true);
	});

	opaTest("Check if dropdown shows dimensiontext from navigation property", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Given.onTheFilterBar.iCheckForValuehelp("sap-icon://slim-arrow-down", "ControllingArea");
		Then.onTheFilterBar.iCheckDropdownResponsivePopoverFromNavigationText();
		When.onTheFilterBar.iClickDropdownPopoverOk();
	});

	opaTest("Check Visibility sync: Make Compact Hidden", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (2)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Controlling Area", false, true);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
		Then.onTheVisualFilterDialog.iVisualReflectVisibility("Controlling Area", false);
	});


	opaTest("Check VF Chart and Title Width", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 2);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheMainPage.iCheckVFChartandTitleWidth();
		When.onTheMainPage.iClickGoButton();
	});
	opaTest("Changing chart type to Donut- check chart type", function(Given, When, Then) {
		// actions
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckTypeOfChart("donut", "CostCenter");
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		// Assertions
		Then.onTheMainPage.iCheckFilterCount("2");
	});


	opaTest("View mode switch to Table-only", function(Given, When, Then) {
		// actions
		When.onTheMainPage.iClickTheSegmentedButton("table");

		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("Table Container", "sap.ui.comp.smarttable.SmartTable");
	});

	opaTest("Check navigation", function(Given, When, Then) {
		// actions
		When.onTheMainPage.iClickRowActionButton();
		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("rowActions", "sap.ui.table.RowAction");
    });

	opaTest("View mode switch to Chart-only", function(Given, When, Then) {
		// actions
		When.onTheMainPage.iClickTheSegmentedButton("chart");

		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("Chart Container", "sap.ui.comp.smartchart.SmartChart");
	});

	opaTest("View mode switch to Chart-Table", function(Given, When, Then) {
		// actions
		When.onTheMainPage.iClickTheSegmentedButton("charttable");

		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("Table Container", "sap.ui.comp.smarttable.SmartTable");
		Then.onTheMainPage.iShouldSeeTheComponent("Chart Container", "sap.ui.comp.smartchart.SmartChart");
	});

	opaTest("Check for table and chart determining buttons on Hybrid view mode", function(Given, When, Then) {

		// Assertions
		Then.onTheMainPage.iShouldSeeTheComponent("Determining", "sap.m.Button");
		Then.onTheMainPage.iShouldSeeTheComponent("Copy", "sap.m.Button");
	});

	opaTest("Changing chart type to Bar back", function(Given, When, Then) {
		// actions
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");

		// Assertions
		Then.onTheMainPage.iCheckFilterCount("2");
	});
	opaTest("Check to see all action buttons rendering with valid id", function(Given, When, Then) {
		// Assertions
		Then.onTheMainPage.iShouldSeeActionButtonsWithValidId();
	});
	opaTest("Check for Require Selection Buttons on Table toolbar", function(Given, When, Then) {
		// Assertions
		When.onTheMainPage.iClickTheSegmentedButton("table");
		When.onTheTable.iSelectARow();
		Then.onTheMainPage.theCustomToolbarForTheSmartTableIsRenderedWithRequireSelectionCorrectly(true);
		When.onTheTable.iClearSelection();
		Then.onTheMainPage.theCustomToolbarForTheSmartTableIsRenderedWithRequireSelectionCorrectly(false);

	});
	opaTest("Check if a property having unconfigured semantic object and quick view annotations is rendered as link", function(Given, When, Then) {
		Then.onTheTable.iCheckIfColumnTemplateIsRenderedAsLink("CostElement");
	});


	//This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
	opaTest("Check filterable KPI gets hidden in toolbar", function(Given, When, Then) {
		Given.iStartMyAppInIframeWithDim("analytics2", 750,500);
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheVisualFilterDialog.iClickDialogButton("Go","SmartFilterBar-btnGoFilterDialog", "analytics2");
		Then.onTheMainPage.iCheckTheChartTableSegmentedButtonDoesNotOverflow();
		Then.onTheGenericAnalyticalListPage.iShouldSeeTheButtonWithId("template::KPITagContainer::filterableKPIs-overflowButton");
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::KPITagContainer::filterableKPIs-overflowButton");
		Then.onTheMainPage.iShouldSeeTheComponent("template::KPITag::kpi::ActualMarginRelative5", "sap.suite.ui.generic.template.AnalyticalListPage.control.SmartKpiTag", {id: "template::KPITag::kpi::ActualMarginRelative5"});
		When.onTheGenericAnalyticalListPage.iClickTheButtonWithId("template::KPITagContainer::filterableKPIs-overflowButton");
		Given.iTeardownMyApp();
	});
});
