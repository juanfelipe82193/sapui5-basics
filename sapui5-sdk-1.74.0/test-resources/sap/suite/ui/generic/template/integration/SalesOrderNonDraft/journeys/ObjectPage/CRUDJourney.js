sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("CRUD Journey");

		opaTest("Starting the app and loading data", function (Given, When, Then) {
			Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernd&sap-ui-language=en_US","manifestReuse");

			When.onTheGenericListReport
				.iExecuteTheSearch();
			
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(25);
		});

		opaTest("Navigate to the ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrderID", Value:"500000010"});
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("attachPageDataLoaded extension example")
				.and
				.theObjectPageHeaderTitleIsCorrect("500000010");
		});

		opaTest("Check for Delete Item Confirmation Pop up message when deleting an item from the object table", function (Given, When, Then) {
		
			When.onTheGenericObjectPage
				.iSelectListItemsByLineNo([0],true, "to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable")
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::deleteEntry");

			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete item 30?");
		});

		opaTest("Click the Edit button", function (Given, When, Then) {

			// Cancel the Delete Item Confirmation pop up
			When.onTheGenericObjectPage
			.iClickTheButtonOnTheDialog("Cancel");

			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});

		opaTest("Change the opportunity field in the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","1111");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "SalesOrderID",
					Value : "500000010"
				})
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "OpportunityID",
					Value : "1111"
				});
		});

		opaTest("Object Page Reuse Component Tests", function (Given, When, Then) {
			// Actions
			When.onTheObjectPage
				.iLookAtTheScreen();

			Then.onTheObjectPage
				.theReuseComponentGroupTitleisSeen('Reuse Group')
				.and
				.theReuseComponentIsSubSectionOfAnnotatedSection('Reuse Component bound to Root Object 2')
				.and
				.theReuseComponentSectionsGrouped('Reuse Component bound to Root Object','Reuse Component bound to Root Object 3','Reuse Group');
		});

		opaTest("Click the save button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.")
				.and
				.theListReportPageIsVisible();
		});
		
		opaTest("Click the save button without changes", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrderID", Value:"500000010"});
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iClickTheButtonWithId("save");
			Then.onTheGenericListReport
				.iShouldSeeTheMessageToastWithText("You haven’t made any changes.")
				.and
				.theListReportPageIsVisible()
				.and
				.theResultListFieldHasTheCorrectValue({Line:0, Field:"OpportunityID", Value:"1111"});
			Then.iTeardownMyAppFrame();
		});
	}
);