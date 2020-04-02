sap.ui.define([], function() {
	
	"use strict";

	QUnit.module("Journey - ManageProducts - DetailJourneyDraftDiscardFunctionality");

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

	opaTest("#3 Check Discard Navigation", function(Given, When, Then) {
		// Check if the discard draft functionality works or not
		When.onTheDetailPage.clickDiscard();
		Then.onTheDetailPage.thePageTitleIsCorrect();
		Given.onTheDetailPage.clickBack();
		Then.onTheMainPage.iShouldSeeTheTable();
	});

	opaTest("#4 Check Select Filter For Draft Item", function(Given, When, Then) {
		// Put filter on the draft product id, so that discard draft functionality can be checked
		When.onTheMainPage.clickFilter();
		When.onTheMainPage.clickFilterLink();
		When.onTheMainPage.selectFilter();
		When.onTheMainPage.clickFilterOk();
		Then.onTheDetailPage.checkDraftFilterAdded();
	});

	opaTest("#5 Check Item Discarded Or Not", function(Given, When, Then) {
		// Check if the item discarded successfully or not
		Given.onTheMainPage.clickFilterGo();
		Then.onTheMainPage.checkDraftItemDiscarded();
	});

});