/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ClipPath",
	"sap/gantt/shape/Path",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (ClipPath, Path, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create ClipPath by GanttChart without properties configred.", {
		beforeEach: function () {
			//aggregated path
			this.oPath = new ShapeConfig({
				key: "path",
				shapeClassName: "sap.gantt.shape.Path",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					d: "m 200 66 l 216 77 l 320 200 z"
				}
			});
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "cp",
				shapeClassName: "sap.gantt.shape.ClipPath",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				},
				clippathAggregation: [this.oPath]
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
				shapes: [this.oShapeConfig]
			});
			// ClipPath instance created by GanttChart
			this.oClipPath = this.oGanttChart.getShapeInstance("cp");
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
					cp: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oClipPath = undefined;
			this.oPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oClipPath.getAggregation("paths")[0].getD(this.oData), "m 200 66 l 216 77 l 320 200 z", "The default aggregated path D can be get successfully.");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create ClipPath by GanttChart with properties configred.", {
		beforeEach: function () {
			// aggregated path
			this.oPath = new ShapeConfig({
				key: "path",
				shapeClassName: "sap.gantt.shape.Path",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					d: "m 10 20 l 20 30 l 50 30 z"
				}
			});
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "cp",
				shapeClassName: "sap.gantt.shape.ClipPath",
				shapeProperties: {
					tag: "clippath"
				},
				clippathAggregation: [this.oPath]
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
				shapes: [this.oShapeConfig]
			});
			// ClipPath instance created by GanttChart
			this.oClipPath = this.oGanttChart.getShapeInstance("cp");
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
					cp: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oClipPath = undefined;
			this.oPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oClipPath.getAggregation("paths")[0].getD(this.oData), "m 10 20 l 20 30 l 50 30 z", "The configured aggregated path D can be get successfully.");
	});
});
