sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function (opaTest,OpaManifest) {
		"use strict";

		QUnit.module("Journey - ManageProducts - List Report Actions");

		opaTest("#1 Check if the Main Page shows a table", function(Given, When, Then) {
			// Arrangements
			Given.iStartTheListReport();
			// Assertions
			Then.onTheListReportPage
				.theSmartTableIsRenderedCorrectly()
				.and
				.theSmartTableHasASettingsButton();
		});

		opaTest("#2 Check Settings Popup Dialog Comes Up", function(Given, When, Then) {
			// Action
			When.onTheListReportPage.iClickSmartTableSettingButton();
			Then.onTheListReportPage
				.theSmartTableHasASettingsButtonDialogOpen()
				.and
				.iClickTheButtonWithId("STTA_MP::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--listReport-persoController-P13nDialog-cancel", "Cancel");
		});

		opaTest("#3 Check button enablement for requiresSelection - disabled buttons", function(Given, When, Then) {
			// Action
			When.onTheGenericListReport
				.iExecuteTheSearch();
			
			Then.onTheGenericListReport
				.theButtonWithLabelIsEnabled("Copy with new Supplier", true)
				.and
				.theButtonWithIdIsEnabled("addEntry", true)
				.and
				.theOverflowToolBarButtonIsEnabled("Change price", false)
				.and
				.theOverflowToolBarButtonIsEnabled("Delete", false);
		});

		opaTest("#4 Check button enablement for requiresSelection - enabled buttons", function(Given, When, Then) {
			// Action
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3]);
			
			Then.onTheGenericListReport
				.theOverflowToolBarButtonIsEnabled("Change price", true)
				.and
				.theOverflowToolBarButtonIsEnabled("Delete", true);
		});

		opaTest("#5 Critical Action Confirmation Pop-Up Custom Message", function (Given, When, Then) {
			// actions
			When.onTheGenericListReport
				.iSelectListItemsByLineNo([3], false);
			
			When.onTheListReportPage
				.iSelectAnItemWithDraftStatus("Draft")
				.and
				.iClickTheButtonInTheSmartTableToolbar("Activate");
			// assertions
			Then.onTheListReportPage
				.theCriticalActionConfirmationPopUpMessageIsCorrect();
		});

		opaTest("Tear down the application", function (Given, When, Then) {
			Then.iTeardownMyApp();
			expect(0);
		});
	}
);
