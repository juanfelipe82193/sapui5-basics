/* global QUnit, sinon */
/*eslint max-nested-callbacks: [2, 5]*/

sap.ui.define([
	"sap/ui/mdc/field/ConditionType",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/mdc/field/FieldHelpBase",
	"sap/ui/mdc/field/FieldBaseDelegate",
	"sap/ui/mdc/condition/FilterOperatorUtil",
	"sap/ui/model/type/Integer",
	"sap/ui/model/type/Currency",
	"sap/ui/model/FormatException",
	"sap/ui/model/ParseException",
	"sap/ui/model/odata/type/String"
], function (
		ConditionType,
		Condition,
		FieldHelpBase,
		FieldBaseDelegate,
		FilterOperatorUtil,
		IntegerType,
		CurrencyType,
		FormatException,
		ParseException,
		StringType
		) {
	"use strict";

	var oConditionType;
	var oValueType;

	QUnit.module("Default type", {
		beforeEach: function() {
			oConditionType = new ConditionType({delegate: FieldBaseDelegate});
		},
		afterEach: function() {
			oConditionType.destroy();
			oConditionType = undefined;
		}
	});

	QUnit.test("Formatting: nothing", function(assert) {

		var sResult = oConditionType.formatValue();
		assert.equal(sResult, null, "Result of formatting");

	});

	QUnit.test("Formatting: EEQ - simple String", function(assert) {

		var oCondition = Condition.createCondition("EEQ", ["Test"]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "Test", "Result of formatting");

		oCondition = Condition.createCondition("EEQ", ["1"]);
		sResult = oConditionType.formatValue(oCondition, "int");
		assert.equal(sResult, 1, "Result of formatting");

	});

	QUnit.test("Formatting: EEQ - key/Description", function(assert) {

		oConditionType.oFormatOptions.display = "Description"; // fake setting directly
		oConditionType.oFormatOptions.operators = ["EEQ"]; // fake setting directly
		var oCondition = Condition.createCondition("EEQ", ["A", "Test"]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "Test", "Result of formatting");

		// EQ fallback
		oCondition = Condition.createCondition("EQ", ["A", "Test"]);
		sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "Test", "Result of formatting");

	});

	QUnit.test("Formatting: invalid condition", function(assert) {

		var oException;

		try {
			oConditionType.formatValue("Test");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		oException = undefined;

		var oCondition = Condition.createCondition("EQ", []);
		try {
			oConditionType.formatValue(oCondition, "int");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

	});

	QUnit.test("Formatting: Contains - simple String", function(assert) {

		var oCondition = Condition.createCondition("Contains", ["Test"]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "*Test*", "Result of formatting");

	});

	QUnit.test("Formatting: Contains - simple String (hideOperator)", function(assert) {

		oConditionType.oFormatOptions.hideOperator = true; // fake setting directly
		var oCondition = Condition.createCondition("Contains", ["Test"]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "Test", "Result of formatting");

	});

	QUnit.test("Parsing: Default - simple String", function(assert) {

		var oCondition = oConditionType.parseValue("Test");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "Contains", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 1, "Values length");
		assert.equal(oCondition.values[0], "Test", "Values entry");

		oCondition = oConditionType.parseValue(1, "int");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "Contains", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 1, "Values length");
		assert.equal(oCondition.values[0], "1", "Values entry");

	});

	QUnit.test("Parsing: EEQ - simple String", function(assert) {

		oConditionType.setFormatOptions({operators: ["EEQ"]});
		var oCondition = oConditionType.parseValue("Test");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "Test", "Values entry");
		assert.notOk(oCondition.values[1], "Description entry");

	});

	QUnit.test("Parsing: EEQ - simple String as 'any'", function(assert) {

		oConditionType.setFormatOptions({operators: ["EEQ"]});
		var oCondition = oConditionType.parseValue("Test", "any");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "Test", "Values entry");
		assert.notOk(oCondition.values[1], "Description entry");

	});

	QUnit.test("Parsing: EEQ - empty string", function(assert) {

		oConditionType.setFormatOptions({operators: ["EEQ"]});
		var oCondition = oConditionType.parseValue("");
		assert.notOk(oCondition, "no Result returned");

	});

	QUnit.test("Parsing: null", function(assert) {

		var oCondition = oConditionType.parseValue(null);
		assert.ok(oCondition === null, "null returned");

	});

	QUnit.module("Number type", {
		beforeEach: function() {
			oValueType = new IntegerType({}, {maximum: 100});
			oConditionType = new ConditionType({valueType: oValueType, fieldPath: "X"});
		},
		afterEach: function() {
			oConditionType.destroy();
			oConditionType = undefined;
			oValueType.destroy();
			oValueType = undefined;
		}
	});

	QUnit.test("Formatting: EEQ - number", function(assert) {

		var oCondition = Condition.createCondition("EEQ", [2]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "2", "Result of formatting");

	});

	QUnit.test("Parsing: EEQ - number", function(assert) {

		oConditionType.setFormatOptions({operators: ["EEQ"], fieldPath: "X"});
		var oCondition = oConditionType.parseValue("1");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], 1, "Values entry");
		assert.notOk(oCondition.values[1], "Description entry");

	});

	QUnit.test("Parsing: GreaterThan - number", function(assert) {

		var oCondition = oConditionType.parseValue(">1");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "GT", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 1, "Values length");
		assert.equal(oCondition.values[0], 1, "Values entry");

	});

	QUnit.test("Parsing: invalid value", function(assert) {

		var oException;

		try {
			oConditionType.parseValue("X");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

	});

	QUnit.test("Validating: invalid value", function(assert) {

		var oCondition = Condition.createCondition("EEQ", [200]);
		var oException;

		try {
			oConditionType.validateValue(oCondition);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

		oException = undefined;
		try {
			oConditionType.validateValue("XXX");
		} catch (e) {
			oException = e;
		}
		assert.ok(oException, "exception fired");

	});

	var oFieldHelp;
	var bAsyncCalled;
	var fnAsync = function(oPromise) {
		bAsyncCalled = true;
		if (!(oPromise instanceof Promise)) {
			throw new Error("needs promise");
		}
	};

	QUnit.module("Key/Description", {
		beforeEach: function() {
			oFieldHelp = new FieldHelpBase("FH1");
			var oStub = sinon.stub(oFieldHelp, "getTextForKey");
			oStub.withArgs("I1").returns("Item1");
			oStub.withArgs("I2").returns({key: "i2", description: "Item 2", inParameters: {in1: "I2"}, outParameters: {out1: "I2"}});
			oStub.withArgs("I3").returns("Item3");
			oStub = sinon.stub(oFieldHelp, "getKeyForText");
			oStub.withArgs("Item1").returns("I1");
			oStub.withArgs("Item2").returns({key: "i2", description: "Item 2", inParameters: {in1: "I2"}, outParameters: {out1: "I2"}});
			oStub.withArgs("Item3").returns("I3");

			oConditionType = new ConditionType({
				display: "Description",
				fieldHelpID: "FH1",
				operators: ["EEQ"],
				asyncParsing: fnAsync,
				delegate: FieldBaseDelegate
			});
		},
		afterEach: function() {
			oFieldHelp.destroy();
			oFieldHelp = undefined;
			oConditionType.destroy();
			oConditionType = undefined;
			bAsyncCalled = undefined;
		}
	});

	QUnit.test("Formatting: key -> description (from condition)", function(assert) {

		var oCondition = Condition.createCondition("EEQ", ["I1", "Text1"]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "Text1", "Result of formatting");

	});

	QUnit.test("Formatting: key -> description (from help)", function(assert) {

		var oCondition = Condition.createCondition("EEQ", ["I1"]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "Item1", "Result of formatting");

		oCondition.values.push(undefined);
		sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, "Item1", "Result of formatting");

		oCondition = Condition.createCondition("EEQ", ["I2"]);
		sResult = oConditionType.formatValue(oCondition);
		assert.ok(typeof sResult, "object", "Object returned");
		assert.equal(sResult, "Item 2", "Result of formatting");

	});

	QUnit.test("Formatting: invalid key -> description (from help)", function(assert) {

		oFieldHelp.getTextForKey.withArgs("X").throws(new FormatException("Value \"X\" does not exist."));
		var oCondition = Condition.createCondition("EEQ", ["X"]);
		var oException;

		try {
			oConditionType.formatValue(oCondition);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException.message, "Value \"X\" does not exist.", "error text");

	});

	QUnit.test("Formatting: key -> description (from help) Async", function(assert) {

		var oCondition = Condition.createCondition("EEQ", ["I1"]);
		oFieldHelp.getTextForKey.restore();
		var oStub = sinon.stub(oFieldHelp, "getTextForKey");

		oStub.callsFake(function(vKey) {
			var oPromise = new Promise(function(fResolve) {
				setTimeout(function () { // simulate request
					var vResult;
					switch (vKey) {
					case "I1":
						vResult = "Item1";
						break;

					case "I2":
						vResult = {key: "i2", description: "Item2"};
						break;

					case "I3":
						vResult = "Item3";
						break;

					default:
						break;
					}

					fResolve(vResult);
				}, 0);
			});
			return oPromise;
		});

		var sResult = oConditionType.formatValue(oCondition);
		assert.ok(sResult instanceof Promise, "Promise returned");

		var fnDone = assert.async();
		sResult.then(function(sDescription) {
			assert.equal(sDescription, "Item1", "Result of formatting");

			oCondition.values.push(undefined);
			sResult = oConditionType.formatValue(oCondition);
			assert.ok(sResult instanceof Promise, "Promise returned");

			sResult.then(function(sDescription) {
				assert.equal(sDescription, "Item1", "Result of formatting");

				oCondition = Condition.createCondition("EEQ", ["I2"]);
				sResult = oConditionType.formatValue(oCondition);
				assert.ok(sResult instanceof Promise, "Promise returned");

				sResult.then(function(sDescription) {
					assert.equal(sDescription, "Item2", "Result of formatting");
					fnDone();
				});
			});
		});

	});

	QUnit.test("Formatting: key -> description (from help) with error Async", function(assert) {

		var oCondition = Condition.createCondition("EEQ", ["I1"]);
		oFieldHelp.getTextForKey.restore();
		var oStub = sinon.stub(oFieldHelp, "getTextForKey");

		oStub.callsFake(function(vKey) {
			var oPromise = new Promise(function(fResolve, fReject) {
				setTimeout(function () { // simulate request
					try {
						throw new FormatException("Cannot format value " + vKey);
					} catch (oError) {
						fReject(oError);
					}
				}, 0);
			});
			return oPromise;
		});

		var sResult = oConditionType.formatValue(oCondition);
		assert.ok(sResult instanceof Promise, "Promise returned");

		var fnDone = assert.async();
		sResult.catch(function(oError) {
			assert.ok(oError, "Error Fired");
			assert.ok(oError instanceof FormatException, "Error is a FormatException");
			assert.equal(oError.message, "Cannot format value I1", "Error message");

			oFieldHelp.setValidateInput(false);
			sResult = oConditionType.formatValue(oCondition);
			assert.ok(sResult instanceof Promise, "Promise returned");

			sResult.then(function(sDescription) {
				assert.equal(sDescription, "I1", "Result of formatting");
				fnDone();
			});
		});

	});

	QUnit.test("Parsing: description -> key", function(assert) {

		var oCondition = oConditionType.parseValue("Item1");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "I1", "Values entry0");
		assert.equal(oCondition.values[1], "Item1", "Values entry1");
		assert.notOk(oCondition.inParameters, "no in-parameters returned");
		assert.notOk(oCondition.outParameters, "no out-parameters returned");
		assert.notOk(bAsyncCalled, "asyncParsing function not called");

		oCondition = oConditionType.parseValue("Item2");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "i2", "Values entry0");
		assert.equal(oCondition.values[1], "Item 2", "Values entry1");
		assert.deepEqual(oCondition.inParameters, {in1: "I2"} , "in-parameters returned");
		assert.deepEqual(oCondition.outParameters, {out1: "I2"} , "out-parameters returned");
		assert.notOk(bAsyncCalled, "asyncParsing function not called");

	});

	QUnit.test("Parsing: key -> key and description", function(assert) {

		var oCondition = oConditionType.parseValue("I2");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "i2", "Values entry0");
		assert.equal(oCondition.values[1], "Item 2", "Values entry1");
		assert.deepEqual(oCondition.inParameters, {in1: "I2"} , "in-parameters returned");
		assert.deepEqual(oCondition.outParameters, {out1: "I2"} , "out-parameters returned");

	});

	QUnit.test("Parsing: key and description -> key and Description (from help)", function(assert) {

		oConditionType.oFormatOptions.display = "ValueDescription"; // fake setting directly

		var oCondition = oConditionType.parseValue("I2 (X)");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "i2", "Values entry0");
		assert.equal(oCondition.values[1], "Item 2", "Values entry1");
		assert.deepEqual(oCondition.inParameters, {in1: "I2"} , "in-parameters returned");
		assert.deepEqual(oCondition.outParameters, {out1: "I2"} , "out-parameters returned");

		oCondition = oConditionType.parseValue("Item3");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "I3", "Values entry0");
		assert.equal(oCondition.values[1], "Item3", "Values entry1");
		assert.notOk(oCondition.inParameters, "no in-parameters returned");
		assert.notOk(oCondition.outParameters, "no out-parameters returned");

	});

	QUnit.test("Parsing: key and description -> key and Description (from help) with error", function(assert) {

		var oType = new StringType({}, {maxLength: 2}); // use type to test invalid key is not checked for description
		oConditionType.oFormatOptions.valueType = oType; // fake setting directly
		var oException;
		oConditionType.oFormatOptions.display = "ValueDescription"; // fake setting directly

		try {
			oConditionType.parseValue("X");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException && oException.message, "Value \"X\" does not exist.", "error text");
		assert.ok(oFieldHelp.getTextForKey.calledOnce, "getTextForKey called");
		assert.ok(oFieldHelp.getKeyForText.calledOnce, "getKeyForText called");

		oFieldHelp.getTextForKey.resetHistory();
		oFieldHelp.getKeyForText.resetHistory();
		oException = null;

		try {
			oConditionType.parseValue("XXX");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException && oException.message, "Value \"XXX\" does not exist.", "error text");
		assert.notOk(oFieldHelp.getTextForKey.called, "getTextForKey not called");
		assert.ok(oFieldHelp.getKeyForText.calledOnce, "getKeyForText called");

		// test own error (like runtime error) just forwarded
		oFieldHelp.getTextForKey.resetHistory();
		oFieldHelp.getKeyForText.resetHistory();
		oException = null;
		oFieldHelp.getTextForKey.withArgs("YY").throws(new Error("myError"));
		try {
			oConditionType.parseValue("YY");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException && oException.message, "myError", "error text");
		assert.ok(oFieldHelp.getTextForKey.calledOnce, "getTextForKey called");
		assert.notOk(oFieldHelp.getKeyForText.called, "getKeyForText not called");

		oFieldHelp.getTextForKey.resetHistory();
		oFieldHelp.getKeyForText.resetHistory();
		oException = null;
		oConditionType.oFormatOptions.display = "DescriptionValue"; // fake setting directly

		try {
			oConditionType.parseValue("X");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException.message, "Value \"X\" does not exist.", "error text");
		assert.ok(oFieldHelp.getTextForKey.calledOnce, "getTextForKey called");
		assert.ok(oFieldHelp.getKeyForText.calledOnce, "getKeyForText called");

		oFieldHelp.getTextForKey.resetHistory();
		oFieldHelp.getKeyForText.resetHistory();
		oException = null;

		try {
			oConditionType.parseValue("XXX");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException.message, "Value \"XXX\" does not exist.", "error text");
		assert.notOk(oFieldHelp.getTextForKey.called, "getTextForKey not called");
		assert.ok(oFieldHelp.getKeyForText.calledOnce, "getKeyForText called");

		oType.destroy();

	});

	QUnit.test("Parsing: description -> key with error", function(assert) {

		var oType = new StringType({}, {maxLength: 2}); // use type to test invalid key is not checked for description
		oConditionType.oFormatOptions.valueType = oType; // fake setting directly
		var oException;

		try {
			oConditionType.parseValue("X");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException && oException.message, "Value \"X\" does not exist.", "error text");
		assert.ok(oFieldHelp.getTextForKey.calledOnce, "getTextForKey called");
		assert.ok(oFieldHelp.getKeyForText.calledOnce, "getKeyForText called");

		// test own error (like runtime error) just forwarded
		oFieldHelp.getTextForKey.resetHistory();
		oFieldHelp.getKeyForText.resetHistory();
		oException = null;
		oFieldHelp.getTextForKey.withArgs("YY").throws(new Error("myError-TextForKey"));
		try {
			oConditionType.parseValue("YY");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException && oException.message, "myError-TextForKey", "error text");
		assert.ok(oFieldHelp.getTextForKey.calledOnce, "getTextForKey called");
		assert.ok(oFieldHelp.getKeyForText.calledOnce, "getKeyForText called");

		// test own error (like runtime error) just forwarded
		oFieldHelp.getTextForKey.resetHistory();
		oFieldHelp.getKeyForText.resetHistory();
		oException = null;
		oFieldHelp.getKeyForText.withArgs("YY").throws(new Error("myError-KeyForText"));
		try {
			oConditionType.parseValue("YY");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException && oException.message, "myError-KeyForText", "error text");
		assert.notOk(oFieldHelp.getTextForKey.called, "getTextForKey not called");
		assert.ok(oFieldHelp.getKeyForText.calledOnce, "getKeyForText called");

		// test invalid key because of type validation
		oFieldHelp.getTextForKey.resetHistory();
		oFieldHelp.getKeyForText.resetHistory();
		oException = null;
		oFieldHelp.getKeyForText.withArgs("ZZZ").throws(new ParseException("myParseException"));
		try {
			oConditionType.parseValue("ZZZ");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.equal(oException && oException.message, "myParseException", "error text");
		assert.notOk(oFieldHelp.getTextForKey.called, "getTextForKey not called");
		assert.ok(oFieldHelp.getKeyForText.calledOnce, "getKeyForText called");

	});

	QUnit.test("Parsing: description -> key (from help) Async", function(assert) {

		oFieldHelp.getKeyForText.restore();
		var oStub = sinon.stub(oFieldHelp, "getKeyForText");

		oStub.callsFake(function(sText) {
			var oPromise = new Promise(function(fResolve) {
				setTimeout(function () { // simulate request
					var vKey;
					switch (sText) {
					case "Item1":
						vKey = "I1";
						break;

					case "Item2":
						vKey = "I2";
						break;

					case "Item3":
						vKey = "I3";
						break;

					default:
						break;
					}

					fResolve(vKey);
				}, 0);
			});
			return oPromise;
		});

		var vResult = oConditionType.parseValue("Item2");
		assert.ok(vResult instanceof Promise, "Promise returned");
		assert.ok(bAsyncCalled, "asyncParsing function called");

		var fnDone = assert.async();
		vResult.then(function(oCondition) {
			assert.ok(oCondition, "Result returned");
			assert.equal(typeof oCondition, "object", "Result is object");
			assert.equal(oCondition.operator, "EEQ", "Operator");
			assert.ok(Array.isArray(oCondition.values), "values are arry");
			assert.equal(oCondition.values.length, 2, "Values length");
			assert.equal(oCondition.values[0], "I2", "Values entry0");
			assert.equal(oCondition.values[1], "Item2", "Values entry1");
			fnDone();
		});

	});

	QUnit.test("Parsing: key and description -> key and Description (from help) Async", function(assert) {

		oConditionType.oFormatOptions.display = "ValueDescription"; // fake setting directly
		oFieldHelp.getTextForKey.restore();
		var oStub = sinon.stub(oFieldHelp, "getTextForKey");

		oStub.callsFake(function(vKey) {
			var oPromise = new Promise(function(fResolve, fReject) {
				setTimeout(function () { // simulate request
					switch (vKey) {
					case "I1":
						fResolve("Item1");
						break;

					case "I2":
						fResolve({key: "I2", description: "Item2", inParameters: {in1: "I2"}, outParameters: {out1: "I2"}});
						break;

					case "I3":
						fResolve("Item3");
						break;

					default:
						fReject();
					}
				}, 0);
			});
			return oPromise;
		});

		var vResult = oConditionType.parseValue("I2 (X)");
		assert.ok(vResult instanceof Promise, "Promise returned");

		var fnDone = assert.async();
		vResult.then(function(oCondition) {
			assert.ok(oCondition, "Result returned");
			assert.equal(typeof oCondition, "object", "Result is object");
			assert.equal(oCondition.operator, "EEQ", "Operator");
			assert.ok(Array.isArray(oCondition.values), "values are arry");
			assert.equal(oCondition.values.length, 2, "Values length");
			assert.equal(oCondition.values[0], "I2", "Values entry0");
			assert.equal(oCondition.values[1], "Item2", "Values entry1");
			assert.deepEqual(oCondition.inParameters, {in1: "I2"} , "in-parameters returned");
			assert.deepEqual(oCondition.outParameters, {out1: "I2"} , "out-parameters returned");

			vResult = oConditionType.parseValue("Item3");
			assert.ok(vResult instanceof Promise, "Promise returned");

			vResult.then(function(oCondition) {
				assert.ok(oCondition, "Result returned");
				assert.equal(typeof oCondition, "object", "Result is object");
				assert.equal(oCondition.operator, "EEQ", "Operator");
				assert.ok(Array.isArray(oCondition.values), "values are arry");
				assert.equal(oCondition.values.length, 2, "Values length");
				assert.equal(oCondition.values[0], "I3", "Values entry0");
				assert.equal(oCondition.values[1], "Item3", "Values entry1");
				assert.notOk(oCondition.inParameters, "no in-parameters returned");
				assert.notOk(oCondition.outParameters, "no out-parameters returned");
				fnDone();
			}).catch(function(oError) {
				assert.notOk(true, "Promise Catch must not be called");
				fnDone();
			});
		}).catch(function(oError) {
			assert.notOk(true, "Promise Catch must not be called");
			fnDone();
		});

	});

	QUnit.test("Parsing: description -> key (from help) with error Async", function(assert) {

		oFieldHelp.getKeyForText.restore();
		var oStub = sinon.stub(oFieldHelp, "getKeyForText");

		oStub.callsFake(function(sText) {
			var oPromise = new Promise(function(fResolve, fReject) {
				var oException;
				if (sText === "Item2") {
					oException = new ParseException("Cannot parse value " + sText);
				} else {
					oException = new ParseException("not Unique " + sText);
					oException._bNotUnique = true;
				}
				throw oException;
			});
			return oPromise;
		});

		var vResult = oConditionType.parseValue("Item2");
		assert.ok(vResult instanceof Promise, "Promise returned");

		var fnDone = assert.async();
		vResult.then(function(oCondition) {
			assert.notOk(true, "Promise Then must not be called");
			fnDone();
		}).catch(function(oError) {
			assert.ok(oError, "Error Fired");
			assert.ok(oError instanceof ParseException, "Error is a ParseException");
			assert.equal(oError.message, "Cannot parse value Item2", "Error message");

			vResult = oConditionType.parseValue("Item3");
			assert.ok(vResult instanceof Promise, "Promise returned");

			vResult.then(function(oCondition) {
				assert.notOk(true, "Promise Then must not be called");
				fnDone();
			}).catch(function(oError) {
				assert.ok(oError, "Error Fired");
				assert.ok(oError instanceof ParseException, "Error is a ParseException");
				assert.equal(oError.message, "not Unique Item3", "Error message");

				oFieldHelp.setValidateInput(false);
				vResult = oConditionType.parseValue("Item2");
				assert.ok(vResult instanceof Promise, "Promise returned");

				vResult.then(function(oCondition) {
					assert.ok(true, "Promise Then must be called");
					assert.equal(typeof oCondition, "object", "Result is object");
					assert.equal(oCondition.operator, "EEQ", "Operator");
					assert.ok(Array.isArray(oCondition.values), "values are arry");
					assert.equal(oCondition.values.length, 1, "Values length");
					assert.equal(oCondition.values[0], "Item2", "Values entry0");

					vResult = oConditionType.parseValue("Item3");
					assert.ok(vResult instanceof Promise, "Promise returned");

					vResult.then(function(oCondition) {
						assert.ok(true, "Promise Then must be called");
						assert.equal(typeof oCondition, "object", "Result is object");
						assert.equal(oCondition.operator, "EEQ", "Operator");
						assert.ok(Array.isArray(oCondition.values), "values are arry");
						assert.equal(oCondition.values.length, 1, "Values length");
						assert.equal(oCondition.values[0], "Item3", "Values entry0");

						oConditionType.oFormatOptions.operators = []; // fake setting directly
						vResult = oConditionType.parseValue("==Item2");
						assert.ok(vResult instanceof Promise, "Promise returned");

						vResult.then(function(oCondition) {
							assert.ok(true, "Promise Then must be called");
							assert.equal(typeof oCondition, "object", "Result is object");
							assert.equal(oCondition.operator, "EEQ", "Operator");
							assert.ok(Array.isArray(oCondition.values), "values are arry");
							assert.equal(oCondition.values.length, 1, "Values length");
							assert.equal(oCondition.values[0], "Item2", "Values entry0");
							fnDone();
						}).catch(function(oError) {
							assert.notOk(true, "Promise must not fail");
							fnDone();
						});
					}).catch(function(oError) {
						assert.notOk(true, "Promise must not fail");
						fnDone();
					});
				}).catch(function(oError) {
					assert.notOk(true, "Promise must not fail");
					fnDone();
				});
			});
		});

	});

	QUnit.test("Parsing: description -> key (from help) with default Operator Async", function(assert) {

		oConditionType.oFormatOptions.operators = []; // fake setting directly
		oFieldHelp.getKeyForText.restore();
		var oStub = sinon.stub(oFieldHelp, "getKeyForText");

		oStub.callsFake(function(sText) {
			var oPromise = new Promise(function(fResolve, fReject) {
				throw new ParseException("Cannot parse value " + sText);
			});
			return oPromise;
		});

		var vResult = oConditionType.parseValue("Item2");
		assert.ok(vResult instanceof Promise, "Promise returned");

		var fnDone = assert.async();
		vResult.then(function(oCondition) {
			assert.ok(oCondition, "Result returned");
			assert.equal(typeof oCondition, "object", "Result is object");
			assert.equal(oCondition.operator, "Contains", "Operator");
			assert.ok(Array.isArray(oCondition.values), "values are arry");
			assert.equal(oCondition.values.length, 1, "Values length");
			assert.equal(oCondition.values[0], "Item2", "Values entry1");
			fnDone();
		}).catch(function(oError) {
			assert.notOk(true, "Promise Catch must not be called");
			fnDone();
		});

	});

	QUnit.test("Parsing: description (key entered) -> key (from help) Async", function(assert) {

		oConditionType.oFormatOptions.display = "Description"; // fake setting directly
		oFieldHelp.getKeyForText.restore();
		var oStub = sinon.stub(oFieldHelp, "getKeyForText");

		oStub.callsFake(function(sText) {
			var oPromise = new Promise(function(fResolve, fReject) {
				throw new ParseException("Cannot parse value " + sText);
			});
			return oPromise;
		});

		oFieldHelp.getTextForKey.restore();
		oStub = sinon.stub(oFieldHelp, "getTextForKey");

		oStub.callsFake(function(vKey) {
			var oPromise = new Promise(function(fResolve, fReject) {
				setTimeout(function () { // simulate request
					switch (vKey) {
					case "I1":
						fResolve("Item1");
						break;

					case "I2":
						fResolve("Item2");
						break;

					case "I3":
						fResolve("Item3");
						break;

					default:
						fReject(new ParseException("Cannot parse value " + vKey));
					}
				}, 0);
			});
			return oPromise;
		});

		var vResult = oConditionType.parseValue("I2");
		assert.ok(vResult instanceof Promise, "Promise returned");

		var fnDone = assert.async();
		vResult.then(function(oCondition) {
			assert.ok(oCondition, "Result returned");
			assert.equal(typeof oCondition, "object", "Result is object");
			assert.equal(oCondition.operator, "EEQ", "Operator");
			assert.ok(Array.isArray(oCondition.values), "values are arry");
			assert.equal(oCondition.values.length, 2, "Values length");
			assert.equal(oCondition.values[0], "I2", "Values entry0");
			assert.equal(oCondition.values[1], "Item2", "Values entry1");

			vResult = oConditionType.parseValue("X");
			assert.ok(vResult instanceof Promise, "Promise returned");
			vResult.then(function(oCondition) {
				assert.notOk(true, "Promise Then must not be called");
				fnDone();
			}).catch(function(oError) {
				assert.ok(oError, "Error Fired");
				assert.ok(oError instanceof ParseException, "Error is a ParseException");
				assert.equal(oError.message, "Cannot parse value X", "Error message");

				oConditionType.oFormatOptions.operators = []; // fake setting directly
				vResult = oConditionType.parseValue("X");
				assert.ok(vResult instanceof Promise, "Promise returned");
				vResult.then(function(oCondition) {
					assert.ok(oCondition, "Result returned");
					assert.equal(typeof oCondition, "object", "Result is object");
					assert.equal(oCondition.operator, "Contains", "Operator");
					assert.ok(Array.isArray(oCondition.values), "values are arry");
					assert.equal(oCondition.values.length, 1, "Values length");
					assert.equal(oCondition.values[0], "X", "Values entry1");
					fnDone();
				}).catch(function(oError) {
					assert.notOk(true, "Promise Catch must not be called");
					fnDone();
				});
			});
		}).catch(function(oError) {
			assert.notOk(true, "Promise Catch must not be called");
			fnDone();
		});

	});

	QUnit.test("Parsing: value only -> validation from help Async", function(assert) {

		oConditionType.oFormatOptions.display = "Value"; // fake setting directly
		oFieldHelp.getTextForKey.restore();
		var oStub = sinon.stub(oFieldHelp, "getTextForKey");

		oStub.callsFake(function(vKey) {
			var oPromise = new Promise(function(fResolve, fReject) {
				throw new ParseException("Cannot parse value " + vKey);
			});
			return oPromise;
		});

		var vResult = oConditionType.parseValue("Item2");
		assert.ok(vResult instanceof Promise, "Promise returned");

		var fnDone = assert.async();
		vResult.then(function(oCondition) {
			assert.notOk(true, "Promise Then must not be called");
			fnDone();
		}).catch(function(oError) {
			assert.ok(oError, "Error Fired");
			assert.ok(oError instanceof ParseException, "Error is a ParseException");
			assert.equal(oError.message, "Cannot parse value Item2", "Error message");

			oConditionType.oFormatOptions.operators = []; // fake setting directly
			vResult = oConditionType.parseValue("Item2");
			vResult.then(function(oCondition) {
				assert.ok(oCondition, "Result returned");
				assert.equal(typeof oCondition, "object", "Result is object");
				assert.equal(oCondition.operator, "Contains", "Operator");
				assert.ok(Array.isArray(oCondition.values), "values are arry");
				assert.equal(oCondition.values.length, 1, "Values length");
				assert.equal(oCondition.values[0], "Item2", "Values entry1");
				assert.notOk(oCondition.values[1], "Values no entry2");

				oConditionType.oFormatOptions.operators = ["EEQ"]; // fake setting directly
				oFieldHelp.setValidateInput(false);
				vResult = oConditionType.parseValue("Item2");
				vResult.then(function(oCondition) {
					assert.ok(oCondition, "Result returned");
					assert.equal(typeof oCondition, "object", "Result is object");
					assert.equal(oCondition.operator, "EEQ", "Operator");
					assert.ok(Array.isArray(oCondition.values), "values are arry");
					assert.equal(oCondition.values.length, 1, "Values length");
					assert.equal(oCondition.values[0], "Item2", "Values entry1");
					assert.notOk(oCondition.values[1], "Values no entry2");
					fnDone();
				}).catch(function(oError) {
					assert.notOk(true, "Promise Catch must not be called");
					fnDone();
				});
			}).catch(function(oError) {
				assert.notOk(true, "Promise Catch must not be called");
				fnDone();
			});
		});

	});

	QUnit.test("Parsing: empty string -> key and description", function(assert) {

		oFieldHelp.getTextForKey.withArgs("").returns("Empty");
		oFieldHelp.getKeyForText.withArgs("Empty").returns("");

		var oCondition = oConditionType.parseValue("");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "", "Values entry0");
		assert.equal(oCondition.values[1], "Empty", "Values entry1");

	});

	QUnit.test("Parsing: empty string -> key only", function(assert) {

		oConditionType.oFormatOptions.display = "Value"; // fake setting directly
		oFieldHelp.getTextForKey.withArgs("").returns("Empty");
		oFieldHelp.getKeyForText.withArgs("Empty").returns("");

		var oCondition = oConditionType.parseValue("");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0], "", "Values entry0");
		assert.equal(oCondition.values[1], "Empty", "Values entry1");

		var oType = new StringType(); // use odata-String type to parse "" to null -> so "" cannot be a value for typing
		oConditionType.oFormatOptions.valueType = oType; // fake setting directly

		oCondition = oConditionType.parseValue("");
		assert.notOk(oCondition, "no result returned");

		oType.destroy();

	});

	QUnit.test("Parsing: empty string -> key and description (Async)", function(assert) {

		var vResult = oConditionType.parseValue("");
		assert.equal(vResult, null, "null returned");

		oFieldHelp.getTextForKey.restore();
		var oStub = sinon.stub(oFieldHelp, "getTextForKey");
		var bExist = true;

		oStub.callsFake(function(vKey) {
			var oPromise = new Promise(function(fResolve, fReject) {
				setTimeout(function () { // simulate request
					switch (vKey) {
					case "":
						if (bExist) {
							fResolve({key: "", description: "Empty"});
						} else {
							fResolve(null);
						}
						break;

					default:
						fReject(new ParseException("Cannot parse value " + vKey));
					}
				}, 0);
			});
			return oPromise;
		});

		var fnDone = assert.async();
		vResult = oConditionType.parseValue("");
		assert.ok(vResult instanceof Promise, "Promise returned");
		vResult.then(function(oCondition) {
			assert.ok(oCondition, "Result returned");
			assert.equal(typeof oCondition, "object", "Result is object");
			assert.equal(oCondition.operator, "EEQ", "Operator");
			assert.ok(Array.isArray(oCondition.values), "values are arry");
			assert.equal(oCondition.values.length, 2, "Values length");
			assert.equal(oCondition.values[0], "", "Values entry1");
			assert.equal(oCondition.values[1], "Empty", "Values no entry2");

			bExist = false;
			vResult = oConditionType.parseValue("");
			assert.ok(vResult instanceof Promise, "Promise returned");
			vResult.then(function(oCondition) {
				assert.equal(oCondition, null, "null returned");
				fnDone();
			}).catch(function(oError) {
				assert.notOk(true, "Promise Catch must not be called");
				fnDone();
			});
		}).catch(function(oError) {
			assert.notOk(true, "Promise Catch must not be called");
			fnDone();
		});

	});

	QUnit.test("Parsing: empty string -> key only (Async)", function(assert) {

		oConditionType.oFormatOptions.display = "Value"; // fake setting directly
		var vResult = oConditionType.parseValue("");
		assert.equal(vResult, null, "null returned");

		oFieldHelp.getTextForKey.restore();
		var oStub = sinon.stub(oFieldHelp, "getTextForKey");
		var bExist = true;

		oStub.callsFake(function(vKey) {
			var oPromise = new Promise(function(fResolve, fReject) {
				setTimeout(function () { // simulate request
					switch (vKey) {
					case "":
						if (bExist) {
							fResolve({key: "", description: "Empty"});
						} else {
							fResolve(null);
						}
						break;

					default:
						fReject(new ParseException("Cannot parse value " + vKey));
					}
				}, 0);
			});
			return oPromise;
		});

		var fnDone = assert.async();
		vResult = oConditionType.parseValue("");
		assert.ok(vResult instanceof Promise, "Promise returned");
		vResult.then(function(oCondition) {
			assert.ok(oCondition, "Result returned");
			assert.equal(typeof oCondition, "object", "Result is object");
			assert.equal(oCondition.operator, "EEQ", "Operator");
			assert.ok(Array.isArray(oCondition.values), "values are arry");
			assert.equal(oCondition.values.length, 2, "Values length");
			assert.equal(oCondition.values[0], "", "Values entry1");
			assert.equal(oCondition.values[1], "Empty", "Values no entry2");

			bExist = false;
			vResult = oConditionType.parseValue("");
			assert.ok(vResult instanceof Promise, "Promise returned");
			vResult.then(function(oCondition) {
				assert.equal(oCondition, null, "null returned");
				fnDone();
			}).catch(function(oError) {
				assert.notOk(true, "Promise Catch must not be called");
				fnDone();
			});
		}).catch(function(oError) {
			assert.notOk(true, "Promise Catch must not be called");
			fnDone();
		});

	});

	QUnit.test("Parsing: unsing condition from navigation", function(assert) {

		var oNavigateCondition = Condition.createCondition("EEQ", ["I3", "Item3"], {testIn: "A"}, {testOut: "B"});
		oConditionType.oFormatOptions.navigateCondition = oNavigateCondition; // fake setting directly

		var vResult = oConditionType.parseValue("Item3");
		assert.deepEqual(vResult, oNavigateCondition, "navigationCondition returned");

		vResult = oConditionType.parseValue("Item1");
		assert.notDeepEqual(vResult, oNavigateCondition, "navigationCondition not returned");

	});

	var oUnitConditionType;

	QUnit.module("Currency type", {
		beforeEach: function() {
			oValueType = new CurrencyType({showMeasure: false});
			oConditionType = new ConditionType({valueType: oValueType, operators: ["EEQ"], delegate: FieldBaseDelegate});
			oUnitConditionType = new ConditionType({isUnit: true, operators: ["EEQ"], hideOperator: true, originalDateType: oValueType, delegate: FieldBaseDelegate});
		},
		afterEach: function() {
			oConditionType.destroy();
			oConditionType = undefined;
			oValueType.destroy();
			oValueType = undefined;
			oUnitConditionType.destroy();
			oUnitConditionType = undefined;
		}
	});

	QUnit.test("Formatting: EEQ - Currency", function(assert) {

		var oType = new CurrencyType({showMeasure: false});
		var sValue = oType.formatValue([123.45, "USD"], "string"); // because of special whitspace and local dependend
		var oCondition = Condition.createCondition("EEQ", [[123.45, "USD"]]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, sValue, "Result of number formatting");
		sResult = oUnitConditionType.formatValue(oCondition);
		assert.equal(sResult, "USD", "Result of unit formatting");

	});

	QUnit.test("Formatting: BT - Currency", function(assert) {

		oConditionType.oFormatOptions.operators = []; // fake setting directly
		var oType = new CurrencyType({showMeasure: false});
		var sValue1 = oType.formatValue([1, "USD"], "string"); // because of special whitspace and local dependend
		var sValue2 = oType.formatValue([2, "USD"], "string"); // because of special whitspace and local dependend
		var oCondition = Condition.createCondition("BT", [[1, "USD"], [2, "USD"]]);
		var sResult = oConditionType.formatValue(oCondition);
		assert.equal(sResult, sValue1 + "..." + sValue2, "Result of number formatting");
		sResult = oUnitConditionType.formatValue(oCondition);
		assert.equal(sResult, "USD", "Result of unit formatting");

	});

	QUnit.test("Formatting: invalid condition", function(assert) {

		var oException;
		var oCondition = Condition.createCondition("EEQ", ["X"]);

		try {
			oConditionType.formatValue(oCondition);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

	});

	QUnit.test("Parsing: with unit", function(assert) {

		sinon.spy(oValueType, "parseValue");
		sinon.stub(oValueType, "getParseWithValues").returns(true); // fake parseWithValue

		var oCondition = oConditionType.parseValue("1.23");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0].length, 2, "Values0 length");
		assert.equal(oCondition.values[0][0], 1.23, "Values entry0");
		assert.deepEqual(oCondition.values[0][1], null, "Values entry1"); // deepEqual to distinguish between null and undefined
		assert.ok(oValueType.parseValue.calledWith("1.23", "string", []), "parseValue of type called with currentValue");

		oCondition = oUnitConditionType.parseValue("USD");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0].length, 2, "Values0 length");
		assert.equal(oCondition.values[0][0], 1.23, "Values entry0");
		assert.equal(oCondition.values[0][1], "USD", "Values entry1");

		oCondition = oConditionType.parseValue("123.45");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0].length, 2, "Values0 length");
		assert.equal(oCondition.values[0][0], 123.45, "Values entry0");
		assert.equal(oCondition.values[0][1], "USD", "Values entry1"); // as last entry used from type
		assert.ok(oValueType.parseValue.calledWith("123.45", "string", [1.23, "USD"]), "parseValue of type called with currentValue");

		oConditionType.oFormatOptions.operators = []; // fake setting directly
		oCondition = oConditionType.parseValue("1...2");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "BT", "Operator");
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0].length, 2, "Values0 length");
		assert.equal(oCondition.values[0][0], 1, "Values0 entry0");
		assert.equal(oCondition.values[0][1], "USD", "Values0 entry1"); // as last entry used from type
		assert.equal(oCondition.values[1][0], 2, "Values1 entry0");
		assert.equal(oCondition.values[1][1], "USD", "Values1 entry1"); // as last entry used from type

		oCondition = oUnitConditionType.parseValue("");
		assert.ok(oCondition, "Result returned");
		assert.equal(typeof oCondition, "object", "Result is object");
		assert.equal(oCondition.operator, "EEQ", "Operator"); // as it don't have the old condition just the old value
		assert.ok(Array.isArray(oCondition.values), "values are arry");
		assert.equal(oCondition.values.length, 2, "Values length");
		assert.equal(oCondition.values[0].length, 2, "Values0 length");
		assert.equal(oCondition.values[0][0], 1, "Values entry0");
		assert.equal(oCondition.values[0][1], null, "Values entry1");

	});

	QUnit.test("Validation: with unit", function(assert) {

		var oUnitType = new StringType(); // just fake a type for spy. (not needed to test the type)
		oUnitConditionType.oFormatOptions.valueType = oUnitType; // fake setting directly

		sinon.spy(oValueType, "validateValue");
		sinon.spy(oUnitType, "validateValue");

		var oCondition = Condition.createCondition("EEQ", [[123.45, "USD"]]);
		oConditionType.validateValue(oCondition);

		assert.ok(oValueType.validateValue.calledWith([123.45, "USD"]), "Currency type used for validation");

		oUnitConditionType.validateValue(oCondition);
		assert.ok(oValueType.validateValue.calledOnce, "Currency type not used for unit validation");
		assert.ok(oUnitType.validateValue.calledWith("USD"), "String type used for validation");

		oUnitType.destroy();

	});

	QUnit.module("Not nullable type", {
		beforeEach: function() {
			oValueType = new StringType({}, {nullable: false});
			oConditionType = new ConditionType({valueType: oValueType, fieldPath: "X", operators: ["EEQ"]});
		},
		afterEach: function() {
			oConditionType.destroy();
			oConditionType = undefined;
			oValueType.destroy();
			oValueType = undefined;
		}
	});

	QUnit.test("Validating: null", function(assert) {

		var oException;

		try {
			oConditionType.validateValue(null);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

	});

	QUnit.module("Not nullable type with parseKeepsEmptyString", {
		beforeEach: function() {
			oValueType = new StringType({parseKeepsEmptyString: true}, {nullable: false});
			oConditionType = new ConditionType({valueType: oValueType, fieldPath: "X", operators: ["EEQ"]});
		},
		afterEach: function() {
			oConditionType.destroy();
			oConditionType = undefined;
			oValueType.destroy();
			oValueType = undefined;
		}
	});

	QUnit.test("Validating: null", function(assert) {

		var oException;

		try {
			oConditionType.validateValue(null);
		} catch (e) {
			oException = e;
		}

		assert.notOk(oException, "no exception fired");

	});

});
