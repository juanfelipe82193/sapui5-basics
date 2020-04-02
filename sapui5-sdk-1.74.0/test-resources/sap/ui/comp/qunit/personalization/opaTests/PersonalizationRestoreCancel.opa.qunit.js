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

		// Assertions
		Then.theTableShouldContainColumns("sap.ui.table.AnalyticalTable", 2);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.AnalyticalColumn", [
			"Name", "Category"
		]);

		//Actions
		When.iPressOnPersonalizationButton();

		// Assertions
		Then.thePersonalizationDialogOpens();
	});

	opaTest("When I navigate to group panel, group panel is shown", function(Given, When, Then) {
		//Actions
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "GROUPPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nGroupPanel");
		Then.iShouldSeeGroupSelectionWithColumnName("Category");
	});

	opaTest("When I press 'remove line' button, the initial group should disappear", function(Given, When, Then) {
		//Actions
		When.iPressRemoveLineButton(sap.m.P13nPanelType.group);

		// Assertions
		Then.iShouldSeeGroupSelectionWithColumnName(Util.getTextFromResourceBundle("sap.m", "P13NDIALOG_SELECTION_NONE"));
		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I navigate to columns panel, columns panel is shown", function(Given, When, Then) {
		//Actions
		// On phone we have explicit navigate back and then to group panel
		if (sap.ui.Device.system.phone) {
			When.iPressBackButton().and.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		} else {
			When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		}

		// Assertions
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nColumnsPanel");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I deselect the 'Name' column and select 'Price', the 'Restore' button should be enabled", function(Given, When, Then) {
		//Actions
		When.iSelectColumn("Name");
		When.iSelectColumn("Price");

		// Assertions
		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.Table", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Category", "Price"
		]);
	});

	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nColumnsPanel");

		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Name", 4);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press now 'Restore' button, the initial columns selection should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();

		// Assertions
		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press now 'Cancel' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressCancelButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.Table", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Category", "Price"
		]);

	});

	opaTest("When I press on personalization button again and press 'Escape' the dialog will behave the same as 'Cancel'", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));

		//Actions
		When.iPressEscape();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.Table", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Category", "Price"
		]);
	});

	opaTest("When I press on personalization button again, the personalization dialog opens", function(Given, When, Then) {
		//Actions
		When.iPressOnPersonalizationButton();
		When.iNavigateToPanel(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));

		// Assertions
		Then.thePersonalizationDialogOpens();
		Then.iShouldSeeSelectedTab(Util.getTextFromResourceBundle("sap.m", "COLUMSPANEL_TITLE"));
		Then.iShouldSeePanel("sap.m.P13nColumnsPanel");

		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Price", 1);
		Then.iShouldSeeItemWithSelection("Price", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Name", 4);
		Then.iShouldSeeItemWithSelection("Name", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press now 'Restore' button, the initial columns selection should reappear", function(Given, When, Then) {
		//Actions
		When.iPressRestoreButton();

		// Assertions
		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		//Actions
		When.iPressOkButton();

		// Assertions
		Then.thePersonalizationDialogShouldBeClosed();
		Then.theTableShouldContainColumns("sap.ui.table.Table", 7);
		Then.iShouldSeeVisibleColumnsInOrder("sap.ui.table.Column", [
			"Name", "Category"
		]); // 'Category' is not visible as the column is grouped

		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
