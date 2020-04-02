sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("CRUD Journey 2");
		
//TODO: to be checked why  iCancelTheDraft(true) and iShouldSeeThePopoverWithButtonLabel("Discard") do only work in 50% of the tests being executed

		opaTest("Discard draft Pop Up in case of OP Table Item deletion (1)", function (Given, When, Then) {
			Given.iStartTheListReport();
			When.onTheGenericListReport
				.iSetTheFilter({Field:"editStateFilter", Value:4})
				.and
				.iExecuteTheSearch()
				.and
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});

			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iClickTheButtonHavingLabel("Sales Order Items");

			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([1],true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");
			
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Delete");
				
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 70 (SalesOrderItem)?");

		});
			
		opaTest("Discard draft Pop Up in case of OP Table Item deletion (2)", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete")
				.and
				.iClickTheButtonWithId("discard");   

			Then.onTheGenericObjectPage
				.iShouldSeeThePopoverWithButtonLabel("Discard");
		});
		
		opaTest("TC-1: Message Toast on successful lineitem deletion on Different OP Tables are different", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Sales Order Items")
				.and
				.iSelectListItemsByLineNo([1],true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry")
				.and
				.iClickTheButtonOnTheDialog("Delete");
				 
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Sales Order Item successfully deleted");
		});
		
		opaTest("TC-2: Message Toast on successful lineitem deletion on Different OP Tables are different", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("Contacts")
				.and
				.iSelectListItemsByLineNo([1],true, "to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iClickTheButtonWithId("to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::deleteEntry")
				.and
				.iClickTheButtonOnTheDialog("Delete");
				 
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Contact successfully deleted");
		});

		opaTest("Delete complete Object after Item deletion: Save object", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("activate");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.");
		});
		
		opaTest("Delete complete Object after Item deletion: Delete object", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete")
				.and
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericListReport
				.theResultListContainsTheCorrectNumberOfItems(19);
		});
		
		opaTest("Failing Delete scenario: Select SalesOrder with ID 500000013", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000013"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000013");
		});

		opaTest("Failing Delete scenario: Press Delete button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete object 500000013 (SalesOrder)?");
		});
		
		opaTest("Failing Delete scenario: Confirm Delete dialog", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Messages");
		});
			
		opaTest("Failing Delete scenario: Close the Delete error dialog", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Close");
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000013");
		});
		
		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyAppFrame();
			expect(0);
		});

		opaTest("Start the ObjectPage with German language", function (Given, When, Then) {
			Given.iStartTheObjectPageWithGermanLanguage();

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithLabel("Entfernen");
		});

		opaTest("Click the Delete button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithTitle("Löschen")
				.and
				.iShouldSeeTheButtonOnTheDialog("Entfernen");
		});

		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyAppFrame();
			expect(0);
		});
	}
);
