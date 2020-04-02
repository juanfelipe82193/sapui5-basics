/*global QUnit */
sap.ui.define([
	"sap/gantt/def/cal/Calendar",
	"sap/gantt/def/cal/CalendarDefs",
	"sap/gantt/def/cal/TimeInterval"
], function (Calendar, CalendarDefs, TimeInterval) {
	"use strict";

	QUnit.module("Create Calendar PaintServer.", {
		beforeEach: function () {
			this.aTimeIntervalData = [{ "startTime": "20150919000000", "endTime": "20150920000000" },
			{ "startTime": "20150926000000", "endTime": "20150927000000" },
			{ "startTime": "20151003000000", "endTime": "20151004000000" },
			{ "startTime": "20151010000000", "endTime": "20151011000000" }];

			this.aTimeIntervals = [];
			for (var i = 0; i < this.aTimeIntervalData.length; i++) {
				var oTimeInterval = new TimeInterval({
					"startTime": this.aTimeIntervalData[i].startTime,
					"endTime": this.aTimeIntervalData[i].endTime
				});
				this.aTimeIntervals.push(oTimeInterval);
			}

			this.aCalendar = new Calendar({
				"key": "goodHoliday",
				"color": "grey",
				"timeIntervals": this.aTimeIntervals
			});
			this.oCalendarDefs = new CalendarDefs({
				paintServers: [this.aCalendar]
			});
		},
		afterEach: function () {
			this.aTimeIntervalData = undefined;
			this.aTimeIntervals = undefined;
			this.aCalendar = undefined;
			this.oCalendarDefs = undefined;
		}
	});

	QUnit.test("CalendarDef and Calendar and TimeInterval methods.", function (assert) {
		assert.ok(this.aTimeIntervals.length == 4, "TimeIntervals numbers succeeds");

		assert.equal(this.aCalendar.getRefString(), "url(#_goodHoliday)", "Calendar.getRefString succeeds");
		assert.equal(this.aCalendar.getDefNode().id, "_goodHoliday", "Calendar.getDefNode Id succeeds");
		assert.equal(this.aCalendar.getDefNode().timeIntervals.length, 4, "Calendar.getDefNode TimeIntervals Length succeeds");

		assert.ok(this.aCalendar.getDefNode().timeIntervals[0].y !== null, "Calendar.getDefNode TimeInterval y succeeds");
		assert.ok(this.aCalendar.getDefNode().timeIntervals[0].height !== null, "Calendar.getDefNode TimeInterval height succeeds");
		assert.ok(this.aCalendar.getDefNode().timeIntervals[0].fill !== null, "Calendar.getDefNode TimeInterval fill succeeds");
	});

});
