sap.ui.define([], function() {

	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneyFilters");

	opaTest("#1 Check if The Main Page Coming With Title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		// Assertions
		Then.onTheMainPage.iShouldSeeTheTable();
	});

	opaTest("#2 Check If The List Of Products Is Displayed, When The Button Is Pressed ", function(Given, When, Then) {
		// Action
		When.onTheMainPage.clickGo();
		Then.onTheMainPage.theListIsDisplayed();
	});

	opaTest("#3 Check Filter Button Working ", function(Given, When, Then) {
		// Action
		When.onTheMainPage.clickFilter();
		Then.onTheMainPage.checkFilterPopup('Adapt Filters');
	});

	opaTest("#4 Check Select Filters Popup", function(Given, When, Then) {
		When.onTheMainPage.clickFilterLink();
		Then.onTheMainPage.selectFilterPopupTitleCorrect();
	});

	opaTest("#5 Check Select Filters Working", function(Given, When, Then) {
		Given.onTheMainPage.selectFilter();
		When.onTheMainPage.clickFilterOk();
		Then.onTheMainPage.checkFilterAdded();
	});

	opaTest("#6 Check Selected Filters Working", function(Given, When, Then) {
		Given.onTheMainPage.clickFilterGo();
		Then.onTheMainPage.iShouldSeeTheTable();
		Then.onTheMainPage.checkTableEntries();
	});

	opaTest("#7 Check 'Filter(1)' Button Existence", function(Given, When, Then) {
		// Assertions
		Then.onTheDetailPage.checkFilterButtonToRemove();
	});
	
	opaTest("#8 Check Filter Popup", function(Given, When, Then) {
		When.onTheMainPage.clickFilterToRemove();
		Then.onTheMainPage.checkFilterPopup('Adapt Filters');
	});
	
	opaTest("#9 Check Filter Removal", function(Given, When, Then) {
		When.onTheMainPage.removeFilter();
		When.onTheMainPage.clickFilterGo();
		Then.onTheMainPage.iShouldSeeTheTable();
		Then.onTheMainPage.checkFilterRemoved();
	});
	
});