sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {
		"use strict";

		QUnit.module("External Navigation Inbound 5");

		opaTest("1b. ExtNav_TK_CallonExistingActiveObject_LegacyDraftUUID", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonExistingActiveObject_LegacyDraftUUID();
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened();
			Then.onTheObjectPage.iTeardownMyApp();
		});
	}
);
