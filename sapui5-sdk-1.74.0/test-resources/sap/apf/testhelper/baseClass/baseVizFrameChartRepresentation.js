/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

jQuery.sap.declare("sap.apf.testhelper.baseClass.baseVizFrameChartRepresentation");

jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.thirdparty.sinon");
jQuery.sap.require("sap.ui.thirdparty.sinon-qunit");
if (sap.ui.Device.browser.internet_explorer) {
	jQuery.sap.require("sap.ui.thirdparty.sinon-ie");
}

jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.testhelper.baseClass.baseUI5ChartRepresentation");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");

(function () {
	"use strict";

	sap.apf.testhelper.baseClass = sap.apf.testhelper.baseClass || {};
	sap.apf.testhelper.baseClass.baseVizFrameChartRepresentation = {
		run: run
	};

	function getParametersWithRequiredFilters() {
		return sap.apf.testhelper.config.representationHelper.prototype.selectableRepresentationDataWithDimension();
	}

	function identity(x) {
		return x;
	}

	/**
	 * 
	 * @param {Constructor<Representation>} Chart is the constructor of the representation under test.
	 * @param {Function<Parameters, Parameters>} fnModifyParameters (optional) hooks in to modify the parameters given to the representation.
	 * 	It the specified parameter object may be mutated by this function.
	 */
	function run(Chart, fnModifyParameters) {
		var base = sap.apf.testhelper.baseClass.baseUI5ChartRepresentation;
		base.run(Chart);

		fnModifyParameters = fnModifyParameters || identity;

		function setupChart(parameters, callback) {
			base.setupChart(parameters, Chart, callback);
		}
		function tearDown(setup) {
			setup.chart.destroy();
			setup.api.oCompContainer.destroy();
		}

		QUnit.module("BaseVizFrameChartRepresentation specification - Chart inheritance", {
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
					testEnv.oBase = new sap.apf.ui.representations.BaseVizFrameChartRepresentation(interfaceProxy, requiredParameter);
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
					assert.ok(chartIndex >= 0, "then chart has key \"" + key + "\" from BaseVizFrameChart (undefined in BaseVizFrameChart)");
				} else {
					assert.ok(chartIndex >= 0, "then chart has key \"" + key + "\" from BaseVizFrameChart");
					assert.notStrictEqual(testEnv.oChart[key], undefined, "then chart property \"" + key + "\" is defined");
				}
			});
		});

		QUnit.module("BaseVizFrameChartRepresentation specification - With required filter", {
			beforeEach: function(assert) {
				var testEnv = this;
				var done = assert.async();

				setupChart(fnModifyParameters(getParametersWithRequiredFilters()), function(setup) {
					testEnv.setup = setup;

					testEnv.formatterForMeasureSpy =
						sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
					testEnv.selectionFormatterSpy =
						sinon.spy(sap.apf.ui.representations.BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
					testEnv.setFormatOnChartSpy =
						sinon.spy(sap.apf.ui.representations.BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");

					done();
				});
			},
			afterEach: function(assert) {
				tearDown(this.setup);

				this.formatterForMeasureSpy.restore();
				this.selectionFormatterSpy.restore();
				this.setFormatOnChartSpy.restore();
			}
		});
		QUnit.test("When calling getMainContent", function(assert) {
			// arrange
			var chart = this.setup.chart;
			sinon.stub(chart, "getAxisFeedItemId", function(sKind) {
				return "<axisFeedItemId(" + sKind + ")>";
			});

			// act
			var mainContent = chart.getMainContent("<title>", 600, 400);

			// assert
			assert.strictEqual(
				chart.getParameter().dimensions[0].axisfeedItemId, chart.getAxisFeedItemId(chart.getParameter().dimensions[0].kind),
				"then axisfeedItemId was assigned to dimensions");
			assert.strictEqual(
				chart.getParameter().measures[0].axisfeedItemId, chart.getAxisFeedItemId(chart.getParameter().measures[0].kind),
				"then axisfeedItemId was assigned to measures");

			assert.ok(mainContent instanceof sap.viz.ui5.controls.VizFrame, "then result is a VizFrame");

			assert.ok(this.formatterForMeasureSpy.called, "then formatter for measure was called");
			assert.ok(this.selectionFormatterSpy.called, "then formatter for selection was called");
			assert.ok(this.setFormatOnChartSpy.called, "then format was passed to chart");
		});
		QUnit.module("BaseVizFrameChartRepresentation specification - Filter property display option label", {
			beforeEach : function(assert) {
				var testEnv = this;
				var done = assert.async();

				setupChart(getParametersWithRequiredFilters(), function(setup) {
					testEnv.setup = setup;

					done();
				});
			},
			afterEach : function(assert) {
				tearDown(this.setup);
			}
		});
		QUnit.test("When custom text is set to filter", function(assert) {
			//arrange
			var chart = this.setup.chart;

			var getTextNotHtmlEncodedStub = sinon.stub(this.setup.api.oCoreApi, "getTextNotHtmlEncoded", function(sProperty) {
				return sProperty.key;
			});
			var oExpectedLabel = {
				"key" : "Year Month Custom Text",
				"kind" : "text",
				"type" : "label"
			};

			//act
			var sSelectionFilterLabel = chart.getSelectionFilterLabel([ "YearMonth" ]);

			//assert
			assert.strictEqual(getTextNotHtmlEncodedStub.calledWith(oExpectedLabel), true, "then selection filter label is a Year Month Custom Text (custom text)");
			assert.strictEqual(sSelectionFilterLabel, "Year Month Custom Text", "then selection filter label is a Year Month Custom Text (custom text)");

			//clean up
			getTextNotHtmlEncodedStub.restore();
		});
	}
}());