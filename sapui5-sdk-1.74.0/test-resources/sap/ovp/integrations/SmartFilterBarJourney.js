/*global opaTest QUnit */
sap.ui.require([], function() {

	"use strict";

	QUnit.module("Journey - OVP - SmartFilterBarJourney");

	opaTest("Check if the smart filter bar has Adapt Filters button", function(Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();
		When.onTheMainPage.iClickSmartFilterBar();
		// Assertions
		Then.onTheMainPage.iFindAdaptFiltersButton();
		
		
	});
	opaTest("Check if the Adapt Filters button is clickable", function(Given, When, Then) {
		
		//Actions
		When.onTheMainPage.iClickSmartFilterBar();
		When.onTheMainPage.iClickTheAdaptFiltersButton("Adapt Filters");
		Then.onTheMainPage.dialogOpen();
	
		
	});
    opaTest("Check if the Go Button in the Adapt Filters dialog is clickable", function(Given, When, Then) {
		
		//Actions
		When.onTheMainPage.iClickSmartFilterBar();
		When.onTheMainPage.iClickTheAdaptFiltersButton("Go");
		expect(0);
		
	});
    opaTest("Check whether filters are being applied or not", function(Given, When, Then) {
        When.onTheMainPage.iFilterBarFilter("ProductID", "AD-1000");
    
    });
});