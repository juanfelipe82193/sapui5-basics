/*global QUnit */
sap.ui.define([
	"sap/gantt/misc/Format",
	"sap/gantt/library",
	"sap/ui/thirdparty/d3"
], function () {
	"use strict";

	QUnit.module("Test sap.gantt.misc.Format", {
		beforeEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			this.originalLanguage = config.getLanguage();
			config.setLanguage("en");
		},
		afterEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			config.setLanguage(this.originalLanguage);
			this.originalLanguage = undefined;
		}
	});

	QUnit.test("test for convert function between timestamp and date", function (assert) {
		jQuery.sap.require("sap.ui.core.Configuration");
		jQuery.sap.require("sap.ui.core.format.DateFormat");

		var date1 = new Date(2015, 8, 9, 0, 0, 0, 0);
		var date2 = new Date(2016, 8, 9, 0, 10, 0, 0);

		assert.strictEqual(sap.gantt.misc.Format.abapTimestampToDate("20150909000000").toUTCString(), date1.toUTCString(), "Test abapTimestampToDate format: 20151010000000");
		assert.strictEqual(sap.gantt.misc.Format.abapTimestampToDate("20160909001000").toUTCString(), date2.toUTCString(), "Test abapTimestampToDate format: 20160909001000");
		assert.strictEqual(sap.gantt.misc.Format.abapTimestampToDate(date1.toUTCString()).toUTCString(), date1.toUTCString(), "Test abapTimestampToDate format: Wed Sep 09 2015 00:00:00 GMT+0800 (China Standard Time)");
		assert.strictEqual(sap.gantt.misc.Format.abapTimestampToDate(date2.toUTCString()).toUTCString(), date2.toUTCString(), "Test abapTimestampToDate format: Fri Sep 09 2016 00:10:00 GMT+0800 (China Standard Time)");
		var locale = new sap.gantt.config.Locale({
			timeZone: "CET",
			utcdiff: "010000",
			utcsign: "+"
		});

		assert.strictEqual(sap.gantt.misc.Format.abapTimestampToDate(date1).toUTCString(), date1.toUTCString(), "Test passing Date object to abapTimestampToDate method");
		assert.strictEqual(sap.gantt.misc.Format.dateToAbapTimestamp(date1), "20150909000000", "Test dateToAbapTimestamp format: new Date(2015,08,09,0,0,0,0)");
		assert.strictEqual(sap.gantt.misc.Format.dateToAbapTimestamp(date2), "20160909001000", "Test dateToAbapTimestamp format: new Date(2016,08,09,0,10,0,0)");
		assert.strictEqual(sap.gantt.misc.Format.abapTimestampToTimeLabel("20150909000000", locale), "Sep 9, 2015, 1:00:00 AM", "Test abapTimestampToTimeLabel format: 20150909000000");
		assert.strictEqual(sap.gantt.misc.Format.abapTimestampToTimeLabel("20160909001000", locale), "Sep 9, 2016, 1:10:00 AM", "Test dateToAbapTimestamp format: 20160909001000");
		assert.strictEqual(sap.gantt.misc.Format.abapTimestampToTimeLabel("20150815011000", locale), "Aug 15, 2015, 2:10:00 AM", "Test dateToAbapTimestamp format: 20150815011000");
	});

	QUnit.test("test for convert function between absolut and relative time", function (assert) {
		var date3 = new Date(2013, 1, 9, 12, 3, 3, 3);
		var oRelativeObject = sap.gantt.misc.Format.absolutTimeToRelativeTime(date3);
		assert.strictEqual(oRelativeObject.intervalDays, 405, "Test function: absolutTimeToRelativeTime");
		assert.strictEqual(oRelativeObject.intervalHours, 12, "Test function: absolutTimeToRelativeTime");
		assert.strictEqual(oRelativeObject.intervalMinutes, 3, "Test function: absolutTimeToRelativeTime");
		assert.strictEqual(oRelativeObject.intervalSecond, 3, "Test function: absolutTimeToRelativeTime");

		var date4 = sap.gantt.misc.Format.relativeTimeToAbsolutTime(oRelativeObject.intervalDays, oRelativeObject.intervalHours, oRelativeObject.intervalMinutes, oRelativeObject.intervalSecond);
		assert.strictEqual(sap.gantt.misc.Format.dateToAbapTimestamp(date3), sap.gantt.misc.Format.dateToAbapTimestamp(date4), "Test function: relativeTimeToAbsolutTime");
	});
});
