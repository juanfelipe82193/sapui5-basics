sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {
		"use strict";

		QUnit.module("External Navigation Inbound 2");

		opaTest("0a. ExtNav_SK_CallonNonExistingObject", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_SK_CallonNonExistingObject();
			// assertions
			Then.onTheListReportPage.thePageShouldBeOpened();
			Then.onTheListReportPage.iTeardownMyApp();
		});
	}
);
