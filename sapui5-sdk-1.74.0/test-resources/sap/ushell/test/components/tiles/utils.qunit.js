// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.components.tiles.utils.js
 */
(function () {
    "use strict";
    /*global equal, module, notEqual, stop, test, jQuery, sap */

    jQuery.sap.require("sap.ushell.components.tiles.utils");

    module("sap.ushell.components.tiles.utils", {
        /**
         * This method is called after each test. Add every restoration code here.
         */
        setup: function () {

        },

        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {

        }
    });

    test("check buildFormFactorsObject()", function () {

        var oModel = {
            modelData: {},
            modelData1: {},

            getProperty: function (val, result) {
                switch (val) {
                    case "/config/appFormFactor":
                        return this.modelData.appFormFactor;
                    case "/config/desktopChecked":
                        return this.modelData.desktop;
                    case "/config/tabletChecked":
                        return this.modelData.tablet;
                    case "/config/phoneChecked":
                        return this.modelData.phone;

                }
            }
        };
        //before each test we init the oModel mock and then test it

        oModel.modelData = { appFormFactor: true, desktop: true, tablet: false, phone: true};
        var oResult = sap.ushell.components.tiles.utils.buildFormFactorsObject(oModel);
        equal(oResult.appDefault, true, "Test1.1: buildFormFactorsObject constructed correctly");


        oModel.modelData = {appFormFactor: false, desktop: true, tablet: true, phone: true ,defaultParam :true };
        oResult = sap.ushell.components.tiles.utils.buildFormFactorsObject(oModel);
        //Important - in order to make sure we are aligned with the form factor (device types) values as UI5 and backend team for the target resolution logic
        equal(oResult.appDefault, false, "Test1.2: buildFormFactorsString constructed correctly");
        equal(oResult.manual.desktop, true, "Test1.3: buildFormFactorsObject constructed correctly - Desktop");
        equal(oResult.manual.tablet, true, "Test1.4: buildDefaultFormFactorsObject constructed correctly - Tablet");
        equal(oResult.manual.phone, true, "Test1.5: buildDefaultFormFactorsObject constructed correctly - Phone");
        equal(oResult.defaultParam, undefined, "Test1.6: buildDefaultFormFactorsObject constructed correctly - Default setting - that mean that it's not defined ");


        oModel.modelData = {appFormFactor: true, desktop: false, tablet: false, phone: true ,defaultParam :true };
        oModel.modelData1 = sap.ushell.components.tiles.utils.getDefaultFormFactors();
        notEqual(oModel.modelData.appFormFactor,oModel.modelData1.appFormFactor," Test 1.7 : correct, The application form factor should be false for good" );

    });


    test("check tableHasDuplicateParameterNames()", function () {

        var aNames = [{name:'first'},{name:'second'},{name:'first'}];
        equal(sap.ushell.components.tiles.utils.tableHasDuplicateParameterNames(aNames),true,"Test 2.1: duplication was found as expected");

        aNames = [{name:'first'},{name:'second'},{name:'third'}];
        equal(sap.ushell.components.tiles.utils.tableHasDuplicateParameterNames(aNames),false,"Test 2.2: No duplication was found as expected");

        equal(sap.ushell.components.tiles.utils.tableHasDuplicateParameterNames([]),false,"Test 2.3: No duplication was found as expected");

    });
    //The getMappingSignature input is incremented in the following tests, meaning it is added to the previously used....
    test("check getMappingSignatureString() and getOneParamSignature()", function () {
        //test mandatory non reg ex param.
        var row = {    mandatory:true,
                    isRegularExpression:false,
                    name:'userID',
                    value:'001234',
                    defaultValue:''
                 };
        var aTable = [row];
        var sParam = sap.ushell.components.tiles.utils.getMappingSignatureString(aTable,false);
        equal(sParam, 'userID=001234',"Test 3.1: params string matches expected pattern");

        //test mandatory and regular expression
         var row = {    mandatory:true,
                    isRegularExpression:true,
                    name:'password',
                    value:'abcd',
                    defaultValue:''
                  };
        aTable.push(row);
        var sParam = sap.ushell.components.tiles.utils.getMappingSignatureString(aTable,false);
        equal(sParam, 'userID=001234&{password=abcd}',"Test 3.2: params string matches expected pattern");

        //test optional parameter
        var row = {    mandatory:false,
                    name:'language',
                    value:'',
                    defaultValue:'English'
                  };
        aTable.push(row);
        var sParam = sap.ushell.components.tiles.utils.getMappingSignatureString(aTable,false);
        equal(sParam, 'userID=001234&{password=abcd}&[language=English]',"Test 3.3: params string matches expected pattern");
        //Test the undefined params
        var sParam = sap.ushell.components.tiles.utils.getMappingSignatureString(aTable,true);
        equal(sParam, 'userID=001234&{password=abcd}&[language=English]&*=*',"Test 3.4: params string matches expected pattern");

    });

    test("check getMappingSignatureTableData() and getOneParamObject()", function () {

        var aParam = sap.ushell.components.tiles.utils.getMappingSignatureTableData('userID=001234&{password=abcd}&[language=English]&*=*');
        var thirdParam = aParam[2];

        equal(thirdParam.name, 'language',"Test 4.1: parsed object matches");
        equal(thirdParam.value, '',"Test 4.2: parsed object matches");
        equal(thirdParam.defaultValue, 'English',"Test 4.3: parsed object matches");
        equal(thirdParam.mandatory, false,"Test 4.4: parsed object matches");

        var firstParam = aParam[0];
        equal(firstParam.name, 'userID',"Test 4.5: parsed object matches");
        equal(firstParam.value, '001234',"Test 4.6: parsed object matches");
        equal(firstParam.defaultValue, '',"Test 4.7: parsed object matches");
        equal(firstParam.mandatory, true,"Test 4.8: parsed object matches");

    });

    test("check getAllowUnknownParametersValue()", function () {

        var bAllowedUndefined = sap.ushell.components.tiles.utils.getAllowUnknownParametersValue('userID=001234&{password=abcd}&[language=English]&*=*');
        equal(bAllowedUndefined, true,"Test 5.1: Unknown parameters flag matches expected value");

        bAllowedUndefined = sap.ushell.components.tiles.utils.getAllowUnknownParametersValue('userID=001234&{password=abcd}&[language=English]');
        equal(bAllowedUndefined, false,"Test 5.2: Unknown parameters flag matches expected value");

        //Check empty string
        bAllowedUndefined = sap.ushell.components.tiles.utils.getAllowUnknownParametersValue('');
        equal(bAllowedUndefined, false,"Test 5.3: Unknown parameters flag matches expected value");

        //check *=* in the middle
        bAllowedUndefined = sap.ushell.components.tiles.utils.getAllowUnknownParametersValue('userID=001234&{password=abcd}&*=*&[language=English]');
        equal(bAllowedUndefined, false,"Test 5.4: Unknown parameters flag matches expected value");

    });

    test("check checkInput()", function () {
        var configurationView = {};

        function baseItem(){
            this.value = "";
            this.text = "";

            this.setValueState = function(val){
                this.value = val;
            };
            this.setValueStateText = function(val){
                this.text = val;
            };
        }

        //Create inherit icon object class
        function icon(){}
        icon.prototype = new baseItem();
        //create instance for testing
        var oIcon = new icon();

        //Create inherit semantic object class
        function soInput(){
            this.aItems = [];
            this.getModel = function(){
                var that = this;
                return {
                    getProperty: function(){
                        return that.aItems;
                    }
                };
            };
        }
        function saInput(){
            this.getValue = function() {
                return "actionTestValue";
            };
        }
        soInput.prototype = new baseItem();
        //create instance for testing
        var oSO = new soInput();
        var oSA = new saInput();

        configurationView.byId = function(val){
            switch (val) {
                case "iconInput":
                   return oIcon;
                case "navigation_semantic_objectInput":
                    return oSO;
                case "navigation_semantic_actionInput":
                    return oSA;
                case "iconInput":
                    break;
                case "semantic_objectInput":
                    break;
                case "semantic_actionInput":
                    break;

                default:
                    break;
            }
            return "tester";
        };

        var event = {
            param : "testString",
            testObject : oIcon,

            getParameter : function(val){
                return this.param;
            },
            getSource : function(){
                return this.testObject;
            }
        };

        //Test Icon
        sap.ushell.components.tiles.utils.checkInput(configurationView, event);
        equal(event.getSource().value, 'Error',"Test 7.1: Checkinput set the correct value for icon checks");

        event.param = "sap-icon://sapUIFiori.jpg";
        sap.ushell.components.tiles.utils.checkInput(configurationView, event);
        equal(event.getSource().value, 'None',"Test 7.1: Checkinput set the correct value for icon checks");

        //Test Semantic object
        event.testObject = oSO; //currently contains "sap-icon://sapUIFiori.jpg" which is an illegal value for the semantic object
        sap.ushell.components.tiles.utils.checkInput(configurationView, event);
        equal(event.getSource().value, 'Error',"Test 7.1: Checkinput set the correct value for semantic object checks");

        event.param = "displayOrder";
//        sap.ushell.components.tiles.utils.checkInput(configurationView, event);
//        equal(event.getSource().value, 'Warning',"Test 7.1: Checkinput set the correct value for semantic object checks");
        oSO.aItems = [{obj: "displayOrder"}];

        sap.ushell.components.tiles.utils.checkInput(configurationView, event);
        equal(event.getSource().value, 'None',"Test 7.1: Checkinput set the correct value for semantic object checks");

    });
}());
