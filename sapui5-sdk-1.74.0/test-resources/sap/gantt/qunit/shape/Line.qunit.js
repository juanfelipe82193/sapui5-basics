/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Line",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (Line, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Line",
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

			// Line instance created by GanttChart
			this.oLine = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				startTime: "20140919000000",
				endTime: "20141012000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 10,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ut: [this.oData]
				}
			};
			this.aShape = [this.oRowInfo];
			this.oGanttChart._oAxisOrdinal = this.oGanttChart._createAxisOrdinal(this.aShape,20,0);
		},
		afterEach: function () {
			this.oLine = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.aShape = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test default value of get<Property>() methods." , function (assert) {
		assert.strictEqual(this.oLine.getX1(this.oData, this.oRowInfo), 405.0187369882027);
		assert.strictEqual(this.oLine.getY1(this.oData, this.oRowInfo), 26);
		assert.strictEqual(this.oLine.getX2(this.oData, this.oRowInfo), 922.5426786953506);
		assert.strictEqual(this.oLine.getY2(this.oData, this.oRowInfo), 26);
		assert.ok(this.oLine.getAriaLabel(this.oData, this.oRowInfo).length > 1, "getAriaLabel value not empty ok");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Line",
				shapeProperties: {
					tag: "rect",
					category: "crossRowShape",
					isBulk: true,
					isDuration: true,
					time: "{startTime}",
					endTime: "{endTime}",
					htmlClass: "sapUiTest",
					title: "hello world",
					xBias: 40,
					yBias: 50,
					fill: "#123456",
					fillOpacity: 0.5,
					strokeOpacity: 0.5,
					stroke: "#654321",
					strokeWidth: 1,
					strokeDasharray: "3,1",
					clipPath: "url(#clippath)",
					filter: "url(#filter)",
					rotationAngle: 30,
					enableDnD: true,
					enableSelection: false,
					arrayAttribute: "a",
					timeFilterAttribute: "b",
					endTimeFilterAttribute: "c",
					x1: 1,
					y1: 2,
					x2: 2,
					y2: 2
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
			// Line instance created by GanttChart
			this.oLine = this.oGanttChart.getShapeInstance("ut");
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
			this.oLine = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods." , function (assert) {
		assert.strictEqual(this.oLine.getX1(this.oData, this.oRowInfo), 1);
		assert.strictEqual(this.oLine.getY1(this.oData, this.oRowInfo), 2);
		assert.strictEqual(this.oLine.getX2(this.oData, this.oRowInfo), 2);
		assert.strictEqual(this.oLine.getY2(this.oData, this.oRowInfo), 2);
	});

	QUnit.module("Line.getStyle module", {
		beforeEach: function() {
			this.oShape = new Line({
				strokeDasharray: "1",
				strokeOpacity: 0.1,
				strokeWidth: 1
			});
			this.oShape.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Line"
			});
		},
		afterEach: function() {
			this.oShape = null;
		}
	});
	QUnit.test("Line.getStyle default value", function(assert){
		var expectedResult = "stroke-width:1; stroke-dasharray:1; fill-opacity:1; stroke-opacity:0.1; ";
		assert.strictEqual(this.oShape.getStyle(), expectedResult, "default style is correct");
	});

});
