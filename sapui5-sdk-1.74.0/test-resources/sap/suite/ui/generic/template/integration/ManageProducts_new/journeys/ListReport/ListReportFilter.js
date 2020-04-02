sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function (opaTest,OpaManifest) {
		"use strict";

		QUnit.module("List Report Page - Filter Search");

			// Editing Status: 0-All 1-Own Draft 2-Locked by Another User 3-Unsaved Changes by Another User 4-No Changes
			opaTest("The Search with no Filter displays all items", function (Given, When, Then) {
				// arrangements
				Given.iStartTheListReport();
				// actions
				When.onTheGenericListReport
					.iExecuteTheSearch()
				// assertions
				Then.onTheGenericListReport
					.theResultListIsVisible()
					.and
					.theResultListContainsTheCorrectNumberOfItems(25)
					.and
					.theAvailableNumberOfItemsIsCorrect(125);
			});
			
			opaTest("Searching for 'Own Draft' in the Filter should return 25 items", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iSetTheFilter({Field:"editStateFilter", Value:2})
					.and
					.iExecuteTheSearch();

				// assertions
				Then.onTheGenericListReport
					.theResultListContainsTheCorrectNumberOfItems(25)
					.and
					.theAvailableNumberOfItemsIsCorrect(25);

				Then.onTheListReportPage
					.theResponsiveTableContainsTheCorrectItems({
						EditingStatus: 2
					});
			});
	
			opaTest("Searching for Editing Status = 'All' & Supplier = '100000046' in the Filter should return 3 items", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iSetTheFilter({Field:"editStateFilter", Value:0})
					.and
					.iSetTheFilter({Field:"Supplier", Value:"100000046"})
					.and
					.iExecuteTheSearch();
	
				// assertions
				Then.onTheGenericListReport
					.theResultListContainsTheCorrectNumberOfItems(3)
					.and
					.theAvailableNumberOfItemsIsCorrect(3);

				Then.onTheListReportPage
					.theResponsiveTableContainsTheCorrectItems({
						Supplier: "100000046",
						EditingStatus: 0
					});
			});

			opaTest("Adapt Filter: Reload all items", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iSetTheFilter({Field:"Supplier", Value:""})
					.and
					.iExecuteTheSearch();

				// assertions
				Then.onTheGenericListReport
					.theResultListContainsTheCorrectNumberOfItems(25)
					.and
					.theAvailableNumberOfItemsIsCorrect(125);
			});

			opaTest("Adapt Filter: Press the Adapt Filters action", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iClickTheButtonWithId("listReportFilter-btnFilters");

				// assertions
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Adapt Filters");
			});

			opaTest("Adapt Filter: Press link for Product Information", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iClickTheLinkWithId("listReportFilter-link-GeneralInformation");

				// assertions
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Select Filters");
			});

			opaTest("Adapt Filter: Check the Category list item", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iClickTheListItemWithLabel("Category", true);

				// assertions
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Select Filters");
			});

			opaTest("Adapt Filter: Press Go button and set filter value", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("OK")
					.and
					.iClickTheButtonOnTheDialog("Go")
					.and
					.iSetTheFilter({Field:"MainProductCategory", Value:"Computer Components"})
					.and
					.iExecuteTheSearch();

				// assertions
				Then.onTheGenericListReport
					.theAvailableNumberOfItemsIsCorrect(43);
			});

			opaTest("Adapt Filter: Again press the Adapt Filters action", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iClickTheButtonWithId("listReportFilter-btnFilters");

				// assertions
				Then.onTheGenericListReport
					.iShouldSeeTheDialogWithTitle("Adapt Filters");
			});
			
			opaTest("Adapt Filter: Press Restore and Go button", function (Given, When, Then) {
				// actions
				When.onTheGenericListReport
					.iClickTheButtonOnTheDialog("Restore")
					.and
					.iClickTheButtonOnTheDialog("Go");

				// assertions
				Then.onTheGenericListReport
					.theAvailableNumberOfItemsIsCorrect(125);
			});

			var bShowDraftToggle = OpaManifest.demokit["sample.stta.manage.products"].getProperty("/sap.ui.generic.app/settings/showDraftToggle");

			if (bShowDraftToggle) {
			QUnit.module("Show Active Items Only");

			opaTest("Check for 'Show Active Items Only' Button on the List Report", function (Given, When, Then) {
				/// actions
				When.onTheListReportPage
					.iLookAtTheScreen();

				// assertions
				Then.onTheGenericListReport
					.iShouldSeeTheControlWithId("activeStateToggle");
			});

			opaTest("Clicking on 'Show Active Items Only' button should return 122 items",function(Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonWithId("activeStateToggle")
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theResultListIsVisible()
					.and
					.theAvailableNumberOfItemsIsCorrect(122);
			});

			opaTest("Clicking on 'Show All Items(Draft and Active)' button should return 125 items",function(Given, When, Then) {
				When.onTheGenericListReport
					.iClickTheButtonWithId("activeStateToggle")
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theResultListIsVisible()
					.and
					.theAvailableNumberOfItemsIsCorrect(125);
			});

			opaTest("Changing the Editing status to 'Own Draft' should return 3 items",function(Given, When, Then) {
				When.onTheGenericListReport
					.iSetTheFilter({Field:"editStateFilter", Value:2})
					.and
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theResultListIsVisible()

				// assertions
				Then.onTheListReportPage
					.theSmartTableIsRenderedCorrectly()
			});

			opaTest("Checking if 'Show Active Items Only' button is enabled when editing status is 'All'",function(Given, When, Then) {
				When.onTheGenericListReport
					.iSetTheFilter({Field:"editStateFilter", Value:0})
					.and
					.iExecuteTheSearch()
					.and
					.iLookAtTheScreen();

				Then.onTheGenericListReport
					.theButtonWithIdIsEnabled("activeStateToggle")

			});
			}
				
			opaTest("Tear down the application", function (Given, When, Then) {
				Then.iTeardownMyApp();
				expect(0);
			});
	}
);
