/*global QUnit, sinon */

QUnit.config.autostart = false;

sap.ui.require([
	'sap/chart/Chart',
	'sap/chart/data/Dimension',
	'sap/chart/data/HierarchyDimension',
	'sap/chart/data/TimeDimension',
	'sap/chart/data/Measure',
	'sap/chart/utils/RoleFitter',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/analytics/ODataModelAdapter',
	'sap/ui/model/analytics/AnalyticalTreeBindingAdapter',
	'sap/ui/layout/VerticalLayout',
	'sap/chart/utils/ChartTypeAdapterUtils'
], function(
	Chart,
	Dimension,
	HierarchyDimension,
	TimeDimension,
	Measure,
	RoleFitter,
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
	var sResultSet = "ZCOSTCENTERCOSTSQUERY0003Results";
	var sResultPath = "/ZCOSTCENTERCOSTSQUERY0003(P_ControllingArea=%27US01%27,P_CostCenterHierarchy=%27WORLD%27)/Results";


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

	QUnit.test("Create Chart with hierarchy service and get drillstack", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["CostCenter_NodeID", "CostElement"],
			'visibleMeasures': ['ActualCosts']
		});

		oChart.attachDrillStackChanged(null, function(oEvent) {
			var expectedDrillStack = [{
				"dimension": [],
				"filter": undefined,
				"measure": ["ActualCosts"],
				"hierarchylevel": {}
			}, {
				"dimension": ["CostCenter_NodeID"],
				"filter": undefined,
				"measure": ["ActualCosts"],
				"hierarchylevel": {
					"CostCenter_NodeID": 0
				}
			}, {
				"dimension": ["CostCenter_NodeID", "CostElement"],
				"filter": undefined,
				"measure": ["ActualCosts"],
				"hierarchylevel": {
					"CostCenter_NodeID": 0
				}
			}];
			assert.deepEqual(oEvent.getParameters(), expectedDrillStack, "get drill stack in drillStackChanged event");
			oChart.attachRenderComplete(function() {
				assert.ok(this.getDimensionByName("CostCenter_NodeID") instanceof HierarchyDimension, "HierarchyDimension created according to metadata annotation");
				assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length > 0, "chart is rendered");
				done();
			});
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet
			}
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.test("Drill down hierarchy dimension", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["CostCenter_NodeID", "CostElement"],
			'visibleMeasures': ['ActualCosts']
		});

		oChart.attachEventOnce("renderComplete", function() {
			this.setSelectedDataPoints([{index: 5, measures: ["ActualCosts"]}, {index: 6, measures: ["ActualCosts"]}]);
			this.drillDown("CostCenter_NodeID");
			assert.deepEqual(this.getVisibleDimensions(), ["CostCenter_NodeID", "CostElement"], "Invalid to do multiple selection on hierachy/non-hierarchy mixed dimensions and drilling down, visible dimensions should be unchanged");

			function ddWithSingleToEmpty(oEvent) {
				assert.equal(oEvent.getParameters()[5].hierarchylevel["CostCenter_NodeID"], 3, "current hierarchy level changed to 3");
				this.attachEventOnce("renderComplete", function() {
					assert.deepEqual(this.getVisibleDimensions(), ["CostCenter_NodeID"], "recursively drill down to hierachy dimension's next level");
					assert.ok(document.querySelector("#qunit-fixture").querySelectorAll(".v-datapoint").length === 0, "chart is rendered with no data");
					this.drillDown("CostCenter_NodeID");
					assert.equal(this.getDrillStack().length, 6, "not allow to drill down when no data, drill stack unchanged");
					done();
				});
			}

			function ddWithMultipleCb(oEvent) {
				assert.equal(oEvent.getParameters()[4].hierarchylevel["CostCenter_NodeID"], 2, "current hierarchy level changed to 2");
				this.attachEventOnce("renderComplete", function() {
					assert.deepEqual(this.getVisibleDimensions(), ["CostCenter_NodeID"], "recursively drill down to hierachy dimension's next level");
					this.attachEventOnce("drillStackChanged", ddWithSingleToEmpty);
					this.setSelectedDataPoints([{index: 0, measures: ["ActualCosts"]}]);
					this.drillDown("CostCenter_NodeID");
				});
			}

			function ddWithSingleCb(oEvent) {
				assert.equal(oEvent.getParameters()[3].hierarchylevel["CostCenter_NodeID"], 1, "current hierarchy level changed to 1");
				this.attachEventOnce("renderComplete", function() {
					assert.deepEqual(this.getVisibleDimensions(), ["CostCenter_NodeID"], "recursively drill down to hierachy dimension's next level");
					this.attachEventOnce("drillStackChanged", ddWithMultipleCb);
					this.setSelectedDataPoints([{index: 0, measures: ["ActualCosts"]}, {index: 1, measures: ["ActualCosts"]}]);
					this.drillDown("CostCenter_NodeID");
				});
			}
			this.attachEventOnce("drillStackChanged", ddWithSingleCb);
			this.setSelectedDataPoints([{index: 5, measures: ["ActualCosts"]}]);
			this.drillDown("CostCenter_NodeID");
		});

		oChart.bindData({
			path: sResultPath,
			parameters: {
				entitySet: sResultSet
			}
		});
		oChart.setModel(oModel);
		oVerticalLayout.addContent(oChart);
		oVerticalLayout.placeAt("qunit-fixture");
	});

	QUnit.start();

});
