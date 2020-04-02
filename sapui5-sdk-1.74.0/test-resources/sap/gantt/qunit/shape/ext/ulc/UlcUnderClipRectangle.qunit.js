/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ulc/UlcUnderClipRectangle",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UlcUnderClipRectangle, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Ulc shapes by GanttChart", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcUnderClipRectangle = new ShapeConfig({
				key: "ulcUnderClipRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcUnderClipRectangle",
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
				shapes: [this.oShapeConfigUlcUnderClipRectangle]
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
					ulcUnderClipRectangle: [this.oData]
				}
			};
			// oUlcUnderClipRectangle instance created by GanttChart
			this.oUlcUnderClipRectangle = this.oGanttChart.getShapeInstance("ulcUnderClipRectangle");
		},
		afterEach: function () {
			this.oUlcUnderClipRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUlcUnderClipRectangle.getX(this.oData, this.oRowInfo),
			0, "The default ulcUnderClipRectangle x can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getY(this.oData, this.oRowInfo),
			5.333333333333333, "The default ulcUnderClipRectangle y can be get successfully.");
		//assert.strictEqual(this.oUlcUnderClipRectangle.getWidth(this.oData, this.oRowInfo),
		//		1350,	"The default ulcUnderClipRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getHeight(this.oData, this.oRowInfo),
			26.666666666666668, "The default ulcUnderClipRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getFill(this.oData, this.oRowInfo),
			"#F2F2F2", "The default ulcUnderClipRectangle stroke can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getFillOpacity(this.oData, this.oRowInfo),
			0.3, "The default ulcUnderClipRectangle fillOpacity can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getStrokeOpacity(this.oData, this.oRowInfo),
			0.3, "The default ulcUnderClipRectangle strokeOpacity can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getClipPath(this.oData, this.oRowInfo),
			"url(#PATH_0000_SCHEME_ac_main_0__12_weight)", "The default ulcUnderClipRectangle clipPath can be get successfully.");

	});

	QUnit.module("Create Ulc shapes by GanttChart with default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcUnderClipRectangle = new ShapeConfig({
				key: "ulcUnderClipRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcUnderClipRectangle",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					x: 100,
					y: 200,
					width: 300,
					height: 101,
					fill: "#FE000F",
					fillOpacity: 0.4,
					strokeOpacity: 0.4,
					clipPath: "url(#PATH_Volumn)"
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
				shapes: [this.oShapeConfigUlcUnderClipRectangle]
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
					ulcUnderClipRectangle: [this.oData]
				}
			};
			// oUlcUnderClipRectangle instance created by GanttChart
			this.oUlcUnderClipRectangle = this.oGanttChart.getShapeInstance("ulcUnderClipRectangle");
		},
		afterEach: function () {
			this.oUlcUnderClipRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUlcUnderClipRectangle.getX(this.oData, this.oRowInfo),
			100, "The default ulcUnderClipRectangle x can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getY(this.oData, this.oRowInfo),
			200, "The default ulcUnderClipRectangle y can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getWidth(this.oData, this.oRowInfo),
			300, "The default ulcUnderClipRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getHeight(this.oData, this.oRowInfo),
			101, "The default ulcUnderClipRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getFill(this.oData, this.oRowInfo),
			"#FE000F", "The default ulcUnderClipRectangle stroke can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getFillOpacity(this.oData, this.oRowInfo),
			0.4, "The default ulcUnderClipRectangle fillOpacity can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getStrokeOpacity(this.oData, this.oRowInfo),
			0.4, "The default ulcUnderClipRectangle strokeOpacity can be get successfully.");
		assert.strictEqual(this.oUlcUnderClipRectangle.getClipPath(this.oData, this.oRowInfo),
			"url(#PATH_Volumn)", "The default ulcUnderClipRectangle clipPath can be get successfully.");

	});
});
