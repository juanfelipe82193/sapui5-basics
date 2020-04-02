sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProductsTreeTable/utils/OpaManifest"],
	function (opaTest,OpaManifest) {
		"use strict";

		QUnit.module("Tree Table List Report");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttaproductstreetable&sap-ui-language=en_US");

			// actions
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Go");

			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Loading tree table and verify property fitContent=true for Tree Table", function (Given, When, Then) {
			// arrangements
			Given.iLookAtTheScreen();

			// actions
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Go");

			Then.onTheListReportPage
				.theTreeTableIsVisible()
				.and
				.theCustomColumnIsVisible()
				.and
				.theDynamicPagePropertyIsCorrect("fitContent",true);
		});

		opaTest("Trigger search in filterbar", function (Given, When, Then) {
			// actions
			When.onTheListReportPage
				.iSetTheSearchField("Electronics");

			Then.onTheGenericListReport
				.theResultListIsVisible();

			When.onTheListReportPage
				.iSetTheSearchField("")
		});


		opaTest("Trigger filtering in filterbar", function(Given, When, Then){

			When.onTheListReportPage
				.iSetTheFilterinFilterBar("100000046");
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Go");

			Then.onTheGenericListReport
				.theResultListIsVisible();

			When.onTheListReportPage
				.iSetTheFilterinFilterBar("");

		});

		opaTest("Check filtering tab in table personalization", function(Given, When, Then){

			When.onTheGenericListReport
				.iClickTheButtonWithIcon("sap-icon://action-settings");
			var oManifestJSONModel = OpaManifest.demokit["sample.stta.prod.man.treetable"];
			if (oManifestJSONModel.getProperty("/sap.ui.generic.app/pages/0/pages/0/component/settings/enableTableFilterInPageVariant") &&
				oManifestJSONModel.getProperty("/sap.ui.generic.app/pages/0/pages/0/component/settings/smartVariantManagement")){
				Then.onTheListReportPage
					.iSeeTheFilterOption();
			}
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Cancel");
		});

		opaTest("Trigger custom action in filterbar", function(Given, When, Then){
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Custom action");
			Then.onTheListReportPage
				.iSeeAPopup();
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("OK");
			Then.iTeardownMyApp();
		});
	}
);
