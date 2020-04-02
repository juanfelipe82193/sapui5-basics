/*global QUnit */
sap.ui.define([
	"sap/gantt/misc/RelativeTimeFormatter",
	"sap/gantt/misc/Format",
	"sap/gantt/library"
], function (RelativeTimeFormatter, Format) {
	"use strict";

	QUnit.test("test for format function", function (assert) {

		var oBaseDate = Format.relativeTimeToAbsolutTime(0);
		var oDate = Format.relativeTimeToAbsolutTime(7);
		var oFormatter1 = new RelativeTimeFormatter(oBaseDate, sap.gantt.config.TimeUnit.day, "Day");
		var oFormatter2 = new RelativeTimeFormatter(oBaseDate, sap.gantt.config.TimeUnit.week, "Week");

		assert.strictEqual(oFormatter1.format(oDate), "Day 8", "Test format function");
		assert.strictEqual(oFormatter2.format(oDate), "Week 2", "Test format function");
	});
});
