sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/opaQunit",
	"sap/ui/test/actions/Press",
	"sap/ui/test/actions/EnterText",
	"test/sap/rules/ui/TestUtils",
	"sap/rules/ui/integration/pages/TextRule"
], function (Opa5, opaTest, Press, EnterText, Utils, onTextRulePage) {
	"use strict";
	
		Utils.startRequestRecorder({
					mode: "play", //play, record
					filePath: "data/",
					fileName: "TextRuleUpdateOperations"
				});
	QUnit.module("TextRule OPA test");

	// set defaults

	var sRulePath =
		"/Projects(Id='61b0c1196ce845deb3470781339710ab',Version='000000000000000000')/Rules(Id='f1796affe87148839c633bdd99c0f3c9',Version='000000000000000000')";
	var sViewName = "TextRuleUpdateOperations";
	Opa5.extendConfig({
		viewNamespace: "TextRuleUpdateOperations.view.",
		// we only have one view
		viewName: "TextRuleUpdateOperations",
		timeout: 50,
		pollingInterval: 100,
		executionDelay:600
	});

	
	opaTest("TextRule :  Forming an Update Operation (DO,DO) ", function (Given, When, Then) {

		// Act
		Given.iStartMyUIComponent({
			componentConfig: {
				name: sViewName
			}
		});
		
		When.onTextRulePage.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 1,false);
		Then.onTextRulePage.iCanSeePanelsinASTControl("Then: I see Operation Panels", sViewName, ["Operations"]).and
			.iCanSeeDisplayItem("Then: I can see Update in Operation Panel", sViewName, ["UPDATE"]);
		When.onTextRulePage.iClickOnDisplayItemList("When: I Select Update Operation", sViewName, "UPDATE").and
		When.onTextRulePage.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ( ", sViewName, "(").and
		.iClickOnDisplayItemList("When: I Select Employee", sViewName, "Employee").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select , ", sViewName, ",").and
		.iClickOnDisplayItemList("When: I Select Company", sViewName, "Company").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ) ", sViewName, ")").and
		
		var sExpression = "UPDATE ( Employee , Company ) ";
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read the Update Condition", sViewName, sExpression, 1);
		 
		
	});

	opaTest("TextRule :  Forming an Update Operation (DO.Attr,DO.Attr) ", function (Given, When, Then) {
		When.onTextRulePage.iClickTheAddButton("When: I Click add Button", "sap.m.Button", sViewName, 1).and
		When.onTextRulePage.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 2,false);
		Then.onTextRulePage.iCanSeePanelsinASTControl("Then: I see Operation Panels", sViewName, ["Operations"]).and
			.iCanSeeDisplayItem("Then: I can see Update in Operation Panel", sViewName, ["UPDATE"]);
		When.onTextRulePage.iClickOnDisplayItemList("When: I Select Update Operation", sViewName, "UPDATE").and
		When.onTextRulePage.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ( ", sViewName, "(").and
		.iClickOnDisplayItemList("When: I Select Employee", sViewName, "Employee").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select . ", sViewName, ".").and
		.iClickOnDisplayItemList("When: I Select Name", sViewName, "Name").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select , ", sViewName, ",").and
		.iClickOnDisplayItemList("When: I Select Company", sViewName, "Company").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select . ", sViewName, ".").and
		.iClickOnDisplayItemList("When: I Select Name", sViewName, "Name").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ) ", sViewName, ")").and
		
		var sExpression = "UPDATE ( Employee.Name , Company.Name ) ";
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read the Update Condition", sViewName, sExpression, 2);
		 
		
	});
	
	opaTest("TextRule :  Forming an Update Operation (DO.Attr,Rule) and Click add button", function (Given, When, Then) {
		When.onTextRulePage.iClickTheAddButton("When: I Click add Button", "sap.m.Button", sViewName, 6).and
		When.onTextRulePage.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 3,false);
		Then.onTextRulePage.iCanSeePanelsinASTControl("Then: I see Operation Panels", sViewName, ["Operations"]).and
			.iCanSeeDisplayItem("Then: I can see Update in Operation Panel", sViewName, ["UPDATE"]);
		When.onTextRulePage.iClickOnDisplayItemList("When: I Select Update Operation", sViewName, "UPDATE").and
		When.onTextRulePage.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ( ", sViewName, "(").and
		.iClickOnDisplayItemList("When: I Select Employee", sViewName, "Employee").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select . ", sViewName, ".").and
		.iClickOnDisplayItemList("When: I Select Name", sViewName, "Name").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select , ", sViewName, ",").and
		.iClickOnDisplayItemList("When: I Select Rule TextRule", sViewName, "TextRule").and
		
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ) ", sViewName, ")").and
		
		var sExpression = "UPDATE ( Employee.Name , TextRule ) ";
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read the Update Condition", sViewName, sExpression, 3);
		
	});
	
	opaTest("TextRule :  No Default Result Selected in the Settings", function (Given, When, Then) {
			When.onTextRulePage.iClickTheSettingButton("When: I Click Settings Button", "sap.m.Toolbar", sViewName);
			Then.onTextRulePage.iCanSeeTitleText("Text Rule Settings", sViewName, "Then: Title Text Rule Settings Found", 0).and
			.iCanSeeLabel("Result", sViewName, "Then: Result Label Found", 0).and
			.iCanSeeSelectBoxWithItem(sViewName, "No Default Result", "Then: Result Input No default result Found", 0).and
	});
	
	opaTest("TextRuleSettings : Change Result Attribute and Apply", function (Given, When, Then) {

		When.onTextRulePage.iClickOnSelect("When: I Click on Result Select", sViewName, 0).and
			.iSelectItemInList("When: I select Discount as Result Attribute", sViewName,"Discount");
		Then.onTextRulePage.iCanSeeSelectBoxWithItem(sViewName, "Discount", "Then: Result Input Discount Found", 0).and
			.iCanSeeLabel("Disc", sViewName, "Then: Label Disc Found", 6).and
			.iCanSeeLabel("Name", sViewName, "Then: Label Name Found", 5);
		When.onTextRulePage.iClickOnButton("When I Click Apply Button", sViewName, 1);
		Then.onTextRulePage.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "Name").and
			.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "Disc").and
			.iCanSeeASTConditionText("Then: I read Then section", sViewName, "", 1).and
			.iCanSeeASTConditionText("Then: I read Then section", sViewName, "", 2);

	});
	QUnit.start();

	QUnit.done(function () {
		Utils.stopRequestRecorder();
	});
});