sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
	"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/ListReport",
  "sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/ObjectPage",
], function (opaTest) {
		"use strict";

		QUnit.module("Sales Order Multi EntitySets - List Report - FCL");

		opaTest("Internal Navigation to OP1-Tab1", function (Given, When, Then) {

			Given.iStartTheListReport("manifestWithFCL");

			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheGenericListReport
				 .iClickOnIconTabFilter("1");
			When.onTheListReportPage
				 .iClickTheItemInTheTable(2,1);

			// assertions
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect(2);
			Then.onTheGenericListReport
				.iTeardownMyApp();
        });

        opaTest("Internal Navigation to OP2-Extension", function (Given, When, Then) {
			Given.iStartTheListReport("manifestWithFCL");

			When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheGenericListReport
				 .iClickOnIconTabFilter("1");
			When.onTheListReportPage
				 .iClickTheItemInTheTable(1,1);

			// assertions
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect(1);
			Then.onTheGenericListReport
				.iTeardownMyApp();
        });

        opaTest("Internal Navigation to OP3-Tab2", function (Given, When, Then) {
			Given.iStartTheListReport("manifestWithFCL");

            When.onTheGenericListReport
				.iExecuteTheSearch();
			When.onTheGenericListReport
				 .iClickOnIconTabFilter("2");
			When.onTheListReportPage
				 .iClickTheItemInTheTable(1,2);

			// assertions
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect(3);
			Then.onTheGenericListReport
				.iTeardownMyApp();
		});

		opaTest("Create OP for EntitySet1", function (Given, When, Then) {
			Given.iStartTheListReport("manifestWithFCL");

			When.onTheListReportPage
				.iClickTheCreateButton("1");
			// assertions
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect(2);
			Then.onTheGenericListReport
				.iTeardownMyApp();
		});

		opaTest("Create OP for EntitySet2", function (Given, When, Then) {
			Given.iStartTheListReport("manifestWithFCL");

			When.onTheGenericListReport
				.iClickOnIconTabFilter("2");
			When.onTheListReportPage
				.iClickTheCreateButton("2");
			// assertions
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect(3);
			Then.onTheGenericListReport
				.iTeardownMyApp();
        });
	}
);
