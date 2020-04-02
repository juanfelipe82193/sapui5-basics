/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit"
], function (opaTest) {
	"use strict";

	QUnit.module("Master List");

	opaTest("Should see the master list with all entries", function (Given, When, Then) {
		Given.iStartMyApp();

		Then.onTheMasterPage.iShouldSeeTheList();

		Then.onTheMasterPage.iGoToHomeScreen();
	});

	opaTest("Should select an item from the master list", function (Given, When, Then) {
		Given.iStartMyApp();

		When.onTheMasterPage.iPressOnTheFirstObject();

		Then.onTheDetailPage.iShouldSeeTheObjectLineItemsList();

		Then.onTheDetailPage.iGoToHomeScreen();
	});
});
