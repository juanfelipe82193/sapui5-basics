sap.ui.define(
	[],
	function() {
		"use strict";

		QUnit.module("Product Master");

		// Show the master view with product list
		opaTest("Show the master view with product list", function(Given, When, Then) {
			// Arrangements
			Given.iStartTheApp({hash: "product/HT-1000", sUrlParameters: "sap-ui-language=en-US"});
			// Actions
			When.onS3ProductDisplayPage.iWaitUntilTheBusyIndicatorIsGone();
			When.onS2ProductMasterPage.iSeeProductsOnMasterView().
			and.iWaitUntilTheItemIsSelected(0).
			and.iGetTitleOfItem(0);
			When.onS3ProductDisplayPage.iWaitUntilTheBusyIndicatorIsGone();
			//Assertions
			Then.onS3ProductDisplayPage.iCheckIfProductTitleDisplayedInDetail();
			Then.onS2ProductMasterPage.iCheckMasterListHeader();
		});

		opaTest("Select another product in the master list", function(Given, When, Then) {
			// Actions
			When.onS2ProductMasterPage.iChooseItemFromMasterList(1).
			and.iWaitUntilTheItemIsSelected(1).
			and.iGetTitleOfItem(1);
			When.onS3ProductDisplayPage.iWaitUntilTheBusyIndicatorIsGone();
			//Assertions
			Then.onS3ProductDisplayPage.iCheckIfProductTitleDisplayedInDetail();
		});

		opaTest("Sort the product list by a certain sort criteria, e.g. Product", function(Given, When, Then) {
			// Actions
			When.onS2ProductMasterPage.iOpenSortDialog().
			and.iSelectListItemInSortDialog("Product").
			and.iPressOKInSortDialog();
			//Assertions
			Then.onS2ProductMasterPage.iCheckMasterListHeader();
		});

		opaTest("Apply a Filter", function(Given, When, Then) {
			// Actions
			When.onS2ProductMasterPage.iOpenFilterDialog().
			and.iSelectAFilter("Availability").
			and.iSelectAFilter("Out of Stock").
			and.iPressOKInFilterDialog();
			//Assertions
			Then.onS2ProductMasterPage.iSeeFilterBarStatus("Filtered by Availability");
		});

		opaTest("Group the list, e.g. by Price", function(Given, When, Then) {
			// Actions
			When.onS2ProductMasterPage.iOpenGroupDialog().
			and.iSelectListItemInGroupDialog("Category").
			and.iPressOKInGroupDialog();
			//Assertions
			Then.onS2ProductMasterPage.iCheckMasterListHeader().
			and.iTeardownMyAppFrame();
		});

		opaTest("Switch the master list into the multi-select mode", function(Given, When, Then) {
			// Actions
			Given.iStartTheApp();
			When.onS3ProductDisplayPage.iWaitUntilTheBusyIndicatorIsGone();
			When.onS2ProductMasterPage.iSeeProductsOnMasterView().
			and.iClickMultiSelect();
			// Assertions
			Then.onS2ProductMasterPage.iCheckifMultiSelectIsOn();
		});

		opaTest("Sort the product list by a certain sort criteria, e.g. Product", function(Given, When, Then) {
			// Actions
			When.onS2ProductMasterPage.iOpenSortDialog().
			and.iSelectListItemInSortDialog("Product").
			and.iPressOKInSortDialog();
			//Assertions
			Then.onS2ProductMasterPage.iCheckMasterListHeader();
		});

		opaTest("Apply a Filter", function(Given, When, Then) {
			// Actions
			When.onS2ProductMasterPage.iOpenFilterDialog().
			and.iSelectAFilter("Availability").
			and.iSelectAFilter("Out of Stock").
			and.iPressOKInFilterDialog();
			//Assertions
			Then.onS2ProductMasterPage.iSeeFilterBarStatus("Filtered by Availability");
		});

		opaTest("Group the list, e.g. by Price", function(Given, When, Then) {
			// Actions
			When.onS2ProductMasterPage.iOpenGroupDialog().
			and.iSelectListItemInGroupDialog("Category").
			and.iPressOKInGroupDialog();
			//Assertions
			Then.onS2ProductMasterPage.iCheckMasterListHeader().
			and.iTeardownMyAppFrame();
		});
	}
);