QUnit.config.autostart = false;
sap.ui.require(
	["sap/ui/test/Opa5",
    "sap/ui/test/opaQunit",
    "sap/ui/test/actions/Press",
    "sap/ui/test/actions/EnterText",
    "sap/rules/ui/integration/pages/ExpressionBasic"
	],
	function (Opa5, opaTest, Press, EnterText) {

	    QUnit.module("ExpressionBasic OPA test");

	    Opa5.extendConfig({
	        viewNamespace: "ExpressionBasic.view.",
	        // we only have one view
	        viewName: "ExpressionBasic"
	    });
	    var sExpressionBasicID = "myExpressionBasic";
	    var sViewName = "ExpressionBasic";
        var sExrpession = "";
	    opaTest("Should see the ExpressionBasic", function (Given, When, Then) {

	        Given.iStartMyUIComponent({
	            componentConfig: { name: "ExpressionBasic" }
	        });

	        // Assertions

	        Then.onTheExpressionBasicPage.iCanSeeTheExpressionBasic("When: I can see the ExpressionBasic in the XML view", sExpressionBasicID, sViewName);
	    });
        /*age of the player*/
	    opaTest("Should set attribute in the vocabulary's control and generate new control for comparison with empty value", function (Given, When, Then) {

            sExrpession = "age of the player";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic left side", 0, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the " + sExrpession + " option", sExrpession, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession , sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 2 instructions in the ExpressionBasic", 2, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set attribute in the comparison's control and generate new control for value with empty value", function (Given, When, Then) {

            sExrpession = "age of the player is equal to";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is equal to' option", 'is equal to', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 1 input control", sViewName, "sap.m.Input", 1);
	    });
	    opaTest("Should set attribute in the value's control", function (Given, When, Then) {

            sExrpession = "age of the player is equal to 3";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set '3' in the value instruction", 2, "3", sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set non-valid attribute in the value's control and see input with error valueState", function (Given, When, Then) {

            sExrpession = "age of the player is equal to abc";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set 'abc' in the value instruction", 2, "abc", sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName).and.
            iCheckErrorInInputControl("and Then: I can see the error in the sap.m.Input", sViewName, "sap.m.Input");
	    });
        opaTest("Should change comparison from 'is equal to' to 'is between'", function (Given, When, Then) {

            sExrpession = "age of the player is between";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is between' option", 'is between', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 5 instructions in the ExpressionBasic", 5, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 2 input control", sViewName, "sap.m.Input", 2);
	    });
        opaTest("Should change expression basic value for 'is between' comparison", function (Given, When, Then) {

            sExrpession = "age of the player is between 30 to 50";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set '30' in the value instruction", 2, "30", sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("When: I set '50' in the value instruction", 4, "50", sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName);
	    });
        opaTest("Should change expression values from '30 to 50' to '20 to 40'", function (Given, When, Then) {

            sExrpession = "age of the player is between 20 to 40";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set '20' in the value instruction", 2, "20", sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("When: I set '40' in the value instruction", 4, "40", sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName);
	    });
	    /*name of the player*/
        opaTest("Should set attribute in the vocabulary's control and generate new control for comparison with empty value", function (Given, When, Then) {

            sExrpession = "name of the player";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic left side", 0, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the " + sExrpession + " option",  sExrpession, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 2 instructions in the ExpressionBasic", 2, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set attribute in the comparison's control and generate new control for value with empty value", function (Given, When, Then) {

            sExrpession = "name of the player is equal to";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is equal to' option", 'is equal to', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 1 input control", sViewName, "sap.m.Input", 1);
	    });
	    opaTest("Should set attribute in the value's control", function (Given, When, Then) {

            sExrpession = "name of the player is equal to 'Shay Zambrovski'";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set 'Shay Zambrovski' in the value instruction", 2, "Shay Zambrovski", sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName);
	    });
        opaTest("Should change comparison from 'is equal to' to 'is between'", function (Given, When, Then) {

            sExrpession = "name of the player is between";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is between' option", 'is between', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 5 instructions in the ExpressionBasic", 5, sExpressionBasicID, sViewName);
	    });
        opaTest("Should change expression basic value for 'is between' comparison", function (Given, When, Then) {

            sExrpession = "name of the player is between 'Shay zambrovski' to 'Zambrovski Shay'";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set 'Shay zambrovski' in the value instruction", 2, "Shay zambrovski", sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("When: I set 'Zambrovski Shay' in the value instruction", 4, "Zambrovski Shay", sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 2 input control", sViewName, "sap.m.Input", 2);
	    });
	    /*timestamp of the payment*/
        opaTest("Should set attribute in the vocabulary's control and generate new control for comparison with empty value", function (Given, When, Then) {

            sExrpession = "timestamp of the payment";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic left side", 0, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the " + sExrpession + " option",  sExrpession, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 2 instructions in the ExpressionBasic", 2, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set attribute in the comparison's control and generate new control for value with empty value", function (Given, When, Then) {

            sExrpession = "timestamp of the payment is equal to";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is equal to' option", 'is equal to', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 1 DatePicker control", sViewName, "sap.m.DateTimePicker", 1);
	    });
	    opaTest("Should set attribute in the value's control", function (Given, When, Then) {
            
            var sDate = '01-09-2016 09:59:40';
            sExrpession = "timestamp of the payment is equal to '" + sDate + "'";

	        //Actions
	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set " + sDate + " in the value instruction", 2, sDate, sExpressionBasicID, sViewName);
	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName);
	    });
        opaTest("Should change comparison from 'is equal to' to 'is between'", function (Given, When, Then) {

            sExrpession = "timestamp of the payment is between";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is between' option", 'is between', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 5 instructions in the ExpressionBasic", 5, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 2 DateTimePicker control", sViewName, "sap.m.DateTimePicker", 2);
	    });
        opaTest("Should change expression basic value for 'is between' comparison", function (Given, When, Then) {
            
            var sDate1 = '01-09-2016 09:59:40';
            var sDate2 = '02-09-2016 09:59:40';
            //var sFixedDate1 = new Date(sDate1).toString();
            //var sFixedDate2 = new Date(sDate2).toString();
            sExrpession = "timestamp of the payment is between '" + sDate1 + "' to '" + sDate2 + "'";

            //sExrpession = "timestamp of the payment is between '31/08/2015 15:24:44' to '31/08/2016 15:24:44'";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set " + sDate1 + " in the value instruction", 2, sDate1, sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("When: I set " + sDate2 + " in the value instruction", 4, sDate2, sExpressionBasicID, sViewName);

	        // Assertions

	        /*Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName);*/
	    });
	    /*birthdate of the player*/
        opaTest("Should set attribute in the vocabulary's control and generate new control for comparison with empty value", function (Given, When, Then) {

            sExrpession = "birthdate of the player";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic left side", 0, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the " + sExrpession + " option",  sExrpession, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 2 instructions in the ExpressionBasic", 2, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set attribute in the comparison's control and generate new control for value with empty value", function (Given, When, Then) {

            sExrpession = "birthdate of the player is equal to";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is equal to' option", 'is equal to', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 1 DateTimePicker control", sViewName, "sap.m.DatePicker", 1);
	    });
	    opaTest("Should set attribute in the value's control", function (Given, When, Then) {
            
            var sDate1 = '1/9/16';
            //var sFixedDate1 = new Date(sDate1).toString();
            sExrpession = "birthdate of the player is equal to '" + sDate1 + "'";

	        //Actions

            When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set " + sDate1 + " in the value instruction", 2, sDate1, sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName);
	    });
        opaTest("Should change comparison from 'is equal to' to 'is between'", function (Given, When, Then) {

            sExrpession = "birthdate of the player is between";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is between' option", 'is between', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 5 instructions in the ExpressionBasic", 5, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 1 DatePicker control", sViewName, "sap.m.DatePicker", 2);
	    });
        opaTest("Should change expression basic value for 'is between' comparison", function (Given, When, Then) {

            var sDate1 = '01-09-2016';
            var sDate2 = '02-09-2016';
            //var sFixedDate1 = new Date(sDate1).toString();
            //var sFixedDate2 = new Date(sDate2).toString();
            sExrpession = "birthdate of the player is between '" + sDate1 + "' to '" + sDate2 + "'";
            
            //sExrpession = "birthdate of the player is between '12/09/2015' to '12/09/2016'";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set " + sDate1 + " in the value instruction", 2, sDate1, sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("When: I set " + sDate2 + " in the value instruction", 4, sDate2, sExpressionBasicID, sViewName);

	        // Assertions

	        /*Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName);*/
	    });
	    /*duration of the session*/
        opaTest("Should set attribute in the vocabulary's control and generate new control for comparison with empty value", function (Given, When, Then) {

            sExrpession = "duration of the session";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic left side", 0, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the " + sExrpession + " option",  sExrpession, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 2 instructions in the ExpressionBasic", 2, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set attribute in the comparison's control and generate new control for value with empty value", function (Given, When, Then) {

            sExrpession = "duration of the session is equal to";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is equal to' option", 'is equal to', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 4 instructions in the ExpressionBasic", 4, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 3 Select control", sViewName, "sap.m.Select", 3).and.
            iCheckAmountOfControls("and Then: I can see 1 input control", sViewName, "sap.m.Input", 1);
	    });
	    opaTest("Should set attribute in the value's control", function (Given, When, Then) {
            
            sExrpession = "duration of the session is equal to 4";

	        //Actions

            When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set '4' in the value instruction", 2, 4, sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 4 instructions in the ExpressionBasic", 4, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set attribute in the value's 2nd control", function (Given, When, Then) {
            
            sExrpession = "duration of the session is equal to 4 weeks";

	        //Actions

            When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set 'weeks' in the value instruction", 3, "weeks", sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 4 instructions in the ExpressionBasic", 4, sExpressionBasicID, sViewName);
	    });
        opaTest("Should change comparison from 'is equal to' to 'is between'", function (Given, When, Then) {

            sExrpession = "duration of the session is between";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is between' option", 'is between', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 7 instructions in the ExpressionBasic", 7, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 4 Select control", sViewName, "sap.m.Select", 4).and.
            iCheckAmountOfControls("and Then: I can see 2 input control", sViewName, "sap.m.Input", 2);
	    });
        opaTest("Should change expression basic value for 'is between' comparison", function (Given, When, Then) {

            sExrpession = "duration of the session is between 456 hours to 789 years";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set '456' in the value instruction", 2, "456", sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("When: I set 'hours' in the value instruction", 3, "hours", sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("and When: I set '789' in the value instruction", 5, "789", sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("and When: I set 'years' in the value instruction", 6, "years", sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 7 instructions in the ExpressionBasic", 7, sExpressionBasicID, sViewName);
	    });
        /*player is a whale*/
        opaTest("Should set attribute in the vocabulary's control and generate new control for comparison with empty value", function (Given, When, Then) {

            sExrpession = "player is whale";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic left side", 0, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the " + sExrpession + " option",  sExrpession, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 2 instructions in the ExpressionBasic", 2, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set attribute in the comparison's control and generate new control for value with empty value", function (Given, When, Then) {

            sExrpession = "player is whale is equal to";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is equal to' option", 'is equal to', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 3 Select control", sViewName, "sap.m.Select", 3);
	    });
	    opaTest("Should set attribute in the value's control", function (Given, When, Then) {
            
            sExrpession = "player is whale is equal to false";

	        //Actions

            When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set 'false' in the value instruction", 2, 'false', sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName);
	    });
        /* registration time of the player*/
        opaTest("Should set attribute in the vocabulary's control and generate new control for comparison with empty value", function (Given, When, Then) {

            sExrpession = "registration time of the player";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic left side", 0, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the " + sExrpession + " option",  sExrpession, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 2 instructions in the ExpressionBasic", 2, sExpressionBasicID, sViewName);
	    });
	    opaTest("Should set attribute in the comparison's control and generate new control for value with empty value", function (Given, When, Then) {

            sExrpession = "registration time of the player is equal to";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is equal to' option", 'is equal to', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 2 Select control", sViewName, "sap.m.Select", 2).and.
            iCheckAmountOfControls("and Then: I can see 1 TimePicker control", sViewName, "sap.m.TimePicker", 1);
	    });
	    opaTest("Should set attribute in the value's control", function (Given, When, Then) {
            
            var sTime = "2:52:56 PM";
            sExrpession = "registration time of the player is equal to '" + sTime + "'";

	        //Actions

            When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set '" + sTime + "' in the value instruction", 2, sTime, sExpressionBasicID, sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 3 instructions in the ExpressionBasic", 3, sExpressionBasicID, sViewName);
	    });
        opaTest("Should change comparison from 'is equal to' to 'is between'", function (Given, When, Then) {

            sExrpession = "registration time of the player is between";

	        //Actions

	        When.onTheExpressionBasicPage.iClickOnInstruction("When: I click the ExpressionBasic comparison side", 1, sExpressionBasicID, sViewName).and.
            iClickOnItemFromSelect("and When: I click on the 'is between' option", 'is between', sViewName);

	        // Assertions

	        Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.
            iCheckAmountOfInstruction("and Then: I have 5 instructions in the ExpressionBasic", 5, sExpressionBasicID, sViewName).and.
            iCheckAmountOfControls("and Then: I can see 2 Select control", sViewName, "sap.m.Select", 2).and.
            iCheckAmountOfControls("and Then: I can see 2 TimePicker control", sViewName, "sap.m.TimePicker", 2);
	    });
        opaTest("Should change expression basic value for 'is between' comparison", function (Given, When, Then) {

            var sTime1 = new Date().toLocaleTimeString();
            var sTime2 = new Date().toLocaleTimeString();
            sExrpession = "registration time of the player is between '" + sTime1 + "'" + " to '" + sTime2 + "'";

	        //Actions

	        When.onTheExpressionBasicPage.iSetValueInInstruction("When: I set '" + sTime1 + "' in the value instruction", 2, sTime1, sExpressionBasicID, sViewName).and.
            iSetValueInInstruction("and When: I set '" + sTime2 + "' in the value instruction", 4, sTime2, sExpressionBasicID, sViewName);

	        // Assertions

	        /*Then.onTheExpressionBasicPage.iCheckExpressionBasicValue("Then: ExpressionBasic value will be " + sExrpession, sExrpession, sExpressionBasicID, sViewName).and.*/
            Then.onTheExpressionBasicPage.iCheckAmountOfInstruction("and Then: I have 5 instructions in the ExpressionBasic", 5, sExpressionBasicID, sViewName);
	    });
	    QUnit.start();
	}
);