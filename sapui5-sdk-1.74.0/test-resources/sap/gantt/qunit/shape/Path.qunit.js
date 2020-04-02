/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/Path",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart"
], function (Path, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.test("Test isValid method.", function (assert) {
		var oPath = new Path();
		//d contains NaN: invalid
		var sD = "M 405 56 L 0,-7.5 NaN";
		var bIsValid = false;
		assert.strictEqual(oPath.isValid(sD), bIsValid);
		//d contains undefined: invalid
		sD = "M 405 undefined L 0,-7.5 300";
		bIsValid = false;
		assert.strictEqual(oPath.isValid(sD), bIsValid);
		//d contains null: invalid
		sD = "M 405 56 L null,-7.5 215";
		bIsValid = false;
		assert.strictEqual(oPath.isValid(sD), bIsValid);
		//d is null: invalid
		sD = null;
		bIsValid = false;
		assert.strictEqual(oPath.isValid(sD), bIsValid);
		//d is undefined: invalid
		bIsValid = false;
		assert.strictEqual(oPath.isValid(undefined), bIsValid);
		//d is valid
		sD = "M 405 56 L 10,-7.5 215";
		bIsValid = true;
		assert.strictEqual(oPath.isValid(sD), bIsValid);
		//d is empty string: invalid
		sD = "";
		bIsValid = false;
		assert.strictEqual(oPath.isValid(sD), bIsValid);
	});

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Path",
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

			// Path instance created by GanttChart
			this.oPath = this.oGanttChart.getShapeInstance("ut");
			// call back parameter
			this.oData = {
				startTime: "20140919000000",
				endTime: "20141012000000"
			};
			// call back parameter
			this.oRowInfo = {
				rowHeight: 32,
				y: 40,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					ut: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.aShape = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test default value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oPath.getD(this.oData, this.oRowInfo),
			"M 405.0187369882027 56 c 0,-7.5 7.5,-7.5 7.5,0 c 0,7.5 7.5,7.5 7.5,0");
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Path",
				shapeProperties: {
					tag: "rect",
					category: "crossRowShape",
					isBulk: true,
					isDuration: true,
					time: "{startTime}",
					endTime: "{endTime}",
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
					d: "test"
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
			// Path instance created by GanttChart
			this.oPath = this.oGanttChart.getShapeInstance("ut");
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
			this.oPath = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods.", function (assert) {
		assert.strictEqual(this.oPath.getD(this.oData, this.oRowInfo), "test");
	});

	QUnit.module("Path.getStyle module", {
		beforeEach: function () {
			this.oShape = new Path({
				isClosed: true,
				fill: "gray",
				strokeDasharray: "1",
				fillOpacity: 0.1,
				strokeOpacity: 0.1
			});
			this.oShape.mShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Path"
			});
		},
		afterEach: function () {
			this.oShape = null;
		}
	});
	QUnit.test("Path.getStyle default value", function (assert) {
		var expectedResult = "stroke-width:0; fill:gray; stroke-dasharray::1; fill-opacity:0.1; stroke-opacity:0.1; ";
		assert.strictEqual(this.oShape.getStyle(), expectedResult, "default style is correct");
	});
});
