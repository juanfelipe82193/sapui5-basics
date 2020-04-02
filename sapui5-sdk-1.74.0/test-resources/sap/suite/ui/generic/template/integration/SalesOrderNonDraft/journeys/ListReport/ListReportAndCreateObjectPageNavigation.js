sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report with copy functionality");

		if (sap.ui.Device.browser.firefox) {
			opaTest("Firefox detected - SKIPPED. Reason: Known issue, see ticket 1680244596", function(Given, When, Then) {
				expect(0);
			});
		}
		else {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements 
				Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernd&sap-ui-language=en_US","manifestWithCopyBreakout");
	
				// actions
				When.onTheListReportPage
					.iClickTheButton("Go");
				
				Then.onTheListReportPage
					.theSmartTableIsVisible();
			});

			opaTest("Check for Delete Object Confirmation Pop up message", function (Given, When, Then) {
		
				When.onTheGenericListReport
					.iSelectListItemsByLineNo([2])
					.and					
					.iClickTheButtonWithId("deleteEntry");
	
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithContent("Delete object 500000012?");
			});
			
			opaTest("Copy the third line", function (Given, When, Then) {
				// Cancel the Delete Object Confirmation pop up
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("Cancel")
					.and					
					.iClickTheButtonWithId("Copy");
	
				Then.onTheObjectPage
					.thePageShouldContainTheCorrectTitle("Sales Order");
					
				Then.onTheGenericObjectPage
					.theObjectPageDataFieldHasTheCorrectValue({
						Field  : "BusinessPartnerID",
						Value : "100000005"
					})
					.and
					.iTeardownMyApp();
			});
			

		}
		
	}
);
