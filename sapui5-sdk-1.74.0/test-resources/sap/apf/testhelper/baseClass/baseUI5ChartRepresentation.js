/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

jQuery.sap.declare("sap.apf.testhelper.baseClass.baseUI5ChartRepresentation");

jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");
if (sap.ui.Device.browser.internet_explorer) {
	jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
}

jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.ui.representations.RepresentationInterfaceProxy');

(function() {
	"use strict";

	sap.apf.testhelper.baseClass.baseUI5ChartRepresentation = {
			run: run,
			setupChart: setupChart,
			getSampleSerializedFilter: getSampleSerializedFilter,
			getSampleDataForSelection: getSampleDataForSelection,
			getSampleDataForDeselection: getSampleDataForDeselection,
			getSampleParameters: getSampleParameters,
			getSampleData: getSampleData,
			getSampleDataForCharts: getSampleDataForCharts,
			getSmallSampleData: getSmallSampleData,
			getSampleMetadata: getSampleMetadata
	};

	function getSampleParameters() {
		var representationHelper = sap.apf.testhelper.config.representationHelper.prototype;

		return representationHelper.selectableRepresentationDataWithDimension();
	}
	
	function getSampleSerializedFilter() {
		return ["201312", "201311" ];
	}
	function getSampleFilters() {
		return [ "201312", "201311" ];
	}

	function getSampleDataForSelection() {
		return [ {
			data : {
				"Days Sales Outstanding" : 55.22,
				"YearMonth" : "201312"
			}
		}, {
			data : {
				"Days Sales Outstanding" : 40.3,
				"YearMonth" : "201311"
			}
		} ];
	}
	function getSampleDataForDeselection() {
		return [ {
			data : {
				"YearMonth" : "201312",
				"Days Sales Outstanding" : 55.22
			}
		} ];
	}

	function getSampleMetadata() {
		var representationHelper = sap.apf.testhelper.config.representationHelper.prototype;
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}

	function getSampleData(api) {
		// see testhelper/odata/sampleData.json
		return sap.apf.testhelper.odata.getSampleService(api.oApi, 'sampleData');
	}
	function getSampleDataForCharts(api) {
		// see testhelper/odata/sampleDataForCharts.json
		return sap.apf.testhelper.odata.getSampleService(api.oApi, 'sampleDataForCharts');
	}
	function getSmallSampleData(api) {
		// see testhelper/odata/smallSampleData.json
		// These sample data are easier to tackle in tests because there are less datasets inside
		// and not more than one item with the same requiredFilter (useful for deselection testing).
		return sap.apf.testhelper.odata.getSampleService(api.oApi, 'smallSampleData');
	}

	function setupChart(inputParameters, Chart, callback) {
		sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(api) {
			var interfaceProxy = new sap.apf.ui.representations.RepresentationInterfaceProxy(api.oCoreApi, api.oUiApi);

			var createChart = function() {
				return new Chart(interfaceProxy, inputParameters);
			};
			var chart = createChart();

			chart.setData(getSmallSampleData(api), getSampleMetadata());
			callback({
				chart : chart,
				parameters : inputParameters,
				api : api,
				createChart : createChart
			});
		});
	}

	function run(Chart) {
		var inputParameters = getSampleParameters();

		QUnit.module("BaseUI5ChartRepresentation specification - Chart inheritance", {
			beforeEach: function(assert) {
				var testEnv = this;
				var done = assert.async();

				sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(api) {
					var requiredParameter = {
						dimensions : [],
						measures : [],
						requiredFilters : []
					};
					var interfaceProxy = new sap.apf.ui.representations.RepresentationInterfaceProxy(api.oCoreApi, api.oUiApi);
					// create chart and base
					testEnv.oBase = new sap.apf.ui.representations.BaseUI5ChartRepresentation(interfaceProxy, requiredParameter);
					testEnv.oChart = new Chart(interfaceProxy, requiredParameter);
					testEnv.api = api;
					done();
				});
			},
			afterEach : function() {
				this.api.oCompContainer.destroy();
				this.oChart.destroy();
			}
		});
		QUnit.test("When chart is created", function(assert) {
			var testEnv = this;
			// get object keys
			var baseKeys = Object.keys(testEnv.oBase);
			var chartKeys = Object.keys(testEnv.oChart);
			// assert
			baseKeys.forEach(function(key) {
				var chartIndex = chartKeys.indexOf(key);
				if (testEnv.oBase[key] === undefined) {
					assert.ok(chartIndex >= 0, "then chart has key \"" + key + "\" from BaseUI5Chart (value is undefined in BaseUI5Chart)");
				} else {
					assert.ok(chartIndex >= 0, "then chart has key \"" + key + "\" from BaseUI5Chart");
					assert.notStrictEqual(testEnv.oChart[key], undefined, "then chart property \"" + key + "\" is defined");
				}
			});
		});

		QUnit.module("BaseUI5ChartRepresentation specification", {
			beforeEach : function(assert) {
				var testEnv = this;
				var done = assert.async();

				setupChart(inputParameters, Chart, function(setup) {
					testEnv.setup = setup;
					done();
				});
			},
			afterEach : function(assert) {
				this.setup.api.oCompContainer.destroy();
				this.setup.chart.destroy();
			}
		});
		QUnit.test("When chart is initialized", function(assert) {
			var chart = this.setup.chart;
			var api = this.setup.api;
			var requiredParameters = this.setup.parameters;

			assert.strictEqual(chart.getParameter().dimensions.length, requiredParameters.dimensions.length, "then input dimension parameter equals returned parameter of chart");
			assert.strictEqual(chart.getParameter().measures.length, requiredParameters.measures.length, "then input measure parameter equals returned parameter of measure from chart");
			assert.deepEqual(chart.getAlternateRepresentation(), requiredParameters.alternateRepresentationType, "then input parameter of alternateRepresentation equals returned parameter of representation from chart");
			assert.deepEqual(chart.getData().length, getSmallSampleData(api).length, "then data are available");
			assert.deepEqual(chart.getMetaData().getPropertyMetadata("YearMonth"), getSampleMetadata().getPropertyMetadata("YearMonth"), "then metadata are available");
			assert.deepEqual(chart.getMetaData().getPropertyMetadata("DaysSalesOutstanding"), getSampleMetadata().getPropertyMetadata("DaysSalesOutstanding"), "then metadata are available");
		});
		QUnit.test("When representation without charts and thumbnails is destroyed", function(assert) {
			var representation = this.setup.chart;
			representation.destroy();

			assert.ok(representation.formatter == null, "then formatter is null or undefined");
			assert.strictEqual(representation.dataset, null, "then dataset is null");
			assert.ok(representation.chart == null, "then chart is null or undefined");
			assert.ok(representation.fnHandleSelection == null, "After destroy selection function is null or undefined");
			assert.ok(representation.fnHandleDeselection == null, "After destroy deselection function is null or undefined");
			assert.ok(representation.thumbnailChart == null, "then thumbnailChart is null or undefined");
			assert.ok(representation.thumbnailLayout === undefined || representation.thumbnailLayout.getContent().length === 0, "then thumbnailLayout is empty or undefined");
		});
		QUnit.test("When empty configuration is (de)serialized", function(assert) {
			var chart = this.setup.chart;
			var expectedFilterValue = [];

			chart.deserialize({
				oFilter : expectedFilterValue,
				bIsAlternateView : true
			});

			assert.deepEqual(chart.oRepresentationFilterHandler.getFilterValues(), expectedFilterValue, "then deserialized value is empty (since nothing has been selected)");
			assert.deepEqual(chart.serialize().oFilter, expectedFilterValue, "then serialized value is empty (since nothing has been selected)");
			assert.strictEqual(chart.serialize().bIsAlternateView, true, "then alternate view settings are adopted");
		});
		QUnit.test("When filled configuration is (de)serialized", function(assert) {
			var chart = this.setup.chart;
			var expectedFilterValue = getSampleSerializedFilter();
			var expectedFilters = getSampleFilters();

			chart.deserialize({
				oFilter : expectedFilterValue,
				bIsAlternateView : true
			});

			assert.deepEqual(chart.oRepresentationFilterHandler.getFilterValues(), expectedFilters, "then deserialized value contains expected filter");
			assert.deepEqual(chart.serialize().oFilter, expectedFilterValue, "then serialized value contains expected filter");
			assert.strictEqual(chart.serialize().bIsAlternateView, true, "then alternate view settings are adopted");
		});
		QUnit.test("When switching between the charts", function(assert) {
			var targetChart = this.setup.createChart();
			var sourceChart = this.setup.createChart();
			var filterValues = getSampleSerializedFilter();

			sourceChart.deserialize({
				oFilter : filterValues
			});
			targetChart.adoptSelection(sourceChart);

			assert.deepEqual(targetChart.serialize().oFilter, filterValues, "then filter values should be adopted");
		});
		QUnit.test("When not switching between the charts", function(assert) {
			var targetChart = this.setup.chart;
			var filterValues = getSampleSerializedFilter();

			assert.notDeepEqual(targetChart.serialize().oFilter, filterValues, "then filter values should not be adopted");
		});
	}
}());