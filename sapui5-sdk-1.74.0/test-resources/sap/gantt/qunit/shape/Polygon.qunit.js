/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Polygon",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (Polygon, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			// shape configuration object
			this.oShapeConfig = new ShapeConfig({
				key: "polygon",
				shapeClassName: "sap.gantt.shape.Polygon",
				shapeProperties: {
					time: "{startTime}"
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
			this.oPolygon = this.oGanttChart.getShapeInstance("polygon");
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
					polygon: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oPolygon = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		var sPoints = this.oPolygon.getPoints(this.oData, this.oRowInfo);
		assert.ok(
			sPoints === "465.5936565892942,12 472.5218598195697,8 479.45006304984526,12 479.45006304984526,20 472.5218598195697,24 465.5936565892942,20" ||
			sPoints === "465.5936565892942,12 472.5218598195697,8 479.45006304984525,12 479.45006304984525,20 472.5218598195697,24 465.5936565892942,20", // IE
			"The default polygon points can be get successfully."
		);
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuration object
			this.oShapeConfig = new ShapeConfig({
				key: "polygon",
				shapeClassName: "sap.gantt.shape.Polygon",
				shapeProperties: {
					tag: "polygon",
					points: "100,20 280,160 260,170",
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
			// Polygon instance created by GanttChart
			this.oPolygon = this.oGanttChart.getShapeInstance("polygon");
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
			this.oPolygon = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oPolygon.getPoints(this.oData), "100,20 280,160 260,170", "The configured polygon points can be get successfully.");
	});
	QUnit.test("testFillOpacity methods.", function (assert) {
		assert.strictEqual(this.oPolygon.getFillOpacity(this.oData), 0.5, "The configured polygon FillOpacity can be get successfully.");
	});

	QUnit.module("Polygon.getStyle module", {
		beforeEach: function () {
			this.oShape = new Polygon({
				fill: "#cccccc",
				fillOpacity: 0.1
			});
			this.oShape.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Polygon"
			});
		},
		afterEach: function () {
			this.oShape = null;
		}
	});
	QUnit.test("Polygon.getStyle default value", function (assert) {
		var expectedResult = "stroke-width:0; fill:#cccccc; fill-opacity:0.1; ";
		assert.strictEqual(this.oShape.getStyle(), expectedResult, "default style is correct");
	});

});
