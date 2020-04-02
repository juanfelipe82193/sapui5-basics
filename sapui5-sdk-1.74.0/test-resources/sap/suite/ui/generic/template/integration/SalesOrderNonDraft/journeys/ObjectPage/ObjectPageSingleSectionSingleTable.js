sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft Object Page");

		opaTest("Object Page Single Section Single Table", function (Given, When, Then) {
			// arrangements
			Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?responderOn=true&demoApp=sttasalesordernd&manifest=manifestOPSingleSectionSingleTable#//STTA_C_SO_SalesOrder_ND('500000010')");
			
			When.onTheObjectPage
				.iLookAtTheScreen();
			
			Then.onTheObjectPage
				.theCssClassesAndTablePropertiesAreCorrectlySet();
			
			Then.iTeardownMyApp();
		});		
});
