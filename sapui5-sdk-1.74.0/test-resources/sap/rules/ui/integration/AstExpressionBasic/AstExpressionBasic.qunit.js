QUnit.config.autostart = false;
sap.ui.require(
	["sap/ui/test/Opa5",
		"sap/ui/test/opaQunit",
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText",
		"sap/rules/ui/integration/pages/AstExpressionBasic"
	],
	function (Opa5, opaTest, Press, EnterText) {

		QUnit.module("AstExpressionBasic OPA test");

		Opa5.extendConfig({
			viewNamespace: "AstExpressionBasic.view.",
			// we only have one view
			viewName: "AstExpressionBasic",
			timeout: 1000,
			pollingInterval: 100
		});
		var sAstExpressionBasicID = "myAstExpressionBasic";
		var sViewName = "AstExpressionBasic";

		opaTest("Should see the AstExpressionBasic Editor and see tooltip", function (Given, When, Then) {
			var sPlaceholder = "Use Ctrl+Space to get suggestions.";
			Given.iStartMyUIComponent({
				componentConfig: {
					name: "AstExpressionBasic"
				}
			});
			When.onAstExpressionBasic.iCanSeeAstExpressionBasic("When: I see the AstExpressionBasic", sAstExpressionBasicID, sViewName);

			Then.onAstExpressionBasic.iCanSeeValidValueStateText("Then: AstExpressionBasic has a valid value state text").and
				.iCanSeePlaceholder("Then: AstExpressionBasic has placeholder", sPlaceholder);

			var sText = "Booking";
			for (var char in sText) {
				When.onAstExpressionBasic.iEnterExpression("When: I type  '" + sText[char] + "'", sText[char]);
			}
			//	When.onAstExpressionBasic.iEnterExpression("When: I type  'Booking'", "Booking", 'keyup');
			Then.onAstExpressionBasic.iCanSeePanelsSuggestion(
					"Then: I see suggestions panels - Vocabulary, Fixed Value", ["Vocabulary", "Fixed Value"]).and
				.iCanSeeDisplayItem(
					"Then: I see suggestions list items - Booking, Booking Hdi, Booking Table", ["Booking",
						"Booking Hdi", "Booking table", "Booking Table HDI", "booking with conn"
					]);
			When.onAstExpressionBasic.iClickOnDisplayItemList("When: I Select Booking", "Booking");
			Then.onAstExpressionBasic.iCanSeeAstExpressionBasicValue("Then: I see Booking in input", "Booking.").and
				.iCanSeePanelsSuggestion(
					"Then: I see suggestions panels - Vocabulary", ["Vocabulary"]).and
				.iCanSeeDisplayItem(
					"Then: I see suggestions list items - Book ID, CARRID, Class, Custom id, Fldate", ["Book ID",
						"CARRID", "Class", "Custom id", "Fldate"
					]);
			When.onAstExpressionBasic.iEnterExpression("When: I type  'c'", "c");
			Then.onAstExpressionBasic.iCanSeePanelsSuggestion(
					"Then: I see suggestions panels - Vocabulary", ["Vocabulary"]).and
				.iCanSeeDisplayItem(
					"Then: I see suggestions list items - CARRID, Class, Custom id", ["CARRID", "Class", "Custom id"]);

			When.onAstExpressionBasic.iClickOnDisplayItemList("When: I Select Class", "Class");
			Then.onAstExpressionBasic.iCanSeeAstExpressionBasicValue("Then: I see Booking in input", "Booking.Class ").and
				.iCanSeePanelsSuggestion(
					"Then: I see suggestions panels - Mathematical Operators,Comparison Operators,Functional Operators,Array Operators,Range Operators", [
						"Mathematical Operators", "Comparison Operators", "Array Operators", "Range Operators", "Functional Operators"
					]);

			/*When.onAstExpressionBasic.iCanSeeAstExpressionBasic("When: I see the AstExpressionBasic", sAstExpressionBasicID, sViewName).and
				.iEnterExpression("When: I type ='A'", "='");
			Then.onAstExpressionBasic.iCanSeePanelsSuggestion(
				"Then: I see suggestions panels - Fixed Value", ["Fixed Value"]);
			When.onAstExpressionBasic.iEnterExpression("When: I type ='A'", "A'");
			Then.onAstExpressionBasic.iCanSeeAstExpressionBasicValue("Then: I see Booking in input", "Booking.Class ='A'");*/

		});

		QUnit.start();
	}
);