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
                    fileName: "TextRuleASTFunctions"
                });
    QUnit.module("TextRule OPA test");

    // set defaults

    var sRulePath =
        "/Projects(Id='f14b8d5cc05d4a13bd5a451db6149b3a',Version='000000000000000000\')/Rules(Id='a817e138ed0c4936a6e57cba4e820ad3',Version='000000000000000000')";
    var sViewName = "TextRuleASTFunctions";
    Opa5.extendConfig({
        viewNamespace: "TextRuleASTFunctions.view.",
        // we only have one view
        viewName: "TextRuleASTFunctions",
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
        Then.onTextRulePage.iCanSeeConditionBlock("If", 0, false)

    });

    opaTest("TextRule :  Forming an AST Expression for Concat Function ", function (Given, When, Then) {

            When.onTextRulePage.iPressCtrlSpaceInInput("When: I Press Ctrl+Space in Result ProductID", sViewName, 0,false);
        Then.onTextRulePage.iCanSeePanelsinASTControl("Then: I see Some Panels", sViewName, ["Vocabulary", "Fixed Value",
                "Mathematical Operators", "Advanced Functions", "Time and Duration Functions", "Miscellaneous Operators"
            ]).and
            .iCanSeeDisplayItem("Then: I can see DiscountDetails,Discounts,EmployeeDetails,Employees in Vocabulary Panel", sViewName, ["DiscountDetails","Discounts","EmployeeDetails","Employees"]);
        When.onTextRulePage.iExpandPanelASTControl("When: I Expand Advanced Function Panel", sViewName, "Advanced Functions", true).and
        .iClickOnDisplayItemList("When: I Select CONCAT ", sViewName, "CONCAT").and
        .iClickOnDisplayItemList("When: I Select EmployeeDetails DataObject", sViewName, "EmployeeDetails").and
        .iClickOnDisplayItemList("When: I Select DOB", sViewName, "DOB").and
        .iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
        .iClickOnDisplayItemList("When: I Select , ", sViewName, ",").and
        .iClickOnDisplayItemList("When: I Select EmployeeDetails DataObject", sViewName, "EmployeeDetails").and
        .iClickOnDisplayItemList("When: I Select EmpName", sViewName, "EmpName").and
        .iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
        .iClickOnDisplayItemList("When: I Select , ", sViewName, ",").and
        .iClickOnDisplayItemList("When: I Select EmployeeDetails DataObject", sViewName, "EmployeeDetails").and
        .iClickOnDisplayItemList("When: I Select EmpAge", sViewName, "EmpAge").and
        .iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
        .iClickOnDisplayItemList("When: I Select , ", sViewName, ",").and
        .iClickOnDisplayItemList("When: I Select EmployeeDetails DataObject", sViewName, "EmployeeDetails").and
        .iClickOnDisplayItemList("When: I Select IUser", sViewName, "IUser").and
        .iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
        .iClickOnDisplayItemList("When: I Select , ", sViewName, ",").and
        .iClickOnDisplayItemList("When: I Select EmployeeDetails DataObject", sViewName, "EmployeeDetails").and
        .iClickOnDisplayItemList("When: I Select TOB", sViewName, "TOB").and
        .iExpandPanelASTControl("When: I Expand Miscellaneous Operators Panel", sViewName, "Miscellaneous Operators", true).and
        .iClickOnDisplayItemList("When: I Select ) ", sViewName, ")").and
        
        var sExpression = "CONCAT ( EmployeeDetails.DOB , EmployeeDetails.EmpName , EmployeeDetails.EmpAge , EmployeeDetails.IUser , EmployeeDetails.TOB ) ";
        Then.onTextRulePage.iCanSeeASTConditionText("Then: I read If condition", sViewName, sExpression, 0);
    });

    QUnit.start();

    QUnit.done(function () {
        Utils.stopRequestRecorder();
    });
});