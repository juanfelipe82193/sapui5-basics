QUnit.config.autostart = false;
sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"test/sap/rules/ui/TestUtils",
	"sap/ui/test/actions/EnterText",
	"sap/rules/ui/integration/pages/DecisionTable",
	"sap/rules/ui/integration/pages/DecisionTableCell",
	"sap/rules/ui/integration/pages/ExpressionAdvanced",
	"sap/rules/ui/integration/pages/ExpressionBasic"
	
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
		fileName: "DecisionTableBasic"
	});

	var sRuleId = "0b966d1838c746299d692fc5855a475a", //"005056912EC51ED6A18FDCDE6EAEAA6F",
		version = "000001",
		sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + version + "')";
	var sViewName = "DecisionTableBasic";
	var sControlId = "myDecisionTable";
	Opa5.extendConfig({
		viewNamespace: "DecisionTableBasic.view.",
		// we only have one view
		viewName: "DecisionTableBasic",
		timeout: 20,
		pollingInterval: 100
	});

	QUnit.module("DecisionTableBasic OPA test");
	opaTest("Should load DT", function(Given, When, Then) {

		// Act
		Given.iStartMyUIComponent({
			componentConfig: {
				name: "DecisionTableBasic"
			}
		});

		//Actions
		When.onDecisionTablePage.iCanSeeDTWithData("When: DT has completed read data", sControlId, sViewName, sRulePath);

		// Assertions
		Then.onDecisionTableCellPage.iCheckAllCellsAreInput("Then: DT cell is input", sViewName, sRulePath);
	});
	opaTest("The DecisionTable condition cells should have ExpressionBasic", function(Given, When, Then) {
		for (var i=0; i<4; i++){
			When.onDecisionTableCellPage.iClickDecisionTableCell("When I click the cell", 0, i);
            Then.onDecisionTableCellPage.iCheckCellIsDecisionTableCellExpressionBasic("Then i check cell is DecisionTableCellExpressionBasic", 0, i);
            When.onDecisionTablePage.iClosePopover("When I close popover", 0, i);
            Then.onDecisionTableCellPage.iCheckPopOverIsClosed("Then: I check popover is clsoed", 0, i);
		}
	});
	
	 opaTest("Check last condition cell is ExpressionAdvanced", function(Given, When, Then) {
        When.onDecisionTableCellPage.iClickDecisionTableCell("When I click the cell", 0, 4);
        Then.onDecisionTableCellPage.iCheckCellIsDecisionTableCellExpressionAdvanced("Then i check cell is DecisionTableCellExpressionAdvanced", 0, 4);
        When.onDecisionTablePage.iClosePopover("When I close popover", 0, 4);
        Then.onDecisionTableCellPage.iCheckPopOverIsClosed("Then: I check popover is clsoed", 0, 4);
        
    });

 	QUnit.start();


	QUnit.done(function() {
		TestUtils.stopRequestRecorder();
	});
});