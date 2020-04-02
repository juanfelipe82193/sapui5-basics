/* globals QUnit */

sap.ui.require([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion',
	'sap/ui/Device'
], function(
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion,
	Device
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
		viewNamespace: "view.",
		autoWait: true
	});

	if (Device.browser.msie || Device.browser.edge) {
		Opa5.extendConfig({
			executionDelay: 50
		});
	}

	// ----------------------------------------------
	// Test scenario:
	//  t   Key-User   End-User   Result
	// ----------------------------------------------
	//  0                         L2 (superior link)
	// ----------------------------------------------
	//  1               L3 on     L2 (superior link)
	// 							  L3
	// ----------------------------------------------
	//  2               L3 off    L2 (superior link)
	// ----------------------------------------------
	//  3    L2 off,
	//       L3 on                 ----
	// ----------------------------------------------
	//  4               L4 on     L4
	// ----------------------------------------------
	//  5              Restore    L3
	// ----------------------------------------------

	opaTest("When I start the app again, a table with SmartLinks should appear", function(Given, When, Then) {
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/start.html');
		Given.iEnableTheLocalLRep();
		Given.iClearTheLocalStorageFromRtaRestart();

		Then.iShouldSeeStartRtaButton();
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Name", "Product ID", "Category"
		]);
		Then.iShouldSeeColumnOfSmartLinks("Name");
		Then.iShouldSeeColumnOfSmartLinks("Product ID");
		Then.iShouldSeeColumnOfSmartLinks("Category");
	});
	opaTest("When I click on 'Projector' link in the 'Category' column, popover should open with one link", function(Given, When, Then) {
		When.iClickOnLink("Projector");

		Then.iShouldSeeNavigationPopoverOpens();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2"
		]);
		Then.iShouldSeeOnNavigationPopoverPersonalizationLinkText();
	});
	opaTest("When I click on 'More Links' button, the selection dialog opens", function(Given, When, Then) {
		When.iPressOnLinkPersonalizationButton();

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", true);
		Then.iShouldSeeLinkItemAsEnabled("Category Link2", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link3", 1);
		Then.iShouldSeeLinkItemWithSelection("Category Link3", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link3", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link4", 2);
		Then.iShouldSeeLinkItemWithSelection("Category Link4", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link4", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link5", 3);
		Then.iShouldSeeLinkItemWithSelection("Category Link5", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link5", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link6", 4);
		Then.iShouldSeeLinkItemWithSelection("Category Link6", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link6", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link7", 5);
		Then.iShouldSeeLinkItemWithSelection("Category Link7", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link7", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link8", 6);
		Then.iShouldSeeLinkItemWithSelection("Category Link8", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link8", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link9", 7);
		Then.iShouldSeeLinkItemWithSelection("Category Link9", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link9", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link10", 8);
		Then.iShouldSeeLinkItemWithSelection("Category Link10", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link10", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link11", 9);
		Then.iShouldSeeLinkItemWithSelection("Category Link11", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link11", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link12", 10);
		Then.iShouldSeeLinkItemWithSelection("Category Link12", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link12", true);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I select the 'Category Link3' item, the 'Restore' button should be enabled", function(Given, When, Then) {
		When.iSelectLink("Category Link3");

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", true);
		Then.iShouldSeeLinkItemAsEnabled("Category Link2", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link3", 1);
		Then.iShouldSeeLinkItemWithSelection("Category Link3", true);
		Then.iShouldSeeLinkItemAsEnabled("Category Link3", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link4", 2);
		Then.iShouldSeeLinkItemWithSelection("Category Link4", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link4", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link5", 3);
		Then.iShouldSeeLinkItemWithSelection("Category Link5", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link5", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link6", 4);
		Then.iShouldSeeLinkItemWithSelection("Category Link6", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link6", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link7", 5);
		Then.iShouldSeeLinkItemWithSelection("Category Link7", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link7", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link8", 6);
		Then.iShouldSeeLinkItemWithSelection("Category Link8", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link8", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link9", 7);
		Then.iShouldSeeLinkItemWithSelection("Category Link9", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link9", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link10", 8);
		Then.iShouldSeeLinkItemWithSelection("Category Link10", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link10", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link11", 9);
		Then.iShouldSeeLinkItemWithSelection("Category Link11", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link11", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link12", 10);
		Then.iShouldSeeLinkItemWithSelection("Category Link12", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link12", true);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2", "Category Link3"
		]);
	});
	opaTest("When I click on 'More Links' button again, the selection dialog opens", function(Given, When, Then) {
		When.iPressOnLinkPersonalizationButton();

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", true);
		Then.iShouldSeeLinkItemAsEnabled("Category Link2", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link3", 1);
		Then.iShouldSeeLinkItemWithSelection("Category Link3", true);
		Then.iShouldSeeLinkItemAsEnabled("Category Link3", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link4", 2);
		Then.iShouldSeeLinkItemWithSelection("Category Link4", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link4", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link5", 3);
		Then.iShouldSeeLinkItemWithSelection("Category Link5", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link5", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link6", 4);
		Then.iShouldSeeLinkItemWithSelection("Category Link6", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link6", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link7", 5);
		Then.iShouldSeeLinkItemWithSelection("Category Link7", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link7", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link8", 6);
		Then.iShouldSeeLinkItemWithSelection("Category Link8", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link8", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link9", 7);
		Then.iShouldSeeLinkItemWithSelection("Category Link9", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link9", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link10", 8);
		Then.iShouldSeeLinkItemWithSelection("Category Link10", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link10", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link11", 9);
		Then.iShouldSeeLinkItemWithSelection("Category Link11", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link11", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link12", 10);
		Then.iShouldSeeLinkItemWithSelection("Category Link12", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link12", true);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I deselect the 'Category Link3' item, the 'Restore' button should be disabled", function(Given, When, Then) {
		When.iSelectLink("Category Link3");

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", true);
		Then.iShouldSeeLinkItemAsEnabled("Category Link2", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link3", 1);
		Then.iShouldSeeLinkItemWithSelection("Category Link3", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link3", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link4", 2);
		Then.iShouldSeeLinkItemWithSelection("Category Link4", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link4", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link5", 3);
		Then.iShouldSeeLinkItemWithSelection("Category Link5", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link5", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link6", 4);
		Then.iShouldSeeLinkItemWithSelection("Category Link6", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link6", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link7", 5);
		Then.iShouldSeeLinkItemWithSelection("Category Link7", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link7", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link8", 6);
		Then.iShouldSeeLinkItemWithSelection("Category Link8", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link8", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link9", 7);
		Then.iShouldSeeLinkItemWithSelection("Category Link9", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link9", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link10", 8);
		Then.iShouldSeeLinkItemWithSelection("Category Link10", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link10", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link11", 9);
		Then.iShouldSeeLinkItemWithSelection("Category Link11", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link11", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link12", 10);
		Then.iShouldSeeLinkItemWithSelection("Category Link12", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link12", true);

		Then.iShouldSeeRestoreButtonWhichIsEnabled(false);
	});
	opaTest("When I press 'Ok' button, the dialog should close", function(Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Category Link2"
		]);

		Given.closeAllNavigationPopovers();

		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
