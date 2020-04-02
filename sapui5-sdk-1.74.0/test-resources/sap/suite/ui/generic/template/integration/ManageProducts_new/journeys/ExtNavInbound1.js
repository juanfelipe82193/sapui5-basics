sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {
		"use strict";

		QUnit.module("External Navigation Inbound 1");

		opaTest("0. ExtNav_TK_CallonNonExistingObject", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonNonExistingObject();
			// assertions
			Then.onTheObjectPage.theMessagePageShouldBeOpened();
			Then.onTheObjectPage.iTeardownMyApp();
		});
	}
);
