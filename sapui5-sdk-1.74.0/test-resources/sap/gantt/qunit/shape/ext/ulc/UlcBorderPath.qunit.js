/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ulc/UlcBorderPath",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UlcBorderPath, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create ulc shapes by GanttChart", {
		beforeEach: function () {
			// shape configuration objects
			this.oShapeConfigUlcBorderPath = new ShapeConfig({
				key: "ulcBorderPath",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcBorderPath",
				shapeProperties: {
					maxVisibleRatio: 20,
					stroke: "#34FF09"
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
				shapes: [this.oShapeConfigUlcBorderPath]
			});

			// call back parameter
			this.oData = {
				values: [{ "from": "20140922000000", "to": "20140924000000" },
				{ "from": "20140926000000", "to": "20140928000000" }
				]
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcBorderPath: [this.oData]
				}
			};
			// Polyline instance created by GanttChart
			this.oUlcBorderPath = this.oGanttChart.getShapeInstance("ulcBorderPath");
		},
		afterEach: function () {
			this.oUlcBorderPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		var sD = this.oUlcBorderPath.getD(this.oData, this.oRowInfo);
		assert.ok(
			sD === " L 472.5218598195697 32 L 517.5239417071479 32 L 562.526023594726 32 L 607.528105482304 32" ||
			sD === " L 472.5218598195697 32 L 517.5239417071478 32 L 562.526023594726 32 L 607.528105482304 32", // IE
			"The default UlcBorderPath D can be get successfully."
		);
		assert.strictEqual(this.oUlcBorderPath.getStroke(this.oData, this.oRowInfo),
			"#34FF09", "The default UlcBorderPath stroke can be get successfully.");
		assert.strictEqual(this.oUlcBorderPath.getStrokeWidth(this.oData, this.oRowInfo),
			1, "The default UlcBorderPath strokeWidth can be get successfully.");
	});

	QUnit.module("Create ulc shapes by GanttChart with default properties", {
		beforeEach: function () {
			// shape configuration objects
			this.oShapeConfigUlcBorderPath = new ShapeConfig({
				key: "ulcBorderPath",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcBorderPath",
				shapeProperties: {
					maxVisibleRatio: 20,
					enableSelection: true,
					d: "22,33 44,55",
					strokeWidth: 2,
					maxExceedCapacity: 23,
					utilizationCurves: {
						weight: { color: "#345FF0" }
					}
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
				shapes: [this.oShapeConfigUlcBorderPath]
			});

			// call back parameter
			this.oData = {
				values: [{ "from": "20140922000000", "to": "20140924000000" },
				{ "from": "20140926000000", "to": "20140928000000" }
				],
				dimension: "weight"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcBorderPath: [this.oData]
				}
			};
			// Polyline instance created by GanttChart
			this.oUlcBorderPath = this.oGanttChart.getShapeInstance("ulcBorderPath");
		},
		afterEach: function () {
			this.oUlcBorderPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUlcBorderPath.getD(this.oData, this.oRowInfo),
			"22,33 44,55", "The default UlcBorderPath D can be get successfully.");
		assert.strictEqual(this.oUlcBorderPath.getStroke(this.oData, this.oRowInfo),
			"#345FF0", "The default UlcBorderPath stroke can be get successfully.");
		assert.strictEqual(this.oUlcBorderPath.getStrokeWidth(this.oData, this.oRowInfo),
			2, "The default UlcBorderPath strokeWidth can be get successfully.");


	});
});
