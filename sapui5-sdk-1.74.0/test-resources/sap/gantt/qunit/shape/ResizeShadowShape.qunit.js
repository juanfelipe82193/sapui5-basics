/*global QUnit*/
sap.ui.define([
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/ResizeShadowShape",
	"sap/gantt/shape/Path",
	"sap/gantt/shape/Group",
	"sap/gantt/shape/Rectangle",
	"sap/gantt/shape/Line",
	"sap/gantt/shape/Image",
	"sap/gantt/shape/Polygon",
	"sap/gantt/shape/Polyline",
	"sap/gantt/shape/Circle"
], function (ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";
	QUnit.module("Test Resize Shadow Shape.", {
		beforeEach: function () {
			// shape configuration
			this.oPathConfig = new ShapeConfig({
				key: "path",
				shapeClassName: "sap.gantt.shape.Path",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				},
				resizeShadowClassName: "sap.gantt.shape.ResizeShadowShape"
			});
			this.oGroupConfig = new ShapeConfig({
				key: "group",
				shapeClassName: "sap.gantt.shape.Group",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					isDuration: true
				},
				resizeShadowClassName: "sap.gantt.shape.ResizeShadowShape",
				groupAggregation: [
					new ShapeConfig({
						key: "gPath",
						shapeClassName: "sap.gantt.shape.Path",
						shapeProperties: {
							time: "{startTime}",
							endTime: "{endTime}"
						}
					})
				]
			});
			this.oRectConfig = new ShapeConfig({
				key: "rect",
				shapeClassName: "sap.gantt.shape.Rectangle",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					isDuration: true
				},
				resizeShadowClassName: "sap.gantt.shape.ResizeShadowShape"
			});
			this.oLineConfig = new ShapeConfig({
				key: "line",
				shapeClassName: "sap.gantt.shape.Line",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				},
				resizeShadowClassName: "sap.gantt.shape.ResizeShadowShape"
			});
			this.oImageConfig = new ShapeConfig({
				key: "image",
				shapeClassName: "sap.gantt.shape.Image",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}"
				},
				resizeShadowClassName: "sap.gantt.shape.ResizeShadowShape"
			});
			this.oPolygonConfig = new ShapeConfig({
				key: "polygon",
				shapeClassName: "sap.gantt.shape.Polygon",
				shapeProperties: {
					time: "{startTime}"
				},
				resizeShadowClassName: "sap.gantt.shape.ResizeShadowShape"
			});
			this.oPolylineConfig = new ShapeConfig({
				key: "polyline",
				shapeClassName: "sap.gantt.shape.Polyline",
				shapeProperties: {
					time: "{startTime}"
				},
				resizeShadowClassName: "sap.gantt.shape.ResizeShadowShape"
			});
			this.oCircleConfig = new ShapeConfig({
				key: "circle",
				shapeClassName: "sap.gantt.shape.Circle",
				shapeProperties: {
					time: "{startTime}"
				},
				resizeShadowClassName: "sap.gantt.shape.ResizeShadowShape"
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
				shapes: [this.oPathConfig, this.oGroupConfig, this.oRectConfig, this.oLineConfig, this.oImageConfig,
				this.oPolygonConfig, this.oPolylineConfig, this.oCircleConfig]
			});
			this.oResizeShadowShapePath = this.oGanttChart.getShapeInstance("path").getAggregation("resizeShadowShape");
			this.oResizeShadowShapeGroup = this.oGanttChart.getShapeInstance("group").getAggregation("resizeShadowShape");
			this.oResizeShadowShapeRect = this.oGanttChart.getShapeInstance("rect").getAggregation("resizeShadowShape");
			this.oResizeShadowShapeLine = this.oGanttChart.getShapeInstance("line").getAggregation("resizeShadowShape");
			this.oResizeShadowShapeImage = this.oGanttChart.getShapeInstance("image").getAggregation("resizeShadowShape");
			this.oResizeShadowShapePolygon = this.oGanttChart.getShapeInstance("polygon").getAggregation("resizeShadowShape");
			this.oResizeShadowShapePolyline = this.oGanttChart.getShapeInstance("polyline").getAggregation("resizeShadowShape");
			this.oResizeShadowShapeCircle = this.oGanttChart.getShapeInstance("circle").getAggregation("resizeShadowShape");
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
			this.oResizeShadowShapePath = undefined;
			this.oResizeShadowShapeGroup = undefined;
			this.oResizeShadowShapeRect = undefined;
			this.oResizeShadowShapeLine = undefined;
			this.oResizeShadowShapeImage = undefined;
			this.oResizeShadowShapePolygon = undefined;
			this.oResizeShadowShapePolyline = undefined;
			this.oResizeShadowShapeCircle = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Resize shadow shape under different shapes", function (assert) {
		//path
		assert.strictEqual(this.oResizeShadowShapePath.getD(this.oData, this.oRowInfo), "M 405.0187369882027 16 c 0,-7.5 7.5,-7.5 7.5,0 c 0,7.5 7.5,7.5 7.5,0", "Resize shadow shape for <Path> works fine.");
		assert.strictEqual(this.oResizeShadowShapePath.getEnableSelection(this.oData, this.oRowInfo), false, "Resize shadow shape enableSelection works fine.");
		assert.strictEqual(this.oResizeShadowShapePath.getFill(this.oData, this.oRowInfo), "none", "Resize shadow shape getFill works fine.");
		assert.strictEqual(this.oResizeShadowShapePath.getStroke(this.oData, this.oRowInfo), "red", "Resize shadow shape getStroke works fine.");
		assert.strictEqual(this.oResizeShadowShapePath.getIsDuration(this.oData, this.oRowInfo), false, "Resize shadow shape getIsDuration works fine.");
		//group
		assert.strictEqual(this.oResizeShadowShapeGroup.getD(this.oData, this.oRowInfo), "M 405.0187369882027 7.5 L 923.5426786953506 7.5 L 923.5426786953506 22.5 L 405.0187369882027 22.5 z", "Resize shadow shape for <Group> works fine.");
		//rectangle
		assert.strictEqual(this.oResizeShadowShapeRect.getD(this.oData, this.oRowInfo), "M 404.0187369882027 7.5 L 923.5426786953506 7.5 L 923.5426786953506 24.5 L 404.0187369882027 24.5 z", "Resize shadow shape for <Rectangle> works fine.");
		//line
		assert.strictEqual(this.oResizeShadowShapeLine.getD(this.oData, this.oRowInfo), "M 404.0187369882027 15 L 924.5426786953506 15 L 924.5426786953506 18 L 404.0187369882027 18 z", "Resize shadow shape for <Line> works fine.");
		//image
		assert.strictEqual(this.oResizeShadowShapeImage.getD(this.oData, this.oRowInfo), "M 394.0187369882027 5 L 416.0187369882027 5 L 416.0187369882027 27 L 394.0187369882027 27 z", "Resize shadow shape for <Image> works fine.");
		//polygon
		assert.strictEqual(this.oResizeShadowShapePolygon.getD(this.oData, this.oRowInfo), "M 398.0905337579272 12 L 405.0187369882027 8 L 411.94694021847823 12 L 411.94694021847823 20 L 405.0187369882027 24 L 398.0905337579272 20 z", "Resize shadow shape for <Polygon> works fine.");
		//polyline
		assert.strictEqual(this.oResizeShadowShapePolyline.getD(this.oData, this.oRowInfo), "M 390.0187369882027 16 L 395.0187369882027 16 L 400.0187369882027 8.5 L 410.0187369882027 23.5 L 415.0187369882027 16 L 420.0187369882027 16", "Resize shadow shape for <Polyline> works fine.");
		//circle
		assert.strictEqual(this.oResizeShadowShapeCircle.getD(this.oData, this.oRowInfo), "M 405.0187369882027 16 A 5 5, 0, 1, 1, 405.0187369882027 16", "Resize shadow shape for <Circle> Cx works fine.");
	});
});
