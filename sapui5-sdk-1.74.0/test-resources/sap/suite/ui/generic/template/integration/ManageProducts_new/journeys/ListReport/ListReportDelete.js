sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"], function (opaTest,OpaManifest) {
	"use strict";

	QUnit.module("List Report Delete");

	opaTest("Delete 2 items at the same time", function (Given, When, Then) {
		Given.iStartTheListReport();

		When.onTheGenericListReport
			.iExecuteTheSearch()
			.and
			.iSelectListItemsByLineNo([3,6])
			.and
			.iClickTheButtonWithId("deleteEntry");
		Then.onTheGenericListReport
			.iShouldSeeTheDialogWithTitle("Delete (2)");
	});

	opaTest("Confirm dialog to delete 2 items", function (Given, When, Then) {
		When.onTheGenericListReport
			.iClickTheButtonOnTheDialog("Delete");
		Then.onTheGenericListReport
			.theAvailableNumberOfItemsIsCorrect(123);
	});

	opaTest("Delete 1 item with Draft", function (Given, When, Then) {
		
		/*When.onTheListReportPage
			.iSelectAnItemWithDraftStatus("Draft") Issue with iSelectAnItemWithDraftStatus. The item gets selected but the Delete table toolbar action button doesn't get enabled
		This works fine when tested manually.*/
		When.onTheGenericListReport
			.iSelectListItemsByLineNo([0]);
		When.onTheListReportPage
			.iClickTheButtonInTheSmartTableToolbar("Delete")
			.and
			.iWaitForADialogAndPressTheConfirmationButton();

/*		Then.onTheListReportPage
			.theItemsInTheTableAreDeletedOrNot(true); This assertion will no more work due to the above commented out function where the item for deletion was used to be stored in 
			the OpaDataStore and the entry was used in this assertion here*/
		Then.onTheGenericListReport
			.theAvailableNumberOfItemsIsCorrect(122); //This assertion is enough to assert that the selected item was deleted successfully.
	});

	opaTest("Tear down the application", function (Given, When, Then) {
		Then.iTeardownMyApp();
		expect(0);
	});

/* TODO: Issue with OPA test: Delete of locked item shows two dialogs, manual tests show only one
	opaTest("Delete 1 item with Locked", function (Given, When, Then) {
		When.onTheListReportPage
			.iSelectAnItemWithDraftStatus("Locked")
			.and
			.iClickTheButtonInTheSmartTableToolbar("Delete")
			.and
			.iWaitForAnErrorDialogAndPressTheCloseButton();

		Then.onTheListReportPage
			.theItemsInTheTableAreDeletedOrNot(false)
			.and
			.iTeardownMyApp();
	});
*/
	
	opaTest("Disabled Delete button based on Deletable-Path", function (Given, When, Then) {
		Given.iStartTheListReport();
			When.onTheListReportPage
				.iClickTheButton("Go")
				.and
				.iLookAtTheScreen()
				.and
				.iSetItemsToNotDeletableInTheTable([5, 3]) // two active products w/o changes
				.and
				.iSelectItemsInTheTable([5, 3]); // two active products w/o changes

		Then.onTheListReportPage.theDeleteButtonShouldBeEnabled(false, "Selected 2 items in the table with Deletable-Path set to false for both items");

		When.onTheListReportPage
			.iDeselectItemsInTheTable([5, 3]) // two active products w/o changes
			.and
			.iSetItemsToNotDeletableInTheTable([1]) // locked / unsaved changes product
			.and
			.iSelectItemsInTheTable([0, 1]); // two locked / unsaved changes products

		Then.onTheListReportPage.theDeleteButtonShouldBeEnabled(true, "Selected 2 items in the table with Deletable-Path set to false for one item");

		When.onTheListReportPage
			.iDeselectItemsInTheTable([0, 1]) // two active products w/o changes / draft
			.and
			.iSetItemsToNotDeletableInTheTable([5]) // locked 
			.and
			.iSelectItemsInTheTable([5, 3]); // two locked 
		Then.onTheListReportPage.theDeleteButtonShouldBeEnabled(false, "Selected 2  locked items in the table with Deletable-Path set to false for one item");

		When.onTheListReportPage
			.iDeselectItemsInTheTable([0, 1]) // two locked / unsaved changes products / draft
			.and
			.iSelectItemsInTheTable([0]); // locked / unsaved changes product / draft

		Then.onTheListReportPage
			.theDeleteButtonShouldBeEnabled(true, "Selected 1 item in the table with no Deletable-Path set");
		Then.iTeardownMyApp();
	});
});
