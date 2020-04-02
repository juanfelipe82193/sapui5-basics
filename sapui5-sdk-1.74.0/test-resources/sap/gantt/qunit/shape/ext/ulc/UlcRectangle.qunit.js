/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ulc/UlcRectangle",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UlcRectangle, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Ulc shapes by GanttChart", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcRectangle = new ShapeConfig({
				key: "ulcRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcRectangle",
				shapeProperties: {
					maxVisibleRatio: 20,
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
				shapes: [this.oShapeConfigUlcRectangle]
			});

			// call back parameter
			this.oData = {
				startTime: "20140919000000",
				endTime: "20141012000000",
				id: 12,
				dimension: "weight"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcRectangle: [this.oData]
				}
			};
			// ulcRectangle instance created by GanttChart
			this.oUlcRectangle = this.oGanttChart.getShapeInstance("ulcRectangle");
		},
		afterEach: function () {
			this.oUlcRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUlcRectangle.getX(this.oData, this.oRowInfo),
			0, "The default UlcRectangle x can be get successfully.");
		assert.strictEqual(this.oUlcRectangle.getY(this.oData, this.oRowInfo),
			0, "The default UlcRectangle y can be get successfully.");
		assert.strictEqual(this.oUlcRectangle.getWidth(this.oData, this.oRowInfo),
			0, "The default UlcRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcRectangle.getHeight(this.oData, this.oRowInfo),
			5.333333333333333, "The default UlcRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcRectangle.getShapeViewBoundary(this.oData, this.oRowInfo),
			null, "The default UlcRectangle shapeViewBoundary can be get successfully.");

	});

	QUnit.module("Create Ulc shapes by GanttChart with default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcRectangle = new ShapeConfig({
				key: "ulcRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcRectangle",
				shapeProperties: {
					maxVisibleRatio: 20,
					time: "{startTime}",
					endTime: "{endTime}",
					x: 100,
					y: 200,
					width: 300,
					height: 101
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
				shapes: [this.oShapeConfigUlcRectangle]
			});

			// call back parameter
			this.oData = {
				startTime: "20140919000000",
				endTime: "20141012000000",
				id: 12,
				dimension: "weight"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcRectangle: [this.oData]
				}
			};
			// ulcRectangle instance created by GanttChart
			this.oUlcRectangle = this.oGanttChart.getShapeInstance("ulcRectangle");
		},
		afterEach: function () {
			this.oUlcRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test get value of get<Property>() methods  with default properties.", function (assert) {
		assert.strictEqual(this.oUlcRectangle.getX(this.oData, this.oRowInfo),
			100, "The default UlcRectangle x can be get successfully.");
		assert.strictEqual(this.oUlcRectangle.getY(this.oData, this.oRowInfo),
			200, "The default UlcRectangle y can be get successfully.");
		assert.strictEqual(this.oUlcRectangle.getWidth(this.oData, this.oRowInfo),
			300, "The default UlcRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcRectangle.getHeight(this.oData, this.oRowInfo),
			101, "The default UlcRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcRectangle.getFill(this.oData, this.oRowInfo), "transparent", "default fill is transparent");
	});
});
