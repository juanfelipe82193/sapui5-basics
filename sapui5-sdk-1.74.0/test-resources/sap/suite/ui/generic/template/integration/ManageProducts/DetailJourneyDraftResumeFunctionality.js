sap.ui.define([], function() {
	
	"use strict";

	QUnit.module("Journey - ManageProducts - DetailJourneyDraftResumeFunctionality");

	opaTest("#1 Start App And Load Item", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		When.onTheDetailPage.clickGo();
		Then.onTheDetailPage.checkLoadedItems();
	});

	opaTest("#2 Check Draft Popup", function(Given, When, Then) {
		// Arrangements
		When.onTheDetailPage.clickItemForDraft();
		Then.onTheDetailPage.checkDraftPopup();
	});

	opaTest("#3 Check Draft Item Exist Or Not", function(Given, When, Then) {
		// Arrangements
		Given.onTheDetailPage.clickResume();
		Then.onTheDetailPage.thePageTitleIsCorrect();
		Given.onTheDetailPage.clickBack();
		Then.onTheMainPage.iShouldSeeTheTable();
	});
	
});