/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ubc/UbcShortageCapacityPolygon",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UbcShortageCapacityPolygon, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create BC shapes by GanttChart", {
		beforeEach: function () {
			this.oShapeConfigUbcShortageCapacityPolygon = new ShapeConfig({
				key: "ubcShortageCapacityPolygon",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcShortageCapacityPolygon"
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
				shapes: [this.oShapeConfigUbcShortageCapacityPolygon]
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
					ubcShortageCapacityPolygon: [this.oData]
				}
			};
			// oUbcShortageCapacityPolygon instance created by GanttChart
			this.oUbcShortageCapacityPolygon = this.oGanttChart.getShapeInstance("ubcShortageCapacityPolygon");
		},
		afterEach: function () {
			this.oUbcShortageCapacityPolygon = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUbcShortageCapacityPolygon.getFill(this.oData, this.oRowInfo),
			"#FF0000", "The default ubcShortageCapacityPolygon fill can be get successfully.");
		assert.strictEqual(this.oUbcShortageCapacityPolygon.getStroke(this.oData, this.oRowInfo),
			"#CAC7BA", "The default ubcShortageCapacityPolygon stroke can be get successfully.");
		assert.strictEqual(this.oUbcShortageCapacityPolygon.getStrokeWidth(this.oData, this.oRowInfo),
			0.3, "The default ubcShortageCapacityPolygon strokeWidth can be get successfully.");
		assert.strictEqual(this.oUbcShortageCapacityPolygon.getPoints(this.oData, this.oRowInfo),
			"472.5,31 472.5,31.0 495.0,31.0 495.0,9.7 517.5,9.7 517.5,31.0 540.0,31.0 540.0,31.0 562.5,31.0 562.5,31.0 562.5,31.0 562.5,31.0 562.5,31 ",
			"The default ubcShortageCapacityPolygon getPoints can be get successfully.");

	});


	QUnit.module("Create BC shapes by GanttChart with default values", {
		beforeEach: function () {
			this.oShapeConfigUbcShortageCapacityPolygonDef = new ShapeConfig({
				key: "ubcShortageCapacityPolygon",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcShortageCapacityPolygon",
				shapeProperties: {
					points: "100,200 300,400",
					stroke: "#45FF08",
					strokeWidth: 1,
					fill: "#FF09FF"
				}
			});

			// GanttChart object which creates shape instance
			sap.gantt.config.DEFAULT_TIME_AXIS.setPlanHorizon(new TimeHorizon({
				startTime: "20140901000000",
				endTime: "20141031000000"
			}));
			this.oGanttChart = new GanttChart({
				shapes: [this.oShapeConfigUbcShortageCapacityPolygonDef]
			});

			// call back parameter
			this.oData = {
				//Below is for different shapes.
				startTime: "20140919000000",
				endTime: "20141012000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ubcShortageCapacityPolygon: [this.oData]
				}
			};
			// oUbcShortageCapacityPolygon instance created by GanttChart
			this.oUbcShortageCapacityPolygonDef = this.oGanttChart.getShapeInstance("ubcShortageCapacityPolygon");
		},
		afterEach: function () {
			this.oUbcShortageCapacityPolygonDef = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods with default shapeConfig values.", function (assert) {
		assert.strictEqual(this.oUbcShortageCapacityPolygonDef.getFill(this.oData, this.oRowInfo),
			"#FF09FF", "The default ubcShortageCapacityPolygon fill can be get successfully.");
		assert.strictEqual(this.oUbcShortageCapacityPolygonDef.getStroke(this.oData, this.oRowInfo),
			"#45FF08", "The default ubcShortageCapacityPolygon stroke can be get successfully.");
		assert.strictEqual(this.oUbcShortageCapacityPolygonDef.getStrokeWidth(this.oData, this.oRowInfo),
			1, "The default ubcShortageCapacityPolygon strokeWidth can be get successfully.");
		assert.strictEqual(this.oUbcShortageCapacityPolygonDef.getPoints(this.oData, this.oRowInfo),
			"100,200 300,400", "The default ubcShortageCapacityPolygon getPoints can be get successfully.");

	});
});
