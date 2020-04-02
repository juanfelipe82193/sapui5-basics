sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"test/sap/rules/ui/TestUtils",
	"sap/rules/ui/integration/pages/TextRule"
], function(Opa5, opaTest, Press, EnterText, Utils, onTextRulePage) {
	"use strict";
	QUnit.module("TextRule OPA test");

	// set defaults

	var sRulePath =
		"/Projects(Id='8532ff25406345639a23aa00473caf5a',Version='000001')/Rules(Id='a61b9a342e6e464c8e68020c25044e9f',Version='000001')";
	Opa5.extendConfig({
		viewNamespace: "TextRule.view.",
		// we only have one view
		viewName: "TextRule",
		timeout: 20,
        pollingInterval: 100
	});
	/*
	1.	Text Rule Initialization
	2.	Check the following:
		a.	Page contains three panels 'If', 'Else If' and 'Else'
		b.	'IF' should contain a pre-defined value
		c.	'ELSE' should contain a pre-defined value
	*/

	opaTest("Read Text Rule", function(Given, When, Then) {
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");

		// Act
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "TextRule"
			}
		});

		Then.onTextRulePage.iCanSeeTextRuleWithData("Text Rule When: Text Rule has completed read data", "TextRule", sRulePath);
		Then.onTextRulePage.iCanSeeConditionBlock("If",0, false).and
			.iCanSeeConditionBlock("Else If",1, true).and
			.iCanSeeConditionBlock("Else",2, true);
		Then.onTextRulePage.iCanSeeConditionText("Then: I read If condition", "TextRule", "PublisherName of the Publisher is equal to 'Penguin'")
			.and
			.iCanSeeResultAttribute("Then: I read result attribute", "TextRule", "BookTitle").and
			.iCanSeeResultAttribute("Then: I read result attribute", "TextRule", "SeriesNumber");
	});
	
	opaTest("Delete Else IF blocks", function(Given, When, Then){
		When.onTextRulePage.iClickButton("When I click Delete in Else If block", "TextRule", "Delete",0);
		Then.onTextRulePage.iSeeButton("Then: I see Add Else If button", "TextRule", "Add Else If").and
		.iCanSeeConditionBlock("Else",2, true);
	});
	
	opaTest("Delete Else block", function(Given, When, Then){
		When.onTextRulePage.iClickButton("When I click Delete in Else block", "TextRule", "Delete",0);
		Then.onTextRulePage.iSeeButton("Then: I see Add Else button", "TextRule", "Add Else").and
		.iCanSeeConditionBlock("Else",2, false);
	});

	QUnit.start();

	QUnit.done(function() {
		Utils.stopRequestRecorder();
	});
});