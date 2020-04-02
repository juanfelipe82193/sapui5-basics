sap.ui.define([], function() {

	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneySettingsPopup");

	opaTest("#1 Check if The Main Page Coming With Title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		// Assertions
		Then.onTheMainPage.iShouldSeeTheTable();
	});
	
	opaTest("#2 Check Settings Popup Dialog Comes With The Title ", function(Given, When, Then) {
		// Action
		When.onTheMainPage.clickSetting();
		Then.onTheMainPage.dialogOpen();
	});

	opaTest("#3 Check Settings Popup Dialog Title Correct ", function(Given, When, Then) {
		Then.onTheMainPage.dialogTitle();
	});

	opaTest("#4 Check Closing Of Dialog", function(Given, When, Then) {
		When.onTheMainPage.closeDialog();
		Then.onTheMainPage.iShouldSeeTheTable();
	});
	
});