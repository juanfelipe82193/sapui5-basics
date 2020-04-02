/*global QUnit,sinon*/
sap.ui.define([
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/ui/model/json/JSONModel",
	"sap/gantt/axistime/ProportionZoomStrategy"
], function (ShapeConfig, TimeHorizon, GanttChart, JSONModel, ProportionZoomStrategy) {
	"use strict";

	QUnit.module("Test gantt without preloading shape classes.", {
		beforeEach: function () {
			this.oSpy = sinon.spy(sap.ui, "require");
			var oTimeLineOptions = {
				"1day": {
					innerInterval: {
						unit: sap.gantt.config.TimeUnit.day,
						span: 1,
						range: 90
					},
					largeInterval: {
						unit: sap.gantt.config.TimeUnit.week,
						span: 1,
						pattern: "LLL yyyy,'Week' ww"
					},
					smallInterval: {
						unit: sap.gantt.config.TimeUnit.day,
						span: 1,
						pattern: "EEE dd"
					}
				}
			};
			var oData = {
				"root": {
					"id": "root",
					"children": [
						{
							"text": "truck01",
							"plate": "WEF201",
							"plate_expire": "20200819000000",
							"id": "0000",
							"activity": [
								{
									"status": "x",
									"type": "a",
									"startTime": "20160329000000",
									"endTime": "20160331000000"
								},
								{
									"status": "x",
									"type": "c",
									"startTime": "20160331000000",
									"endTime": "20160409000000"
								},
								{
									"status": "y",
									"type": "a",
									"startTime": "20160409000000",
									"endTime": "20160412000000"
								}
							],
							"children": [
								{
									"text": "trailer01",
									"plate": "EA12321",
									"id": "0001",
									"activity": [
										{
											"status": "y",
											"type": "b",
											"startTime": "20160331000000",
											"endTime": "20160409000000"
										}
									]
								}
							]
						}
					]
				}
			};
			var oModel = new JSONModel(oData);
			var oShapeConfig = new ShapeConfig({
				key: "ut",
				shapeClassName: "sap.gantt.shape.Rectangle",
				shapeDataName: "activity",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					fill: "yellow",
					stroke: "blue"
				}
			});

			this.oGanttChart = new GanttChart({
				shapes: [oShapeConfig],
				height: "410px",
				shapeDataNames: ["activity"],
				axisTimeStrategy: new ProportionZoomStrategy({
					totalHorizon: new TimeHorizon({
						startTime: "20160328000000",
						endTime: "20160504000000"
					}),
					visibleHorizon: new TimeHorizon({
						startTime: "20160328000000",
						endTime: "20160504000000"
					}),
					timeLineOptions: oTimeLineOptions,
					timeLineOption: oTimeLineOptions["1day"],
					coarsestTimeLineOption: oTimeLineOptions["1day"],
					finestTimeLineOption: oTimeLineOptions["1day"]
				}),
				rows: {
					path: "/root",
					parameters: {
						arrayNames: ["children"]
					}
				}
			});
			this.oGanttChart.setModel(oModel);
			this.oGanttChart.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oGanttChart.destroy();
			this.oGanttChart = null;
			this.oSpy.restore();
		}
	});


	QUnit.test("Gantt chart renders even when shape class is not preloaded", function (assert) {
		assert.expect(2);
		var oGantt = this.oGanttChart,
			$gantt = oGantt.$(),
			oSpy = this.oSpy;

		function isGanttRendered() {
			return $gantt.find(".sapGanttChartSvg g").length > 0;
		}

		function waitForGanttRender() {
			return new Promise(function (resolve) {
				function waitStep() {
					if (isGanttRendered()) {
						resolve();
					} else {
						setTimeout(waitStep, 200);
					}
				}
				waitStep();
			});
		}

		return waitForGanttRender().then(function () {
			var sShapeClass = oGantt.getShapeInstance("ut").getId();
			assert.ok($gantt.find("." + sShapeClass).length > 0, "Shape elements should have been rendered.");
			assert.ok(oSpy.withArgs(["sap/gantt/shape/Rectangle"], sinon.match.any).getCalls().length > 0, "Rectangle class should have be required.");
		});
	});

});
