/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Polyline",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (Polyline, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "polyline",
				shapeClassName: "sap.gantt.shape.Polyline",
				shapeProperties: {
					time: "{startTime}",
					fillOpacity: 0.5
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
				shapes: [this.oShapeConfig]
			});
			// Polyline instance created by GanttChart
			this.oPolyline = this.oGanttChart.getShapeInstance("polyline");
			// call back parameter
			this.oData = {
				startTime: "20140922000000",
				endTime: "20141012000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					polyline: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oPolyline = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oPolyline.getPoints(this.oData, this.oRowInfo),
			"457.5218598195697,16 462.5218598195697,16 467.5218598195697,8.5 477.5218598195697,23.5 482.5218598195697,16 487.5218598195697,16",
			"The default polyline points can be get successfully.");
	});
	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oPolyline.getFillOpacity(this.oData, this.oRowInfo),
			0.5,
			"The default polyline fillOpacity can be get successfully.");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "polyline",
				shapeClassName: "sap.gantt.shape.Polyline",
				shapeProperties: {
					tag: "polyline",
					points: "100,20 280,160 260,170"
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
				shapes: [this.oShapeConfig]
			});
			// Polygon instance created by GanttChart
			this.oPolyline = this.oGanttChart.getShapeInstance("polyline");
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
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oPolyline = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oPolyline.getPoints(this.oData), "100,20 280,160 260,170", "The configured polyline points can be get successfully.");
	});

	QUnit.module("Polyline.getStyle module", {
		beforeEach: function () {
			this.oShape = new Polyline({
				fill: "#cccccc",
				fillOpacity: 0.1
			});
			this.oShape.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Polyline"
			});
		},
		afterEach: function () {
			this.oShape = null;
		}
	});
	QUnit.test("Polyline.getStyle default value", function (assert) {
		var expectedResult = "stroke-width:0; fill:#cccccc; fill-opacity:0.1; ";
		assert.strictEqual(this.oShape.getStyle(), expectedResult, "default style is correct");
	});

});
