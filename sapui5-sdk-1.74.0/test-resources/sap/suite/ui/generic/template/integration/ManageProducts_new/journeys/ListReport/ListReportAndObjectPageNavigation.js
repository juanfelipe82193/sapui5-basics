sap.ui.define(["sap/ui/test/opaQunit","sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaManifest"],
	function (opaTest,OpaManifest) {
		"use strict";

		QUnit.module("Navigations For List Report and Object Page");

		opaTest("The navigation from the List Report to the Object Page is correct", function (Given, When, Then) {
			// currently these tests fail at the nightly-build on firefox, locally no issues
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
				return this;
			}

			// arrangements
			Given.iStartTheListReport();
				// actions
				When.onTheListReportPage
					.iClickTheButton("Go")
					.and
					.iClickTheItemInTheTable(3);

			// assertions
			Then.onTheObjectPage.thePageContextShouldBeCorrect();
		});

		opaTest("The navigation from the Object Page to the List Report is correct", function (Given, When, Then) {
			// currently these tests fail at the nightly-build on firefox, locally no issues
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
				return this;
			}

			// actions
			When.onTheObjectPage.iClickTheBackButton();

			// assertions
			Then.onTheListReportPage.theTableIsInTheSameStateAsBefore();
		});

		opaTest("The navigation from the List Report to the Object Page with a different item is correct", function (Given, When, Then) {
			// currently these tests fail at the nightly-build on firefox, locally no issues
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
				return this;
			}

			// actions
			When.onTheListReportPage.iClickTheItemInTheTable(5);

			// assertions
			Then.onTheObjectPage
				.thePageContextShouldBeCorrect();
		});

		opaTest("TC1: Draft Activate Confirmation Dialog", function(Given, When, Then) {
			// currently these tests fail at the nightly-build on firefox, locally no issues
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
				return this;
			}
			// actions
			When.onTheObjectPage
				.iClickTheBackButton();
			When.onTheListReportPage
				.iClickTheItemInTheTable(1);
			When.onTheObjectPage
				.iEnterValueInField("68@#", "headerEditable::com.sap.vocabularies.UI.v1.FieldGroup::GeneralInformationForHeader::Weight::Field-input")  //Enter Incorrect values to generate errors
				.and
				.iOpenErrorDialog()
				.and
				.iChangeValidationMessagesToBackendMessagesInDialog(["Warning", "Error"], "Errors and Warnings added to the Confirmation popup"); //To show combination of errors and warnings in the confirmation popup
			When.onTheObjectPage
				.iClickSave();

			Then.onTheObjectPage
				.theDraftActivateConfirmationDialogIsRenderedWithSaveButton(false);
		});

		opaTest("TC2: Draft Activate Confirmation Dialog", function(Given, When, Then) {
			// currently these tests fail at the nightly-build on firefox, locally no issues
			if (sap.ui.Device.browser.firefox) {
				ok(true, "Firefox detected - TEST 'Navigation ListReport - ObjectPage' SKIPPED. Reason: failing at NightlyBuild");
				return this;
			}

			When.onTheObjectPage
				.iWaitForADialogAndPressCancelButton()
				.and
				.iChangeValidationMessagesToBackendMessagesInDialog(["Warning"], "Only warnings added to the Confirmation popup"); //To show warnings in the confirmation popup
			When.onTheObjectPage
				.iClickSave();

			Then.onTheObjectPage
				.theDraftActivateConfirmationDialogIsRenderedWithSaveButton(true);

			When.onTheObjectPage
				.iWaitForADialogAndPressCancelButton();

			Then.iTeardownMyApp();

		});
	}
);
