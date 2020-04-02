sap.ui.define("sap.suite.ui.commons.qunit.util.DateUtils", [
	"sap/suite/ui/commons/util/DateUtils",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (DateUtils) {
	QUnit.module("DateUtilsTest");

	QUnit.test("parseDate accepts Date instances.", function (assert) {
		var date = new Date(2016, 2, 2);
		var result = DateUtils.parseDate(date);
		assert.ok(date === result, "Parse date should return same instance if given a Date");
	});

	QUnit.test("parseDate accepts integer.", function (assert) {
		var date = new Date(2016, 2, 2);
		var result = DateUtils.parseDate(date.valueOf());
		assert.ok(result instanceof Date, "Result must be instance of Date.");
		assert.equal(date.valueOf(), result.valueOf(), "Dates must be same.");
	});

	QUnit.test("parseDate accepts Date([number]).", function (assert) {
		var date = new Date(2016, 2, 2);
		var input = "Date(" + date.valueOf() + ")";
		var result = DateUtils.parseDate(input);
		assert.ok(result instanceof Date, "Result must be instance of Date.");
		assert.equal(date.valueOf(), result.valueOf(), "Dates must be same.");
	});

	QUnit.test("parseDate accepts strings.", function (assert) {
		var date = new Date(2016, 2, 2);
		var input = "" + date.valueOf();
		var result = DateUtils.parseDate(input);
		assert.ok(result instanceof Date, "Result must be instance of Date.");
		assert.equal(date.valueOf(), result.valueOf(), "Dates must be same.");
		input = date.toString();
		result = DateUtils.parseDate(input);
		assert.ok(result instanceof Date, "Result must be instance of Date.");
		assert.equal(date.valueOf(), result.valueOf(), "Dates must be same.");
	});

	QUnit.test("Strings shouldn't be parsed if bParseString is set to false.", function (assert) {
		var date = new Date(2016, 2, 2);
		var input = "" + date.valueOf();
		var result = DateUtils.parseDate(input, false);
		assert.equal(typeof result, "string", "Result must be string.");
		assert.equal(input, result, "Strings must be same.");
	});

	QUnit.test("parseDate doesn't parse non valid strings.", function (assert) {
		var input = "new Date(2016,1,1)";
		var result = DateUtils.parseDate(input);
		assert.equal(typeof result, "string", "Result must be string.");
		assert.equal(input, result, "Strings must be same.");

		input = "Date(10e12)";
		result = DateUtils.parseDate(input);
		assert.equal(typeof result, "string", "Result must be string.");
		assert.equal(input, result, "Strings must be same.");
	});
});
