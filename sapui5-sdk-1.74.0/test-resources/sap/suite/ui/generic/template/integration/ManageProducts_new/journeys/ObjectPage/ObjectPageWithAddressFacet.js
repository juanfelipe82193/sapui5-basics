sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {
		"use strict";

		QUnit.module("Object Page Address Facet Rendering");

		opaTest("The Address Facet is rendered correctly", function(Given, When, Then) {
			// arrangements
			Given.iStartTheObjectPage("manifestAddressFacet");

			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheObjectPage
				.theHeaderFacetCommunicationAddressIsRendered();
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["Communication Address"])
				.and
				.theObjectPageDataFieldWithStableIdHasTheCorrectValue({
					StableId: "::ObjectPageSection:::AddressValue:::sFacet::",
					Field  : "GeneralInformationForm",
					Value : "Av Alicia Moreau de Justo 302\n1147 Buenos Aires\nArgentina"
				});
			Then.iTeardownMyApp();
		});
		

	}
);
