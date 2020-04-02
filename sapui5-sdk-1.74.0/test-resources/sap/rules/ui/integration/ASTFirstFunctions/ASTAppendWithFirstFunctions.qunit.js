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
		fileName: "ASTFirstFunctions"
	});
	QUnit.module("TextRule OPA test");

	// set defaults

	var sViewName = "ASTFirstFunctions";
	Opa5.extendConfig({
		viewNamespace: "ASTFirstFunctions.view.",
		// we only have one view
		viewName: "ASTFirstFunctions",
		timeout: 20,
		pollingInterval: 100
	});

	opaTest("Select Functions Check for Existing Things", function (Given, When, Then) {

		Given.iStartMyUIComponent({
			componentConfig: {
				name: sViewName
			}
		});

		When.onTextRulePage.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 1, false);
		Then.onTextRulePage.iCanSeePanelsinASTControl("Then: I see Operation Panels", sViewName, ["Operations"]).and
			.iCanSeeDisplayItem("Then: I can see Append in Operation Panel", sViewName, ["APPEND"]);
		When.onTextRulePage.iClickOnDisplayItemList("When: I Select Append Operation", sViewName, "APPEND").and
		When.onTextRulePage.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true)
			.and
			.iClickOnDisplayItemList("When: I Select ( ", sViewName, "(").and
			.iClickOnDisplayItemList("When: I Select Employees", sViewName, "Employees").and
			.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
			.iClickOnDisplayItemList("When: I Select , ", sViewName, ",").and
			.iClickOntheLink("When: I Click on Select Functions", sViewName, "Select Functions").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 0).and
			.iSelectItemInListItem("When: I Select Item in List", sViewName, "FIRST").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 1).and
			.iSelectItemInListItem("When: I Select Employees DataObject in List", sViewName, "Employees").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Attributes", sViewName, 0, true).and
			.iClickOnDisplayItemList("When: I Select EmpName Attribute", sViewName, "EmpName").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 2).and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 2).and
			.iSelectItemInListItem("When: I Select Sort Ascending in List", sViewName, "Sort Ascending").and
			.iClickOnButton("When I Click Apply Button", sViewName, 0).and
			.iPressCtrlSpaceInInput("When: I Press Ctrl Space in Attributes", sViewName, 1, true).and
			.iClickOnDisplayItemList("When: I Select EmpAge Attribute", sViewName, "EmpAge").and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 3).and
			.iClickOnSelect("When: I Click on Function SelectBox", sViewName, 3).and
			.iSelectItemInListItem("When: I Select Sort Descending in List", sViewName, "Sort Descending").and
			.iClickOnButton("When I Click Apply Button", sViewName, 4).and
			.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
			.iClickOnDisplayItemList("When: I Select ) ", sViewName, ")").and

	});
	
	QUnit.start();

	QUnit.done(function () {
		Utils.stopRequestRecorder();
	});
});