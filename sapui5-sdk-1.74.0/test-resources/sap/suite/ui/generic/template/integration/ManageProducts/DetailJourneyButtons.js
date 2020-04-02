sap.ui.define([], function() {
	
	"use strict";

	QUnit.module("Journey - ManageProducts - DetailJourneyButtons");

	if (sap.ui.Device.browser.firefox) {
		opaTest("Firefox detected - SKIPPED. Reason: Known issue, see ticket 1680244596", function(Given, When, Then) {
			expect(0);
		});
	}
	else {
	
		opaTest("#1 Start App And Load Item", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();
			//When.onTheDetailPage.clickGo().and.iWaitUntilTheListIsNotVisible();
			When.onTheDetailPage.clickGo();
			Then.onTheDetailPage.checkLoadedItems();
		});
	
		opaTest("#2 Check The Navigatation and the Delete Button", function(Given, When, Then) {
			// Arrangements
			When.onTheDetailPage.clickDetail(4);
	
			// Assertions
	//		Then.onTheDetailPage.iShouldSeeThePageTitle();
	//		Then.onTheDetailPage.thePageTitleIsCorrect();
	
			Then.onTheDetailPage.checkDeleteButton();
		});
	/*
		opaTest("#3 Check Overflow Button", function(Given, When, Then) {
			Then.onTheDetailPage.checkOverflowButtonVisible();
	//		Then.onTheDetailPage.checkOverflowButton();
		});
	*/
	//	opaTest("#4 Check Delete Button Existance", function(Given, When, Then) {
			//When.onTheDetailPage.clickOverflow();
	//		Then.onTheDetailPage.checkDeleteButton();
	//	});
	
		opaTest("#5 Check Edit Button Existance", function(Given, When, Then) {
			Then.onTheDetailPage.checkEditButton();
		});
	
	//	opaTest("#5 Click Delete Button", function(Given, When, Then) {
	//		When.onTheDetailPage.clickDelete();
	//	});
	
		opaTest("#6 Check Copy Button Existance", function(Given, When, Then) {
			// When.onTheDetailPage.clickOverflow();
			Then.onTheDetailPage.checkCopyButton();
		});
		
		opaTest("#7 Back to List Report", function(Given, When, Then) {
			When.onTheDetailPage.clickBack();
			Then.onTheMainPage.iShouldSeeTheTable();
		});
	}

});