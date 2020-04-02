sap.ui.define([], function() {

	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneySettingsPopupCheck");

	opaTest("#1 Check if The Main Page Coming With Title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		// Assertions
		Then.onTheMainPage.iShouldSeeTheTable();
	});

	opaTest("#3 Check If The List Of items Is Displayed, When The Button 'GO' Is Pressed ", function(Given, When, Then) {
		// Action
		When.onTheMainPage.clickGo();
		Then.onTheMainPage.theListIsDisplayed();
	});

	opaTest("#4 Check column before add", function(Given, When, Then) {
		Then.onTheMainPage.checkColumnBefore();
	});

	opaTest("#5 Check Settings Popup Dialog Comes With The Title ", function(Given, When, Then) {
		// Action
		When.onTheMainPage.clickSetting();
		Then.onTheMainPage.dialogOpen();
	});

	opaTest("#6 Check Settings Popup Dialog Title Correct ", function(Given, When, Then) {
		Then.onTheMainPage.dialogTitle();
	});

	opaTest("#7 Select Columns", function(Given, When, Then) {
		When.onTheMainPage.selectColumns();
		When.onTheMainPage.clickSettingOk();
		Then.onTheMainPage.iShouldSeeTheTable();
	});

//	opaTest("#8 Check column added", function(Given, When, Then) {
//		Then.onTheMainPage.checkColumnAdded();
//	});

});
