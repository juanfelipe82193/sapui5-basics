/*global opaTest QUnit */
sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/suite/ui/generic/template/integration/AnalyticalListPage/FilterBarJourney"
], function() {

	"use strict";
	QUnit.module("Journey - AnalyticalListPage - FilterDialogJourney");
	/*
	To always start in VF mode
	*/
	opaTest("Switch filter mode to Visual Filter", function(Given, When, Then) {
		//Given.iStartMyApp();
		//When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		//When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Display Currency", "USD");
		//When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		// actions
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		// Assertions
		Then.onTheMainPage.iCheckVisualFilterCharts(3);
	});
	 opaTest("Check for disabled measures button", function(Given, When, Then) {
	 	 Then.onTheFilterBar.iCheckHiddenFilters(3);
	 	 Given.onTheFilterBar.iClickTheFilterButton();
	 	 Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (2)");
	 	 Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Totalled Properties",true, false);
	 	 Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
	 	 Then.onTheGenericAnalyticalListPage.checkButtonEnablement("template::VisualFilterDialog::MeasureChangeButton::ZCOSTCENTERCOSTSQUERY0020_CDS.ZCOSTCENTERCOSTSQUERY0022Type::TotaledProperties");
	 	 Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (1)");
	 	 Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Totalled Properties",false, false);
	 	 Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
	 });
	/*
	OPA for value help
	*/
	opaTest("Check Support of Value help button", function(Given, When, Then) {
		//Arrangement: check for filter button and open the dialog
		//actions: click segment button
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
		//Arrangement: Check for open dialog
		Given.onTheVisualFilterDialog.iCheckForValuehelp("CostCenter");
		//Assertions: Check for the id of dialog and close
		//Click Go on the value help dialog
		When.onTheFilterBar.iClickGoButton(true);
		//Given.onTheFilterBar.iSearchForItemsTable();  @Priyanshu to retest
		//make selections in VH Dialogs
		Given.onTheFilterBar.iMakeSelection(2, "/ZCOSTCENTERCOSTSQUERY0021('0004')");
		//Assertions: Close the VH dialog and check selected link
		Then.onTheFilterBar.iCloseTheVHDialog();
		Then.onTheVisualFilterDialog.iCheckSelectedButtonCount(2, "Cost Center");
	});
	opaTest("Check tooltip for value help button on the VFD- VH with selections", function(Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckVHTooltip("Bar", "Cost Center", "VH_MULTI_SELECTED", 2);
	});
	opaTest("Check VF Labels as per Text Arrangement Annotation", function(Given, When, Then) {
		Then.onTheFilterBar.iCheckVFLabelforTextArangement("Bar","TextFirst", true);
	});
	/*
		Author : reshma
		Please inform me before adding new charts
	*/
	//HANDLE CORNER CASE - BCP: 1780260828
	opaTest("Make selection to a chart which is in parameter to a hidden chart", function(Given, When, Then) {
		//make a selection on Cost Center VF chart - in param to Controlling Area
		When.onTheGenericAnalyticalListPage.iSelectVFChart("bar", "300-2000", true, "CostCenter");
		//Make hidden filter - Controlling Area visible
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (2)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Controlling Area", true, false);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		//Change its chart type
		When.onTheVisualFilterDialog.iClickChartButton("Chart Type");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		//Make Controlling Area hidden again
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (1)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Controlling Area   ", false, false);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");

	});
	/*
		END OF VISIBILITY TESTS
	*/
	/*
	Testing Dialog Harmonization
	Authors: Maithri & Divya
	*/
	opaTest("Check visibility of BASIC group when more than one group is present", function(Given, When, Then) {
		//to check BASIC group visibility
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
		Then.onTheVisualFilterDialog.iCheckGroupTitle("Basic");
		//to check presence of multiple groups
		Then.onTheVisualFilterDialog.iCheckGroupTitle("ZCOSTCENTERCOSTSQUERY0020");
	});
	opaTest("Check if chart is colored Criticality information is given in the datapoint Annotation", function(Given, When, Then) {
		// Assertions
		Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Error","Good","Good"], true);
	});

	opaTest("check show on filter bar checkbox", function(Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBox();
	});
	opaTest("check VF charts rendering based on show on filter bar checkbox enable/disable", function(Given, When, Then) {
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(false,1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheMainPage.iCheckVisualFilterCharts(2);
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iSetShowOnFilterBarCheckBoxState(true,1);
		When.onTheGenericAnalyticalListPage.iClickTheButtonOnTheDialogWithLabel("Go");
		Then.onTheMainPage.iCheckVisualFilterCharts(3);
		Given.onTheFilterBar.iClickTheFilterButton();
	});
	opaTest("Check if chart is NOT colored when Measure in datapoint doesn't match Chart measure", function(Given, When, Then) {
		// Assertions
		Then.onTheFilterBar.isChartColored("InteractiveBarChart", "CostCenter", ["Error","Good","Good"], true);
	});

	//This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});

	opaTest("Open app without values for mandatory fields", function(Given, When, Then) {
		// open app without any URL parameters to check for error state
		Given.iStartMyApp();
		// check error state for fields on the visual filter dialog
		Then.onTheVisualFilterDialog.iCheckInputForErrorState('CostElement');
		// close the dialog by clicking on Cancel
		When.onTheVisualFilterDialog.iClickDialogButton('Cancel', "SmartFilterBar-btnCancelFilterDialog", "analytics2");
		// switch to compact filter
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		// check error state for fields
		Then.onTheFilterBar.iCheckMandatoryFieldsForErrorState();
	});
	opaTest("Check Scale Factor on Visual Filter", function(Given, When, Then) {
		When.onTheFilterBar.iFilterBarFilter("CostElement", "400020");
		When.onTheFilterBar.iFilterBarFilter("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Given.onTheFilterBar.iClickTheFilterButton();
		Then.onTheVisualFilterDialog.iCheckChartScale(undefined, "");
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 1);
		Then.onTheVisualFilterDialog.iCheckForHiddenMeasure("Planned Costs");
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckChartScale(1000, "K");
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 1);
		Then.onTheVisualFilterDialog.iCheckForHiddenMeasure("Planned Costs");
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		Then.onTheVisualFilterDialog.iCheckChartScale(1, undefined);
		When.onTheVisualFilterDialog.iClickDialogButton('Go', "SmartFilterBar-btnGoFilterDialog", "analytics2");
	});
	opaTest("Check overlay", function(Given, When, Then) {
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		//fill mandatory filter to avoid dialog popup
		When.onTheFilterBar.iFilterBarFilter("CostElement", "400021");
		When.onTheFilterBar.iFilterBarFilter("DisplayCurrency", "");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		//check overlay on the filter bar
		Then.onTheFilterBar.iCheckOverlay(true, "MULTIPLE_CURRENCY_OVERLAY_MESSAGE", 1);
		Given.onTheFilterBar.iClickTheFilterButton();
		//check overlay in the dialog
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "MULTIPLE_CURRENCY_OVERLAY_MESSAGE", 1);
		When.onTheVisualFilterDialog.iClickDialogButton('Cancel', "SmartFilterBar-btnCancelFilterDialog", "analytics2");
		//set hidden currency field to remove overlay
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("compact");
		When.onTheFilterBar.iFilterBarFilter("DisplayCurrency", "USD");
		When.onTheGenericAnalyticalListPage.iClickOnFilterSwitchButton("visual");
		Given.onTheFilterBar.iClickTheFilterButton();
		//check removal of overlay in the dialog
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "MULTIPLE_CURRENCY_OVERLAY_MESSAGE", 2);
		When.onTheVisualFilterDialog.iClickDialogButton('Go', "SmartFilterBar-btnGoFilterDialog", "analytics2");
		//check removal of overlay on the bar
		Then.onTheFilterBar.iCheckOverlay(false, "MULTIPLE_CURRENCY_OVERLAY_MESSAGE", 2);
	});

	opaTest("Valid/Invalid Measure - Donut Chart", function(Given, When, Then) {
		//check overlay is only on the donut chart
		Then.onTheFilterBar.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		Given.onTheFilterBar.iClickTheFilterButton();
		//check overlay is only on the donut chart
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		//Change chart type to bar and check Overlay
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 2);
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		//Change chart type to donut and measure to accumulative
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 2);
		When.onTheVisualFilterDialog.iChangeChartProperty(2);
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 2);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		//For Bar chart with valid measure, change chart type
		//Change chart type to donut and check Overlay
		When.onTheVisualFilterDialog.iClickToolbarButton("Chart Type", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		//Change measure to non accumulative and check if overlay comes up for "Cost Center"
		When.onTheVisualFilterDialog.iClickToolbarButton("Measure", 1);
		When.onTheVisualFilterDialog.iChangeChartProperty(1);
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "INVALID_MEASURE_DONUT_MESSAGE", 1);
		//Close the dialog
		When.onTheVisualFilterDialog.iClickDialogButton('Cancel', "SmartFilterBar-btnCancelFilterDialog", "analytics2");

	});

	/*
	*BCP - 1780278254
	*/
	opaTest("Check chart and its title", function(Given, When, Then) {
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickDialogButton('Restore', "SmartFilterBar-btnRestoreFilterDialog", "analytics2");
		//make hidden filter - Actual Costs by Controlling Area - visible
		//Collection path of Controlling area same as that main entity set
		Given.onTheVisualFilterDialog.iCheckMoreFiltersLink("More Filters (2)");
		Given.onTheVisualFilterDialog.iCheckSelectFitlerCheckbox("Planned Costs by Controlling Area   ", true, false);
		Given.onTheVisualFilterDialog.iClickOk("OK","Select Filters");
		//On restore, Controlling Area should have the overlay due to unfilled mandatory filter
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Planned Costs by Controlling Area");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("compact");
		When.onTheVisualFilterDialog.iAddFilterValueInCompactDialog("Cost Element", "400020");
		When.onTheVisualFilterDialog.iClickTheSegmentedButton("visual");
		When.onTheGenericAnalyticalListPage.iSelectVFChart("Bar", "100-1100", true, "CostCenter");
	});
	opaTest("Check visual filter with hidden measure", function(Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckOverlay(true, "HIDDEN_MEASURE_OVERLAY_MESSAGE", 1);
		When.onTheVisualFilterDialog.iClickDialogButton('Go', "SmartFilterBar-btnGoFilterDialog", "analytics2");
		Then.onTheFilterBar.iCheckOverlay(true, "HIDDEN_MEASURE_OVERLAY_MESSAGE", 1);
		Given.onTheFilterBar.iClickTheFilterButton();
		When.onTheVisualFilterDialog.iClickChartButton("Measure");
		Then.onTheVisualFilterDialog.iCheckForHiddenMeasure("Planned Costs");
		When.onTheVisualFilterDialog.iChangeChartProperty(0);
		Then.onTheVisualFilterDialog.iCheckOverlay(false, "HIDDEN_MEASURE_OVERLAY_MESSAGE", 1);
		Then.onTheVisualFilterDialog.iCheckRenderedChart("Bar", "ControllingArea", true);
		Then.onTheVisualFilterDialog.iCheckChartTitle(true, "Actual Costs by Controlling Area | USD");
		When.onTheVisualFilterDialog.iClickDialogButton('Go', "SmartFilterBar-btnGoFilterDialog", "analytics2");
		Then.onTheFilterBar.iCheckOverlay(false, "HIDDEN_MEASURE_OVERLAY_MESSAGE", 1);
	});
	//This test is to close the applications. All OPA tests for this application should
	// go above this test.
	opaTest("Close application", function(Given, When, Then) {
		Given.iTeardownMyApp();
		expect(0);
	});
/*	opaTest("Check Show on Filter Bar CheckBox on dialog", function(Given, When, Then) {
		Then.onTheVisualFilterDialog.iCheckShowOnFilterBarCheckBox();
	}); */
});
