sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Tree Table Object Page");

		opaTest("Object page title is rendered correctly", function (Given, When, Then) {
			// arrangements
			Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttaproductstreetable&sap-ui-language=en_US");

			// actions
			When.onTheGenericListReport
				.iClickTheButtonHavingLabel("Go");

			When.onTheListReportPage
				.iNavigateToObjectPage(2);

			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information"])
				.and
				.theObjectPageHeaderTitleIsCorrect("Electronics");
		});

		opaTest("Loading tree table in object Page", function (Given, When, Then) {
			// arrangements
			Given.iLookAtTheScreen();

			Then.onTheObjectPage
				.theSmartTableIsVisible()
				.and
				.theTreeTableIsVisible();
		});

		opaTest("Tree table is having the custom column in object Page", function (Given, When, Then) {
			// arrangements
			Given.iLookAtTheScreen();

			Then.onTheObjectPage
				.theCustomColumnIsVisible();
		});

		opaTest("Tree table is visible edit mode", function (Given, When, Then) {
			// arrangements
			Given.iLookAtTheScreen();

			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();

			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Edit");

			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();

			Then.onTheObjectPage
				.theTreeTableIsVisible();

			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Cancel");

			Then.onTheObjectPage
				.theTreeTableIsVisible()
		});

		opaTest("General Information facet has 2 after facet extension", function (Given, When, Then){
			Given.iLookAtTheScreen();
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information", "Sales Price table", "Simple text facet"]);
		});

		opaTest("No draft popover was seen on discarding the draft", function (Given, When, Then) {
			// arrangements
			Given.iLookAtTheScreen();

			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();

			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Edit");

			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();

			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Cancel");

			Then.onTheGenericObjectPage
				.theObjectPageIsInDisplayMode();

			Then.iTeardownMyApp();
		});
	}
);
