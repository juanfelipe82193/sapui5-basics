sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function (opaTest,OpaManifest) {
		"use strict";

		QUnit.module("List Report Page Rendering");

			opaTest("The Filter Bar is rendered correctly", function (Given, When, Then) {
				// arrangements
				Given.iStartTheListReport();

			// actions
			When.onTheListReportPage
				.iClickTheButton("Go")
				.and
				.iLookAtTheScreen();

			//When.onTheListReportPage.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage
				.theFilterBarIsRenderedCorrectly()
				.and
				.theFilterSelectionFieldWhenDraftIsEnabledIsRenderedCorrectly()
				.and
				.theFilterSelectionFieldWhenForABreakoutIsRenderedCorrectly();
			Then.onTheGenericListReport
				.iShouldSeeTheControlWithId("template::Share")
				.and
				.iShouldSeeTheControlWithId("template:::ListReportPage:::DynamicPageTitle");
		});

		opaTest("The Table is rendered correctly and \"PopinDisplay\"=\"WithoutHeader\" for columns checked", function (Given, When, Then) {
			// actions
			When.onTheListReportPage.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage
				.theSmartTableIsRenderedCorrectly()
				.and
				.theCustomToolbarForTheSmartTableIsRenderedCorrectly()
				.and
				.theResponsiveTableInsideTheSmartTableIsRenderedCorrrectly()
				.and
				.theResponsivetableHasColumnsWithPopinDisplay("WithoutHeader");
		});

		opaTest("The Determining Actions are rendered correctly", function (Given, When, Then) {
			// actions
			When.onTheListReportPage.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage.thePageShouldContainTheCorrectDeterminingActions();
		});

		opaTest("The Table contains micro charts", function (Given, When, Then) {
				// actions
				When.onTheListReportPage
					.iClickTheButton("Go")
					.and
					.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage
				.theSmartTableContainsMicroCharts();
		});
		
		opaTest("The Table contains Rating Indicator and Progress Indicator", function (Given, When, Then) {
				// actions
				When.onTheListReportPage
					.iClickTheButton("Go")
					.and
					.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage
				.theSmartTableContainsRatingIndicator()
				.and
				.theSmartTableContainsProgressIndicator();
		});

		opaTest("Draft additional information is not displayed properly.", function (Given, When, Then) {
			// actions
			When.onTheListReportPage.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage
				.theObjectMarkerContainsUserInfo();
		});
				
		opaTest("Table contains the Image as the icon provided by the Avatar control", function (Given, When, Then) {
			// actions
			When.onTheListReportPage
				.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage
				.theSmartTableContainsAvatarImageIcon();
		});

		opaTest("Global action is present in toolbar", function (Given, When, Then) {
			// actions
			When.onTheListReportPage.iLookAtTheScreen();
			Then.onTheGenericListReport
				.iShouldSeeTheButtonWithLabel("Global Action");
		});

		opaTest("Semantic Row Highlight in LR", function (Given, When, Then) {
                  	// actions
			When.onTheListReportPage.iLookAtTheScreen();

		    	// assertions
			Then.onTheListReportPage
				.checkRowHighlight();
		});

		opaTest("New Objects without a title will have a default title.", function (Given, When, Then) {
			// actions
			When.onTheListReportPage.iLookAtTheScreen();

			// assertions
			Then.onTheListReportPage
				.checkDefaultTitle()
				.and
				.iTeardownMyApp();
		});
	}
);
