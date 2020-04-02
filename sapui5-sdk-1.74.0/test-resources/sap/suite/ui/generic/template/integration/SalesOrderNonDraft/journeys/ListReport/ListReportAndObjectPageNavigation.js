sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft List Report");

		if (sap.ui.Device.browser.firefox) {
			opaTest("Firefox detected - SKIPPED. Reason: Known issue, see ticket 1680244596", function(Given, When, Then) {
				expect(0);
			});
		}
		else {

			opaTest("Starting the app and loading data", function (Given, When, Then) {
				// arrangements 
				Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernd&sap-ui-language=en_US","manifestReuse");
	
				// actions
				When.onTheListReportPage
					.iClickTheButton("Go");
				
				Then.onTheListReportPage
					.theSmartTableIsVisible();
			});
				
			opaTest("Navigating to the Object Page", function (Given, When, Then) {
				When.onTheListReportPage
					.iClickTheItemInTheTable(2);
	
				Then.onTheObjectPage
					.thePageShouldContainTheCorrectTitle("Sales Order");
			});
			
			opaTest("Enter Edit mode of Non Draft object", function (Given, When, Then) {
				// actions
				When.onTheGenericObjectPage
					.iClickTheEditButton();
				Then.onTheGenericObjectPage
					.theObjectPageIsInEditMode();
				Then.onTheGenericObjectPage
					.theObjectPageDataFieldHasTheCorrectValue({
						Field  : "OpportunityID",
						Value : "JAMILA"
				});
			});

			opaTest("Discard Changes in Non Draft", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","2222")
					.and
					.iClickTheButtonHavingLabel("Cancel")
					.and
					.iClickTheButtonHavingLabel("Discard");
				Then.onTheGenericObjectPage
					.theObjectPageDataFieldHasTheCorrectValue({
						Field  : "OpportunityID",
						Value : "JAMILA"
				});
			});
				
			opaTest("Navigating back to the List Report", function (Given, When, Then) {
				When.onTheGenericObjectPage
					.iCloseTheObjectPage();
				
				Then.onTheListReportPage
					.theSmartTableIsVisible();
			});
			
			opaTest("Share Button Rendering on List Report", function (Given, When, Then) {
				When.onTheListReportPage
					.iClickTheShareButton()
					.and
					.iClickTheShareButton();  /*bug in Share control, Send Email and Bookmark Buttons are not rendered unless clicked on Share Icon twice*/
				
				Then.onTheListReportPage
					.theSendEmailButtonVisible() /*To Do: Not able to identify visibility of Bookmark Button*/
					.and
					.iTeardownMyApp();
			});

			opaTest("Starting the app", function (Given, When, Then) {
				// arrangements 
				Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html#SalesOrder-nondraft");

				// actions
				When.onTheListReportPage
					.iClickTheButton("Sales Order-MES(Ext nav to createMode)");
				
				Then.onTheObjectPage
					.thePageContextShouldBeCorrect()
					.and
					.iTeardownMyApp();
			});
		

		}
		
	}
);
