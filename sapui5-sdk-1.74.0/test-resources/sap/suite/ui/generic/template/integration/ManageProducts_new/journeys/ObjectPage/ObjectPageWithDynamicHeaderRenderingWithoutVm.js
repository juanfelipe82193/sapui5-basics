sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function(opaTest,OpaManifest) {	
		"use strict";

		QUnit.module("ObjectPageHeaderType Dynamic with No VendorLayer");

		opaTest("The save button is not rendered in Adapt filters", function(Given, When, Then) {
			// arrangements
			Given.iStartTheObjectPage("manifest_objectPageHeaderType_Dynamic_NoVendorLayer");

			// actions
			When.onTheGenericListReport
			.iClickTheButtonWithId("listReportFilter-btnFilters");

			Then.onTheGenericListReport
			.iShouldSeeTheDialogWithTitle("Adapt Filters");
			
			Then.onTheListReportPage
			.theButtonWithIdInControlTypeIsNotVisible("listReportFilter-btnSaveFilterDialog", "sap.m.AssociativeOverflowToolbar");

		});

		opaTest("Click cancel to close adapt filters Dialog", function(Given, When, Then) {
			// actions
			When.onTheListReportPage
			.iClickOnDialogButton("Cancel");

			Then.onTheGenericListReport
			.theAvailableNumberOfItemsIsCorrect(0);

		});

		opaTest("The Dynamic header is rendered correctly", function(Given, When, Then) {

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
				.iShouldNotSeeTheControlWithId("template::ObjectPage::ObjectPageVariant");
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
