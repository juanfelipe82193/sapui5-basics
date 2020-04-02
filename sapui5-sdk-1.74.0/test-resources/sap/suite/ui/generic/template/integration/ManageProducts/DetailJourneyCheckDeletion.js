sap.ui.define([], function() {
	
	"use strict";

	QUnit.module("Journey - ManageProducts - DetailJourneyCheckDeletion");

	opaTest("#1 Check if the Main Page Comes With The Title", function(Given, When, Then) {
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

	opaTest("#3 Check The Navigatation To Detail Page", function(Given, When, Then) {
		// Arrangements
		When.onTheDetailPage.clickDetail(4);
		// Assertions
		Then.onTheDetailPage.iShouldSeeThePageTitle();
		Then.onTheDetailPage.thePageTitleIsCorrect();
	});

	opaTest("#4 Check Navigation After Deletion", function(Given, When, Then) {
		When.onTheDetailPage.clickDelete();
		
		Then.onTheDetailPage.checkConfirmDeletePopup();
		
		When.onTheDetailPage.clickConfirm();
		When.onTheDetailPage.clickBack();
		
		Then.onTheMainPage.iShouldSeeTheTable();
	});
 
 	opaTest("#5 Check Deletion Working", function(Given, When, Then) {
		// Assertions
		When.onTheMainPage.clickGo();
		
		Then.onTheMainPage.iShouldSeeTheTable();
		Then.onTheMainPage.checkVariableTableEntries(8);
		Then.onTheDetailPage.itemDeleted();
	});

});