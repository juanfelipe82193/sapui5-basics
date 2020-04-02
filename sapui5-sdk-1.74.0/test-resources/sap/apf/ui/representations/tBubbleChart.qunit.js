/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define("sap/apf/ui/representations/tBubbleChart.qunit", [
	"sap/apf/core/constants",
	"sap/apf/testhelper/baseClass/baseUI5ChartRepresentation",
	"sap/apf/testhelper/baseClass/baseVizFrameChartRepresentation",
	"sap/apf/testhelper/config/representationHelper",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/ui/representations/RepresentationInterfaceProxy",
	"sap/apf/ui/representations/BaseUI5ChartRepresentation",
	"sap/apf/ui/representations/BaseVizFrameChartRepresentation",
	"sap/apf/ui/representations/bubbleChart",
	"sap/ui/layout/HorizontalLayout",
	"sap/viz/ui5/controls/VizFrame"
], function(Constants, BaseUI5ChartRepresentationTestHelper, BaseVizFrameChartRepresentationTestHelper, RepresentationHelper,
			createUiApiAsPromise, RepresentationInterfaceProxy, BaseUI5ChartRepresentation, BaseVizFrameChartRepresentation,
			BubbleChart, HorizontalLayout, VizFrame) {
	"use strict";

	var representationHelper = RepresentationHelper.prototype;

	function _commonInitializationAsserts(chart, assert) {
		var mainContent = chart.getMainContent("sample Title", 600, 600);

		// assert
		assert.strictEqual(mainContent.getVizType(), "bubble", "Then mainContent is a Bubble chart");
	}
	function _commonSetupForCreatingChart(api, requiredParameter) {
		var interfaceProxy = new RepresentationInterfaceProxy(api.oCoreApi, api.oUiApi);
		var chart = new BubbleChart(interfaceProxy, requiredParameter);

		// Use sample data without duplicates in the category axis so that selection and deselection are less complex.
		chart.setData(
			BaseUI5ChartRepresentationTestHelper.getSmallSampleData(api),
			BaseUI5ChartRepresentationTestHelper.getSampleMetadata()
		);
		return chart;
	}
	function _commonTearDown(api, chart) {
		api.oCompContainer.destroy();
		chart.destroy();
	}

	function modifyParametersA(parameters) {
		parameters.dimensions = [ {
			"fieldName" : "YearMonth",
			"kind" : Constants.representationMetadata.kind.REGIONCOLOR
		} ];

		parameters.measures = [ {
			"fieldName" : "DaysSalesOutstanding",
			"kind" : Constants.representationMetadata.kind.XAXIS
		}, {
			"fieldName" : "DaysSalesOutstanding",
			"kind" : Constants.representationMetadata.kind.YAXIS
		}, {
			"fieldName" : "BestPossibleDaysSalesOutstndng",
			"kind" : Constants.representationMetadata.kind.BUBBLEWIDTH
		} ];

		return parameters;
	}
	function modifyParametersB(parameters) {
		parameters.dimensions = [ {
			"fieldName" : "CompanyCodeCountry",
			"kind" : Constants.representationMetadata.kind.REGIONCOLOR
		}, {
			"fieldName" : "YearMonth",
			"kind" : Constants.representationMetadata.kind.REGIONSHAPE
		} ];

		parameters.measures = [ {
			"fieldName" : "DaysSalesOutstanding",
			"kind" : Constants.representationMetadata.kind.XAXIS
		}, {
			"fieldName" : "DaysSalesOutstanding",
			"kind" : Constants.representationMetadata.kind.YAXIS
		}, {
			"fieldName" : "BestPossibleDaysSalesOutstndng",
			"kind" : Constants.representationMetadata.kind.BUBBLEWIDTH
		} ];

		return parameters;
	}

	BaseVizFrameChartRepresentationTestHelper.run(BubbleChart, modifyParametersA);

	QUnit.module("Bubble Chart Tests - Basic Check", {
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
	QUnit.test("When Bubble Chart is initialized", function(assert) {
		//assert
		_commonInitializationAsserts(this.chart, assert);

		//arrange
		var vizPropOnChart = representationHelper.getVizPropertiesJSONOnChart();

		vizPropOnChart.plotArea.adjustScale = true;
		vizPropOnChart.plotArea.colorDepth = 1;  // one dimension with a kind: color
		vizPropOnChart.sizeLegend = {
			formatString : "measureFormatter",
			visible : true
		};
		vizPropOnChart.tooltip.formatString = "measureFormatter";
		vizPropOnChart.valueAxis.label.formatString = "measureFormatter";
		vizPropOnChart.valueAxis2 = {
			label : {
				formatString : "measureFormatter",
				visible : true
			},
			title : {
				visible : true
			},
			visible : true
		};
		//assert
		assert.deepEqual(this.chart.chart.getVizProperties(), vizPropOnChart, "Then vizProperties are applied to the chart");
	});
	QUnit.test("When asking for axis feed item IDs", function(assert) {
		var kinds = Constants.representationMetadata.kind;
		var feedItemTypes = Constants.vizFrame.feedItemTypes;

		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.REGIONCOLOR), feedItemTypes.COLOR, "then REGIONCOLOR => COLOR");
		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.REGIONSHAPE), feedItemTypes.SHAPE, "then REGIONSHAPE => SHAPE");
		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.XAXIS), feedItemTypes.VALUEAXIS, "then XAXIS => VALUEAXIS");
		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.YAXIS), feedItemTypes.VALUEAXIS2, "then YAXIS => VALUEAXIS2");
		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.BUBBLEWIDTH), feedItemTypes.BUBBLEWIDTH, "then BUBBLEWIDTH => BUBBLEWIDTH");
		assert.strictEqual(this.chart.getAxisFeedItemId(kinds.LEGEND), undefined, "then LEGEND => undefined");
		assert.strictEqual(this.chart.getAxisFeedItemId(null), undefined, "then null => undefined");
	});
	QUnit.test("When checking content type of print", function(assert) {
		//act
		var printContent = this.chart.getPrintContent("sample Title");
		var printContentType = printContent.oRepresentation;

		//assert
		assert.strictEqual(printContentType.getVizType(), "bubble", "printContent is a Bubble chart");
		assert.strictEqual(printContentType.getFeeds()[1].mProperties.uid, "valueAxis2", "Then axis feedItemId " + "for yAxis2 is valueAxis2");
		assert.strictEqual(printContentType.getFeeds()[0].mProperties.uid, "valueAxis", "Then axis feedItemId for yAxis is valueAxis");
		assert.strictEqual(printContentType.getFeeds()[2].mProperties.uid, "bubbleWidth", "Then axis feedItemId " + "for width is bubbleWidth");
		assert.strictEqual(printContentType.getFeeds()[3].mProperties.uid, "color", "Then axis feedItemId " + "for legend is color");
	});

	QUnit.module("Bubble Chart Tests - With multiple parameters (dimensions and measures)", {
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
	QUnit.test("When Bubble Chart is initialized with multiple parameters", function(assert) {
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

		assert.strictEqual(this.chart.getParameter().dimensions[0].axisfeedItemId, "color", "Then axis feedItemId for regionColor is color");
		assert.strictEqual(this.chart.getParameter().dimensions[1].axisfeedItemId, "shape", "Then axis feedItemId for regionShape is shape");
		assert.strictEqual(this.chart.getParameter().measures[0].axisfeedItemId, "valueAxis", "Then axis feedItemId for xAxis is valueAxis");
		assert.strictEqual(this.chart.getParameter().measures[1].axisfeedItemId, "valueAxis2", "Then axis feedItemId for yAxis is valueAxis2");
		assert.strictEqual(this.chart.getParameter().measures[2].axisfeedItemId, "bubbleWidth", "Then axis feedItemId for bubbleWidth is width");

		assert.deepEqual(requiredParameter.alternateRepresentationType, this.chart.getAlternateRepresentation(), "Then required Parameter of alternaterepresentation same as return parameter of representation from chart");

		assert.ok(mainContent instanceof VizFrame, "Then mainContent is instance of a vizframe");
		assert.strictEqual(mainContent.getVizType(), "bubble", "Then mainContent is a Bubble chart");

		assert.strictEqual(Object.keys(requestOptions).length, 2, "Then it returns the request oprtion(orderby property & topN)");
		assert.deepEqual(requestOptions.orderby, orderBy, "Then order by property returns sorting informaton");
		assert.deepEqual(requestOptions.paging, paging, "Then topN returns top value");

		assert.strictEqual(this.formatterForMeasureSpy.calledThrice, true, "Then required method called for formatting measure");
		assert.strictEqual(this.attachSelectionFormatSpy.calledOnce, true, "Then Required method called for selection format");
		assert.strictEqual(this.isAllMeasureSameUnitSpy.calledThrice, true, "Then Required method called for checking all measures has same unit");
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
	QUnit.test("When setting the Viz properties of the bubble chart", function(assert) {
		var requiredParameter = representationHelper.representatationDataWithTwoDimensionAndMeasure();
		requiredParameter.requiredFilters = [];
		requiredParameter.dimensions = [ {
			"fieldName" : "CompanyCodeCountry",
			"kind" : Constants.representationMetadata.kind.REGIONCOLOR
		}];
		//arrange
		var spyOnSetter = sinon.spy( sap.apf.ui.representations.BaseVizFrameChartRepresentation, "_setVizPropsForBubbleAndScatter");
		this.chart = _commonSetupForCreatingChart(this.api, requiredParameter);

		//act
		this.chart.getMainContent("sample Title", 600, 600);

		//assert
		assert.strictEqual(spyOnSetter.callCount, 1, "then _setVizPropsForBubbleAndScatter is called");
		var arg1 = spyOnSetter.getCall(0).args[0];
		assert.strictEqual(arg1.length, 1, "and is called with 1 dimension");
		assert.notStrictEqual(arg1[0].fieldName, undefined, "and the dimension is defined");
		assert.strictEqual(arg1[0].fieldName, "CompanyCodeCountry", "and the dimension is the correct one");
	});
});
