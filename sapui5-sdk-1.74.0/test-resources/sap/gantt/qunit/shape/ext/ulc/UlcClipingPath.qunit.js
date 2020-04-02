/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/ulc/UlcClipingPath",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (UlcClippingPath, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create ulc shapes by GanttChart", {
		beforeEach: function () {
			this.oShapeConfigUlcClipingPath = new ShapeConfig({
				key: "ulcClipingPath",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcClipingPath",
				shapeProperties: {
					maxVisibleRatio: 20
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
				shapes: [this.oShapeConfigUlcClipingPath]
			});

			// call back parameter
			this.oData = {
				values: [{ "from": "20140922000000", "to": "20140924000000" },
				{ "from": "20140926000000", "to": "20140928000000" }
				]
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcClipingPath: [this.oData]
				}
			};
			this.oUlcClipingPath = this.oGanttChart.getShapeInstance("ulcClipingPath");
		},
		afterEach: function () {
			this.oUlcClipingPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test get value of get<Property>() methods.", function (assert) {
		var sD = this.oUlcClipingPath.getD(this.oData, this.oRowInfo);
		assert.ok(
			sD === " L 472.5218598195697 32 L 517.5239417071479 32 L 562.526023594726 32 L 607.528105482304 32" ||
			sD === " L 472.5218598195697 32 L 517.5239417071478 32 L 562.526023594726 32 L 607.528105482304 32", // IE
			"The default ulcClipingPath D can be get successfully."
		);
		assert.strictEqual(this.oUlcClipingPath.getStroke(this.oData, this.oRowInfo),
			undefined, "The default ulcClipingPath stroke can be get successfully.");
		assert.strictEqual(this.oUlcClipingPath.getStrokeWidth(this.oData, this.oRowInfo),
			0, "The default ulcClipingPath strokeWidth can be get successfully.");
	});

	QUnit.module("Create ulc shapes by GanttChart", {
		beforeEach: function () {
			this.oShapeConfigUlcClipingPath = new ShapeConfig({
				key: "ulcClipingPath",
				shapeClassName: "sap.gantt.shape.ext.ulc.UlcClipingPath",
				shapeProperties: {
					d: "22,33 44,55"
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
				shapes: [this.oShapeConfigUlcClipingPath]
			});

			// call back parameter
			this.oData = {
				values: [{ "from": "20140922000000", "to": "20140924000000" },
				{ "from": "20140926000000", "to": "20140928000000" }
				]
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ulcClipingPath: [this.oData]
				}
			};
			this.oUlcClipingPath = this.oGanttChart.getShapeInstance("ulcClipingPath");
		},
		afterEach: function () {
			this.oUlcClipingPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test get value of get<Property>() methods with default properties.", function (assert) {

		assert.strictEqual(this.oUlcClipingPath.getD(this.oData, this.oRowInfo),
			"22,33 44,55", "The default ulcClipingPath D can be get successfully.");
		assert.strictEqual(this.oUlcClipingPath.getStroke(this.oData, this.oRowInfo),
			undefined, "The default ulcClipingPath stroke can be get successfully.");
		assert.strictEqual(this.oUlcClipingPath.getStrokeWidth(this.oData, this.oRowInfo),
			0, "The default ulcClipingPath strokeWidth can be get successfully.");

	});
});
