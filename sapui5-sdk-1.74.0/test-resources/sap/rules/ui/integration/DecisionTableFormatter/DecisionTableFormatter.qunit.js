QUnit.config.autostart = false;
sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"test/sap/rules/ui/TestUtils",
	"test/sap/rules/ui/integration/pages/DecisionTable",
	"test/sap/rules/ui/integration/pages/DecisionTableSetting",
	"test/sap/rules/ui/integration/pages/DecisionTableCell"
], function(Opa5, opaTest, Press, EnterText, Utils) {
	"use strict";

	QUnit.module("DecisionTableFormatter OPA test");
	// set defaults

	var sRuleId = "2d1f9a7123c94d11883c8491929127a4",
		sVersion = "000001",
		sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + sVersion + "')",
		sControlId = "myDecisionTable",
		sViewName = "DecisionTableFormatter";

	var sRuleServiceURL = "/rules-service/rule_srv/";
	var sVocaServiceURL = "/rules-service/vocabulary_srv/";

	Utils.setServiceURLs(sRuleServiceURL, sVocaServiceURL);

	Utils.startRequestRecorder({
		mode: "play", //"record", play
		filePath: "./data/",
		fileName: "DecisionTableFormatter"
	});

	Opa5.extendConfig({
		viewNamespace: "DecisionTableFormatter.view.",
		// we only have one view
		viewName: "DecisionTableFormatter"
	});

	opaTest("Should load DT, and check condition cell", function(Given, When, Then) {

		// Act
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "DecisionTableFormatter"
			}
		});

		//Actions
		When.onDecisionTablePage.iCanSeeDTWithData("When: DT has completed read data", sControlId, sViewName, sRulePath);

		// Assertions
		Then.onDecisionTablePage.iCanSeeTheValue("Then: Condition Cell: (1,1) is formatted OK", 1, 0, "'10/3/80'", sViewName);
	});

	opaTest("Should check result cell", function(Given, When, Then) {

		//Actions
		When.onDecisionTablePage.iCanSeeDTWithData("When: DT has completed read data", sControlId, sViewName, sRulePath);

		// Assertions
		Then.onDecisionTablePage.iCanSeeTheValue("Then: Result Cell: (1,2) is formatted OK", 1, 1, "'10/10/15'", sViewName);
	});
	opaTest("Should check condtion cell, when changing to another valid date", function(Given, When, Then) {

		When.onDecisionTableCellPage.iClickDecisionTableCell("When: I click the DT cell", 0, 0, sViewName, sRulePath);

		Then.onDecisionTableCellPage.iCheckCellValue("I check Condition Cell: (1,1) is formatted OK, when focus in", 0, 0, "'10/3/80'");

		When.onDecisionTableCellPage
			.iChangeDecisionTableCellExpressionAdvancedValue("I change the value in EA to other valid date", 0, 0, sControlId, sViewName,
				sRulePath, "'9/9/16'");
		When.onDecisionTablePage.iClosePopover("I trigger focus out", 0, 0, sViewName, sRulePath);
		//Then.onDecisionTableCellPage.iCheckPopoverIsClosed("Then: popover is closed", sViewName);

		Then.onDecisionTableCellPage.iCheckCellValueByModel("Then: the date was formatted OK to model value", 0, 0, sControlId, sViewName,
			sRuleId, sVersion, "'2016-09-09'");
	});
	opaTest("Should check result cell, when changing to another valid date", function(Given, When, Then) {

		When.onDecisionTableCellPage.iClickDecisionTableCell("When: I click the DT cell", 0, 1, sViewName, sRulePath);

		Then.onDecisionTableCellPage.iCheckCellValue("I check Result Cell: (1,2) is formatted OK, when focus in", 0, 1, "'10/10/15'");

		When.onDecisionTableCellPage
			.iChangeDecisionTableCellExpressionAdvancedValue("I change the value in EA to other valid date", 0, 1, sControlId, sViewName,
				sRulePath, "'9/2/16'");
		When.onDecisionTablePage.iClosePopover("I trigger focus out", 0, 1, sViewName, sRulePath);
		//Then.onDecisionTableCellPage.iCheckPopoverIsClosed("Then: popover is closed", sViewName);

		Then.onDecisionTableCellPage.iCheckCellValueByModel("Then: the date was formatted OK to model value", 0, 1, sControlId, sViewName,
			sRuleId, sVersion, "'2016-09-02'");
	});
	opaTest("Should check condtion cell, when changing to an invalid date", function(Given, When, Then) {

		When.onDecisionTableCellPage
			.iClickDecisionTableCell("When: I click the DT cell", 0, 0, sViewName, sRulePath).and
			.iChangeDecisionTableCellExpressionAdvancedValue("I change the value in EA to other valid date", 0, 0, sControlId, sViewName,
				sRulePath, "'30/30/16'");
		When.onDecisionTablePage.iClosePopover("I trigger focus out", 0, 0, sViewName, sRulePath);
		//Then.onDecisionTableCellPage.iCheckPopoverIsClosed("Then: popover is closed", sViewName);

		Then.onDecisionTableCellPage.iCheckCellValueByModel("Then: the date was formatted OK to model value", 0, 0, sControlId, sViewName,
			sRuleId, sVersion, "'30/30/16'");
	});

	QUnit.start();

	QUnit.done(function() {
		Utils.stopRequestRecorder();
	});
});