/*global QUnit*/
sap.ui.define([
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/ext/Iconfont"
], function (ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configured.", {
		beforeEach: function () {
			// shape configuration object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.ext.Iconfont",
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
			// iconfont instance created by GanttChart
			this.oIconfont = this.oGanttChart.getShapeInstance("ut");
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
			this.oIconfont = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});


	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oIconfont.getX(this.oData, this.oRowInfo), 405.0187369882027);
		assert.strictEqual(this.oIconfont.getY(this.oData, this.oRowInfo), 21);
		assert.strictEqual(this.oIconfont.getText(this.oData, this.oRowInfo), undefined);
		assert.strictEqual(this.oIconfont.getFontFamily(this.oData, this.oRowInfo), undefined);
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configured.", {
		beforeEach: function () {
			// shape configuration object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.ext.Iconfont",
				shapeProperties: {
					time: "{startTime}",
					name: "{name}",
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
			// iconfont instance created by GanttChart
			this.oIconfont = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				startTime: "20140919000000",
				endTime: "20141012000000",
				name: "account"
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
			this.oIconfont = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oIconfont.getX(this.oData), 1);
		assert.strictEqual(this.oIconfont.getY(this.oData), 3);
		assert.strictEqual(this.oIconfont.getText(this.oData), sap.ui.core.IconPool.getIconInfo("account").content);
		assert.strictEqual(this.oIconfont.getFontFamily(this.oData), "SAP-icons");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with text and fontfamily properties configured.", {
		beforeEach: function () {
			// shape configuration object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.ext.Iconfont",
				shapeProperties: {
					time: "{startTime}",
					name: "{name}",
					text: "text",
					fontFamily: "Arial"
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
			// iconfont instance created by GanttChart
			this.oIconfont = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				startTime: "20140919000000",
				endTime: "20141012000000",
				name: "account"
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
			this.oIconfont = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oIconfont.getText(this.oData), "text");
		assert.strictEqual(this.oIconfont.getFontFamily(this.oData), "Arial");
	});

});
