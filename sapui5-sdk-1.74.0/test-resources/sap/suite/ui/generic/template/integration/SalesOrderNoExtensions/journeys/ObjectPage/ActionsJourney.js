sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Actions Journey");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();

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
		
		opaTest("Navigate to the ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
			Then.onTheObjectPage
				.iSeeHeaderImageAvatarDisplayTypeImageUrlIcon();
		});
		
		opaTest("Press the Share button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://action");
// deactivated because shows a popup on IE when executed on the voter build
//				.and
//				.iClickTheButtonHavingLabel("Send E-Mail");

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000");
		});

		opaTest("Navigate back to the ListReport", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();

			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		opaTest("Navigate to the ObjectPage of a Draft item", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000005"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithIcon("sap-icon://user-edit");
		});

		opaTest("Press the Draft-Info icon", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://user-edit")
			Then.onTheGenericObjectPage
				.iShouldSeeThePopoverWithTitle("Unsaved Changes");
		});

		opaTest("Navigate back to the ListReport", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Navigate to the ObjectPage of a Draft item", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000001"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid");
		});
		
		
		opaTest("Transient Message Dialog rendering TC-1", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid")
				.and
				.iClickTheButtonOnTheDialog("Set Opportunity 'ID");
			
			When.onTheObjectPage
				.iMockTransientMessagesInTheMessageModel();
			
			Then.onTheObjectPage
				.theTransientMessagesDialogIsRenderedCorrectly(4);
		});
		
		opaTest("Transient Message Dialog rendering TC-2", function (Given, When, Then) {
			When.onTheObjectPage
				.iclickOntheErrorMessageToNavigateToDetailErrorScreen("New Error Message");
		
			Then.onTheObjectPage
				.theMessageTitleIconAndDescriptionIsRenderedCorrectly("New Error Message","Error Message","error");
		});
		
		opaTest("Transient Message Dialog rendering TC-3", function (Given, When, Then) {
			When.onTheObjectPage
				.iNavigateBackFromDetailErrorsToListError();
		
			Then.onTheObjectPage
				.theTransientMessagesDialogIsRenderedCorrectly(4);
		});
		
		opaTest("Transient Message Dialog rendering TC-4", function (Given, When, Then) {
			When.onTheObjectPage
				.iclickOntheErrorMessageSegmentedButtonToFilterOutErrorsByType("warning");
		
			Then.onTheObjectPage
				.theTransientMessagesDialogIsRenderedCorrectly(1);
		});
		
		opaTest("Transient Message Dialog rendering TC-5", function (Given, When, Then) {
			When.onTheObjectPage
				.iclickOntheErrorMessageToNavigateToDetailErrorScreen("New Warning Message");
		
			Then.onTheObjectPage
				.theMessageTitleIconAndDescriptionIsRenderedCorrectly("New Warning Message","Warning Message","warning");
		});
				
		opaTest("Press the Set Opportunity action button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Close")
				.and
				.iClickTheButtonWithId("action::STTA_SALES_ORDER_WD_20_SRV.STTA_SALES_ORDER_WD_20_SRV_Entities::C_STTA_SalesOrder_WD_20Setopportunityid");
			
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Set Opportunity 'ID");
		});
		
		opaTest("Cancel the dialog", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel");
			
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001")
				.and
				.iShouldSeeTheButtonWithIcon("sap-icon://nav-back");
		});

		opaTest("Back to the List Report", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithIcon("sap-icon://nav-back");
				//.iNavigateBack();
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});
		
		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyAppFrame();
			expect(0);
		});
	}
);