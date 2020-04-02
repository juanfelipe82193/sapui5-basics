/* global QUnit */

sap.ui.require([
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

	opaTest("When I press on personalization button, the personalization dialog opens", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestSmartTable/start.html');

		//Actions
		When.iLookAtTheScreen();

		// Assertions
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 3);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", ["Name", "Price", "Category"]);
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function (Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeeNavigationControlWithPanels(4);
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"),Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE")
		]);
	});

	opaTest("When I navigate to columns panel, the initially visible columns should be selected", function (Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nColumnsPanel");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Category", 2);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Bool", 3);
		Then.iShouldSeeItemWithSelection("Bool", false);

		Then.iShouldSeeItemOnPosition("Company Name", 4);
		Then.iShouldSeeItemWithSelection("Company Name", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 5);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 6);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Description", 7);
		Then.iShouldSeeItemWithSelection("Description", false);

		Then.iShouldSeeItemOnPosition("Dimension Depth", 8);
		Then.iShouldSeeItemWithSelection("Dimension Depth", false);

		Then.iShouldSeeItemOnPosition("Dimension Height", 9);
		Then.iShouldSeeItemWithSelection("Dimension Height", false);

		Then.iShouldSeeItemOnPosition("Dimension Unit", 10);
		Then.iShouldSeeItemWithSelection("Dimension Unit", false);

		Then.iShouldSeeItemOnPosition("Dimension Width", 11);
		Then.iShouldSeeItemWithSelection("Dimension Width", false);

		Then.iShouldSeeItemOnPosition("GUID", 12);
		Then.iShouldSeeItemWithSelection("GUID", false);

		Then.iShouldSeeItemOnPosition("Product ID", 13);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Quantity", 14);
		Then.iShouldSeeItemWithSelection("Quantity", false);

		Then.iShouldSeeItemOnPosition("Status", 15);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeItemOnPosition("Unit Of Measure", 16);
		Then.iShouldSeeItemWithSelection("Unit Of Measure", false);

		Then.iShouldSeeItemOnPosition("Weight", 17);
		Then.iShouldSeeItemWithSelection("Weight", false);

		Then.iShouldSeeItemOnPosition("Weight Unit", 18);
		Then.iShouldSeeItemWithSelection("Weight Unit", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I navigate to sort panel, the initially sorted column should appear", function (Given, When, Then) {
		//Actions
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nSortPanel");
		Then.iShouldSeeSortSelectionWithColumnName("Price");
		Then.iShouldSeeSortSelectionWithSortOrder(Util.getTextFromResourceBundle("sap.m", "VIEWSETTINGS_ASCENDING_ITEM"));

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I navigate to filter panel, the initial filter should be empty", function (Given, When, Then) {
		//Actions
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nFilterPanel");
		Then.iShouldSeeFilterSelectionWithColumnName("Category");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONContains"));
		Then.iShouldSeeFilterSelectionWithValueInput("");
	});

	opaTest("When I navigate to group panel, the initially grouped column should appear", function (Given, When, Then) {
		if (Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nGroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn(true);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function (Given, When, Then) {
		// Action
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});
	QUnit.start();
});
