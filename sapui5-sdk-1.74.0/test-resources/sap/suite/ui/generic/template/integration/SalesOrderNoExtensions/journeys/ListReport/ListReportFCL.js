sap.ui.define(["sap/ui/test/opaQunit", "sap/ui/test/Opa5"],
	function (opaTest, Opa5) {
		"use strict";

		QUnit.module("Sales Order No Extensions - FCL");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			/* use this in case you need lrep and navigation from LR to object page */
			//Given.iStartTheListReport();
			Given.iStartTheListReport("manifestFCL");

			/* else use this */
			//Given.iStartTheListReportComponent("manifestFCL");

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByLineNo(3);

			Then.onTheListReportPage
				.iShouldSeeTheNavigatedRowHighlighted("SOwoExt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--responsiveTable",3,true)
				.and
				.iShouldSeeTheNavigatedRowHighlighted("SOwoExt::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--responsiveTable",2,false);
		});

		opaTest("App TearDown", function (Given, When, Then) {
			Given.iTeardownMyApp();
			Opa5.assert.expect(0);
		});
	}
);
