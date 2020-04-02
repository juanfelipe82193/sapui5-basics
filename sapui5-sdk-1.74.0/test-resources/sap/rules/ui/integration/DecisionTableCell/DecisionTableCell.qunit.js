QUnit.config.autostart = false;
sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"test/sap/rules/ui/TestUtils",
	"sap/ui/test/actions/EnterText",
	"sap/rules/ui/integration/pages/DecisionTable",
	"sap/rules/ui/integration/pages/DecisionTableCell",
	"sap/rules/ui/integration/pages/ExpressionAdvanced"
], function(Opa5,
	opaTest,
	Press,
	TestUtils,
	EnterText) {
	"use strict";

	// set defaults

	TestUtils.startRequestRecorder({
		mode: "play", //"record", play
		filePath: "data/",
		fileName: "DecisionTableCell"
	});

	var sRuleId = "ad10d571e5d244ac8e8bc80749c95db5", //"005056912EC51ED6A18FDCDE6EAEAA6F",
		version = "000001",
		sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
	var sViewName = "DecisionTableCell";
	var sControlId = "myDecisionTable";
	Opa5.extendConfig({
		viewNamespace: "DecisionTableCell.view.",
		// we only have one view
		viewName: "DecisionTableCell",
		timeout: 20,
		pollingInterval: 100
	});

	QUnit.module("DecisionTableCell OPA test");
	opaTest("Should load DT", function(Given, When, Then) {

		// Act
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "DecisionTableCell"
			}
		});

		//Actions
		When.onDecisionTablePage.iCanSeeDTWithData("When: DT has completed read data", sControlId, sViewName, sRulePath);

		// Assertions
		Then.onDecisionTableCellPage.iCheckAllCellsAreInput("Then: DT cell is input", sViewName, sRulePath);
	});
	opaTest("Should check click cell create sap.rules.ui.ExpressionAdvanced control", function(Given, When, Then) {

		//Actions
		When.onDecisionTableCellPage.iClickDecisionTableCell("When: I click the DT cell", 0, 0, sViewName, sRulePath);

		// Assertions
		Then.onDecisionTableCellPage.iCheckCellIsDecisionTableCellExpressionAdvanced("Then: DT cell is DecisionTableCellExpressionAdvanced",
			0, 0, sControlId, sViewName, sRulePath);
	});
	opaTest("Should check validation is triggered in case value exists", function(Given, When, Then) {

		var sErrorMessage =
			"";

		//Actions
		When.onDecisionTableCellPage.iChangeDecisionTableCellExpressionAdvancedValue("When i change cell to non-valid value", 0, 0,
			sControlId, sViewName, sRulePath, "bla bla");
		When.onDecisionTablePage.iClosePopover("and When: I close popup", 0, 0, sViewName, sRulePath);
		//	When.onDecisionTableCellPage.iClickDecisionTableCell("and When: I click the DT cell", 0, 1, sViewName, sRulePath);
		When.onDecisionTableCellPage.iClickDecisionTableCell("and When: I click the DT cell", 0, 0, sViewName, sRulePath);
		// Assertions
		Then.onDecisionTableCellPage.iCheckCellValueStateText("Then: DT cell is input", 0, 0, sControlId, sViewName, sRulePath, sErrorMessage);
	});
	opaTest("Should check that validation isn't triggered in case value is empty", function(Given, When, Then) {

		var sErrorMessage = "";

		//Actions
		When.onDecisionTableCellPage.iChangeDecisionTableCellExpressionAdvancedValue("When: I change cell to valid value", 0, 0, sControlId,
			sViewName, sRulePath, "");
		When.onDecisionTablePage.iClosePopover("and When: I close popup", 0, 0, sViewName, sRulePath);
		When.onDecisionTableCellPage.iClickDecisionTableCell("and When: I click the DT cell", 0, 0, sViewName, sRulePath);

		// Assertions
		Then.onDecisionTableCellPage.iCheckCellValueStateText("Then: I check DT cell ValueStateText", 0, 0, sControlId, sViewName, sRulePath,
			sErrorMessage);
	});
	opaTest("Should Check binding", function(Given, When, Then) {

		var sValue = "bla bla";
		var sFixedOperator = "is equal to";
		var sHeader = "AuthorName of the Book";

		//Actions
		When.onDecisionTableCellPage.iChangeDecisionTableCellExpressionAdvancedValue("When: I change cell value", 0, 0, sControlId, sViewName,
			sRulePath, sValue);
		When.onDecisionTablePage.iClosePopover("and When: I close popup", 0, 0, sViewName, sRulePath);

		// Assertions
		Then.onDecisionTableCellPage.iCheckCellValueByModel("Then: I check DT value by binding", 0, 0, sControlId, sViewName, sRuleId,
				version, sValue).and
			.iCheckCellFixedOperator("and Then: I check FixedOperator", 0, 1, sControlId, sViewName, sRuleId, version,
				sFixedOperator).and
			.iCheckCellHeader("and Then: I check Header", 0, 1, sControlId, sViewName, sRuleId, version, sHeader);
	});

	opaTest("Should Check auto-complete using click the popover", function(Given, When, Then) {

		var sValue = "p";
		var sExpression = "PublisherName of the Publisher";

		//Actions
		When.onDecisionTableCellPage.iClickDecisionTableCell("When: I click the DT cell", 0, 0, sViewName, sRulePath);

		// Assertions
		Then.onDecisionTableCellPage.iCheckCellIsDecisionTableCellExpressionAdvanced("Then: DT cell is DecisionTableCellExpressionAdvanced",
			0, 0, sControlId, sViewName, sRulePath);

		//Actions
		When.onDecisionTableCellPage.iChangeDecisionTableCellExpressionAdvancedValue("When i change cell value", 0, 0, sControlId, sViewName,
			sRulePath, sValue);

		When.onTheExpressionAdvancedPage.iActivateAutoComplete("and When: I Activate the auto complete", sViewName);

		Then.onTheExpressionAdvancedPage.iCanSeeAutoComplete("Then: i can see AutoComplete hints");
		When.onTheExpressionAdvancedPage.iChooseHintFromAutoComplete("When: I press on value from auto complete", sViewName, sExpression);

		When.onDecisionTableCellPage.iClickDecisionTableCell("When: I click other DT cell", 0, 1, sViewName, sRulePath);

		Then.onDecisionTableCellPage.iCheckCellIsDecisionTableCellExpressionAdvanced("Then: DT cell is DecisionTableCellExpressionAdvanced",
			0, 1, sControlId, sViewName, sRulePath);

		Then.onTheExpressionAdvancedPage.iCheckAutoCompleteClosed("and Then: Auto complete is closed");
	});


	QUnit.start();

	QUnit.done(function() {
		TestUtils.stopRequestRecorder();
	});
});
