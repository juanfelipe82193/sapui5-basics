/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ulc/UlcOverCapacityZoneRectangle",
	"sap/gantt/def/SvgDefs",
	"sap/gantt/def/pattern/BackSlashPattern",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UlcOverCapacityZoneRectangle, SvgDefs, BackSlashPattern, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Ulc shapes by GanttChart", {
		beforeEach: function () {
			this.oShapeConfigUlcOverCapacityZoneRectangle = new ShapeConfig({
				key: "ulcOverCapacityZoneRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcOverCapacityZoneRectangle",
				shapeProperties: {
					fill: "#345FF09"
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
				shapes: [this.oShapeConfigUlcOverCapacityZoneRectangle]
			});

			// call back parameter
			this.oData = {
				//Below is for different shapes.
				startTime: "20140919000000",
				endTime: "20141012000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcOverCapacityZoneRectangle: [this.oData]
				}
			};
			// oUlcOverCapacityZoneRectangle instance created by GanttChart
			this.oUlcOverCapacityZoneRectangle = this.oGanttChart.getShapeInstance("ulcOverCapacityZoneRectangle");
		},
		afterEach: function () {
			this.oUlcOverCapacityZoneRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getX(this.oData, this.oRowInfo),
			0, "The default oUlcOverCapacityZoneRectangle D can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getY(this.oData, this.oRowInfo),
			0, "The default oUlcOverCapacityZoneRectangle D can be get successfully.");
		//assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getWidth(this.oData, this.oRowInfo),
		//		1350,	"The default oUlcOverCapacityZoneRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getHeight(this.oData, this.oRowInfo),
			6.4, "The default oUlcOverCapacityZoneRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getFill(this.oData, this.oRowInfo),
			"#345FF09", "The default oUlcOverCapacityZoneRectangle stroke can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getStroke(this.oData, this.oRowInfo),
			"#CAC7BA", "The default oUlcOverCapacityZoneRectangle stroke can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getStrokeWidth(this.oData, this.oRowInfo),
			0, "The default oUlcOverCapacityZoneRectangle strokeWidth can be get successfully.");

	});


	QUnit.module("Create Ulc shapes by GanttChart with default properties", {
		beforeEach: function () {

			new SvgDefs({// eslint-disable-line
				defs: [new BackSlashPattern("pattern_backslash_3456FF", {
					stroke: "#3456FF"
				})]
			});

			this.oShapeConfigUlcOverCapacityZoneRectangle = new ShapeConfig({
				key: "ulcOverCapacityZoneRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcOverCapacityZoneRectangle",
				shapeProperties: {
					x: 100,
					y: 200,
					width: 101,
					height: 202,
					backgroundColor: "#3456FF",
					pattern: "backslash",
					stroke: "#F00787",
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
				shapes: [this.oShapeConfigUlcOverCapacityZoneRectangle]
			});

			// call back parameter
			this.oData = {
				//Below is for different shapes.
				startTime: "20140919000000",
				endTime: "20141012000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcOverCapacityZoneRectangle: [this.oData]
				}
			};
			// oUlcOverCapacityZoneRectangle instance created by GanttChart
			this.oUlcOverCapacityZoneRectangle = this.oGanttChart.getShapeInstance("ulcOverCapacityZoneRectangle");
		},
		afterEach: function () {
			this.oUlcOverCapacityZoneRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getX(this.oData, this.oRowInfo),
			100, "The default oUlcOverCapacityZoneRectangle D can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getY(this.oData, this.oRowInfo),
			200, "The default oUlcOverCapacityZoneRectangle D can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getWidth(this.oData, this.oRowInfo),
			101, "The default oUlcOverCapacityZoneRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getHeight(this.oData, this.oRowInfo),
			202, "The default oUlcOverCapacityZoneRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getFill(this.oData, this.oRowInfo),
			"url(#pattern_backslash_3456FF)", "The default oUlcOverCapacityZoneRectangle stroke can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getStroke(this.oData, this.oRowInfo),
			"#F00787", "The default oUlcOverCapacityZoneRectangle stroke can be get successfully.");
		assert.strictEqual(this.oUlcOverCapacityZoneRectangle.getStrokeWidth(this.oData, this.oRowInfo),
			2, "The default oUlcOverCapacityZoneRectangle strokeWidth can be get successfully.");

	});
});
