/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ulc/UlcMiddleLine",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UlcMiddleLine, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Ulc shapes by GanttChart", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcMiddleLine = new ShapeConfig({
				key: "ulcMiddleLine",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcMiddleLine",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});

			// GanttChart object which creates shape instance
			var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
				planHorizon: new TimeHorizon({
					startTime: "20140901000000",
					endTime: "20141031000000"
				})
			});

			this.oGanttChart = new GanttChart({
				timeAxis: oTimeAxisConfig,
				shapes: [this.oShapeConfigUlcMiddleLine]
			});

			// call back parameter
			this.oData = {
				startTime: "20140919000000",
				endTime: "20141012000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcMiddleLine: [this.oData]
				}
			};
			// oUlcMiddleLine instance created by GanttChart
			this.oUlcMiddleLine = this.oGanttChart.getShapeInstance("ulcMiddleLine");
		},
		afterEach: function () {
			this.oUlcMiddleLine = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUlcMiddleLine.getX1(this.oData, this.oRowInfo),
			0, "The default UlcMiddleLine x1 can be get successfully.");
		//assert.strictEqual(this.oUlcMiddleLine.getX2(this.oData, this.oRowInfo),
		//		1350,	"The default UlcMiddleLine x2 can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getY1(this.oData, this.oRowInfo),
			19.2, "The default UlcMiddleLine y1 can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getY2(this.oData, this.oRowInfo),
			19.2, "The default UlcMiddleLine y2 can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getStrokeDasharray(this.oData, this.oRowInfo),
			"5,5", "The default UlcBorderPath stroke can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getStroke(this.oData, this.oRowInfo),
			"#CAC7BA", "The default UlcMiddleLine stroke can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getStrokeWidth(this.oData, this.oRowInfo),
			1, "The default UlcMiddleLine strokeWidth can be get successfully.");

	});

	QUnit.module("Create Ulc shapes by GanttChart  with default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcMiddleLine = new ShapeConfig({
				key: "ulcMiddleLine",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcMiddleLine",
				shapeProperties: {
					maxVisibleRatio: 20,
					time: "{startTime}",
					endTime: "{endTime}",
					x1: 100,
					y1: 200,
					x2: 300,
					y2: 400,
					strokeDasharray: "4,4",
					stroke: "#FF0087",
					strokeWidth: 2
				}
			});

			// GanttChart object which creates shape instance
			var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
				planHorizon: new TimeHorizon({
					startTime: "20140901000000",
					endTime: "20141031000000"
				})
			});

			this.oGanttChart = new GanttChart({
				timeAxis: oTimeAxisConfig,
				shapes: [this.oShapeConfigUlcMiddleLine]
			});

			// call back parameter
			this.oData = {
				startTime: "20140919000000",
				endTime: "20141012000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcMiddleLine: [this.oData]
				}
			};
			// oUlcMiddleLine instance created by GanttChart
			this.oUlcMiddleLine = this.oGanttChart.getShapeInstance("ulcMiddleLine");
		},
		afterEach: function () {
			this.oUlcMiddleLine = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods with default properties.", function (assert) {
		assert.strictEqual(this.oUlcMiddleLine.getX1(this.oData, this.oRowInfo),
			100, "The default UlcMiddleLine y1 can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getX2(this.oData, this.oRowInfo),
			300, "The default UlcMiddleLine y2 can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getY1(this.oData, this.oRowInfo),
			200, "The default UlcMiddleLine y1 can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getY2(this.oData, this.oRowInfo),
			400, "The default UlcMiddleLine y2 can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getStrokeDasharray(this.oData, this.oRowInfo),
			"4,4", "The default UlcBorderPath stroke can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getStroke(this.oData, this.oRowInfo),
			"#FF0087", "The default UlcMiddleLine stroke can be get successfully.");
		assert.strictEqual(this.oUlcMiddleLine.getStrokeWidth(this.oData, this.oRowInfo),
			2, "The default UlcMiddleLine strokeWidth can be get successfully.");

	});
});
