/* global QUnit */

sap.ui.define([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Util',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/ui/Device',
	'sap/m/library'
], function(
	Opa5,
	opaTest,
	Util,
	Arrangement,
	Action,
	Assertion,
	Device,
	mlibrary
) {
	'use strict';

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		asyncPolling: true,
		autoWait:true,
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	if (Device.browser.msie || Device.browser.edge) {
		Opa5.extendConfig({
			executionDelay: 50
		});
	}

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestDimeasure/start.html"));

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE")
		]);
	});

	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nDimMeasurePanel");

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 2);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 3);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 4);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 5);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 6);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 8);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 9);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I navigate to sort panel, sort panel should have an item 'Like It'", function(Given, When, Then) {
		sap.ui.Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"));
		Then.theComboBoxShouldHaveItemWithText("Category", "Like It");
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press 'DrillUp' button and open personalization dialog, dimension 'Category' should be invisible", function(Given, When, Then) {
		When.iPressOnDrillUpButton().and.iPressOnPersonalizationButton();
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		}

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nDimMeasurePanel");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 2);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Category", 3);
		Then.iShouldSeeItemWithSelection("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 4);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 5);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 6);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 8);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 9);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press 'DrillUp' button and open personalization dialog, dimension 'Name' should be invisible", function(Given, When, Then) {
		When.iPressOnDrillUpButton().and.iPressOnPersonalizationButton();
		sap.ui.Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nDimMeasurePanel");
		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Price", 0);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 1);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Category", 2);
		Then.iShouldSeeItemWithSelection("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 3);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 4);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 5);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 6);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 7);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 8);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Name", 9);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press 'DrillDown' button with dimension 'Category' and open personalization dialog, 'Category' should be visible", function(Given, When, Then) {
		When.iPressOnDrillDownButton("Category").and.iPressOnPersonalizationButton();
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		}

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nDimMeasurePanel");

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 2);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 3);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 4);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 5);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 6);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 7);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 8);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Name", 9);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");
	});

	opaTest("When I press 'DrillDown' button with dimension 'Name' and open personalization dialog, 'Name' should be visible", function(Given, When, Then) {
		When.iPressOnDrillDownButton("Name").and.iPressOnPersonalizationButton();
		sap.ui.Device.system.phone ? When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE")) : When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nDimMeasurePanel");

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Name", 1);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Price", 2);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 3);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 4);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 5);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 6);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 8);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 9);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");

		Then.iTeardownMyAppFrame();
	});

	// ----------------------------------------------------------------
	// BCP 1880469461: Wrong order of measures
	// ----------------------------------------------------------------

	opaTest("When I start the app again and press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestDimeasure/start.html"));

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE")
		]);
	});
	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nDimMeasurePanel");

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 2);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 3);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 4);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 5);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 6);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 8);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 9);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I select the 'Depth' measure and move the 'Depth' to the top, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.iSelectColumn("Depth").and.iPressOnMoveToTopButton();

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Depth", 0);
		Then.iShouldSeeItemWithSelection("Depth", true);

		Then.iShouldSeeItemOnPosition("Name", 1);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 2);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 3);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 4);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 5);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 6);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 8);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 9);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I press 'Ok' button, the dialog should close and new measure should be visible", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Depth", "Price", "Quantity"
		]);

		Then.iTeardownMyAppFrame();
	});

	// ----------------------------------------------------------------
	// BCP 1880469461: Wrong order of dimensions
	// ----------------------------------------------------------------

	opaTest("When I start the app again and press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestDimeasure/start.html"));

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);
		Then.iShouldSeeChartOfType("column");
		Then.iShouldSeeChartTypeButtonWithIcon("sap-icon://vertical-bar-chart");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE")
		]);
	});
	opaTest("When I navigate to chart panel, chart panel is shown", function(Given, When, Then) {
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));

		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "CHARTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nDimMeasurePanel");

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 2);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 3);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 4);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 5);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Depth", 6);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 8);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 9);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I select the 'Date' dimension and move the 'Date' to the top, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.iSelectColumn("Date").and.iPressOnMoveToTopButton();

		Then.iShouldSeeComboBoxWithChartType(Util.getTextOfChartType("column"));

		Then.iShouldSeeItemOnPosition("Date", 0);
		Then.iShouldSeeItemWithSelection("Date", true);

		Then.iShouldSeeItemOnPosition("Name", 1);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 2);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 3);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Quantity", 4);
		Then.iShouldSeeItemWithSelection("Quantity", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 5);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Depth", 6);
		Then.iShouldSeeItemWithSelection("Depth", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 8);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Height", 9);
		Then.iShouldSeeItemWithSelection("Height", false);

		Then.iShouldSeeItemOnPosition("Product ID", 10);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 11);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Supplier Name", 12);
		Then.iShouldSeeItemWithSelection("Supplier Name", false);

		Then.iShouldSeeItemOnPosition("Weight Measure", 13);
		Then.iShouldSeeItemWithSelection("Weight Measure", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 14);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeItemOnPosition("Width", 15);
		Then.iShouldSeeItemWithSelection("Width", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I press 'Ok' button, the dialog should close and new measure should be visible", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeVisibleDimensionsInOrder([
			"Date", "Name", "Category"
		]);
		Then.iShouldSeeVisibleMeasuresInOrder([
			"Price", "Quantity"
		]);

		Then.iTeardownMyAppFrame();
	});
	QUnit.start();
});
