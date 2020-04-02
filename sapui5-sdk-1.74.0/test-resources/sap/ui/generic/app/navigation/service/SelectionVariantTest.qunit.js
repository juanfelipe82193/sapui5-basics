/*global QUnit */
sap.ui.define([
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/generic/app/navigation/service/NavError"
], function(SelectionVariant, NavError) {
	"use strict";

	/**
	 * tests for the sap.ui.generic.app.navigation.service.SelectionVariant class
	 * */
	QUnit.module("nav.SelectionVariant");

	QUnit.test("getID: identity with parameter at constructor", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		assert.equal(oSelVar.getID(), "test-id_1234", "reading back id needs to provide the same value as when constructed");
	});

	QUnit.test("get/setText: identity when reading/writing text", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.setText("myTextWhichShallBeUsedForQunitTesting");
		assert.equal(oSelVar.getText(), "myTextWhichShallBeUsedForQunitTesting", "reading back text needs to provide the same value as when set");
	});

	QUnit.test("get/setParameterContextUrl: identity when reading/writing", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.setParameterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters");
		assert.equal(oSelVar.getParameterContextUrl(), "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters", "reading back Parameter Context URL needs to provide the same value as when set");
	});

	QUnit.test("get/setFilterContextUrl: identity when reading/writing", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.setFilterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult");
		assert.equal(oSelVar.getFilterContextUrl(), "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult", "reading back Parameter Context URL needs to provide the same value as when set");
	});

	QUnit.test("add/getParameter: identity when reading/writing", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addParameter("myParameterName", "myValue");
		assert.equal(oSelVar.getParameter("myParameterName"), "myValue", "value which has been set needs to be returned on getting");
	});

	QUnit.test("add/getParameter: setting a parameter with value null returns an exception", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		var thrown = false;
		try {
			oSelVar.addParameter("myParameterName", null);
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			thrown = true;
		}
		assert.equal(thrown, true, "Exception has been thrown successfully");
	});

	QUnit.test("getParameterNames: Parameter added needs to be listed", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addParameter("myParameterName", "myValue");

		var expected = [
			"myParameterName"
		];
		assert.deepEqual(oSelVar.getParameterNames(), expected, "parameter which has been set needs to be available when asking for the ParameterNames");
	});

	QUnit.test("add/getSelectOption: identity when reading/writing", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addSelectOption("mySelOptName", "I", "EQ", "low-value");

		var expected = [
			{
				Sign: "I",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName"), expected, "select option range set needs to be returned when asking to retrieve it back");
	});

	QUnit.test("add/getSelectOption: setting low values with value null is not accepted", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		var thrown = false;
		try {
			oSelVar.addSelectOption("mySelOptName", "I", "EQ", null);
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			thrown = true;
		}
		assert.equal(thrown, true, "Exception has been thrown successfully");
	});

	QUnit.test("add/getSelectOption: uppercase conversion takes place", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-uppercase");

		oSelVar.addSelectOption("mySelOptName", "i", "eq", "low-value");

		var expected = [
			{
				Sign: "I",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName"), expected, "select option range set needs to be in upper case");
	});

	QUnit.test("add/getSelectOption: robustness - changing range values does not influence instance / immutability test", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-uppercase");

		oSelVar.addSelectOption("mySelOptName", "I", "EQ", "low-value");

		var expected = [
			{
				Sign: "I",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		];

		var oRanges = oSelVar.getSelectOption("mySelOptName");
		oRanges[0].Sign = "invalid";
		oRanges[0].Option = "messed-with-it";

		assert.deepEqual(oSelVar.getSelectOption("mySelOptName"), expected, "contents of SelectOption stored needs to be stable");
	});

	QUnit.test("add/getSelectOption: adding a Select Option twice does not result in two ranges", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-addExisting");

		oSelVar.addSelectOption("mySelOptName", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName", "I", "EQ", "low-value");

		var expected = [
			{
				Sign: "I",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		];

		assert.deepEqual(oSelVar.getSelectOption("mySelOptName"), expected, "contents of SelectOption stored needs to be stable");
	});

	QUnit.test("getSelectOptionsNames: SelectOptions added needs to be listed", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addSelectOption("mySelOptName", "I", "EQ", "low-value");
		var expected = [
			"mySelOptName"
		];

		assert.deepEqual(oSelVar.getSelectOptionsPropertyNames(), expected, "select option which has been added needs to be available when asking for the list of select option names");
	});

	QUnit.test("getSelectOptionsNames: multiple Ranges in SelectOptions", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addSelectOption("mySelOptName", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName", "I", "LT", "low-value");
		oSelVar.addSelectOption("mySelOptName", "I", "GT", "low-value");
		oSelVar.addSelectOption("mySelOptName", "I", "LE", "low-value");
		oSelVar.addSelectOption("mySelOptName", "I", "GE", "low-value");
		oSelVar.addSelectOption("mySelOptName", "I", "BT", "low-value", "high-value");
		var expected = [
			"mySelOptName"
		];

		assert.deepEqual(oSelVar.getSelectOptionsPropertyNames(), expected, "select option which has been added needs to be available when asking for the list of select option names");
	});

	QUnit.test("getSelectOptionsNames: multiple SelectOptions properties", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addSelectOption("mySelOptName1", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName2", "I", "LT", "low-value");
		oSelVar.addSelectOption("mySelOptName3", "I", "GT", "low-value");
		oSelVar.addSelectOption("mySelOptName6", "I", "LE", "low-value");
		oSelVar.addSelectOption("mySelOptName5", "I", "GE", "low-value");
		oSelVar.addSelectOption("mySelOptName4", "I", "BT", "low-value", "high-value");
		var expected = [
			"mySelOptName1", "mySelOptName2", "mySelOptName3", "mySelOptName4", "mySelOptName5", "mySelOptName6"
		];

		assert.deepEqual(oSelVar.getSelectOptionsPropertyNames().sort(), expected.sort(), "select option which has been added needs to be available when asking for the list of select option names");
	});

	QUnit.test("getPropertyNames: Parameter and SelectOption added need to be listed", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addParameter("myParameterName", "myValue");
		oSelVar.addSelectOption("mySelOptName", "I", "EQ", "low-value");

		var expected = [
			"myParameterName", "mySelOptName"
		];
		assert.deepEqual(oSelVar.getPropertyNames().sort(), expected.sort(), "parameter and select option which have been set need to be available when asking for the PropertyNames");
	});

	QUnit.test("add/getSelectOption: all types of options", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		// please note: adding is out of sequence (another check here!)
		oSelVar.addSelectOption("mySelOptName1", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName2", "I", "LT", "low-value");
		oSelVar.addSelectOption("mySelOptName3", "I", "GT", "low-value");
		oSelVar.addSelectOption("mySelOptName6", "I", "LE", "low-value");
		oSelVar.addSelectOption("mySelOptName5", "I", "GE", "low-value");
		oSelVar.addSelectOption("mySelOptName7", "I", "CP", "low-value");
		oSelVar.addSelectOption("mySelOptName4", "I", "BT", "low-value", "high-value");

		var expected = [
			{
				Sign: "I",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName1"), expected, "equals condition must be returned properly");

		expected = [
			{
				Sign: "I",
				Option: "LT",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName2"), expected, "less-than condition must be returned properly");

		expected = [
			{
				Sign: "I",
				Option: "GT",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName3"), expected, "greater-than condition must be returned properly");

		expected = [
			{
				Sign: "I",
				Option: "BT",
				Low: "low-value",
				High: "high-value"
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName4"), expected, "between condition must be returned properly");

		expected = [
			{
				Sign: "I",
				Option: "GE",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName5"), expected, "greater-or-equal condition must be returned properly");

		expected = [
			{
				Sign: "I",
				Option: "LE",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName6"), expected, "less-or-equal condition must be returned properly");

		expected = [
			{
				Sign: "I",
				Option: "CP",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName7"), expected, "contains-pattern condition must be returned properly");
	});

	QUnit.test("add/getSelectOption: all types of signs", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addSelectOption("mySelOptName1", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName2", "E", "EQ", "low-value");

		var expected = [
			{
				Sign: "I",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName1"), expected, "include-equals condition must be returned properly");

		expected = [
			{
				Sign: "E",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("mySelOptName2"), expected, "exclude-equals condition must be returned properly");
	});

	QUnit.test("addSelectOption: failure on invalid High values", function(assert) {
		var fInvalidHigh = function(sSign, sOption) {
			var oSelVar = new SelectionVariant();
			oSelVar.setID("test-id_1234");

			var sVariant = "(" + sSign + "/" + sOption + ")";

			var thrown = false;
			try {
				oSelVar.addSelectOption("mySelOptName1", sSign, sOption, "low-value", "high-value-specified");
			} catch (x) {
				thrown = true;
				assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error for " + sVariant + " needs to be of type sap.ui.generic.app.navigation.service.NavError");
				//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error for " + sVariant + " needs to be of severity ERROR");
			}

			assert.ok(thrown, "Exception for " + sVariant + " needs to have been thrown");
		};

		fInvalidHigh("I", "EQ");
		fInvalidHigh("I", "LT");
		fInvalidHigh("I", "GT");
		fInvalidHigh("I", "GE");
		fInvalidHigh("I", "LE");
		fInvalidHigh("I", "CP");

		fInvalidHigh("E", "EQ");
	});

	QUnit.test("addSelectOption: failure on invalid sign", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		var thrown = false;
		try {
			oSelVar.addSelectOption("mySelOptName1", "X", "EQ", "low-value");
		} catch (x) {
			thrown = true;
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error on invalid sign needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error on invalid sign needs to be of severity ERROR");
		}

		assert.ok(thrown, "Exception on invalid sign needs to have been thrown");
	});

	QUnit.test("addSelectOption: failure on invalid option", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		var thrown = false;
		try {
			oSelVar.addSelectOption("mySelOptName1", "I", "XX", "low-value");
		} catch (x) {
			thrown = true;
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error on invalid option needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error on invalid option needs to be of severity ERROR");
		}

		assert.ok(thrown, "Exception on invalid option needs to have been thrown");
	});

	QUnit.test("getValue: retrieving select option value", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addSelectOption("myAttribute", "I", "EQ", "low-value");

		var aRange = oSelVar.getValue("myAttribute");
		assert.deepEqual(aRange, [
			{
				Sign: "I",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		], "returned value equals that one to the select option");
	});

	QUnit.test("getValue: retrieving select option value", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		oSelVar.addParameter("myAttribute", "low-value");

		var aRange = oSelVar.getValue("myAttribute");
		assert.deepEqual(aRange, [
			{
				Sign: "I",
				Option: "EQ",
				Low: "low-value",
				High: null
			}
		], "returned value equals that one to the parameter");
	});

	QUnit.test("getValue: retrieving empty value", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234");

		var aRange = oSelVar.getValue("myAttribute");
		assert.deepEqual(aRange, undefined, "undefined shall be returned");
	});

	// NB: no precendence check for getValue() necessary, as adding both a parameter and a property with the same
	// name is prohibited already before calling getValue()

	QUnit.test("toJSONString/toJSONObject: Simple Serialization", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-toJSONString");

		oSelVar.setText("test text for toJSONString check");
		oSelVar.addSelectOption("mySelOptName1", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName2", "I", "LT", "low-value");
		oSelVar.addSelectOption("mySelOptName3", "I", "GT", "low-value");
		oSelVar.addSelectOption("mySelOptName4", "I", "BT", "low-value", "high-value");
		oSelVar.addSelectOption("mySelOptName5", "I", "GE", "low-value");
		oSelVar.addSelectOption("mySelOptName6", "I", "LE", "low-value");
		oSelVar.addSelectOption("mySelOptName7", "I", "CP", "low-value");

		oSelVar.addSelectOption("mySelOptName_duplicate", "I", "CP", "*low-value*");
		oSelVar.addSelectOption("mySelOptName_duplicate", "I", "GT", "next-value");
		oSelVar.addSelectOption("mySelOptName_duplicate", "E", "EQ", "excluded-value");

		oSelVar.addParameter("testParameter1", "value1");
		oSelVar.addParameter("testParameter2", "value2");

		oSelVar.setFilterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult");
		oSelVar.setParameterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters");

		var effective = oSelVar.toJSONString();

		var expected = "{\"Version\":{\"Major\":\"1\",\"Minor\":\"0\",\"Patch\":\"0\"},\"SelectionVariantID\":\"test-id_1234-toJSONString\",\"ParameterContextUrl\":\"/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters\",\"FilterContextUrl\":\"/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult\",\"Text\":\"test text for toJSONString check\",\"ODataFilterExpression\":\"\",\"Parameters\":[{\"PropertyName\":\"testParameter1\",\"PropertyValue\":\"value1\"},{\"PropertyName\":\"testParameter2\",\"PropertyValue\":\"value2\"}],\"SelectOptions\":[{\"PropertyName\":\"mySelOptName1\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName2\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"LT\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName3\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"GT\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName4\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"low-value\",\"High\":\"high-value\"}]},{\"PropertyName\":\"mySelOptName5\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"GE\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName6\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"LE\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName7\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"CP\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName_duplicate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"CP\",\"Low\":\"*low-value*\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"GT\",\"Low\":\"next-value\",\"High\":null},{\"Sign\":\"E\",\"Option\":\"EQ\",\"Low\":\"excluded-value\",\"High\":null}]}]}";

		assert.equal(effective, expected, "Serialization result needs to be as expected");

		// verify that also toJSONObject is returning properly
		var effectiveObject = oSelVar.toJSONObject();
		var expectedObject = JSON.parse(expected);

		assert.deepEqual(effectiveObject, expectedObject, "toJSONObject should also return the same result (using object notation) as toJSONString");

	});

	QUnit.test("toJSONString: check on null value, if high is not defined", function(assert) {
		var fCheckHighNull = function(sSign, sOption) {
			var oSelVar = new SelectionVariant();
			oSelVar.setID("test-id_1234-toJSONString");

			var sVariant = "(" + sSign + "/" + sOption + ")";

			oSelVar.setText("test text for toJSONString check");
			oSelVar.addSelectOption("mySelOptName1", sSign, sOption, "low-value");

			var sJSON = oSelVar.toJSONString();
			var oJSON = JSON.parse(sJSON);

			assert.equal(oJSON.SelectOptions[0].Ranges[0].High, null, "High value for " + sVariant + " needs ot be null");
		};

		fCheckHighNull("I", "EQ");
		fCheckHighNull("I", "GT");
		fCheckHighNull("I", "LT");
		fCheckHighNull("I", "GE");
		fCheckHighNull("I", "LE");
		fCheckHighNull("I", "CP");

		fCheckHighNull("E", "EQ");
	});

	QUnit.test("parseFromString: Simple Deserialization", function(assert) {
		// expected:
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-parseFromString");
		oSelVar.setText("test text for parseFromString check");
		oSelVar.addSelectOption("mySelOptName1", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName2", "I", "LT", "low-value");
		oSelVar.addSelectOption("mySelOptName3", "I", "GT", "low-value");
		oSelVar.addSelectOption("mySelOptName4", "I", "BT", "low-value", "high-value");
		oSelVar.addSelectOption("mySelOptName5", "I", "GE", "low-value");
		oSelVar.addSelectOption("mySelOptName6", "I", "LE", "low-value");
		oSelVar.addSelectOption("mySelOptName7", "I", "CP", "low-value");

		oSelVar.addSelectOption("mySelOptName_duplicate", "I", "CP", "*low-value*");
		oSelVar.addSelectOption("mySelOptName_duplicate", "I", "GT", "next-value");
		oSelVar.addSelectOption("mySelOptName_duplicate", "E", "EQ", "excluded-value");

		oSelVar.addParameter("testParameter1", "value1");
		oSelVar.addParameter("testParameter2", "value2");

		oSelVar.setFilterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult");
		oSelVar.setParameterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters");

		var effectiveString = "{\"Version\":{\"Major\":\"1\",\"Minor\":\"0\",\"Patch\":\"0\"},\"SelectionVariantID\":\"test-id_1234-parseFromString\",\"ParameterContextUrl\":\"/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters\",\"FilterContextUrl\":\"/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult\",\"Text\":\"test text for parseFromString check\",\"ODataFilterExpression\":\"\",\"Parameters\":[{\"PropertyName\":\"testParameter1\",\"PropertyValue\":\"value1\"},{\"PropertyName\":\"testParameter2\",\"PropertyValue\":\"value2\"}],\"SelectOptions\":[{\"PropertyName\":\"mySelOptName1\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"EQ\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName2\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"LT\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName3\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"GT\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName4\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"BT\",\"Low\":\"low-value\",\"High\":\"high-value\"}]},{\"PropertyName\":\"mySelOptName5\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"GE\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName6\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"LE\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName7\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"CP\",\"Low\":\"low-value\",\"High\":null}]},{\"PropertyName\":\"mySelOptName_duplicate\",\"Ranges\":[{\"Sign\":\"I\",\"Option\":\"CP\",\"Low\":\"*low-value*\",\"High\":null},{\"Sign\":\"I\",\"Option\":\"GT\",\"Low\":\"next-value\",\"High\":null},{\"Sign\":\"E\",\"Option\":\"EQ\",\"Low\":\"excluded-value\",\"High\":null}]}]}";
		var effective = new SelectionVariant(effectiveString);

		assert.deepEqual(effective, oSelVar, "Deserialization result needs to be as expected");
	});

	// The SelectionVariantID is mandatory according to the specification document version 1.0, but this document is not a universally valid standard.
	// Thus, also allow an initial SelectionVariantID. => test commented out

	//QUnit.test("parseFromString: Failure on missing SelectionVariantID", function(assert) {
	//	var sJSON = "{invalidJSON}";
	//
	//	var thrown = false;
	//	try {
	//		var effective = new sap.ui.generic.app.navigation.service.SelectionVariant(sJSON);
	//	} catch (x) {
	//		thrown = true;
	//	}
	//	assert.ok(thrown, "Generic Exception on invalid JSON string needs to have been thrown");
	//});

	//The SelectionVariantID is mandatory according to the specification document version 1.0, but this document is not a universally valid standard.
	//Thus, also allow an initial SelectionVariantID. => test commented out

	//QUnit.test("parseFromString: Failure on missing SelectionVariantID", function(assert) {
	//	var oJSON = {
	//		"Version" : {
	//			"Major" : "1",
	//			"Minor" : "0",
	//			"Patch" : "0"
	//		},
	//		// missing! "SelectionVariantID" : "test-id_1234-parseFromString",
	//		"ParameterContextUrl" : "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters",
	//		"FilterContextUrl" : "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult",
	//		"Text" : "test text for parseFromString check",
	//		"ODataFilterExpression" : "",
	//		"Parameters" : [ {
	//			"PropertyName" : "testParameter1",
	//			"PropertyValue" : "value1"
	//		}, {
	//			"PropertyName" : "testParameter2",
	//			"PropertyValue" : "value2"
	//		} ],
	//		"SelectOptions" : [ {
	//			"PropertyName" : "mySelOptName1",
	//			"Ranges" : [ {
	//				"Sign" : "I",
	//				"Option" : "EQ",
	//				"Low" : "low-value",
	//				"High" : null
	//			} ]
	//		}, {
	//			"PropertyName" : "mySelOptName_duplicate",
	//			"Ranges" : [ {
	//				"Sign" : "I",
	//				"Option" : "CP",
	//				"Low" : "*low-value*",
	//				"High" : null
	//			}, {
	//				"Sign" : "I",
	//				"Option" : "GT",
	//				"Low" : "next-value",
	//				"High" : null
	//			}, {
	//				"Sign" : "E",
	//				"Option" : "EQ",
	//				"Low" : "excluded-value",
	//				"High" : null
	//			} ]
	//		} ]
	//	};
	//	var sJSON = JSON.stringify(oJSON);
	//
	//	var thrown = false;
	//	try {
	//		var effective = new sap.ui.generic.app.navigation.service.SelectionVariant(sJSON);
	//	} catch (x) {
	//		thrown = true;
	//		assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error on invalid SelectionVariant needs to be of type sap.ui.generic.app.navigation.service.NavError");
	//		assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error on invalid SelectionVariant needs to be of severity ERROR");
	//	}
	//	assert.ok(thrown, "Exception on invalid SelectionVariant needs to have been thrown");
	//});

	QUnit.test("parseFromString: Failure on missing PropertyName", function(assert) {
		var oJSON = {
			"Version": {
				"Major": "1",
				"Minor": "0",
				"Patch": "0"
			},
			"SelectionVariantID": "test-id_1234-parseFromString",
			"ParameterContextUrl": "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters",
			"FilterContextUrl": "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult",
			"Text": "test text for parseFromString check",
			"ODataFilterExpression": "",
			"Parameters": [
				{
					"PropertyName": "testParameter1",
					"PropertyValue": "value1"
				}, {
					"PropertyName": "testParameter2",
					"PropertyValue": "value2"
				}
			],
			"SelectOptions": [
				{
					// "PropertyName" : "mySelOptName1",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "low-value",
							"High": null
						}
					]
				}, {
					"PropertyName": "mySelOptName_duplicate",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "CP",
							"Low": "*low-value*",
							"High": null
						}, {
							"Sign": "I",
							"Option": "GT",
							"Low": "next-value",
							"High": null
						}, {
							"Sign": "E",
							"Option": "EQ",
							"Low": "excluded-value",
							"High": null
						}
					]
				}
			]
		};
		var sJSON = JSON.stringify(oJSON);

		var thrown = false;
		try {
			new SelectionVariant(sJSON);
		} catch (x) {
			thrown = true;
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error on missing PropertyName needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error on missing PropertyName needs to be of severity ERROR");
		}
		assert.ok(thrown, "Exception on missing PropertyName needs to have been thrown");
	});

	QUnit.test("parseFromString: Failure on missing ParameterName", function(assert) {
		var oJSON = {
			"Version": {
				"Major": "1",
				"Minor": "0",
				"Patch": "0"
			},
			"SelectionVariantID": "test-id_1234-parseFromString",
			"ParameterContextUrl": "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters",
			"FilterContextUrl": "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult",
			"Text": "test text for parseFromString check",
			"ODataFilterExpression": "",
			"Parameters": [
				{
					"PropertyName": "testParameter1",
					"PropertyValue": "value1"
				}, {
					// this entry will be missing: "PropertyName" : "testParameter2",
					"PropertyValue": "value2"
				}
			],
			"SelectOptions": [
				{
					"PropertyName": "mySelOptName1",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "low-value",
							"High": null
						}
					]
				}, {
					"PropertyName": "mySelOptName_duplicate",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "CP",
							"Low": "*low-value*",
							"High": null
						}, {
							"Sign": "I",
							"Option": "GT",
							"Low": "next-value",
							"High": null
						}, {
							"Sign": "E",
							"Option": "EQ",
							"Low": "excluded-value",
							"High": null
						}
					]
				}
			]
		};
		var sJSON = JSON.stringify(oJSON);

		var thrown = false;
		try {
			new SelectionVariant(sJSON);
		} catch (x) {
			thrown = true;
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error on missing ParameterName needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error on missing ParameterName needs to be of severity ERROR");
		}
		assert.ok(thrown, "Exception on missing ParameterName needs to have been thrown");
	});

	QUnit.test("parseFromString: Failure on invalid Ranges format", function(assert) {
		var oJSON = {
			"Version": {
				"Major": "1",
				"Minor": "0",
				"Patch": "0"
			},
			"SelectionVariantID": "test-id_1234-parseFromString",
			"ParameterContextUrl": "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters",
			"FilterContextUrl": "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult",
			"Text": "test text for parseFromString check",
			"ODataFilterExpression": "",
			"Parameters": [
				{
					"PropertyName": "testParameter1",
					"PropertyValue": "value1"
				}, {
					"PropertyName": "testParameter2",
					"PropertyValue": "value2"
				}
			],
			"SelectOptions": [
				{
					"PropertyName": "mySelOptName1",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "low-value",
							"High": null
						}
					]
				}, {
					"PropertyName": "mySelOptName_duplicate",
					"Ranges": // here's the error in the format! --> needs to be an array
					{
						"Sign": "I",
						"Option": "CP",
						"Low": "*low-value*",
						"High": null
					}
				}
			]
		};
		var sJSON = JSON.stringify(oJSON);

		var thrown = false;
		try {
			new SelectionVariant(sJSON);
		} catch (x) {
			thrown = true;
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error on invalid Ranges format needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error on invalid Ranges format needs to be of severity ERROR");
		}
		assert.ok(thrown, "Exception on invalid Ranges format needs to have been thrown");
	});

	QUnit.test("parseFromString: empty Select Options need to be ignored", function(assert) {
		var oJSON = {
			"Version": {
				"Major": "1",
				"Minor": "0",
				"Patch": "0"
			},
			"SelectionVariantID": "test-id_1234-parseFromString",
			"ParameterContextUrl": "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters",
			"FilterContextUrl": "/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult",
			"Text": "test text for parseFromString check",
			"ODataFilterExpression": "",
			"Parameters": [
				{
					"PropertyName": "testParameter1",
					"PropertyValue": "value1"
				}, {
					"PropertyName": "testParameter2",
					"PropertyValue": "value2"
				}
			],
			"SelectOptions": [
				{
					"PropertyName": "mySelOptName1",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "low-value",
							"High": null
						}
					]
				}, {
					"PropertyName": "mySelOptName_duplicate"

				}
			]
		};
		var sJSON = JSON.stringify(oJSON);

		try {
			var effective = new SelectionVariant(sJSON);
		} catch (x) {
			assert.ok(false, "Exception on missing Ranges shall not be thrown!");
		}

		assert.equal(effective.getSelectOption("mySelOptName_duplicate"), undefined, "Property Name shall be skipped entirely");

		assert.deepEqual(effective.getSelectOption("mySelOptName1"), [
			{
				"Sign": "I",
				"Option": "EQ",
				"Low": "low-value",
				"High": null
			}
		], "mySelOptName1 needs to remain intact");
	});

	QUnit.test("toJSONString/parse via Constructor: idempotence", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-idempotency");

		oSelVar.setText("test text for idempotence check");
		oSelVar.addSelectOption("mySelOptName1", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName2", "I", "LT", "low-value");
		oSelVar.addSelectOption("mySelOptName3", "I", "GT", "low-value");
		oSelVar.addSelectOption("mySelOptName4", "I", "BT", "low-value", "high-value");
		oSelVar.addSelectOption("mySelOptName5", "I", "GE", "low-value");
		oSelVar.addSelectOption("mySelOptName6", "I", "LE", "low-value");
		oSelVar.addSelectOption("mySelOptName7", "I", "CP", "low-value");

		oSelVar.addSelectOption("mySelOptName_duplicate", "I", "CP", "*low-value*");
		oSelVar.addSelectOption("mySelOptName_duplicate", "I", "GT", "next-value");
		oSelVar.addSelectOption("mySelOptName_duplicate", "E", "EQ", "excluded-value");

		oSelVar.addParameter("testParameter1", "value1");
		oSelVar.addParameter("testParameter2", "value2");

		oSelVar.setFilterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult");
		oSelVar.setParameterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters");

		var sJsonSerialization = oSelVar.toJSONString();

		var oRestoredSelVar = new SelectionVariant(sJsonSerialization);

		assert.deepEqual(oRestoredSelVar, oSelVar, "result after seralization+deserialization needs to be identical");
	});

	QUnit.test("toJSONObject/parse via Constructor: idempotence", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-idempotency");

		oSelVar.setText("test text for idempotence check");
		oSelVar.addSelectOption("mySelOptName1", "I", "EQ", "low-value");
		oSelVar.addSelectOption("mySelOptName2", "I", "LT", "low-value");
		oSelVar.addSelectOption("mySelOptName3", "I", "GT", "low-value");
		oSelVar.addSelectOption("mySelOptName4", "I", "BT", "low-value", "high-value");
		oSelVar.addSelectOption("mySelOptName5", "I", "GE", "low-value");
		oSelVar.addSelectOption("mySelOptName6", "I", "LE", "low-value");
		oSelVar.addSelectOption("mySelOptName7", "I", "CP", "low-value");

		oSelVar.addSelectOption("mySelOptName_duplicate", "I", "CP", "*low-value*");
		oSelVar.addSelectOption("mySelOptName_duplicate", "I", "GT", "next-value");
		oSelVar.addSelectOption("mySelOptName_duplicate", "E", "EQ", "excluded-value");

		oSelVar.addParameter("testParameter1", "value1");
		oSelVar.addParameter("testParameter2", "value2");

		oSelVar.setFilterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryResult");
		oSelVar.setParameterContextUrl("/sap/opu/odata/myOdataService//$metadata#AccountBalanceQueryParameters");

		var oJsonSerialization = oSelVar.toJSONObject();

		var oRestoredSelVar = new SelectionVariant(oJsonSerialization);

		assert.deepEqual(oRestoredSelVar, oSelVar, "result after seralization+deserialization needs to be identical");
	});

	QUnit.test("removeParameter: idempotency with addParameter", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-removeParameter");

		oSelVar.setText("test text for removeParameter check");

		oSelVar.addParameter("testParameter1", "value1");
		assert.equal(oSelVar.getParameter("testParameter1"), "value1", "value before removing the parameter needs to be set");

		oSelVar.removeParameter("testParameter1");
		assert.equal(oSelVar.getParameter("testParameter1"), undefined, "value after removing the parameter needs to be undefined");

	});

	QUnit.test("removeParameter: removed parameter not available on serialization", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-removeParameter");

		oSelVar.setText("test text for removeParameter check");

		oSelVar.addParameter("testParameter1", "value1");
		assert.equal(oSelVar.getParameter("testParameter1"), "value1", "value before removing the parameter needs to be set");

		oSelVar.removeParameter("testParameter1");

		var sJsonSerialization = oSelVar.toJSONString();
		assert.equal(sJsonSerialization, "{\"Version\":{\"Major\":\"1\",\"Minor\":\"0\",\"Patch\":\"0\"},\"SelectionVariantID\":\"test-id_1234-removeParameter\",\"Text\":\"test text for removeParameter check\",\"ODataFilterExpression\":\"\",\"Parameters\":[],\"SelectOptions\":[]}", "serialization is not equal to expected serialized value");
	});

	QUnit.test("removeParameter: removed Parameter is no longer available in getParameterNames", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-removeParameter");

		oSelVar.setText("test text for removeParameter check");

		oSelVar.addParameter("testParameter1", "value1");
		oSelVar.addParameter("testParameter2", "value2");

		oSelVar.removeParameter("testParameter1");

		var parameterNames = oSelVar.getParameterNames();
		var expectedParameterNames = [
			"testParameter2"
		];
		assert.deepEqual(parameterNames, expectedParameterNames, "parameter names may only include the single parameter 'testParameter2'");

	});

	QUnit.test("removeSelectOption: idempotency with addSelectOption", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-removeSelectOption");

		oSelVar.setText("test text for removeSelectOption check");

		oSelVar.addSelectOption("testSelOpt1", "I", "EQ", "4711");
		var expectedRange = [
			{
				"High": null,
				"Low": "4711",
				"Option": "EQ",
				"Sign": "I"
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("testSelOpt1"), expectedRange, "value before removing the SelectOption needs to be set");

		oSelVar.removeSelectOption("testSelOpt1");
		assert.equal(oSelVar.getParameter("testSelOpt1"), undefined, "value after removing the SelectOption needs to be undefined");

	});

	QUnit.test("removeSelectOption: removed Select Option not available on serialization", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-removeSelectOption");

		oSelVar.setText("test text for removeSelectOption check");

		oSelVar.addSelectOption("testSelOpt1", "I", "EQ", "4711");
		var expectedRange = [
			{
				"High": null,
				"Low": "4711",
				"Option": "EQ",
				"Sign": "I"
			}
		];
		assert.deepEqual(oSelVar.getSelectOption("testSelOpt1"), expectedRange, "value before removing the SelectOption needs to be set");

		oSelVar.removeSelectOption("testSelOpt1");

		var sJsonSerialization = oSelVar.toJSONString();
		assert.equal(sJsonSerialization, "{\"Version\":{\"Major\":\"1\",\"Minor\":\"0\",\"Patch\":\"0\"},\"SelectionVariantID\":\"test-id_1234-removeSelectOption\",\"Text\":\"test text for removeSelectOption check\",\"ODataFilterExpression\":\"\",\"Parameters\":[],\"SelectOptions\":[]}", "serialization is not equal to expected serialized value");
	});

	QUnit.test("removeSelectOption: removed Select Option is no longer available in getSelectOptionsPropertyNames", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.setID("test-id_1234-removeSelectOption");

		oSelVar.setText("test text for removeSelectOption check");

		oSelVar.addSelectOption("testSelOpt1", "I", "EQ", "4711");
		oSelVar.addSelectOption("testSelOpt2", "I", "EQ", "4712");

		oSelVar.removeSelectOption("testSelOpt1");

		var propertyNames = oSelVar.getSelectOptionsPropertyNames();
		var expectedPropertyNames = [
			"testSelOpt2"
		];

		assert.deepEqual(propertyNames, expectedPropertyNames, "set of property names is expected to only include testSelOpt2");
	});

	QUnit.test("renameParameter - success", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addParameter("paramOld", "value");
		oSelVar.addParameter("param2", "value2");
		oSelVar.renameParameter("paramOld", "paramNew");
		assert.equal(oSelVar.getParameter("paramOld"), undefined, "old parameter must be deleted");
		assert.equal(oSelVar.getParameter("paramNew"), "value", "new parameter must be set");
		assert.equal(oSelVar.getParameter("param2"), "value2", "other parameter must not be changed");
	});

	QUnit.test("renameParameter - no changes", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addParameter("paramNew", "value");
		var sSelVarOld = oSelVar.toJSONString();
		// renaming shall work, because 'paramOld' does not exist, although another parameter with the new name exists
		oSelVar.renameParameter("paramOld", "paramNew");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameParameter - error INVALID_INPUT_TYPE", function(assert) {
		var oSelVar = new SelectionVariant();
		var sSelVarOld = oSelVar.toJSONString();
		var thrown = false;
		try {
			oSelVar.renameParameter(undefined, "paramNew");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.INVALID_INPUT_TYPE", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameParameter - error PARAMETER_WITHOUT_NAME", function(assert) {
		var oSelVar = new SelectionVariant();
		var sSelVarOld = oSelVar.toJSONString();
		var thrown = false;
		try {
			oSelVar.renameParameter("", "paramNew");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.PARAMETER_WITHOUT_NAME", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameParameter - error PARAMETER_COLLISION", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addParameter("paramOld", "value");
		oSelVar.addParameter("paramNew", "value2");
		var sSelVarOld = oSelVar.toJSONString();
		var thrown = false;
		try {
			oSelVar.renameParameter("paramOld", "paramNew");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.PARAMETER_COLLISION", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameParameter - error PARAMETER_SELOPT_COLLISION", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addParameter("paramOld", "value");
		oSelVar.addSelectOption("paramNew", "I", "EQ", "value2");
		var sSelVarOld = oSelVar.toJSONString();
		var thrown = false;
		try {
			oSelVar.renameParameter("paramOld", "paramNew");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.PARAMETER_SELOPT_COLLISION", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameSelectOption - success", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addSelectOption("selOptOld", "I", "EQ", "value");
		oSelVar.addSelectOption("selOpt2", "I", "EQ", "value2");
		oSelVar.renameSelectOption("selOptOld", "selOptNew");
		assert.equal(oSelVar.getSelectOption("selOptOld"), undefined, "old select option must be deleted");
		assert.deepEqual(oSelVar.getSelectOption("selOptNew"), [
			{
				"High": null,
				"Low": "value",
				"Option": "EQ",
				"Sign": "I"
			}
		], "new select option must be set");
		assert.deepEqual(oSelVar.getSelectOption("selOpt2"), [
			{
				"High": null,
				"Low": "value2",
				"Option": "EQ",
				"Sign": "I"
			}
		], "other select option must not be changed");
	});

	QUnit.test("renameSelectOption - no changes", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addSelectOption("selOptNew", "I", "EQ", "value");
		var sSelVarOld = oSelVar.toJSONString();
		// renaming shall work, because 'selOptOld' does not exist, although another select option with the new name exists
		oSelVar.renameSelectOption("selOptOld", "selOptNew");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameSelectOption - error SELOPT_WRONG_TYPE", function(assert) {
		var oSelVar = new SelectionVariant();
		var sSelVarOld = oSelVar.toJSONString();
		var thrown = false;
		try {
			oSelVar.renameSelectOption(undefined, "selOptNew");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.SELOPT_WRONG_TYPE", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameSelectOption - error SELOPT_WITHOUT_NAME", function(assert) {
		var oSelVar = new SelectionVariant();
		var sSelVarOld = oSelVar.toJSONString();
		var thrown = false;
		try {
			oSelVar.renameSelectOption("", "selOptNew");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.SELOPT_WITHOUT_NAME", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameSelectOption - error SELOPT_COLLISION", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addSelectOption("selOptOld", "I", "EQ", "value");
		oSelVar.addSelectOption("selOptNew", "I", "EQ", "value2");
		var sSelVarOld = oSelVar.toJSONString();
		var thrown = false;
		try {
			oSelVar.renameSelectOption("selOptOld", "selOptNew");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.SELOPT_COLLISION", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("renameSelectOption - error PARAMETER_SELOPT_COLLISION", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addSelectOption("selOptOld", "I", "EQ", "value");
		oSelVar.addParameter("selOptNew", "value2");
		var sSelVarOld = oSelVar.toJSONString();
		var thrown = false;
		try {
			oSelVar.renameSelectOption("selOptOld", "selOptNew");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.PARAMETER_SELOPT_COLLISION", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.equal(oSelVar.toJSONString(), sSelVarOld, "Selection variant must not be changed");
	});

	QUnit.test("isEmpty - positive case", function(assert) {
		var oSelVar = new SelectionVariant();

		assert.equal(oSelVar.isEmpty(), true, "There is no parameter and no SelOpt on it - the SelVar is empty");
	});

	QUnit.test("isEmpty - negative case: parameters", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addParameter("selOptNew", "value2");

		assert.equal(oSelVar.isEmpty(), false, "There is a parameter on it - the SelVar is not empty");
	});

	QUnit.test("isEmpty - negative case: selopt", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addSelectOption("selOptOld", "I", "EQ", "value");

		assert.equal(oSelVar.isEmpty(), false, "There is a SelOpt on it - the SelVar is not empty");
	});

	QUnit.test("isEmpty - negative case: selopt & parameters", function(assert) {
		var oSelVar = new SelectionVariant();
		oSelVar.addParameter("selOptNew", "value2");
		oSelVar.addSelectOption("selOptOld", "I", "EQ", "value");

		assert.equal(oSelVar.isEmpty(), false, "There are both parameters and SelOpt at the SelVar - the SelVar is not empty");
	});

	QUnit.test("massAddSelectOption", function(assert) {
		var oSelVar = new SelectionVariant();
		var sPropName = "selOpt1";
		oSelVar.addSelectOption(sPropName, "I", "EQ", "value1");
		oSelVar.addSelectOption(sPropName, "I", "EQ", "value2");
		oSelVar.addSelectOption(sPropName, "I", "BT", "value3", "value4");

		var oSelVarNew = new SelectionVariant();
		oSelVarNew.massAddSelectOption(sPropName, oSelVar.getValue(sPropName));

		assert.deepEqual(oSelVar.getValue(sPropName), oSelVarNew.getValue(sPropName), "SelOpt was added completely");
	});

	QUnit.test("massAddSelectOption - invalid input", function(assert) {
		var oSelVar = new SelectionVariant();
		var sPropName = "selOpt1";
		oSelVar.addSelectOption(sPropName, "I", "EQ", "value1");
		oSelVar.addSelectOption(sPropName, "I", "EQ", "value2");
		oSelVar.addSelectOption(sPropName, "I", "BT", "value3", "value4");

		var thrown = false;
		var oSelVarNew = new SelectionVariant();
		try {
			oSelVarNew.massAddSelectOption(sPropName, "this is a string");
		} catch (x) {
			assert.ok(x instanceof sap.ui.generic.app.navigation.service.NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			//assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			assert.equal(x.getErrorCode(), "SelectionVariant.INVALID_INPUT_TYPE", "error code needs to be correct");
			thrown = true;
		}
		assert.ok(thrown, "Exception has been thrown successfully");
		assert.ok(oSelVarNew.isEmpty(), "Selection variant must not be changed");
	});

});