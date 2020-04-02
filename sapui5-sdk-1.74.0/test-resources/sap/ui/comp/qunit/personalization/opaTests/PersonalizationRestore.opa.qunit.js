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
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "applicationUnderTestPerf.view."
	});

	if (Device.browser.msie || Device.browser.edge) {
		Opa5.extendConfig({
			executionDelay: 50
		});
	}

	opaTest("When I look at the screen, table with some visible columns should appear", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestPerf/start.html');

		//Actions
		When.iLookAtTheScreen();

		// Assertions
		Then.iShouldSeePersonalizationButton("sap.m.Button");
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Category"
		]);
	});

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeeNavigationControlWithPanels(4);
		Then.iShouldSeePanelsInOrder([
			Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "SORTPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"), Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE")
		]);
	});

	opaTest("When I press on group tab, group panel with initial selected group should appear", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nGroupPanel");

		Then.iShouldSeeGroupSelectionWithColumnName("Name");
		Then.iShouldSeeGroupSelectionOnPosition("Name", 0);

		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionOnPosition("Category", 1);
	});

	// ------------------------------------------------------
	// Test: delete and restore a filter
	// ------------------------------------------------------

	opaTest("When I select filter tab, the initial filtering should appear", function(Given, When, Then) {
		//Actions
		if (sap.ui.Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nFilterPanel");
		Then.iShouldSeeFilterSelectionWithColumnName("Date");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONEQ"));
		Then.iShouldSeeFilterSelectionWithValueDate("Apr 15, 2014");
	});

	opaTest("When I press 'remove line' button, the initial filtering should disappear", function(Given, When, Then) {
		//Actions
		When.iPressRemoveLineButton(sap.m.P13nPanelType.filter);

		// Assertions
		Then.iShouldSeeFilterSelectionWithColumnName("Category");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONContains"));
		Then.iShouldSeeFilterSelectionWithValueInput("");
	});

	opaTest("When I press 'Restore' button, the initial filtering should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();

		// Assertions
		Then.iShouldSeeFilterSelectionWithColumnName("Date");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONEQ"));
		Then.iShouldSeeFilterSelectionWithValueDate("Apr 15, 2014");
		Then.theNumberOfFilterableColumnKeysShouldRemainStable();
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	// ------------------------------------------------------
	// Test: delete and restore a variant filter
	// ------------------------------------------------------

	opaTest("When I load 'Filtered By Name 'Gladiator MX'' variant and open filter panel of the dialog, some table characteristics should be changed", function(Given, When, Then) {
		//Actions
		When.iSelectVariant("Filtered By Name 'Gladiator MX'").and.iPressOnPersonalizationButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeFilterSelectionWithColumnName("Name");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONContains"));
		Then.iShouldSeeFilterSelectionWithValueInput("Gladiator MX");
	});

	opaTest("When I press 'remove line' button, the empty filtering should appear", function(Given, When, Then) {
		//Actions
		When.iPressRemoveLineButton(sap.m.P13nPanelType.filter);

		// Assertions
		Then.iShouldSeeFilterSelectionWithColumnName("Category");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONContains"));
		Then.iShouldSeeFilterSelectionWithValueInput("");
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
	});

	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeNavigationControl();
		Then.iShouldSeeNavigationControlWithPanels(4);
	});

	opaTest("When I navigate to filter panel, filter panel is shown", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "FILTERPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nFilterPanel");
		Then.iShouldSeeFilterSelectionWithColumnName("Category");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONContains"));
		Then.iShouldSeeFilterSelectionWithValueInput("");
	});

	opaTest("When I press 'Restore' button, the initial filtering should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();

		// Assertions
		Then.iShouldSeeFilterSelectionWithColumnName("Date");
		Then.iShouldSeeFilterSelectionWithOperation(Util.getTextFromResourceBundle("sap.m", "CONDITIONPANEL_OPTIONEQ"));
		Then.iShouldSeeFilterSelectionWithValueDate("Apr 15, 2014");
		Then.theNumberOfFilterableColumnKeysShouldRemainStable();
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
