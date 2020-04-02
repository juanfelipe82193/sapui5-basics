/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/* global QUnit */
/*eslint no-warning-comments: 0 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/mdc/condition/FilterOperatorUtil",
	"sap/ui/mdc/condition/Operator",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/mdc/util/BaseType",
	"sap/ui/model/Filter",
	"sap/ui/model/type/Integer"
], function(
	jQuery,
	FilterOperatorUtil,
	Operator,
	Condition,
	BaseType,
	Filter,
	IntegerType
) {
	"use strict";

	QUnit.module("Operator", {
		beforeEach: function() {

		},

		afterEach: function() {}
	});

	QUnit.test("createOperator", function(assert) {

		var _getModelFilter = function(oCondition, sFieldPath, aOperators) {
			return new Filter({ path: sFieldPath, operator: "EQ", value1: new Date().getFullYear() });
		};
		var oOperator = new Operator({
			name: "THISYEAR",
			valueTypes: [],
			getModelFilter: _getModelFilter
		});

		assert.equal(oOperator.name, "THISYEAR", "Name set");
		assert.ok(oOperator.format, "Format function set by default");
		assert.ok(oOperator.parse, "Parse function set by default");
		assert.ok(oOperator.validate, "Validate function set by default");
		assert.equal(oOperator.getModelFilter, _getModelFilter, "GetModelFilter not default");

		// invalid operator
		oOperator = undefined;
		var oError;
		try {
			oOperator = new Operator({
				name: "INVALID",
				valueTypes: []
			});
		} catch (myError) {
			oError = myError;
		}

		assert.notOk(oOperator, "no invalid operator created");
		assert.ok(oError, "Error thrown");

	});

	QUnit.module("FilterOperatorUtil", {
		beforeEach: function() {

		},

		afterEach: function() {}
	});

	QUnit.test("default operator creation", function(assert) {

		assert.ok(FilterOperatorUtil._mOperators, "standard operators created");
		assert.ok(FilterOperatorUtil._mOperators.strictEqual, "standard EEQ operator created");
		assert.ok(FilterOperatorUtil._mOperators.equal, "standard EQ operator created");
		assert.ok(FilterOperatorUtil._mOperators.between, "standard BT operator created");
		assert.ok(FilterOperatorUtil._mOperators.lowerThan, "standard LT operator created");
		assert.ok(FilterOperatorUtil._mOperators.greaterThan, "standard GT operator created");
		assert.ok(FilterOperatorUtil._mOperators.lessEqual, "standard LE operator created");
		assert.ok(FilterOperatorUtil._mOperators.greaterEqual, "standard GE operator created");
		assert.ok(FilterOperatorUtil._mOperators.startsWith, "standard StartsWith operator created");
		assert.ok(FilterOperatorUtil._mOperators.endsWith, "standard EndsWith operator created");
		assert.ok(FilterOperatorUtil._mOperators.contains, "standard Contains operator created");
		assert.ok(FilterOperatorUtil._mOperators.notEqual, "standard NE operator created");
		assert.ok(FilterOperatorUtil._mOperators.empty, "standard Empty operator created");
		assert.ok(FilterOperatorUtil._mOperators.notEmpty, "standard NotEmpty operator created");

	});

	QUnit.test("getOperatorsForType", function(assert) {

		assert.equal(FilterOperatorUtil.getOperatorsForType(BaseType.String).length, 21, "Default operators for String");
		assert.equal(FilterOperatorUtil.getOperatorsForType(BaseType.Date).length, 13, "Default operators for date");
		assert.equal(FilterOperatorUtil.getOperatorsForType(BaseType.DateTime).length, 13, "Default operators for datetime");
		assert.equal(FilterOperatorUtil.getOperatorsForType(BaseType.Time).length, 13, "Default operators for time");
		assert.equal(FilterOperatorUtil.getOperatorsForType(BaseType.Numeric).length, 13, "Default operators for numeric");
		assert.equal(FilterOperatorUtil.getOperatorsForType(BaseType.Boolean).length, 3, "Default operators for boolean");

		// TODO, test what operators are returned

	});

	QUnit.test("getOperator", function(assert) {

		var oOperator = FilterOperatorUtil.getOperator("EEQ");
		assert.ok(oOperator, "Operator returned");
		assert.equal(oOperator.name, "EEQ", "EEQ operator returned");

	});

	QUnit.test("Checks for Default Configuration", function(assert) {

		// get all standard Operators and add custom operator
		FilterOperatorUtil.addOperator(new Operator({
			name: "THISYEAR",
			valueTypes: [],
			getModelFilter: function(oCondition, sFieldPath, aOperators) {
				return new Filter({ path: sFieldPath, operator: "EQ", value1: new Date().getFullYear() });
			}
		}));

		var aOperators = [];
		for (var sName in FilterOperatorUtil._mOperators) {
			aOperators.push(FilterOperatorUtil._mOperators[sName]);
		}

		var oType = new IntegerType({}, {maximum: 3});

		var aFormatTest = {
				"EEQ": [{
					formatArgs: [["Test", "desc"]],
					formatValue: "desc (Test)",
					parseArgs: ["==Test"],
					parsedValue: "Test",
					condition: Condition.createCondition("EEQ", [undefined, "Test"]),
					isEmpty: true,
					valid: true
				},
				{
					formatArgs: [["Test", "desc"], undefined, undefined, "Value"],
					formatValue: "Test",
					parseArgs: ["==Test", undefined, "Value"],
					parsedValue: "Test",
					condition: Condition.createCondition("EEQ", ["Test", undefined]),
					isEmpty: false,
					valid: true,
					filter: {path: "test", operator: "EQ", value1: "Test"}
				},
				{
					formatArgs: [["Test", "desc"], undefined, undefined, "Description"],
					formatValue: "desc",
					parseArgs: ["==desc", undefined, "Description"],
					parsedValue: "desc",
					condition: Condition.createCondition("EEQ", [undefined, "desc"]),
					isEmpty: true,
					valid: true
				},
				{
					formatArgs: [["Test", "desc"], undefined, undefined, "ValueDescription"],
					formatValue: "Test (desc)",
					parseArgs: ["==Test", undefined, "ValueDescription"],
					parsedValue: "Test",
					condition: Condition.createCondition("EEQ", ["Test", undefined]),
					isEmpty: false,
					valid: true
				},
				{
					formatArgs: [[5, "desc"], undefined, oType, "ValueDescription"],
					formatValue: "5 (desc)",
					parseArgs: ["==5", oType, "ValueDescription"],
					parsedValue: "5",
					condition: Condition.createCondition("EEQ", [5, undefined]),
					isEmpty: false,
					valid: false,
					type: oType
				},
				{
					formatArgs: [[1, "desc"], undefined, oType, "ValueDescription"],
					formatValue: "1 (desc)",
					parseArgs: ["==A", oType, "ValueDescription"],
					parsedValue: "",
					condition: Condition.createCondition("EEQ", [undefined, undefined]),
					exception: true,
					isEmpty: true,
					valid: false,
					type: oType
				},
				{
					formatArgs: [["Test", "desc"], undefined, undefined, "ValueDescription"],
					formatValue: "Test (desc)",
					parseArgs: ["==Test (desc)", undefined, "ValueDescription"],
					parsedValue: "Testdesc",
					condition: Condition.createCondition("EEQ", ["Test", "desc"]),
					isEmpty: false,
					valid: true
				},
				{
					formatArgs: [[null, "desc"], undefined, undefined, "ValueDescription"],
					formatValue: " (desc)",
					parseArgs: ["==", undefined, "ValueDescription"],
					parsedValue: "",
					condition: Condition.createCondition("EEQ", ["", undefined]),
					isEmpty: true,
					valid: true
				},
				{
					formatArgs: [["Test"], undefined, undefined, "ValueDescription"],
					formatValue: "Test",
					parseArgs: ["==Test", undefined, "ValueDescription"],
					parsedValue: "Test",
					condition: Condition.createCondition("EEQ", ["Test", undefined]),
					isEmpty: false,
					valid: true
				}
				],
				"EQ": [{
						formatArgs: [["Test"]],
						formatValue: "=Test",
						parsedValue: "Test",
						condition: Condition.createCondition("EQ", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["="]],
						formatValue: "==",
						parsedValue: undefined,
						isEmpty: true,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "=a",
						parsedValue: "a",
						condition: Condition.createCondition("EQ", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"NE": [{
						formatArgs: [["Test"]],
						formatValue: "!(=Test)",
						parseArgs: ["!=Test"],
						parsedValue: "Test",
						condition: Condition.createCondition("NE", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["="]],
						formatValue: "!(==)",
						parsedValue: undefined,
						isEmpty: true,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(=a)",
						parseArgs: ["!=a"],
						parsedValue: "a",
						condition: Condition.createCondition("NE", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"LT": [{
						formatArgs: [["Test"]],
						formatValue: "<Test",
						parsedValue: "Test",
						condition: Condition.createCondition("LT", ["Test"]),
						isEmpty: false,
						valid: true,
						filter: {path: "test", operator: "LT", value1: "Test"}
					},
					{
						formatArgs: [["<"]],
						formatValue: "<<",
						parsedValue: "<",
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "<a",
						parsedValue: "a",
						condition: Condition.createCondition("LT", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"NOTLT": [{
						formatArgs: [["Test"]],
						formatValue: "!(<Test)",
						parseArgs: ["!<Test"],
						parsedValue: "Test",
						condition: Condition.createCondition("NOTLT", ["Test"]),
						isEmpty: false,
						valid: true,
						filter: {path: "test", operator: "GE", value1: "Test"}
					},
					{
						formatArgs: [["<"]],
						formatValue: "!(<<)",
						parseArgs: ["!<<"],
						parsedValue: "<",
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(<a)",
						parseArgs: ["!<a"],
						parsedValue: "a",
						condition: Condition.createCondition("NOTLT", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"GT": [{
						formatArgs: [["Test"]],
						formatValue: ">Test",
						parsedValue: "Test",
						condition: Condition.createCondition("GT", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [[">"]],
						formatValue: ">>",
						parsedValue: ">",
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: ">a",
						parsedValue: "a",
						condition: Condition.createCondition("GT", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"NOTGT": [{
						formatArgs: [["Test"]],
						formatValue: "!(>Test)",
						parseArgs: ["!>Test"],
						parsedValue: "Test",
						condition: Condition.createCondition("NOTGT", ["Test"]),
						isEmpty: false,
						valid: true,
						filter: {path: "test", operator: "LE", value1: "Test"}
					},
					{
						formatArgs: [[">"]],
						formatValue: "!(>>)",
						parseArgs: ["!>>"],
						parsedValue: ">",
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(>a)",
						parseArgs: ["!>a"],
						parsedValue: "a",
						condition: Condition.createCondition("NOTGT", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"LE": [{
						formatArgs: [["Test"]],
						formatValue: "<=Test",
						parsedValue: "Test",
						condition: Condition.createCondition("LE", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["<="]],
						formatValue: "<=<=",
						parsedValue: "<=",
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "<=a",
						parsedValue: "a",
						condition: Condition.createCondition("LE", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"NOTLE": [{
						formatArgs: [["Test"]],
						formatValue: "!(<=Test)",
						parseArgs: ["!<=Test"],
						parsedValue: "Test",
						condition: Condition.createCondition("NOTLE", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["<="]],
						formatValue: "!(<=<=)",
						parseArgs: ["!<=<="],
						parsedValue: "<=",
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(<=a)",
						parseArgs: ["!<=a"],
						parsedValue: "a",
						condition: Condition.createCondition("NOTLE", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"GE": [{
						formatArgs: [["Test"]],
						formatValue: ">=Test",
						parsedValue: "Test",
						condition: Condition.createCondition("GE", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [[">="]],
						formatValue: ">=>=",
						parsedValue: ">=",
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: ">=a",
						parsedValue: "a",
						condition: Condition.createCondition("GE", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"NOTGE": [{
						formatArgs: [["Test"]],
						formatValue: "!(>=Test)",
						parseArgs: ["!>=Test"],
						parsedValue: "Test",
						condition: Condition.createCondition("NOTGE", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [[">="]],
						formatValue: "!(>=>=)",
						parseArgs: ["!>=>="],
						parsedValue: ">=",
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(>=a)",
						parseArgs: ["!>=a"],
						parsedValue: "a",
						condition: Condition.createCondition("NOTGE", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"StartsWith": [{
						formatArgs: [["Test"]],
						formatValue: "Test*",
						parsedValue: "Test",
						condition: Condition.createCondition("StartsWith", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["*"]],
						formatValue: "**",
						parsedValue: undefined,
						isEmpty: true,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "a*",
						parsedValue: "a",
						condition: Condition.createCondition("StartsWith", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"NotStartsWith": [{
						formatArgs: [["Test"]],
						formatValue: "!(Test*)",
						parseArgs: ["!Test*"],
						parsedValue: "Test",
						condition: Condition.createCondition("NotStartsWith", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["*"]],
						formatValue: "!(**)",
						parsedValue: undefined,
						isEmpty: true,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(a*)",
						parseArgs: ["!a*"],
						parsedValue: "a",
						condition: Condition.createCondition("NotStartsWith", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"EndsWith": [{
						formatArgs: [["Test"]],
						formatValue: "*Test",
						parsedValue: "Test",
						condition: Condition.createCondition("EndsWith", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "*a",
						parsedValue: "a",
						condition: Condition.createCondition("EndsWith", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"NotEndsWith": [{
						formatArgs: [["Test"]],
						formatValue: "!(*Test)",
						parseArgs: ["!*Test"],
						parsedValue: "Test",
						condition: Condition.createCondition("NotEndsWith", ["Test"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(*a)",
						parseArgs: ["!*a"],
						parsedValue: "a",
						condition: Condition.createCondition("NotEndsWith", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"BT": [{
						formatArgs: [["Test1", "Test2"]],
						formatValue: "Test1...Test2",
						parsedValue: "Test1Test2",
						condition: Condition.createCondition("BT", ["Test1", "Test2"]),
						isEmpty: false,
						valid: true,
						filter: {path: "test", operator: "BT", value1: "Test1", value2: "Test2"}
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "a...b",
						parsedValue: "ab",
						condition: Condition.createCondition("BT", ["a", "b"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "a"]],
						formatValue: "a...a",
						parsedValue: "aa",
						condition: Condition.createCondition("BT", ["a", "a"]),
						isEmpty: false,
						valid: false
					},
					{
						formatArgs: [[null, "b"]],
						formatValue: "...b",
						parsedValue: undefined, //TODO: parse what can be formatted
						isEmpty: true,
						valid: true
					},
					{
						formatArgs: [["a"]],
						formatValue: "a...",
						parsedValue: undefined, //TODO: parse what can be formatted
						isEmpty: true,
						valid: false
					}
				],
				"NOTBT": [{
						formatArgs: [["Test1", "Test2"]],
						formatValue: "!(Test1...Test2)",
						parseArgs: ["!Test1...Test2"],
						parsedValue: "Test1Test2",
						condition: Condition.createCondition("NOTBT", ["Test1", "Test2"]),
						isEmpty: false,
						valid: true,
						filter: {path: "test", operator: "NB", value1: "Test1", value2: "Test2"}
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(a...b)",
						parseArgs: ["!a...b"],
						parsedValue: "ab",
						condition: Condition.createCondition("NOTBT", ["a", "b"]),
						isEmpty: false,
						valid: true
					},
					{
						formatArgs: [["a", "a"]],
						formatValue: "!(a...a)",
						parseArgs: ["!a...a"],
						parsedValue: "aa",
						condition: Condition.createCondition("NOTBT", ["a", "a"]),
						isEmpty: false,
						valid: false
					},
					{
						formatArgs: [[null, "b"]],
						formatValue: "!(...b)",
						parseArgs: ["!...b"],
						parsedValue: undefined, //TODO: parse what can be formatted
						isEmpty: true,
						valid: true
					},
					{
						formatArgs: [["a"]],
						formatValue: "!(a...)",
						parseArgs: ["!a..."],
						parsedValue: undefined, //TODO: parse what can be formatted
						isEmpty: true,
						valid: false
					}
				],
				"BTEX": [{
						formatArgs: [["Test1", "Test2"]],
						formatValue: "Test1..Test2",
						parsedValue: "Test1Test2",
						condition: Condition.createCondition("BTEX", ["Test1", "Test2"]),
						isEmpty: false,
						valid: true
						//filter: {path: "test", operator: "BT", value1: "Test1", value2: "Test2"}
					}
				],
				"NOTBTEX": [{
						formatArgs: [["Test1", "Test2"]],
						formatValue: "!(Test1..Test2)",
						parseArgs: ["!Test1..Test2"],
						parsedValue: "Test1Test2",
						condition: Condition.createCondition("NOTBTEX", ["Test1", "Test2"]),
						isEmpty: false,
						valid: true
						//filter: {path: "test", operator: "BT", value1: "Test1", value2: "Test2"}
					}
				],
				"Contains": [{
						formatArgs: [["Test"]],
						formatValue: "*Test*",
						parsedValue: "Test",
						condition: Condition.createCondition("Contains", ["Test"]),
						isEmpty: false,
						valid: true,
						filter:  {path: "test", operator: "Contains", value1: "Test"}
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "*a*",
						parsedValue: "a",
						condition: Condition.createCondition("Contains", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"NotContains": [{
						formatArgs: [["Test"]],
						formatValue: "!(*Test*)",
						parseArgs: ["!*Test*"],
						parsedValue: "Test",
						condition: Condition.createCondition("NotContains", ["Test"]),
						isEmpty: false,
						valid: true,
						filter:  {path: "test", operator: "NotContains", value1: "Test"}
					},
					{
						formatArgs: [["a", "b"]],
						formatValue: "!(*a*)",
						parseArgs: ["!*a*"],
						parsedValue: "a",
						condition: Condition.createCondition("NotContains", ["a"]),
						isEmpty: false,
						valid: true
					}
				],
				"Empty": [{
						formatArgs: [[]],
						formatValue: "<empty>",
						parsedValue: "", // empty array (which is the current return value), joined with space. Better check whether it matches  TODO
						isEmpty: false,
						valid: true,
						filter: {path: "test", operator: "EQ", value1: ""}
					}
				],
				"NotEmpty": [{
						formatArgs: [[]],
						formatValue: "!(<empty>)", // TODO: right text?
						parseArgs: ["!<empty>"],
						parsedValue: "", // empty array (which is the current return value), joined with space. Better check whether it matches  TODO
						isEmpty: false,
						valid: true,
						filter: {path: "test", operator: "NE", value1: ""}
					}
				],
				"THISYEAR": [{
						formatArgs: [["THISYEAR"]],
						formatValue: "this year",
						parsedValue: "", // empty array (which is the current return value), joined with space. Better check whether it matches  TODO
						isEmpty: false,
						valid: true,
						custom: true
					}
				]
			};
		//checking all above Operators for validity
		aOperators.forEach(function(oOperator) {
			var sOperator = oOperator.name;
			assert.ok(true, "--------------------   Checking Operator " + sOperator + "   -----------------------------------------");
			assert.strictEqual(oOperator.shortText !== "", true, "Operator " + sOperator + " has a valid shortText " + oOperator.shortText);
			assert.strictEqual(oOperator.longText !== "", true, "Operator " + sOperator + " has a valid longText " + oOperator.longText);
			assert.strictEqual(oOperator.tokenText !== "", true, "Operator " + sOperator + " has a valid tokenText " + oOperator.tokenText);
			assert.strictEqual(oOperator.tokenParse !== null, true, "Operator " + sOperator + " has a valid tokenParse " + oOperator.tokenParse);
			assert.strictEqual(oOperator.tokenFormat !== null, true, "Operator " + sOperator + " has a valid tokenFormat " + oOperator.tokenFormat);
			assert.strictEqual(oOperator.tokenParseRegExp !== null && oOperator.tokenParseRegExp instanceof RegExp, true, "Operator " + sOperator + " has a valid tokenParseRegExp " + oOperator.tokenParseRegExp);

			//check formatting and parsing of values
			if (aFormatTest[sOperator]) {
				for (var j = 0; j < aFormatTest[sOperator].length; j++) {
					var oTest = aFormatTest[sOperator][j];

					// EQ-Operator.format(["Test"]) --> "=Test"
					var sFormattedText = oOperator.format.apply(oOperator, oTest.formatArgs);
					assert.strictEqual(sFormattedText, oTest.formatValue, "Formatting: Operator " + sOperator + " has formated correctly from " + oTest.formatArgs.join() + " to " + oTest.formatValue);

					// EQ-Operator.parse("=Test") --> ["Test"]
					try {
						var aParseText = oOperator.parse.apply(oOperator, oTest.parseArgs || [sFormattedText]);
						if (oTest.parsedValue || oTest.parsedValue === "") {
							assert.strictEqual(aParseText.join(""), oTest.parsedValue, "Parsing: Operator " + sOperator + " has parsed correctly from " + oTest.formatValue + " to " + aParseText.join());
						}
					} catch (oException) {
						assert.ok(oTest.exception, "Exception fired in parsing");
					}

					// QE-Operator.getCondition("=Test") --> {operator: "EQ", values: ["Test"]]}
					try {
						var oCondition = oOperator.getCondition.apply(oOperator, oTest.parseArgs || [sFormattedText]);
						if (oTest.condition) {
							assert.deepEqual(oCondition, oTest.condition, "getCondition: Operator " + sOperator + " returns oCondition instance");

							// create the model filter instance of the condition
							//						var oFilter = oOperator.getModelFilter(oCondition);
						}
					} catch (oException) {
						assert.ok(oTest.exception, "Exception fired in parsing");
						oCondition = undefined; // to clear if exception occured.
					}

					if (oCondition) {
						var bIsEmpty = oOperator.isEmpty(oCondition);
						assert.equal(bIsEmpty, oTest.isEmpty, "isEmpty check");

						try {
							oOperator.validate(oCondition.values, oTest.type);
						} catch (oException) {
							assert.ok(!oTest.valid, "Exception fired in validation");
						}

						if (oTest.filter) {
							var oFilter = oOperator.getModelFilter(oCondition, "test", aOperators);
							assert.ok(oFilter, "Filter returned");
							assert.equal(oFilter.sPath, oTest.filter.path, "Filter path");
							assert.equal(oFilter.sOperator, oTest.filter.operator, "Filter operator");
							assert.equal(oFilter.oValue1, oTest.filter.value1, "Filter value1");
							assert.equal(oFilter.oValue2, oTest.filter.value2, "Filter value2");
						}
					}
				}
			} else {
				assert.ok(false, "qunit test missing for operator " + sOperator);
			}
		});
		oType.destroy();

	});

	QUnit.test("getMatchingOperators", function(assert) {

		var aAllOperators = FilterOperatorUtil.getOperatorsForType(BaseType.String);
		var aOperators = FilterOperatorUtil.getMatchingOperators(["X", "Y"]);
		assert.strictEqual(aOperators.length, 0, "invalid operators should not result in anything");

		aOperators = FilterOperatorUtil.getMatchingOperators(aAllOperators, "=true");
		var oExpected = FilterOperatorUtil.getOperator("EQ", aAllOperators);
		assert.strictEqual(aOperators.length, 1, "there should be one matching operator");
		assert.deepEqual(aOperators[0], oExpected, "'=true' should match the EQ operator");

		aOperators = FilterOperatorUtil.getMatchingOperators(aAllOperators, "=5");
		oExpected = FilterOperatorUtil.getOperator("EQ", aAllOperators);
		assert.strictEqual(aOperators.length, 1, "there should be one matching operator");
		assert.deepEqual(aOperators[0], oExpected, "'=5' should match the EQ operator");

		aOperators = FilterOperatorUtil.getMatchingOperators(aAllOperators, "*middle*");
		oExpected = FilterOperatorUtil.getOperator("Contains", aAllOperators);
		assert.strictEqual(aOperators.length, 1, "there should be one matching operator");
		assert.deepEqual(aOperators[0], oExpected, "'*middle*' should match the Contains operator");

	});

	QUnit.test("getDefaultOperatorForType", function(assert) {

		var oOperator = FilterOperatorUtil.getDefaultOperator(BaseType.String);
		assert.strictEqual(oOperator.name, "Contains", "Contains should be default operator for string type");

		oOperator = FilterOperatorUtil.getDefaultOperator(BaseType.DateTime);
		assert.strictEqual(oOperator.name, "EQ", "EQ should be default operator for sap.ui.model.odata.type.TimeOfDay type");

	});

});
