sap.ui.define(["sap/ui/test/opaQunit"], function(opaTest) {

	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneyButtons");

	opaTest("#1 Check if The Main Page Coming With Title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		// Assertions

		Then.onTheMainPage.iShouldSeeTheTable();
	});

	opaTest("#2 Check if the header and toolbar are sticky", function(Given, When, Then) {
		// Assertions
		When.onTheMainPage.clickGo();
		When.onTheMainPage.clickCheckBox();
		Then.onTheMainPage.checkForToolbarVisibility();
		Then.onTheMainPage.checkForHeaderVisibility();
		Then.onTheMainPage.iTeardownMyApp();
	});

});
