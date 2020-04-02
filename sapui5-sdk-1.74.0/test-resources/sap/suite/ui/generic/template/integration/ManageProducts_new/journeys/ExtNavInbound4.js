sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {
		"use strict";

		QUnit.module("External Navigation Inbound 4");

		opaTest("1a. ExtNav_SK_CallonExistingActiveObject", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_SK_CallonExistingActiveObject();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened();
			Then.onTheObjectPage.iTeardownMyApp();
		});
	}
);
