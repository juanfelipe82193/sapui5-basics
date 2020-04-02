/*global QUnit, sinon */

QUnit.config.autostart = false;

sap.ui.require([
	'sap/chart/Chart',
	'sap/chart/data/Dimension',
	'sap/chart/data/TimeDimension',
	'sap/chart/data/Measure',
	'sap/chart/utils/RoleFitter',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/json/JSONModel',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/analytics/ODataModelAdapter',
	'sap/ui/model/analytics/AnalyticalTreeBindingAdapter',
	'sap/ui/layout/VerticalLayout',
	'sap/chart/utils/ChartTypeAdapterUtils'
], function(
	Chart,
	Dimension,
	TimeDimension,
	Measure,
	RoleFitter,
	Filter,
	FilterOperator,
	JSONModel,
	ODataModel,
	ODataModelAdapter,
	AnalyticalTreeBindingAdapter,
	VerticalLayout,
	ChartTypeAdapterUtils
) {
	"use strict";

	var sServiceURI = "http://anaChartFakeService:8080/";
	window.anaChartFakeService.fake({
		baseURI: sServiceURI
	});
	sinon.config.useFakeTimers = false;
	var sResultSet = "ActualPlannedCostsResults";
	var sResultPath = "/ActualPlannedCosts(P_ControllingArea='US01',P_CostCenter='100-1000',P_CostCenterTo='999-9999')/Results";


	var oModel, oVerticalLayout, oChart, sLocale;

	QUnit.module("AnalyticalChart", {
		beforeEach: function() {
			sLocale = sap.ui.getCore().getConfiguration().getLanguage();
			oModel = new ODataModel(sServiceURI, {
				json: true
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

	QUnit.test("role -> feed mapping (correct input only)", function(assert) {
		assert.expect(39);

		function genByRole(roles) {
			return {
				dim: (roles.dim || []).map(function(role, idx) {
					var Clz = role.bIsDate ? TimeDimension : Dimension;
					return new Clz({
						name: "d" + idx,
						role: role.bIsDate ? role.sRoleName : role
					});
				}),
				msr: (roles.msr || []).map(function(role, idx) {
					return new Measure({
						name: "m" + idx,
						role: role
					});
				})
			};
		}

		function compareFeeds(feed0, feed1) {
			if (feed0.uid < feed1.uid) {
				return -1;
			} else if (feed0.uid > feed1.uid) {
				return 1;
			} else {
				return 0;
			}
		}

		function extract(feeds) {
			return feeds.map(function(n) {
				return {
					type: n.getType(),
					uid: n.getUid(),
					values: n.getValues().map(function(v) {
						return (typeof v === "string") ? v  : v.getUid();
					})
				};
			}).sort(compareFeeds);
		}

		function match(cfg) {
			cfg.types.forEach(function(type) {
				var input = genByRole(cfg.input);
				type = ChartTypeAdapterUtils.adaptChartType(type, input.dim);
				assert.deepEqual(extract(RoleFitter.fit(type, input.dim, input.msr, [])), cfg.output.sort(compareFeeds), "is correct for \"" + type + "\" chart");
			});
		}

		var config = [{
			types: ["column", "bar", "stacked_bar", "stacked_column", "line", "100_stacked_bar", "100_stacked_column", "combination", "stacked_combination", "horizontal_stacked_combination"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis1", "axis2"]
			},
			output: [{
				"type": "Dimension",
				"uid": "categoryAxis",
				"values": ["d0", "d1"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0", "m1", "m2"]
			}]
		}, {
			types: ["dual_stacked_bar", "100_dual_stacked_bar", "dual_stacked_column", "100_dual_stacked_column", "dual_bar", "dual_column", "dual_line", "dual_combination", "dual_horizontal_combination", "dual_stacked_combination", "dual_horizontal_stacked_combination"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis1", "axis2"]
			},
			output: [{
				"type": "Dimension",
				"uid": "categoryAxis",
				"values": ["d0", "d1"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0", "m1"]
			}, {
				"type": "Measure",
				"uid": "valueAxis2",
				"values": ["m2"]
			}]
		}, {
			types: ["scatter"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis2"]
			},
			seriesType: "color",
			output: [{
				"type": "Dimension",
				"uid": "color",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis2",
				"values": ["m1"]
			}]
		}, {
			types: ["bubble", "time_bubble"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis2", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "color",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis2",
				"values": ["m1"]
			}, {
				"type": "Measure",
				"uid": "bubbleWidth",
				"values": ["m2"]
			}],
			seriesType: "color"
		}, {
			types: ["heatmap"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis2", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "categoryAxis",
				"values": ["d0", "d1"]
			}, {
				"type": "Dimension",
				"uid": "categoryAxis2",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "color",
				"values": ["m0"]
			}]
		}, {
			types: ["bullet", "vertical_bullet"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1", "axis2", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "categoryAxis",
				"values": ["d0", "d1"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d2"]
			}, {
				"type": "Measure",
				"uid": "actualValues",
				"values": ["m0", "m1", "m2"]
			}]
		}, {
			types: ["pie", "donut"],
			input: {
				dim: ["category", "category", "series"],
				msr: ["axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "color",
				"values": ["d0", "d1", "d2"]
			}, {
				"type": "Measure",
				"uid": "size",
				"values": ["m0"]
			}]
		}, {
			// line adapt to timeseries_line
			types: ["line"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}, "series", "series"],
				msr: ["axis1", "axis2", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d1", "d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0", "m1", "m2"]
			}]
		}, {
			// column adapt to timeseries_column
			types: ["column"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}],
				msr: ["axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}]
		}, {
			// bubble adapt to timeseries_bubble
			types: ["bubble"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}, "series", "series"],
				msr: ["axis1", "axis3"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d1", "d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}, {
				"type": "Measure",
				"uid": "bubbleWidth",
				"values": ["m1"]
			}],
			seriesType: "color"
		}, {
			// scatter adapt to timeseries_scatter
			types: ["scatter"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}, "series", "series"],
				msr: ["axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d1", "d2"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}],
			seriesType: "color"
		}, {
			// combination adapt to timeseries_combination
			types: ["combination"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}],
				msr: ["axis1", "axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0", "m1"]
			}]
		}, {
			// dual_combination adapt to dual_timeseries_combination
			types: ["dual_combination"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}],
				msr: ["axis1", "axis2"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis2",
				"values": ["m1"]
			}]
		}, {
			// stacked_column adapt to timeseries_stacked_column
			types: ["stacked_column"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}, "series"],
				msr: ["axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d1"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}],
			seriesType: "color"
		}, {
			// 100_stacked_column adapt to timeseries_100_stacked_column
			types: ["100_stacked_column"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}, "series"],
				msr: ["axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Dimension",
				"uid": "color",
				"values": ["d1"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}],
			seriesType: "color"
		}, {
			// bullet adapt to timeseries_bullet
			types: ["vertical_bullet"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}],
				msr: ["axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Measure",
				"uid": "actualValues",
				"values": ["m0"]
			}],
			seriesType: "color"
		}, {
			// waterfall adapt to timeseries_waterfall
			types: ["waterfall"],
			input: {
				dim: [{sRoleName: "category", bIsDate: true}],
				msr: ["axis1"]
			},
			output: [{
				"type": "Dimension",
				"uid": "timeAxis",
				"values": ["d0"]
			}, {
				"type": "Measure",
				"uid": "valueAxis",
				"values": ["m0"]
			}],
			seriesType: "color"
		}];

		config.forEach(match);
	});

	QUnit.test("Create Chart with ODataModel", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachRenderComplete(null, function onRenderComplete(oEvent) {
			oChart.detachRenderComplete(onRenderComplete);
			assert.equal(oEvent.getSource(), oChart, "renderComplete event is correct");
			assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
			done();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Chart API test", function(assert) {
		var done = assert.async();
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'vizProperties': {
				interaction: {
					zoom: {
						enablement: "enabled"
					}
				}
			},
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachRenderComplete(null, function onRenderComplete(oEvent) {
			oChart.detachRenderComplete(onRenderComplete);
			var oldSize = document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint")[0].getBBox();
			oChart.zoom({
				direction: "in"
			});
			var newSize = document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint")[0].getBBox();
			assert.ok(oldSize.width < newSize.width, "zoom API is correct");
			assert.equal(oChart.getVizUid(), oChart.getAggregation("_vizFrame").getVizUid(), "getVizUid API is correct");
			done();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Properties test (ported)", function(assert) {
		var done = assert.async();
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'vizProperties': {
				valueAxis: {
					title: {
						text: "123"
					}
				},
				legend: {
					visible: true
				},
				interaction: {
					zoom: {
						enablement: "enabled"
					}
				}
			},
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb(oEvent) {
			assert.equal(oChart.getChartType(), "column", "get chartType is correct");
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setChartTypeCb);
			oChart.setChartType("line");
		}

		oChart.attachRenderComplete(null, initRenderCb);

		function setChartTypeCb(oEvent) {
			assert.equal(oChart.getChartType(), "line", "set chartType is correct");
			assert.equal(document.querySelectorAll("#qunit-fixture .v-datapoint-group .v-lines").length, 2, "chart type is switched");
			oChart.detachRenderComplete(setChartTypeCb);
			assert.equal(oChart.getVizProperties().valueAxis.title.text, "123", "get vizProperties is correct");
			oChart.attachRenderComplete(null, setVizPropertiesCb);
			oChart.setVizProperties({
				valueAxis: {
					title: {
						text: "ABC"
					}
				}
			});
		}

		function setVizPropertiesCb(oEvent) {
			assert.equal(oChart.getVizProperties().valueAxis.title.text, "ABC", "set vizProperties is correct");
			assert.equal(document.querySelector("#qunit-fixture .v-m-valueAxis .v-m-axisTitle").textContent, "ABC", "vizProperties is updated");
			oChart.detachRenderComplete(setVizPropertiesCb);
			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Properties (visibleDimensions & visibleMeasures) test", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb() {
			assert.deepEqual(oChart.getVisibleMeasures(), ["ActualCosts", "PlannedCosts"], "get visibleMeasures is correct");
			assert.deepEqual(oChart.getVisibleDimensions(), ["CostElement"], "get visibleDimensions is correct");
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setVisibleMeasuresCb1);
			oChart.setVisibleMeasures(["ActualCosts"]);
		}

		function setVisibleMeasuresCb1() {
			var aLegendItemDoms = document.querySelectorAll("#qunit-fixture .v-legend-item");
			assert.equal(aLegendItemDoms[0].textContent, "Actual Costs", "set visibleMeasures to different items is correct");
			oChart.detachRenderComplete(setVisibleMeasuresCb1);
			oChart.attachRenderComplete(null, setVisibleMeasuresCb2);
			oChart.setVisibleMeasures(["PlannedCosts", "ActualCosts"]);
		}

		function setVisibleMeasuresCb2() {
			var aLegendItemDoms = document.querySelectorAll("#qunit-fixture .v-legend-item");
			assert.deepEqual(Array.prototype.map.call(aLegendItemDoms, function(d) {
				return d.textContent;
			}), ["Planned Costs", "Actual Costs"], "set visibleMeasurs to different order is correct");
			oChart.detachRenderComplete(setVisibleMeasuresCb2);
			oChart.attachRenderComplete(null, setVisibleDimensionsCb1);
			oChart.setVisibleDimensions(["CostElement", "CostCenter"]);
		}

		function setVisibleDimensionsCb1() {
			assert.equal(document.querySelector("#qunit-fixture .v-m-categoryAxis .v-title").textContent, "Cost Element / Cost Center", "set visibleDimensions to different items is correct");
			oChart.detachRenderComplete(setVisibleDimensionsCb1);
			oChart.attachRenderComplete(null, setVisibleDimensionsCb2);
			oChart.setVisibleDimensions(["CostCenter", "CostElement"]);
		}

		function setVisibleDimensionsCb2() {
			assert.equal(document.querySelector("#qunit-fixture .v-m-categoryAxis .v-title").textContent, "Cost Center / Cost Element", "set visibleDimensions to different order is correct");
			oChart.detachRenderComplete(setVisibleDimensionsCb2);
			done();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Properties (Dimensions) test", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb() {
			var oCostElement = oChart.getDimensions().filter(function(oDim) {
				return oDim.getName() === "CostElement";
			})[0];
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setLabelCb);
			oCostElement.setLabel("Mooooo");
		}

		function setLabelCb() {
			assert.equal(document.querySelector("#qunit-fixture .v-m-categoryAxis .v-title").textContent, "Mooooo", "dimension label is correct");
			oChart.detachRenderComplete(setLabelCb);
			oChart.attachRenderComplete(null, setTextFormatterCb);
			var oCostElement = oChart.getDimensions().filter(function(oDim) {
				return oDim.getName() === "CostElement";
			})[0];
			oCostElement.setTextFormatter(function(id) {
				if (id === "400020") {
					return "Desk";
				} else {
					return id;
				}
			});
		}

		function setTextFormatterCb() {
			assert.equal(document.querySelectorAll("#qunit-fixture .v-m-categoryAxis .v-label-group g")[0].textContent, "Desk", "dimension textFormatter is correct");
			oChart.detachRenderComplete(setTextFormatterCb);
			oChart.attachRenderComplete(null, setRoleCb);
			var oCostElement = oChart.getDimensions().filter(function(oDim) {
				return oDim.getName() === "CostElement";
			})[0];
			oCostElement.setRole("series");
		}

		function setRoleCb() {
			oChart.detachRenderComplete(setRoleCb);
			assert.equal(document.querySelectorAll("#qunit-fixture .v-m-legend .v-legend-item")[0].textContent, "Desk", "dimension role is correct");
			done();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Properties (Measures) test", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'scatter',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.addMeasure(new Measure({
			name: "ActualCosts",
			role: "axis1"
		}));
		oChart.addMeasure(new Measure({
			name: "PlannedCosts",
			role: "axis2"
		}));

		oChart.addDimension(new Dimension({
			name: "CostElement",
			role: "category"
		}));
		oChart.addDimension(new Dimension({
			name: "CostCenter",
			role: "category"
		}));

		function initRenderCb() {
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setLabelCb);
			var oActualCosts = oChart.getMeasures().filter(function(oMsr) {
				return oMsr.getName() === "ActualCosts";
			})[0];
			oActualCosts.setLabel("Mooooo");
		}

		function setLabelCb() {
			oChart.detachRenderComplete(setLabelCb);
			oChart.attachRenderComplete(null, setRoleCb);
			assert.equal(document.querySelector("#qunit-fixture .v-m-valueAxis .v-m-axisTitle text").textContent, "Mooooo", "measure label is correct");
			var aMeasures = oChart.getMeasures(),
				oPlannedCosts = aMeasures.filter(function(oMsr) {
					return oMsr.getName() === "PlannedCosts";
				})[0],
				oActualCosts = aMeasures.filter(function(oMsr) {
					return oMsr.getName() === "ActualCosts";
				})[0];
			oPlannedCosts.setRole("axis1");
			oActualCosts.setRole("axis2");
		}

		function setRoleCb() {
			assert.equal(document.querySelector("#qunit-fixture .v-m-valueAxis2 .v-m-axisTitle text").textContent, "Mooooo", "measure role is correct");
			done();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Properties (DisplayName test)", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'Currency'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		var semanticRule = {
			plotArea: {
				dataPointStyle:{
					rules:[{
						dataContext:{'CostElement':{'equal':'400020'}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'CostElement':{'equal':null}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'CostElement':{'equal':undefined}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'CostElement':{'equal':''}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'Currency':{'equal':'USD'}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'Currency':{'equal':null}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'Currency':{'equal':undefined}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'Currency':{'equal':''}},
						properties: {'color': 'Yellow'}
					}]
				}
			}
		};
		oChart.setVizProperties(semanticRule);

		oChart.attachRenderComplete(null, initRenderCb);

		function initRenderCb() {
			var sDisplayName0 = oChart.getVizProperties().plotArea.dataPointStyle.rules[0].displayName;
			assert.equal(sDisplayName0, "Flights", "get displayName with D and V and equal value in dataset is correct");
			var sDisplayName1 = oChart.getVizProperties().plotArea.dataPointStyle.rules[1].displayName;
			assert.equal(sDisplayName1, undefined, "get displayName with D and V but equal 'null' is correct");
			var sDisplayName2 = oChart.getVizProperties().plotArea.dataPointStyle.rules[2].displayName;
			assert.equal(sDisplayName2, undefined, "get displayName with D and V but equal 'undefined' is correct");
			var sDisplayName3 = oChart.getVizProperties().plotArea.dataPointStyle.rules[3].displayName;
			assert.equal(sDisplayName3, undefined, "get displayName with D and V but equal value not in dataset is correct");
			var sDisplayName4 = oChart.getVizProperties().plotArea.dataPointStyle.rules[4].displayName;
			assert.equal(sDisplayName4, "USD", "get displayName only with V and equal value in dataset is correct");
			var sDisplayName5 = oChart.getVizProperties().plotArea.dataPointStyle.rules[5].displayName;
			assert.equal(sDisplayName5, undefined, "get displayName only with V but equal 'null' is correct");
			var sDisplayName6 = oChart.getVizProperties().plotArea.dataPointStyle.rules[6].displayName;
			assert.equal(sDisplayName6, undefined, "get displayName only with V but equal 'undefined' is correct");
			var sDisplayName7 = oChart.getVizProperties().plotArea.dataPointStyle.rules[7].displayName;
			assert.equal(sDisplayName7, undefined, "get displayName only with V but equal value not in dataset is correct");
			oChart.detachRenderComplete(initRenderCb);
			done();
		}

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
		});

	QUnit.test("Properties (DisplayName test2)", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'Currency'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		var semanticRule = {
			plotArea: {
				dataPointStyle:{
					rules:[{
						dataContext:{'CostElement':{'equal':'400020'}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'CostElement':{'equal':null}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'CostElement':{'equal':undefined}},
						properties: {'color': 'Yellow'}
					},{
						dataContext:{'CostElement':{'equal':''}},
						properties: {'color': 'Yellow'}
					}]
				}
			}
		};

		oChart.attachRenderComplete(null, initRenderCb);
		oChart.setVizProperties(semanticRule);
		oChart.getDimensionByName("CostElement").setTextProperty(null);

		function initRenderCb() {
			var sDisplayName0 = oChart.getVizProperties().plotArea.dataPointStyle.rules[0].displayName;
			assert.equal(sDisplayName0, '400020', "get displayName with D(null) and V and equal value in dataset is correct");
			var sDisplayName1 = oChart.getVizProperties().plotArea.dataPointStyle.rules[1].displayName;
			assert.equal(sDisplayName1, undefined, "get displayName with D(null) and V but equal 'null' is correct");
			var sDisplayName2 = oChart.getVizProperties().plotArea.dataPointStyle.rules[2].displayName;
			assert.equal(sDisplayName2, undefined, "get displayName with D(null) and V but equal 'undefined' is correct");
			var sDisplayName3 = oChart.getVizProperties().plotArea.dataPointStyle.rules[3].displayName;
			assert.equal(sDisplayName3, undefined, "get displayName with D(null) and V but equal value not in dataset is correct");
			oChart.detachRenderComplete(initRenderCb);
			done();
		}

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
		});



	QUnit.test("drillDown/drillUp (w/o selection) test", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function assertDimMsr(expected, msg) {
			assert.deepEqual({
				dim: oChart.getVisibleDimensions(),
				msr: oChart.getVisibleMeasures()
			}, expected, msg);
		}

		function initRenderCb() {
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, ddOnOneCb);
			oChart.drillDown("CostCenter");
		}

		function ddOnOneCb() {
			oChart.detachRenderComplete(ddOnOneCb);
			assertDimMsr({
				dim: ["CostElement", "CostCenter"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill down on a single Dimension is correct");
			oChart.attachRenderComplete(null, ddOnTwoCb);
			oChart.drillDown(["FiscalYear", "ControllingArea"]);
		}

		function ddOnTwoCb() {
			oChart.detachRenderComplete(ddOnTwoCb);
			assertDimMsr({
				dim: ["CostElement", "CostCenter", "FiscalYear", "ControllingArea"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill down on multiple Dimensions is correct");
			oChart.attachRenderComplete(null, duFromTwoCb);
			oChart.drillUp();
		}

		function duFromTwoCb() {
			oChart.detachRenderComplete(duFromTwoCb);
			assertDimMsr({
				dim: ["CostElement", "CostCenter"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill up from a multi-Dimension drill down is correct");
			oChart.attachRenderComplete(null, duFromOneCb);
			oChart.drillUp();
		}

		function duFromOneCb() {
			oChart.detachRenderComplete(duFromOneCb);
			assertDimMsr({
				dim: ["CostElement"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill up from a single-Dimension drill down is correct");
			oChart.attachRenderComplete(null, resetForDrillUpCb);
			oChart.setVisibleDimensions(["CostCenter", "CostElement"]);
		}

		function resetForDrillUpCb() {
			assertDimMsr({
				dim: ["CostCenter", "CostElement"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "setVisibleDimension resets the drill state");
			oChart.detachRenderComplete(resetForDrillUpCb);
			oChart.attachRenderComplete(null, duFromBeginningOneCb);
			oChart.drillUp();
		}

		function duFromBeginningOneCb() {
			oChart.detachRenderComplete(duFromBeginningOneCb);
			assertDimMsr({
				dim: ["CostCenter"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill up from an empty drill down is correct");
			oChart.attachRenderComplete(null, duFromBeginningTwoCb);
			oChart.drillUp();
		}

		function duFromBeginningTwoCb() {
			oChart.detachRenderComplete(duFromBeginningTwoCb);
			assertDimMsr({
				dim: [],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "drill up *again* from a single-Dimension drill down is correct");
			oChart.attachRenderComplete(null, resetForSetVisibleMeasuresCb);
			oChart.setVisibleDimensions(["CostCenter", "CostElement"]);
		}

		function resetForSetVisibleMeasuresCb() {
			assertDimMsr({
				dim: ["CostCenter", "CostElement"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "setVisibleDimension resets the drill state");
			oChart.detachRenderComplete(resetForSetVisibleMeasuresCb);
			oChart.attachRenderComplete(null, setByVisibleMeasuresDrillCb);
			oChart.setVisibleMeasures(["ActualCosts"]);
		}

		function setByVisibleMeasuresDrillCb() {
			oChart.detachRenderComplete(setByVisibleMeasuresDrillCb);
			assertDimMsr({
				dim: ["CostCenter", "CostElement"],
				msr: ["ActualCosts"]
			}, "setVisibleMeasures only change the drillStack top");

			oChart.attachRenderComplete(null, prepareDrillStateCb);
			oChart.setVisibleMeasures(["ActualCosts", "PlannedCosts"]);
			oChart.drillDown(["ControllingArea", "FiscalYear"]);
		}

		function prepareDrillStateCb() {
			oChart.detachRenderComplete(prepareDrillStateCb);
			var oDim = oChart.getDimensions().filter(function(d) {
					return d.getName() === "ControllingArea";
				})[0],
				oMsr = oChart.getMeasures()[0],
				reference = {
					dim: ["CostCenter", "CostElement", "ControllingArea", "FiscalYear"],
					msr: ["ActualCosts", "PlannedCosts"]
				};
			oDim.setRole("series");
			assertDimMsr(reference, "changing Dimension role property does not alter drill state");
			oDim.setLabel("Some Dimension");
			assertDimMsr(reference, "changing Dimension label property does not alter drill state");
			oDim.setDisplayText(false);
			assertDimMsr(reference, "changing Dimension displayText property does not alter drill state");
			oDim.setTextFormatter(function(id) {
				return "[" + id + "]";
			});

			oMsr.setRole("axis2");
			assertDimMsr(reference, "changing Measure role property does not alter drill state");
			oMsr.setLabel("Random Measure");
			assertDimMsr(reference, "changing Measure label property does not alter drill state");

			oChart.attachRenderComplete(null, removeDimensionCb);
			oChart.removeDimension(oDim);
		}

		function removeDimensionCb() {
			oChart.detachRenderComplete(removeDimensionCb);
			assertDimMsr({
				dim: ["CostCenter", "CostElement", "FiscalYear"],
				msr: ["ActualCosts", "PlannedCosts"]
			}, "removing Dimension resets drill state");
			done();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("drillDown/drillUp (with selection) test", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				plotArea: {
					'window': {
						'start': null
					}
				},
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function dpContexts() {
			var doms = document.querySelectorAll("#qunit-fixture .v-datapoint");
			return Array.prototype.map.call(doms, function(d) {
				return d.__data__;
			});
		}

		function ddWith(dim, data) {
			if (!(data instanceof Array)) {
				data = [data];
			}
			data = data.map(function(d) {
				return {
					data: d
				};
			});
			oChart._getVizFrame().vizSelection(data);
			var selection = oChart._getVizFrame().vizSelection();
			oChart.drillDown(dim);
			return selection.map(function(s) {
				return s.data;
			});
		}

		var aData, aSelection;

		function resetTo(fn) {
			oChart.attachRenderComplete(null, function onRenderComplete() {
				oChart.detachRenderComplete(onRenderComplete);
				fn();
			});
			oChart.resetLayout();
		}

		function initRenderCb() {
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, ddOnOneCb);
			aSelection = ddWith("FiscalPeriod", {
				CostElement: "410050"
			});
		}

		function ddOnOneCb() {
			oChart.detachRenderComplete(ddOnOneCb);
			aData = dpContexts();
			assert.ok(aData.every(function(d) {
				return !d.hasOwnProperty("CostElement");
			}), "drilldown with a single selected category hides the corresponding Dimension from result");
			resetTo(ddOnNestedCb);
		}

		function ddOnNestedCb() {
			oChart.attachRenderComplete(null, function onRenderComplete() {
				oChart.detachRenderComplete(onRenderComplete);
				aData = dpContexts();
				assert.ok(aData.every(function(d) {
					return !d.hasOwnProperty("CostElement") && !d.hasOwnProperty("CostCenter");
				}), "drilldown with a nested category selected hides both that Dimension and the Dimensions of its parents level categories");
				resetTo(ddSingleDpCb);
			});
			aSelection = ddWith("FiscalPeriod", {
				CostElement: "410050",
				CostCenter: "100-1100"
			});
		}

		function ddSingleDpCb() {
			oChart.attachRenderComplete(null, function onRenderComplete() {
				oChart.detachRenderComplete(onRenderComplete);
				aData = dpContexts();
				assert.ok(aData.every(function(d) {
					return !d.hasOwnProperty("CostElement") && !d.hasOwnProperty("CostCenter") && d.measureNames === "ActualCosts";
				}), "drilldown with a single datapoint selection hides Dimensions of all categories along with other Measures");
				resetTo(ddMixedCb);
			});
			aSelection = ddWith("FiscalPeriod", {
				CostElement: "410050",
				CostCenter: "100-1100",
				measureNames: "ActualCosts"
			});
		}

		function ddMixedCb() {
			oChart.attachRenderComplete(null, function onRenderComplete() {
				oChart.detachRenderComplete(onRenderComplete);
				aData = dpContexts();
				var selectedCostCenters = aSelection.reduce(function(m, s) {
					m[s.CostCenter] = 0;
					return m;
				}, {});
				assert.ok(aData.every(function(d) {
					if (d.CostElement === "410050") {
						return d.CostCenter === "100-1100";
					} else if (d.CostElement === "400020") {
						if (selectedCostCenters.hasOwnProperty(d.CostCenter)) {
							selectedCostCenters[d.CostCenter] += 1;
							return true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}) && Object.keys(selectedCostCenters).every(function(cc) {
					return selectedCostCenters[cc] > 0;
				}), "drilldown with mixed selection is correct");
				done();
			});
			aSelection = ddWith("FiscalPeriod", [{
				CostElement: "400020"
			}, {
				CostElement: "410050",
				CostCenter: "100-1100"
			}]);
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("selectionMode test", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionMode': 'SINGLE',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			assert.equal(oChart._getVizFrame().getVizProperties().interaction.selectability.mode, "SINGLE", "selectionMode can be set via constructor parameter");
			assert.equal(oChart.getSelectionMode(), "SINGLE", "getSelectionMode() is correct");
			oChart.setSelectionMode("MULTIPLE");
			assert.equal(oChart.getSelectionMode(), "MULTIPLE", "setSelectionMode() is correct");
			oChart.setVizProperties({"interaction.selectability.mode": "SINGLE"});
			assert.equal(oChart._getVizFrame().getVizProperties().interaction.selectability.mode.toLowerCase(), "multiple", "selectionMode blacklists the \"interaction.selectability.mode\" property");
			oChart.setVizProperties({interaction: {selectability: {mode: "SINGLE"}}});
			assert.equal(oChart._getVizFrame().getVizProperties().interaction.selectability.mode.toLowerCase(), "multiple", "selectionMode blacklists the {interaction: {selectability: { mode: }}} property");

			done();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("selectionBehavior test", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'DATAPOINT',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			assert.equal(oChart._getVizFrame().getVizProperties().interaction.selectability.behavior, "DATAPOINT", "selectionBehavior can be set via constructor parameter");
			assert.equal(oChart.getSelectionBehavior(), "DATAPOINT", "getSelectionBehavior() is correct");
			oChart.setSelectionBehavior("CATEGORY");
			assert.equal(oChart.getSelectionBehavior(), "CATEGORY", "setSelectionBehavior() is correct");
			oChart.setVizProperties({"interaction.selectability.behavior": "SERIES"});
			assert.equal(oChart._getVizFrame().getVizProperties().interaction.selectability.behavior.toLowerCase(), "category", "selectionBehavior blacklists the \"interaction.selectability.behavior\" property");
			oChart.setVizProperties({interaction: {selectability: {behavior: "SERIES"}}});
			assert.equal(oChart._getVizFrame().getVizProperties().interaction.selectability.behavior.toLowerCase(), "category", "selectionBehavior blacklists the {interaction: {selectability: { behavior: }}} property");

			done();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Selection [DATAPOINT]", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'DATAPOINT',
			'selectionMode': 'MULTIPLE',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			var oCE = oChart.getDimensionByName("CostElement");
			oCE.setRole("series");
			oChart.attachEventOnce("renderComplete", initCb);
		});

		function dataPointEqual(actual, expected, message) {
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

		function initCb() {
			oChart.setSelectedDataPoints([{index: 3, measures: ["ActualCosts", "PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":3,"measures":["ActualCosts","PlannedCosts"],"context":{"ActualCosts":"12521","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"417900","CostElementText":"Third Party","Currency":"USD","PlannedCosts":"20000"}}],
				"count":2
			}, "getSelectedDataPoints() is correct");
			oChart.addSelectedDataPoints([{index: 2, measures: ["PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":2,"measures":["PlannedCosts"],"context":{"ActualCosts":"44532","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"410050","CostElementText":"Rental Cars","Currency":"USD","PlannedCosts":"43000"}},
							  {"index":3,"measures":["ActualCosts","PlannedCosts"],"context":{"ActualCosts":"12521","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"417900","CostElementText":"Third Party","Currency":"USD","PlannedCosts":"20000"}}],
				"count":3
			}, "addSelectedDataPoints() is correct");
			oChart.removeSelectedDataPoints([{index: 3, measures: ["PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":2,"measures":["PlannedCosts"],"context":{"ActualCosts":"44532","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"410050","CostElementText":"Rental Cars","Currency":"USD","PlannedCosts":"43000"}},
							  {"index":3,"measures":["ActualCosts"],"context":{"ActualCosts":"12521","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"417900","CostElementText":"Third Party","Currency":"USD","PlannedCosts":"20000"}}],
				"count":2
			}, "removeSelectedDataPoints() is correct");
			oChart.setSelectedDataPoints([{index: 5, measures: ["ActualCosts"]},{index: 6, measures: ["ActualCosts", "PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":5,"measures":["ActualCosts"],"context":{"ActualCosts":"675652","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"430100","CostElementText":"Salaries & Wages","Currency":"USD","PlannedCosts":"670000"}},
							  {"index":6,"measures":["ActualCosts","PlannedCosts"],"context":{"ActualCosts":"131254","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"435000","CostElementText":"Annual Bonus","Currency":"USD","PlannedCosts":"130000"}}],
				"count":3
			}, "setSelectedDataPoints() is correct");
			oChart.setSelectionMode("SINGLE");
			oChart.setSelectedDataPoints([{index: 5, measures: ["ActualCosts"]}]);
			oChart.addSelectedDataPoints([{index: 2, measures: ["PlannedCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":2,"measures":["PlannedCosts"],"context":{"ActualCosts":"44532","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"410050","CostElementText":"Rental Cars","Currency":"USD","PlannedCosts":"43000"}},
							  {"index":5,"measures":["ActualCosts"],"context":{"ActualCosts":"675652","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"430100","CostElementText":"Salaries & Wages","Currency":"USD","PlannedCosts":"670000"}}],
				"count":2
			}, "addSelectedDataPoints() works regardlessly of selectionMode");
			oChart.setSelectedDataPoints([{index: 2, measures: ["ActualCosts"]}]);
			dataPointEqual(oChart.getSelectedDataPoints(), {
				"dataPoints":[{"index":2,"measures":["ActualCosts"],"context":{"ActualCosts":"44532","CostCenter":"100-1000","CostCenterText":"Consulting US","CostElement":"410050","CostElementText":"Rental Cars","Currency":"USD","PlannedCosts":"43000"}}],
				"count":1
			}, "setSelectedDataPoints() works regardlessly of selectionMode");
			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Selection [DATAPOINT] with unit and dataName", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				"plotArea": {
				"dataPointStyleMode": "update",
				"dataPointStyle": {
					"rules": [{
						"dataContext": {"CostElement":{"equal":"400020"}},
						"properties": {
							"color": "red"
						},
						"dataName":{
							 "ActualCosts": "TEST"
						}
					}],
					"others": {
						"properties": {
							"color":"blue"
						},
						"dataName": "Others"
					}
				}}
			},
			'selectionBehavior': 'DATAPOINT',
			'selectionMode': 'MULTIPLE',
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			oChart.setSelectedDataPoints([{index: 0, measures: ["ActualCosts", "PlannedCosts"]}]);
			var result = oChart.getSelectedDataPoints();
			result.dataPoints.forEach(function(datapoint){delete datapoint.context;});
			assert.deepEqual(result, {
				"dataPoints":[{"index":0,"measures":["ActualCosts","PlannedCosts"],"unit":{"ActualCosts":"USD"},"dataName":{"ActualCosts":"TEST"}}],
				"count":2
			}, "return unit and dataName in selection datapoint");
			oChart.setSelectedDataPoints([{index: 1, measures: ["ActualCosts", "PlannedCosts"]}]);
			result = oChart.getSelectedDataPoints();
			result.dataPoints.forEach(function(datapoint){delete datapoint.context;});
			assert.deepEqual(result, {
				"dataPoints":[{"index":1,"measures":["ActualCosts","PlannedCosts"],"unit":{"ActualCosts":"USD"}}],
				"count":2
			}, "return unit in selection datapoint");
			oChart.setSelectedDataPoints([{index: 1, measures: ["PlannedCosts"]}]);
			result = oChart.getSelectedDataPoints();
			result.dataPoints.forEach(function(datapoint){delete datapoint.context;});
			assert.deepEqual(result, {
				"dataPoints":[{"index":1,"measures":["PlannedCosts"]}],
				"count":1
			}, "getSelectedDataPoints() is correct");
			done();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);
		var oMsr = oChart.getMeasureByName("ActualCosts");
		oMsr.setUnitBinding("Currency");

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Selection [SERIES]", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'SERIES',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", function() {
			var oCE = oChart.getDimensionByName("CostElement");
			oCE.setRole("series");
			oChart.attachEventOnce("renderComplete", initCb);
		});

		function initCb() {
			oChart.setSelectedSeries([{measures: "ActualCosts", dimensions: {CostElement: "400020"}}]);
			assert.deepEqual(oChart.getSelectedSeries(), {
				"count":9,
				"series":[{"dimensions":{"CostElement":"400020"},"measures":"ActualCosts"}]
			}, "getSelectedSeries() is correct.");
			oChart.addSelectedSeries([{measures: "PlannedCosts", dimensions: {CostElement: "400021"}}]);
			assert.deepEqual(oChart.getSelectedSeries(), {
				"count":18,
				"series":[{"dimensions":{"CostElement":"400020"},"measures":"ActualCosts"},
						  {"dimensions":{"CostElement":"400021"},"measures":"PlannedCosts"}]
			}, "addSelectedSeries() is correct.");
			oChart.removeSelectedSeries([{measures: "ActualCosts", dimensions: {CostElement: "400020"}}]);
			assert.deepEqual(oChart.getSelectedSeries(), {
				"count":9,
				"series":[{"dimensions":{"CostElement":"400021"},"measures":"PlannedCosts"}]
			}, "removeSelectedSeries() is correct.");
			oChart.setSelectedSeries([{measures: "ActualCosts", dimensions: {CostElement: "400020"}}]);
			assert.deepEqual(oChart.getSelectedSeries(), {
				"count":9,
				"series":[{"dimensions":{"CostElement":"400020"},"measures":"ActualCosts"}]
			}, "setSelectedSeries() is correct.");
			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Selection [CATEGORY]", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'CATEGORY',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", initCb);

		function initCb() {
			oChart.setSelectedCategories([{dimensions: {CostElement: "400020"}}]);
			assert.deepEqual(oChart.getSelectedCategories(), {
				"categories": [
					{ "dimensions": { "CostCenter": "100-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "100-1100", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-2000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-3000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-4000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-5000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-2000", "CostElement": "400020" } }
				], "count": 18 }, "getSelectedCategories() is correct.");
			oChart.addSelectedCategories([{dimensions: {CostElement: "400021", CostCenter: "100-1000"}}]);
			assert.deepEqual(oChart.getSelectedCategories(), {
				"categories": [
					{"dimensions": { "CostCenter": "100-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "100-1100", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-2000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-3000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-4000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-5000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-2000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "100-1000", "CostElement": "400021" } }
				],"count": 20 }, "addSelectedCategories() is correct.");
			oChart.removeSelectedCategories([{dimensions: {CostElement: "400020", CostCenter: "100-1000"}}]);
			assert.deepEqual(oChart.getSelectedCategories(), {
				"categories": [
					{ "dimensions": { "CostCenter": "100-1100", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-2000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-3000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-4000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-5000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-2000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "100-1000", "CostElement": "400021" } }
				], "count": 18 }, "removeSelectedSeries() is correct.");
			oChart.setSelectedCategories([{dimensions: {CostElement: "400020"}}, {dimensions: {CostElement: "400021"}}]);
			assert.deepEqual(oChart.getSelectedCategories(),  {
				"categories": [
					{ "dimensions": { "CostCenter": "100-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "100-1100", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-2000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-3000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-4000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-5000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-2000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "100-1000", "CostElement": "400021" } },
					{ "dimensions": { "CostCenter": "100-1100", "CostElement": "400021" } },
					{ "dimensions": { "CostCenter": "200-1000", "CostElement": "400021" } },
					{ "dimensions": { "CostCenter": "200-2000", "CostElement": "400021" } },
					{ "dimensions": { "CostCenter": "200-3000", "CostElement": "400021" } },
					{ "dimensions": { "CostCenter": "200-4000", "CostElement": "400021" } },
					{ "dimensions": { "CostCenter": "200-5000", "CostElement": "400021" } },
					{ "dimensions": { "CostCenter": "300-1000", "CostElement": "400021" } },
					{ "dimensions": { "CostCenter": "300-2000", "CostElement": "400021" } }
				], "count": 36 }, "setSelectedCategories() is correct(MULTIPLE).");
			oChart.setSelectionMode("SINGLE");
			oChart.setSelectedCategories([{dimensions: {CostElement: "400020"}}]);
			assert.deepEqual(oChart.getSelectedCategories(), {
				"categories": [
					{ "dimensions": { "CostCenter": "100-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "100-1100", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-2000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-3000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-4000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "200-5000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-1000", "CostElement": "400020" } },
					{ "dimensions": { "CostCenter": "300-2000", "CostElement": "400020" } }
				], "count": 18 }, "setSelectedCategories() is correct(SINGLE).");
			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Selection [MODE = NONE]", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionMode': 'NONE',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", initCb);

		function initCb() {
			oChart.setSelectedDataPoints([{index: 3, measures: ["ActualCosts", "PlannedCosts"]}]);
			assert.deepEqual(oChart.getSelectedDataPoints(), {
				"count":0,
				"dataPoints":[]
			}, "setSelectedDataPoints() disabled");
			oChart.addSelectedDataPoints([{index: 3, measures: ["ActualCosts", "PlannedCosts"]}]);
			assert.deepEqual(oChart.getSelectedDataPoints(), {
				"count":0,
				"dataPoints":[]
			}, "addSelectedDataPoints() disabled.");
			oChart.removeSelectedDataPoints([{index: 3, measures: ["ActualCosts", "PlannedCosts"]}]);
			assert.deepEqual(oChart.getSelectedDataPoints(), {
				"count":0,
				"dataPoints":[]
			}, "removeSelectedDataPoints() disabled.");

			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Rendering", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'CATEGORY',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", initCb);

		function initCb() {
			assert.equal(document.querySelectorAll("#qunit-fixture .ui5-viz-controls-app").length, 1, "Chart does not create extra DOM node.");
			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Supported Chart Types and Localized Chart Names", function(assert) {
		function getBarName(sLocale) {
			sap.ui.getCore().getConfiguration().setLanguage(sLocale);
			sLocale = sLocale || sap.ui.getCore().getConfiguration().getLanguage();
			return sap.chart.api.getChartTypes().bar;
		}

		var aLocales = ["en", "de", "zh_CN", "it", "ko"];
		var aNames = ["Bar Chart", "Balkendiagramm", "\u6761\u5F62\u56FE", "Grafico a barre", "\uB9C9\uB300\uD615 \uCC28\uD2B8"];
		assert.ok(aLocales.every(function(loc, i) {
			return getBarName(loc) === aNames[i];
		}), "getChartTypes is correct.");
	});

	QUnit.test("Available Chart Types using current binding", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'CATEGORY',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});


		oChart.attachEventOnce("renderComplete", feeding2By2);

		function wrap(availability) {
			var result = {};
			availability.available.forEach(function(obj) {
				result[obj.chart] = true;
			});
			availability.unavailable.forEach(function(obj) {
				result[obj.chart] = false;
			});
			return result;
		}

		function feeding2By2() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			assert.ok(mResult.bar && mResult.combination && mResult.dual_line && !mResult.bubble, "Dim x2 & Msr x2 is correct");
			oChart.attachEventOnce("renderComplete", feeding2By1);
			oChart.setVisibleMeasures(["ActualCosts"]);
		}

		function feeding2By1() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			assert.ok(mResult.bar && !mResult.combination && !mResult.dual_line && !mResult.bubble, "Dim x2 & Msr x1 is correct");
			oChart.attachEventOnce("renderComplete", feeding1By2);
			oChart.setVisibleDimensions(['CostElement']);
			oChart.setVisibleMeasures(['ActualCosts', 'PlannedCosts']);
		}

		function feeding1By2() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			assert.ok(mResult.bar && mResult.combination && mResult.dual_line && !mResult.bubble, "Dim x1 & Msr x2 is correct");
			oChart.attachEventOnce("renderComplete", feeding1By1);
			oChart.setVisibleMeasures(['ActualCosts']);
		}

		function feeding1By1() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			assert.ok(mResult.bar && !mResult.combination && !mResult.dual_line && !mResult.bubble, "Dim x1 & Msr x1 is correct");
			oChart.attachEventOnce("renderComplete", feeding0By2);
			oChart.setVisibleDimensions([]);
			oChart.setVisibleMeasures(['ActualCosts', 'PlannedCosts']);
		}

		function feeding0By2() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			assert.ok(mResult.bar && !mResult.combination && !mResult.dual_line && !mResult.bubble, "Dim x0 & Msr x2 is correct");

			oChart.attachEventOnce("renderComplete", feedingSemantic);
			oChart.setVisibleDimensions(['CostElement', 'CostCenter']);
			oChart.setVisibleMeasures(['ActualCosts', 'PlannedCosts']);
			oChart.getMeasureByName('ActualCosts').setSemantics('actual');
			oChart.getMeasureByName("PlannedCosts").setSemantics("projected");
		}

		function feedingSemantic() {
			var mResult = wrap(oChart.getAvailableChartTypes());
			assert.ok(mResult.bar && !mResult.bubble, "Semantic is correct");

			oChart.setVisibleDimensions([]);
			oChart.setVisibleMeasures([]);
			feedingEmpty();
		}

		function feedingEmpty(){
			var mResult = wrap(oChart.getAvailableChartTypes());
			assert.ok(!mResult.bar && !mResult.bubble, "Empty is correct");

			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("API - getChartTypeLayout", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '600px',
			'height': '400px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'selectionBehavior': 'CATEGORY',
			'isAnalytical': true,
			'visibleDimensions': ['CostElement', 'CostCenter'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachEventOnce("renderComplete", initCb);

		function initCb() {
			assert.deepEqual(sap.chart.api.getChartTypeLayout("line"),
					{"dimensions":[],"measures":[],"errors":[{"cause":"missing","detail":{"dim":0,"msr":1,"time":0}}]},
					"current visible dimensions and measures is not used as default");
			assert.deepEqual(sap.chart.api.getChartTypeLayout("line", [{name:"CostElement"}]), {
				dimensions: [],
				measures: [],
				errors: [{cause:"missing",detail:{dim:0,msr:1,time:0}}]
			}, "using visible dimensions only, no default measures are inferred");
			assert.deepEqual(sap.chart.api.getChartTypeLayout("line", null, [{name:"ActualCosts"}]), {
				dimensions: [],
				measures: ["ActualCosts"],
				errors: []
			}, "using measures only, no default dimensions are inferred");
			assert.deepEqual(sap.chart.api.getChartTypeLayout("line", [{name:"CostElement"}], [{name:"ActualCosts"}]), {
				dimensions: ["CostElement"],
				measures: ["ActualCosts"],
				errors: []
			}, "using provided dimensions and measures is correct");

			var dimension = new Dimension({name: "CostElement", role: "category"});
			var measure = new Measure({name: "ActualCosts", role: "axis1"});
			assert.deepEqual(sap.chart.api.getChartTypeLayout("line", [dimension], [measure]), {
				"dimensions":["CostElement"],
				"measures":["ActualCosts"],
				"errors":[]
			},"using provided dimensions and measures is correct");

			var tDim =  new TimeDimension({name:"CostTime",role:"category"});
			measure = new Measure({name: "ActualCosts", role: "axis1"});
			var m2 = new  Measure({name:"Revenue",role:"axis1"});
			assert.deepEqual(sap.chart.api.getChartTypeLayout("bubble", [tDim, dimension], [measure, m2]), {
				"dimensions":["CostTime"],
				"measures":["ActualCosts", "Revenue"],
				"errors":[]
			},"using provided timedimensions and measures is correct");

			assert.deepEqual(sap.chart.api.getChartTypeLayout("bubble",
					[{"name":"CostElement"},{"name":"CostCenter"}],
					[{"name":"ActualCosts"},{"name":"PlannedCosts"}]).errors, [{cause:"missing",detail:{dim:0,msr:1,time:0}}], "errors is detected");
			assert.deepEqual(sap.chart.api.getChartTypeLayout("line", [], []).errors, [{cause:"missing",detail:{dim:0,msr:1,time:0}}], "errors is detected (filter out MND)");
			assert.deepEqual(sap.chart.api.getChartTypeLayout("dual_column",
					[{"name":"CostElement"},{"name":"CostCenter"}],
					[{"name":"ActualCosts"},{"name":"PlannedCosts"}]), {
				dimensions: ["CostElement", "CostCenter"],
				measures: ["ActualCosts", "PlannedCosts"],
				errors: []
			}, "BVR intervention is detected");

			QUnit.assert.throws(sap.chart.api.getChartTypeLayout.bind(oChart, null,
					[{"name":"CostElement"},{"name":"CostCenter"}],
					[{"name":"ActualCosts"},{"name":"PlannedCosts"}]),
					new Error("Invalid chart type: null"),
					"Invalid chartType parameter throws exception");
			QUnit.assert.throws(sap.chart.api.getChartTypeLayout.bind(oChart, "column",
					[{"name":"CostElement"},{}],
					[{"name":"ActualCosts"},{"name":"PlannedCosts"}]),
					new Error("Invalid Dimension at [1]: [object Object]. Dimension should be an object of the format{name:'name'} or an instance of sap.chart.data.Dimension."),
					"Invalid dimension parameter throws exception");
			QUnit.assert.throws(sap.chart.api.getChartTypeLayout.bind(oChart, "column",
					[{"name":"CostElement"},{"name":"CostCenter"}],
					[{},{"name":"PlannedCosts"}]),
					new Error("Invalid Measure at [0]: [object Object]. Measure should be an object of the format{name:'name'} or an instance of sap.chart.data.Measure."),
					"Invalid measure parameter throws exception");
			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("loading animation test", function(assert) {
		var done = assert.async();
		oChart = new sap.chart.Chart({
			'width': '800px',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		oChart.attachRenderComplete(null, function(oEvent) {
			oChart._showLoading(true);
			var $loading = oChart._$loadingIndicator;
			assert.equal($loading[0].parentNode, oChart.getDomRef(), "Loading page is shown");
			assert.equal($loading.css("opacity"), "1", "Loading page blocks the plot");
			done();
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("InResult test", function(assert) {
		var done = assert.async();
		var options = {
				'width': '800px',
				'height': '600px',
				'chartType': 'column',
				'uiConfig': {
					'applicationSet': 'fiori'
				},
				'vizProperties': {
					'plotArea': {
						'window': {
							'start': null
						}
					}
				},
				'isAnalytical': true,
				'visibleDimensions': ['CostElement'],
				'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
				'inResultDimensions': ['CostCenter'],
				'enablePagination': false
			};
		oChart = new sap.chart.Chart(options);

		oChart.attachEventOnce("renderComplete", null, normalInResultTest);

		function normalInResultTest() {
			var dpDoms = oChart.getDomRef().querySelectorAll(".v-datapoint");
			var oBinding = oChart.getBinding("data");
			assert.equal(dpDoms.length, 2 * oBinding.getLength(), "data of inResult aggragation are rendered");

			assert.equal(oChart.getDomRef().querySelectorAll(".v-m-categoryAxis .v-label").length, 12, "only visible dimensions are rendered in category axis");

			oChart.setInResultDimensions(["CostElement", "CostCenter"], "Dimension can be moved from visible to inResult");
			assert.deepEqual(oChart.getVisibleDimensions(), []);
			oChart.setVisibleDimensions(["CostElement", "CostCenter"], "Dimension can be moved from inResult to visible");
			assert.deepEqual(oChart.getInResultDimensions(), []);

			oChart.setInResultDimensions(['CostCenter']);

			oChart.attachEventOnce("renderComplete", null, noVisibleDimensionTest);
			oChart.setVisibleDimensions([]);
		}

		function noVisibleDimensionTest() {
			assert.equal(oChart.getDomRef().querySelectorAll(".v-datapoint").length, 18, "inResult works when there's no visible dimension");
			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("support length in bindingInfo test", function(assert) {
		var done = assert.async();
		var options = {
				'width': '800px',
				'height': '600px',
				'chartType': 'column',
				'uiConfig': {
					'applicationSet': 'fiori'
				},
				'isAnalytical': true,
				"visibleDimensions" : ["CostElement", "CostCenter"],
				"visibleMeasures" : ["ActualCosts", "PlannedCosts"]
		};
		oChart = new sap.chart.Chart(options);

		oChart.attachEventOnce("renderComplete", null, cb);

		function cb() {
			assert.equal(oChart.getDomRef().querySelectorAll(".v-datapoint").length, 2, "only first record(2 dps) should be rendered");
			done();
		}

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			},
			length: 1
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Properties (valueAxisScale) test for non-stacked chart", function(assert) {
		var done = assert.async();
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'line',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb() {
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setValueAxisScaleCb1);
			oChart.setValueAxisScale({
				scaleBehavior: sap.chart.ScaleBehavior.FixedScale,
				fixedScaleSettings: {
					measureBoundaryValues: {
						ActualCosts: {
							minimum:100,
							maximum:1000
						},
						PlannedCosts: {
							minimum:200,
							maximum:1500
						}
					}
				}
			});
		}

		function setValueAxisScaleCb1() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, 100, "scale min value should be 100");
					assert.equal(v.max, 1500, "scale max value should be 1500");
				}
			});
			oChart.detachRenderComplete(setValueAxisScaleCb1);
			oChart.attachValueAxisFixedScaleTurnedOff(checkValueAxisFixedScaleTurnedOff);
			oChart.setVisibleDimensions(['CostElement', 'CostCenter']);
		}

		function checkValueAxisFixedScaleTurnedOff() {
			oChart.detachValueAxisFixedScaleTurnedOff(checkValueAxisFixedScaleTurnedOff);
			setTimeout(function() {
				oChart.attachRenderComplete(null, setValueAxisScaleCb2);
				oChart.setValueAxisScale({
					scaleBehavior: sap.chart.ScaleBehavior.FixedScale,
					fixedScaleSettings: {
						measureBoundaryValues: {
							ActualCosts: {
								minimum:150,
								maximum:1500
							},
							PlannedCosts: {
								minimum:250,
								maximum:2000
							}
						}
					}
				});
			}, 1000);
		}

		function setValueAxisScaleCb2() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, 150, "scale min value should be 100");
					assert.equal(v.max, 2000, "scale max value should be 1500");
				}
			});
			oChart.detachRenderComplete(setValueAxisScaleCb2);
			oChart.attachRenderComplete(null, setValueAxisScaleCb3);
			oChart.setValueAxisScale();
		}

		function setValueAxisScaleCb3() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, 'auto', "scale min value should be auto");
					assert.equal(v.max, 'auto', "scale max value should be auto");
				}
			});
			assert.equal(oChart.getVizProperties().plotArea.adjustScale, false, "plotArea.adjustScale should be false");
			assert.equal(oChart._oValueScaleSetting.property.interaction.syncValueAxis, false, "interaction.syncValueAxis should be false");
			oChart.detachRenderComplete(setValueAxisScaleCb3);
			done();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Properties (valueAxisScale) test for stacked chart", function(assert) {
		var done = assert.async();
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'stacked_column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb() {
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setValueAxisScaleCb1);
			oChart.setValueAxisScale({
				scaleBehavior: sap.chart.ScaleBehavior.FixedScale,
				fixedScaleSettings: {
					stackedMultipleMeasureBoundaryValues: [{
						measures:['ActualCosts', 'PlannedCosts'],
						boundaryValues: {
							minimum:100,
							maximum:1000
						}
					}]
				}
			});
		}

		function setValueAxisScaleCb1() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, 100, "scale min value should be 100");
					assert.equal(v.max, 1000, "scale max value should be 1000");
				}
			});
			oChart.detachRenderComplete(setValueAxisScaleCb1);
			oChart.attachRenderComplete(null, setValueAxisScaleCb2);
			oChart.getDimensionByName('CostCenter').setRole('series');
			oChart.setVisibleDimensions(['CostElement', 'CostCenter']);
		}

		function setValueAxisScaleCb2() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, 100, "scale min value should be 100");
					assert.equal(v.max, 1000, "scale max value should be 1000");
				}
			});

			oChart.detachRenderComplete(setValueAxisScaleCb2);
			oChart.attachRenderComplete(null, setValueAxisScaleCb3);
			oChart.setValueAxisScale({
				autoScaleSettings:{
					zeroAlwaysVisible:false,
					syncWith:sap.chart.AutoScaleMode.VisibleData
			}});
		}

		function setValueAxisScaleCb3() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, 'auto', "scale min value should be auto");
					assert.equal(v.max, 'auto', "scale max value should be auto");
				}
			});

			assert.equal(oChart._oValueScaleSetting.property.plotArea.adjustScale, true, "plotArea.adjustScale should be true");
			assert.equal(oChart._oValueScaleSetting.property.interaction.syncValueAxis, true, "interaction.syncValueAxis should be true");

			oChart.detachRenderComplete(setValueAxisScaleCb3);
			done();
		}

		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});

		oChart.setModel(oModel);

		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("init chart with vizScales", function(assert) {
		var done = assert.async();
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'stacked_column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'vizScales': [{
				feed: 'valueAxis',
				max: 1000,
				min: 100
			}],
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, 100, "vizScales is successfully set");
					assert.equal(v.max, 1000, "vizScales is successfully set");
				}
			});
			assert.equal(!!oChart._oValueScaleSetting, false, "_oValueScaleSetting should be undefined if valueAxisScale isn't set");
			oChart.detachRenderComplete(initRenderCb);
			done();
		}
		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("init chart with vizScales and valueAxisScale", function(assert) {
		var done = assert.async();
		var vizScales = [{
			feed: 'valueAxis',
			max: '500',
			min: '200'
		}, {
			feed: 'color',
			palette: ['black']
		}];
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'stacked_column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'vizProperties': {
				categoryAxis: {
					title: {
						visible: true
					}
				}
			},
			'valueAxisScale': {
				scaleBehavior: sap.chart.ScaleBehavior.FixedScale,
				fixedScaleSettings: {
					stackedMultipleMeasureBoundaryValues: [{
						measures:['ActualCosts', 'PlannedCosts'],
						boundaryValues: {
							minimum:100,
							maximum:1000
						}
					}]
				}
			},
			'vizScales': vizScales,
			'isAnalytical': true,
			'visibleDimensions': ['CostElement'],
			'visibleMeasures': ['ActualCosts', 'PlannedCosts'],
			'enablePagination': false
		});

		function initRenderCb() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, 100, "the priotity of valueAxisScale is higher than vizScales");
					assert.equal(v.max, 1000, "the priotity of valueAxisScale is higher than vizScales");
				}
				if (v.feed === 'color') {
					assert.equal(v.palette[0], 'black', "the color scale of vizScales is applied");
				}
			});
			oChart.detachRenderComplete(initRenderCb);
			oChart.attachRenderComplete(null, setVizValueAxisScaleCb);
			oChart.setVizScales(vizScales);
		}

		function setVizValueAxisScaleCb() {
			jQuery.each(oChart.getVizScales(), function(k, v) {
				if (v.feed === 'valueAxis') {
					assert.equal(v.min, '200', "value scale is reset to auto");
					assert.equal(v.max, '500', "value scale is reset to auto");
				}
				if (v.feed === 'color') {
					assert.equal(v.palette[0], 'black', "the color scale of vizScales is applied");
				}
			});
			oChart.detachRenderComplete(setVizValueAxisScaleCb);
			done();
		}
		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet,
				noPaging: true,
				useBatchRequests: true,
				provideGrandTotals: true,
				provideTotalResultSize: true
			}
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});
	QUnit.test("enableStableColor test", function(assert) {
		var done = assert.async();
		var CalculdatedJSONData = {
				"businessData": [{
					"Player": "Player10",
					"CriticalityByPlayer": "Neutral",
					"CriticalityByPlayerD": "Crossbench",
					"Speed": 2884
				}, {
					"Player": "Player11",
					"CriticalityByPlayer": "Critical",
					"CriticalityByPlayerD": "Soso",
					"Speed": 1484
				}, {
					"Player": "Player12",
					"CriticalityByPlayer": "Critical",
					"CriticalityByPlayerD": "Soso",
					"Speed": 4261
				}, {
					"Player": "Player14",
					"CriticalityByPlayer": "Critical",
					"CriticalityByPlayerD": "Soso",
					"Speed": 4875
				}, {
					"Player": "Player15",
					"CriticalityByPlayer": "Negative",
					"CriticalityByPlayerD": "Weak",
					"Speed": 1298
				}, {
					"Player": "Player16",
					"CriticalityByPlayer": "Negative",
					"CriticalityByPlayerD": "Weak",
					"Speed": 4835
				}, {
					"Player": "Player17",
					"CriticalityByPlayer": "Neutral",
					"CriticalityByPlayerD": "Crossbench",
					"Speed": 2588
				}, {
					"Player": "Player19",
					"CriticalityByPlayer": "Critical",
					"CriticalityByPlayerD": "Soso",
					"Speed": 3501
				}, {
					"Player": "Player2",
					"CriticalityByPlayer": "Critical",
					"CriticalityByPlayerD": "Soso",
					"Speed": 2152
				}, {
					"Player": "Player20",
					"CriticalityByPlayer": "Negative",
					"CriticalityByPlayerD": "Weak",
					"Speed": 2165
				}, {
					"Player": "Player3",
					"CriticalityByPlayer": "Negative",
					"CriticalityByPlayerD": "Weak",
					"Speed": 3353
				}, {
					"Player": "Player4",
					"CriticalityByPlayer": "Negative",
					"CriticalityByPlayerD": "Weak",
					"Speed": 3712
				}, {
					"Player": "Player5",
					"CriticalityByPlayer": "Neutral",
					"CriticalityByPlayerD": "Crossbench",
					"Speed": 3293
				}, {
					"Player": "Player7",
					"CriticalityByPlayer": "acd",
					"CriticalityByPlayerD": "Crossbench",
					"Speed": 2289
				}]
			};
		oChart = new sap.chart.Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'stacked_column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},

			'isAnalytical': true,
			'visibleDimensions': ['Player', "CriticalityByPlayer","Crossbench"],
			'visibleMeasures': ['Speed'],
			'enableStableColor': true
		});
		var firstLegendItem = {};
		function secondRender(){
			var rects = Array.prototype.slice.call(oChart.getDomRef().querySelectorAll(".v-legend-item"));
			for (var i = 0; i < rects.length; ++i){
				var c = rects[i].querySelector("path").getAttribute('fill');
				var text = rects[i].querySelector("text tspan").textContent;
				if (firstLegendItem[text]){
					assert.equal(firstLegendItem[text], c, "color should be consitent");
				}

			}
			oChart.detachRenderComplete(secondRender);
			done();
		}
		function initRenderCb() {
			var rects = Array.prototype.slice.call(oChart.getDomRef().querySelectorAll(".v-legend-item"));
			for (var i = 0; i < rects.length; ++i){
				var c = rects[i].querySelector("path").getAttribute('fill');
				var text = rects[i].querySelector("text tspan").textContent;
				firstLegendItem[text] = c;
			}
			oChart.detachRenderComplete(initRenderCb);
			oChart.setChartType("line", true);
			CalculdatedJSONData["businessData"][0]["CriticalityByPlayer"] = "aaa";
			oChart.bindData({
				path: "/businessData"
			});

			oChart.attachRenderComplete(null, secondRender);
			// oChart.setVizScales(vizScales);
		}

		oModel = new JSONModel(CalculdatedJSONData);
		oChart.setModel(oModel);

		oChart.addDimension(new Dimension({
			name: "Player",
			role: "category"
		}));
		oChart.addDimension(new Dimension({
			name: "CriticalityByPlayer",
			role: "series"
		}));
		oChart.addDimension(new Dimension({
			name: "CriticalityByPlayerD",
			role: "series"
		}));
		oChart.addMeasure(new Measure({
			name: "Speed"
		}));
		oChart.attachRenderComplete(null, initRenderCb);

		oChart.bindData({
			path: "/businessData",
			filters: [new Filter({
				path:"CriticalityByPlayer",
				operator: FilterOperator.GT,
				value1: "Critical"})]
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.start();

});
