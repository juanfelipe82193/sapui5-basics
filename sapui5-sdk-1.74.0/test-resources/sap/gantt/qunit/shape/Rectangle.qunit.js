/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Rectangle",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (Rectangle, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Rectangle",
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
			// rectangle instance created by GanttChart
			this.oRectangle = this.oGanttChart.getShapeInstance("ut");
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
			this.oRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oRectangle.getX(this.oData, this.oRowInfo), 405.0187369882027);
		assert.strictEqual(this.oRectangle.getY(this.oData, this.oRowInfo), 8.5);
		assert.strictEqual(this.oRectangle.getWidth(this.oData, this.oRowInfo), 517.5239417071479);
		assert.strictEqual(this.oRectangle.getHeight(this.oData, this.oRowInfo), 15);
		assert.strictEqual(this.oRectangle.getRx(this.oData, this.oRowInfo), "0");
		assert.strictEqual(this.oRectangle.getRy(this.oData, this.oRowInfo), "0");
		assert.strictEqual(this.oRectangle.getEnableDnD(this.oData, this.oRowInfo), false);
		assert.ok(this.oRectangle.getAriaLabel(this.oData, this.oRowInfo).length > 1, "getAriaLabel value not empty ok");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Rectangle",
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
					enableSelection: false,
					arrayAttribute: "a",
					timeFilterAttribute: "b",
					endTimeFilterAttribute: "c",
					x: 1,
					width: 3,
					y: 2,
					height: 20,
					rx: "2",
					ry: "2",
					enableDnD: true
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
			// rectangle instance created by GanttChart
			this.oRectangle = this.oGanttChart.getShapeInstance("ut");
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
			this.oRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oRectangle.getX(this.oData, this.oRowInfo), 1);
		assert.strictEqual(this.oRectangle.getY(this.oData, this.oRowInfo), 2);
		assert.strictEqual(this.oRectangle.getWidth(this.oData, this.oRowInfo), 3);
		assert.strictEqual(this.oRectangle.getHeight(this.oData, this.oRowInfo), 20);
		assert.strictEqual(this.oRectangle.getRx(this.oData, this.oRowInfo), "2");
		assert.strictEqual(this.oRectangle.getRy(this.oData, this.oRowInfo), "2");
		assert.strictEqual(this.oRectangle.getEnableDnD(this.oData, this.oRowInfo), true);
	});

	QUnit.module("Rectangle.getStyle module", {
		beforeEach: function () {
			this.oShape = new Rectangle({
				fill: "#cccccc",
				strokeDasharray: "1",
				fillOpacity: 0.1,
				strokeOpacity: 0.1,
				strokeWidth: 1
			});
			this.oShape2 = new Rectangle({
				stroke: "#f2f2f2",
				strokeWidth: 1
			});
			this.oShape.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Rectangle"
			});
			this.oShape2.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Rectangle"
			});
		},
		afterEach: function () {
			this.oShape = null;
			this.oShape2 = null;
		}
	});
	QUnit.test("Shape.getStyle default value", function (assert) {
		var expectedResult = "stroke-width:1; fill:#cccccc; stroke-dasharray:1; fill-opacity:0.1; stroke-opacity:0.1; ";
		assert.strictEqual(this.oShape.getStyle(), expectedResult, "default style is correct");
		assert.strictEqual(this.oShape2.getStyle(), "stroke:#f2f2f2; stroke-width:1; fill-opacity:1; stroke-opacity:1; ", "stroke style is correct");
	});

});
