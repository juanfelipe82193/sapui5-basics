sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/suite/ui/commons/demokit/icecream/test/opa/reviewsConfig",
	"sap/m/library",
	"sap/ui/test/actions/EnterText",
	"sap/ui/test/actions/Press",
	"sap/ui/test/matchers/Properties"
], function(Opa5, opaTest, Config, MobileLibrary, EnterText, Press, PropertiesMatcher) {
	Opa5.extendConfig(Config);

	opaTest("Customer review data is entered and saved", function(Given, When, Then) {
		var USER_NAME = "John Doe",
			USER_COMMENT = "Make ice cream homemade again!";

		Opa5.assert.expect(2);

		Given.iStartMyApp();

		When.iPressOnATileWithStateAndSize(MobileLibrary.LoadState.Loaded, MobileLibrary.FrameType.TwoByOne);

		When.waitFor({
			id: /input.+--timeline/i,
			actions: new EnterText({
				text: USER_NAME
			}),
			errorMessage: "The input field for customer name could not be found."
		});
		When.waitFor({
			id: /area.+--timeline/i,
			actions: new EnterText({
				text: USER_COMMENT
			}),
			errorMessage: "The text area field for customer review could not be found."
		});
		When.waitFor({
			id: /button.+--timeline/i,
			actions: new Press(),
			errorMessage: "The button for submitting the review could not be found."
		});

		Then.waitFor({
			controlType: "sap.suite.ui.commons.TimelineItem",
			matchers: [
				new PropertiesMatcher({
					title: USER_NAME,
					text: USER_COMMENT
				})
			],
			success: function(items) {
				Opa5.assert.ok(true, "The newly created item has been found.");
			},
			errorMessage: "Timeline item has not been found."
		});

		Then.waitFor({
			controlType: "sap.suite.ui.commons.TimelineItem",
			matchers: [
				new PropertiesMatcher({
					title: "",
					text: ""
				})
			],
			success: function() {
				Opa5.assert.ok(true, "There is an item without any text.");
			},
			errorMessage: "Timeline item has not been found."
		});

		Then.iTeardownMyAppFrame();
	});
});
