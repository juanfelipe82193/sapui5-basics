/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/* global QUnit */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/mdc/condition/ConditionConverter",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/model/type/String",
	"sap/ui/model/type/Date",
	"sap/ui/model/odata/type/Date",
	"sap/ui/model/odata/type/DateTime",
	"sap/ui/model/type/Time",
	"sap/ui/model/odata/type/Time",
	"sap/ui/model/odata/type/TimeOfDay",
	"sap/ui/model/type/Boolean",
	"sap/ui/model/odata/type/Boolean",
	"sap/ui/model/odata/type/Int16",
	"sap/ui/model/odata/type/Int64",
	"sap/ui/model/odata/type/Double",
	"sap/ui/model/odata/type/Decimal"
], function(
	jQuery,
	ConditionConverter,
	Condition,
	StringType,
	DateType,
	V4DateType,
	V2DateTimeType,
	TimeType,
	V2TimeType,
	V4TimeType,
	V2Boolean,
	V4Boolean,
	Int16,
	Int64,
	Double,
	Decimal
) {
	"use strict";

	function _testConvert(assert, bToString, oType, sOperator, aValuesIn, aValuesOut) {

		var oCondition = Condition.createCondition(sOperator, aValuesIn);
		var oResult;

		if (bToString) {
			oResult = ConditionConverter.toString(oCondition, oType);
		} else {
			oResult = ConditionConverter.toType(oCondition, oType);
		}

		assert.equal(typeof oResult, "object", "Object returned");
		assert.equal(oResult.operator, oCondition.operator, "operator");
		assert.ok(Array.isArray(oResult.values), "value array returned");
		assert.equal(oResult.values.length, aValuesOut.length, "expect number of values returned");
		for (var i = 0; i < aValuesOut.length; i++) {
			assert.deepEqual(oResult.values[i], aValuesOut[i], "stringified value" + i);
		}

		oType.destroy();

	}

	QUnit.module("toString", {
		beforeEach: function() {},

		afterEach: function() {}
	});

	QUnit.test("String", function(assert) {

		var oType = new StringType();
		_testConvert(assert, true, oType, "EQ", ["Test"], ["Test"]);

	});

	QUnit.test("Date", function(assert) {

		var oType = new DateType({style: "long"});
		_testConvert(assert, true, oType, "GT", [new Date(2019, 11, 11)], ["2019-12-11"]);

	});

	QUnit.test("V2-Date", function(assert) {

		var oType = new V2DateTimeType({style: "long"}, {displayFormat: "Date"});
		_testConvert(assert, true, oType, "BT", [new Date(Date.UTC(2019, 11, 11)), new Date(Date.UTC(2019, 11, 12))], ["2019-12-11", "2019-12-12"]);

	});

	QUnit.test("V4-Date", function(assert) {

		var oType = new V4DateType({style: "long"});
		_testConvert(assert, true, oType, "LT", ["2019-12-11"], ["2019-12-11"]);

	});

	QUnit.test("Time", function(assert) {

		var oType = new TimeType({style: "long"});
		_testConvert(assert, true, oType, "EQ", [new Date(2019, 11, 12, 19, 38, 30)], ["19:38:30"]);

	});

	QUnit.test("V2-Time", function(assert) {

		var oType = new V2TimeType({style: "long"});
		_testConvert(assert, true, oType, "EQ", [{__edmType: "Edm.Time", ms: 27510000}], ["07:38:30"]);

	});

	QUnit.test("V4Time", function(assert) {

		var oType = new V4TimeType({style: "long"});
		_testConvert(assert, true, oType, "EQ", ["07:38:30"], ["07:38:30"]);

	});

	QUnit.test("Boolean", function(assert) {

		var oType = new V2Boolean();
		_testConvert(assert, true, oType, "EEQ", [true, "Yes"], [true]);
		_testConvert(assert, true, oType, "EEQ", [false, "No"], [false]);

		_testConvert(assert, true, oType, "EQ", [true, "Yes"], [true, "Yes"]);
		_testConvert(assert, true, oType, "EQ", [false, "No"], [false, "No"]);

		oType = new V4Boolean();
		_testConvert(assert, true, oType, "EEQ", [true, "Yes"], [true]);
		_testConvert(assert, true, oType, "EEQ", [false, "No"], [false]);

		_testConvert(assert, true, oType, "EQ", [true, "Yes"], [true, "Yes"]);
		_testConvert(assert, true, oType, "EQ", [false, "No"], [false, "No"]);

	});

	QUnit.test("Int16", function(assert) {

		var oType = new Int16();
		_testConvert(assert, true, oType, "EQ", [1234], [1234]);

	});

	QUnit.test("Int64", function(assert) {

		var oType = new Int64();
		_testConvert(assert, true, oType, "EQ", ["12345678"], ["12345678"]);

	});

	QUnit.test("Double", function(assert) {

		var oType = new Double();
		_testConvert(assert, true, oType, "EQ", [123456.78], [123456.78]);

	});

	QUnit.test("Decimal", function(assert) {

		var oType = new Decimal();
		_testConvert(assert, true, oType, "EQ", ["123456.78"], ["123456.78"]);

	});

	QUnit.test("EEQ Operator", function(assert) {

		var oType = new StringType();
		_testConvert(assert, true, oType, "EEQ", ["id", "desc"], ["id"]);

	});



	QUnit.module("toType", {
		beforeEach: function() {},

		afterEach: function() {}
	});

	QUnit.test("String", function(assert) {

		var oType = new StringType();
		_testConvert(assert, false, oType, "EQ", ["Test"], ["Test"]);

	});

	QUnit.test("Date", function(assert) {

		var oType = new DateType({style: "long"});
		_testConvert(assert, false, oType, "GT", ["2019-12-11"], [new Date(2019, 11, 11)]);

	});

	QUnit.test("V2-Date", function(assert) {

		var oType = new V2DateTimeType({style: "long"}, {displayFormat: "Date"});
		_testConvert(assert, false, oType, "BT", ["2019-12-11", "2019-12-12"], [new Date(Date.UTC(2019, 11, 11)), new Date(Date.UTC(2019, 11, 12))]);

	});

	QUnit.test("V4-Date", function(assert) {

		var oType = new V4DateType({style: "long"});
		_testConvert(assert, false, oType, "LT", ["2019-12-11"], ["2019-12-11"]);

	});

	QUnit.test("Time", function(assert) {

		var oType = new TimeType({style: "long"});
		_testConvert(assert, false, oType, "EQ", ["19:38:30"], [new Date(1970, 0, 1, 19, 38, 30)]);

	});

	QUnit.test("V2Time", function(assert) {

		var oType = new V2TimeType({style: "long"});
		_testConvert(assert, false, oType, "EQ", ["07:38:30"], [{__edmType: "Edm.Time", ms: 27510000}]);

	});

	QUnit.test("V4Time", function(assert) {

		var oType = new V4TimeType({style: "long"});
		_testConvert(assert, false, oType, "EQ", ["07:38:30"], ["07:38:30"]);

	});

	QUnit.test("Boolean", function(assert) {

		var oType = new V2Boolean();
		_testConvert(assert, false, oType, "EQ", [true], [true]);
		_testConvert(assert, false, oType, "EQ", [false], [false]);

		oType = new V4Boolean();
		_testConvert(assert, false, oType, "EQ", [true], [true]);
		_testConvert(assert, false, oType, "EQ", [false], [false]);

	});

	QUnit.test("Int16", function(assert) {

		var oType = new Int16();
		_testConvert(assert, false, oType, "EQ", [123], [123]);

	});

	QUnit.test("Int64", function(assert) {

		var oType = new Int64();
		_testConvert(assert, false, oType, "EQ", ["12345678"], ["12345678"]);

	});

	QUnit.test("Double", function(assert) {

		var oType = new Double();
		_testConvert(assert, false, oType, "EQ", [123456.78], [123456.78]);

	});

	QUnit.test("Decimal", function(assert) {

		var oType = new Decimal();
		_testConvert(assert, false, oType, "EQ", ["123456.78"], ["123456.78"]);

	});


	QUnit.test("EEQ Operator", function(assert) {

		var oType = new StringType();
		_testConvert(assert, false, oType, "EEQ", ["id"], ["id"]);

	});

});
