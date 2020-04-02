/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define("sap/apf/ui/representations/tPercentageStackedColumnChart", [
	"sap/apf/core/constants",
	"sap/apf/testhelper/baseClass/baseUI5ChartRepresentation",
	"sap/apf/testhelper/baseClass/baseVizFrameChartRepresentation",
	"sap/apf/testhelper/config/representationHelper",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/ui/representations/RepresentationInterfaceProxy",
	"sap/apf/ui/representations/BaseUI5ChartRepresentation",
	"sap/apf/ui/representations/BaseVizFrameChartRepresentation",
	"sap/apf/ui/representations/percentageStackedColumnChart",
	"sap/ui/layout/HorizontalLayout",
	"sap/viz/ui5/controls/VizFrame"
], function(Constants, BaseUI5ChartRepresentationTestHelper, BaseVizFrameChartRepresentationTestHelper, RepresentationHelper,
			createUiApiAsPromise, RepresentationInterfaceProxy, BaseUI5ChartRepresentation, BaseVizFrameChartRepresentation,
			PercentageStackedColumnChart, HorizontalLayout, VizFrame) {
	"use strict";

	var representationHelper = RepresentationHelper.prototype;

	function _commonInitializationAsserts(chart, assert) {
		var mainContent = chart.getMainContent("sample Title", 600, 600);

		// assert
		assert.strictEqual(mainContent.getVizType(), "100_stacked_column", "Then mainContent is a Percentage Stacked Column chart");
	}
	function _commonSetupForCreatingChart(api, requiredParameter) {
		var interfaceProxy = new RepresentationInterfaceProxy(api.oCoreApi, api.oUiApi);
		var chart = new PercentageStackedColumnChart(interfaceProxy, requiredParameter);

		chart.setData(
				BaseUI5ChartRepresentationTestHelper.getSampleData(api),
				BaseUI5ChartRepresentationTestHelper.getSampleMetadata()
		);
		return chart;
	}
	function _commonTearDown(api, chart) {
		api.oCompContainer.destroy();
		chart.destroy();
	}

	// temporary, for later generalization
	function modifyParametersA(parameters) {
		return parameters;
	}
	function modifyParametersB(parameters) {
		return parameters;
	}

	BaseVizFrameChartRepresentationTestHelper.run(PercentageStackedColumnChart);

	QUnit.module("Percentage Stacked Column Chart Tests - Basic Check", {
		beforeEach : function(assert) {
			var testEnv = this;
			var done = assert.async();

			createUiApiAsPromise().done(function(api) {
				testEnv.api = api;

				var requiredParameter = modifyParametersA(representationHelper.representationDataWithDimension());
				testEnv.chart = _commonSetupForCreatingChart(api, requiredParameter);

				done();
			});
		},
		afterEach : function() {
			_commonTearDown(this.api, this.chart);
		}
	});
	QUnit.test("When Percentage Stacked Column Chart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(this.chart, assert);

		//arrange
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();

		var animatedVizProp = {
			dataLoading : false,
			dataUpdating : false
		};
		vizPropOnChart.plotArea.animation = animatedVizProp;
		vizPropOnChart.tooltip = {
			label : {
				visible : true
			},
			visible : true
		};
		vizPropOnChart.valueAxis = {
			label : {
				visible : true
			},
			title : {
				visible : true
			},
			visible : true
		};

		// assert
		assert.deepEqual(this.chart.chart.getVizProperties(), vizPropOnChart, "Then vizProperties are applied to the chart");
	});
	QUnit.test("When asking for axis feed item IDs", function(assert) {
		var kinds = Constants.representationMetadata.kind;
		var feedItemTypes = Constants.vizFrame.feedItemTypes;

		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.XAXIS), feedItemTypes.CATEGORYAXIS, "then XAXIS => CATEGORYAXIS");
		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.YAXIS), feedItemTypes.VALUEAXIS, "then YAXIS => VALUEAXIS");
		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.LEGEND), feedItemTypes.COLOR, "then LEGEND => COLOR");
		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.BUBBLEWIDTH), undefined, "then BUBBLEWIDTH => undefined");
		assert.strictEqual(this.chart.getAxisFeedItemId(null), undefined, "then null => undefined");
	});
	QUnit.test("When checking content type of print", function(assert) {
		//act
		var printContent = this.chart.getPrintContent("sample Title");
		var printContentType = printContent.oRepresentation;

		//assert
		assert.strictEqual(printContentType.getVizType(), "100_stacked_column", "printContent is a Percentage Stacked Column chart");
		assert.strictEqual(printContentType.getFeeds()[1].mProperties.uid, "categoryAxis", "Then axis feedItemId " + "for xAxis is categoryAxis");
		assert.strictEqual(printContentType.getFeeds()[0].mProperties.uid, "valueAxis", "Then axis feedItemId for yAxis is valueAxis");
	});

	QUnit.module("Percentage Stacked Column Chart Tests - With multiple parameters (dimensions and measures)", {
		beforeEach : function(assert) {
			var testEnv = this;
			var done = assert.async();

			createUiApiAsPromise().done(function(api) {
				testEnv.api = api;

				testEnv.formatterForMeasureSpy = sinon.spy(BaseUI5ChartRepresentation.prototype, "getFormatStringForMeasure");
				testEnv.attachSelectionFormatSpy = sinon.spy(BaseUI5ChartRepresentation.prototype, "attachSelectionAndFormatValue");
				testEnv.isAllMeasureSameUnitSpy = sinon.spy(BaseVizFrameChartRepresentation.prototype, "setFormatStringOnChart");

				done();
			});
		},
		afterEach : function() {
			this.formatterForMeasureSpy.restore();
			this.attachSelectionFormatSpy.restore();
			this.isAllMeasureSameUnitSpy.restore();

			_commonTearDown(this.api, this.chart);
		}
	});
	QUnit.test("When Percentage Stacked Column Chart is initialized with multiple parameters", function(assert) {
		//arrange
		var requiredParameter = modifyParametersB(representationHelper.representatationDataWithTwoDimensionAndMeasure());
		this.chart = _commonSetupForCreatingChart(this.api, requiredParameter);
		var mainContent = this.chart.getMainContent("sample Title", 600, 600);

		var orderBy = [ {
			"ascending" : false,
			"property" : "RevenueAmountInDisplayCrcy_E"
		} ];
		var paging = {
			"top" : "100"
		};
		var requestOptions = this.chart.getRequestOptions();

		//assert
		assert.strictEqual(requiredParameter.dimensions.length, this.chart.getParameter().dimensions.length, "Then required Parameter of dimension same as return parameter of dimension from chart");
		assert.strictEqual(requiredParameter.measures.length, this.chart.getParameter().measures.length, "Then required Parameter of measure same as return parameter of measure from chart");

		assert.strictEqual(this.chart.getParameter().dimensions[0].axisfeedItemId, "categoryAxis", "Then axis feedItemId for xAxis is categoryAxis");
		assert.strictEqual(this.chart.getParameter().dimensions[1].axisfeedItemId, "color", "Then axis feedItemId for legend is color");
		assert.strictEqual(this.chart.getParameter().measures[0].axisfeedItemId, "valueAxis", "Then axis feedItemId for yAxis is valueAxis");

		assert.deepEqual(requiredParameter.alternateRepresentationType, this.chart.getAlternateRepresentation(), "Then required Parameter of alternaterepresentation same as return parameter of representation from chart");

		assert.ok(mainContent instanceof VizFrame, "Then mainContent is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "100_stacked_column", "Then mainContent is a Percentage Stacked Column chart");

		assert.strictEqual(Object.keys(requestOptions).length, 2, "Then it returns the request oprtion(orderby property & topN)");
		assert.deepEqual(requestOptions.orderby, orderBy, "Then order by property returns sorting informaton");
		assert.deepEqual(requestOptions.paging, paging, "Then topN returns top value");

		assert.strictEqual(this.formatterForMeasureSpy.calledOnce, true, "Then required method called for formatting measure");
		assert.strictEqual(this.attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(this.isAllMeasureSameUnitSpy.calledOnce, true, "Then Required method called for checking all measures has same unit");
	});
	QUnit.test("When custom text is set to filter", function(assert) {
		//arrange
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		var requiredFilters = [ "YearMonth" ];
		requiredParameter.requiredFilters = requiredFilters;
		this.chart = _commonSetupForCreatingChart(this.api, requiredParameter);

		//act
		this.chart.getMainContent("sample Title", 600, 600);
		var sSelectionFilterLabel = this.chart.getSelectionFilterLabel([ "YearMonth" ]);

		//assert
		assert.strictEqual(sSelectionFilterLabel, "YearMonth", "then selection filter label is a Year Month (default text)");
	});
});
