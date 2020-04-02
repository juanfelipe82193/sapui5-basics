/*global QUnit */
sap.ui.define([
	"sap/gantt/misc/AxisTime",
	"sap/gantt/shape/Rectangle",
	"sap/gantt/config/Shape"
], function (Axistime, Rectangle, ShapeConfig) {
	"use strict";

	QUnit.module("Test sap.gantt.misc.AxisTime in RTL mode", {
		beforeEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			this.originalLanguage = config.getLanguage();
			config.setLanguage("en");
			// construct your input data and output data
			this.date = new Date(2013, 11, 30, 12, 0, 0, 0);
			this.startDate = d3.time.day.offset(this.date, -5);
			this.endDate = d3.time.day.offset(this.date, +5);
			this.axisX = new Axistime([this.startDate, this.endDate], [100, 200], 2, 10, null, null);
			this.axisX2 = this.axisX.clone();
			this.axisX2.setZoomOrigin(0).setZoomRate(1);
		},
		afterEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			config.setLanguage(this.originalLanguage);
			this.originalLanguage = undefined;
			this.axisX = undefined;
			this.axisX2 = undefined;
		}
	});

	QUnit.test("test for AxisTime in RTL mode", function (assert) {
		// assertion for AxisTime with zoom
		assert.strictEqual(this.axisX.timeToView(this.date), 80, "Test AxisTime: timeToView with zoom");
		assert.strictEqual(this.axisX.viewToTime(80).valueOf(), this.date.valueOf(), "Test AxisTime: viewToTime with zoom");
		assert.strictEqual(this.axisX.timeToView(this.axisX.viewToTime(120)), 120, "Test AxisTime: timeToView(viewToTime) with zoom");
		assert.strictEqual(this.axisX.viewToTime(this.axisX.timeToView(this.date)).valueOf(), this.date.valueOf(), "Test AxisTime: viewToTime(timeToView) with zoom");
		assert.strictEqual(this.axisX.getViewRange()[0] === 180 && this.axisX.getViewRange()[1] === 380, true, "Test AxisTime: getViewRange with zoom");

		// assertion for AxisTime with start/end value
		assert.strictEqual(this.axisX2.viewToTime(100).valueOf(), this.startDate.valueOf(), "Test AxisTime: viewToTime with start value");
		assert.strictEqual(this.axisX2.viewToTime(0).valueOf(), this.endDate.valueOf(), "Test AxisTime: viewToTime with end value");
		assert.strictEqual(this.axisX2.timeToView(this.axisX2.viewToTime(100)), 100, "Test AxisTime: timeToView(viewToTime) with start value");
		assert.strictEqual(this.axisX2.timeToView(this.axisX2.viewToTime(200)), 200, "Test AxisTime: timeToView(viewToTime) with end value");
		assert.strictEqual(this.axisX2.getViewRange()[0] === 100 && this.axisX2.getViewRange()[1] === 200, true, "Test AxisTime: getViewRange");
	});

	QUnit.module("Test sap.gantt.shape.Rectangle in RTL mode", {
		beforeEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			this.originalLanguage = config.getLanguage();
			config.setLanguage("en");
			this.date = new Date(2013, 11, 30, 12, 0, 0, 0);
			this.startDate = d3.time.day.offset(this.date, -5);
			this.endDate = d3.time.day.offset(this.date, +5);
			this.rectangle = new Rectangle({ endTime: new Date(2013, 11, 27, 0, 0, 0, 0) });
			this.rectangle.mShapeConfig = new ShapeConfig();
			this.rectangle.mChartInstance = new sap.gantt.GanttChart({
				timeAxis: new sap.gantt.config.TimeAxis({
					planHorizon: new sap.gantt.config.TimeHorizon({
						startTime: this.startDate,
						endTime: this.endDate
					}),
					initHorizon: new sap.gantt.config.TimeHorizon({
						startTime: this.startDate,
						endTime: this.endDate
					})
				})
			});
		},
		afterEach: function () {
			var config = sap.ui.getCore().getConfiguration();
			config.setLanguage(this.originalLanguage);
			this.originalLanguage = undefined;
		}
	});
});

