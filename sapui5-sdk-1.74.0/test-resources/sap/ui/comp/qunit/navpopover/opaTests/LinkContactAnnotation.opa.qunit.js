/* global QUnit */
sap.ui.require([
	'sap/ui/test/Opa5',
	'sap/ui/test/opaQunit',
	'sap/ui/comp/qunit/personalization/opaTests/Arrangement',
	'sap/ui/comp/qunit/personalization/opaTests/Action',
	'sap/ui/comp/qunit/personalization/opaTests/Assertion'

], function(
	Opa5,
	opaTest,
	Arrangement,
	Action,
	Assertion
) {
	'use strict';

	if (window.blanket) {
		//window.blanket.options("sap-ui-cover-only", "sap/ui/comp");
		window.blanket.options("sap-ui-cover-never", "sap/viz");
	}

	Opa5.extendConfig({
		arrangements: new Arrangement(),
		actions: new Action(),
		assertions: new Assertion(),
		viewNamespace: "view."
	});

	opaTest("When I look at the screen, a table with SmartLinks should appear", function(Given, When, Then) {
		Given.iStartMyAppInAFrame(sap.ui.require.toUrl("sap/ui/comp/qunit/navpopover/opaTests/applicationUnderTestContactAnnotation/start.html"));

		When.iLookAtTheScreen();

		Then.iShouldSeeVisibleColumnsInOrder("sap.m.Column", [
			"Product ID", "Product Name", "Supplier ID", "Empty ID"
		]);
		Then.iShouldSeeColumnOfSmartLinks("Product ID");
		Then.iShouldSeeColumnOfSmartLinks("Product Name");
		Then.iShouldSeeColumnOfSmartLinks("Supplier ID");
		Then.iShouldSeeColumnOfSmartLinks("Empty ID");
	});

	opaTest("When I click on '1239102' link in the 'Product ID' column, popover should show contact annotation", function(Given, When, Then) {
		When.iClickOnLink("1239102");

		Then.iShouldSeeNavigationPopoverOpens();
		Then.contactInformationExists();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Alpha", "Beta"
		]);

		Given.closeAllNavigationPopovers();
	});

	opaTest("When I click on 'Power Projector 4713' link in the 'Product Name' column, popover should show contact annotation", function(Given, When, Then) {
		When.iClickOnLink("Power Projector 4713");

		Then.iShouldSeeNavigationPopoverOpens();
		Then.contactInformationExists();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Alpha", "Beta"
		]);

		Given.closeAllNavigationPopovers();
	});

	opaTest("When I click on '1234567890.0' link in the 'Supplier ID' column, popover should show contact annotation", function(Given, When, Then) {
		When.iClickOnLink("1234567890.0");

		Then.iShouldSeeNavigationPopoverOpens();
		Then.contactInformationExists();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Alpha", "Beta"
		]);

		Given.closeAllNavigationPopovers();
	});

	opaTest("When I click on 'ABC' link in the 'Empty ID' column, popover should not show contact annotation", function(Given, When, Then) {
		When.iClickOnLink("ABC");

		Then.iShouldSeeNavigationPopoverOpens();
		Then.iShouldSeeOrderedLinksOnNavigationContainer([
			"Alpha", "Beta"
		]);

		Given.closeAllNavigationPopovers();
		Then.iTeardownMyAppFrame();
	});

	QUnit.start();
});
