sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/suite/ui/commons/demokit/icecream/test/opa/startpageConfig",
	"sap/m/library"
], function(Opa5, opaTest, Config, MobileLibrary) {
	Opa5.extendConfig(Config);

	opaTest("First tile navigates to new page", function(Given, When, Then) {
		Opa5.assert.expect(2);

		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.iPressOnTheTileWithTitle("Production Process");

		// Assertions
		Then.iShouldSeeAPageWithTitle("Production Process");
		Then.iShouldSeeAButtonWithId(/navButton/);
		Then.iTeardownMyAppFrame();
	});

	opaTest("Second tile does not navigate", function(Given, When, Then) {
		Opa5.assert.expect(1);

		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.iPressOnTheTileWithTitle("Expenses Overview for 2017 in USD");

		// Assertions
		Then.iShouldSeeAPageWithTitle("Ice Cream Machine");
		Then.iTeardownMyAppFrame();
	});

	opaTest("Third tile navigates to new page", function(Given, When, Then) {
		Opa5.assert.expect(1);

		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.iPressOnTheTileWithTitle("User Reviews");

		// Assertions
		Then.iShouldSeeAPageWithTitle("Customer Reviews");
		Then.iTeardownMyAppFrame();
	});

	opaTest("Fourth tile navigates to new page", function(Given, When, Then) {
		Opa5.assert.expect(2);

		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.iPressOnTheTileWithTitle("Quality Control");

		// Assertions
		Then.iShouldSeeAPageWithTitle("Quality Control");
		Then.iShouldSeeAButtonWithId(/navButton/);
		Then.iTeardownMyAppFrame();
	});

	opaTest("Fifth tile navigates to Customer reviews timeline when Loaded", function(Given, When, Then) {
		Opa5.assert.expect(1);

		Given.iStartMyApp();

		When.iPressOnATileWithStateAndSize(
			MobileLibrary.LoadState.Loaded,
			MobileLibrary.FrameType.TwoByOne);

		Then.iShouldSeeAPageWithTitle("Customer Reviews");
		Then.iTeardownMyAppFrame();
	});

	opaTest("Fifth tile doesn't navigate anywhere when Loading", function(Given, When, Then) {
		Opa5.assert.expect(1);

		Given.iStartMyApp();

		When.iPressOnATileWithStateAndSize(
			MobileLibrary.LoadState.Loading,
			MobileLibrary.FrameType.TwoByOne
		);

		Then.iShouldSeeAPageWithTitle("Ice Cream Machine");
		Then.iTeardownMyAppFrame();
	});
});
