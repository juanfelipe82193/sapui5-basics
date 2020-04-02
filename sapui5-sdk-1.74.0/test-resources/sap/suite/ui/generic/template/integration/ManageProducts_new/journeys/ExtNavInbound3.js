sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {
		"use strict";

		QUnit.module("External Navigation Inbound 3");

		opaTest("1. ExtNav_TK_CallonExistingActiveObject", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonExistingActiveObject();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened();
			Then.onTheObjectPage.iTeardownMyApp();
		});
	}
);
