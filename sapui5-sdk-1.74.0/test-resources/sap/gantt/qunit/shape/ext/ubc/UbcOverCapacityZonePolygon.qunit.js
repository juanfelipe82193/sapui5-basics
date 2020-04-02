/*global QUnit*/
sap.ui.define([
	"sap/gantt/config/Shape",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/ext/ubc/UbcOverCapacityZonePolygon"
], function ( ShapeConfig, SlashPattern, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create BC shapes by GanttChart", {
		beforeEach: function () {
			this.oShapeConfigUbcOverCapacityZonePolygon = new ShapeConfig({
				key: "ubcOverCapacityZonePolygon",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcOverCapacityZonePolygon",
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
				shapes: [this.oShapeConfigUbcOverCapacityZonePolygon]
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
					ubcOverCapacityZonePolygon: [this.oData]
				}
			};
			// oUbcOverCapacityZonePolygon instance created by GanttChart
			this.oUbcOverCapacityZonePolygon = this.oGanttChart.getShapeInstance("ubcOverCapacityZonePolygon");
		},
		afterEach: function () {
			this.oUbcOverCapacityZonePolygon = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUbcOverCapacityZonePolygon.getFill(this.oData, this.oRowInfo),
			"#234FF0", "The default ubcOverCapacityZonePolygon fill can be get successfully.");
		assert.strictEqual(this.oUbcOverCapacityZonePolygon.getStroke(this.oData, this.oRowInfo),
			"#CAC7BA", "The default ubcOverCapacityZonePolygon stroke can be get successfully.");
		assert.strictEqual(this.oUbcOverCapacityZonePolygon.getStrokeWidth(this.oData, this.oRowInfo),
			0.3, "The default ubcOverCapacityZonePolygon strokeWidth can be get successfully.");

	});


	QUnit.module("Create BC shapes by GanttChart with default values", {
		beforeEach: function () {

			new sap.gantt.def.SvgDefs({ // eslint-disable-line
				defs: [new SlashPattern("pattern_slash_FF0067", {
					stroke: "#FF0067"
				})]
			});

			this.oShapeConfigUbcOverCapacityZonePolygonDef = new ShapeConfig({
				key: "ubcOverCapacityZonePolygon",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcOverCapacityZonePolygon",
				shapeProperties: {
					backgroundColor: "#FF0067",
					pattern: "slash",
					stroke: "#45FF08",
					strokeWidth: 1,
					points: "0,0 1350,0 1350,32 0,32"
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
				shapes: [this.oShapeConfigUbcOverCapacityZonePolygonDef]
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
					ubcOverCapacityZonePolygon: [this.oData]
				}
			};
			// oUbcOverCapacityZonePolygon instance created by GanttChart
			this.oUbcOverCapacityZonePolygonDef = this.oGanttChart.getShapeInstance("ubcOverCapacityZonePolygon");
		},

		afterEach: function () {
			this.oUbcOverCapacityZonePolygonDef = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test get value of get<Property>() methods with default shapeConfig values.", function (assert) {
		assert.strictEqual(this.oUbcOverCapacityZonePolygonDef.getFill(this.oData, this.oRowInfo),
			"url(#pattern_slash_FF0067)", "The default ubcOverCapacityZonePolygon fill can be get successfully.");
		assert.strictEqual(this.oUbcOverCapacityZonePolygonDef.getStroke(this.oData, this.oRowInfo),
			"#45FF08", "The default ubcOverCapacityZonePolygon stroke can be get successfully.");
		assert.strictEqual(this.oUbcOverCapacityZonePolygonDef.getStrokeWidth(this.oData, this.oRowInfo),
			1, "The default ubcOverCapacityZonePolygon strokeWidth can be get successfully.");
		assert.strictEqual(this.oUbcOverCapacityZonePolygonDef.getPoints(this.oData, this.oRowInfo),
			"0,0 1350,0 1350,32 0,32", "The default ubcOverCapacityZonePolygon getPoints can be get successfully.");
	});
});
