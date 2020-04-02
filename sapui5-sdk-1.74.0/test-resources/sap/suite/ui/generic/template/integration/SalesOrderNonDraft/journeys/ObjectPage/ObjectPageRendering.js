sap.ui.define(["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Non Draft Object Page");

		opaTest("Proper display of header image by Avatar control", function (Given, When, Then) {
			// arrangements
			Given.iStartMyApp("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttasalesordernd&sap-ui-language=en_US#/STTA_C_SO_SalesOrder_ND('500000011')");
			
			When.onTheObjectPage
				.iLookAtTheScreen();
			
			Then.onTheObjectPage
				.iValidateHeaderImageAvatarDisplaySizeAndShape()
		});

		opaTest("Avatar control displays initials", function (Given, When, Then) {
			
			When.onTheObjectPage
				.iLookAtTheScreen();
			
			Then.onTheObjectPage
				.iSeeHeaderImageAvatarDisplayInitials();
		});

		opaTest("Object Page Header Action Delete button visibility in Display mode", function (Given, When, Then) {
	
			When.onTheObjectPage
				.iLookAtTheScreen();

			Then.onTheObjectPage
				.thePageShouldContainTheCorrectTitle("Sales Order")
				.and
				.theHeaderActionButtOnObjectPageIsPresent("Delete");
		});
				
		opaTest("Stay on Object page on performing edit and save in Object page", function (Given, When, Then){
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iSetTheObjectPageDataField("GeneralInformation","OpportunityID","1111")
				.and
				.iClickTheButtonWithId("save");
				
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("Your changes have been saved.")
				.and
				.theObjectPageIsInDisplayMode();
		});

        opaTest("Click the save button without changes", function (Given, When, Then) {
			When.onTheGenericObjectPage
				.iClickTheEditButton()
				.and
				.iClickTheButtonWithId("save");
			Then.onTheGenericObjectPage
				.iShouldSeeTheMessageToastWithText("You haven’t made any changes.")
				.and
				.theObjectPageIsInDisplayMode();
		});		

		opaTest("Object Page Header Action Delete button visibility in Edit mode", function (Given, When, Then) {
			//Actions
			When.onTheSubObjectPage
				.iClickTheButton("Edit");

			Then.onTheObjectPage
				.thePageShouldBeInEditMode()
				.and
				.theHeaderActionButtOnObjectPageIsPresent("Delete");

			Then.iTeardownMyApp();
		});		
});
