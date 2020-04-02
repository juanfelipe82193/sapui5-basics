/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Text",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (Text, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configured.", {
		beforeEach: function () {
			// shape configuration object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Text",
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
				shapes: [this.oShapeConfig]
			});
			// text instance created by GanttChart
			this.oText = this.oGanttChart.getShapeInstance("ut");
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
			this.oText = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oText.getText(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oText.getX(this.oData, this.oRowInfo), 405.0187369882027);
		assert.strictEqual(this.oText.getY(this.oData, this.oRowInfo), 21);
		assert.strictEqual(this.oText.getFontSize(this.oData, this.oRowInfo), 10);
		assert.strictEqual(this.oText.getFontFamily(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oText.getTextAnchor(this.oData, this.oRowInfo), "start");
		assert.strictEqual(this.oText.getWrapWidth(this.oData, this.oRowInfo), -1);
		assert.strictEqual(this.oText.getWrapDy(this.oData, this.oRowInfo), 20);
		assert.strictEqual(this.oText.getTruncateWidth(this.oData, this.oRowInfo), -1);
		assert.strictEqual(this.oText.getEllipsisWidth(this.oData, this.oRowInfo), 12);
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configured.", {
		beforeEach: function () {
			// shape configuration object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Text",
				shapeProperties: {
					text: "text",
					fontSize: 12,
					textAnchor: "end",
					fontFamily: "Arial",
					wrapWidth: 2,
					wrapDy: 30,
					truncateWidth: 20,
					ellipsisWidth: 10,
					time: "{startTime}",
					x: 1,
					y: 3
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
				shapes: [this.oShapeConfig]
			});
			// text instance created by GanttChart
			this.oText = this.oGanttChart.getShapeInstance("ut");
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
			this.oText = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oText.getText(this.oData, this.oRowInfo), "text");
		assert.strictEqual(this.oText.getX(this.oData, this.oRowInfo), 1);
		assert.strictEqual(this.oText.getY(this.oData, this.oRowInfo), 3);
		assert.strictEqual(this.oText.getFontSize(this.oData, this.oRowInfo), 12);
		assert.strictEqual(this.oText.getFontFamily(this.oData, this.oRowInfo), "Arial");
		assert.strictEqual(this.oText.getTextAnchor(this.oData, this.oRowInfo), "end");
		assert.strictEqual(this.oText.getWrapWidth(this.oData, this.oRowInfo), 2);
		assert.strictEqual(this.oText.getWrapDy(this.oData, this.oRowInfo), 30);
		assert.strictEqual(this.oText.getTruncateWidth(this.oData, this.oRowInfo), 20);
		assert.strictEqual(this.oText.getEllipsisWidth(this.oData, this.oRowInfo), 10);
	});

	QUnit.module("Text.getStyle module", {
		beforeEach: function () {
			this.oShape = new Text({
				fontSize: 13,
				fontFamily: "Arial",
				fill: "gray"
			});
			this.oShape.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Text"
			});
		},
		afterEach: function () {
			this.oShape = null;
		}
	});
	QUnit.test("Text.getStyle default value", function (assert) {
		var expectedResult = "stroke-width:0; font-size:13px;; fill:gray; fill-opacity:1; font-family:Arial; ";
		assert.strictEqual(this.oShape.getStyle(), expectedResult, "default style is correct");
	});

});
