/*global QUnit*/
sap.ui.define([
	"sap/gantt/shape/ext/Pentangle",
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/ext/Pentangle"
], function (Shape, ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart without properties configred.", {
		beforeEach: function () {
			Shape.getMetadata()._bAbstract = false;
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.ext.Pentangle",
					shapeProperties: {
						time: "{startTime}",
						endTime: "{endTime}"
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
			this.oPentangle = this.oGanttChart.getShapeInstance("ut");
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
			this.oPentangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
			Shape.getMetadata()._bAbstract = true;
		}
	});


	QUnit.test("Test default value of get<Property>() methods." , function (assert) {
		assert.equal(this.oPentangle.getRadius(this.oData, this.oRowInfo), 10);
		var Radius2 = this.oPentangle.getRadius2(this.oData, this.oRowInfo);
		assert.strictEqual(Math.round(Radius2 * 100000) / 100000, 3.81966);
		Radius2 = this.oPentangle.calRadius2ByGoldenRatio(10);
		assert.strictEqual(Math.round(Radius2 * 100000) / 100000, 3.81966);
		var points = this.oPentangle.getPoints(this.oData, this.oRowInfo).split(" ");
		var aPoints = [];
		var aShortPoints = [];
		for (var i = 1; i < points.length; i++){
			aShortPoints = points[i].split(",");
			aPoints.push(Math.round(aShortPoints[0] * 100000) / 100000);
			aPoints.push(Math.round(aShortPoints[1] * 100000) / 100000);
		}
		assert.deepEqual(aPoints,
				[
					427.5,
					6,
					429.74514,
					12.90983,
					437.01057,
					12.90983,
					431.13271,
					17.18034,
					433.37785,
					24.09017,
					427.5,
					19.81966,
					421.62215,
					24.09017,
					423.86729,
					17.18034,
					417.98943,
					12.90983,
					425.25486,
					12.90983
				]);
		Radius2 = this.oPentangle._getPointX(10, 12, 120);
		assert.strictEqual(Math.round(Radius2 * 100000) / 100000, 16.96733);
		Radius2 = this.oPentangle._getPointY(10, 12, 120);
		assert.strictEqual(Math.round(Radius2 * 100000) / 100000, 0.22983);
	});

	// this test make sure every newly defined properties other than parent is added with config first logic.
	QUnit.module("Create Shape by GanttChart with properties configred.", {
		beforeEach: function () {
			// shape configuratio object
			this.oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.ext.Pentangle",
				shapeProperties: {
					tag: "path",
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
					radius: 15,
					radius2: 15,
					points: "test"
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
			this.oPentangle = this.oGanttChart.getShapeInstance("ut");
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
			this.oPentangle = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test configured value of get<Property>() methods." , function (assert) {
		assert.strictEqual(this.oPentangle.getRadius(this.oData, this.oRowInfo), 15);
		assert.strictEqual(this.oPentangle.getRadius2(this.oData, this.oRowInfo), 15);
		assert.strictEqual(this.oPentangle.getPoints(this.oData, this.oRowInfo), "test");
	});
});
