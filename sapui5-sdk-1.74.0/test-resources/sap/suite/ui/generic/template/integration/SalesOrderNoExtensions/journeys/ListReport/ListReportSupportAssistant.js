sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("SUPPORT ASSISTANT - Sales Order No Extensions - List Report");

		opaTest("SUPPORT ASSISTANT - Starting the app without loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReportIfNeeded();

			// actions
			When.onTheGenericListReport
				.iLookAtTheScreen();

			Then.onTheListReportPage.iShouldSeeNoSupportAssistantErrors(); // checks for all rules, all severities on the app

			Then.onTheListReportPage.iShouldGetSupportRuleReport();

		});


		QUnit.module("SUPPORT ASSISTANT - Teardown");

		opaTest("Teardown ", function (Given, When, Then) {
			Given.iStartTheListReportIfNeeded();

			When.onTheGenericListReport
				.iLookAtTheScreen();

			Given.iTeardownMyAppIfNeeded();
			Opa5.assert.expect(0);
		});
	}
);
