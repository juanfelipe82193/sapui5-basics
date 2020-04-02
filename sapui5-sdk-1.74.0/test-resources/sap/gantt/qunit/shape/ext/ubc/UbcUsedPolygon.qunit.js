/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ubc/UbcUsedPolygon",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UbcUsedPolygon, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create BC shapes by GanttChart", {
		beforeEach: function () {
			this.oShapeConfigUbcUsedPolygon = new ShapeConfig({
				key: "ubcUsedPolygon",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcUsedPolygon",
				shapeProperties: {
					fill: "#234FF0"
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
				shapes: [this.oShapeConfigUbcUsedPolygon]
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
					ubcUsedPolygon: [this.oData]
				}
			};
			// oUbcUsedPolygon instance created by GanttChart
			this.oUbcUsedPolygon = this.oGanttChart.getShapeInstance("ubcUsedPolygon");
		},
		afterEach: function () {
			this.oUbcUsedPolygon = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUbcUsedPolygon.getFill(this.oData, this.oRowInfo),
			"#234FF0",
			"The default ubcUsedPolygon fill can be get successfully.");
		assert.strictEqual(this.oUbcUsedPolygon.getPoints(this.oData, this.oRowInfo),
			"472.5,31 472.5,13.3 495.0,13.3 495.0,13.3 517.5,13.3 517.5,16.8 540.0,16.8 540.0,13.3 562.5,13.3 562.5,16.8 562.5,16.8 562.5,16.8 562.5,31 ",
			"The default ubcUsedPolygon getPoints can be get successfully.");

	});


	QUnit.module("Create BC shapes by GanttChart with default values", {
		beforeEach: function () {
			this.oShapeConfigUbcUsedPolygonDef = new ShapeConfig({
				key: "ubcUsedPolygon",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcUsedPolygon",
				shapeProperties: {
					points: "473.0,31 473.0,6.2"
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
				shapes: [this.oShapeConfigUbcUsedPolygonDef]
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
					ubcUsedPolygon: [this.oData]
				}
			};
			// oUbcUsedPolygon instance created by GanttChart
			this.oUbcUsedPolygonDef = this.oGanttChart.getShapeInstance("ubcUsedPolygon");
		},
		afterEach: function () {
			this.oUbcUsedPolygonDef = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods with default shapeConfig values.", function (assert) {
		assert.strictEqual(this.oUbcUsedPolygonDef.getFill(this.oData, this.oRowInfo),
			"#CAC7BA", "The default ubcUsedPolygon fill can be get successfully.");
		assert.strictEqual(this.oUbcUsedPolygonDef.getPoints(this.oData, this.oRowInfo),
			"473.0,31 473.0,6.2",
			"The default ubcUsedPolygon getPoints can be get successfully.");

	});
});
