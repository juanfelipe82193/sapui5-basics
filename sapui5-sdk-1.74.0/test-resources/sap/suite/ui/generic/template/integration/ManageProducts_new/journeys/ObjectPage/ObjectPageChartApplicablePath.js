sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";
	 
		QUnit.module("Applicable Path Object Page Charts");
 
		opaTest("Applicable-path based Action buttons on the Object Page Chart are rendered correctly", function(Given, When, Then) {

			
			// if test is running on FF then multiple Smart Micro Charts are not rendered correctly. Only one of each type (e.g. Area, Bullet) of Smart Micro Chart is rendered and the rest cause an error.
			// needs further investigation
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Applicable Path Object Page Charts' SKIPPED. Reason: issues within OPA Framework.");
				return this;
			}

			Given.iStartTheObjectPage();
			
			When.onTheObjectPage
				.iWaitForTheObjectPageToLoad()
				.and
				.iClickOnTheSalesDataButtonInTheAnchorBar();
			
			Then.onTheObjectPage
				.theObjectPageChartIsRendered()
				.and
				.theButtonInTheObjectPageChartToolbarHasTheCorrectVisibilityAndEnablement(true, false, ["Manage Products (STTA)"]);
			Then.iTeardownMyApp();

/* TODO: currently not running because demokit app does not show SalesData chart, reactivate after refresh of demokit app			
			When.onTheObjectPage.iSelectDataPointsOnTheChart();
			
			Then.onTheObjectPage
				.theButtonInTheObjectPageChartToolbarHasTheCorrectVisibilityAndEnablement(true, true, ["Manage Products (STTA)"])
				.and
				.iTeardownMyApp();
*/
		});
	}
);
