sap.ui.define([
	"sap/suite/ui/commons/Timeline",
	"sap/suite/ui/commons/TimelineGroupType"
], function (Timeline, TimelineGroupType) {
	"use strict";

	QUnit.module("TimelineFunctions");

	QUnit.test("Date diff: Year 2016 - 2014", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Year, new Date(2014, 1, 1), new Date(2016, 1, 1));
		assert.equal(diff, 2, " 2016 - 2014 = 2 years");
	});

	QUnit.test("Date diff: Year 2016 - 2016", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Year, new Date(2016, 1, 1), new Date(2016, 1, 1));
		assert.equal(diff, 0, "2016 - 2016 = 0 years");
	});

	QUnit.test("Date diff: Month 2016/5 - 2016/9", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Month, new Date(2016, 5, 1), new Date(2016, 9, 1));
		assert.equal(diff, 4, "2016/5 - 2016/9 = 4 months");
	});

	QUnit.test("Date diff: Month 2010/11 - 2011/0", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Month, new Date(2010, 11, 1), new Date(2011, 0, 1));
		assert.equal(diff, 1, "2010/11 - 2011/0 = 1 month");
	});

	QUnit.test("Date diff: Quarter 2010/11 - 2011/0", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Quarter, new Date(2010, 11, 1), new Date(2011, 0, 1));
		assert.equal(diff, 1, "2010/11 - 2011/0 = 1 quarter");
	});

	QUnit.test("Date diff: Quarter 2010/11 - 2010/11", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Quarter, new Date(2010, 11, 1), new Date(2010, 11, 1));
		assert.equal(diff, 0, "2010/11 - 2010/11 = 0 quarters");
	});

	QUnit.test("Date diff: Quarter 2010/10 - 2010/11", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Quarter, new Date(2010, 10, 1), new Date(2010, 11, 1));
		assert.equal(diff, 0, "2010/10 - 2010/11 = 0 quarters");
	});

	QUnit.test("Date diff: Quarter 2016/8 - 2017/0", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Quarter, new Date(2016, 8, 1), new Date(2017, 0, 1));
		assert.equal(diff, 2, "2016/8 - 2017/0 = 2 quarters");
	});

	QUnit.test("Date diff: Quarter 2016/0 - 2016/10", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Quarter, new Date(2016, 0, 1), new Date(2016, 10, 1));
		assert.equal(diff, 3, "2016/0 - 2016/10 = 3 quarters");
	});

	QUnit.test("Date diff: Day 2016/0/0 - 2016/0/1", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Day, new Date(2016, 0, 0), new Date(2016, 0, 1));
		assert.equal(diff, 1, "2016/0/0 - 2016/0/1 = 1 day");
	});

	QUnit.test("Date diff: Day 2015/12/31 - 2016/0/1", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Day, new Date(2015, 11, 31), new Date(2016, 0, 1));
		assert.equal(diff, 1, "2015/12/31 - 2016/0/1 = 1 day");
	});

	QUnit.test("Date diff: Day 2015/12/31 - 2016/0/1", function (assert) {
		var diff = Timeline.prototype._fnDateDiff(TimelineGroupType.Day, new Date(2015, 0, 1), new Date(2016, 0, 1));
		assert.equal(diff, 365, "2015/12/31 - 2016/0/1 = 365 days");
	});

	function buildTimeline(oMinDate, oMaxDate, sRangeFiltertype) {
		var oTimeline = new Timeline();
		oTimeline._minDate = oMinDate;
		oTimeline._maxDate = oMaxDate;
		if (sRangeFiltertype) {
			oTimeline._rangeFilterType = sRangeFiltertype;
		}
		return oTimeline;
	}

	QUnit.test("Date add - 10 years round up with owerflow", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2025, 5, 5),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Year),
			oDate = oTimeline._fnAddDate(10, "UP");
		assert.equal(oDate.getTime(), oMaxDate.getTime(), "Adding 10 years to 2017 should be caped to max date 2025.");
	});

	QUnit.test("Date add - 0 years round up", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2025, 5, 5),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Year),
			oDate = oTimeline._fnAddDate(0, "DOWN");
		assert.equal(oDate.getTime(), oMinDate.getTime(), "Adding 0 years and rounding down should result to min date.");
	});

	QUnit.test("Date add - 10 years round up within range", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Year),
			oDate = oTimeline._fnAddDate(10, "UP");
		assert.equal(oDate.getTime(), new Date(2027, 11, 31, 23, 59, 59).getTime(),
			"Adding 1o years which are in range should result into the last day of 2027.");
	});

	QUnit.test("Date add - 10 years round down", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Year),
			oDate = oTimeline._fnAddDate(10, "DOWN");
		assert.equal(oDate.getTime(), new Date(2027, 0, 1).getTime(),
			"Adding 10 years within the range with rounding down should result into the first day of 2027.");
	});

	QUnit.test("Date add - 10 months round up", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Month),
			oDate = oTimeline._fnAddDate(10, "UP");
		assert.equal(oDate.getTime(), new Date(2018, 3, 30, 23, 59, 59).getTime(),
			"Adding 10 months with rounding up should result in 30.4.2018.");
	});

	QUnit.test("Date add - 10 months round down", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Month),
			oDate = oTimeline._fnAddDate(10, "DOWN");
		assert.equal(oDate.getTime(), new Date(2018, 3, 1).getTime(),
			"Adding 10 months with rounding down should result in 1.4.2018.");
	});

	QUnit.test("Date add - 1 quarter round down", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Quarter),
			oDate = oTimeline._fnAddDate(1, "DOWN");
		assert.equal(oDate.getTime(), new Date(2017, 6, 1).getTime(),
			"Adding 1 quarter with rounding down should result in 1.7.2017.");
	});

	QUnit.test("Date add - 1 quarter round down", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Quarter),
			oDate = oTimeline._fnAddDate(1, "UP");
		assert.equal(oDate.getTime(), new Date(2017, 8, 30, 23, 59, 59).getTime(),
			"Adding 1 quarter with rounding up should result in 30.9.2017.");
	});

	QUnit.test("Date add - 0 quarter round up", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Quarter),
			oDate = oTimeline._fnAddDate(0, "UP");
		assert.equal(oDate.getTime(), new Date(2017, 5, 30, 23, 59, 59).getTime(),
			"Adding 0 quarters with rounding up should result in 30.6.2017.");
	});

	QUnit.test("Date add - 0 quarter round down", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Quarter),
			oDate = oTimeline._fnAddDate(0, "DOWN");
		assert.equal(oDate.getTime(), oMinDate.getTime(),
			"Adding 0 quarters with rounding down should result into mindate.");
	});

	QUnit.test("Date add - 365 days round up", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Day),
			oDate = oTimeline._fnAddDate(365, "UP");
		assert.equal(oDate.getTime(), new Date(2018, 5, 5, 23, 59, 59).getTime(),
			"Adding 365 days with rounding up should result into the same day 23:59:59 next year.");
	});

	QUnit.test("Date add - 1 days round down", function (assert) {
		var oMinDate = new Date(2017, 5, 5),
			oMaxDate = new Date(2040, 5, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate, TimelineGroupType.Day),
			oDate = oTimeline._fnAddDate(1, "DOWN");
		assert.equal(oDate.getTime(), new Date(2017, 5, 6).getTime(),
			"Adding 1 day with rounding down should result into next day 0:00:00.");
	});

	QUnit.test("Test _calculateRangeTypeFilter for days", function (assert) {
		var oMinDate = new Date(2016, 0, 1),
			oMaxDate = new Date(2016, 0, 5),
			oTimeline = buildTimeline(oMinDate, oMaxDate),
			sType = oTimeline._calculateRangeTypeFilter();
		assert.equal(sType, TimelineGroupType.Day, "4 days difference should result into a day range filter.");
	});

	QUnit.test("Test _calculateRangeTypeFilter for Months", function (assert) {
		var oMinDate = new Date(2016, 0, 1),
			oMaxDate = new Date(2016, 3, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate),
			sType = oTimeline._calculateRangeTypeFilter();
		assert.equal(sType, TimelineGroupType.Month, "4 months difference should result into a month range filter.");
	});

	QUnit.test("Test _calculateRangeTypeFilter for Quarter", function (assert) {
		var oMinDate = new Date(2016, 0, 1),
			oMaxDate = new Date(2016, 7, 1),
			oTimeline = buildTimeline(oMinDate, oMaxDate),
			sType = oTimeline._calculateRangeTypeFilter();
		assert.equal(sType, TimelineGroupType.Quarter, "8 months difference should result into a quarter range filter.");
	});

	QUnit.test("Test _calculateRangeTypeFilter for Year", function (assert) {
		var oMinDate = new Date(2016, 0, 1),
			oMaxDate = new Date(2018, 0, 5),
			oTimeline = buildTimeline(oMinDate, oMaxDate),
			sType = oTimeline._calculateRangeTypeFilter();
		assert.equal(sType, TimelineGroupType.Year, "2 years difference should result into a year range filter.");
	});
});
