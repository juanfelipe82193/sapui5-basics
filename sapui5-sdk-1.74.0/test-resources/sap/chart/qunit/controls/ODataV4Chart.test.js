/*global QUnit, sinon */

QUnit.config.autostart = false;

sap.ui.require([
	'sap/chart/Chart',
	'sap/chart/data/Dimension',
	'sap/chart/data/Measure',
	'sap/chart/data/TimeDimension',
	'sap/chart/TimeUnitType',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/odata/v4/ODataModel',
	'sap/ui/layout/VerticalLayout',
	'sap/ui/test/TestUtils'
], function(
	Chart,
	Dimension,
	Measure,
	TimeDimension,
	TimeUnitType,
	Filter,
	FilterOperator,
	ODataModel,
	VerticalLayout,
	TestUtils
) {
	"use strict";

	var sServiceURI = "http://anaChartFakeService:8080/";
	window.anaChartFakeService.fake({
		baseURI: sServiceURI
	});
	 sinon.config.useFakeTimers = false;
	var sResultPath = "/ZGK_C_SalesOrderItem_RD_V4(P_DateFunction='PREVIOUSYEAR')/Set";
	var oModel, oVerticalLayout, oChart, sLocale;

	QUnit.module("AnalyticalChart", {
		beforeEach: function() {
			sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			oModel = new ODataModel({
					operationMode : "Server",
					serviceUrl: sServiceURI,
					synchronizationMode : "None"
			});
			oVerticalLayout = new VerticalLayout({
				width: "100%"
			});
		},
		afterEach: function() {
			try {
				if (oModel) {
					oModel.destroy();
				}
				if (oChart) {
					oChart.destroy();
				}
				if (oVerticalLayout) {
					oVerticalLayout.destroy();
				}
				sap.ui.getCore().getConfiguration().setLanguage(sLocale);
				document.getElementById("qunit-fixture").innerHTML = "";
			} catch (e) {
				// ignore
			}
		}
	});

	function dataPointEqual(assert, actual, expected, message) {
		function copy(src) {
			return !src ? src : {
				count: src.count,
				dataPoints: !src.dataPoints ? src.dataPoints : src.dataPoints.map(function(dp) {
					var context = dp.context;
					if (context && !jQuery.isPlainObject(context)) {
						context = context.getObject();
						context = Object.keys(context).reduce(function(obj, k) {
							if (k !== "__metadata") {
								obj[k] = context[k];
							}
							return obj;
						}, {});
					}
					return {
						index: dp.index,
						measures: dp.measures,
						context: context
					};
				})
			};
		}
		assert.deepEqual(copy(actual), copy(expected), message);
	}
	QUnit.test("Create Chart with odata v4", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			"chartType" :"column",
			"uiConfig" : {"applicationSet" : "fiori"},
			"isAnalytical" : true,
			"visibleDimensions" : ["Product"],
			"visibleMeasures" : ["NetAmountInDisplayCurrency"]

		});
		oChart.addDimension(new Dimension({
			"name": "Product"
		}));
		oChart.addMeasure(new Measure({unitBinding:"DisplayCurrency",name : "NetAmountInDisplayCurrency"}));

		oChart.attachRenderComplete(function() {
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			var legendGroup = document.querySelectorAll("#qunit-fixture .v-label-group .v-axis-label-wrapper");
			// isFixedPadding and general.layout.padding are changed
			assert.ok(legendGroup.length > 0);
			oChart.setSelectedDataPoints([{index: 3, measures: ["NetAmountInDisplayCurrency"]}]);
			dataPointEqual(assert, oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":3, "measures":["NetAmountInDisplayCurrency"],"context":{"DisplayCurrency": "EUR", "NetAmountInDisplayCurrency":"447.20", "Product":"HT-1066"}}],
				"count":1
			}, "getSelectedDataPoints() is correct");
			assert.equal(legendGroup[0].textContent, "HT-1068");
			done();
		});
		oChart.bindData({
			path: sResultPath
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Add TimeDimension Chart", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			"chartType" :"timeseries_column",
			"uiConfig" : {"applicationSet" : "fiori"},
			"isAnalytical" : true,
			"visibleDimensions" : ["CreationDate"],
			"visibleMeasures" : ["NetAmountInDisplayCurrency"]

		});
		oChart.addDimension(new TimeDimension({
			name: "CreationDate",
			timeUnit:TimeUnitType.Date
		}));
		oChart.addMeasure(new Measure({unitBinding:"DisplayCurrency",name : "NetAmountInDisplayCurrency"}));

		oChart.attachRenderComplete(function() {
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			var timeAxis = document.querySelectorAll("#qunit-fixture .v-m-timeAxis .v-label-group .v-label .v-label-baseLevel");
			assert.equal(timeAxis[0].textContent, "Jan 01");
			done();
		});
		oChart.bindData({
			path: sResultPath
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Add binding parameter for chart", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			"chartType" :"column",
			"uiConfig" : {"applicationSet" : "fiori"},
			"isAnalytical" : true,
			"visibleDimensions" : ["Product"],
			"visibleMeasures" : ["NetAmountInDisplayCurrency"]

		});
		oChart.addDimension(new Dimension({
			"name": "Product"
		}));
		oChart.addMeasure(new Measure({unitBinding:"DisplayCurrency",name : "NetAmountInDisplayCurrency"}));

		oChart.attachRenderComplete(function() {
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			var legendGroup = document.querySelectorAll("#qunit-fixture .v-label-group .v-axis-label-wrapper");
			assert.equal(legendGroup.length, 3);
			assert.equal(legendGroup[0].textContent, "HT-1068");
			assert.equal(legendGroup[1].textContent, "HT-1113");
			assert.equal(legendGroup[2].textContent, "HT-1067");
			done();
		});
		oChart.bindData({
			path: sResultPath,
			length: 3
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("filter test", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			"chartType" :"column",
			"uiConfig" : {"applicationSet" : "fiori"},
			"isAnalytical" : true,
			"visibleDimensions" : ["CustomerName"],
			"visibleMeasures" : ["NetAmountInDisplayCurrency"]

		});
		oChart.addDimension(new Dimension({
			"name": "CustomerName"
		}));
		oChart.addMeasure(new Measure({unitBinding:"DisplayCurrency",name : "NetAmountInDisplayCurrency"}));
		var filter = new Filter({
			path: "CustomerName",
			operator: FilterOperator.EQ,
			value1: "JaTeCo"
		});
		oChart.attachRenderComplete(function() {
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			var legendGroup = document.querySelectorAll("#qunit-fixture .v-label-group .v-axis-label-wrapper");
			assert.equal(legendGroup.length, 1);
			assert.equal(legendGroup[0].textContent, "JaTeCo");
			done();
		});
		oChart.bindData({
			path: sResultPath,
			filters: [filter]
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.start();

});