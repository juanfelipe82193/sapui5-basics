/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define("sap/apf/ui/representations/tBaseVizFrameChartRepresentation.qunit", [
	"sap/apf/testhelper/baseClass/baseUI5ChartRepresentation",
	"sap/apf/testhelper/config/representationHelper",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/testhelper/odata/sampleService",
	"sap/apf/core/messageHandler",
	"sap/apf/ui/representations/RepresentationInterfaceProxy",
	"sap/apf/ui/representations/BaseVizFrameChartRepresentation",
	"sap/apf/ui/representations/utils/vizFrameSelectionHandler",
	"sap/apf/core/constants",
	"sap/apf/ui/utils/representationTypesHandler"
], function(BaseUI5ChartRepresentationTestHelper, RepresentationHelper, createUiApiAsPromise, sampleService, MessageHandler,
			RepresentationInterfaceProxy, BaseVizFrameChartRepresentation, VizFrameSelectionHandler, constants, RepresentationTypesHandler) {
	"use strict";

	/*BEGIN_COMPATIBILITY*/
	var sampleService = sampleService || sap.apf.testhelper.odata.getSampleService;
	/*END_COMPATIBILITY*/

	var representationHelper = RepresentationHelper.prototype;
	function noop() {
	}
	function getSampleMetadata() {
		return {
			getPropertyMetadata : representationHelper.setPropertyMetadataStub.call()
		};
	}
	function getSampleData(oGlobalApi) {
		return sampleService(oGlobalApi.oApi, 'sampleData');
	}
	function commonSetupForCreatingChart(requiredParameter, oGlobalApi) {
		var interfaceProxy = new RepresentationInterfaceProxy(oGlobalApi.oCoreApi, oGlobalApi.oUiApi);
		var chart = new TestRepresentation(interfaceProxy, requiredParameter);
		chart.setData(getSampleData(oGlobalApi), getSampleMetadata());
		return chart;
	}
	function TestRepresentation(oApi, oParameters) {
		BaseVizFrameChartRepresentation.apply(this, [ oApi, oParameters ]);
	}
	TestRepresentation.prototype = Object.create(BaseVizFrameChartRepresentation.prototype);
	// Method called by tests
	TestRepresentation.prototype.initializeChart = function() {
		this.chart = {
			attachSelectData : noop,
			detachSelectData : noop,
			attachDeselectData : noop,
			detachDeselectData : noop,
			destroy : noop
		};
	};

	BaseUI5ChartRepresentationTestHelper.run(BaseVizFrameChartRepresentation);

	QUnit.module("Inherited test class", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;
				that.requiredParameterForInteraction = representationHelper.representationDataWithDimension();
				that.representation = commonSetupForCreatingChart(that.requiredParameterForInteraction, api);
				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When there is no required filter", function(assert) {
		this.representation.getMainContent("sample Title", 600, 600);
		var oInteraction = {
			selectability : {
				axisLabelSelection : false,
				legendSelection : false,
				plotLassoSelection : false,
				plotStdSelection : false
			},
			enableHover : false,
			noninteractiveMode : false,
			behaviorType : null
		};
		assert.deepEqual(this.representation.chart.getVizProperties().interaction, oInteraction, "Then vizProperties are applied to the chart");
	});
	QUnit.test("When there is a required filter", function(assert) {
		this.requiredParameterForInteraction.requiredFilters = [ "YearMonth" ];
		this.representation.getMainContent("sample Title", 600, 600);
		var oInteraction = {
			behaviorType : null
		};
		assert.deepEqual(this.representation.chart.getVizProperties().interaction, oInteraction, "Then vizProperties are applied to the chart");
		this.requiredParameterForInteraction.requiredFilters = [];
	});
	QUnit.module("Duplicate names in dimensions", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;
				that.requiredParameter = representationHelper.representationDataDimensionWithDuplicateName();
				that.representation = commonSetupForCreatingChart(that.requiredParameter, api);
				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When there is duplicate names for the dimensions", function(assert) {
		var oExpectedFeedItemGroup = {
			xAxis : [ {
				identity : "CompanyCodeCountry",
				name : "# text not available: Year Month Custom Text"
			}, {
				identity : "YearMonth",
				name : "# text not available: Year Month Custom Text"
			} ]
		};
		sinon.stub(this.representation, "getAxisFeedItemId", function(axisFeedItemId) {
			return axisFeedItemId;
		});
		var oFeedItemGroup = this.representation._createFeedItemGroup(this.requiredParameter.dimensions);
		assert.strictEqual(oFeedItemGroup.xAxis.length, this.requiredParameter.dimensions.length, "Then all the dimensions are used to create the feed item");
		assert.strictEqual(oFeedItemGroup.xAxis[0].identity, oExpectedFeedItemGroup.xAxis[0].identity, "Then identity of first dimension is correct");
		assert.strictEqual(oFeedItemGroup.xAxis[1].identity, oExpectedFeedItemGroup.xAxis[1].identity, "Then identity of second dimension is correct");
		assert.strictEqual(oFeedItemGroup.xAxis[0].name, oExpectedFeedItemGroup.xAxis[0].name, "Then name of first dimension is correct");
		assert.strictEqual(oFeedItemGroup.xAxis[1].name, oExpectedFeedItemGroup.xAxis[1].name, "Then name of second dimension is correct");
		this.representation.getAxisFeedItemId.restore();
	});

	QUnit.module("Base VizFrame Chart Representation manageSelectionsOnChart with changed filter values", {
		beforeEach : function(assert) {
			var done = assert.async();
			var testEnv = this;

			createUiApiAsPromise().done(function(oApi) {
				testEnv.oParameter = {
					dimensions : [],
					measures : [],
					requiredFilters : ["property1", "property2"]
				};
				testEnv.aGivenChartSelection = [{
					data : {
						property1 : "value 1",
						property2 : "value 2"
					}
				}, {
					data : {
						property1 : "value 3",
						property2 : "value 4"
					}
				}];
				testEnv.aGivenDataPointsFromSelection = [{
					property1 : "value a"
				},{
					property2 : "value b"
				}];
				testEnv.aGivenUniqueFilterValuesFromChart = ["value a", "value b"];
				//build chart
				testEnv.oChart = new BaseVizFrameChartRepresentation(oApi, testEnv.oParameter);
				testEnv.oChart.chart = {
					vizSelection : function() {
						return testEnv.aGivenChartSelection;
					}
				};
				testEnv.setSelectionOnMainChartSpy = sinon.spy(testEnv.oChart, "setSelectionOnMainChart");
				testEnv.oChart.thumbnailChart = {
					vizSelection : function() {}
				};
				testEnv.setSelectionOnThumbnailChartSpy = sinon.spy(testEnv.oChart, "setSelectionOnThumbnailChart");
				//build representation filter handler
				testEnv.oChart.oRepresentationFilterHandler = {
					getIfSelectedFilterChanged : function() {
						return true;
					},
					updateFilterFromSelection : function() {}
				};
				testEnv.getIfSelectedFilterChangedSpy = sinon.spy(testEnv.oChart.oRepresentationFilterHandler, "getIfSelectedFilterChanged");
				testEnv.updateFilterFromSelectionSpy = sinon.spy(testEnv.oChart.oRepresentationFilterHandler, "updateFilterFromSelection");
				//build selection handler
				var selectionHandler = {
					getSelectionInfoFromEvent : function(oCurrentSelectionEvent, bIsCalledFromDeselection, aGivenChartSelections) {
						return {
							dataPointsFromSelection : testEnv.aGivenDataPointsFromSelection,
							aUniqueFilterValueFromChart : testEnv.aGivenUniqueFilterValuesFromChart
						};
					}
				};
				testEnv.newVizFrameSelectionHandlerStub = sinon.stub(VizFrameSelectionHandler, "constructor", function() {
					return selectionHandler;
				});
				testEnv.getSelectionInfoFromEventSpy = sinon.spy(selectionHandler, "getSelectionInfoFromEvent");
				//build api functions
				oApi.selectionChanged = function() {};
				testEnv.selectionChangedSpy = sinon.spy(oApi, "selectionChanged");
				testEnv.oApi = oApi;
				done();
			});
		},
		afterEach : function() {
			//restore
			this.setSelectionOnMainChartSpy.restore();
			this.setSelectionOnThumbnailChartSpy.restore();
			this.getIfSelectedFilterChangedSpy.restore();
			this.updateFilterFromSelectionSpy.restore();
			this.getSelectionInfoFromEventSpy.restore();
			this.newVizFrameSelectionHandlerStub.restore();
			this.selectionChangedSpy.restore();
			this.oApi.oCompContainer.destroy();
		}
	});
	QUnit.test("when manageSelectionsOnChart is called (getSelectionInfoFromEvent)", function(assert) {
		//data
		var isCalledFromDeselection = false;
		var currentSelectionEvent = {
			mParameters : {
				data : [{
						data : {
							property1 : "value 5",
							property2 : "value 6"
						}
				}]
			}
		};
		//act
		this.oChart.manageSelectionsOnChart(currentSelectionEvent, isCalledFromDeselection, this.oParameter);
		//assert
		assert.strictEqual(this.getSelectionInfoFromEventSpy.callCount, 1, "then getSelectionInfoFromEvent is called once");
		assert.strictEqual(this.getSelectionInfoFromEventSpy.firstCall.args.length, 3, "then getSelectionInfoFromEvent is called with three arguments");
		assert.deepEqual(this.getSelectionInfoFromEventSpy.firstCall.args[0], currentSelectionEvent, "then getSelectionInfoFromEvent is called with the current selection event as first argument");
		assert.strictEqual(this.getSelectionInfoFromEventSpy.firstCall.args[1], isCalledFromDeselection, "then getSelectionInfoFromEvent is called with isCalledFromDeselection as second argument");
		assert.deepEqual(this.getSelectionInfoFromEventSpy.firstCall.args[2], this.aGivenChartSelection, "then getSelectionInfoFromEvent is called with the given chart selection as third argument");
	});
	QUnit.test("when manageSelectionsOnChart is called (setSelectionOnMainChart)", function(assert) {
		//empty data, because our assertions are build on the data passed through the stubs, to be independent of the correct call to getSelectionInfoFromEvent
		var isCalledFromDeselection = false;
		var currentSelectionEvent = {
			mParameters : {
				data : []
			}
		};
		//act
		this.oChart.manageSelectionsOnChart(currentSelectionEvent, isCalledFromDeselection, this.oParameter);
		//assert
		assert.strictEqual(this.setSelectionOnMainChartSpy.callCount, 1, "then setSelectionOnMainChart is called once");
		assert.strictEqual(this.setSelectionOnMainChartSpy.firstCall.args.length, 2, "then setSelectionOnMainChart is called with two arguments");
		assert.deepEqual(this.setSelectionOnMainChartSpy.firstCall.args[0], this.aGivenDataPointsFromSelection, "then setSelectionOnMainChart is called with the given data points as first argument");
		assert.strictEqual(this.setSelectionOnMainChartSpy.firstCall.args[1], isCalledFromDeselection, "then setSelectionOnMainChart is called with isCalledFromDeselection as second argument");
	});
	QUnit.test("when manageSelectionsOnChart is called (setSelectionOnThumbnailChart)", function(assert) {
		//empty data, because our assertions are build on the data passed through the stubs, to be independent of the correct call to getSelectionInfoFromEvent
		var isCalledFromDeselection = false;
		var currentSelectionEvent = {
			mParameters : {
				data : []
			}
		};
		//act
		this.oChart.manageSelectionsOnChart(currentSelectionEvent, isCalledFromDeselection, this.oParameter);
		//assert
		assert.strictEqual(this.setSelectionOnThumbnailChartSpy.callCount, 1, "then setSelectionOnThumbnailChart is called once");
		assert.strictEqual(this.setSelectionOnThumbnailChartSpy.firstCall.args.length, 2, "then setSelectionOnThumbnailChart is called with two arguments");
		assert.deepEqual(this.setSelectionOnThumbnailChartSpy.firstCall.args[0], this.aGivenDataPointsFromSelection, "then setSelectionOnThumbnailChart is called with the given data points as first argument");
		assert.strictEqual(this.setSelectionOnThumbnailChartSpy.firstCall.args[1], isCalledFromDeselection, "then setSelectionOnThumbnailChart is called with isCalledFromDeselection as second argument");
	});
	QUnit.test("when manageSelectionOnChart is called (getIfSelectedFilterChanged)", function(assert) {
		//empty data, because our assertions are build on the data passed through the stubs, to be independent of the correct call to getSelectionInfoFromEvent
		var isCalledFromDeselection = false;
		var currentSelectionEvent = {
			mParameters : {
				data : []
			}
		};
		//act
		this.oChart.manageSelectionsOnChart(currentSelectionEvent, isCalledFromDeselection, this.oParameter);
		//assert
		assert.strictEqual(this.getIfSelectedFilterChangedSpy.callCount, 1, "then getIfSelectedFilterChanged is called once");
		assert.strictEqual(this.getIfSelectedFilterChangedSpy.firstCall.args.length, 1, "then getIfSelectedFilterChanged is called with one argument");
		assert.deepEqual(this.getIfSelectedFilterChangedSpy.firstCall.args[0], this.aGivenUniqueFilterValuesFromChart, "then getIfSelectedFilterChanged is called with the given unique filter values as first argument");
	});
	QUnit.test("when manageSelectionsOnChart is called (updateFilterFromSelection)", function(assert) {
		//empty data, because our assertions are build on the data passed through the stubs, to be independent of the correct call to getSelectionInfoFromEvent
		var isCalledFromDeselection = false;
		var currentSelectionEvent = {
			mParameters : {
				data : []
			}
		};
		//act
		this.oChart.manageSelectionsOnChart(currentSelectionEvent, isCalledFromDeselection, this.oParameter);
		//assert
		assert.strictEqual(this.updateFilterFromSelectionSpy.callCount, 1, "then updateFilterFromSelection is called once");
		assert.strictEqual(this.updateFilterFromSelectionSpy.firstCall.args.length, 1, "then updateFilterFromSelection is called with one argument");
		assert.deepEqual(this.updateFilterFromSelectionSpy.firstCall.args[0], this.aGivenUniqueFilterValuesFromChart, "then updateFilterFromSelection is called with the given unique filter values as first argument");
	});
	QUnit.test("when manageSelectionsOnChart is called (selectionChanged)", function(assert) {
		//empty data, because our assertions are build on the data passed through the stubs, to be independent of the correct call to getSelectionInfoFromEvent
		var isCalledFromDeselection = false;
		var currentSelectionEvent = {
			mParameters : {
				data : []
			}
		};
		//act
		this.oChart.manageSelectionsOnChart(currentSelectionEvent, isCalledFromDeselection, this.oParameter);
		//assert
		assert.strictEqual(this.selectionChangedSpy.callCount, 1, "then selectionChanged is called once");
		assert.strictEqual(this.selectionChangedSpy.firstCall.args.length, 1, "then selectionChanged is called with one argument");
		assert.strictEqual(this.selectionChangedSpy.firstCall.args[0], false, "then selectionChanged is called with false as first argument");
	});

	QUnit.module("Base VizFrame Chart Representation manageSelectionsOnChart without changed filter values", {
		beforeEach : function(assert) {
			var done = assert.async();
			var testEnv = this;

			createUiApiAsPromise().done(function(oApi) {
				testEnv.oParameter = {
					dimensions : [],
					measures : [],
					requiredFilters : ["property1", "property2"]
				};
				//build chart
				testEnv.oChart = new BaseVizFrameChartRepresentation(oApi, testEnv.oParameter);
				testEnv.oChart.chart = {
					vizSelection : function() {
						return [];
					}
				};
				testEnv.oChart.thumbnailChart = {
					vizSelection : function() {}
				};
				//build representation filter handler
				testEnv.oChart.oRepresentationFilterHandler = {
					getIfSelectedFilterChanged : function() {
						return false;
					},
					updateFilterFromSelection : function() {}
				};
				testEnv.updateFilterFromSelectionSpy = sinon.spy(testEnv.oChart.oRepresentationFilterHandler, "updateFilterFromSelection");
				testEnv.oApi = oApi;
				done();
			});
		},
		afterEach : function() {
			this.updateFilterFromSelectionSpy.restore();
			this.oApi.oCompContainer.destroy();
		}
	});
	QUnit.test("when manageSelectionOnChart is called without changed filter values", function(assert) {
		//empty data, because our assertions are build on the data passed through the stubs, to be independent of the correct call to getSelectionInfoFromEvent
		var isCalledFromDeselection = false;
		var currentSelectionEvent = {
			mParameters : {
				data : []
			}
		};
		//act
		this.oChart.manageSelectionsOnChart(currentSelectionEvent, isCalledFromDeselection, this.oParameter);
		//assert
		assert.strictEqual(this.updateFilterFromSelectionSpy.called, false, "then updateFilterFromSelection is not called");
	});

	QUnit.module("Base VizFrame Chart Representation set selection on chart", {
		beforeEach : function(assert) {
			var done = assert.async();
			var testEnv = this;

			createUiApiAsPromise().done(function(oApi) {
				//build chart
				var parameter = {
					requiredFilters : ["property1"]
				};
				testEnv.oChart = new BaseVizFrameChartRepresentation(oApi, parameter);
				testEnv.oChart.chart = {
					vizSelection : function() {}
				};
				testEnv.oChart.thumbnailChart = {
					vizSelection : function() {}
				};
				//spy
				testEnv.chartVizSelectionSpy = sinon.spy(testEnv.oChart.chart, "vizSelection");
				testEnv.thumbnailChartVizSelectionSpy = sinon.spy(testEnv.oChart.thumbnailChart, "vizSelection");
				testEnv.oApi = oApi;
				done();
			});
		},
		afterEach : function(assert) {
			//restore
			this.chartVizSelectionSpy.restore();
			this.thumbnailChartVizSelectionSpy.restore();
			this.oApi.oCompContainer.destroy();
		}
	});
	QUnit.test("when setSelectionOnMainChart is called with an empty selection and isCalledFromDeselection:false", function(assert) {
		//setup
		var selection = [];
		var isCalledFromDeselection = false;
		//act
		this.oChart.setSelectionOnMainChart(selection, isCalledFromDeselection);
		//assert
		assert.strictEqual(this.chartVizSelectionSpy.callCount, 1, "then vizSelection (on main chart) is called once");
		assert.strictEqual(this.chartVizSelectionSpy.firstCall.args.length, 2, "then vizSelection is called with two arguments");
		assert.deepEqual(this.chartVizSelectionSpy.firstCall.args[0], selection, "then vizSelection is called with the empty selection as first argument");
		assert.strictEqual(this.chartVizSelectionSpy.firstCall.args[1].clearSelection, isCalledFromDeselection,
			"then vizSelection is called with a second argument that has the property clearSelection set to isCalledFromDeselection(false)");
	});
	QUnit.test("when setSelectionOnMainChart is called with an empty selection and isCalledFromDeselection:true", function(assert) {
		//setup
		var selection = [];
		var isCalledFromDeselection = true;
		//act
		this.oChart.setSelectionOnMainChart(selection, isCalledFromDeselection);
		//assert
		assert.strictEqual(this.chartVizSelectionSpy.callCount, 1, "then vizSelection (on main chart) is called once");
		assert.strictEqual(this.chartVizSelectionSpy.firstCall.args.length, 2, "then vizSelection is called with two arguments");
		assert.deepEqual(this.chartVizSelectionSpy.firstCall.args[0], selection, "then vizSelection is called with the empty selection as first argument");
		assert.strictEqual(this.chartVizSelectionSpy.firstCall.args[1].clearSelection, isCalledFromDeselection,
			"then vizSelection is called with a second argument that has the property clearSelection set to isCalledFromDeselection(true)");
	});
	QUnit.test("when setSelectionOnMainChart is called with a selection", function(assert) {
		//setup
		var selection = [{
			data : {
				property1 : "some value"
			}
		}];
		//act
		this.oChart.setSelectionOnMainChart(selection, undefined);
		//assert
		assert.strictEqual(this.chartVizSelectionSpy.callCount, 1, "then vizSelection (on main chart) is called once");
		assert.strictEqual(this.chartVizSelectionSpy.firstCall.args.length, 2, "then vizSelection is called with two arguments");
		assert.deepEqual(this.chartVizSelectionSpy.firstCall.args[0], selection, "then vizSelection is called with the selection as first argument");
	});
	QUnit.test("when setSelectionOnThumnailChart is called with an empty selection and isCalledFromDeselection:false", function(assert) {
		//setup
		var selection = [];
		var isCalledFromDeselection = false;
		//act
		this.oChart.setSelectionOnThumbnailChart(selection, isCalledFromDeselection);
		//assert
		assert.strictEqual(this.thumbnailChartVizSelectionSpy.callCount, 1, "then vizSelection (on thumbnail chart) is called once");
		assert.strictEqual(this.thumbnailChartVizSelectionSpy.firstCall.args.length, 2, "then vizSelection is called with two arguments");
		assert.deepEqual(this.thumbnailChartVizSelectionSpy.firstCall.args[0], selection, "then vizSelection is called with the empty selection as first argument");
		assert.strictEqual(this.thumbnailChartVizSelectionSpy.firstCall.args[1].clearSelection, isCalledFromDeselection,
			"then vizSelection is called with a second argument that has the property clearSelection set to isCalledFromDeselection(false)");
	});
	QUnit.test("when setSelectionOnThumbnailChart is called with an empty selection and isCalledFromDeselection:true", function(assert) {
		//setup
		var selection = [];
		var isCalledFromDeselection = true;
		//act
		this.oChart.setSelectionOnThumbnailChart(selection, isCalledFromDeselection);
		//assert
		assert.strictEqual(this.thumbnailChartVizSelectionSpy.callCount, 1, "then vizSelection (on thumnail chart) is called once");
		assert.strictEqual(this.thumbnailChartVizSelectionSpy.firstCall.args.length, 2, "then vizSelection is called with two arguments");
		assert.deepEqual(this.thumbnailChartVizSelectionSpy.firstCall.args[0], selection, "then vizSelection is called with the empty selection as first argument");
		assert.strictEqual(this.thumbnailChartVizSelectionSpy.firstCall.args[1].clearSelection, isCalledFromDeselection,
			"then vizSelection is called with a second argument that has the property clearSelection set to isCalledFromDeselection(true)");
	});
	QUnit.test("when setSelectionOnThumbnailChart is called with a selection", function(assert) {
		//setup
		var selection = [{
			data : {
				property1 : "some value"
			}
		}];
		//act
		this.oChart.setSelectionOnThumbnailChart(selection, undefined);
		//assert
		assert.strictEqual(this.thumbnailChartVizSelectionSpy.callCount, 1, "then vizSelection (on thumbnail chart) is called once");
		assert.strictEqual(this.thumbnailChartVizSelectionSpy.firstCall.args.length, 2, "then vizSelection is called with two arguments");
		assert.deepEqual(this.thumbnailChartVizSelectionSpy.firstCall.args[0], selection, "then vizSelection is called with the selection as first argument");
	});

	QUnit.module("Representation config without dimension and measure", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			createUiApiAsPromise(undefined, undefined, {
				constructors: {
					MessageHandler: function() {
						MessageHandler.apply(this, arguments);
						that.messageHandlerSpy = sinon.stub(this, "putMessage", function(){});
					}
				}
			}).done(function(api) {
				that.oGlobalApi = api;
				that.requiredParameterForInteraction = representationHelper.representationDataWithDimension();
				that.requiredParameterForInteraction.dimensions = [];
				that.requiredParameterForInteraction.measures = [];
				that.representation = commonSetupForCreatingChart(that.requiredParameterForInteraction, api);
				that.oApi = api;
				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
			this.messageHandlerSpy.restore();
			this.oApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When getMainContent is called", function(assert) {
		assert.strictEqual(this.messageHandlerSpy.callCount, 1, "Only one message was raised");
		assert.strictEqual(this.messageHandlerSpy.getCalls()[0].args[0].getCode(), 5074, "Only ushell navigation message was raised - No chart related message");
	});
	QUnit.module("Given BaseVizFrameChartRepresentation._setVizPropsForBubbleAndScatter", {
		beforeEach : function(assert) {
		},
		afterEach : function(assert) {
		}
	});
	function _resultContractMainChart(){
		return {
			valueAxis2 : {
				visible : true,
				title : {
					visible : true
				},
				label : {
					visible : true
				}
			},
			sizeLegend : {
				visible : true
			},
			plotArea : {
				adjustScale : true
			}
		};
	}
	function _resultContractThumbnail(){
		return {
			valueAxis2 : {
				visible : false,
				title : {
					visible : false
				}
			},
			sizeLegend : {
				visible : false
			},
			plotArea : {
				adjustScale : true,
				markerSize : 4,
				marker : {
					visible : true,
					size : 4
				}
			}
		};
	}
	function assert_setVizPropsForBubbleAndScatter(assert, bIsMainChart, testSpecification) {
		testSpecification.forEach(function(oneTest){
			var resultContract = bIsMainChart ? _resultContractMainChart() : _resultContractThumbnail();
			// act
			var result = BaseVizFrameChartRepresentation._setVizPropsForBubbleAndScatter(oneTest.in, bIsMainChart);
			// then
			assert.strictEqual(result.plotArea.colorDepth, oneTest.out.colorDepth, "then colorDepth has expected value: " + JSON.stringify(oneTest.in));
			assert.strictEqual(result.plotArea.shapeDepth, oneTest.out.shapeDepth, "then shapeDepth has expected value: " + JSON.stringify(oneTest.in));
			if (oneTest.in && oneTest.in[0] && oneTest.in[0].kind === undefined){
				assert.strictEqual( oneTest.in.kind, constants.representationMetadata.kind.REGIONCOLOR,
					"if kind in the first item is undefined then the function sets it to REGIONCOLOR");
			}
			assert.strictEqual(result.plotArea.adjustScale, resultContract.plotArea.adjustScale, "then plotArea has expected value");
			if (!bIsMainChart) {
				assert.strictEqual(result.plotArea.markerSize, resultContract.plotArea.markerSize, "then markerSize has expected value");
				assert.deepEqual(result.plotArea.marker, resultContract.plotArea.marker, "then marker is expected object");
			}
			assert.deepEqual(result.valueAxis2, resultContract.valueAxis2, "then valueAxis2 has expected fields");
			assert.deepEqual(result.sizeLegend, resultContract.sizeLegend, "then sizeLegend has expected fields");
		});
	}
	QUnit.test("When called", function(assert) {
		var testSpec = [
			{
				in:[],
				out: { colorDepth: undefined, shapeDepth: undefined}
			},
			{
				in:[{"fieldName" : "hugo2", "kind" : constants.representationMetadata.kind.REGIONCOLOR}],
				out: { colorDepth: 1, shapeDepth: undefined}
			},
			{
				in:[{"fieldName" : "hugo3", "kind" : constants.representationMetadata.kind.REGIONSHAPE}],
				out: { colorDepth: undefined, shapeDepth: 1}
			},
			{
				in:[{"fieldName" : "hugo4", "kind" : constants.representationMetadata.kind.REGIONCOLOR},
					{"fieldName" : "otto", "kind" : constants.representationMetadata.kind.REGIONCOLOR}],
				out: { colorDepth: 2, shapeDepth: undefined}
			},
			{
				in:[{"fieldName" : "hugo5", "kind" : constants.representationMetadata.kind.REGIONSHAPE},
					{"fieldName" : "otto", "kind" : constants.representationMetadata.kind.REGIONSHAPE}],
				out: { colorDepth: undefined, shapeDepth: 2}
			},
			{
				in:[{"fieldName" : "hugo6", "kind" : constants.representationMetadata.kind.REGIONCOLOR},
					{"fieldName" : "otto", "kind" : constants.representationMetadata.kind.REGIONSHAPE}],
				out: { colorDepth: 1, shapeDepth: 1}
			}
		];
		assert_setVizPropsForBubbleAndScatter( assert, true, testSpec);
		assert_setVizPropsForBubbleAndScatter( assert, false, testSpec);
	});
	QUnit.module("setVizPropertiesOnChart for specific chart types", {
		beforeEach : function() {
			var that = this;
			this.vizProperties = [];
			this.vizThumbnailProperties = [];
			var api = {};
			var parameter = {
				requiredFilters : []
			};
			this.baseVizFrameChartRepresentation = new BaseVizFrameChartRepresentation(api, parameter);
			this.baseVizFrameChartRepresentation.chart = {
				setVizProperties : function(properties){
					that.vizProperties.push(properties);
				}
			};
			this.baseVizFrameChartRepresentation.thumbnailChart = {
				setVizProperties : function(properties){
					that.vizThumbnailProperties.push(properties);
				}
			};
			this.baseVizFrameChartRepresentation.title = "ChartTitle";
			this.stubSetVizPropertiesForCombinationCharts = sinon.stub(this.baseVizFrameChartRepresentation, "getVizPropertiesForCombinationCharts", function(){
				return "CombinationVizProperties";
			});
		},
		afterEach : function(){
			this.stubSetVizPropertiesForCombinationCharts.restore();
		}
	});
	QUnit.test("Normal chart type (Column)", function(assert) {
		this.baseVizFrameChartRepresentation.type = "ColumnChart";
		this.baseVizFrameChartRepresentation.setVizPropertiesOnChart();
		assert.strictEqual(this.vizProperties.length, 1, "SetVizProperties called once");
		assert.strictEqual(this.vizProperties[0].title.text, "ChartTitle", "Standard VizProperties set to the chart");
		assert.strictEqual(this.stubSetVizPropertiesForCombinationCharts.callCount, 0, "Setter of specific properties for combination charts was not called");
	});
	QUnit.test("Combination chart type (DualStackedCombinationChart)", function(assert) {
		this.baseVizFrameChartRepresentation.type = "DualStackedCombinationChart";
		this.baseVizFrameChartRepresentation.setVizPropertiesOnChart();
		assert.strictEqual(this.vizProperties.length, 2, "SetVizProperties called once");
		assert.strictEqual(this.vizProperties[0].title.text, "ChartTitle", "Standard vizProperties set to the chart");
		assert.strictEqual(this.vizProperties[1], "CombinationVizProperties", "Properties for cominbation chart is set to the chart");
		assert.strictEqual(this.stubSetVizPropertiesForCombinationCharts.callCount, 1, "Setter of specific properties for combination charts was called");
	});
	QUnit.test("Normal chart type (Column) thumbnail", function(assert) {
		this.baseVizFrameChartRepresentation.type = "ColumnChart";
		this.baseVizFrameChartRepresentation.setVizPropertiesOnThumbnailChart();
		assert.strictEqual(this.vizThumbnailProperties.length, 1, "SetVizProperties called once");
		assert.strictEqual(this.vizThumbnailProperties[0].title.visible, false, "Standard VizProperties set to the chart");
		assert.strictEqual(this.stubSetVizPropertiesForCombinationCharts.callCount, 0, "Setter of specific properties for combination charts was not called");
	});
	QUnit.test("Combination chart type (DualStackedCombinationChart) thumbnail", function(assert) {
		this.baseVizFrameChartRepresentation.type = "DualStackedCombinationChart";
		this.baseVizFrameChartRepresentation.setVizPropertiesOnThumbnailChart();
		assert.strictEqual(this.vizThumbnailProperties.length, 2, "SetVizProperties called once");
		assert.strictEqual(this.vizThumbnailProperties[0].title.visible, false, "Standard vizProperties set to the chart");
		assert.strictEqual(this.vizThumbnailProperties[1], "CombinationVizProperties", "Properties for cominbation chart is set to the chart");
		assert.strictEqual(this.stubSetVizPropertiesForCombinationCharts.callCount, 1, "Setter of specific properties for combination charts was called");
	});
	QUnit.module("setVizPropertiesForCombinationCharts", {
		beforeEach : function() {
			var api = {};
			var parameter = {
				requiredFilters : []
			};
			this.baseVizFrameChartRepresentation = new BaseVizFrameChartRepresentation(api, parameter);
			this.baseVizFrameChartRepresentation.type = "DualStackedCombinationChart"; // just one combination chart, no need to test the various different ones
			this.representationTypesHandler = new RepresentationTypesHandler();
		},
		afterEach : function(){
		}
	});
	QUnit.test("With measures, but without measureOptions", function(assert) {
		this.baseVizFrameChartRepresentation.measures = [{
			kind : "yAxis"
		},{
			kind : "yAxis2"
		}];
		var expectedVizProperties = {
				plotArea : {
					dataShape : {
					}
				}
		};
		assert.deepEqual(this.baseVizFrameChartRepresentation.getVizPropertiesForCombinationCharts(this.representationTypesHandler), expectedVizProperties, "DataShape property correctly returned");
	});
	QUnit.test("With one measure axis", function(assert) {
		this.baseVizFrameChartRepresentation.measures = [{
			kind : "yAxis",
			measureDisplayOption : "line"
		},{
			kind : "yAxis",
			measureDisplayOption : "bar"
		}];
		var expectedVizProperties = {
			plotArea : {
				dataShape : {
					primaryAxis : ["line", "bar"]
				}
			}
		};
		assert.deepEqual(this.baseVizFrameChartRepresentation.getVizPropertiesForCombinationCharts(this.representationTypesHandler), expectedVizProperties, "DataShape property correctly returned");
	});
	QUnit.test("With two measure axes", function(assert) {
		this.baseVizFrameChartRepresentation.measures = [{
			kind : "yAxis",
			measureDisplayOption : "line"
		},{
			kind : "yAxis2",
			measureDisplayOption : "bar"
		},{
			kind: "yAxis2",
			measureDisplayOption : "line"
		}, {
			kind : "yAxis",
			measureDisplayOption : "bar"
		}];
		var expectedVizProperties = {
			plotArea : {
				dataShape : {
					primaryAxis : ["line", "bar"],
					secondaryAxis : ["bar", "line"]
				}
			}
		};
		assert.deepEqual(this.baseVizFrameChartRepresentation.getVizPropertiesForCombinationCharts(this.representationTypesHandler), expectedVizProperties, "DataShape property correctly returned");
	});
});
