sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"test/sap/rules/ui/TestUtils",
	"sap/rules/ui/integration/pages/TextRule"
	// "sap/rules/ui/integration/pages/SelectFunction"
], function (Opa5, opaTest, Press, EnterText, Utils, onTextRulePage) {
	"use strict";

	Utils.startRequestRecorder({
		mode: "play", //play, record
		filePath: "data/",
		fileName: "ASTAggregateFunctions"
	});
	QUnit.module("TextRule OPA test");

	// set defaults

	var sViewName = "ASTAggregateFunctions";
	Opa5.extendConfig({
		viewNamespace: "ASTAggregateFunctions.view.",
		// we only have one view
		viewName: "ASTAggregateFunctions",
		timeout: 20,
		pollingInterval: 100
	});

	opaTest("Aggregate Functions Check for Existing Things", function (Given, When, Then) {

		Given.iStartMyUIComponent({
			componentConfig: {
				name: sViewName
			}
		});
		

		When.onTextRulePage.iExpandElseIfPanel("When: If Panel is Collapsed", sViewName, 0, false, "If").and
			.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 2, true, "Else If (2)").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 0, false).and
			.iClickOntheLink("When: I Click on Aggreagte Functions", sViewName, "Aggregate Functions");
		Then.onTextRulePage.iCanSeeLabel("Function", sViewName, "Then: Label Function Found", 0).and
			.iCanSeeLabel("Group By", sViewName, "Then: Label Attributes Found", 2).and
			.iCanSeeLabel("Where", sViewName, "Then: Label Where Found", 1).and
			.iCanSeeLabel("Function Label", sViewName, "Then: Label Function Label Found", 3).and
			.iCanSeeText("Vocabulary", sViewName, "Then: Text Vocabulary Found", 0);

	});

	opaTest("Select Functions : Forming an Expression with AVG", function (Given, When, Then) {

		When.onTextRulePage.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 0).and
			.iSelectItemInListItem("When: I Select Item in List", sViewName, "AVG").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Vocabulary", sViewName, 0, true).and
            .iClickOnDisplayItemListFromPanel("When: I Select Prdouct DataObject", sViewName, "Product", 1,
                "sap.rules.ui.ast.autoCompleteContent.AutoSuggestionVocabularyPanel").and
			.iClickOnDisplayItemList("When: I Select ProductID ", sViewName, "ProductID").and
            .iFocusOutAstExpressionBasic("When: I focus out of vocabuary field", sViewName, 0, true).and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Where", sViewName, 1, true).and
			.iClickOnDisplayItemList("When: I Select PrdouctName ", sViewName, "ProductName").and
			.iExpandPanelASTControl("When: I Expand Comparision Panle", sViewName, "Comparison Operators", true).and
			.iClickOnDisplayItemList("When: I Select =", sViewName, "=").and
			.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
			.iEnterFixedValue("100", sViewName, "When: I Enter Fixed Value as 100", 1).and
			.iClickOnButton("When I Click Apply Button", sViewName, 0);

		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, "AVG(Product) ", 0);

		When.onTextRulePage.iPressBackSpace("When: I Press BackSapce ", sViewName, 0, false, 2);

	});


	QUnit.start();

	QUnit.done(function () {
		Utils.stopRequestRecorder();
	});
});