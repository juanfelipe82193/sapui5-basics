/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/type/Interval",
	"sap/ui/model/type/Integer",
	"sap/ui/model/odata/type/Time"
	],
	function(
		Interval,
		IntegerType,
		TimeType
	) {
	"use strict";

	var oInterval;

	QUnit.module("Formatting", {
		beforeEach: function() {
			oInterval = new Interval();
		},
		afterEach: function() {
			oInterval.destroy();
			oInterval = undefined;
		}
	});

	QUnit.test("Strings", function(assert) {

		var sResult = oInterval.formatValue(["A", "Z"]);
		assert.equal(sResult, "A\u2013Z", "formatted interval");

	});

	QUnit.test("Strings with own delimitter", function(assert) {

		var oFormatOptions = {delimiter: ".."};
		oInterval.setFormatOptions(oFormatOptions);

		var sResult = oInterval.formatValue(["A", "Z"], "string");
		assert.equal(sResult, "A .. Z", "formatted interval");

	});

	QUnit.test("empty values", function(assert) {

		var sResult = oInterval.formatValue([null, null]);
		assert.equal(sResult, "", "formatted interval");

		sResult = oInterval.formatValue([null]);
		assert.equal(sResult, "", "formatted interval");

	});

	QUnit.test("Integer", function(assert) {

		var oType = new IntegerType();
		var oFormatOptions = {type: oType};
		oInterval.setFormatOptions(oFormatOptions);

		var sResult = oInterval.formatValue([1, 10], "string");
		assert.equal(sResult, "1\u201310", "formatted interval");

	});

	QUnit.test("Edm.Time", function(assert) {

		var oType = new TimeType();
		var oFormatOptions = {type: oType};
		oInterval.setFormatOptions(oFormatOptions);

		var oDate1 = {__edmType: "Edm.Time", ms: 27000000};
		var oDate2 = {__edmType: "Edm.Time", ms: 51300000};
		var sResult = oInterval.formatValue([oDate1, oDate2], "string");
		assert.equal(sResult, "7:30:00 AM \u2013 2:15:00 PM", "formatted interval");

		// fallback edm type is already used
		oDate1 = new Date(1970, 0, 1, 7, 30);
		oDate2 = new Date(1970, 0, 1, 14, 15);
		sResult = oInterval.formatValue([oDate1, oDate2], "string");
		assert.equal(sResult, "7:30:00 AM \u2013 2:15:00 PM", "formatted interval");

	});

	QUnit.test("Only one String", function(assert) {

		var sResult = oInterval.formatValue(["A"]);
		assert.equal(sResult, "A", "formatted interval");

		sResult = oInterval.formatValue(["Z", null]);
		assert.equal(sResult, "Z", "formatted interval");

	});

	QUnit.test("wrong input", function(assert) {

		var oException;
		var sResult;

		try {
			sResult = oInterval.formatValue("A", "string");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.notOk(sResult, "no result returned");

		oException = undefined;
		sResult = undefined;
		try {
			sResult = oInterval.formatValue([], "string");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.notOk(sResult, "no result returned");

		oException = undefined;
		sResult = undefined;
		try {
			sResult = oInterval.formatValue(["A", "B", "C"], "string");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.notOk(sResult, "no result returned");

	});

	QUnit.test("no input", function(assert) {

		var oException;
		var sResult;

		try {
			sResult = oInterval.formatValue();
		} catch (e) {
			oException = e;
		}

		assert.notOk(oException, "no exception fired");
		assert.notOk(sResult, "no result returned");

	});

	QUnit.test("wrong type", function(assert) {

		var oException;
		var sResult;

		try {
			sResult = oInterval.formatValue(["A", "Z"], "int");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.notOk(sResult, "no result returned");

	});

	QUnit.module("Parsing", {
		beforeEach: function() {
			oInterval = new Interval();
		},
		afterEach: function() {
			oInterval.destroy();
			oInterval = undefined;
		}
	});

	QUnit.test("String", function(assert) {

		var aResult = oInterval.parseValue("A\u2013Z", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], "A", "first value");
		assert.equal(aResult[1], "Z", "second value");

		aResult = undefined;
		aResult = oInterval.parseValue("A - Z", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], "A", "first value");
		assert.equal(aResult[1], "Z", "second value");

		aResult = undefined;
		aResult = oInterval.parseValue("A-Z", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], "A", "first value");
		assert.equal(aResult[1], "Z", "second value");

		aResult = undefined;
		aResult = oInterval.parseValue("\u2013Z");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], "", "first value");
		assert.equal(aResult[1], "Z", "second value");

	});

	QUnit.test("String without delimiter", function(assert) {

		var aResult = oInterval.parseValue("A");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 1 entries");
		assert.equal(aResult[0], "A", "first value");
		assert.equal(aResult[1], null, "second value");

	});

	QUnit.test("empty String", function(assert) {

		var aResult = oInterval.parseValue("", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], null, "first value");
		assert.equal(aResult[1], null, "second value");

	});

	QUnit.test("String with own delimitter", function(assert) {

		var oFormatOptions = {delimiter: ".."};
		oInterval.setFormatOptions(oFormatOptions);

		var aResult = oInterval.parseValue("A..Z", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], "A", "first value");
		assert.equal(aResult[1], "Z", "second value");

	});

	QUnit.test("Integer", function(assert) {

		var oType = new IntegerType();
		var oFormatOptions = {type: oType};
		oInterval.setFormatOptions(oFormatOptions);

		var aResult = oInterval.parseValue("1 \u2013 99", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], 1, "first value");
		assert.equal(aResult[1], 99, "second value");

		aResult = undefined;
		aResult = oInterval.parseValue("-1", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], -1, "first value");
		assert.equal(aResult[1], null, "second value");

		aResult = undefined;
		aResult = oInterval.parseValue("-99--1", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.equal(aResult[0], -99, "first value");
		assert.equal(aResult[1], -1, "second value");

	});

	QUnit.test("Edm.Time", function(assert) {

		var oType = new TimeType();
		var oFormatOptions = {type: oType};
		oInterval.setFormatOptions(oFormatOptions);

		var oDate1 = new Date(1970, 0, 1, 7, 30);
		var oDate2 = new Date(1970, 0, 1, 14, 15);
		var aResult = oInterval.parseValue("7:30:00 AM \u2013 2:15:00 PM", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.ok(aResult[0] instanceof Date, "first value is JS-Date");
		assert.ok(aResult[1] instanceof Date, "second value is JS-Date");
		assert.equal(aResult[0].getTime(), oDate1.getTime(), "first value");
		assert.equal(aResult[1].getTime(), oDate2.getTime(), "second value");

		aResult = undefined;
		aResult = oInterval.parseValue("7:30:00 AM\u20132:15:00 PM", "string");
		assert.ok(Array.isArray(aResult), "Result is array");
		assert.equal(aResult.length, 2, "Array has 2 entries");
		assert.ok(aResult[0] instanceof Date, "first value is JS-Date");
		assert.ok(aResult[1] instanceof Date, "second value is JS-Date");
		assert.equal(aResult[0].getTime(), oDate1.getTime(), "first value");
		assert.equal(aResult[1].getTime(), oDate2.getTime(), "second value");

	});

	QUnit.test("wrong input", function(assert) {

		var oException;
		var aResult;
		try {
			aResult = oInterval.parseValue("A\u2013", "string");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.notOk(aResult, "no result returned");

		oException = undefined;
		aResult = undefined;
		try {
			aResult = oInterval.parseValue("\u2013", "string");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.notOk(aResult, "no result returned");

		oException = undefined;
		aResult = undefined;
		try {
			aResult = oInterval.parseValue(1, "int");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");
		assert.notOk(aResult, "no result returned");

	});

	QUnit.module("Validation", {
		beforeEach: function() {
			oInterval = new Interval();
		},
		afterEach: function() {
			oInterval.destroy();
			oInterval = undefined;
		}
	});

	QUnit.test("valid Strings", function(assert) {

		var oException;

		try {
			oInterval.validateValue(["A", "Z"]);
		} catch (e) {
			oException = e;
		}

		assert.notOk(oException, "no exception fired");

		oException = undefined;
		try {
			oInterval.validateValue(["A"]);
		} catch (e) {
			oException = e;
		}

		assert.notOk(oException, "no exception fired");

		oException = undefined;
		try {
			oInterval.validateValue(["A", null]);
		} catch (e) {
			oException = e;
		}

		assert.notOk(oException, "no exception fired");

	});

	QUnit.test("empty value", function(assert) {

		var oException;

		try {
			oInterval.validateValue(null);
		} catch (e) {
			oException = e;
		}

		assert.notOk(oException, "no exception fired");

	});

	QUnit.test("invalid value", function(assert) {

		var oException;

		try {
			oInterval.validateValue("A");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

		oException = undefined;
		try {
			oInterval.validateValue([], "string");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

		oException = undefined;
		try {
			oInterval.validateValue(["A", "B", "C"], "string");
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

		oException = undefined;
		try {
			oInterval.validateValue(["A", 1]);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

	});

	QUnit.test("Integer", function(assert) {

		var oType = new IntegerType({}, {maximum: 100});
		var oFormatOptions = {type: oType};
		oInterval.setFormatOptions(oFormatOptions);

		var oException;

		try {
			oInterval.validateValue([1, 200]);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

		oException = undefined;
		try {
			oInterval.validateValue([5, 1]);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

	});

	QUnit.test("Edm.Time", function(assert) {

		var oType = new TimeType();
		var oFormatOptions = {type: oType};
		oInterval.setFormatOptions(oFormatOptions);

		var oDate1 = new Date(1970, 0, 1, 14, 15);
		var oDate2 = new Date(1970, 0, 1, 7, 30);
		var oException;

		try {
			oInterval.validateValue([oDate1, oDate2]);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

		oException = undefined;
		try {
			oInterval.validateValue([oDate1.getTime(), oDate2.getTime()]);
		} catch (e) {
			oException = e;
		}

		assert.ok(oException, "exception fired");

	});

});