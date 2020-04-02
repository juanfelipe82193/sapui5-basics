/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Circle",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (Circle, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Circle",
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
				shapes: [this.oShapeConfig]
			});
			// circle instance created by GanttChart
			this.oCircle = this.oGanttChart.getShapeInstance("ut");
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
			this.oCircle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oCircle.getCx(this.oData, this.oRowInfo), 405.0187369882027);
		assert.strictEqual(this.oCircle.getCy(this.oData, this.oRowInfo), 16);
		assert.strictEqual(this.oCircle.getR(this.oData, this.oRowInfo), 5);
		assert.ok(this.oCircle.getAriaLabel(this.oData, this.oRowInfo).length > 1, "getAriaLabel value not empty ok");
		assert.strictEqual(this.oCircle.getFillOpacity(this.oData), 1, "getFillOpacity value is correct");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Circle",
				shapeProperties: {
					time: "{startTime}",
					cx: 1,
					cy: 3,
					r: 2,
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
			// circle instance created by GanttChart
			this.oCircle = this.oGanttChart.getShapeInstance("ut");
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
			this.oCircle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oCircle.getCx(this.oData), 1);
		assert.strictEqual(this.oCircle.getCy(this.oData), 3);
		assert.strictEqual(this.oCircle.getR(this.oData), 2);
		assert.strictEqual(this.oCircle.getFillOpacity(this.oData), 0.5, "getFillOpacity value is correct");
	});

	QUnit.module("Circle.getStyle module", {
		beforeEach: function () {
			this.oShape = new Circle({
				fill: "gray",
				fillOpacity: 0.1
			});
			this.oShape.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Circle"
			});
		},
		afterEach: function () {
			this.oShape = null;
		}
	});
	QUnit.test("Circle.getStyle default value", function (assert) {
		var expectedResult = "stroke-width:0; fill:gray; fill-opacity:0.1; ";
		assert.strictEqual(this.oShape.getStyle(), expectedResult, "default style is correct");
	});
});
