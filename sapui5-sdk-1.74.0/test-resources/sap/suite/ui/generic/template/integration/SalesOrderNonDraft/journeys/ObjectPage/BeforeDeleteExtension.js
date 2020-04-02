sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft Object Page");

		opaTest("Object Page beforeDeleteExtension check", function (Given, When, Then) {
			// arrangements
			Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernd&sap-ui-language=en_US#/STTA_C_SO_SalesOrder_ND('500000011')");

			// actions
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");

			// assertions
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("My Title (Breakout)");

			Then.iTeardownMyApp();
		});

});
