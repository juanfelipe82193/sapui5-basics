sap.ui.define([], function() {
	"use strict";

	QUnit.module("FLP Integration");

	opaTest("Should open the share menu and display the share buttons on the detail page", function(Given, When, Then) {
		// Arrangements
		Given.iStartTheApp();

		// Actions
		When.onS3ProductDisplayPage.iWaitUntilTheBusyIndicatorIsGone();
		When.onTheMasterPage.iRememberTheSelectedItem();

		// Assertions
		Then.onTheDetailPage.iShouldSeeTheRememberedObject();
		Then.onTheDetailPage.iShouldSeeTheShareEmailButton().
		and.iTeardownMyAppFrame();
	});

});