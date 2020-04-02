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

	opaTest("When I press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTest/start.html');

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

	// ----------------------------------------------------------------------
	// Test: deselect and select the 'Show Field as Column' checkbox
	// ----------------------------------------------------------------------

	opaTest("When I press on group tab, group panel with initial grouped column should appear", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nGroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn(true);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn(true);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I deselect 'show field as column' checkbox, 'Restore' button should be enabled", function(Given, When, Then) {
		//Actions
		When.iClickOnTheCheckboxShowFieldAsColumn();

		// Assertions
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn(false);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn(true);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I select 'show field as column' checkbox again, 'Restore' button should be disabled", function(Given, When, Then) {
		//Actions
		When.iClickOnTheCheckboxShowFieldAsColumn();

		// Assertions
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
		Then.iShouldSeeGroupSelectionWithCheckedShowFieldAsColumn(true);
		Then.iShouldSeeGroupSelectionWithEnabledShowFieldAsColumn(true);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
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
