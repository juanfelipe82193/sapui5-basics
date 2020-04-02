/* global QUnit, sinon */
sap.ui.define([
	"sap/ui/generic/app/navigation/service/NavigationHandler", "sap/ui/generic/app/navigation/service/NavError", "sap/ui/generic/app/navigation/service/SelectionVariant", "sap/ui/generic/app/library", "./CrossAppNavigationServiceMock", "sap/base/Log", "sap/ui/core/routing/HashChanger"
], function(NavigationHandler, NavError, SelectionVariant, genericAppLibrary, CrossAppNavigationServiceMock, Log, HashChanger) {
	"use strict";

	// shortcuts for types from sap.ui.generic.app.library
	var NavType = genericAppLibrary.navigation.service.NavType;
	var ParamHandlingMode = genericAppLibrary.navigation.service.ParamHandlingMode;
	var SuppressionBehavior = genericAppLibrary.navigation.service.SuppressionBehavior;

	/**
	 * tests for the sap.ui.generic.app.navigation.service.NavigationHandler class
	 */
	QUnit.module("nav.NavigationHandler", {});

	QUnit.test("Test of _getURLParametersFromSelectionVariant", function(assert) {

		var aTestScenarios = [];
		var oSelectionVariant = {};
		var oExpectedParameters = {};
		var oActualParameters = {};

		function addTestScenario(sTestDescription) {
			// utility function to add a test scenario to the array aTestScenarios
			var sSelectionVariant = JSON.stringify(oSelectionVariant);
			var oSelVar = new SelectionVariant(sSelectionVariant);
			aTestScenarios.push({
				"TestDescription": sTestDescription,
				"sSelectionVariant": sSelectionVariant,
				"oSelectionVariant": oSelVar,
				"ExpectedParameters": oExpectedParameters
			});
		}

		// define test scenarios
		oSelectionVariant = {
			"Parameters": [],
			"SelectOptions": []
		};
		oExpectedParameters = {};
		addTestScenario("Empty parameters and select options");

		oSelectionVariant = {
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "KeyDate",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-01-27T10:32:07.565Z",
							"High": null
						}
					]
				}
			]
		};
		oExpectedParameters = {
			"KeyDate": "2015-01-27T10:32:07.565Z"
		};
		addTestScenario("Select option with one property (I EQ)");

		oSelectionVariant = {
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "KeyDate",
					"Ranges": [
						{
							"Sign": "E",
							"Option": "EQ",
							"Low": "2015-01-27T10:32:07.565Z",
							"High": null
						}
					]
				}
			]
		};
		oExpectedParameters = {};
		addTestScenario("Select option with one property (E EQ)");

		oSelectionVariant = {
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "KeyDate",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "GT",
							"Low": "2015-01-27T10:32:07.565Z",
							"High": null
						}
					]
				}
			]
		};
		oExpectedParameters = {};
		addTestScenario("Select option with one property (I GT)");

		oSelectionVariant = {
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "KeyDate",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "BT",
							"Low": "2015-01-27T10:32:07.565Z",
							"High": "2015-01-28T10:32:07.565Z"
						}
					]
				}
			]
		};
		oExpectedParameters = {};
		addTestScenario("Select option with one property (I BT)");

		oSelectionVariant = {
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "KeyDate",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "2015-01-27T10:32:07.565Z",
							"High": null
						}
					]
				}, {
					"PropertyName": "CompanyCode",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "F001",
							"High": null
						}
					]
				}
			]
		};
		oExpectedParameters = {
			"KeyDate": "2015-01-27T10:32:07.565Z",
			"CompanyCode": "F001"
		};
		addTestScenario("Select option with two properties (I EQ)");

		oSelectionVariant = {
			"Parameters": [],
			"SelectOptions": [
				{
					"PropertyName": "CompanyCode",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "F001",
							"High": null
						}, {
							"Sign": "I",
							"Option": "EQ",
							"Low": "F002",
							"High": null
						}
					]
				}
			]
		};
		oExpectedParameters = {};
		addTestScenario("Select option with one property, but two values (I EQ)");

		oSelectionVariant = {
			"Parameters": [
				{
					"PropertyName": "CompanyCode",
					"PropertyValue": "F001"
				}, {
					"PropertyName": "FiscalYear",
					"PropertyValue": "2015"
				}, {
					"PropertyName": "Customer",
					"PropertyValue": "C0001"
				}
			],
			"SelectOptions": []
		};
		oExpectedParameters = {
			"CompanyCode": "F001",
			"FiscalYear": "2015",
			"Customer": "C0001"
		};
		addTestScenario("Parameters");

		oSelectionVariant = {
			"Parameters": [
				{
					"PropertyName": "FiscalYear",
					"PropertyValue": "2015"
				}, {
					"PropertyName": "Customer",
					"PropertyValue": "C0001"
				}
			],
			"SelectOptions": [
				{
					"PropertyName": "CompanyCode",
					"Ranges": [
						{
							"Sign": "I",
							"Option": "EQ",
							"Low": "F002",
							"High": null
						}
					]
				}
			]
		};
		oExpectedParameters = {
			"CompanyCode": "F002",
			"FiscalYear": "2015",
			"Customer": "C0001"
		};
		addTestScenario("Parameters and select options without conflict");

		// execute the tests
		for (var i = 0; i < aTestScenarios.length; i++) {
			// log test scenario description
			assert.ok(true, "Running scenario: " + aTestScenarios[i].TestDescription);
			// call method to be tested with first parameter *s*SelectionVariant
			oActualParameters = NavigationHandler.prototype._getURLParametersFromSelectionVariant(aTestScenarios[i].sSelectionVariant);
			// compare data
			assert.deepEqual(oActualParameters, aTestScenarios[i].ExpectedParameters, "sSelectionVariant: Actual parameters must be equal to expected parameters");
			// call method to be tested with second parameter *o*SelectionVariant
			oActualParameters = NavigationHandler.prototype._getURLParametersFromSelectionVariant(aTestScenarios[i].oSelectionVariant);
			// compare data
			assert.deepEqual(oActualParameters, aTestScenarios[i].ExpectedParameters, "oSelectionVariant: Actual parameters must be equal to expected parameters");
		}
	});

	QUnit.test("mixAttributesAndSelectionVariant: semantic attribute is taken over to Select Option - no overwrite", function(assert) {

		var oSelVar = new SelectionVariant();
		oSelVar.setID("dummy");

		var oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant({
			attribute1: "value1"
		}, oSelVar.toJSONString());

		assert.ok(oActualSelectionVariant instanceof SelectionVariant, "returned value needs to be an instance of SelectionVariant");

		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [
			"attribute1"
		], "attribute1 needs to be a select option");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "value1",
				High: null
			}
		], "Value needs to be in the range of select options");
	});

	QUnit.test("mixAttributesAndSelectionVariant: semantic attribute is taken over to Select Option - overwrite", function(assert) {

		var oSelVar = new SelectionVariant();
		oSelVar.setID("dummy");
		oSelVar.addSelectOption("attribute1", "I", "EQ", "value2");

		var oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant({
			attribute1: "value1"
		}, oSelVar.toJSONString());

		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [
			"attribute1"
		], "attribute1 needs to be a select option");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "value1",
				High: null
			}
		], "Value needs to be in the range of select options");
	});

	QUnit.test("mixAttributesAndSelectionVariant: parameters are converted to select option", function(assert) {

		var oSelVar = new SelectionVariant();
		oSelVar.setID("dummy");
		oSelVar.addParameter("attribute1", "value1");

		var oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant({
			attribute2: "value2"
		}, oSelVar.toJSONString());

		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames().sort(), [
			"attribute1", "attribute2"
		], "attribute1 and attribute2 need to be a select option");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "value1",
				High: null
			}
		], "Parameter needs to be in the range of select options");

		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute2"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "value2",
				High: null
			}
		], "Semantic attribute needs to be passed through converted as select option");
	});

	QUnit.test("mixAttributesAndSelectionVariant: semantic attribute is converted to string", function(assert) {

		var oSelVar = new SelectionVariant();
		oSelVar.setID("dummy");

		var oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant({
			attribute1: "text",
			attribute2: 2,
			attribute3: 3.45,
			attribute4: true,
			attribute5: false,
			attribute6: [
				"a", "b"
			],
			attribute7: {
				"a": "b"
			},
			attribute8: new Date("Thu Jan 01 2015")
		}, oSelVar.toJSONString());

		assert.ok(oActualSelectionVariant instanceof SelectionVariant, "returned value needs to be an instance of SelectionVariant");
		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [
			"attribute1", "attribute2", "attribute3", "attribute4", "attribute5", "attribute6", "attribute7", "attribute8"
		], "attributes 1-8 need to be select options");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "text",
				High: null
			}
		], "Value needs to be a string and in the range of select options");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute2"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "2",
				High: null
			}
		], "Value needs to be a string and in the range of select options");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute3"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "3.45",
				High: null
			}
		], "Value needs to be a string and in the range of select options");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute4"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "true",
				High: null
			}
		], "Value needs to be a string and in the range of select options");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute5"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "false",
				High: null
			}
		], "Value needs to be a string and in the range of select options");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute6"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: JSON.stringify([
					"a", "b"
				]),
				High: null
			}
		], "Value needs to be a string and in the range of select options");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute7"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: JSON.stringify({
					"a": "b"
				}),
				High: null
			}
		], "Value needs to be a string and in the range of select options");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute8"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: (new Date("Thu Jan 01 2015")).toJSON(),
				High: null
			}
		], "Value needs to be a string and in the range of select options");
	});

	QUnit.test("mixAttributesAndSelectionVariant: suppression behavior = standard", function(assert) {

		var oSelVar = new SelectionVariant();
		var mSmanticAttributes = {
			attribute1: "test",
			attrubute2: null,
			attribute3: undefined,
			attribute4: ""
		};
		var spy = sinon.spy(Log, "warning");
		var oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.standard);
		assert.ok(spy.calledTwice, "Two warning messages must be raised");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "test",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute1");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute4"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute4");
		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [], "Only expected select options must be created");
		spy.restore();
	});

	QUnit.test("mixAttributesAndSelectionVariant: suppression behavior = ignoreEmptyString", function(assert) {

		var oSelVar = new SelectionVariant();
		var mSmanticAttributes = {
			attribute1: "test",
			attrubute2: null,
			attribute3: undefined,
			attribute4: ""
		};
		var spyWarning = sinon.spy(Log, "warning");
		var spyInfo = sinon.spy(Log, "info");

		var oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.ignoreEmptyString);

		assert.ok(spyWarning.calledTwice, "Two warning messages (for null and undefined) must be raised");
		assert.ok(spyInfo.calledOnce, "A info message (for the empty string) must be raised");

		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "test",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute1");
		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [], "Only expected select options must be created");

		spyWarning.restore();
		spyInfo.restore();
	});

	QUnit.test("mixAttributesAndSelectionVariant: suppression behavior = raiseErrorOnNull", function(assert) {

		// positive test
		var oSelVar = new SelectionVariant();
		var mSmanticAttributes = {
			attribute1: null
		};
		var bError = false;
		var oActualSelectionVariant;
		try {
			NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull);
		} catch (oError) {
			bError = true;
			assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
		}
		assert.ok(bError, "An error message must be raised");

		// negative test
		mSmanticAttributes = {
			attribute1: "test",
			attribute2: undefined,
			attribute3: ""
		};
		var spy = sinon.spy(Log, "warning");
		oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull);
		assert.ok(spy.calledOnce, "One warning message must be raised");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "test",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute1");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute3"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute3");
		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [], "Only expected select options must be created");
		spy.restore();
	});

	QUnit.test("mixAttributesAndSelectionVariant: suppression behavior = raiseErrorOnUndefined", function(assert) {

		// positive test
		var oSelVar = new SelectionVariant();
		var mSmanticAttributes = {
			attribute1: undefined
		};
		var bError = false;
		var oActualSelectionVariant;
		try {
			oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnUndefined);
		} catch (oError) {
			bError = true;
			assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
		}
		assert.ok(bError, "An error message must be raised");

		// negative test
		mSmanticAttributes = {
			attribute1: "test",
			attribute2: null,
			attribute3: ""
		};
		var spy = sinon.spy(Log, "warning");
		oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnUndefined);
		assert.ok(spy.calledOnce, "One warning message must be raised");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "test",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute1");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute3"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute3");
		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [], "Only expected select options must be created");
		spy.restore();

	});

	QUnit.test("mixAttributesAndSelectionVariant: suppression behavior = raiseErrorOnNull | ignoreEmptyString", function(assert) {

		// positive test
		var oSelVar = new SelectionVariant();
		var mSmanticAttributes = {
			attribute1: null
		};
		var bError = false;
		var oActualSelectionVariant;
		try {
			oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull | SuppressionBehavior.ignoreEmptyString);
		} catch (oError) {
			bError = true;
			assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
		}
		assert.ok(bError, "An error message must be raised");

		// negative test
		mSmanticAttributes = {
			attribute1: "test",
			attribute2: undefined,
			attribute3: ""
		};
		var spyWarning = sinon.spy(Log, "warning");
		var spyInfo = sinon.spy(Log, "info");

		oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull | SuppressionBehavior.ignoreEmptyString);
		assert.ok(spyWarning.calledOnce, "One warning message must be raised");
		assert.ok(spyInfo.calledOnce, "One info message must be raised");

		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "test",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute1");
		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [], "Only expected select options must be created");

		spyWarning.restore();
		spyInfo.restore();
	});

	QUnit.test("mixAttributesAndSelectionVariant: suppression behavior = raiseErrorOnUndefined | ignoreEmptyString", function(assert) {

		// positive test
		var oSelVar = new SelectionVariant();
		var mSmanticAttributes = {
			attribute1: undefined
		};
		var bError = false;
		var oActualSelectionVariant;

		try {
			NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnUndefined | SuppressionBehavior.ignoreEmptyString);
		} catch (oError) {
			bError = true;
			assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
		}
		assert.ok(bError, "An error message must be raised");

		// positive test
		mSmanticAttributes = {
			attribute1: "test",
			attribute2: null,
			attribute3: ""
		};
		var spyWarning = sinon.spy(Log, "warning");
		var spyInfo = sinon.spy(Log, "info");

		oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnUndefined | SuppressionBehavior.ignoreEmptyString);
		assert.ok(spyWarning.calledOnce, "One warning message must be raised");
		assert.ok(spyInfo.calledOnce, "One info message must be raised");

		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "test",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute1");
		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [], "Only expected select options must be created");

		spyWarning.restore();
		spyInfo.restore();
	});

	QUnit.test("mixAttributesAndSelectionVariant: suppression behavior = raiseErrorOnNull | raiseErrorOnUndefined | ignoreEmptyString", function(assert) {

		// positive test
		var oSelVar = new SelectionVariant();
		var mSmanticAttributes = {
			attribute1: null
		};
		var bError = false;
		var oActualSelectionVariant;
		try {
			NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull || SuppressionBehavior.raiseErrorOnUndefined | SuppressionBehavior.ignoreEmptyString);
		} catch (oError) {
			bError = true;
			assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
		}
		assert.ok(bError, "An error message must be raised");

		// negative test
		mSmanticAttributes = {
			attribute1: undefined
		};
		bError = false;
		try {
			oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull | SuppressionBehavior.raiseErrorOnUndefined | SuppressionBehavior.ignoreEmptyString);
		} catch (oError) {
			// bError = oError.getSeverity().valueState === sap.ca.ui.message.Type.ERROR.valueState;
			bError = true;
			assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
		}
		assert.ok(bError, "An error message must be raised");

		mSmanticAttributes = {
			attribute1: "test",
			attribute3: ""
		};
		var spyInfo = sinon.spy(Log, "info");

		oActualSelectionVariant = NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull | SuppressionBehavior.raiseErrorOnUndefined | SuppressionBehavior.ignoreEmptyString);
		assert.ok(spyInfo.calledOnce, "One info message has to be raised");
		assert.deepEqual(oActualSelectionVariant.getSelectOption("attribute1"), [
			{
				Sign: "I",
				Option: "EQ",
				Low: "test",
				High: null
			}
		], "Value needs to be in the range of select options");
		oActualSelectionVariant.removeSelectOption("attribute1");
		assert.deepEqual(oActualSelectionVariant.getSelectOptionsPropertyNames(), [], "Only expected select options must be created");

		spyInfo.restore();
	});

	QUnit.test("mixAttributesAndSelectionVariant: suppression behavior = raiseErrorOnNull | raiseErrorOnUndefined", function(assert) {

		// positive test
		var oSelVar = new SelectionVariant();
		var mSmanticAttributes = {
			attribute1: null
		};
		var bError = false;
		try {
			NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull | SuppressionBehavior.raiseErrorOnUndefined);
		} catch (oError) {
			bError = true;
			assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
		}
		assert.ok(bError, "An error message must be raised");

		// negative test
		mSmanticAttributes = {
			attribute1: undefined
		};
		bError = false;
		try {
			NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString(), SuppressionBehavior.raiseErrorOnNull | SuppressionBehavior.raiseErrorOnUndefined);
		} catch (oError) {
			bError = true;
			assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
		}
		assert.ok(bError, "An error message must be raised");
	});

	QUnit.test("mixAttributesAndSelectionVariant: semantic attribute with invalid types", function(assert) {

		var fnTestFunction = function(vInput, sTestName) {
			var oSelVar = new SelectionVariant();
			var mSmanticAttributes = {
				attribute1: function() {
				}
			};
			var bError = false;
			try {
				NavigationHandler.prototype.mixAttributesAndSelectionVariant(mSmanticAttributes, oSelVar.toJSONString());
			} catch (oError) {
				bError = true;
				assert.equal(oError.getErrorCode(), "NavigationHandler.INVALID_INPUT", "Error code must be correct");
			}
			assert.ok(bError, "An error message for invalid type '" + sTestName + " must be raised");
		};

		fnTestFunction(function() {
		}, "function");
		fnTestFunction(/test/, "regexp");
		fnTestFunction(new Error(), "object");
	});

	QUnit.test("_getInnerAppStateKey", function(assert) {

		// mock controller and sap.ushell.Container.getService
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return {};
					}
				};
			}
		};
		// var originalUshell = sap.ushell;
		// sap.ushell = {"Container": {"getService": function(){}}};

		// mock the retrieval of the router reference
		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {};
		});
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").callsFake(function() {
			return {};
		});

		// get instance of NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		var sResult = oNavigationHandler._getInnerAppStateKey("");
		assert.equal(sResult, undefined, "an empty App Hash does not provide an IAPP_STATE");

		sResult = oNavigationHandler._getInnerAppStateKey(undefined);
		assert.equal(sResult, undefined, "a non-existing App Hash does not provide an IAPP_STATE");

		sResult = oNavigationHandler._getInnerAppStateKey("sap-iapp-state=xyz");
		assert.equal(sResult, "xyz", "an old-approach IAPP_STATE shall still be valid");

		sResult = oNavigationHandler._getInnerAppStateKey("key/route/sap-iapp-state=xyz");
		assert.equal(sResult, "xyz", "an old-approach IAPP_STATE with key shall still be valid");

		sResult = oNavigationHandler._getInnerAppStateKey("?sap-iapp-state=xyz");
		assert.equal(sResult, "xyz", "an new-approach IAPP_STATE shall be valid as well");

		sResult = oNavigationHandler._getInnerAppStateKey("sap-iapp-state=abc?sap-iapp-state=xyz");
		assert.equal(sResult, "xyz", "an new-approach IAPP_STATE shall superseed the old-approach one");

		sResult = oNavigationHandler._getInnerAppStateKey("sap-iapp-state=abc?sap-noapp-state=xyz");
		assert.equal(sResult, "abc", "other query parameters shall not mix things up");

		// restore environment again
		// sap.ushell = originalUshell;
		stubGetRouter.restore();

		NavigationHandler.prototype._getAppNavigationService.restore();
	});

	QUnit.test("_replaceInnerAppStateKey", function(assert) {

		// mock controller and sap.ushell.Container.getService
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};
		// var originalUshell = sap.ushell;
		// sap.ushell = {"Container": {"getService": function(){}}};

		// mock the retrieval of the router reference
		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {};
		});
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").callsFake(function() {
			return {};
		});

		// get instance of NavigationHandler (needed for IAPP_STATE variable)
		var oNavigationHandler = new NavigationHandler(oController);

		var aTestScenarios = [];

		// define test scenarios
		aTestScenarios.push({
			AppHash: "",
			AppStateKey: "",
			ExpectedHash: "?" + oNavigationHandler.IAPP_STATE + "="
		});

		aTestScenarios.push({
			AppHash: "abcDEF123",
			AppStateKey: "",
			ExpectedHash: "abcDEF123?" + oNavigationHandler.IAPP_STATE + "="
		});

		aTestScenarios.push({
			AppHash: "",
			AppStateKey: "ghiJKL456",
			ExpectedHash: "?" + oNavigationHandler.IAPP_STATE + "=ghiJKL456"
		});

		aTestScenarios.push({
			AppHash: "abcDEF123",
			AppStateKey: "ghiJKL456",
			ExpectedHash: "abcDEF123?" + oNavigationHandler.IAPP_STATE + "=ghiJKL456"
		});

		// Old iapp-state key shall be replaced by new approach
		aTestScenarios.push({
			AppHash: oNavigationHandler.IAPP_STATE + "=oldHashKey",
			AppStateKey: "ghiJKL456",
			ExpectedHash: "?" + oNavigationHandler.IAPP_STATE + "=ghiJKL456"
		});

		// Old iapp-state key with route shall be replaced by new approach properly
		aTestScenarios.push({
			AppHash: "route/" + oNavigationHandler.IAPP_STATE + "=oldHashKey",
			AppStateKey: "ghiJKL456",
			ExpectedHash: "route?" + oNavigationHandler.IAPP_STATE + "=ghiJKL456"
		});

		// New iapp-state key with route shall be replaced properly
		aTestScenarios.push({
			AppHash: "route/secondKey?" + oNavigationHandler.IAPP_STATE + "=oldHashKey",
			AppStateKey: "ghiJKL456",
			ExpectedHash: "route/secondKey?" + oNavigationHandler.IAPP_STATE + "=ghiJKL456"
		});

		// execute the tests
		for (var i = 0; i < aTestScenarios.length; i++) {
			// log test scenario description
			assert.ok(true, "Running scenario: sAppHash = \"" + aTestScenarios[i].AppHash + "\", sAppStateKey = \"" + aTestScenarios[i].AppStateKey + "\"");
			// call method to be tested
			var sActualHash = oNavigationHandler._replaceInnerAppStateKey(aTestScenarios[i].AppHash, aTestScenarios[i].AppStateKey);
			// compare data
			assert.equal(sActualHash, aTestScenarios[i].ExpectedHash, "Actual hash and expected hash must be equal");
		}
		// sap.ushell = originalUshell;

		stubGetRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();
	});

	QUnit.test("storeInnerAppState", function(assert) {

		// prepare test data
		var oTestData = {
			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getInnerAppData2: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant2");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0002");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "NewVariant",
					customData: {
						myParam: "yes"
					}
				};
			}
		};

		var oResultData = {
			replacedHash: "",
			appStateKeys: []
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").callsFake(function() {
			return oCrossNavMock;
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// call the method to be tested
		var oStoreInnerAppStatePromise = oNavigationHandler.storeInnerAppState(oTestData.getInnerAppData());

		// check correct results
		oStoreInnerAppStatePromise.done(function(sAppStateKey) {

			// remember appStateKey for later tests
			oResultData.appStateKeys.push(sAppStateKey);

			// check if new hash is correct
			assert.equal(oResultData.replacedHash, "?" + oNavigationHandler.IAPP_STATE + "=" + sAppStateKey, "hash can be replaced correctly");

			// check stored data
			var oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
			oAppStatePromise.done(function(oAppState) {
				var oAppData = oAppState.getData();
				var oExpectedData = oTestData.getInnerAppData();
				oExpectedData.selectionVariant = JSON.parse(oExpectedData.selectionVariant);
				assert.deepEqual(oAppData, oExpectedData, "data handed over to save as expected");
			});
		});
		oStoreInnerAppStatePromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " returned");
		});

		// test caching
		oStoreInnerAppStatePromise = oNavigationHandler.storeInnerAppState(oTestData.getInnerAppData());
		oStoreInnerAppStatePromise.done(function(sAppStateKey) {

			assert.equal(oResultData.appStateKeys[0], sAppStateKey, "AppState was not saved, since already in cache");
			assert.deepEqual(oTestData.getInnerAppData(), oNavigationHandler._oLastSavedInnerAppData.oAppData, "cached data is correct");
		});
		oStoreInnerAppStatePromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " returned");
		});

		// call the method to be negative tested
		oCrossNavMock.setErrorMode(true, false);
		oStoreInnerAppStatePromise = oNavigationHandler.storeInnerAppState(oTestData.getInnerAppData2());
		oStoreInnerAppStatePromise.done(function(sAppStateKey) {
			assert.ok(false, "save was triggered with key " + sAppStateKey + "which was not expected");
		});
		oStoreInnerAppStatePromise.fail(function(oError) {
			assert.equal(oError.getErrorCode(), "NavigationHandler.AppStateSave.failed", "AppState could not be stored (expected)");
		});

		stubGetRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();
	});

	QUnit.test("storeInnerAppStateWithImmediateReturn", function(assert) {

		// prepare test data
		var oTestData = {
			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			}
		};
		var oResultData = {
			replacedHash: "",
			appStateKeys: []
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// test caching
		var oStoreInnerAppStatePromise = oNavigationHandler.storeInnerAppStateWithImmediateReturn(oTestData.getInnerAppData());
		assert.ok(oStoreInnerAppStatePromise);

		stubGetRouter.restore();
	});

	QUnit.test("_saveAppState - negative test for JSON.parse", function(assert) {

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// test data - not a valid JSON format
		var oAppData = {
			selectionVariant: "not_a_JSON_String"
		};

		var fnOnAfterSave = function() {
			assert.ok(false, "AfterSave function must not be called");
		};
		var fnOnError = function(oError) {
			assert.equal(oError.getErrorCode(), "NavigationHandler.AppStateSave.parseError", "JSON.parse failed and error was raised (as expected)");
		};

		// call the method to be tested
		var sKey = oNavigationHandler._saveAppState(oAppData, fnOnAfterSave, fnOnError);
		assert.equal(sKey, undefined, "sKey must be undefined");

		stubGetRouter.restore();
	});

	QUnit.test("navigate", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				return oSelectionVariant.toJSONString();
			}
		};

		var oResultData = {
			replacedHash: "",
			appStatekeys: []
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// call function to be tested
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), oTestData.getInnerAppData(), fOnError);

		// check stored data (sap-xapp-state)
		var sAppStateKey = oCrossNavMock.toExternalArgs.appStateKey;
		var oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();
			// assert.deepEqual(oAppData.selectionVariant, {}, "data handed over to save in xapp-state as expected");
			assert.deepEqual(oAppData.selectionVariant, JSON.parse(oTestData.getNavData()), "data handed over to save in xapp-state as expected");
		});

		// check stored data (sap-iapp-state)
		sAppStateKey = oResultData.replacedHash.split("=")[1];
		oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();
			var oExpectedData = oTestData.getInnerAppData();
			oExpectedData.selectionVariant = JSON.parse(oExpectedData.selectionVariant);
			assert.deepEqual(oAppData, oExpectedData, "data handed over to save in iapp-state as expected");
		});

		// negative tests
		var oExecutedErrorCallback = {};
		oCrossNavMock.setErrorMode(false, false, true, false); // intent supported failed
		fOnError = function(oError) {
			assert.equal(oError.getErrorCode(), "NavigationHandler.isIntentSupported.failed", "intent supported failed (expected)");
			oExecutedErrorCallback.isIntentSupportedFailed = true;
		};
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), oTestData.getInnerAppData(), fOnError);
		assert.ok(oExecutedErrorCallback.isIntentSupportedFailed, "isIntentSupportedFailed error callback was executed (expected)");

		oCrossNavMock.setErrorMode(false, false, false, true); // intent not supported
		fOnError = function(oError) {
			assert.equal(oError.getErrorCode(), "NavigationHandler.isIntentSupported.notSupported", "intent not supported (expected)");
			oExecutedErrorCallback.isIntentSupported = true;
		};
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), oTestData.getInnerAppData(), fOnError);
		assert.ok(oExecutedErrorCallback.isIntentSupported, "isIntentSupported error callback was executed (expected)");

		stubGetRouter.restore();
	});

	QUnit.test("navigate with xapp data", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				return oSelectionVariant.toJSONString();
			},
			getXAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Supplier", "I", "EQ", "C0001");
				return oSelectionVariant.toJSONString();
			}
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").returns({});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// call function to be tested
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), null, fOnError, {
			selectionVariant: oTestData.getXAppData(),
			presentationVariant: {},
			valueTexts: {}
		});

		// check stored data (sap-xapp-state)
		var sAppStateKey = oCrossNavMock.toExternalArgs.appStateKey;
		var oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();
			assert.deepEqual(oAppData.selectionVariant, JSON.parse(oTestData.getXAppData()), "data handed over to save in xapp-state as expected");
			assert.deepEqual(oAppData.valueTexts, {}, "valueTexts handed over to save in xapp-state as expected");
			assert.deepEqual(oAppData.presentationVariant, {}, "presentationVariant handed over to save in xapp-state as expected");
		});

		stubGetRouter.restore();
	});

	QUnit.test("navigate with xapp data - without selectionVariant", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				return oSelectionVariant.toJSONString();
			},
			getXAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Supplier", "I", "EQ", "C0001");
				return oSelectionVariant.toJSONString();
			}
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").returns({});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// call function to be tested
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), null, fOnError, {
			presentationVariant: {},
			valueTexts: {}
		});

		// check stored data (sap-xapp-state)
		var sAppStateKey = oCrossNavMock.toExternalArgs.appStateKey;
		var oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();
			assert.deepEqual(oAppData.selectionVariant, JSON.parse(oTestData.getNavData()), "data handed over to save in xapp-state as expected");
			assert.deepEqual(oAppData.valueTexts, {}, "valueTexts handed over to save in xapp-state as expected");
			assert.deepEqual(oAppData.presentationVariant, {}, "presentationVariant handed over to save in xapp-state as expected");
		});

		stubGetRouter.restore();
	});

	QUnit.test("navigate with an empty innerAppData object", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				return oSelectionVariant.toJSONString();
			}
		};

		var oResultData = {
			replacedHash: "",
			appStatekeys: []
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// call function to be tested
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), {}, fOnError);

		assert.deepEqual(oNavigationHandler._oLastSavedInnerAppData.oAppData, {}, "data handed over to save in iapp-state as expected");

		stubGetRouter.restore();
	});

	QUnit.test("navigate with 'sap-ushell-next-navmode'", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				return oSelectionVariant.toJSONString();
			}
		};

		var oResultData = {
			replacedHash: "",
			appStatekeys: []
		};

		// mock controller
		var oComponentData = {
			startupParameters: {
				"sap-ushell-next-navmode": [
					"inplace"
				]
			},
			getComponentData: function() {
				return oComponentData;
			}
		};
		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return oComponentData;
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);
		oNavigationHandler.oComponent = oComponentData;

		sinon.spy(oNavigationHandler, "storeInnerAppStateWithImmediateReturn");
		sinon.spy(oNavigationHandler, "_saveAppStateWithImmediateReturn");

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// call function to be tested
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), {}, fOnError);
		assert.deepEqual(oNavigationHandler._oLastSavedInnerAppData.oAppData, {}, "data handed over to save in iapp-state as expected");
		assert.ok(oNavigationHandler.storeInnerAppStateWithImmediateReturn.calledOnce);
		assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledOnce);

		oComponentData.startupParameters = {
			"sap-ushell-next-navmode": [
				"explace"
			]
		};
		oNavigationHandler._oLastSavedInnerAppData = null;
		oNavigationHandler.storeInnerAppStateWithImmediateReturn.reset();
		oNavigationHandler._saveAppStateWithImmediateReturn.reset();

		// call function to be tested
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), {}, fOnError);
		assert.deepEqual(oNavigationHandler._oLastSavedInnerAppData, null, "data not handed over to save in iapp-state as expected");
		assert.ok(!oNavigationHandler.storeInnerAppStateWithImmediateReturn.called);
		assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledOnce);

		stubGetRouter.restore();
	});

	QUnit.test("navigate with navMode", function(assert) {

		var thrown = false;

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				return oSelectionVariant.toJSONString();
			}
		};

		var oResultData = {
			replacedHash: "",
			appStatekeys: []
		};

		// mock controller
		var oComponentData = {
			startupParameters: {
// "sap-ushell-next-navmode": [
// "inplace"
// ]
			},
			getComponentData: function() {
				return oComponentData;
			}
		};
		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return oComponentData;
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);
		oNavigationHandler.oComponent = oComponentData;

		sinon.spy(oNavigationHandler, "storeInnerAppStateWithImmediateReturn");
		sinon.spy(oNavigationHandler, "_saveAppStateWithImmediateReturn");

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// call function to be tested
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), {}, fOnError, null, "inplace");
		assert.deepEqual(oNavigationHandler._oLastSavedInnerAppData.oAppData, {}, "data handed over to save in iapp-state as expected");
		assert.ok(oNavigationHandler.storeInnerAppStateWithImmediateReturn.calledOnce);
		assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledOnce);

		oComponentData.startupParameters = {};
		oNavigationHandler._oLastSavedInnerAppData = null;
		oNavigationHandler.storeInnerAppStateWithImmediateReturn.reset();
		oNavigationHandler._saveAppStateWithImmediateReturn.reset();

		// call function to be tested
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), {}, fOnError, null, "explace");
		assert.deepEqual(oNavigationHandler._oLastSavedInnerAppData, null, "data not handed over to save in iapp-state as expected");
		assert.ok(!oNavigationHandler.storeInnerAppStateWithImmediateReturn.called);
		assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledOnce);

		// call function to be tested
		try {
			oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), {}, fOnError, null, "notesupported");
		} catch (e) {
			thrown = true;
		}
		assert.ok(thrown);

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: sap-xapp-state only / with URL parameters", function(assert) {

		// prepare test data
		var oTestData = {
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "BT", "0001", "0003");
				return oSelectionVariant;
			},
			getURLParameters: function() {
				return {
					FiscalYear: "2014"
				};
			}
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {
						"startupParameters": oTestData.getURLParameters(),
						"sap-xapp-state": "dummy"
					},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// set startup data (sap-xapp-state)
		oCrossNavMock.setStartupAppState({
			selectionVariant: oTestData.getNavData().toJSONObject()
		});

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
			var oExpectedAppData = oNavigationHandler._splitInboundNavigationParameters(oTestData.getNavData(), oTestData.getURLParameters(), []);
			assert.equal(oAppData.selectionVariant, oExpectedAppData.oNavigationSelVar.toJSONString(), "parsed app data from URL params and xapp-state returned as expected");
			assert.equal(sNavType, NavType.xAppState, "NavType must be correct");
		});
		oParseNavigationPromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		});

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation via String & Object: sap-xapp-state only / no URL parameters", function(assert) {

		var fnTestRoutine = function(sSelVarMode, oStartupParameters) {
			// prepare test data
			var oTestData = {
				getNavData: function() {
					var oSelectionVariant = new SelectionVariant();
					oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
					oSelectionVariant.addSelectOption("CompanyCode", "I", "BT", "0001", "0003");
					return oSelectionVariant[sSelVarMode]();
				},
				getURLParameters: function() {
					return oStartupParameters;
				}
			};

			// mock controller
			var oController = {
				getOwnerComponent: function() {
					return {
						oComponentData: {
							"startupParameters": oTestData.getURLParameters(),
							"sap-xapp-state": "dummy"
						},
						getComponentData: function() {
							return this.oComponentData;
						}
					};
				}
			};

			// mock CrossAppNavigationService
			var oCrossNavMock = new CrossAppNavigationServiceMock();
			sap.ushell = {
				Container: {
					getService: function() {
						return oCrossNavMock;
					}
				}
			};

			var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
				return {
					oHashChanger: {
						getHash: function() {
							return "";
						}
					}
				};
			});

			// get instance of the NavigationHandler
			var oNavigationHandler = new NavigationHandler(oController);

			// set startup data (sap-xapp-state)
			oCrossNavMock.setStartupAppState({
				selectionVariant: oTestData.getNavData()
			});

			// call method to be tested
			var oParseNavigationPromise = oNavigationHandler.parseNavigation();

			oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
				var oExpectedAppData = oNavigationHandler._splitInboundNavigationParameters(new SelectionVariant(oTestData.getNavData()), {}, []);
				assert.equal(oAppData.selectionVariant, oExpectedAppData.oNavigationSelVar.toJSONString(), "parsed app data from xapp-state returned as expected");
				assert.equal(sNavType, NavType.xAppState, "NavType must be correct");
			});
			oParseNavigationPromise.fail(function(oError) {
				assert.ok(false, oError.getErrorCode() + " was raised");
			});

			stubGetRouter.restore();
		};

		fnTestRoutine("toJSONString", {});
		fnTestRoutine("toJSONObject", {});
		fnTestRoutine("toJSONString", undefined);
		fnTestRoutine("toJSONObject", undefined);
		fnTestRoutine("toJSONString", null);
		fnTestRoutine("toJSONObject", null);
	});

	QUnit.test("parseNavigation via String & Object: sap-xapp-state only / no URL parameters / getData error", function(assert) {

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {
						"startupParameters": null,
						"sap-xapp-state": "dummy"
					},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// set startup data (sap-xapp-state)
		oCrossNavMock.setStartupAppState(null);

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters) {
			assert.ok(false, "promise must not be resolved, but rejected");
		});
		oParseNavigationPromise.fail(function(oError, oStartupParameters, sNavType) {
			assert.equal(oError.getErrorCode(), "NavigationHandler.getDataFromAppState.failed", "error code must be correct");
			assert.deepEqual(oStartupParameters, {}, "oStartupParameters must be empty");
			assert.equal(sNavType, NavType.xAppState, "NavType must be correct");
		});

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: sap-xapp-state only / with URL parameters / getData error", function(assert) {

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {
						"startupParameters": {
							FiscalYear: "2014"
						},
						"sap-xapp-state": "dummy"
					},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// set startup data (sap-xapp-state)
		oCrossNavMock.setStartupAppState(null);

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters) {
			assert.ok(false, "promise must not be resolved, but rejected");
		});
		oParseNavigationPromise.fail(function(oError, oStartupParameters, sNavType) {
			assert.equal(oError.getErrorCode(), "NavigationHandler.getDataFromAppState.failed", "error code must be correct");
			assert.deepEqual(oStartupParameters, {
				FiscalYear: "2014"
			}, "Startup parameters must be correct");
			assert.equal(sNavType, NavType.xAppState, "NavType must be correct");
		});

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: sap-xapp-state only / getStartupAppState error", function(assert) {

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {
						"startupParameters": {},
						"sap-xapp-state": "dummy"
					},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// set startup data (sap-xapp-state)
		oCrossNavMock.setStartupAppState(null);
		// set error mode for negative testing
		oCrossNavMock.setErrorMode(false, true);

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters) {
			assert.ok(false, "promise must not be resolved, but rejected");
		});
		oParseNavigationPromise.fail(function(oError, oStartupParameters, sNavType) {
			assert.equal(oError.getErrorCode(), "NavigationHandler.getStartupState.failed", "error code must be correct");
			assert.deepEqual(oStartupParameters, {}, "Startup parameters must be empty");
			assert.equal(sNavType, NavType.xAppState, "NavType must be correct");
		});

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation via String & Object: sap-iapp-state / old Approach", function(assert) {
		var fnTestRoutine = function(sSelVarMode) {
			// prepare test data
			var oTestData = {
				getInnerAppData: function() {
					var oSelectionVariant = new SelectionVariant();
					oSelectionVariant.setID("MyVariant");
					oSelectionVariant.addSelectOption("DocumentNumber", "I", "EQ", "1234567890");
					return {
						selectionVariant: oSelectionVariant[sSelVarMode](),
						tableVariantId: "StandardVariant",
						customData: {
							myParam: "yes"
						},
						presentationVariant: {
							attr1: "some attributes",
							attr2: "some more attributes"
						},
						valueTexts: {
							value: "some content"
						}
					};
				},
				getNavData: function() {
					var oSelectionVariant = new SelectionVariant();
					oSelectionVariant.setID("MyVariant");
					oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
					oSelectionVariant.addSelectOption("CompanyCode", "I", "BT", "0001", "0003");
					return oSelectionVariant[sSelVarMode]();
				}
			};

			// mock controller
			var sApphash = "";
			var oController = {
				getOwnerComponent: function() {
					return {
						oComponentData: {},
						getComponentData: function() {
							return this.oComponentData;
						}
					};
				}
			};

			// mock CrossAppNavigationService
			var oCrossNavMock = new CrossAppNavigationServiceMock();
			sap.ushell = {
				Container: {
					getService: function() {
						return oCrossNavMock;
					}
				}
			};

			// save inner app state and set the hash accordingly
			var sInnerAppStateKey = oCrossNavMock.setAppState(oTestData.getInnerAppData());
			var sXAppStateKey = oCrossNavMock.setStartupAppState({
				selectionVariant: oTestData.getNavData()
			});
			sApphash = "#SalesOrder-create?Customer=C0005&sap-xapp-state=" + sXAppStateKey + "/&sap-iapp-state=" + sInnerAppStateKey;

			var stubHashChanger = sinon.stub(HashChanger, "getInstance").callsFake(function() {
				return {
					getHash: function() {
						return sApphash;
					}
				};
			});
			var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
				return {
					oHashChanger: {
						getHash: function() {
							return sApphash;
						}
					}
				};
			});

			// get instance of the NavigationHandler
			var oNavigationHandler = new NavigationHandler(oController);

			// call method to be tested
			var oParseNavigationPromise = oNavigationHandler.parseNavigation();

			oParseNavigationPromise.done(function(oAppData, oStartupParameters, sNavType) {
				var expected = oTestData.getInnerAppData();
				assert.ok(expected);

				expected["appStateKey"] = "" + sInnerAppStateKey;

				if (typeof expected.selectionVariant === "object") {
					// please note that internally, we always use string for the selectionVariant
					expected.selectionVariant = JSON.stringify(expected.selectionVariant);
				}
				expected.oSelectionVariant = new SelectionVariant(expected.selectionVariant);
				expected.oDefaultedSelectionVariant = new SelectionVariant();
				expected.bNavSelVarHasDefaultsOnly = false;

				expected.presentationVariant = {
					attr1: "some attributes",
					attr2: "some more attributes"
				};
				expected.valueTexts = {
					value: "some content"
				};
				assert.deepEqual(oAppData, expected, "sap-iapp-state returned as expected");
				assert.equal(sNavType, NavType.iAppState, "NavType must be correct");
			});
			oParseNavigationPromise.fail(function(oError) {
				assert.ok(false, oError.getErrorCode() + " was raised");
			});

			// nagative test: inner app state could not be loaded because of wrong key
			sApphash = "#SalesOrder-create?Customer=C0005&sap-xapp-state=" + sXAppStateKey + "/&sap-iapp-state=NOTFOUNDATALL";

			// get instance of the NavigationHandler
			oNavigationHandler = new NavigationHandler(oController);

			// call method to be tested
			oParseNavigationPromise = oNavigationHandler.parseNavigation();

			oParseNavigationPromise.done(function(oAppData) {
				assert.ok(false, "no app state should be returned since the key is not valid");
			});
			oParseNavigationPromise.fail(function(oError, oStartupParameters, sNavType) {
				assert.equal(oError.getErrorCode(), "NavigationHandler.getAppState.failed", "error code must be correct");
				assert.equal(sNavType, NavType.iAppState, "NavType must be correct");
			});

			stubGetRouter.restore();
			stubHashChanger.restore();
		};

		fnTestRoutine("toJSONString");
		fnTestRoutine("toJSONObject");
	});

	QUnit.test("parseNavigation via String & Object: sap-iapp-state / new Approach", function(assert) {
		var fnTestRoutine = function(sSelVarMode) {
			// prepare test data
			var oTestData = {
				getInnerAppData: function() {
					var oSelectionVariant = new SelectionVariant();
					oSelectionVariant.setID("MyVariant");
					oSelectionVariant.addSelectOption("DocumentNumber", "I", "EQ", "1234567890");
					return {
						selectionVariant: oSelectionVariant[sSelVarMode](),
						tableVariantId: "StandardVariant",
						customData: {
							myParam: "yes"
						},
						presentationVariant: {},
						valueTexts: {}
					};
				},
				getNavData: function() {
					var oSelectionVariant = new SelectionVariant();
					oSelectionVariant.setID("MyVariant");
					oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
					oSelectionVariant.addSelectOption("CompanyCode", "I", "BT", "0001", "0003");
					return oSelectionVariant[sSelVarMode]();
				}
			};

			// mock controller
			var sApphash = "";
			var oController = {
				getOwnerComponent: function() {
					return {
						oComponentData: {},
						getComponentData: function() {
							return this.oComponentData;
						}
					};
				}
			};

			// mock CrossAppNavigationService
			var oCrossNavMock = new CrossAppNavigationServiceMock();
			sap.ushell = {
				Container: {
					getService: function() {
						return oCrossNavMock;
					}
				}
			};

			// save inner app state and set the hash accordingly
			var sInnerAppStateKey = oCrossNavMock.setAppState(oTestData.getInnerAppData());
			var sXAppStateKey = oCrossNavMock.setStartupAppState({
				selectionVariant: oTestData.getNavData()
			});
			sApphash = "#SalesOrder-create?Customer=C0005&sap-xapp-state=" + sXAppStateKey + "/&?sap-iapp-state=" + sInnerAppStateKey;

			var stubHashChanger = sinon.stub(HashChanger, "getInstance").callsFake(function() {
				return {
					getHash: function() {
						return sApphash;
					}
				};
			});
			var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
				return {
					oHashChanger: {
						getHash: function() {
							return sApphash;
						}
					}
				};
			});

			// get instance of the NavigationHandler
			var oNavigationHandler = new NavigationHandler(oController);

			// call method to be tested
			var oParseNavigationPromise = oNavigationHandler.parseNavigation();

			oParseNavigationPromise.done(function(oAppData, oStartupParameters, sNavType) {
				var expected = oTestData.getInnerAppData();
				if (typeof expected.selectionVariant === "object") {
					// please note that internally, we always use string for the selectionVariant
					expected.selectionVariant = JSON.stringify(expected.selectionVariant);
				}
				expected["appStateKey"] = "" + sInnerAppStateKey;
				expected.oSelectionVariant = new SelectionVariant(expected.selectionVariant);
				expected.oDefaultedSelectionVariant = new SelectionVariant();
				expected.bNavSelVarHasDefaultsOnly = false;
				expected.presentationVariant = {};
				expected.valueTexts = {};
				assert.deepEqual(oAppData, expected, "sap-iapp-state returned as expected");
				assert.equal(sNavType, NavType.iAppState, "NavType must be correct");
			});
			oParseNavigationPromise.fail(function(oError) {
				assert.ok(false, oError.getErrorCode() + " was raised");
			});

			// nagative test: inner app state could not be loaded because of wrong key
			sApphash = "#SalesOrder-create?Customer=C0005&sap-xapp-state=" + sXAppStateKey + "/&?sap-iapp-state=NOTFOUNDATALL";

			// get instance of the NavigationHandler
			oNavigationHandler = new NavigationHandler(oController);

			// call method to be tested
			oParseNavigationPromise = oNavigationHandler.parseNavigation();

			oParseNavigationPromise.done(function(oAppData) {
				assert.ok(false, "no app state should be returned since the key is not valid");
			});
			oParseNavigationPromise.fail(function(oError, oStartupParameters, sNavType) {
				assert.equal(oError.getErrorCode(), "NavigationHandler.getAppState.failed", "error code must be correct");
				assert.equal(sNavType, NavType.iAppState, "NavType must be correct");
			});

			stubGetRouter.restore();
			stubHashChanger.restore();
		};

		fnTestRoutine("toJSONString");
		fnTestRoutine("toJSONObject");

	});

	QUnit.test("parseNavigation: basic URL parameter navigation", function(assert) {

		// mock controller
		var sApphash = "";
		var oStartupParameters = {
			Customer: [
				"C0005"
			]
		};
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {
						startupParameters: oStartupParameters
					},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return sApphash;
					}
				}
			};
		});

		// save inner app state and set the hash accordingly
		sApphash = "#SalesOrder-create?Customer=C0005";

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
			assert.equal(sNavType, NavType.URLParams, "Navigation Type needs to be URL Parameter");
			assert.deepEqual(oURLParameters, oStartupParameters, "Startup parameters need to be passed through 1:1");

			var oSelectionVariant = new SelectionVariant(oAppData.selectionVariant);

			var oExpected = [
				{
					Sign: "I",
					Option: "EQ",
					Low: "C0005",
					High: null
				}
			];
			assert.deepEqual(oSelectionVariant.getSelectOption("Customer"), oExpected, "Selection Variant SelOption for Customer needs to contain the value");
		});
		oParseNavigationPromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		});

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: initial startup", function(assert) {

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {
						startupParameters: undefined
					},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
			assert.equal(sNavType, NavType.initial, "Navigation Type needs to be 'initial'");
			assert.deepEqual(oAppData, {}, "App data need to be empty");
			assert.deepEqual(oURLParameters, {}, "Startup parameters need to be empty");
		});
		oParseNavigationPromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		});

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: initial startup with default parameters", function(assert) {

		// prepare test data
		var bDoneCalled = false;
		var oTestData = {
			defaultedParameters: [
				"Customer", "CompanyCode"
			]
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {
						startupParameters: {
							"sap-ushell-defaultedParameterNames": [
								JSON.stringify(oTestData.defaultedParameters)
							]
						}
					},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
			bDoneCalled = true;
		});
		oParseNavigationPromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		});
		assert.ok(bDoneCalled, "Done method was called");

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: initial startup with SAP system parameter only", function(assert) {

		// prepare test data
		var bDoneCalled = false;

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {
						startupParameters: {
							"sap-system": "SYSTEM_ALIAS"
						}
					},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
			bDoneCalled = true;
			assert.equal(sNavType, NavType.initial, "NavType must be correct");
		});
		oParseNavigationPromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		});
		assert.ok(bDoneCalled, "Done method was called");

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: xapp-state with default parameters", function(assert) {
		// prepare test data
		var bDoneCalled = false;
		var oTestData = {
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "BT", "0001", "0003");
				oSelectionVariant.addSelectOption("FiscalYear", "I", "EQ", "2015");
				return oSelectionVariant.toJSONString();
			},
			getComponentData: function() {
				return {
					"startupParameters": {
						"sap-ushell-defaultedParameterNames": [
							JSON.stringify([
								"Customer", "CompanyCode"
							])
						],
						Customer: "C0001",
						CompanyCode: "0001"
					},
					"sap-xapp-state": "dummy"
				};
			}
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: oTestData.getComponentData(),
					getComponentData: oTestData.getComponentData
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// set startup data (sap-xapp-state)
		oCrossNavMock.setStartupAppState({
			selectionVariant: oTestData.getNavData()
		});

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
			bDoneCalled = true;
		});
		oParseNavigationPromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		});
		assert.ok(bDoneCalled, "Done method was called");

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: xapp-state without default parameters", function(assert) {
		// prepare test data
		var bDoneCalled = false;
		var oTestData = {
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "BT", "0001", "0003");
				oSelectionVariant.addSelectOption("FiscalYear", "I", "EQ", "2015");
				return oSelectionVariant.toJSONString();
			},
			getComponentData: function() {
				return {
					"startupParameters": {},
					"sap-xapp-state": "dummy"
				};
			}
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: oTestData.getComponentData(),
					getComponentData: oTestData.getComponentData
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// set startup data (sap-xapp-state)
		oCrossNavMock.setStartupAppState({
			selectionVariant: oTestData.getNavData()
		});

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
			bDoneCalled = true;
		});
		oParseNavigationPromise.fail(function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		});
		assert.ok(bDoneCalled, "Done method was called");

		stubGetRouter.restore();
	});

	QUnit.test("parseNavigation: xapp-state with invalid JSON", function(assert) {
		// prepare test data
		var bFailCalled = false;
		var oTestData = {
			getComponentData: function() {
				return {
					"startupParameters": {},
					"sap-xapp-state": "dummy"
				};
			}
		};

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: oTestData.getComponentData(),
					getComponentData: oTestData.getComponentData
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// set startup data (sap-xapp-state)
		oCrossNavMock.setStartupAppState(function() {
		}); // invalid JSON --> JSON.parse(JSON.stringify(oAppData)) will lead to an error

		// call method to be tested
		var oParseNavigationPromise = oNavigationHandler.parseNavigation();

		oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
			assert.ok(false, "Done was called, but fail was expected");
		});
		oParseNavigationPromise.fail(function(oError) {
			var sErrorCode = oError.getErrorCode();
			assert.equal(sErrorCode, "NavigationHandler.AppStateData.parseError", "NavigationHandler.AppStateData.parseError was raised");
			bFailCalled = true;
		});
		assert.ok(bFailCalled, "Fail method was called");

		stubGetRouter.restore();
	});

	// mock TableEventParameters (Popover Instance)
	function fnGetTableEventParameters() {

		var oSemanticAttributes = {};
		var sAppStateKey = "";
		var bOpenCalled = false;

		function generateObject() {
			var oTableEventParameters = {};

			oTableEventParameters.setSemanticAttributes = function(oSemanticAttributesParam) {
				oSemanticAttributes = oSemanticAttributesParam;
				oTableEventParameters.semanticAttributes = oSemanticAttributesParam;
			};

			oTableEventParameters.getSemanticAttributes = function() {
				return oSemanticAttributes;
			};

			oTableEventParameters.setAppStateKey = function(sAppStateKeyParam) {
				sAppStateKey = sAppStateKeyParam;
			};

			oTableEventParameters.getAppStateKey = function() {
				return sAppStateKey;
			};

			oTableEventParameters.open = function() {
				bOpenCalled = true;
			};

			oTableEventParameters.isOpenCalled = function() {
				return bOpenCalled;
			};

			return oTableEventParameters;

		}
		return generateObject();

		/*
		 * var oTableEventParameters = { oSemanticAttributes: {}, AppStateKey: "", bOpenCalled: false, setSemanticAttributes: function
		 * (oSemanticAttributes) { this.oSemanticAttributes = oSemanticAttributes; oTableEventParameters.semanticAttributes = oSemanticAttributes;
		 * }.bind(this), getSemanticAttributes: function () { return this.oSemanticAttributes; }.bind(this), setAppStateKey: function (sAppStateKey) {
		 * this.sAppStateKey = sAppStateKey; }.bind(this), getAppStateKey: function () { return this.sAppStateKey; }.bind(this), open: function () {
		 * this.bOpenCalled = true; }.bind(this), isOpenCalled: function () { return this.bOpenCalled; }.bind(this) }; return oTableEventParameters;
		 */
	}

	// mock controller
	var oController = {
		getAppStateKey: function() {
			return this.sReplacedHash.split("=")[1];
		},
		getOwnerComponent: function() {
			return {
				oComponentData: {},
				getComponentData: function() {
					return this.oComponentData;
				}
			};
		}
	};

	QUnit.test("processBeforeSmartLinkPopoverOpens: selectionVariant not provided", function(assert) {

		// prepare test data
		var oTestData = {
			getSelectionVariant: function() {
				return "{}";
			},
			getSemanticAttributes: function() {
				return {
					Customer: "C0001",
					FiscalYear: "2015"
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sHash) {
						oController.sReplacedHash = sHash;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// call method to be tested
		var oTableEventParameters = fnGetTableEventParameters();
		oTableEventParameters.setSemanticAttributes(oTestData.getSemanticAttributes());
		var oSmartLinkPromise = oNavigationHandler.processBeforeSmartLinkPopoverOpens(oTableEventParameters);

		oSmartLinkPromise.done(function(oTableEventParameters) {
			// check popover has been opened
			assert.ok(oTableEventParameters.isOpenCalled, "oTableEventParameters.open() must be called");

			// check semantic attributes were mixed and set correctly
			var oMixedSelVar = oNavigationHandler.mixAttributesAndSelectionVariant(oTableEventParameters.getSemanticAttributes(), oTestData.getSelectionVariant());
			var oMixedSemanticAttributesExpected = oNavigationHandler._getURLParametersFromSelectionVariant(oMixedSelVar);
			var oMixedSemanticAttributesActual = oTableEventParameters.getSemanticAttributes();
			assert.ok(oMixedSemanticAttributesActual, "semanticAttributes must not be empty");
			assert.deepEqual(oMixedSemanticAttributesActual, oMixedSemanticAttributesExpected, "Mixed Semantic Attributes must be generated correctly");

			// check AppStateKey
			assert.ok(oTableEventParameters.getAppStateKey() !== "", "AppStateKey must not be empty");
			assert.equal(Object.keys(oCrossNavMock.oAppStates)[0], oTableEventParameters.getAppStateKey(), "AppStateKey must be generated correctly");
		});

		oSmartLinkPromise.fail(function(oError) {
			assert.ok(false, "no errors expected");
		});

		stubGetRouter.restore();
	});

	QUnit.test("processBeforeSmartLinkPopoverOpens: selectionVariant provided", function(assert) {
		// prepare test data
		var oTestData = {
			getSelectionVariant: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return oSelectionVariant.toJSONString();
			},
			getSemanticAttributes: function() {
				return {
					Customer: "C0001",
					FiscalYear: "2015"
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sHash) {
						oController.sReplacedHash = sHash;
					}
				}
			};
		});
		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// call method to be tested
		var oTableEventParameters = fnGetTableEventParameters();
		oTableEventParameters.setSemanticAttributes(oTestData.getSemanticAttributes());
		var oSmartLinkPromise = oNavigationHandler.processBeforeSmartLinkPopoverOpens(oTableEventParameters, oTestData.getSelectionVariant());

		oSmartLinkPromise.done(function(oTableEventParameters) {
			// check popover has been opened
			assert.ok(oTableEventParameters.isOpenCalled, "oTableEventParameters.open() must be called");

			// check semantic attributes were mixed and set correctly
			var oMixedSelVar = oNavigationHandler.mixAttributesAndSelectionVariant(oTableEventParameters.getSemanticAttributes(), oTestData.getSelectionVariant());
			var oMixedSemanticAttributesExpected = oNavigationHandler._getURLParametersFromSelectionVariant(oMixedSelVar);
			var oMixedSemanticAttributesActual = oTableEventParameters.getSemanticAttributes();
			assert.ok(oMixedSemanticAttributesActual, "semanticAttributes must not be empty");
			assert.deepEqual(oMixedSemanticAttributesActual, oMixedSemanticAttributesExpected, "Mixed Semantic Attributes must be generated correctly");

			// check AppStateKey
			assert.ok(oTableEventParameters.getAppStateKey() !== "", "AppStateKey must not be empty");
			assert.equal(Object.keys(oCrossNavMock.oAppStates)[0], oTableEventParameters.getAppStateKey(), "AppStateKey must be generated correctly");
		});

		oSmartLinkPromise.fail(function(oError) {
			assert.ok(false, "no errors expected");
		});

		stubGetRouter.restore();

		oTableEventParameters.oSemanticAttributes = undefined;
		oTableEventParameters.sAppStateKey = undefined;
		oTableEventParameters.bOpenCalled = undefined;
	});

	QUnit.test("processBeforeSmartLinkPopoverOpens: innerAppState provided", function(assert) {

		// prepare test data
		var oTestData = {
			getSelectionVariant: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return oSelectionVariant.toJSONString();
			},
			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getSemanticAttributes: function() {
				return {
					Customer: "C0001",
					FiscalYear: "2015"
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sHash) {
						oController.sReplacedHash = sHash;
					}
				}
			};
		});
		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		// call method to be tested
		var oTableEventParameters = fnGetTableEventParameters();
		// set the semantic attributes from the test data container, processBeforeSmartLinkPopoverOpens will alter it after promise resolution
		oTableEventParameters.setSemanticAttributes(oTestData.getSemanticAttributes());
		var oSmartLinkPromise = oNavigationHandler.processBeforeSmartLinkPopoverOpens(oTableEventParameters, oTestData.getSelectionVariant(), oTestData.getInnerAppData());

		oSmartLinkPromise.done(function(oTableEventParameters) {
			// check popover has been opened
			assert.ok(oTableEventParameters.isOpenCalled, "oTableEventParameters.open() must be called");

			// check semantic attributes were mixed and set correctly
			var oMixedSelVar = oNavigationHandler.mixAttributesAndSelectionVariant(oTableEventParameters.getSemanticAttributes(), oTestData.getSelectionVariant());
			var oMixedSemanticAttributesExpected = oNavigationHandler._getURLParametersFromSelectionVariant(oMixedSelVar);
			var oMixedSemanticAttributesActual = oTableEventParameters.getSemanticAttributes();
			assert.ok(oMixedSemanticAttributesActual, "semanticAttributes must not be empty");
			assert.deepEqual(oMixedSemanticAttributesActual, oMixedSemanticAttributesExpected, "Mixed Semantic Attributes must be generated correctly");

			// check AppStateKey
			assert.ok(oTableEventParameters.getAppStateKey() !== "", "AppStateKey must not be empty");
			// first the inner app state is saved, second the xapp state. therefore the correct appstate is the second object in
			// oCrossNavMock.oAppStates
			assert.equal(Object.keys(oCrossNavMock.oAppStates)[1], oTableEventParameters.getAppStateKey(), "AppStateKey must be generated correctly");

			// check inner app data was stored
			// oController.getAppStateKey() returns the appstatekey derived from the last replacehash
			assert.ok(oCrossNavMock.oAppStates[oController.getAppStateKey()].data, "oAppData must not be empty");
			var oExpectedData = oTestData.getInnerAppData();
			oExpectedData.selectionVariant = JSON.parse(oExpectedData.selectionVariant);
			assert.deepEqual(oCrossNavMock.oAppStates[oController.getAppStateKey()].getData(), oExpectedData, "AppStateKey must be generated correctly");
		});

		oSmartLinkPromise.fail(function(oError) {
			assert.ok(false, "no errors expected");
		});

		stubGetRouter.restore();
	});

	QUnit.test("_ensureSelectionVariantFormatString", function(assert) {
		var oOriginalObject = {
			hugo: "blub"
		};
		var sJSON = JSON.stringify(oOriginalObject);

		var sResult = NavigationHandler.prototype._ensureSelectionVariantFormatString(oOriginalObject);
		assert.equal(sResult, sJSON, "provided object shall be JSON-stringified");

		sResult = NavigationHandler.prototype._ensureSelectionVariantFormatString(sJSON);
		assert.equal(sResult, sJSON, "provided string shall be passed through");

		sResult = NavigationHandler.prototype._ensureSelectionVariantFormatString(undefined);
		assert.equal(sResult, undefined, "'undefined' shall not provide any value");

	});

	QUnit.test("constructor: negative test - invalid input", function(assert) {
		var thrown = false;

		// invalid controller
		try {
			/* eslint-disable no-new */
			new NavigationHandler({} /* Controller */);
			/* eslint-enable no-new */
		} catch (x) {
			assert.ok(x instanceof NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			// assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			thrown = true;
		}
		assert.equal(thrown, true, "Invalid controller, exception has been thrown as expected");

		// invalid router
		oController = {
			getOwnerComponent: function() {
				return {};
			}
		};
		try {
			/* eslint-disable no-new */
			new NavigationHandler(oController);
			/* eslint-enable no-new */
		} catch (x) {
			assert.ok(x instanceof NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			// assert.equal(x.getSeverity(), sap.ca.ui.message.Type.ERROR, "raised error needs to be of severity ERROR");
			thrown = true;
		}
		assert.equal(thrown, true, "Invalid router, exception has been thrown as expected");

		// mock router for subsequent tests
		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {};
		});

		// invalid component
		oController = {
			getOwnerComponent: function() {
				return undefined;
			}
		};
		try {
			/* eslint-disable no-new */
			new NavigationHandler(oController);
			/* eslint-enable no-new */
		} catch (x) {
			assert.ok(x instanceof NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			thrown = true;
		}
		assert.equal(thrown, true, "Invalid component, exception has been thrown as expected");

		// invalid componentData
		oController = {
			getOwnerComponent: function() {
				return {
					getComponentData: "some string"
				};
			}
		};
		try {
			/* eslint-disable no-new */
			new NavigationHandler(oController);
			/* eslint-enable no-new */
		} catch (x) {
			assert.ok(x instanceof NavError, "raised error needs to be of type sap.ui.generic.app.navigation.service.NavError");
			thrown = true;
		}
		assert.equal(thrown, true, "Invalid component data, exception has been thrown as expected");

		stubGetRouter.restore();
	});

	// The function tests whether two Selection Variants are semantically equal. For instance, the following two Selection Variants are considered to
	// be equal:
	// Selection Variant 1 contains the parameter map "ParameterName1":"Value1",
	// Selection Variant 2 contains a SelectOption with name="ParameterName1", sign="I", option="EQ", value="Value1".
	function isSelVarEqual(oSelvar1, oSelvar2) {
		var j;
		if (oSelvar1.isEmpty()) {
			return oSelvar2.isEmpty();
		}
		var aSelvar1PropNames = oSelvar1.getParameterNames().concat(oSelvar1.getSelectOptionsPropertyNames());
		for (var i = 0; i < aSelvar1PropNames.length; i++) {
			var sPropName = aSelvar1PropNames[i];
			var aSelvar1Ranges = oSelvar1.getValue(sPropName); // getValue always returns an array of select options
			var aSelvar2Ranges = oSelvar2.getValue(sPropName);

			// Tests whether both arrays, if existent, have the same length.
			if (!Array.isArray(aSelvar2Ranges) && aSelvar1Ranges.length !== aSelvar2Ranges.length) {
				return false;
			}

			// Tests whether both arrays contain the same values regardless of their order.
			var aSelvar1RangesAsStrings = [];
			for (j = 0; j < aSelvar1Ranges.length; j++) {
				aSelvar1RangesAsStrings.push(JSON.stringify(aSelvar1Ranges[j]));
			}
			for (j = 0; j < aSelvar2Ranges.length; j++) {
				if (aSelvar1RangesAsStrings.indexOf(JSON.stringify(aSelvar2Ranges[j])) === -1) {
					return false;
				}
			}
		}
		return true;
	}

	function getMockedNavigationHandler(sHandlingMode) {
		if (!sHandlingMode) {
			sHandlingMode = ParamHandlingMode.SelVarWins;
		}

		// mock controller
		var oController = {
			getOwnerComponent: function() {
				return {
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock navigation service
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sap.ushell = {
			Container: {
				getService: function() {
					return oCrossNavMock;
				}
			}
		};

		// mock _getRouter method
		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					}
				}
			};
		});

		var oNavigationHandler = new NavigationHandler(oController, sHandlingMode);
		stubGetRouter.restore();
		return oNavigationHandler;
	}

	/**
	 * In the test cases below (with the exception of the complex case) we use the following naming conventions in order to distinguish between the
	 * different cases. aDefaultedParameters | "K1" | | "K3" | | "K5" | oAppState | "K1":"1" | "K2":"2" | | | "K5":"5.1" | "K6":"6.1"
	 * oStartupParameters | | | "K3":"3" | "K4":"4" | "K5":"5.2" | "K6":"6.2"
	 * -------------------------------------------------------------------------------------------------------------------------------- NavSelVar | ** |
	 * "K2":"2" | ** | "K4":"4" | "K5":"5.1" | "K6":"6.1" or "K6":"6.2" or "K6":["6.1", "6.2"] DefSelVar | "K1":"1" | | "K3":"3" | | "K5":"5.2" | | | | | | |
	 * option is selected based on handling mode Note: Two asterisk (**) indicate that the defaulted SelectionVariant is also returned for standard
	 * navigation.
	 */
	QUnit.test("_splitInboundNavigationParameters - Empty input", function(assert) {
		var aDefaultedParameters = [];
		var oAppStateSelVar = new SelectionVariant();
		var oStartupParameters = {};

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(oResult.oDefaultedSelVar.isEmpty(), "oDefaultedSelVar as expected");
		assert.ok(oResult.oNavigationSelVar.isEmpty(), "oNavigationSelVar as expected");
		assert.ok(oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - (Default) parameters in AppState only", function(assert) {
		var aDefaultedParameters = [
			"K1"
		];
		var oAppStateSelVar = new SelectionVariant();
		oAppStateSelVar.addParameter("K1", "1");
		var oStartupParameters = {};

		var oExpectedDefSelVar = new SelectionVariant();
		oExpectedDefSelVar.addSelectOption("K1", "I", "EQ", "1");
		var oExpectedNavSelVar = oExpectedDefSelVar;

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - (Non-default) parameters in AppState only", function(assert) {
		var aDefaultedParameters = [];
		var oAppStateSelVar = new SelectionVariant();
		oAppStateSelVar.addParameter("K2", "2");
		var oStartupParameters = {};

		var oExpectedDefSelVar = new SelectionVariant();
		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K2", "I", "EQ", "2");

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - (Default) parameters as startup parameters only", function(assert) {
		var aDefaultedParameters = [
			"K3"
		];
		var oAppStateSelVar = new SelectionVariant();
		var oStartupParameters = {
			"K3": "3"
		};

		var oExpectedDefSelVar = new SelectionVariant();
		oExpectedDefSelVar.addSelectOption("K3", "I", "EQ", "3");
		var oExpectedNavSelVar = oExpectedDefSelVar;

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - (Non-Default) parameters as startup parameters only", function(assert) {
		var aDefaultedParameters = [];
		var oAppStateSelVar = new SelectionVariant();
		var oStartupParameters = {
			"K4": "4"
		};

		var oExpectedDefSelVar = new SelectionVariant();
		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K4", "I", "EQ", "4");

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - Conflicting default parameters", function(assert) {
		var aDefaultedParameters = [
			"K5"
		];
		var oAppStateSelVar = new SelectionVariant();
		oAppStateSelVar.addParameter("K5", "5.1");
		var oStartupParameters = {
			"K5": "5.2"
		};

		var oExpectedDefSelVar = new SelectionVariant();
		oExpectedDefSelVar.addSelectOption("K5", "I", "EQ", "5.2");
		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K5", "I", "EQ", "5.1");

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - Conflicting non-default parameters", function(assert) {
		var aDefaultedParameters = [];
		var oAppStateSelVar = new SelectionVariant();
		oAppStateSelVar.addParameter("K6", "6.1");
		var oStartupParameters = {
			"K6": "6.2"
		};

		var oNavigationHandlerSelVarWins = getMockedNavigationHandler(ParamHandlingMode.SelVarWins);
		var oNavigationHandlerURLParamWins = getMockedNavigationHandler(ParamHandlingMode.URLParamWins);
		var oNavigationHandlerInsertInSelOpt = getMockedNavigationHandler(ParamHandlingMode.InsertInSelOpt);

		var oResult = oNavigationHandlerSelVarWins._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);
		var oExpectedDefSelVar = new SelectionVariant();
		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K6", "I", "EQ", "6.1");
		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");

		oResult = oNavigationHandlerURLParamWins._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);
		oExpectedDefSelVar = new SelectionVariant();
		oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K6", "I", "EQ", "6.2");
		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly);

		oResult = oNavigationHandlerInsertInSelOpt._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);
		oExpectedDefSelVar = new SelectionVariant();
		oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K6", "I", "EQ", "6.1");
		oExpectedNavSelVar.addSelectOption("K6", "I", "EQ", "6.2");
		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	/*
	 * aDefaultedParameters | "K7" | oAppState | | oStartupParameters | "K7": ["7a", "7b"] | "K8": ["8a", "8b"]
	 * -------------------------------------------------------------------------------------------------------------------------------- NavSelVar |
	 * "K7": ["7a", "7b"] | "K8": ["8a", "8b"] DefSelVar | "K7": ["7a", "7b"] | "K8": ["8a", "8b"]
	 */
	QUnit.test("_splitInboundNavigationParameters - (Default) multivalued parameters as startup parameters only", function(assert) {
		// TODO: Starting with version 1.32, Ushell puts defaulted multivalued parameters into the AppState.
		// Multivalued default parameters are prohibitted by launch pad designer. Question: Could defaults be configured
		// somewhere else or is the following test case of theoretical relevance only?
		var aDefaultedParameters = [
			"K7"
		];
		var oAppStateSelVar = new SelectionVariant();
		var oStartupParameters = {
			"K7": [
				"7a", "7b"
			]
		};

		var oExpectedDefSelVar = new SelectionVariant();
		oExpectedDefSelVar.addSelectOption("K7", "I", "EQ", "7a");
		oExpectedDefSelVar.addSelectOption("K7", "I", "EQ", "7b");
		var oExpectedNavSelVar = oExpectedDefSelVar;

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - (Non-Default) multivalued parameters as startup parameters only", function(assert) {
		var aDefaultedParameters = [];
		var oAppStateSelVar = new SelectionVariant();
		var oStartupParameters = {
			"K8": [
				"8a", "8b"
			]
		};

		var oExpectedDefSelVar = new SelectionVariant();
		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K8", "I", "EQ", "8a");
		oExpectedNavSelVar.addSelectOption("K8", "I", "EQ", "8b");

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	/*
	 * aDefaultedParameters | "K9" | oAppState | "K9": 9.1a | oStartupParameters | "K9": ["9.2a", "9.2b"] |
	 * -------------------------------------------------------------------------------------------------------------------------------- NavSelVar |
	 * "K9": ["9.1a"] | DefSelVar | "K9": ["9.2a", "9.2b"] |
	 */
	QUnit.test("_splitInboundNavigationParameters - Conflicting multivalued default parameters", function(assert) {
		// TODO: Starting with version 1.32, Ushell puts defaulted multivalued parameters into the AppState.
		// Multivalued default parameters are prohibitted by launch pad designer. Question: Could defaults be configured
		// somewhere else or is the following test case of theoretical relevance only?
		var aDefaultedParameters = [
			"K9"
		];
		var oAppStateSelVar = new SelectionVariant();
		oAppStateSelVar.addParameter("K9", "9.1a");
		var oStartupParameters = {
			"K9": [
				"9.2a", "9.2b"
			]
		};

		var oExpectedDefSelVar = new SelectionVariant();
		oExpectedDefSelVar.addSelectOption("K9", "I", "EQ", "9.2a");
		oExpectedDefSelVar.addSelectOption("K9", "I", "EQ", "9.2b");
		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K9", "I", "EQ", "9.1a");
		// oExpectedNavSelVar.addSelectOption("K5","I","EQ","5.1b");

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - Conflicting multivalued non-default parameters", function(assert) {
		var aDefaultedParameters = [];
		var oAppStateSelVar = new SelectionVariant();
		oAppStateSelVar.addSelectOption("K10", "I", "EQ", "10.1a");
		oAppStateSelVar.addSelectOption("K10", "I", "EQ", "10.1b");
		var oStartupParameters = {
			"K10": [
				"10.2a", "10.2b"
			]
		};

		var oNavigationHandlerSelVarWins = getMockedNavigationHandler(ParamHandlingMode.SelVarWins);
		var oNavigationHandlerURLParamWins = getMockedNavigationHandler(ParamHandlingMode.URLParamWins);
		var oNavigationHandlerInsertInSelOpt = getMockedNavigationHandler(ParamHandlingMode.InsertInSelOpt);

		var oResult = oNavigationHandlerSelVarWins._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);
		var oExpectedDefSelVar = new SelectionVariant();
		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K10", "I", "EQ", "10.1a");
		oExpectedNavSelVar.addSelectOption("K10", "I", "EQ", "10.1b");
		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");

		oResult = oNavigationHandlerURLParamWins._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);
		oExpectedDefSelVar = new SelectionVariant();
		oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K10", "I", "EQ", "10.2a");
		oExpectedNavSelVar.addSelectOption("K10", "I", "EQ", "10.2b");
		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly);

		oResult = oNavigationHandlerInsertInSelOpt._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);
		oExpectedDefSelVar = new SelectionVariant();
		oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K10", "I", "EQ", "10.1a");
		oExpectedNavSelVar.addSelectOption("K10", "I", "EQ", "10.1b");
		oExpectedNavSelVar.addSelectOption("K10", "I", "EQ", "10.2a");
		oExpectedNavSelVar.addSelectOption("K10", "I", "EQ", "10.2b");
		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - Complex case with multiple parametrs in output", function(assert) {
		/*
		 * aDefaultedParameters | "K1" | | "K3" | | "K5" oAppState | "K1":"1" | "K2":"2.1" | "K3":"3" | | "K5":"5.1" oStartupParameters | | "K2":"2.2" | |
		 * "K4":"4" | "K5":"5.2" ----------------------------------------------------------------------------------- NavSelVar | | "K2":"2.1" | |
		 * "K4":"4" | "K5":"5.1" DefSelVar | "K1":"1" | | "K3":"3" | | "K5":"5.2" | | handling mode | | | | | SelVar wins | | |
		 */

		var aDefaultedParameters = [
			"K1", "K3", "K5"
		];
		var oAppStateSelVar = new SelectionVariant();
		oAppStateSelVar.addParameter("K1", "1");
		oAppStateSelVar.addParameter("K2", "2.1");
		oAppStateSelVar.addSelectOption("K3", "I", "EQ", "3");
		oAppStateSelVar.addParameter("K5", "5.1");
		var oStartupParameters = {
			"K2": "2.2",
			"K4": "4",
			"K5": "5.2"
		};

		var oExpectedDefSelVar = new SelectionVariant();
		oExpectedDefSelVar.addSelectOption("K1", "I", "EQ", "1");
		oExpectedDefSelVar.addSelectOption("K3", "I", "EQ", "3");
		oExpectedDefSelVar.addSelectOption("K5", "I", "EQ", "5.2");

		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K2", "I", "EQ", "2.1");
		oExpectedNavSelVar.addSelectOption("K4", "I", "EQ", "4");
		oExpectedNavSelVar.addSelectOption("K5", "I", "EQ", "5.1");

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
		assert.ok(!oResult.hasOnlyDefaultParameters);
	});

	QUnit.test("_splitInboundNavigationParameters - Ignore startup parameters with reserved names", function(assert) {
		var aDefaultedParameters = [
			"K1"
		];
		var oAppStateSelVar = new SelectionVariant();
		oAppStateSelVar.addParameter("K1", "1");
		var oStartupParameters = {
			"sap-system": "dummy1",
			"K2": "2",
			"sap-ushell-defaultedParameterNames": "dummy2"
		};

		var oExpectedDefSelVar = new SelectionVariant();
		oExpectedDefSelVar.addSelectOption("K1", "I", "EQ", "1");
		var oExpectedNavSelVar = new SelectionVariant();
		oExpectedNavSelVar.addSelectOption("K2", "I", "EQ", "2");

		var oNavigationHandler = getMockedNavigationHandler();
		var oResult = oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParameters, aDefaultedParameters);

		assert.ok(isSelVarEqual(oResult.oDefaultedSelVar, oExpectedDefSelVar), "oDefaultedSelVar as expected");
		assert.ok(isSelVarEqual(oResult.oNavigationSelVar, oExpectedNavSelVar), "oNavigationSelVar as expected");
		assert.ok(!oResult.bNavSelVarHasDefaultsOnly, "bNavSelVarHasDefaultsOnly as expected");
	});

	QUnit.test("_splitInboundNavigationParameters - Invalid startup parameters", function(assert) {
		var aDefaultedParameters = [];
		var oAppStateSelVar = new SelectionVariant();
		var oNavigationHandler = getMockedNavigationHandler();

		var oStartupParametersInvalid = {
			"K4": 4
		}; // invalid because parameter value is not a string
		assert.raises(function() {
			oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParametersInvalid, aDefaultedParameters);
		}, new NavError("NavigationHandler.INVALID_INPUT"), "Exception has been thrown successfully");

		oStartupParametersInvalid = {
			"K4": [
				4, 5
			]
		}; // invalid because parameter value is not an array of string
		assert.raises(function() {
			oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParametersInvalid, aDefaultedParameters);
		}, new NavError("NavigationHandler.INVALID_INPUT"), "Exception has been thrown successfully");
	});

	QUnit.test("_splitInboundNavigationParameters - Invalid array of defaulted parameters", function(assert) {
		var aDefaultedParameters; // pass to splitInboundNavigationParameters as undefined
		var oAppStateSelVar = new SelectionVariant();
		var oNavigationHandler = getMockedNavigationHandler();
		var oStartupParametersInvalid = {};

		assert.raises(function() {
			oNavigationHandler._splitInboundNavigationParameters(oAppStateSelVar, oStartupParametersInvalid, aDefaultedParameters);
		}, new NavError("NavigationHandler.INVALID_INPUT"), "Exception has been thrown successfully");
	});

	QUnit.test("check getTechnicalParameter method", function(assert) {
		var oController = {
			getOwnerComponent: function() {
				return {
					getComponentData: function() {
					}
				};
			}
		};

		sinon.stub(NavigationHandler.prototype, "_getRouter").returns({});
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").returns({});

		var oNavService = new NavigationHandler(oController);
		assert.ok(oNavService);

		var aTechnicalParameters = oNavService.getTechnicalParameters();
		assert.ok(aTechnicalParameters);
		assert.equal(aTechnicalParameters[0], "hcpApplicationId");

		aTechnicalParameters[0] = "TEST";
		aTechnicalParameters = oNavService.getTechnicalParameters();
		assert.ok(aTechnicalParameters);
		assert.equal(aTechnicalParameters[0], "hcpApplicationId");

		NavigationHandler.prototype._getRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();

	});

	QUnit.test("check setTechnicalParameter/_isTechnicalParamater methods", function(assert) {
		var oController = {
			getOwnerComponent: function() {
				return {
					getComponentData: function() {
					}
				};
			}
		};

		sinon.stub(NavigationHandler.prototype, "_getRouter").returns({});
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").returns({});

		var oNavService = new NavigationHandler(oController);
		assert.ok(oNavService);

		assert.ok(oNavService._isTechnicalParameter("sap-system"));
		assert.ok(oNavService._isTechnicalParameter("sap-ushell-defaultedParameterNames"));
		assert.ok(oNavService._isTechnicalParameter("hcpApplicationId"));

		assert.ok(oNavService._isTechnicalParameter("sap-client"));
		assert.ok(oNavService._isTechnicalParameter("sap-xxx"));
		assert.ok(!oNavService._isTechnicalParameter("sapp-client"));

		assert.equal(oNavService._aTechnicalParamaters.length, 1);

		assert.ok(!oNavService._isTechnicalParameter("test"));

		var aTechnicalParameters = oNavService.getTechnicalParameters();
		aTechnicalParameters.push("test");

		oNavService.setTechnicalParameters(aTechnicalParameters);
		assert.ok(oNavService._isTechnicalParameter("test"));

		assert.equal(oNavService._aTechnicalParamaters.length, 2);
		assert.equal(oNavService.getTechnicalParameters().length, 2);

		oNavService.setTechnicalParameters(null);
		assert.equal(oNavService._aTechnicalParamaters.length, 0);
		assert.equal(oNavService.getTechnicalParameters().length, 0);

		NavigationHandler.prototype._getRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();
	});

	QUnit.test("validate navigate with sensitive and excluded information", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("ExcludedFilter1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getXAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("ExcludedFilter1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					valueTexts: {
						"Texts": [
							{
								"ContextUrl": "",
								"Language": "de",
								"PropertyTexts": [
									{
										"PropertyName": "SensitiveFilter1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "Deutsch (0001)"
											}
										]
									}, {
										"PropertyName": "CompanyCode",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "SAP (0001)"
											}
										]
									}
								]
							}, {
								"ContextUrl": "",
								"Language": "en",
								"PropertyTexts": [
									{
										"PropertyName": "SensitiveFilter1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "English (0001)"
											}
										]
									}
								]
							}
						]
					},
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("ExcludedFilter1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return oSelectionVariant.toJSONString();
			}
		};

		var oResultData = {
			replacedHash: "",
			appStatekeys: []
		};

		// mock controller

		var oEntityType = {
			property: [
				{
					name: "NonSensitiveFilter1"
				}, {
					name: "NonSensitiveFilter1"
				}, {
					name: "SensitiveFilter1",
					"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
						Bool: true
					}
				}, {
					name: "SensitiveFilter2",
					"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
						Bool: true
					}
				}, {
					name: "ExcludedFilter1",
					"com.sap.vocabularies.UI.v1.ExcludeFromNavigationContext": {
						Bool: true
					}
				}
			]
		};

		var oEntitySet = {
			entityType: "EntityType"
		};

		var oMetaModel = {
			getODataEntityType: function(sEntityType) {
				assert.equal(sEntityType, "EntityType");
				return oEntityType;
			},
			getODataEntitySet: function(sEntitySet) {
				assert.equal(sEntitySet, "EntitySet");
				return oEntitySet;
			},
			isA: function(s) {
				return true;
			},
			oModel: {}
		};

		var oCompModel = {
			isA: function(s) {
				return true;
			},
			getMetaModel: function() {
				return oMetaModel;
			},
			_getServerUrl: function() {
				return "";
			},
			getServiceMetadata: function() {
				return true;
			},
			sServiceUrl: "/foo"
		};
		var oController = {
			getOwnerComponent: function() {
				return {
					getModel: function() {
						return oCompModel;
					},
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").returns(oCrossNavMock);

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);
		sinon.spy(oNavigationHandler, "_saveAppStateWithImmediateReturn");

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// no sensitive information
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), oTestData.getInnerAppData(), fOnError, oTestData.getXAppData());

		// check stored data (sap-xapp-state)
		var sAppStateKey = oCrossNavMock.toExternalArgs.appStateKey;
		var oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();

			assert.ok(oAppData.selectionVariant);
			assert.ok(oAppData.selectionVariant.SelectOptions);
			assert.equal(oAppData.selectionVariant.SelectOptions.length, 2);
			assert.equal(oAppData.selectionVariant.SelectOptions[0].PropertyName, "CompanyCode");
			assert.equal(oAppData.selectionVariant.SelectOptions[1].PropertyName, "NonSensitiveFilter2");

			assert.ok(oAppData.valueTexts);
			assert.ok(oAppData.valueTexts.Texts);
			assert.equal(oAppData.valueTexts.Texts.length, 2);
			assert.ok(oAppData.valueTexts.Texts[0].PropertyTexts);
			assert.equal(oAppData.valueTexts.Texts[0].PropertyTexts.length, 1);
			assert.equal(oAppData.valueTexts.Texts[0].PropertyTexts[0].PropertyName, "CompanyCode");

			assert.ok(oAppData.valueTexts.Texts[1].PropertyTexts);
			assert.equal(oAppData.valueTexts.Texts[1].PropertyTexts.length, 0);

		});

		// check stored data (sap-iapp-state)
		sAppStateKey = oResultData.replacedHash.split("=")[1];
		oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();

			assert.ok(oAppData.selectionVariant);
			assert.ok(oAppData.selectionVariant.SelectOptions);
			assert.equal(oAppData.selectionVariant.SelectOptions.length, 3);
			assert.equal(oAppData.selectionVariant.SelectOptions[0].PropertyName, "CompanyCode");
			assert.equal(oAppData.selectionVariant.SelectOptions[1].PropertyName, "NonSensitiveFilter1");
			assert.equal(oAppData.selectionVariant.SelectOptions[2].PropertyName, "NonSensitiveFilter2");
		});

		var oNavPromise = oCrossNavMock.isNavigationSupported();
		oNavPromise.done(function() {
			assert.ok(oCrossNavMock.toExternalArgs);
			assert.ok(oCrossNavMock.toExternalArgs.params);
			assert.equal(Object.keys(oCrossNavMock.toExternalArgs.params).length, 1);
			assert.equal(Object.keys(oCrossNavMock.toExternalArgs.params), "Customer");
		});

		assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledTwice);

		oNavigationHandler._saveAppStateWithImmediateReturn.restore();
		stubGetRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();
	});

	QUnit.test("validate navigate with measure", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("Measure1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("Measure2", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getXAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("Measure1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					valueTexts: {
						"Texts": [
							{
								"ContextUrl": "",
								"Language": "de",
								"PropertyTexts": [
									{
										"PropertyName": "Measure1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "Deutsch (0001)"
											}
										]
									}, {
										"PropertyName": "CompanyCode",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "SAP (0001)"
											}
										]
									}
								]
							}, {
								"ContextUrl": "",
								"Language": "en",
								"PropertyTexts": [
									{
										"PropertyName": "Measure1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "English (0001)"
											}
										]
									}
								]
							}
						]
					},
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				oSelectionVariant.addSelectOption("Measure1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return oSelectionVariant.toJSONString();
			}
		};

		var oResultData = {
			replacedHash: "",
			appStatekeys: []
		};

		// mock controller

		var oEntityType = {
			property: [
				{
					name: "NonSensitiveFilter1"
				}, {
					name: "NonSensitiveFilter1"
				}, {
					name: "Measure1",
					"com.sap.vocabularies.Analytics.v1.Measure": {
						Bool: true
					}
				}, {
					name: "Measure2",
					"com.sap.vocabularies.Analytics.v1.Measure": {
						Bool: true
					}
				}
			]
		};

		var oEntitySet = {
			entityType: "EntityType"
		};

		var oMetaModel = {
			getODataEntityType: function(sEntityType) {
				assert.equal(sEntityType, "EntityType");
				return oEntityType;
			},
			getODataEntitySet: function(sEntitySet) {
				assert.equal(sEntitySet, "EntitySet");
				return oEntitySet;
			},
			isA: function(s) {
				return true;
			},
			oModel: {}
		};

		var oCompModel = {
			isA: function(s) {
				return true;
			},
			getMetaModel: function() {
				return oMetaModel;
			},
			_getServerUrl: function() {
				return "";
			},
			getServiceMetadata: function() {
				return true;
			},
			sServiceUrl: "/foo"
		};
		var oController = {
			getOwnerComponent: function() {
				return {
					getModel: function() {
						return oCompModel;
					},
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").returns(oCrossNavMock);

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);
		sinon.spy(oNavigationHandler, "_saveAppStateWithImmediateReturn");

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// no sensitive information
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), oTestData.getInnerAppData(), fOnError, oTestData.getXAppData());

		// check stored data (sap-xapp-state)
		var sAppStateKey = oCrossNavMock.toExternalArgs.appStateKey;
		var oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();

			assert.ok(oAppData.selectionVariant);
			assert.ok(oAppData.selectionVariant.SelectOptions);
			assert.equal(oAppData.selectionVariant.SelectOptions.length, 2);
			assert.equal(oAppData.selectionVariant.SelectOptions[0].PropertyName, "CompanyCode");
			assert.equal(oAppData.selectionVariant.SelectOptions[1].PropertyName, "NonSensitiveFilter2");

			assert.ok(oAppData.valueTexts);
			assert.ok(oAppData.valueTexts.Texts);
			assert.equal(oAppData.valueTexts.Texts.length, 2);
			assert.ok(oAppData.valueTexts.Texts[0].PropertyTexts);
			assert.equal(oAppData.valueTexts.Texts[0].PropertyTexts.length, 1);
			assert.equal(oAppData.valueTexts.Texts[0].PropertyTexts[0].PropertyName, "CompanyCode");

			assert.ok(oAppData.valueTexts.Texts[1].PropertyTexts);
			assert.equal(oAppData.valueTexts.Texts[1].PropertyTexts.length, 0);

		});

		// check stored data (sap-iapp-state)
		// iapp state not changed !
		sAppStateKey = oResultData.replacedHash.split("=")[1];
		oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();

			assert.ok(oAppData.selectionVariant);
			assert.ok(oAppData.selectionVariant.SelectOptions);
			assert.equal(oAppData.selectionVariant.SelectOptions.length, 5);
			assert.equal(oAppData.selectionVariant.SelectOptions[0].PropertyName, "CompanyCode");
			assert.equal(oAppData.selectionVariant.SelectOptions[1].PropertyName, "NonSensitiveFilter1");
			assert.equal(oAppData.selectionVariant.SelectOptions[2].PropertyName, "NonSensitiveFilter2");
			assert.equal(oAppData.selectionVariant.SelectOptions[3].PropertyName, "Measure1");
			assert.equal(oAppData.selectionVariant.SelectOptions[4].PropertyName, "Measure2");
		});

		var oNavPromise = oCrossNavMock.isNavigationSupported();
		oNavPromise.done(function() {
			assert.ok(oCrossNavMock.toExternalArgs);
			assert.ok(oCrossNavMock.toExternalArgs.params);
			assert.equal(Object.keys(oCrossNavMock.toExternalArgs.params).length, 1);
			assert.equal(Object.keys(oCrossNavMock.toExternalArgs.params), "Customer");
		});

		assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledTwice);

		oNavigationHandler._saveAppStateWithImmediateReturn.restore();
		stubGetRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();
	});

	QUnit.test("validate navigate with sensitive information - not loaded odata metadata", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getXAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					valueTexts: {
						"Texts": [
							{
								"ContextUrl": "",
								"Language": "de",
								"PropertyTexts": [
									{
										"PropertyName": "SensitiveFilter1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "Deutsch (0001)"
											}
										]
									}, {
										"PropertyName": "CompanyCode",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "SAP (0001)"
											}
										]
									}
								]
							}, {
								"ContextUrl": "",
								"Language": "en",
								"PropertyTexts": [
									{
										"PropertyName": "SensitiveFilter1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "English (0001)"
											}
										]
									}
								]
							}
						]
					},
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return oSelectionVariant.toJSONString();
			}
		};

		var oResultData = {
			replacedHash: "",
			appStatekeys: []
		};

		// mock controller

		var oEntityType = {
			property: [
				{
					name: "NonSensitiveFilter1"
				}, {
					name: "NonSensitiveFilter1"
				}, {
					name: "SensitiveFilter1",
					"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
						Bool: true
					}
				}, {
					name: "SensitiveFilter2",
					"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
						Bool: true
					}
				}
			]
		};

		var oEntitySet = {
			entityType: "EntityType"
		};

		var oMetaModel = {
			getODataEntityType: function(sEntityType) {
				assert.equal(sEntityType, "EntityType");
				return oEntityType;
			},
			getODataEntitySet: function(sEntitySet) {
				assert.equal(sEntitySet, "EntitySet");
				return oEntitySet;
			},
			isA: function(s) {
				return true;
			},
			oModel: {}
		};

		var oCompModel = {
			isA: function(s) {
				return true;
			},
			getMetaModel: function() {
				return oMetaModel;
			},
			_getServerUrl: function() {
				return "";
			},
			getServiceMetadata: function() {
				return false;
			},
			sServiceUrl: "/foo"
		};
		var oController = {
			getOwnerComponent: function() {
				return {
					getModel: function() {
						return oCompModel;
					},
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").returns(oCrossNavMock);

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);
		sinon.spy(oNavigationHandler, "_saveAppStateWithImmediateReturn");

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// no sensitive information
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), oTestData.getInnerAppData(), fOnError, oTestData.getXAppData());

		// check stored data (sap-xapp-state)
		var sAppStateKey = oCrossNavMock.toExternalArgs.appStateKey;
		var oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();

			assert.ok(!oAppData.selectionVariant);
		});

		// check stored data (sap-iapp-state)
		sAppStateKey = oResultData.replacedHash.split("=")[1];
		oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();

			assert.ok(!oAppData.selectionVariant);

		});

		var oNavPromise = oCrossNavMock.isNavigationSupported();
		oNavPromise.done(function() {
			assert.ok(oCrossNavMock.toExternalArgs);
			assert.ok(oCrossNavMock.toExternalArgs.params);
			assert.equal(Object.keys(oCrossNavMock.toExternalArgs.params).length, 0);
		});

		assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledTwice);

		oNavigationHandler._saveAppStateWithImmediateReturn.restore();
		stubGetRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();
	});

	QUnit.test("processBeforeSmartLinkPopoverOpens with sensitive information", function(assert) {
		// prepare test data
		var oTestData = {
			getSelectionVariant: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				return oSelectionVariant.toJSONString();
			},
			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getXAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					valueTexts: {
						"Texts": [
							{
								"ContextUrl": "",
								"Language": "de",
								"PropertyTexts": [
									{
										"PropertyName": "SensitiveFilter1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "Deutsch (0001)"
											}
										]
									}, {
										"PropertyName": "CompanyCode",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "SAP (0001)"
											}
										]
									}
								]
							}, {
								"ContextUrl": "",
								"Language": "en",
								"PropertyTexts": [
									{
										"PropertyName": "SensitiveFilter1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "English (0001)"
											}
										]
									}
								]
							}
						]
					},
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getSemanticAttributes: function() {
				return {
					SensitiveFilter1: "C0001",
					FiscalYear: "2015"
				};
			}
		};

		var oEntityType = {
			property: [
				{
					name: "NonSensitiveFilter1"
				}, {
					name: "NonSensitiveFilter1"
				}, {
					name: "SensitiveFilter1",
					"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
						Bool: true
					}
				}, {
					name: "SensitiveFilter2",
					"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
						Bool: true
					}
				}
			]
		};

		var oEntitySet = {
			entityType: "EntityType"
		};

		var oMetaModel = {
			oMetadata: {
				sUrl: "/foo/$metadata"
			},
			getODataEntityType: function(sEntityType) {
				assert.equal(sEntityType, "EntityType");
				return oEntityType;
			},
			getODataEntitySet: function(sEntitySet) {
				assert.equal(sEntitySet, "EntitySet");
				return oEntitySet;
			},
			isA: function(s) {
				return true;
			},
			oModel: {}
		};

		var oCompModel = {
			isA: function(s) {
				return true;
			},
			getMetaModel: function() {
				return oMetaModel;
			},
			_getServerUrl: function() {
				return "";
			},
			getServiceMetadata: function() {
				return true;
			},
			sServiceUrl: "/foo"
		};
		var oController = {
			getOwnerComponent: function() {
				return {
					getModel: function() {
						return oCompModel;
					},
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").returns(oCrossNavMock);

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sHash) {
						oController.sReplacedHash = sHash;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);
		sinon.spy(oNavigationHandler, "_saveAppStateWithImmediateReturn");

		var sIAppStateKey, sXAppStateKey;
		var fSaveAppState = oNavigationHandler._saveAppState;
		oNavigationHandler._saveAppState = function(a, b, c) {
			var sAppKey = fSaveAppState.call(oNavigationHandler, a, b, c);
			if (!sIAppStateKey) {
				sIAppStateKey = sAppKey;
			} else {
				sXAppStateKey = sAppKey;
			}
		};

		// call method to be tested
		var oEventParameters = fnGetTableEventParameters();
		oEventParameters.setSemanticAttributes(oTestData.getSemanticAttributes());
		var oSmartLinkPromise = oNavigationHandler.processBeforeSmartLinkPopoverOpens(oEventParameters, null, oTestData.getInnerAppData(), oTestData.getXAppData());
		oSmartLinkPromise.done(function(oEventParameters) {

			assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledTwice);

			// check stored data (sap-xapp-state)
			assert.ok(sXAppStateKey);
			var oAppStatePromise = oCrossNavMock.getAppState(null, sXAppStateKey);
			oAppStatePromise.done(function(oAppState) {
				var oAppData = oAppState.getData();

				assert.ok(oAppData.selectionVariant);
				assert.ok(oAppData.selectionVariant.SelectOptions);
				assert.equal(oAppData.selectionVariant.SelectOptions.length, 3);
				assert.equal(oAppData.selectionVariant.SelectOptions[0].PropertyName, "FiscalYear");
				assert.equal(oAppData.selectionVariant.SelectOptions[1].PropertyName, "CompanyCode");
				assert.equal(oAppData.selectionVariant.SelectOptions[2].PropertyName, "NonSensitiveFilter2");

				assert.ok(oAppData.valueTexts);
				assert.ok(oAppData.valueTexts.Texts);
				assert.equal(oAppData.valueTexts.Texts.length, 2);
				assert.ok(oAppData.valueTexts.Texts[0].PropertyTexts);
				assert.equal(oAppData.valueTexts.Texts[0].PropertyTexts.length, 1);
				assert.equal(oAppData.valueTexts.Texts[0].PropertyTexts[0].PropertyName, "CompanyCode");

				assert.ok(oAppData.valueTexts.Texts[1].PropertyTexts);
				assert.equal(oAppData.valueTexts.Texts[1].PropertyTexts.length, 0);
			});

			// check stored data (sap-iapp-state)
			assert.ok(sIAppStateKey);
			oAppStatePromise = oCrossNavMock.getAppState(null, sIAppStateKey);
			oAppStatePromise.done(function(oAppState) {
				var oAppData = oAppState.getData();

				assert.ok(oAppData.selectionVariant);
				assert.ok(oAppData.selectionVariant.SelectOptions);
				assert.equal(oAppData.selectionVariant.SelectOptions.length, 3);
				assert.equal(oAppData.selectionVariant.SelectOptions[0].PropertyName, "CompanyCode");
				assert.equal(oAppData.selectionVariant.SelectOptions[1].PropertyName, "NonSensitiveFilter1");
				assert.equal(oAppData.selectionVariant.SelectOptions[2].PropertyName, "NonSensitiveFilter2");
			});

		});

		oSmartLinkPromise.fail(function(oError) {
			assert.ok(false, "no errors expected");
		});

		oNavigationHandler._saveAppStateWithImmediateReturn.restore();
		stubGetRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();

		oEventParameters.oSemanticAttributes = undefined;
		oEventParameters.sAppStateKey = undefined;
		oEventParameters.bOpenCalled = undefined;
	});

	QUnit.test("checking setModel", function(assert) {

		var oCompModel = {}, oNewModel = {
			test: 1
		};

		var oController = {
			getOwnerComponent: function() {
				return {
					getModel: function() {
						return oCompModel;
					},
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").returns({});
		sinon.stub(NavigationHandler.prototype, "_getRouter").returns({});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);
		assert.deepEqual(oNavigationHandler._getModel(), oCompModel);

		oNavigationHandler.setModel(oNewModel);
		assert.deepEqual(oNavigationHandler._getModel(), oNewModel);

		NavigationHandler.prototype._getAppNavigationService.restore();
		NavigationHandler.prototype._getRouter.restore();
	});

	QUnit.test("checking constructContextUrl", function(assert) {

		var oModel = {
			isA: function(s) {
				return true;
			},
			_getServerUrl: function() {
				return "server";
			},
			sServiceUrl: "/service"
		};
		var oController = {
			getOwnerComponent: function() {
				return {
					getModel: function() {
						return oModel;
					},
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		sinon.stub(NavigationHandler.prototype, "_getRouter").returns({});
		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);

		var sContextUrl = oNavigationHandler.constructContextUrl("test", oModel);
		assert.equal(sContextUrl, "server/service/$metadata#test");

		NavigationHandler.prototype._getRouter.restore();

	});

	QUnit.test("validate navigate with sensitive information and measures", function(assert) {

		// prepare test data
		var oTestData = {
			sSemanticObject: "SalesOrder",
			sActionName: "create",

			getInnerAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("Measure1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilterMeasure2", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getXAppData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("CompanyCode", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("NonSensitiveFilter2", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.addSelectOption("Measure2", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return {
					selectionVariant: oSelectionVariant.toJSONString(),
					valueTexts: {
						"Texts": [
							{
								"ContextUrl": "",
								"Language": "de",
								"PropertyTexts": [
									{
										"PropertyName": "SensitiveFilter1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "Deutsch (0001)"
											}
										]
									}, {
										"PropertyName": "CompanyCode",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "SAP (0001)"
											}
										]
									}
								]
							}, {
								"ContextUrl": "",
								"Language": "en",
								"PropertyTexts": [
									{
										"PropertyName": "SensitiveFilter1",
										"ValueTexts": [
											{
												"PropertyValue": "0001",
												"Text": "English (0001)"
											}
										]
									}
								]
							}
						]
					},
					tableVariantId: "StandardVariant",
					customData: {
						myParam: "yes"
					}
				};
			},
			getNavData: function() {
				var oSelectionVariant = new SelectionVariant();
				oSelectionVariant.setID("MyVariant");
				oSelectionVariant.addSelectOption("Customer", "I", "EQ", "C0001");
				oSelectionVariant.addSelectOption("SensitiveFilter1", "I", "EQ", "0001");
				oSelectionVariant.setFilterContextUrl("/foo/$metadata#EntitySet");
				return oSelectionVariant.toJSONString();
			}
		};

		var oResultData = {
			replacedHash: "",
			appStatekeys: []
		};

		// mock controller

		var oEntityType = {
			property: [
				{
					name: "NonSensitiveFilter1"
				}, {
					name: "SensitiveFilter1",
					"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
						Bool: true
					}
				}, {
					name: "SensitiveFilterMeasure2",
					"com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive": {
						Bool: true
					},
					"com.sap.vocabularies.Analytics.v1.Measure": {
						Bool: true
					}
				}, {
					name: "Measure1",
					"com.sap.vocabularies.Analytics.v1.Measure": {
						Bool: true
					}
				}, {
					name: "Measure2",
					"com.sap.vocabularies.Analytics.v1.Measure": {
						Bool: true
					}
				}
			]
		};

		var oEntitySet = {
			entityType: "EntityType"
		};

		var oMetaModel = {
			getODataEntityType: function(sEntityType) {
				assert.equal(sEntityType, "EntityType");
				return oEntityType;
			},
			getODataEntitySet: function(sEntitySet) {
				assert.equal(sEntitySet, "EntitySet");
				return oEntitySet;
			},
			isA: function(s) {
				return true;
			},
			oModel: {}
		};

		var oCompModel = {
			isA: function(s) {
				return true;
			},
			getMetaModel: function() {
				return oMetaModel;
			},
			_getServerUrl: function() {
				return "";
			},
			getServiceMetadata: function() {
				return true;
			},
			sServiceUrl: "/foo"
		};
		var oController = {
			getOwnerComponent: function() {
				return {
					getModel: function() {
						return oCompModel;
					},
					oComponentData: {},
					getComponentData: function() {
						return this.oComponentData;
					}
				};
			}
		};

		// mock CrossAppNavigationService
		var oCrossNavMock = new CrossAppNavigationServiceMock();
		sinon.stub(NavigationHandler.prototype, "_getAppNavigationService").returns(oCrossNavMock);

		var stubGetRouter = sinon.stub(NavigationHandler.prototype, "_getRouter").callsFake(function() {
			return {
				oHashChanger: {
					getHash: function() {
						return "";
					},
					replaceHash: function(sAppHashNew) {
						// store the new hash for later checks
						oResultData.replacedHash = sAppHashNew;
					}
				}
			};
		});

		// get instance of the NavigationHandler
		var oNavigationHandler = new NavigationHandler(oController);
		sinon.spy(oNavigationHandler, "_saveAppStateWithImmediateReturn");

		var fOnError = function(oError) {
			assert.ok(false, oError.getErrorCode() + " was raised");
		};

		// no sensitive information
		oNavigationHandler.navigate(oTestData.sSemanticObject, oTestData.sActionName, oTestData.getNavData(), oTestData.getInnerAppData(), fOnError, oTestData.getXAppData());

		// check stored data (sap-xapp-state)
		var sAppStateKey = oCrossNavMock.toExternalArgs.appStateKey;
		var oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();

			assert.ok(oAppData.selectionVariant);
			assert.ok(oAppData.selectionVariant.SelectOptions);
			assert.equal(oAppData.selectionVariant.SelectOptions.length, 2);
			assert.equal(oAppData.selectionVariant.SelectOptions[0].PropertyName, "CompanyCode");
			assert.equal(oAppData.selectionVariant.SelectOptions[1].PropertyName, "NonSensitiveFilter2");

			assert.ok(oAppData.valueTexts);
			assert.ok(oAppData.valueTexts.Texts);
			assert.equal(oAppData.valueTexts.Texts.length, 2);
			assert.ok(oAppData.valueTexts.Texts[0].PropertyTexts);
			assert.equal(oAppData.valueTexts.Texts[0].PropertyTexts.length, 1);
			assert.equal(oAppData.valueTexts.Texts[0].PropertyTexts[0].PropertyName, "CompanyCode");

			assert.ok(oAppData.valueTexts.Texts[1].PropertyTexts);
			assert.equal(oAppData.valueTexts.Texts[1].PropertyTexts.length, 0);

		});

		// check stored data (sap-iapp-state)
		sAppStateKey = oResultData.replacedHash.split("=")[1];
		oAppStatePromise = oCrossNavMock.getAppState(null, sAppStateKey);
		oAppStatePromise.done(function(oAppState) {
			var oAppData = oAppState.getData();

			assert.ok(oAppData.selectionVariant);
			assert.ok(oAppData.selectionVariant.SelectOptions);
			assert.equal(oAppData.selectionVariant.SelectOptions.length, 2);
			assert.equal(oAppData.selectionVariant.SelectOptions[0].PropertyName, "CompanyCode");
			assert.equal(oAppData.selectionVariant.SelectOptions[1].PropertyName, "Measure1");
		});

		var oNavPromise = oCrossNavMock.isNavigationSupported();
		oNavPromise.done(function() {
			assert.ok(oCrossNavMock.toExternalArgs);
			assert.ok(oCrossNavMock.toExternalArgs.params);
			assert.equal(Object.keys(oCrossNavMock.toExternalArgs.params).length, 1);
			assert.equal(Object.keys(oCrossNavMock.toExternalArgs.params), "Customer");
		});

		assert.ok(oNavigationHandler._saveAppStateWithImmediateReturn.calledTwice);

		oNavigationHandler._saveAppStateWithImmediateReturn.restore();
		stubGetRouter.restore();
		NavigationHandler.prototype._getAppNavigationService.restore();
	});
});
