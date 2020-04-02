/* global QUnit */

sap.ui.require([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/ui/Device',
	'sap/m/library'
], function(
	Opa5,
	opaTest,
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
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestP13nColumnsPanel/start.html');

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton("sap.m.Button");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I select the 'Product ID' column, this item should become marked", function(Given, When, Then) {
		When.iSelectColumn("Product ID");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", true);
		Then.iShouldSeeMarkingOfItem("Product ID", true);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I deselect the 'Category' column, this item should become marked", function(Given, When, Then) {
		When.iSelectColumn("Category");

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", false);
		Then.iShouldSeeMarkingOfItem("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", true);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Restore' button, 'Category' should remain marked", function(Given, When, Then) {
		When.iPressRestoreButton();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", false);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", true);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});

	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();
		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});

	// Test toolbar buttons

	opaTest("When I start the 'applicationUnderTestP13nColumnsPanel' again and press on personalization button, the personalization dialog opens", function(Given, When, Then) {
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/personalization/opaTests/applicationUnderTestP13nColumnsPanel/start.html');

		When.iLookAtTheScreen();

		Then.iShouldSeePersonalizationButton("sap.m.Button");

		When.iPressOnPersonalizationButton();

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I click on 'Move to Bottom' button, the marked 'Name' column is moved to bottom", function(Given, When, Then) {
		When.iPressOnMoveToBottomButton();

		Then.iShouldSeeItemOnPosition("Category", 0);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 1);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 2);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 3);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 4);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 5);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		Then.iShouldSeeItemOnPosition("Name", 6);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", true);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I click on 'Move to Top' button, the marked 'Name' column is moved to top", function(Given, When, Then) {
		When.iPressOnMoveToTopButton();

		Then.iShouldSeeItemOnPosition("Name", 0);
		Then.iShouldSeeItemWithSelection("Name", true);
		Then.iShouldSeeMarkingOfItem("Name", true);

		Then.iShouldSeeItemOnPosition("Category", 1);
		Then.iShouldSeeItemWithSelection("Category", true);
		Then.iShouldSeeMarkingOfItem("Category", false);

		Then.iShouldSeeItemOnPosition("Currency Code", 2);
		Then.iShouldSeeItemWithSelection("Currency Code", false);
		Then.iShouldSeeMarkingOfItem("Currency Code", false);

		Then.iShouldSeeItemOnPosition("Date", 3);
		Then.iShouldSeeItemWithSelection("Date", false);
		Then.iShouldSeeMarkingOfItem("Date", false);

		Then.iShouldSeeItemOnPosition("Price", 4);
		Then.iShouldSeeItemWithSelection("Price", false);
		Then.iShouldSeeMarkingOfItem("Price", false);

		Then.iShouldSeeItemOnPosition("Product ID", 5);
		Then.iShouldSeeItemWithSelection("Product ID", false);
		Then.iShouldSeeMarkingOfItem("Product ID", false);

		Then.iShouldSeeItemOnPosition("Status", 6);
		Then.iShouldSeeItemWithSelection("Status", false);
		Then.iShouldSeeMarkingOfItem("Status", false);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iTeardownMyAppFrame();
	});
	QUnit.start();
});
