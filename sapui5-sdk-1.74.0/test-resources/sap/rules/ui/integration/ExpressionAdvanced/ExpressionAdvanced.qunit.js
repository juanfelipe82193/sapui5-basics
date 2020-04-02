QUnit.config.autostart = false;
sap.ui.require(
	["sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/rules/ui/integration/pages/ExpressionAdvanced"
	],
	function (Opa5, opaTest, Press, EnterText) {

	    QUnit.module("ExpressionAdvanced OPA test");

	    Opa5.extendConfig({
	        viewNamespace: "ExpressionAdvanced.view.",
	        // we only have one view
	        viewName: "ExpressionAdvanced"
	    });
	    var sExpressionAdvancedID = "myExpressionAdvanced";
	    var sViewName = "ExpressionAdvanced";
	    opaTest("Should see the ExpressionAdvanced Editor and see valid expression", function (Given, When, Then) {

	        var sExpressionValue = "id of the player is between '3' and '5'";
	        Given.iStartMyUIComponent({
	            componentConfig: { name: "ExpressionAdvanced" }
	        });
	        //Actions

	        When.onTheExpressionAdvancedPage.iCanSeeTheExpressionAdvanced("When: I see the Expression Advanced", sExpressionAdvancedID, sViewName).and
            .iEnterExpression("and When: I set in the Expression Advanced a valid value", sExpressionAdvancedID, sExpressionValue, sViewName);
	        // Assertions

	        Then.onTheExpressionAdvancedPage.iCanSeeValidValueStateText("Then: The Expression Advanced has a valid value state text", sExpressionAdvancedID, sViewName);
	    });

	    opaTest("Should see non-valid expression", function (Given, When, Then) {
	        var sExpressionValue = "id of the player is between '3' } '5'";
	        var sErrorMessage = "Error in expression; enter 'and' ,'to' ,'+' instead of '}' ";

	        //Actions
	        When.onTheExpressionAdvancedPage.iEnterExpression("When: I set in the Expression Advanced a non-valid value", sExpressionAdvancedID, sExpressionValue, sViewName);

	        // Assertions

	        Then.onTheExpressionAdvancedPage.iCanSeeNonValidValueStateText("Then: The Expression Advanced has a valid value state text", sExpressionAdvancedID, sViewName, sErrorMessage);
	    });

	    opaTest("Should see auto suggest", function (Given, When, Then) {
	        var sExpressionValue = " ";
	        //Actions
	        When.onTheExpressionAdvancedPage.iEnterExpression("When: I set in the Expression Advanced a non-valid value", sExpressionAdvancedID, sExpressionValue, sViewName).and
            .iActivateAutoComplete("and When: I Activate the auto complete in the Expression Advanced a non-valid value", sViewName);
	        Then.onTheExpressionAdvancedPage.iCanSeeAutoComplete();
	    });
	    QUnit.start();
	}
);