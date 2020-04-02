/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ubc/UbcBorderPath",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UbcBorderPath, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create BC shapes by GanttChart default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUbcBorderPath = new ShapeConfig({
				key: "ubcBorderPath",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcBorderPath",
				shapeProperties: {
					maxExceedCapacity: 21,
					enableSelection: true,
					d: " M 473.0 13.3L495.0 13.3 M 495.0 13.3L495.0",
					stroke: "#F456709",
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
				shapes: [this.oShapeConfigUbcBorderPath]
			});

			// call back parameter
			this.oData = {
				period: [{ "start_date": "20140922000000", "demand": "5", "supply": "7" },
				{ "start_date": "20140923000000", "demand": "6", "supply": "5" },
				{ "start_date": "20140924000000", "demand": "4", "supply": "6" },
				{ "start_date": "20140925000000", "demand": "5", "supply": "6" },
				{ "start_date": "20140926000000", "demand": "4", "supply": "5" }
				]
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ubcBorderPath: [this.oData]
				}
			};
			// Polyline instance created by GanttChart
			this.oUbcBorderPath = this.oGanttChart.getShapeInstance("ubcBorderPath");
		},
		afterEach: function () {
			this.oUbcBorderPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUbcBorderPath.getD(this.oData, this.oRowInfo),
			" M 473.0 13.3L495.0 13.3 M 495.0 13.3L495.0",
			"The default ubcBorderPath D can be get successfully.");
		assert.strictEqual(this.oUbcBorderPath.getStroke(this.oData, this.oRowInfo),
			"#F456709", "The default ubcBorderPath stroke can be get successfully.");
		assert.strictEqual(this.oUbcBorderPath.getStrokeWidth(this.oData, this.oRowInfo),
			2, "The default ubcBorderPath strokeWidth can be get successfully.");
		assert.strictEqual(this.oUbcBorderPath.getEnableSelection(this.oData, this.oRowInfo),
			true, "The default ubcBorderPath getEnableSelection can be get successfully.");
	});

	QUnit.module("Create BC shapes by GanttChart without default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUbcBorderPath = new ShapeConfig({
				key: "ubcBorderPath",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcBorderPath"
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
				shapes: [this.oShapeConfigUbcBorderPath]
			});

			// call back parameter
			this.oData = {
				period: [{ "start_date": "20140922000000", "demand": "5", "supply": "7" },
				{ "start_date": "20140923000000", "demand": "6", "supply": "5" },
				{ "start_date": "20140924000000", "demand": "4", "supply": "6" },
				{ "start_date": "20140925000000", "demand": "5", "supply": "6" },
				{ "start_date": "20140926000000", "demand": "4", "supply": "5" }
				]
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ubcBorderPath: [this.oData]
				}
			};
			// Polyline instance created by GanttChart
			this.oUbcBorderPath = this.oGanttChart.getShapeInstance("ubcBorderPath");
		},
		afterEach: function () {
			this.oUbcBorderPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUbcBorderPath.getD(this.oData, this.oRowInfo),
			" M 472.5 13.3L495.0 13.3 M 495.0 13.3L495.0 9.7 M 495.0 9.7L517.5 9.7 M 517.5 9.7L517.5 16.8 M 517.5 16.8L540.0 16.8 M 540.0 16.8L540.0 13.3 M 540.0 13.3L562.5 13.3 M 562.5 13.3L562.5 16.8 M 562.5 16.8L562.5 16.8 M 562.5 16.8L562.5 16.8",
			"The default ubcBorderPath D can be get successfully.");
		assert.strictEqual(this.oUbcBorderPath.getStroke(this.oData, this.oRowInfo),
			"blue", "The default ubcBorderPath stroke can be get successfully.");
		assert.strictEqual(this.oUbcBorderPath.getStrokeWidth(this.oData, this.oRowInfo),
			0.3, "The default ubcBorderPath strokeWidth can be get successfully.");
		assert.strictEqual(this.oUbcBorderPath.getEnableSelection(this.oData, this.oRowInfo),
			false, "The default ubcBorderPath getEnableSelection can be get successfully.");
	});
});
