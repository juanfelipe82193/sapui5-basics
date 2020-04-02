sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest){
	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneyButtons - Change switches off Export Excel button");

	opaTest("#1 Check if The Main Page Coming With Title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyAppWithChange();
		// Assertions

		Then.onTheMainPage.iShouldSeeTheTable();
	});

	opaTest("#2 Check 'Export Excel' Button does not exist", function(Given, When, Then) {
		// Assertions
		Then.onTheMainPage.checkNoExportButton();
		Then.onTheMainPage.iTeardownMyApp();
	});
});
