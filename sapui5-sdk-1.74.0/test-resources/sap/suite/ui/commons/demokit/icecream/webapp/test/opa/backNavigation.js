sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/suite/ui/commons/demokit/icecream/test/opa/backNavigationConfig",
	"sap/m/library"
], function(Opa5, opaTest, Config, MobileLibrary) {
	Opa5.extendConfig(Config);

	opaTest("Back navigation ends on start page for first tile", function(Given, When, Then) {
		Opa5.assert.expect(2);

		// Arrangements
		Given.iStartMyApp();
		Given.iNavigateToPageWithTileTitle("Production Process");

		// Actions
		When.iPressOnTheButtonWithId(/navButton/);

		// Assertions
		Then.iShouldSeeAPageWithTitle("Ice Cream Machine");
		Then.iTeardownMyAppFrame();
	});

	opaTest("Back navigation ends on start page for third tile", function(Given, When, Then) {
		Opa5.assert.expect(2);

		// Arrangements
		Given.iStartMyApp();
		Given.iNavigateToPageWithTileTitle("User Reviews");

		// Actions
		When.iPressOnTheButtonWithId(/navButton/);

		// Assertions
		Then.iShouldSeeAPageWithTitle("Ice Cream Machine");
		Then.iTeardownMyAppFrame();
	});

	opaTest("Back navigation ends on start page for fourth tile", function(Given, When, Then) {
		Opa5.assert.expect(2);

		// Arrangements
		Given.iStartMyApp();
		Given.iNavigateToPageWithTileTitle("Quality Control");

		// Actions
		When.iPressOnTheButtonWithId(/navButton/);

		// Assertions
		Then.iShouldSeeAPageWithTitle("Ice Cream Machine");
		Then.iTeardownMyAppFrame();
	});

	opaTest("Back navigation ends on start page for fourth tile", function(Given, When, Then) {
		Opa5.assert.expect(2);

		// Arrangements
		Given.iStartMyApp();
		Given.iNavigateToPageViaTileWithStateAndSize(MobileLibrary.LoadState.Loaded, MobileLibrary.FrameType.TwoByOne);

		// Actions
		When.iPressOnTheButtonWithId(/navButton/);

		// Assertions
		Then.iShouldSeeAPageWithTitle("Ice Cream Machine");
		Then.iTeardownMyAppFrame();
	});
});
