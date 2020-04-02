sap.ui.define([], function() {
	
	"use strict";

	QUnit.module("Journey - ManageProducts - DetailJourneyForLockedIcon");

	opaTest("#1 Start App And Load Item", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		When.onTheDetailPage.clickGo().and.iWaitUntilTheListIsNotVisible();
		Then.onTheDetailPage.checkLoadedItems();
	});

	opaTest("#2 Check locked icon", function(Given, When, Then) {
		// Arrangements
		When.onTheDetailPage.clickItemForDraft();
		Then.onTheDetailPage.iShouldSeeThePageTitle();
		Then.onTheDetailPage.thePageTitleIsCorrect();
		When.onTheDetailPage.clickLockedIcon();
		Then.onTheDetailPage.checkLockedPopup();
		When.onTheDetailPage.clickBack();
		Then.onTheMainPage.iShouldSeeTheTable();
	});

});