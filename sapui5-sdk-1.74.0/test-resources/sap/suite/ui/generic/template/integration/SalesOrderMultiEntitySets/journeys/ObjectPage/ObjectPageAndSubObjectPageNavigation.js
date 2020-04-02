sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/ListReport",
  "sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/ObjectPage",
],
	function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - OP-SOP - FCL");

		opaTest("Internal Navigation to OP-SOP", function (Given, When, Then) {
			Given.iStartTheListReport("manifestWithFCL");

			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheGenericListReport
				 .iClickOnIconTabFilter("1");
			When.onTheListReportPage
                 .iClickTheItemInTheTable(2,1);
            When.onTheObjectPage
				 .iClickTheItemInTheTable(1);

			// assertions
			Then.onTheObjectPage
				.subObjectPageContextShouldBeCorrect();
        });

		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyApp();
			expect(0);
		});

	}
);
