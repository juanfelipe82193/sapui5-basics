sap.ui.define([], function() {
	
	"use strict";

	QUnit.module("Journey - ManageProducts - ItemJourneyForLockedIcon");

	opaTest("#1 Start App And Load Item", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		When.onTheDetailPage.clickGo().and.iWaitUntilTheListIsNotVisible();
		Then.onTheDetailPage.checkLoadedItems();
	});

	opaTest("#2 Check The Navigatation To Detail Page", function(Given, When, Then) {
		// Arrangements
		When.onTheDetailPage.clickItemForDraft();
		Then.onTheDetailPage.iShouldSeeThePageTitle();
		Then.onTheDetailPage.thePageTitleIsCorrect();
	});

	opaTest("#3 Check The Navigatation To Item Page", function(Given, When, Then) {
		// Arrangements
		//Given.onTheDetailPage.clickLockedIcon();
		Then.onTheItemPage.theListIsDisplayed(); 
		When.onTheItemPage.clickDetail();
		Then.onTheItemPage.iShouldSeeThePageTitle();
		Then.onTheItemPage.thePageTitleIsCorrect();
	});

	opaTest("#4 Check locked icon", function(Given, When, Then) {
		// Arrangements
		When.onTheItemPage.clickLockedIcon();
		Then.onTheItemPage.checkLockedPopup();
	});

});