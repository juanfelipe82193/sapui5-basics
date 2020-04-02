sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Navigations For Object Page and Sub Object Page");

		// Internal Linking scenario
		opaTest("Internal Linking: Load the Sales Orders", function(Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();

			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible();
		});
			
		opaTest("Internal Linking: Navigate to the Object Page", function(Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(18);
		
			When.onTheObjectPage
				.iWaitForTheObjectPageToLoad();

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000018");
		});
			
		opaTest("Internal Linking: Navigate internally to a different Sales Order", function(Given, When, Then) {
			When.onTheObjectPage
				.iClickOnALink("500000019");
			
			When.onTheObjectPage
				.iWaitForTheObjectPageToLoad();

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000019");

		});

		opaTest("Internal Linking: Back to the List Report", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back")
				.and
				.iClickTheButtonWithId("back");		// back to the list report
			
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		
		// Sub Object Page navigation
		opaTest("Reload the ListReport", function (Given, When, Then) {
			
			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();
		
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("Navigate to the ObjectPage by LineNumber", function (Given, When, Then) {
			
			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(6);
			
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000006")
				.and
				.iShouldSeeTheSections(["General Information","Sales Order Items"]);
		});

		opaTest("Navigate back to the ListReport", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("Navigate to the ObjectPage by Field/Value", function (Given, When, Then) {
			
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});
			
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002")
				.and
				.iShouldSeeTheSections(["General Information","Sales Order Items"]);
		});
		

		opaTest("Navigate to the Item ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"50"});

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("50");
		});

		opaTest("Navigate to the ScheduleLine ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_SalesOrderItemSL", 0, "C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("1");
		});

		opaTest("Navigate back to the Item", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back","C_STTA_SalesOrderItemSL_WD_20");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("50");
		});

		opaTest("Navigate back to the SalesOrder", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back","C_STTA_SalesOrderItem_WD_20");
				
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002");

			Then.onTheObjectPage.iTeardownMyApp();
		});

		
		opaTest("Load the List Report with active Sales Orders", function (Given, When, Then) {
			Given.iStartTheListReport();

			When.onTheGenericListReport
				.iSetTheFilter({Field:"editStateFilter", Value:4})
				.and
				.iExecuteTheSearch();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line:4, Field:"GrossAmount", Value:"761.24"})
				.and
				.theResultListFieldHasTheCorrectValue({Line:11, Field:"SalesOrder", Value:"500000011"});
		});

		opaTest("Navigate to the ObjectPage and check title", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000010"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000010");
		});

		opaTest("Navigate to the Item ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"50"});

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("50")
				.and
				.iShouldSeeTheSections(["General Information","Schedule Lines"])
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "ProductID",
					Value : "HT-1067"
				})
				.and
				.theObjectPageTableFieldHasTheCorrectValue("to_SalesOrderItemSL", {
					Line   : 0,
					Field  : "Quantity",
					Value : "2"
				}, "C_STTA_SalesOrderItem_WD_20");
		});
		
		opaTest("Navigate to the ScheduleLine ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByLineNo("to_SalesOrderItemSL", 0, "C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("1")
				.and
				.iShouldSeeTheSections(["General Information"])	
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "SalesOrder",
					Value : "500000010"
				});
		});

		opaTest("Breadcrumb back to the SalesOrderItem", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLastBreadCrumbLink();

			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "GrossAmount",
					Value : "21.40"
				});
		});

		opaTest("Breadcrumb back to the SalesOrder", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheLastBreadCrumbLink();

			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "BusinessPartnerID",
					Value : "100000004"
				});

		});

		opaTest("Navigation Down in Edit mode of Sub-Object Page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");

			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000001"});

			When.onTheGenericObjectPage
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"30"})
				.and
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationDown","C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("40");
		});

		opaTest("Navigation Up in Edit mode of Sub-Object Page", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateUpOrDownUsingObjectPageHeaderActionButton("NavigationUp","C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("30");

			Then.iTeardownMyAppFrame();
		});

	}
);
