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
		fileName: "ASTSelectFunctions"
	});
	QUnit.module("TextRule OPA test");

	// set defaults

	var sViewName = "ASTSelectFunctions";
	Opa5.extendConfig({
		viewNamespace: "ASTSelectFunctions.view.",
		// we only have one view
		viewName: "ASTSelectFunctions",
		timeout: 20,
		pollingInterval: 100
	});

	opaTest("Select Functions Check for Existing Things", function (Given, When, Then) {

		Given.iStartMyUIComponent({
			componentConfig: {
				name: sViewName
			}
		});

		When.onTextRulePage.iExpandElseIfPanel("When: If Panel is Collapsed", sViewName, 0, false, "If").and
			.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 2, true, "Else If (2)").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Condition ProductID", sViewName, 0, false).and
			.iClickOntheLink("When: I Click on Select Functions", sViewName, "Select Functions");
		Then.onTextRulePage.iCanSeeLabel("Function", sViewName, "Then: Label Function Found", 0).and
			.iCanSeeLabel("Attributes", sViewName, "Then: Label Attributes Found", 1).and
			.iCanSeeLabel("Where", sViewName, "Then: Label Where Found", 2).and
			.iCanSeeLabel("Function Label", sViewName, "Then: Label Function Label Found", 3).and
			.iCanSeeText("Count", sViewName, "Then: Text Count Label Found", 0).and
			.iCanSeeText("Vocabulary", sViewName, "Then: Label Vocabulary Found", 1).and
			.iCanSeeEnabledState(false, sViewName, "Then: I can See Count Disabled", 0);

	});

	opaTest("Select Functions : Forming an Expression with TOP", function (Given, When, Then) {

		When.onTextRulePage.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 0).and
			.iSelectItemInListItem("When: I Select Item in List", sViewName, "TOP").and
			.iEnterValueInTextArea("3", sViewName, "When: I Enter Count as 3", 0).and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 1).and
			.iSelectItemInListItem("When: I Select Customer DataObject in List", sViewName, "Customer").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Attributes", sViewName, 0, true).and
			.iClickOnDisplayItemList("When: I Select CustomerName Attribute", sViewName, "CustomerName").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 2).and
            .iClickOnSelect("When: I Click on Function SelectBox", sViewName, 2).and
			.iSelectItemInListItem("When: I Select Sort Ascending in List", sViewName, "Sort Ascending").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Where", sViewName, 1, true).and
			.iClickOnDisplayItemList("When: I Select CustomerName Attribute", sViewName, "CustomerID").and
			.iExpandPanelASTControl("When: I Expand Comparision Panle", sViewName, "Comparison Operators", true).and
			.iClickOnDisplayItemList("When: I Select =", sViewName, "=").and
			.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
			.iEnterFixedValue("100", sViewName, "When: I Enter Fixed Value as 100", 1).and
			.iClickOnButton("When I Click Apply Button", sViewName, 1);

		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, "TOP(Customer,3) ", 0);
	});

	// opaTest("Select Functions : Forming an Expression with BOTTOM", function (Given, When, Then) {

	// 	When.onTextRulePage.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 0, false).and
	// 		.iClickOntheLink("When: I Click on Select Functions", sViewName, "Select Functions").and
	// 		.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 0).and
	// 		.iSelectItemInListItem("When: I Select Item in List", sViewName, "BOTTOM").and
	// 		.iEnterValueInTextArea("5", sViewName, "When: I Enter Count as 5", 0).and
	// 		.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 1).and
	// 		.iSelectItemInListItem("When: I Select Product DataObject in List", sViewName, "Product").and
	// 		.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Attributes", sViewName, 0, true).and
	// 		.iClickOnDisplayItemList("When: I Select ProductID Attribute", sViewName, "ProductID").and
	// 		.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 2).and
	// 		.iSelectItemInListItem("When: I Select Sort Ascending in List", sViewName, "Sort Ascending").and
	// 		.iClickOnButton("When I Click Apply Button", sViewName, 0).and
	// 		.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Attributes", sViewName, 1, true).and
	// 		.iClickOnDisplayItemList("When: I Select ProductName Attribute", sViewName, "ProductName").and
	// 		.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 3).and
	// 		.iSelectItemInListItem("When: I Select Sort Descending in List", sViewName, "Sort Descending").and
	// 		.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Where", sViewName, 2, true).and
	// 		.iClickOnDisplayItemList("When: I Select ProductID Attribute", sViewName, "ProductID").and
	// 		.iExpandPanelASTControl("When: I Expand Comparision Panle", sViewName, "Comparison Operators", true).and
	// 		.iClickOnDisplayItemList("When: I Select =", sViewName, "!=").and
	// 		.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
	// 		.iEnterFixedValue("1000", sViewName, "When: I Enter Fixed Value as 1000").and
	// 		.iClickOnButton("When I Click Apply Button", sViewName, 4);

	// 	;
	// 	Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, "BOTTOM(Product,5) ", 0);;

	// 	When.onTextRulePage.iPressBackSpace("When: I Press BackSapce ", sViewName, 0, false, 2);

	// });

	opaTest("Select Functions : Forming an Expression with SELECT", function (Given, When, Then) {

		When.onTextRulePage.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 1, false).and
			.iClickOntheLink("When: I Click on Select Functions", sViewName, "Select Functions").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 0).and
			.iSelectItemInListItem("When: I Select Item in List", sViewName, "SELECT").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 1).and
			.iSelectItemInListItem("When: I Select Product DataObject in List", sViewName, "Customer").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Attributes", sViewName, 0, true).and
			.iClickOnDisplayItemList("When: I Select CustomerName Attribute", sViewName, "CustomerName").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 2).and
            .iClickOnSelect("When: I Click on Function SelectBox", sViewName, 2).and
			.iSelectItemInListItem("When: I Select Sort Ascending in List", sViewName, "Sort Ascending").and
			.iClickOnButton("When I Click Apply Button", sViewName, 0).and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Attributes", sViewName, 1, true).and
			.iClickOnDisplayItemList("When: I Select ProductID Attribute", sViewName, "CustomerID").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 3).and
            .iClickOnSelect("When: I Click on Function SelectBox", sViewName, 3).and
			.iSelectItemInListItem("When: I Select Sort Descending in List", sViewName, "Sort Descending").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Where", sViewName, 2, true).and
			.iClickOnDisplayItemList("When: I Select CustomerName Attribute", sViewName, "CustomerName").and
			.iExpandPanelASTControl("When: I Expand Comparision Panle", sViewName, "Comparison Operators", true).and
			.iClickOnDisplayItemList("When: I Select =", sViewName, ">").and
			.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
			.iEnterFixedValue("'Batman'", sViewName, "When: I Enter Fixed Value as Batman", 1).and
			.iClickOnButton("When I Click Apply Button", sViewName, 4);

		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, "SELECT(Customer) ", 1);

	});

	QUnit.start();

	QUnit.done(function () {
		Utils.stopRequestRecorder();
	});
});