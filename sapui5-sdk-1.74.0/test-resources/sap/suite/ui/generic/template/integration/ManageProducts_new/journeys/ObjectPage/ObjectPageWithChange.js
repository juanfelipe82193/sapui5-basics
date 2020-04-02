sap.ui.define(["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Object Page Rendering With Changes Applied");

		opaTest("Object page is rendered with iconTabBar", function(Given, When, Then) {
			Given.iStartTheObjectPageWithChange();
			When.onTheObjectPage.iLookAtTheScreen();
			Then.onTheObjectPage.checkObjectPageIconTabBarValue(true);
		});
		opaTest("Object page is in edit mode", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton();
			Then.onTheGenericObjectPage
				.theObjectPageIsInEditMode();
		});
		opaTest("Check Selected Section and focus", function(Given, When, Then) {
			When.onTheObjectPage
				.iWaitForTheObjectPageToLoad();
			Then.onTheGenericObjectPage
				.and
				.iCheckSelectedSectionByIdOrName("Header")
				.and
				.iExpectFocusSetOnControlById("headerEditable::com.sap.vocabularies.UI.v1.HeaderInfo::Title::Field-input");
		});
		opaTest("Add message to message popover and check message count", function(Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheButtonHavingLabel("General Information");
			When.onTheObjectPage
				.iEnterValueInField("68@#", "com.sap.vocabularies.UI.v1.FieldGroup::TechnicalData::Weight::Field-input")
				.and
				.iOpenErrorDialog()
				.and
				.iAddValidationMessagesToMessagesDialog();
			Then.onTheObjectPage
				.iCheckMessageCountForMessagePopover(2);
		});
		opaTest("Click message in message popover and check focus", function(Given, When, Then) {
			When.onTheObjectPage
				.iClickOnNthMessageInMessagePopover(2);
			Then.onTheGenericObjectPage
				.iCheckSelectedSectionByIdOrName("Header")
				.and
				.iExpectFocusSetOnControlById("headerEditable::com.sap.vocabularies.UI.v1.Identification::Price::Field-input");
		});
		opaTest("Close message popover and teardown app", function(Given, When, Then) {
			When.onTheObjectPage
				.iCloseMessagePopover();
			Then.onTheObjectPage.iTeardownMyApp();
		});
	}
);
