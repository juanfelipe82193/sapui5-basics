sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Object Page Delete");


		opaTest("Start the app and check the number of items", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();
			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch()
			// assertions
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theAvailableNumberOfItemsIsCorrect(125);
		});
		
		opaTest("Navigate to the ObjectPage", function(Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(3);
		
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("Notebook Basic 15")
				.and
				.iShouldSeeTheSections(["General Information","Sales Data","Sales Revenue"]);
		});

		opaTest("Scroll down to table and check for sticky header and toolbar", function(Given, When, Then) {
			When.onTheObjectPage
				.iScrollDownToResponsiveTable();
			Then.onTheObjectPage
				.iShouldSeeTableToolbar()
				.and
				.iShouldSeeTableHeader();
		});
		
		opaTest("Click the Delete button", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Delete");
		});
		
		opaTest("Confirm the delete action", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericListReport
				.theAvailableNumberOfItemsIsCorrect(124);
		});
		
		opaTest("Table toolbar Create button controlled via NavigationRestrictions", function(Given, When, Then) {
			When.onTheGenericListReport
			.iNavigateFromListItemByLineNo(0);

			Then.onTheObjectPage
				.theButtonInTheObjectPageTableToolbarHasTheCorrectVisibilityAndEnablement(true,true,["Create"]);
		});

		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyApp();
			expect(0);
		});

	}
);
