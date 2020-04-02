/*global QUnit*/
sap.ui.define([
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/ext/ubc/UbcUnderCapacityZonePolygon"
], function (ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create BC shapes by GanttChart", {
		beforeEach: function () {
			this.oShapeConfigUbcUnderCapacityZonePolygon = new ShapeConfig({
				key: "ubcUnderCapacityZonePolygon",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcUnderCapacityZonePolygon",
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
				shapes: [this.oShapeConfigUbcUnderCapacityZonePolygon]
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
					ubcUnderCapacityZonePolygon: [this.oData]
				}
			};
			// oUbcUnderCapacityZonePolygon instance created by GanttChart
			this.oUbcUnderCapacityZonePolygon = this.oGanttChart.getShapeInstance("ubcUnderCapacityZonePolygon");
		},
		afterEach: function () {
			this.oUbcUnderCapacityZonePolygon = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUbcUnderCapacityZonePolygon.getFill(this.oData, this.oRowInfo),
			"#234FF0",
			"The default ubcUnderCapacityZonePolygon fill can be get successfully.");
		assert.strictEqual(this.oUbcUnderCapacityZonePolygon.getPoints(this.oData, this.oRowInfo),
			"472.5,31 472.5,6.2 495.0,6.2 495.0,13.3 517.5,13.3 517.5,9.7 540.0,9.7 540.0,9.7 562.5,9.7 562.5,13.3 562.5,13.3 562.5,13.3 562.5,31 ",
			"The default ubcUnderCapacityZonePolygon getPoints can be get successfully.");

	});


	QUnit.module("Create BC shapes by GanttChart with default values", {
		beforeEach: function () {
			this.oShapeConfigUbcUnderCapacityZonePolygonDef = new ShapeConfig({
				key: "ubcUnderCapacityZonePolygon",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcUnderCapacityZonePolygon",
				shapeProperties: {
					points: "473.0,31 473.0,6.2"
				}
			});

			// GanttChart object which creates shape instance
			sap.gantt.config.DEFAULT_TIME_AXIS.setPlanHorizon(new TimeHorizon({
				startTime: "20140901000000",
				endTime: "20141031000000"
			}));
			this.oGanttChart = new GanttChart({
				shapes: [this.oShapeConfigUbcUnderCapacityZonePolygonDef]
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
					ubcUnderCapacityZonePolygon: [this.oData]
				}
			};
			// oUbcUnderCapacityZonePolygon instance created by GanttChart
			this.oUbcUnderCapacityZonePolygonDef = this.oGanttChart.getShapeInstance("ubcUnderCapacityZonePolygon");
		},
		afterEach: function () {
			this.oUbcUnderCapacityZonePolygonDef = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods with default shapeConfig values.", function (assert) {
		assert.strictEqual(this.oUbcUnderCapacityZonePolygonDef.getFill(this.oData, this.oRowInfo),
			"#40d44c", "The default ubcUnderCapacityZonePolygon fill can be get successfully.");
		assert.strictEqual(this.oUbcUnderCapacityZonePolygonDef.getPoints(this.oData, this.oRowInfo),
			"473.0,31 473.0,6.2",
			"The default ubcUnderCapacityZonePolygon getPoints can be get successfully.");

	});
});
