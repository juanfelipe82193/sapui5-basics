sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {
		"use strict";
 
		QUnit.module("External Navigation Inbound 8");

		opaTest("1. ExtNav_TK_CallonExistingActiveObject", function(Given, When, Then) {
			// arrangements
			Given.iStartTheExtNav_TK_CallonExistingActiveObject({
				manifest: "manifestDynamicHeaderInFCLTableTabs"
			});
			// assertions
			Then.onTheObjectPage.thePageShouldBeOpened();
			Then.onTheListReportPage.theResponsiveTableIsFilledWithItems(1, "1");
			Then.onTheObjectPage.iTeardownMyApp();
		});
	}
);
