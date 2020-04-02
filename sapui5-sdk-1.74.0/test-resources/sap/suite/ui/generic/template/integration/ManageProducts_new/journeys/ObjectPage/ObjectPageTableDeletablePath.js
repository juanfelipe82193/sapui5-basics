sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";
	 
		QUnit.module("Deletable Path Object Page Tables");
 
		opaTest("The Delete button in Object Page Tables is rendered correctly", function(Given, When, Then) {

			// if test is running on FF then multiple Smart Micro Charts are not rendered correctly. Only one of each type (e.g. Area, Bullet) of Smart Micro Chart is rendered and the rest cause an error.
			// needs further investigation
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Deletable Path Object Page Tables' SKIPPED. Reason: issues within OPA Framework.");
				return this;
			}

			Given.iStartTheObjectPage();
			
			When.onTheObjectPage
				.iWaitForTheObjectPageToLoad()
				.and
				.iClickOnTheGeneralInformationButtonInTheAchorBar()
				.and
				.iClickOnTheProductTextNavigationInTheAnchorBarPopover();
			
			Then.onTheObjectPage
				.theObjectPageTableIsRendered()
				.and
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(false, false, ["Delete"]);
		});
		
		opaTest("The Delete button in Object Page Tables is rendered correctly after pressing Edit", function(Given, When, Then) {
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Deletable Path Object Page Tables' SKIPPED. Reason: issues within OPA Framework.");
				return this;
			}

			When.onTheObjectPage
				.iClickTheEditButton()
				.and
				.iWaitForTheObjectPageToLoad();
/*
				.and
				.iClickOnTheGeneralInformationButtonInTheAchorBar()
				.and
				.iClickOnTheProductTextNavigationInTheAnchorBarPopover();
*/
			
			Then.onTheObjectPage.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(true, false, ["Delete"]);
		});
		
		opaTest("The Delete button has the correctly enablement after selection", function(Given, When, Then) {
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Deletable Path Object Page Tables' SKIPPED. Reason: issues within OPA Framework.");
				return this;
			}

			When.onTheObjectPage.iSelectItemsInTheTable([1]);
			
			Then.onTheObjectPage.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(true, true, ["Delete"]);
			
			When.onTheObjectPage.iSelectItemsInTheTable([0]);
			
			Then.onTheObjectPage
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(true, false, ["Delete"]);
			Then.iTeardownMyApp();
		
		});
	}
);
