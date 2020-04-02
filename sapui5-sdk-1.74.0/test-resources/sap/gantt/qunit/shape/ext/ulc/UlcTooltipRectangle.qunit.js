/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ulc/UlcTooltipRectangle",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UlcTooltipRectangle, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Ulc shapes by GanttChart", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcTooltipRectangle = new ShapeConfig({
				key: "ulcTooltipRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcTooltipRectangle",
				shapeProperties: {
					maxVisibleRatio: 20,
					time: "{startTime}",
					endTime: "{endTime}",
					utilizationCurves: {
						util_volume: {
							name: "Volume",
							color: "#30920D",
							ratioAttibute: "util_volume"
						},
						util_mass: {
							name: "Weight",
							color: "#30920D",
							ratioAttribute: "util_mass"
						}
					}
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
				shapes: [this.oShapeConfigUlcTooltipRectangle]
			});

			// call back parameter
			this.oData = {
							   startTime: "20140919000000",
							endTime: "20141012000000",
							util_volume: {
								  "previous": 2,
								  "next": 3,
								  "value": 2
							},
							util_mass: {
								  "previous": 5,
								  "next": 2,
								  "value": 3
							}
						};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcTooltipRectangle: [this.oData]
				}
			};
			// oUlcTooltipRectangle instance created by GanttChart
			this.oUlcTooltipRectangle = this.oGanttChart.getShapeInstance("ulcTooltipRectangle");
		},
		afterEach: function () {
			this.oUlcTooltipRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods." , function (assert) {
		//assert.strictEqual(this.oUlcTooltipRectangle.getX(this.oData, this.oRowInfo),
		//		-367057,	"The default UlcTooltipRectangle x can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangle.getY(this.oData, this.oRowInfo),
				0,	"The default UlcTooltipRectangle y can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangle.getWidth(this.oData, this.oRowInfo),
				0,	"The default UlcTooltipRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangle.getHeight(this.oData, this.oRowInfo),
				32,	"The default UlcTooltipRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangle.getFillOpacity(this.oData, this.oRowInfo),
				0,	"The default UlcTooltipRectangle fillOpacity can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangle.getStrokeOpacity(this.oData, this.oRowInfo),
				0,	"The default UlcTooltipRectangle strokeOpacity can be get successfully.");
		assert.ok(this.oUlcTooltipRectangle.getTitle(this.oData, this.oRowInfo).indexOf("Weight	5-2%") > -1,
				   "The default UlcTooltipRectangle title can be get successfully.");

	});

	QUnit.module("Create Ulc shapes by GanttChart with default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUlcTooltipRectangleDef = new ShapeConfig({
				key: "ulcTooltipRectangle",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcTooltipRectangle",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					title: "volumn and mass title",
					x: 100,
					y: 200,
					width: 300,
					height: 101,
					fill: "#345FF09",
					fillOpacity: 0.3,
					strokeOpacity: 0.3,
					utilizationCurves: {
						util_volume: {
							name: "Volume",
							color: "#30920D",
							ratioAttibute: "util_volume"
						},
						util_mass: {
							name: "Weight",
							color: "#30920D",
							ratioAttribute: "util_mass"
						}
					}
				}
			});

			// GanttChart object which creates shape instance
			sap.gantt.config.DEFAULT_TIME_AXIS.setPlanHorizon(new TimeHorizon({
				startTime: "20140901000000",
				endTime: "20141031000000"
			}));
			this.oGanttChart = new GanttChart({
				shapes: [this.oShapeConfigUlcTooltipRectangleDef]
			});

			// call back parameter
			this.oData = {
							   startTime: "20140919000000",
							endTime: "20141012000000",
							util_volume: {
								  "previous": 2,
								  "next": 3,
								  "value": 2
							},
							util_mass: {
								  "previous": 5,
								  "next": 2,
								  "value": 3
							}
						};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcTooltipRectangle: [this.oData]
				}
			};
			// oUlcTooltipRectangle instance created by GanttChart
			this.oUlcTooltipRectangleDef = this.oGanttChart.getShapeInstance("ulcTooltipRectangle");
		},
		afterEach: function () {
			this.oUlcTooltipRectangleDef = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods." , function (assert) {
		assert.strictEqual(this.oUlcTooltipRectangleDef.getX(this.oData, this.oRowInfo),
				100,	"The default UlcTooltipRectangle x can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangleDef.getY(this.oData, this.oRowInfo),
				200,	"The default UlcTooltipRectangle y can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangleDef.getWidth(this.oData, this.oRowInfo),
				300,	"The default UlcTooltipRectangle width can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangleDef.getHeight(this.oData, this.oRowInfo),
				101,	"The default UlcTooltipRectangle height can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangleDef.getFillOpacity(this.oData, this.oRowInfo),
				0.3,	"The default UlcTooltipRectangle fillOpacity can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangleDef.getStrokeOpacity(this.oData, this.oRowInfo),
				0.3,	"The default UlcTooltipRectangle strokeOpacity can be get successfully.");
		assert.strictEqual(this.oUlcTooltipRectangleDef.getTitle(this.oData, this.oRowInfo),
				"volumn and mass title",	"The default UlcTooltipRectangle title can be get successfully.");

	});
});
