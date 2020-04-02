/*global QUnit */
sap.ui.define([
	"sap/gantt/misc/AxisTime",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/axistime/ProportionZoomStrategy"
], function (AxisTime, TimeHorizon, ProportionZoomStrategy) {
	"use strict";

	QUnit.module("Test sap.gantt.misc.AxisTime", {
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

	QUnit.test("test for AxisTime", function (assert) {
		// construct your input data and output data
		var date = new Date(2013, 11, 30, 12, 0, 0, 0);
		var startDate = d3.time.day.offset(date, -5);
		var endDate = d3.time.day.offset(date, +5);
		var oPlanHorizon = new TimeHorizon({
			startTime: "20150101000000",
			endTime: "20170101000000"
		});
		var dstH = [oPlanHorizon, oPlanHorizon];
		sap.gantt.config.DEFAULT_LOCALE_CET.setDstHorizons(dstH);
		sap.gantt.config.DEFAULT_LOCALE_CET.setUtcdiff("010000");
		var axisX = new AxisTime([startDate, endDate], [100, 200], 2, 10, 0, sap.gantt.config.DEFAULT_LOCALE_CET, new ProportionZoomStrategy());
		var axisX2 = axisX.clone();
		axisX2.setZoomOrigin(0).setZoomRate(1);

		// assertion for AxisTime with zoom
		assert.strictEqual(axisX.timeToView(date), 280, "Test AxisTime: timeToView with zoom");
		assert.strictEqual(axisX.viewToTime(280).valueOf(), date.valueOf(), "Test AxisTime: viewToTime with zoom");
		assert.strictEqual(axisX.timeToView(axisX.viewToTime(280)), 280, "Test AxisTime: timeToView(viewToTime) with zoom");
		assert.strictEqual(axisX.viewToTime(axisX.timeToView(date)).valueOf(), date.valueOf(), "Test AxisTime: viewToTime(timeToView) with zoom");
		assert.strictEqual(axisX.getViewRange()[0] === 180 && axisX.getViewRange()[1] === 380, true, "Test AxisTime: getViewRange with zoom");

		//assert first day of week
		var timeRangeSet = [],
			viewRangeSet = [],
			timeRange = [new Date(1400782801687), new Date(1444588837872)],
			viewRange = [0, 2321.424];
		var scaleValue = axisX._calculateScale(timeRangeSet, viewRangeSet, timeRange, viewRange, false);
		var visibleScale = scaleValue.visibleScale;
		var oTimeInterval = {
			span: 1,
			unit: "d3.time.week"
		};
		sap.ui.getCore().getConfiguration().setLanguage("zh");
		assert.deepEqual(axisX._getTimeIntervalTicks(oTimeInterval, visibleScale), visibleScale.ticks(jQuery.sap.getObject("d3.time.monday").range, 1), "Test AxisTime: first day of week in different languages.");
		sap.ui.getCore().getConfiguration().setLanguage("zh_CN");
		assert.deepEqual(axisX._getTimeIntervalTicks(oTimeInterval, visibleScale), visibleScale.ticks(jQuery.sap.getObject("d3.time.sunday").range, 1), "Test AxisTime: first day of week in different languages.");

		// assertion for AxisTime with start/end value
		assert.strictEqual(axisX2.viewToTime(100).valueOf(), startDate.valueOf(), "Test AxisTime: viewToTime with start value");
		assert.strictEqual(axisX2.viewToTime(200).valueOf(), endDate.valueOf(), "Test AxisTime: viewToTime with end value");
		assert.strictEqual(axisX2.timeToView(axisX2.viewToTime(100)), 100, "Test AxisTime: timeToView(viewToTime) with start value");
		assert.strictEqual(axisX2.timeToView(axisX2.viewToTime(200)), 200, "Test AxisTime: timeToView(viewToTime) with end value");
		assert.strictEqual(axisX2.getViewRange()[0] === 100 && axisX2.getViewRange()[1] === 200, true, "Test AxisTime: getViewRange");
		assert.strictEqual(axisX2.getCurrentTickTimeIntervalKey(), "4day", "Test AxisTime: getCurrentTickTimeIntervalKey");
	});
});
