/*global QUnit*/
sap.ui.define([
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/Path",
	"sap/gantt/shape/Group",
	"sap/gantt/shape/Rectangle",
	"sap/gantt/shape/SelectedShape",
	"sap/gantt/shape/Line",
	"sap/gantt/shape/Image",
	"sap/gantt/shape/Polygon",
	"sap/gantt/shape/Polyline",
	"sap/gantt/shape/Circle"
], function (ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.SelectedShape",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oPathConfig = new ShapeConfig({
				key: "path",
				shapeClassName: "sap.gantt.shape.Path",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oShapeConfigRect = new ShapeConfig({
				key: "utrect",
				shapeClassName: "sap.gantt.shape.SelectedShape",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oRectConfig = new ShapeConfig({
				key: "rect",
				shapeClassName: "sap.gantt.shape.Rectangle",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oShapeConfigGroup = new ShapeConfig({
				key: "utgroup",
				shapeClassName: "sap.gantt.shape.SelectedShape",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oGroupConfig = new ShapeConfig({
				key: "group",
				shapeClassName: "sap.gantt.shape.Group",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oShapeConfigPoly = new ShapeConfig({
				key: "utpoly",
				shapeClassName: "sap.gantt.shape.SelectedShape",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oPolyConfig = new ShapeConfig({
				key: "poly",
				shapeClassName: "sap.gantt.shape.Polyline",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oShapeConfigLine = new ShapeConfig({
				key: "utline",
				shapeClassName: "sap.gantt.shape.SelectedShape",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oLineConfig = new ShapeConfig({
				key: "line",
				shapeClassName: "sap.gantt.shape.Line",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oShapeConfigCircle = new ShapeConfig({
				key: "utcircle",
				shapeClassName: "sap.gantt.shape.SelectedShape",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oCircleConfig = new ShapeConfig({
				key: "circle",
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
				shapes: [this.oShapeConfig, this.oPathConfig, this.oShapeConfigRect, this.oRectConfig, this.oShapeConfigGroup, this.oGroupConfig
					, this.oPolyConfig, this.oShapeConfigPoly, this.oLineConfig, this.oShapeConfigLine, this.oCircleConfig, this.oShapeConfigCircle]
			});
			// SelectedShape instance created by GanttChart
			this.oSelectedShape = this.oGanttChart.getShapeInstance("ut");
			this.oSelectedShape.oParent = this.oGanttChart.getShapeInstance("path");
			this.oSelectedShapeRect = this.oGanttChart.getShapeInstance("utrect");
			this.oSelectedShapeRect.oParent = this.oGanttChart.getShapeInstance("rect");
			this.oSelectedShapeGroup = this.oGanttChart.getShapeInstance("utgroup");
			this.oSelectedShapeGroup.oParent = this.oGanttChart.getShapeInstance("group");
			this.oSelectedShapePoly = this.oGanttChart.getShapeInstance("utpoly");
			this.oSelectedShapePoly.oParent = this.oGanttChart.getShapeInstance("poly");
			this.oSelectedShapeLine = this.oGanttChart.getShapeInstance("utline");
			this.oSelectedShapeLine.oParent = this.oGanttChart.getShapeInstance("line");
			this.oSelectedShapeCircle = this.oGanttChart.getShapeInstance("utcircle");
			this.oSelectedShapeCircle.oParent = this.oGanttChart.getShapeInstance("circle");
			//this.oSelectedShape.oParent.getD = undefined;
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
			this.oSelectedShape.oParent = undefined;
			this.oSelectedShapeGroup.oParent = undefined;
			this.oSelectedShapeRect.oParent = undefined;
			this.oSelectedShapePoly.oParent = undefined;
			this.oSelectedShapeLine.oParent = undefined;
			this.oSelectedShapeCircle.oParent = undefined;
			this.oSelectedShape = undefined;
			this.oSelectedShapeGroup = undefined;
			this.oSelectedShapeRect = undefined;
			this.oSelectedShapePoly = undefined;
			this.oSelectedShapeLine = undefined;
			this.oSelectedShapeCircle = undefined;
			this.oPathConfig = undefined;
			this.oShapeConfig = undefined;
			this.oGroupConfig = undefined;
			this.oRectConfig = undefined;
			this.oPolyConfig = undefined;
			this.oLineConfig = undefined;
			this.oCircleConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oSelectedShape.getD(this.oData, this.oRowInfo), "M 405.0187369882027 16 c 0,-7.5 7.5,-7.5 7.5,0 c 0,7.5 7.5,7.5 7.5,0");
		assert.strictEqual(this.oSelectedShapeRect.getD(this.oData, this.oRowInfo), "M 404.0187369882027 7.5 L 923.5426786953506 7.5 L 923.5426786953506 24.5 L 404.0187369882027 24.5 z");
		assert.strictEqual(this.oSelectedShapeGroup.getD(this.oData, this.oRowInfo), "M 405.0187369882027 8.5 L 923.5426786953506 8.5 L 923.5426786953506 23.5 L 405.0187369882027 23.5 z");
		assert.strictEqual(this.oSelectedShapePoly.getD(this.oData, this.oRowInfo), "M 390.0187369882027 16 L 395.0187369882027 16 L 400.0187369882027 8.5 L 410.0187369882027 23.5 L 415.0187369882027 16 L 420.0187369882027 16");
		assert.strictEqual(this.oSelectedShapeLine.getD(this.oData, this.oRowInfo), "M 404.0187369882027 15 L 924.5426786953506 15 L 924.5426786953506 18 L 404.0187369882027 18 z");
		assert.strictEqual(this.oSelectedShapeCircle.getD(this.oData, this.oRowInfo), "M 405.0187369882027 16 A 5 5, 0, 1, 1, 405.0187369882027 16");
		assert.strictEqual(this.oSelectedShape.getStroke(this.oData, this.oRowInfo), "red");
		assert.strictEqual(this.oSelectedShape.getStrokeWidth(this.oData, this.oRowInfo), 2);
		assert.ok(this.oSelectedShape.getAriaLabel(this.oData, this.oRowInfo).length > 1, "getAriaLabel value not empty ok");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.SelectedShape",
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
					stroke: "red",
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
			this.oPathConfig = new ShapeConfig({
				key: "path",
				shapeClassName: "sap.gantt.shape.Path",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					isDuration: true,
					x: 12
				}
			});
			this.oShapeConfigGroup = new ShapeConfig({
				key: "utgroup",
				shapeClassName: "sap.gantt.shape.SelectedShape",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				}
			});
			this.oGroupConfig = new ShapeConfig({
				key: "group",
				shapeClassName: "sap.gantt.shape.Group",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					y: 2,
					height: 20,
					width: 3
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
				shapes: [this.oShapeConfig, this.oPathConfig, this.oShapeConfigGroup, this.oGroupConfig]
			});
			// SelectedShape instance created by GanttChart
			this.oSelectedShape = this.oGanttChart.getShapeInstance("ut");
			this.oSelectedShape.oParent = this.oGanttChart.getShapeInstance("path");
			this.oSelectedShapeGroup = this.oGanttChart.getShapeInstance("utgroup");
			this.oSelectedShapeGroup.oParent = this.oGanttChart.getShapeInstance("group");
			//this.oSelectedShape.oParent.getD = undefined;
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
			this.oSelectedShape.oParent = undefined;
			this.oSelectedShape = undefined;
			this.oPathConfig = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oSelectedShape.getD(this.oData, this.oRowInfo), "M 405.0187369882027 16 c 0,-258.7619708535739 258.7619708535739,-258.7619708535739 258.7619708535739,0 c 0,258.7619708535739 258.7619708535739,258.7619708535739 258.7619708535739,0");
		assert.strictEqual(this.oSelectedShapeGroup.getD(this.oData, this.oRowInfo), "M 405.0187369882027 1 L 410.0187369882027 1 L 410.0187369882027 16 L 405.0187369882027 16 z");
		assert.strictEqual(this.oSelectedShape.getStroke(this.oData, this.oRowInfo), "red");
		assert.strictEqual(this.oSelectedShape.getStrokeWidth(this.oData, this.oRowInfo), 2);
	});

});
