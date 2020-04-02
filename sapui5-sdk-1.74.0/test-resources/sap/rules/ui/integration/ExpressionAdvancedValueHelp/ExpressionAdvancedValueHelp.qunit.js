QUnit.config.autostart = false;
sap.ui.require(
	["sap/ui/test/Opa5",
		"sap/ui/test/opaQunit",
		"sap/ui/test/actions/Press",
		"sap/ui/test/actions/EnterText",
		"test/sap/rules/ui/TestUtils",
		"sap/rules/ui/integration/pages/ExpressionAdvancedValueHelp"
	],
	function(Opa5, opaTest, Press, EnterText, Utils) {
		"use strict";

		QUnit.module("ExpressionAdvancedValueHelp OPA test");
		// set defaults

		Utils.startRequestRecorder({
			mode: "play", //"record", play
			filePath: "./data/",
			fileName: "ExpressionAdvancedValueHelp"
		});

		Opa5.extendConfig({
			viewNamespace: "ExpressionAdvancedValueHelp.view.",
			// we only have one view
			viewName: "ExpressionAdvancedValueHelp",
			autoWait: true

		});
		var sExpressionAdvancedID = "myExpressionAdvanced";
		var sViewName = "ExpressionAdvancedValueHelp";

		opaTest("Should see the ValueHelp Link in the suggestion", function(Given, When, Then) {

			Given.iStartMyUIComponent({
				componentConfig: {
					name: "ExpressionAdvancedValueHelp"
				}
			});
			//Actions

			When.onTheExpressionAdvancedValueHelpPage.iCanSeeTheExpressionAdvanced("When: I see the Expression Advanced", sExpressionAdvancedID,
					sViewName).and
				.iSelectFromAutoSuggestion("and When: I Select the Attribute having a value Help", sViewName);
			// Assertions

			Then.onTheExpressionAdvancedValueHelpPage.iCanSeeValueHelpLinkInAutoComplete("Then I can see the ValueHelp Link");
		});

		opaTest("Should see the ValueHelp Dialog on click of the valueHelp link", function(Given, When, Then) {

			//Actions

			When.onTheExpressionAdvancedValueHelpPage.iClickOnValueHelpLink("When: I Click the ValueHelp Link", sViewName);
			// Assertions
			Then.onTheExpressionAdvancedValueHelpPage.iCanSeeValueHelpDialog("Then: I can see the ValueHelp Dialog");
		});

		opaTest("Should see the filtered item selected for Value", function(Given, When, Then) {

			var sFilterValue = "0001";
			//Actions

			When.onTheExpressionAdvancedValueHelpPage.iClickOnValueInputField("When: I Click the ValueHelp Input Field", sViewName).and.
			iAddValueForFilter("and When: I add the Existing Value for the Data to be filtered ", sViewName, sFilterValue).and.
			iPressOkButton("and When: I click on the Ok Button ", "Ok", sViewName).and.
			iPressGoButton("and When: I Press the Go Button ",sViewName);
			// Assertions
			Then.onTheExpressionAdvancedValueHelpPage.iCanSeeTheFilteredValue("Then: I can see the Filter value set on the value Field",sFilterValue);
		});
		
		opaTest("Should see the selected ValueHelp", function(Given, When, Then) {

			var sFilterValue = "Category of the Product is equal to '0001'";
			//Actions

			When.onTheExpressionAdvancedValueHelpPage.iClickOnFirstFilteredItem("When: I Select the Value Help Token", sViewName);
			// Assertions
			Then.onTheExpressionAdvancedValueHelpPage.iCanSeeTheValueHelpSelected("Then: I can see the ValueHelp Selected",sViewName,sFilterValue);
		});
		QUnit.start();

		QUnit.done(function() {
			Utils.stopRequestRecorder();
		});
	}

);