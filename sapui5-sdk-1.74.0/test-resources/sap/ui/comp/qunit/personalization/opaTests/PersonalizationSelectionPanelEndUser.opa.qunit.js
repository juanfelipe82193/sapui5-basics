/* globals QUnit */

sap.ui.require([
	"sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
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

	opaTest("When start the '/navpopover/applicationUnderTest' application, some columns should be shown", function (Given, When, Then) {
		Given.iStartMyAppInAFrame('test-resources/sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTest/start.html');
		Given.iEnableTheLocalLRep();
		Given.iClearTheLocalStorageFromRtaRestart();

		Then.iShouldSeeStartRtaButton();
		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", ["Name", "Product ID", "Category"]);
		Then.iShouldSeeColumnOfSmartLinks("Name");
		Then.iShouldSeeColumnOfSmartLinks("Product ID");
		Then.iShouldSeeColumnOfSmartLinks("Category");
	});

	// ------------------------------------------------------
	// Test: deselect a item and restore
	// ------------------------------------------------------
	opaTest("When I click on 'Projector' link in the 'Category' item, popover should open with one superior link", function (Given, When, Then) {
		When.iClickOnLink("Projector");

		Then.iShouldSeeNavigationPopoverOpens();
		Then.iShouldSeeOrderedLinksOnNavigationContainer(["Category Link2"]);
		Then.iShouldSeeOnNavigationPopoverPersonalizationLinkText();
	});
	opaTest("When I click on 'More Links' button, the selection dialog opens", function (Given, When, Then) {
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
	opaTest("When I deselect the 'Category Link2' item, the 'Restore' button should be enabled", function (Given, When, Then) {
		When.iSelectLink("Category Link2");

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", false);
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

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});

	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and the initial selection should reappear", function (Given, When, Then) {
		When.iPressRestoreButton();

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

	// ------------------------------------------------------
	// Test: deselect one, select another item and restore
	// ------------------------------------------------------

	opaTest("When I deselect the 'Category Link2' item and select 'Category Link4', the 'Restore' button should be enabled", function (Given, When, Then) {
		When.iSelectLink("Category Link2");
		When.iSelectLink("Category Link4");

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link2", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link3", 1);
		Then.iShouldSeeLinkItemWithSelection("Category Link3", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link3", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link4", 2);
		Then.iShouldSeeLinkItemWithSelection("Category Link4", true);
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

	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and the initial selection should reappear", function (Given, When, Then) {
		When.iPressRestoreButton();

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

	opaTest("When I deselect the 'Category Link2' item and select 'Category Link4', the 'Restore' button should be enabled", function (Given, When, Then) {
		When.iSelectLink("Category Link2");
		When.iSelectLink("Category Link3");
		When.iSelectLink("Category Link4");

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link2", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link3", 1);
		Then.iShouldSeeLinkItemWithSelection("Category Link3", true);
		Then.iShouldSeeLinkItemAsEnabled("Category Link3", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link4", 2);
		Then.iShouldSeeLinkItemWithSelection("Category Link4", true);
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

	opaTest("When I press 'Ok' button, the dialog should close", function (Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeOrderedLinksOnNavigationContainer(["Category Link3", "Category Link4"]);
	});

	opaTest("When I click on 'More Links' button again, the selection dialog opens", function (Given, When, Then) {
		When.iPressOnLinkPersonalizationButton();

		Then.thePersonalizationDialogOpens();

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", false);
		Then.iShouldSeeLinkItemAsEnabled("Category Link2", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link3", 1);
		Then.iShouldSeeLinkItemWithSelection("Category Link3", true);
		Then.iShouldSeeLinkItemAsEnabled("Category Link3", true);

		Then.iShouldSeeLinkItemOnPosition("Category Link4", 2);
		Then.iShouldSeeLinkItemWithSelection("Category Link4", true);
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

	opaTest("When I press 'Restore' button, the 'Restore' button should be disabled and the initial selection should reappear", function (Given, When, Then) {
		When.iPressRestoreButton();

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

	opaTest("When I press 'Ok' button, the dialog should close", function (Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeOrderedLinksOnNavigationContainer(["Category Link2"]);
	});

	// ------------------------------------------------------
	// Test: deselect and select a item
	// ------------------------------------------------------

	opaTest("When I click on 'More Links' button again, the selection dialog opens", function (Given, When, Then) {
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
	opaTest("When I deselect the 'Category Link2' item, the 'Restore' button should be enabled", function (Given, When, Then) {
		When.iSelectLink("Category Link2");

		Then.iShouldSeeLinkItemOnPosition("Category Link2", 0);
		Then.iShouldSeeLinkItemWithSelection("Category Link2", false);
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

		Then.iShouldSeeRestoreButtonWhichIsEnabled(true);
	});
	opaTest("When I select the 'Category Link2' link again, the 'Restore' button should be disabled", function (Given, When, Then) {
		When.iSelectLink("Category Link2");

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
	opaTest("When I press 'Ok' button, the dialog should close", function (Given, When, Then) {
		When.iPressOkButton();

		Then.thePersonalizationDialogShouldBeClosed();
		Then.iShouldSeeOrderedLinksOnNavigationContainer(["Category Link2"]);

		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
