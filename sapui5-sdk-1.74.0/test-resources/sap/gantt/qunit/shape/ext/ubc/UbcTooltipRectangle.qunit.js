/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ubc/UbcTooltipRectangle",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UbcTooltipRectangle, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create BC shapes by GanttChart default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUbcTooltipRectangle = new ShapeConfig({
				key: "ubcTooltipRectangle",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcTooltipRectangle",
				shapeProperties: {
					maxExceedCapacity: 21,
					enableSelection: true,
					d: " M 473.0 13.3L495.0 13.3 M 495.0 13.3L495.0",
					x: 200,
					y: 100,
					fillOpacity: 0.5,
					strokeOpacity: 0.5,
					width: 100,
					height: 50,
					title: "testTitle"
				}
			});

			// GanttChart object which creates shape instance
			var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
				planHorizon: new TimeHorizon({
					startTime: "20140901000000",
					endTime: "20141031000000"
				}),
				initHorizon: new TimeHorizon({
					startTime: "20140930000000",
					endTime: "20141020000000"
				})
			});

			this.oGanttChart = new GanttChart({
				timeAxis: oTimeAxisConfig,
				shapes: [this.oShapeConfigUbcTooltipRectangle]
			});

			// call back parameter
			this.oData = {
				"start_date": "20140922000000",
				"end_date": "20140923000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ubcTooltipRectangle: [this.oData]
				}
			};
			// Polyline instance created by GanttChart
			this.oUbcTooltipRectangle = this.oGanttChart.getShapeInstance("ubcTooltipRectangle");
		},
		afterEach: function () {
			this.oUbcTooltipRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oUbcTooltipRectangle.getX(this.oData, this.oRowInfo),
			200,
			"The default ubcTooltipRectangle X can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getY(this.oData, this.oRowInfo),
			100,
			"The default ubcTooltipRectangle X can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getWidth(this.oData, this.oRowInfo),
			100, "The default ubcTooltipRectangle width can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getHeight(this.oData, this.oRowInfo),
			50, "The default ubcTooltipRectangle Height can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getFillOpacity(this.oData, this.oRowInfo),
			0.5, "The default ubcTooltipRectangle fillOpacity can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getStrokeOpacity(this.oData, this.oRowInfo),
			0.5, "The default ubcTooltipRectangle strokeOpacity can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getTitle(this.oData, this.oRowInfo),
			"testTitle", "The default ubcTooltipRectangle title can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getEnableSelection(this.oData, this.oRowInfo),
			true, "The default ubcTooltipRectangle getEnableSelection can be get successfully.");
	});

	QUnit.module("Create BC shapes by GanttChart without default properties", {
		beforeEach: function () {
			// shape configuratio objects
			this.oShapeConfigUbcTooltipRectangle = new ShapeConfig({
				key: "ubcTooltipRectangle",
				shapeClassName: "sap.gantt.shape.ext.ubc.UbcTooltipRectangle"
			});

			// GanttChart object which creates shape instance
			var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
				planHorizon: new TimeHorizon({
					startTime: "20140901000000",
					endTime: "20141031000000"
				}),
				initHorizon: new TimeHorizon({
					startTime: "20140930000000",
					endTime: "20141020000000"
				})
			});

			this.oGanttChart = new GanttChart({
				timeAxis: oTimeAxisConfig,
				shapes: [this.oShapeConfigUbcTooltipRectangle]
			});

			// call back parameter
			this.oData = {
				"start_date": 20140911000000,
				"end_date": 20140921000000
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ubcTooltipRectangle: [this.oData]
				}
			};
			// Polyline instance created by GanttChart
			this.oUbcTooltipRectangle = this.oGanttChart.getShapeInstance("ubcTooltipRectangle");
		},
		afterEach: function () {
			this.oUbcTooltipRectangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		//assert.strictEqual(this.oUbcTooltipRectangle.getX(this.oData, this.oRowInfo),
		//		"-367057.0",
		//		"The default ubcTooltipRectangle X can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getY(this.oData, this.oRowInfo),
			0,
			"The default ubcTooltipRectangle X can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getWidth(this.oData, this.oRowInfo),
			1, "The default ubcTooltipRectangle width can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getHeight(this.oData, this.oRowInfo),
			31, "The default ubcTooltipRectangle Height can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getFillOpacity(this.oData, this.oRowInfo),
			0, "The default ubcTooltipRectangle fillOpacity can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getStrokeOpacity(this.oData, this.oRowInfo),
			0, "The default ubcTooltipRectangle strokeOpacity can be get successfully.");
		assert.strictEqual(this.oUbcTooltipRectangle.getEnableSelection(this.oData, this.oRowInfo),
			false, "The default ubcTooltipRectangle getEnableSelection can be get successfully.");
	});
});
