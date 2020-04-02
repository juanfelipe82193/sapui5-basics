/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/Cursor",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/ext/Cursor"
], function (Shape, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			Shape.getMetadata()._bAbstract = false;
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "cursor",
				shapeClassName: "sap.gantt.shape.ext.Cursor",
				shapeProperties: {
					time: "{startTime}",
					length: 10,
					width: 5,
					pointHeight: 5,
					xBias: 0.5,
					yBias: 1
				}
			});
			// GanttChart object which creates shape instance
			var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
				planHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150131000000"
				})
			});

			this.oGanttChart = new GanttChart({
				timeAxis: oTimeAxisConfig,
				shapes: [this.oShapeConfig]
			});
			// Cursor instance created by GanttChart
			this.oCursor = this.oGanttChart.getShapeInstance("cursor");
			// call back parameter
			this.oData = {
				startTime: "20150101000000",
				endTime: "20150120000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0048|SCHEME:ac_main[0]",
				data: {
					cursor: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oCursor = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
			Shape.getMetadata()._bAbstract = true;
		}
	});


	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oCursor.getD(this.oData, this.oRowInfo),
			"M 0 16 m -5 -5 l 10 0 l 0 5 l -5 5 l -5 -5 z",
			"The default D can be get successfully.");
		assert.strictEqual(this.oCursor.getLength(this.oData, this.oRowInfo), 10, "The default length can be get successfully.");
		assert.strictEqual(this.oCursor.getWidth(this.oData, this.oRowInfo), 5, "The default width can be get successfully.");
		assert.strictEqual(this.oCursor.getPointHeight(this.oData, this.oRowInfo), 5, "The default point height can be get successfully.");
		assert.strictEqual(this.oCursor.getXBias(this.oData, this.oRowInfo), 0.5, "The default X bias can be get successfully.");
		assert.strictEqual(this.oCursor.getYBias(this.oData, this.oRowInfo), 1, "The default Y bias can be get successfully.");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "cursor",
				shapeClassName: "sap.gantt.shape.ext.Cursor",
				shapeProperties: {
					tag: "cursor",
					xBias: 1,
					yBias: 2,
					length: 20,
					width: 10,
					pointHeight: 8,
					time: "{startTime}"
				}
			});
			// GanttChart object which creates shape instance
			var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
				planHorizon: new TimeHorizon({
					startTime: "20150101000000",
					endTime: "20150131000000"
				})
			});

			this.oGanttChart = new GanttChart({
				timeAxis: oTimeAxisConfig,
				shapes: [this.oShapeConfig]
			});
			// shape instance created by GanttChart
			this.oCursor = this.oGanttChart.getShapeInstance("cursor");
			// call back parameter
			this.oData = {
				startTime: "20150101000000",
				endTime: "20150120000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0048|SCHEME:ac_main[0]",
				data: {
					cursor: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oCursor = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oCursor.getD(this.oData, this.oRowInfo),
			"M 0 16 m -10 -9 l 20 0 l 0 10 l -10 8 l -10 -8 z",
			"The configured D can be get successfully.");
		assert.strictEqual(this.oCursor.getLength(this.oData, this.oRowInfo), 20, "The configured length can be get successfully.");
		assert.strictEqual(this.oCursor.getWidth(this.oData, this.oRowInfo), 10, "The configured width can be get successfully.");
		assert.strictEqual(this.oCursor.getPointHeight(this.oData, this.oRowInfo), 8, "The configured point height can be get successfully.");
		assert.strictEqual(this.oCursor.getXBias(this.oData, this.oRowInfo), 1, "The configured X bias can be get successfully.");
		assert.strictEqual(this.oCursor.getYBias(this.oData, this.oRowInfo), 2, "The configured Y bias can be get successfully.");
	});
});
