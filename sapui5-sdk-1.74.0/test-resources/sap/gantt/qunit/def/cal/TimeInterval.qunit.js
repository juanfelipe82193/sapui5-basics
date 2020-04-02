/*global QUnit */
sap.ui.define([
	"sap/gantt/def/cal/TimeInterval"
], function (TimeInterval) {
	"use strict";

	QUnit.module("TimeInterval module");

	QUnit.test("test setStartTime", function (assert) {
		var oInterval = new TimeInterval();
		var oReturn = oInterval.setStartTime(new Date(2016, 10, 10));

		var sExpected = "20161110000000";
		assert.ok(oReturn === oInterval, "overwritten setStartTime has return this");
		assert.strictEqual(oInterval.getStartTime(), sExpected, "startTime value is correct if set as Date");

		oInterval.setStartTime(sExpected);
		assert.strictEqual(oInterval.getStartTime(), sExpected, "startTime value is correct if set as String");
	});

	QUnit.test("test setEndTime", function (assert) {
		var oInterval = new TimeInterval();
		var oReturn = oInterval.setEndTime(new Date(2016, 10, 10));

		var sExpected = "20161110000000";
		assert.ok(oReturn === oInterval, "overwritten setStartTime has return this");
		assert.strictEqual(oInterval.getEndTime(), sExpected, "setEndTime value is correct if set as Date");

		oInterval.setEndTime(sExpected);
		assert.strictEqual(oInterval.getEndTime(), sExpected, "setEndTime value is correct if set as String");
	});
});
