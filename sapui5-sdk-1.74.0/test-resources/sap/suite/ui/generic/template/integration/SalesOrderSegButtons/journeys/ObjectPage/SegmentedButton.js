sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order with Segmented Buttons - Object Page");

		opaTest("Starting the app and Navigating to the Object Page", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport("manifestWithoutReusable");

			// actions
			When.onTheGenericListReport
               			 .iExecuteTheSearch();
           		 When.onTheGenericListReport
                		 .iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});

           		 Then.onTheObjectPage
               			 .iShouldSeeSegmentedButton();
        });
        
        opaTest("Click on segmented button 2", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSegmentedButton("_tab2");

			Then.onTheObjectPage
				.theResultListIsVisible();
        });

		opaTest("Click on segmented button 1", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickOnSegmentedButton("_tab1");

			Then.onTheObjectPage
				.theResultListIsVisible();

			Then.onTheListReportPage.iTeardownMyApp();
        });
	}
);