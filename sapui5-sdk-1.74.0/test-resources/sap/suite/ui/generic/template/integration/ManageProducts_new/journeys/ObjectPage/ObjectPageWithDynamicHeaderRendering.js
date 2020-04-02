sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {	
		"use strict";

		QUnit.module("Object Page Dynamic Header Rendering");

		opaTest("The Dynamic header is rendered correctly", function(Given, When, Then) {
			// arrangements
			Given.iStartTheObjectPage("manifestDynamicHeaderInFCL");

			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheObjectPage
				.theHeaderImageShouldBeAvatar()
				.and
				.theObjectMarkerIsInContentAggregation()
				.and
				.theLayoutActionsShouldBeSeparatedFromGlobalActions();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheControlWithId("template::ObjectPage::ObjectPageVariant");
			});
		
		opaTest("The Collapse and Pin Header Button is correctly rendered", function(Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen();

			// assertions
			Then.onTheObjectPage.theToggleHeaderOnTitleClickPropertyIs(true);

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-collapseBtn")
				.and
				.iShouldSeeTheButtonWithId("objectPage-OPHeaderContent-pinBtn");
		});
		
		opaTest("The Expand Header Button is correctly rendered", function(Given, When, Then) {
			// actions
			When.onTheObjectPage
				.iCollapseHeader();

			// assertions
			Then.onTheGenericObjectPage.iShouldSeeTheButtonWithId("template::ObjectPage::ObjectPageHeader-expandBtn");
		});
		
		opaTest("The Default Inline Create Sort is disabled", function(Given, When, Then) {
			// actions
			When.onTheObjectPage.iLookAtTheScreen()
				.and
				.iScrollDownToResponsiveTable();

			// assertions
			Then.onTheObjectPage
				.iCheckTableForDefaultInlineCreateSort(false);
		});
		
		opaTest("The Expand/Collapse Header Button is not rendered in Edit Mode", function(Given, When, Then) {
			// actions
			When.onTheGenericObjectPage
				.iClickTheEditButton();

			// assertions
			Then.onTheObjectPage
				.theToggleHeaderOnTitleClickPropertyIs(false);
			Then.iTeardownMyApp();
		});
	}
);
