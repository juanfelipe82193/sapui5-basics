sap.ui.define([
		"sap/ui/test/opaQunit"
	], function (opaTest) {
		"use strict";

		QUnit.module("Start App");

		opaTest("Should see the master list with all entries", function (Given, When, Then) {
			// Arrangements
			Given.iStartTheApp();

			// actions
			When.onTheListReportPage.iLookAtTheScreen();
 
			// assertions
			Then.onTheListReportPage
				.thePageShouldContainTheCorrectTitle()
				.and.iTeardownMyAppFrame();
		});
	}
);