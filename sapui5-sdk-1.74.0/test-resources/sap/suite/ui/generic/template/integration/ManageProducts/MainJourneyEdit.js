sap.ui.define([], function() {

	"use strict";

	QUnit.module("Journey - ManageProducts - MainJourneyEdit");

	opaTest("#1 Check if the Main Page is coming with a title", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		// Assertions
		Then.onTheMainPage.iShouldSeeTheTable();
	});

	opaTest("#2 Check if the list of Products is displayed, when Go is pressed ", function(Given, When, Then) {
		// Action
		When.onTheDetailPage.clickGo();
		Then.onTheDetailPage.checkLoadedItems();
	});

	opaTest("#3 Check The Navigatation To Detail Page", function(Given, When, Then) {
		// Arrangements
		When.onTheDetailPage.clickDetail(2);

		// Assertions
		Then.onTheDetailPage.iShouldSeeThePageTitle();
		Then.onTheDetailPage.thePageTitleIsCorrect();
	});

	opaTest("#4 Check and Click the Edit button", function(Given, When, Then) {
		// Assertions
		if (Then.onTheDetailPage.checkOverflowButtonVisible()) {
			Then.onTheDetailPage.checkOverflowButton();
		}
		//expect(0);
		//Then.onTheDetailPage.checkOverflowButton();
		//Then.onTheDetailPage.checkEditButton();
		//Then.onTheDetailPage.checkOverflowButton();

		// Action
		//When.onTheDetailPage.clickOverflow();
		//When.onTheDetailPage.clickEdit();
	});

});
