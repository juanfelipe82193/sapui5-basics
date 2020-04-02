sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("CRUD Journey");

		opaTest("Create: Starting the app and loading data", function (Given, When, Then) {
			// arrangements
			Given.iStartTheListReport();
			// actions
			When.onTheGenericListReport
				.iSetTheFilter({Field:"editStateFilter", Value:4})
				.and
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();
			
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line:1, Field:"TaxAmount", Value:"2331.49"});
		});

		opaTest("Cancel Edit: Click the Edit button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000000"});
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000000")
				.and
				.theObjectPageIsInEditMode();
		});

		opaTest("Cancel Edit: Click the Cancel button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard")
				.and
				.iClickTheButtonWithId("back");
			
			Then.onTheGenericListReport
				.theResultListIsVisible()
		});


/* critical because of non-visible footer bar - draft seems not to be created correctly
		opaTest("Create: Click the Create button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iClickTheCreateButton();

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("4711")
				.and
				.theObjectPageIsInEditMode();

		});
		
		opaTest("Reloading data", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard");
*/

		opaTest("Reloading data", function (Given, When, Then) {
			When.onTheGenericListReport
				.iSetTheFilter({Field:"editStateFilter", Value:0})
				.and
				.iExecuteTheSearch()
				.and
				.iLookAtTheScreen();
			
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line:10, Field:"GrossAmount", Value:"827.95"});
		});

		// check for the apply button on sub-objectpage
		opaTest("ApplyButton: Open ObjectPage with draft Sales Order", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002");
		});
		
		opaTest("ApplyButton: Navigate to the Sales Order Item #50 and check the apply button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iNavigateFromObjectPageTableByFieldValue("to_Item", {Field:"SalesOrderItem", Value:"50"});
		
			Then.onTheGenericObjectPage
				.iShouldSeeTheSections(["General Information","Schedule Lines"])
				.and
				.theObjectPageHeaderTitleIsCorrect("50");
		});

		/* to be checked: Draft for SalesOrderItems not created correctly --> footer bar not visible
		opaTest("ApplyButton: Check the Apply button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iLookAtTheScreen();

			Then.onTheGenericObjectPage
				.iShouldSeeTheButtonWithId("footerObjectPageBackTo", "C_STTA_SalesOrderItem_WD_20");
		});
		*/
		opaTest("ApplyButton: Navigate back to the List Report", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back", "C_STTA_SalesOrderItem_WD_20")
				.and
				.iClickTheButtonWithId("back");		// back to the list report
			
			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		//Check IncludeItemInSelection Event on LR
		opaTest("IncludeItemInSelection: Check in LR that list item is Selected when user performs forward/backward navigation",function(Given, When, Then){
			When.onTheGenericListReport
				.iSetThePropertyInTable("responsiveTable", "includeItemInSelection", true)
				.and
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000006"});
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");

			Then.onTheGenericListReport
				.theListItemIsSelected("responsiveTable", 6);
		});

		//Check IncludeItemInSelection Event on OP
		opaTest("IncludeItemInSelection: Check in OP that list item is Selected when user performs forward/backward navigation",function(Given, When, Then){
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000008"});
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iSetThePropertyInTable("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", "includeItemInSelection", true)
				.and
				.iNavigateFromOPListItemByFieldValue({Field:"SalesOrderItem", Value:"60"})
				.and
				.iClickTheButtonWithId("back", "C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.theListItemIsSelected("to_Item::com.sap.vocabularies.UI.v1.LineItem::responsiveTable", 0);

		});

		//Delete on Object Page
		opaTest("Delete: Check Sales Order Id on the OP Delete Confirmation Dialog",function(Given, When, Then){
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000006"})
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete");
			
			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete object 500000006 (SalesOrder)?");

		});
		
		//OPA Test to check InlineCreate entry
		opaTest("InlineCreate: Check new entry in table", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Cancel")
				.and
				.iClickTheEditButton()
				.and
				.iClickTheButtonWithId("to_Item::com.sap.vocabularies.UI.v1.LineItem::addEntry");

			Then.onTheObjectPage
				.theResponsiveTableIsFilledWithItems(4);			
		});

		//OPA test to check non existence of Delete/Create button when disabled
		opaTest("CreateDisabled: Check availability of create button in toolbar", function(Given, When, Then) {
			When.onTheGenericObjectPage;
			Then.onTheGenericObjectPage
				.iShouldNotSeeTheButtonWithIdInToolbar("to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::Table::Toolbar","to_BPAContact::com.sap.vocabularies.UI.v1.LineItem::addEntry");
		});

		// Delete on SubObjectPage workflow
		opaTest("Delete: Select a SalesOrder and navigate to ObjectPage", function(Given, When, Then) {

			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");

			When.onTheGenericListReport
				.iNavigateFromListItemByLineNo(1);
		
			When.onTheObjectPage
				.iWaitForTheObjectPageToLoad();

			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000001")
				.and
				.iShouldSeeTheSections(["General Information","Sales Order Items"])

			//Then.onTheObjectPage.theObjectPageContextShouldBeCorrect();
		});

		opaTest("Delete: The navigation from the Object Page to the Sub Object Page is correct", function(Given, When, Then) {
			// actions
			When.onTheObjectPage
				.iClickTheItemInTheTable(1);

			// assertions
			Then.onTheSubObjectPage
				.thePageContextShouldBeCorrect();
		});

		opaTest("Delete: Check for Delete button in Sub Object Page", function (Given,When, Then) {
			//actions
			When.onTheSubObjectPage
				.iWaitForTheSubObjectPageToLoad();

			//assertions
			Then.onTheSubObjectPage
				.iCheckForDeleteButtonInHeaderOfSubObjectPage();
		});

		opaTest("Delete: Press Delete button in Sub Object Page", function (Given,When, Then) {
			//actions
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("delete","C_STTA_SalesOrderItem_WD_20");

			Then.onTheGenericObjectPage
				.iShouldSeeTheDialogWithContent("Delete object 30 (SalesOrderItem)?");
		});
			
		opaTest("Delete: Confirm Delete button on the dialog", function (Given,When, Then) {
			//actions
			When.onTheGenericObjectPage
				.iClickTheButtonOnTheDialog("Delete");
/*			
			When.onTheSubObjectPage
				.iClickTheSubObjectPageDeleteButton()
				.and
				.iWaitForADialogAndPressTheConfirmationButton();
*/

			//assertions
			Then.onTheObjectPage
				.thePageShouldBeInEditMode()
				.and
				.theResponsiveTableIsFilledWithItems(9);

//			Then.iTeardownMyApp();
		});
		
		opaTest("Delete: Back to the List Report", function (Given,When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
		});

		// Edit/Save workflow
		opaTest("Edit/Save: Reloading the data", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();
			
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20);
			Then.onTheListReportPage
				.iShouldSeeTheCorrectTextForISOCurrencyCode(2, "European Euro (EUR)");
		});

		// navigate to object-page and enter Edit mode
		opaTest("Edit/Save: press Edit button", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000002"});
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000002");
		});

		opaTest("Edit/Save: Change the ISO Currency Code", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("Amount","CurrencyCode","USD");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "SalesOrder",
					Value : "500000002"
				})
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "CurrencyCode",
					Value : "USD"
				});
		});
		
		opaTest("Edit/Save: Save the order and check the text of the currency", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("activate");
			Then.onTheObjectPage
				.iShouldSeeTheCorrectTextForISOCurrencyCode("United States Dollar (USD)");
		});
		
		opaTest("Edit/Save: Navigate back to the ListReport", function (Given,When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("back");
			Then.onTheGenericListReport
				.theResultListIsVisible();
			Then.onTheListReportPage
				.iShouldSeeTheCorrectTextForISOCurrencyCode(11, "United States Dollar (USD)");
			
		});
		
		
		// Edit/Cancel workflow
		opaTest("Edit: Reloading the data", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iExecuteTheSearch();
			
			Then.onTheGenericListReport
				.theResultListIsVisible()
				.and
				.theResultListContainsTheCorrectNumberOfItems(20)
				.and
				.theResultListFieldHasTheCorrectValue({Line:10, Field:"GrossAmount", Value:"827.95"});
		});

		opaTest("Edit: Navigate to the ObjectPage", function (Given, When, Then) {
			When.onTheGenericListReport
				.iNavigateFromListItemByFieldValue({Field:"SalesOrder", Value:"500000010"});
			Then.onTheGenericObjectPage
				.theObjectPageHeaderTitleIsCorrect("500000010");
		});

		opaTest("Edit: Click the Edit button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});

		opaTest("Edit: Change the opportunity field in the ObjectPage", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","ABC");
			Then.onTheGenericObjectPage
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "SalesOrder",
					Value : "500000010"
				})
				.and
				.theObjectPageDataFieldHasTheCorrectValue({
					Field  : "OpportunityID",
					Value : "ABC"
				});
		});
		
/* alternative to iCancelTheDraft() 
		opaTest("Edit: Click the Cancel button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonWithId("discard")
				.and
				.iClickTheButtonWithId("DiscardDraftConfirmButton")
				.and
				.iClickTheButtonWithId("back");

			Then.onTheGenericListReport
				.theResultListIsVisible();
		});
*/

		opaTest("Edit: Click the Cancel button", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iCancelTheDraft(false)
				.and
				.iClickTheButtonWithId("back");

			Then.onTheGenericListReport
				.theResultListIsVisible();
		});

		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyAppFrame();
			expect(0);
		});
	}
);
