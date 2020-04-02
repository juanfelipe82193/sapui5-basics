sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {	
		"use strict";

		QUnit.module("ObjectPageHeaderType Static Irrespective of Layer:");

		opaTest("The Dynamic header is rendered correctly", function(Given, When, Then) {
			// arrangements
			Given.iStartTheObjectPage("manifest_objectPageHeaderType_Static_IrrespectiveOfLayer");

			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldNotSeeTheControlWithId("template::ObjectPage::ObjectPageHeader")
				.and
				.iShouldNotSeeTheControlWithId("template::ObjectPage::ObjectPageVariant");
			Then.iTeardownMyApp();
			});
	}
);
