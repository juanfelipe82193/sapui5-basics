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
					fileName: "TextRuleAST"
				});
	QUnit.module("TextRule OPA test");

	// set defaults

	var sRulePath =
		"/Projects(Id='49a6d8b594be481b9f763ab3d10aeb4a',Version='000000000000000000')/Rules(Id='6af2d2ecfccf4fa4a33fc30b55c8839a',Version='000000000000000000')";
	var sViewName = "TextRuleAST";
	Opa5.extendConfig({
		viewNamespace: "TextRuleAST.view.",
		// we only have one view
		viewName: "TextRuleAST",
		timeout: 20,
		pollingInterval: 100
	});

	opaTest("Read Text Rule", function (Given, When, Then) {

		// Act
		Given.iStartMyUIComponent({
			componentConfig: {
				name: sViewName
			}
		});

		Then.onTextRulePage.iCanSeeTextRuleWithData("Text Rule When: Text Rule has completed read data", sViewName, sRulePath);
		Then.onTextRulePage.iCanSeeConditionBlock("If", 0, false).and
			.iCanSeeConditionBlock("Else If (1)", 1, true);
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, "ProductStruct.ProductName = 'Samsung' ", 0)
			.and
			.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "Discount").and
			.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "Shipping").and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "100 ", 1).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "50 ", 2);
		When.onTextRulePage.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 1, true, "Else If (1)");
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read Else If condition", sViewName, "ProductStruct.ProductName = 'apple' ", 3).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "50 ", 4).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "20 ", 5);
		When.onTextRulePage.iExpandElseIfPanel("When: ElseIf Panel is Collapsed", sViewName, 1, false, "Else If (1)");

	});
	opaTest("TextRuleSettings : Verify existing Data", function (Given, When, Then) {
		When.onTextRulePage.iClickTheSettingButton("When: I Click Settings Button", "sap.m.Toolbar", sViewName);
		Then.onTextRulePage.iCanSeeTitleText("Text Rule Settings", sViewName, "Then: Title Text Rule Settings Found", 0).and
			.iCanSeeLabel("Result", sViewName, "Then: Result Label Found", 0).and
			.iCanSeeSelectBoxWithItem(sViewName, "Discount", "Then: Result Input Discount Found", 0).and
			.iFindItemsCountInSelectList(sViewName, 5, "Then: There a 4 items in Result SelectList", 0).and
			.iCanSeeIconWithGivenVisibility("sap-icon://synchronize", true, sViewName, "Then: Refresh Button is Found and is Visible", 0).and
			.iCanSeeLabel("Result Attributes", sViewName, "Then: Result Attributes Label Found", 2).and
			.iCanSeeLabel("Access", sViewName, "Then:Access Label Found", 3).and
			.iCanSeeLabel("Default Value", sViewName, "Then: Default Value Label Found", 4).and
			//Result Attributes
			.iCanSeeLabel("Discount", sViewName, "Then: Label Discount Found", 5).and
			.iCanSeeLabel("Shipping", sViewName, "Then: Label Shipping Found", 6).and
			.iCanSeeSelectBoxWithItem(sViewName, "Editable", "Then: Attribute AccessMode as Editable for Discount Found", 1).and
			.iCanSeeSelectBoxWithItem(sViewName, "Editable", "Then: Attribute AccessMode as Editable for Shipping Found", 2);

	});

	opaTest("TextRuleSettings : Change Result Attribute and Apply", function (Given, When, Then) {

		When.onTextRulePage.iClickOnSelect("When: I Click on Result Select", sViewName, 0).and
			.iSelectItemInList("When: I select Product as Result Attribute", sViewName,"Product");
		Then.onTextRulePage.iCanSeeSelectBoxWithItem(sViewName, "Product", "Then: Result Input Product Found", 0).and
			.iCanSeeLabel("ProductName", sViewName, "Then: Label ProductName Found", 6).and
			.iCanSeeLabel("ProductID", sViewName, "Then: Label ProductID Found", 5);
		When.onTextRulePage.iClickOnButton("When I Click Apply Button", sViewName, 1);
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, "ProductStruct.ProductName = 'Samsung' ", 0)
			.and
			.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "ProductName").and
			.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "ProductID").and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "", 1).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "", 2);
		When.onTextRulePage.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 1, true, "Else If (1)");
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read Else If condition", sViewName, "ProductStruct.ProductName = 'apple' ", 3).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "", 4).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "", 5);
		When.onTextRulePage.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 1, false, "Else If (1)");

	});

	opaTest("TextRuleSettings : Change Access Mode to Hidden and Cancel", function (Given, When, Then) {
		When.onTextRulePage.iClickTheSettingButton("When: I Click Settings Button", "sap.m.Toolbar", sViewName).and
			.iClickOnSelect("When: I Click on AccessMode Select", sViewName, 1).and
			.iSelectItemInList("When: I select  Hidden", sViewName, "Hidden");
		Then.onTextRulePage.iCanSeeLabel("ProductName", sViewName, "Then: Label ProductName Found", 6).and
			.iCanSeeSelectBoxWithItem(sViewName, "Hidden", "Then: Attribute AccessMode as Hidden for ProductName Found", 1);
		When.onTextRulePage.iClickOnButton("When I Click Cancel Button", sViewName, 2);
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, "ProductStruct.ProductName = 'Samsung' ", 0)
			.and
			.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "ProductName").and
			.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "ProductID").and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "", 1).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "", 2);
		When.onTextRulePage.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 1, true, "Else If (1)");
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read Else If condition", sViewName, "ProductStruct.ProductName = 'apple' ", 3).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "", 4).and
			.iCanSeeASTConditionText("Then: I read If condition", sViewName, "", 5);
	});
	opaTest("TextRuleSettings : Change Access Mode to Hidden and Apply", function (Given, When, Then) {
		When.onTextRulePage.iClickTheSettingButton("When: I Click Settings Button", "sap.m.Toolbar", sViewName).and
			.iClickOnSelect("When: I Click on AccessMode Select", sViewName, 1).and
			.iSelectItemInList("When: I select  Hidden", sViewName, "Hidden");
		Then.onTextRulePage.iCanSeeLabel("ProductName", sViewName, "Then: Label ProductName Found", 6).and
			.iCanSeeSelectBoxWithItem(sViewName, "Hidden", "Then: Attribute AccessMode as Hidden for ProductName Found", 1);
		When.onTextRulePage.iClickOnButton("When I Click Apply Button", sViewName, 1);
		Then.onTextRulePage.iCanSeeResultAttribute("Then: I read result attribute", sViewName, "ProductName").and
			.iDontSeeLabel("ProductId", sViewName, "Then: I Check Result Attribute ProductId Not Found");
		When.onTextRulePage.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 1, true, "Else If (1)");
		Then.onTextRulePage.iDontSeeLabel("ProductId", sViewName, "Then: I Check Result Attribute ProductId Not Found");
		When.onTextRulePage.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 1, false, "Else If (1)");

	});

	opaTest("TextRule :  Forming an AST Expression ", function (Given, When, Then) {

		When.onTextRulePage.iExpandElseIfPanel("When: If Panel is Collapsed", sViewName, 0, false, "If").and
			.iExpandElseIfPanel("When: ElseIf Panel is Expanded", sViewName, 2, true, "Else If (2)").and
			.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 0,false);
		Then.onTextRulePage.iCanSeePanelsinASTControl("Then: I see Some Panels", sViewName, ["Vocabulary", "Fixed Value",
				"Mathematical Operators", "Advanced Functions", "Time and Duration Functions", "Miscellaneous Operators"
			]).and
			.iCanSeeDisplayItem("Then: I can see Product,Discount,Customer in Vocabulary Panel", sViewName, ["Product", "Discount", "Customer"]);
		When.onTextRulePage.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ( ", sViewName, "(").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ( ", sViewName, "(").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ( ", sViewName, "(").and
		.iClickOnDisplayItemList("When: I Select Customer DataObject", sViewName, "Customer").and
		.iClickOnDisplayItemList("When: I Select CustomerID", sViewName, "CustomerID").and
		.iExpandPanelASTControl("When: I Expand Range Operators Panel", sViewName, "Range Operators", true).and
		.iClickOnDisplayItemList("When: I Select IN", sViewName, "IN").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select (", sViewName, "(").and
		.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
		.iEnterFixedValue("25", sViewName, "When: I Enter Fixed Value as 25", 0).and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select .. ", sViewName, "..").and
		.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
		.iEnterFixedValue("50", sViewName, "When: I Enter Fixed Value as 50", 0).and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ] ", sViewName, "]").and
		.iExpandPanelASTControl("When: I Expand Logical Operators Panel", sViewName, "Logical Operators", true).and
		.iClickOnDisplayItemList("When: I Select AND ", sViewName, "AND").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select (", sViewName, "(").and
		.iClickOnDisplayItemList("When: I Select Customer DataObject", sViewName, "Customer").and
		.iClickOnDisplayItemList("When: I Select CustomerName", sViewName, "CustomerName").and
		.iExpandPanelASTControl("When: I Expand Functional Operators Panel", sViewName, "Functional Operators", true).and
		.iClickOnDisplayItemList("When: I Select STARTSWITH", sViewName, "STARTSWITH").and
		.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
		.iEnterFixedValue("'A'", sViewName, "When: I Enter Fixed Value as A", 0).and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select )", sViewName, ")").and
		.iExpandPanelASTControl("When: I Expand Logical Operators Panel", sViewName, "Logical Operators", true).and
		.iClickOnDisplayItemList("When: I Select AND ", sViewName, "AND").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select (", sViewName, "(").and
		.iClickOnDisplayItemList("When: I Select Customer DataObject", sViewName, "Customer").and
		.iClickOnDisplayItemList("When: I Select IsPremiumCustomer", sViewName, "IsPremiumCustomer").and
		.iExpandPanelASTControl("When: I Expand Logical Operators Panel", sViewName, "Logical Operators", true).and
		.iClickOnDisplayItemList("When: I Select OR ", sViewName, "OR").and
		.iClickOnDisplayItemList("When: I Select Customer DataObject", sViewName, "Customer").and
		.iClickOnDisplayItemList("When: I Select CustomerSIgnUpDate", sViewName, "CustomerSIgnUpDate").and
		.iExpandPanelASTControl("When: I Expand Comparison Operators Panel", sViewName, "Comparison Operators", true).and
		.iClickOnDisplayItemList("When: I Select > ", sViewName, ">").and
		.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
		.iEnterFixedValue("'2019-01-01'", sViewName, "When: I Enter Fixed Value as '2019-01-01'", 0).and
		// .iClickOntheLink("When: I Click on Select Date", sViewName, "Select date").and
		// .iEnterValueInDatePicker("When I enter Value in Date Picker", sViewName,0,"Apr 10, 2017").and
		// .iClickOnButton("When I Click Ok Button", sViewName, 0).and
		.iExpandPanelASTControl("When: I Expand Logical Operators Panel", sViewName, "Logical Operators", true).and
		.iClickOnDisplayItemList("When: I Select OR ", sViewName, "OR").and
		.iClickOnDisplayItemList("When: I Select Customer DataObject", sViewName, "Customer").and
		.iClickOnDisplayItemList("When: I Select CustomerSIgnUpDate", sViewName, "CustomerSIgnUpDate").and
		.iExpandPanelASTControl("When: I Expand Comparison Operators Panel", sViewName, "Comparison Operators", true).and
		.iClickOnDisplayItemList("When: I Select < ", sViewName, "<").and
		.iExpandPanelASTControl("When: I Expand Time and Duration Functions Panel", sViewName, "Time and Duration Functions", true).and
		.iClickOnDisplayItemList("When: I Select TODAY ", sViewName, "TODAY").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select )", sViewName, ")").and
		.iExpandPanelASTControl("When: I Expand Logical Operators Panel", sViewName, "Logical Operators", true).and
		.iClickOnDisplayItemList("When: I Select AND ", sViewName, "AND").and
		.iClickOnDisplayItemList("When: I Select Customer DataObject", sViewName, "Customer").and
		.iClickOnDisplayItemList("When: I Select TimeBought", sViewName, "TimeBought").and
		.iExpandPanelASTControl("When: I Expand Comparison Operators Panel", sViewName, "Comparison Operators", true).and
		.iClickOnDisplayItemList("When: I Select < ", sViewName, "<").and
		.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
		.iEnterFixedValue("'2019-03-13T14:27:58.058Z'", sViewName, "When: I Enter Fixed Value as '2019-01-01'", 0).and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select )", sViewName, ")").and
		.iExpandPanelASTControl("When: I Expand Array Operators Panel", sViewName, "Array Operators", true).and
		.iClickOnDisplayItemList("When: I Select EXISTSIN ", sViewName, "EXISTSIN").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select [", sViewName, "[").and
		.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
		.iEnterFixedValue("'true'", sViewName, "When: I Enter Fixed Value as true", 0).and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ,", sViewName, ",").and
		.iExpandPanelASTControl("When: I Expand Fixed Value Panel", sViewName, "Fixed Value", true).and
		.iEnterFixedValue("'false'", sViewName, "When: I Enter Fixed Value as false", 0).and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ]", sViewName, "]").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ( ", sViewName, ")").and
		.iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
		.iClickOnDisplayItemList("When: I Select ( ", sViewName, ")").and
		
		var sExpression =     
		    "( ( ( Customer.CustomerID IN ( 25 .. 50 ] AND ( Customer.CustomerName STARTSWITH 'A' ) AND ( Customer.IsPremiumCustomer OR Customer.CustomerSIgnUpDate > 'Jan 1, 2019' OR Customer.CustomerSIgnUpDate < TODAY ( ) ) AND Customer.TimeBought < 'Mar 13, 2019 2:27:58 PM' ) EXISTSIN [ 'true' , 'false' ] ) ) ";
		Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, sExpression, 0);
		
		 
		
	});

	QUnit.start();

	QUnit.done(function () {
		Utils.stopRequestRecorder();
	});
});