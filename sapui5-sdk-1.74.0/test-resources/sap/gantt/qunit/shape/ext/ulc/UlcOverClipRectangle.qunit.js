/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ulc/UlcOverClipRectangle",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UlcOverClipRectangle, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Ulc shapes by GanttChart", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcOverClipRectangle = new ShapeConfig({
				key: "ulcOverClipRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcOverClipRectangle",
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
				shapes: [this.oShapeConfigUlcOverClipRectangle]
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
					ulcOverClipRectangle: [this.oData]
				}
			};
			// ulcOverClipRectangle instance created by GanttChart
			this.oUlcOverClipRectangle = this.oGanttChart.getShapeInstance("ulcOverClipRectangle");
		},
		afterEach: function () {
			this.oUlcOverClipRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUlcOverClipRectangle.getX(this.oData, this.oRowInfo),
			0, "The default UlcOverClipRectangle x can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getY(this.oData, this.oRowInfo),
			0, "The default UlcOverClipRectangle y can be get successfully.");
		//assert.strictEqual(this.oUlcOverClipRectangle.getWidth(this.oData, this.oRowInfo),
		//		1350,	"The default UlcOverClipRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getHeight(this.oData, this.oRowInfo),
			5.333333333333333, "The default UlcOverClipRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getFill(this.oData, this.oRowInfo),
			"#FF0000", "The default UlcOverClipRectangle stroke can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getClipPath(this.oData, this.oRowInfo),
			"url(#PATH_0000_SCHEME_ac_main_0__12_weight)", "The default UlcOverClipRectangle ClipPath can be get successfully.");

	});

	QUnit.module("Create Ulc shapes by GanttChart with default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcOverClipRectangle = new ShapeConfig({
				key: "ulcOverClipRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcOverClipRectangle",
				shapeProperties: {
					maxVisibleRatio: 20,
					time: "{startTime}",
					endTime: "{endTime}",
					x: 100,
					y: 200,
					width: 300,
					height: 101,
					fill: "#FF000F",
					clipPath: "url(#PATH_Weight)"
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
				shapes: [this.oShapeConfigUlcOverClipRectangle]
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
					ulcOverClipRectangle: [this.oData]
				}
			};
			// ulcOverClipRectangle instance created by GanttChart
			this.oUlcOverClipRectangle = this.oGanttChart.getShapeInstance("ulcOverClipRectangle");
		},
		afterEach: function () {
			this.oUlcOverClipRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods  with default properties.", function (assert) {
		assert.strictEqual(this.oUlcOverClipRectangle.getX(this.oData, this.oRowInfo),
			100, "The default UlcOverClipRectangle x can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getY(this.oData, this.oRowInfo),
			200, "The default UlcOverClipRectangle y can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getWidth(this.oData, this.oRowInfo),
			300, "The default UlcOverClipRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getHeight(this.oData, this.oRowInfo),
			101, "The default UlcOverClipRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getFill(this.oData, this.oRowInfo),
			"#FF000F", "The default UlcOverClipRectangle stroke can be get successfully.");
		assert.strictEqual(this.oUlcOverClipRectangle.getClipPath(this.oData, this.oRowInfo),
			"url(#PATH_Weight)", "The default UlcOverClipRectangle ClipPath can be get successfully.");

	});
});
