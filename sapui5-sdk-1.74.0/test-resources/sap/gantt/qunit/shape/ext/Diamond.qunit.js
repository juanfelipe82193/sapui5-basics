/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/Diamond",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/ext/Diamond"
], function (Shape, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			Shape.getMetadata()._bAbstract = false;
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.ext.Diamond",
				shapeProperties: {
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
			this.oDiamond = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				startTime: "20150120000000",
				endTime: "20150120000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0048|SCHEME:ac_main[0]",
				data: {
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oDiamond = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
			Shape.getMetadata()._bAbstract = true;
		}
	});


	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oDiamond.getD(this.oData, this.oRowInfo),
			"M 427.5 16 m -6 0 l 6 -6 l 6 6 l -6 6 z");
		assert.strictEqual(this.oDiamond.getVerticalDiagonal(this.oData, this.oRowInfo), 12);
		assert.strictEqual(this.oDiamond.getHorizontalDiagonal(this.oData, this.oRowInfo), 12);
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.ext.Diamond",
				shapeProperties: {
					tag: "path",
					category: "crossRowShape",
					isBulk: true,
					isDuration: true,
					time: "{startTime}",
					htmlClass: "sapUiTest",
					title: "hello world",
					xBias: 40,
					yBias: 50,
					fill: "#123456",
					fillOpacity: 0.5,
					strokeOpacity: 0.5,
					stroke: "#654321",
					strokeWidth: 1,
					strokeDasharray: "3,1",
					clipPath: "url(#clippath)",
					filter: "url(#filter)",
					rotationAngle: 30,
					enableDnD: true,
					enableSelection: false,
					arrayAttribute: "a",
					timeFilterAttribute: "b",
					endTimeFilterAttribute: "c",
					d: "test",
					verticalDiagonal: 22,
					horizontalDiagonal: 22
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
			this.oDiamond = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				startTime: "20150120000000",
				endTime: "20150120000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0048|SCHEME:ac_main[0]",
				data: {
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oDiamond = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oDiamond.getD(this.oData, this.oRowInfo), "test");
		assert.strictEqual(this.oDiamond.getVerticalDiagonal(this.oData, this.oRowInfo), 22);
		assert.strictEqual(this.oDiamond.getHorizontalDiagonal(this.oData, this.oRowInfo), 22);
	});


});
