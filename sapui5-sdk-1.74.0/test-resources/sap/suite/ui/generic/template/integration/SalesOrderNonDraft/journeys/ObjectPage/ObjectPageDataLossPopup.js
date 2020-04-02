sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft Object Page");

		opaTest("Starting the Object Page directly", function (Given, When, Then) {
			// arrangements
			Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernd&sap-ui-language=en_US#/STTA_C_SO_SalesOrder_ND('500000011')");

			Then.onTheObjectPage
				.thePageShouldContainTheCorrectTitle("Sales Order");
		});

		opaTest("Navigating down to the Items Object Page", function (Given, When, Then) {
			When.onTheListReportPage
				.iClickTheItemInTheTable(3);

			Then.onTheObjectPage
				.thePageShouldContainTheCorrectTitle("Sales Order Item");
		});


		opaTest("Teardown the app", function (Given, When, Then) {
			Then.onTheListReportPage.iTeardownMyApp();
				expect(0);
		});
		
});
