/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define("sap/apf/ui/representations/tBaseUI5ChartRepresentation.qunit", [
	"sap/apf/testhelper/baseClass/baseUI5ChartRepresentation",
	"sap/apf/testhelper/config/representationHelper",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/testhelper/odata/sampleService",
	"sap/apf/ui/representations/RepresentationInterfaceProxy",
	"sap/apf/ui/representations/BaseUI5ChartRepresentation",
	"sap/apf/ui/representations/table",
	"sap/apf/ui/representations/utils/representationFilterHandler",
	"sap/apf/utils/utils"
], function(BaseUI5ChartRepresentationTestHelper, RepresentationHelper, createUiApiAsPromise, sampleService,
			RepresentationInterfaceProxy, BaseUI5ChartRepresentation, Table, RepresentationFilterHandler, Utils) {
	"use strict";

	/*BEGIN_TEMPORARY_FIX*/
	var Utils = sap.apf.utils;
	/*END_TEMPORARY_FIX*/

	/*BEGIN_COMPATIBILITY*/
	var sampleService = sampleService || sap.apf.testhelper.odata.getSampleService;
	var RepresentationFilterHandler = RepresentationFilterHandler || sap.apf.ui.representations.utils.RepresentationFilterHandler;
	/*END_COMPATIBILITY*/

	function noop() {}

	function getSampleMetadata() {
		return {
			getPropertyMetadata : RepresentationHelper.prototype.setPropertyMetadataStub.call()
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
	function commonSetupForCreatingTable(requiredParameter, oGlobalApi) {
		var interfaceProxy = new RepresentationInterfaceProxy(oGlobalApi.oCoreApi, oGlobalApi.oUiApi);
		var table = new Table(interfaceProxy, requiredParameter);

		table.setData(getSampleData(oGlobalApi), getSampleMetadata());

		return table;
	}

	function TestRepresentation(oApi, oParameters) {
		BaseUI5ChartRepresentation.apply(this, [ oApi, oParameters ]);
	}

	TestRepresentation.prototype = Object.create(BaseUI5ChartRepresentation.prototype);
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

	BaseUI5ChartRepresentationTestHelper.run(TestRepresentation);

	QUnit.module("Base UI5 Chart Representation Tests - Inherited test class", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;

			createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;

				var requiredParameter = RepresentationHelper.prototype.representationDataDimensionContainsFilterProperty();
				that.representation = commonSetupForCreatingChart(requiredParameter, api);

				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When setData is called for the representation on initialization", function(assert) {
		var spySetMetadataAndDataResponse = sinon.spy(this.representation.oRepresentationFilterHandler, "setMetadataAndDataResponse");
		var aSampleData = sampleService(this.oGlobalApi.oApi, 'sampleData');
		this.representation.setData(aSampleData, getSampleMetadata());
		assert.strictEqual(spySetMetadataAndDataResponse.called, true, "then setMetadataAndDataResponse is called from setData");
		assert.deepEqual(spySetMetadataAndDataResponse.getCall(0).args[0].getPropertyMetadata(), getSampleMetadata().getPropertyMetadata(), "then correct metadata is set to the representation filter handler");
		assert.deepEqual(spySetMetadataAndDataResponse.getCall(0).args[1], aSampleData, "then correct dataset is set to the representation filter handler");
		spySetMetadataAndDataResponse.restore();
	});
	QUnit.test("When setData is called the filter from selection gets validated", function(assert){
		var spyValidateFiltersWithDataset = sinon.spy(this.representation.oRepresentationFilterHandler, "validateFiltersWithDataset");
		this.representation.adoptSelection({getFilter: function(){
				return this.oGlobalApi.oApi.createFilter().getTopAnd().addOr().addExpression({
					operator : "eq",
					value : "AR",
					name : "CustomerCodeCountry"
				}).addExpression({
					operator : "eq",
					value : "InvalidCountry",
					name : "CustomerCodeCountry"
				});
			}.bind(this)});
		var aSampleData = sampleService(this.oGlobalApi.oApi, 'sampleData');
		this.representation.setData(aSampleData, getSampleMetadata());
		//assert
		var validatedFilters = this.representation.getFilter();
		assert.strictEqual(validatedFilters.getInternalFilter().toUrlParam(), "(CompanyCodeCountry%20eq%20%27AR%27)", "Only the filter that is in the dataset is returned");
		assert.strictEqual(spyValidateFiltersWithDataset.called, true, "then validateFiltersWithDataset is called from setData");
		spyValidateFiltersWithDataset.restore();
	});
	QUnit.test("When representation is destroyed", function(assert) {
		this.representation.initializeChart();
		var chart = this.representation.chart;

		sinon.spy(chart, "detachSelectData");
		sinon.spy(chart, "detachDeselectData");
		sinon.spy(chart, "destroy");

		this.representation.destroy();

		assert.ok(chart.detachSelectData.calledOnce, "then selection handler is detached");
		assert.ok(chart.detachDeselectData.calledOnce, "then selection handler is detached");
		assert.ok(chart.destroy.calledOnce, "then chart is destroyed");
	});

	QUnit.module("Base UI5 Chart Representation Tests - Serialization and deserialization of a chart without alternate representation", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;

			createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;

				var requiredParameter = RepresentationHelper.prototype.representatationDataWithProperty();
				that.representation = commonSetupForCreatingChart(requiredParameter, api);
				that.representation.bIsAlternateView = false;

				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When createDataset is called", function(assert) {
		sinon.spy(this.representation.oChartDataSetHelper, "getFlattenDataSet");
		sinon.spy(this.representation.oChartDataSetHelper, "getModel");
		sinon.spy(this.representation.oChartDataSetHelper, "createFlattenDataSet");
		this.representation.createDataset();
		assert.strictEqual(this.representation.oChartDataSetHelper.createFlattenDataSet.called, false, "then flatten dataset is just called once");
		assert.strictEqual(this.representation.oChartDataSetHelper.getFlattenDataSet.calledOnce, true, "then getFlattenDataSet is called");
		assert.strictEqual(this.representation.oChartDataSetHelper.getModel.calledOnce, true, "then getModel is called");
	});
	QUnit.test("WHEN chart is serialized", function(assert) {
		var serializedConfig = this.representation.serialize();
		var expectedOrderby = [ {
			"ascending" : false,
			"property" : "CompanyCodeCountry"
		} ];

		assert.deepEqual(serializedConfig.orderby, expectedOrderby, "THEN no alternate representation is serialized");
		assert.equal(serializedConfig.bIsAlternateView, false, "THEN serialized chart is not an alternate Representation");

		this.representation.destroy();
	});
	QUnit.test("WHEN chart is deserialized", function(assert) {
		this.representation.deserialize({
			bIsAlternateView : false,
			orderby : [ {
				"ascending" : true,
				"Property" : "Month"
			} ],
			oFilter : [ "1001" ]
		});

		assert.strictEqual(this.representation.toggleInstance, undefined, "THEN no alternate representation is created");
		assert.strictEqual(this.representation.bIsAlternateView, false, "THEN a chart is deserialized");

		this.representation.destroy();
	});

	QUnit.module("Base UI5 Chart Representation Tests - Serialization and deserialization of a alternate representation", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;

			createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;

				var requiredParameter = RepresentationHelper.prototype.representatationDataWithProperty();
				that.representation = commonSetupForCreatingChart(requiredParameter, api);
				requiredParameter = RepresentationHelper.prototype.alternateRepresentation();
				that.representation.toggleInstance = commonSetupForCreatingChart(requiredParameter, api);
				that.representation.bIsAlternateView = true;

				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("WHEN alternate representation is serialized with an orderby value", function(assert) {
		//act
		var serializedData = this.representation.serialize();

		//assert
		assert.deepEqual(this.representation.toggleInstance.orderby, serializedData.orderby, "THEN the orderby value is serialised");
		this.representation.destroy();
	});
	QUnit.test("WHEN alternate representation is deserialized with an orderby value", function(assert) {
		//act
		this.representation.deserialize({
			bIsAlternateView : true,
			orderby : [ {
				"ascending" : true,
				"Property" : "Month"
			} ],
			oFilter : [ "1001" ]
		});

		//assert
		assert.strictEqual(this.representation.toggleInstance.orderby[0].ascending, true, "THEN the ordering direction is ascending and is deserialized");
		assert.strictEqual(this.representation.toggleInstance.orderby[0].Property, "Month", "THEN the ordering property is Month and is deserialized");

		this.representation.destroy();
	});

	QUnit.module("Base UI5 Chart Representation Tests - Request options evaluation of alternateRepresentation", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;

			createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;

				var requiredParameter = RepresentationHelper.prototype.representatationDataForAlternateRep();
				that.representation = commonSetupForCreatingChart(requiredParameter, api);
				requiredParameter = RepresentationHelper.prototype.alternateRepresentation();
				that.representation.toggleInstance = commonSetupForCreatingTable(requiredParameter, api);
				that.representation.bIsAlternateView = true;

				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When request options are evaluated", function(assert) {
		var getRequestOptionsSpy = sinon.spy(this.representation.toggleInstance, "getRequestOptions");
		var requestOptions = this.representation.getRequestOptions(false);
		var expectedOrderby = [ {
			ascending : false,
			property : "CompanyCodeCountry"
		} ];

		assert.deepEqual(requestOptions.orderby, expectedOrderby, "Then correct sort criterium is returned.");
		assert.ok(getRequestOptionsSpy.calledOnce, "getRequestOptions of alternate representation is called.");

		this.representation.destroy();
	});
	QUnit.test("When filter option lable is available", function(assert) {
		var sFilterLabel = this.representation.getSelectionFilterLabel("country");

		assert.deepEqual(sFilterLabel, "Company Code Country", "Then correct label is returned.");

		this.representation.destroy();
	});

	QUnit.module("Base UI5 Chart Representation Tests - Set data of alternateRepresentation", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;

			createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;

				var requiredParameter = RepresentationHelper.prototype.representatationDataForAlternateRep();
				that.representation = commonSetupForCreatingChart(requiredParameter, api);
				requiredParameter = RepresentationHelper.prototype.alternateRepresentation();
				that.representation.toggleInstance = commonSetupForCreatingTable(requiredParameter, api);
				that.representation.bIsAlternateView = true;

				done();
			});
		},
		afterEach : function(assert) {
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When data of alternate representation is set", function(assert) {
		var setDataSpy = sinon.spy(this.representation.toggleInstance, "setData");

		this.representation.setData(getSampleData(this.oGlobalApi), getSampleMetadata());

		assert.ok(setDataSpy.calledOnce, "Then setData is called.");

		this.representation.destroy();
	});

	QUnit.module("Base UI5 Chart Representation Tests - Get Sorted Selections", {
		beforeEach : function() {
			var that = this;
			this.stubGetFilterInfo = sinon.stub(RepresentationFilterHandler.prototype, "getDisplayInfoForFilters", function() {
				return that.filterInfo;
			});
			this.baseRepresentation = new BaseUI5ChartRepresentation({}, {
				requiredFilters : ["requiredFilter"]
			});
			this.baseRepresentation.oModel = {
				getData : function() {
					return {};
				}
			};
			this.baseRepresentation.metadata = {
					getPropertyMetadata : function(property) {
						if(property === "requiredFilter"){
							return {
								type: "Edm.String",
								text : "requiredFilterText"
							};
						} else if (property === "requiredFilterText"){
							return {
								type: "Edm.String"
							};
						}
					}
			};
		},
		afterEach : function() {
			this.stubGetFilterInfo.restore();
		}
	});
	QUnit.test("No Filter values", function(assert) {
		this.filterInfo = [];
		var sortedSelections = this.baseRepresentation.getSortedSelections();

		assert.deepEqual(sortedSelections, [], "Empty Array returned");
	});
	QUnit.test("Selectable property has no display option", function(assert) {
		var spy = sinon.spy(Utils, "sortByProperty");
		this.filterInfo = [ {
			id: "3",
			text : "3"
		}, {
			id : "4",
			text : "4"
		}, {
			id : "1",
			text : "1"
		}, {
			id : "2",
			text : "2"
		} ];
		var expectedSorted = [ {
			id : "1",
			text : "1"
		}, {
			id : "2",
			text : "2"
		}, {
			id: "3",
			text : "3"
		}, {
			id : "4",
			text : "4"
		} ];
		var sortedSelections = this.baseRepresentation.getSortedSelections();
		assert.deepEqual(sortedSelections, expectedSorted, "Sorted Array returned");
		assert.ok(spy.calledWith(this.filterInfo, "id", { type : "Edm.String", text : "requiredFilterText"}), "THEN sorting function was called with metadata from key property");
		spy.restore();
	});
	QUnit.test("Selectable property has key option", function(assert) {
		var spy = sinon.spy(Utils, "sortByProperty");
		this.baseRepresentation.parameter = {
			requiredFilters : [ "requiredFilter" ],
			requiredFilterOptions : {
				labelDisplayOption : "key"
			}
		};
		this.filterInfo = [ {
			id: "3",
			text : "3"
		}, {
			id : "4",
			text : "4"
		}, {
			id : "1",
			text : "1"
		}, {
			id : "2",
			text : "2"
		} ];
		var expectedSorted = [ {
			id : "1",
			text : "1"
		}, {
			id : "2",
			text : "2"
		}, {
			id: "3",
			text : "3"
		}, {
			id : "4",
			text : "4"
		} ];
		var sortedSelections = this.baseRepresentation.getSortedSelections();
		assert.deepEqual(sortedSelections, expectedSorted, "Sorted Array returned");
		assert.ok(spy.calledWith(this.filterInfo, "id", { type : "Edm.String", text : "requiredFilterText"}), "THEN sorting function was called with metadata from key property");
		spy.restore();
	});
	QUnit.test("Selectable property has text option", function(assert) {
		var spy = sinon.spy(Utils, "sortByProperty");
		this.baseRepresentation.parameter = {
				requiredFilters : [ "requiredFilter" ],
				requiredFilterOptions : {
					labelDisplayOption : "text"
				}
		};
		this.filterInfo = [ {
			id: "1",
			text : "abc"
		}, {
			id : "2",
			text : "a"
		}, {
			id : "3",
			text : "z"
		}, {
			id : "4",
			text : "0"
		} ];
		var expectedSorted = [ {
			id : "4",
			text : "0"
		}, {
			id : "2",
			text : "a"
		}, {
			id: "1",
			text : "abc"
		}, {
			id : "3",
			text : "z"
		} ];
		var sortedSelections = this.baseRepresentation.getSortedSelections();
		assert.deepEqual(sortedSelections, expectedSorted, "Sorted Array returned");
		assert.ok(spy.calledWith(this.filterInfo, "text", { type : "Edm.String"}), "THEN sorting function was called with metadata from text property");
		spy.restore();
	});
	QUnit.test("Selectable property has keyAndText option", function(assert) {
		var spy = sinon.spy(Utils, "sortByProperty");
		this.baseRepresentation.parameter = {
				requiredFilters : [ "requiredFilter" ],
				requiredFilterOptions : {
					labelDisplayOption : "keyAndText"
				}
		};
		this.filterInfo = [ {
			id: "1",
			text : "abc - 1"
		}, {
			id : "2",
			text : "a - 2"
		}, {
			id : "3",
			text : "z - 3"
		}, {
			id : "4",
			text : "0 - 4"
		} ];
		var expectedSorted = [ {
			id : "4",
			text : "0 - 4"
		}, {
			id : "2",
			text : "a - 2"
		}, {
			id: "1",
			text : "abc - 1"
		}, {
			id : "3",
			text : "z - 3"
		} ];
		var sortedSelections = this.baseRepresentation.getSortedSelections();
		assert.deepEqual(sortedSelections, expectedSorted, "Sorted Array returned");
		assert.ok(spy.calledWith(this.filterInfo, "text"), "THEN sorting function was called without metadata");
		spy.restore();
	});
	QUnit.module("Base UI5 Chart Representation Tests - Handle selection and deselection", {
		beforeEach : function(assert) {
			var done = assert.async();
			var testEnv = this;

			createUiApiAsPromise().done(function(oApi) {
				testEnv.oParameter = {
					dimensions : [],
					measures : [],
					requiredFilters : ["property1", "property2"]
				};
				testEnv.oChart = new BaseUI5ChartRepresentation(oApi, testEnv.oParameter);
				//define chart with the necessary functions, so we don't have to create the main content
				testEnv.oChart.chart = {
					attachEvent : function() {}
				};
				//define manageSelectionsOnChart, because this would only be defined in an implementation of BaseUI5ChartRepresentation
				testEnv.oChart.manageSelectionsOnChart = function() {};
				//spy
				testEnv.manageSelectionsOnChartSpy = sinon.spy(testEnv.oChart, "manageSelectionsOnChart");
				testEnv.oApi = oApi;
				done();
			});
		},
		afterEach : function() {
			//restore
			this.manageSelectionsOnChartSpy.restore();
			this.oApi.oCompContainer.destroy();
		}
	});
	QUnit.test("Handle selection", function(assert) {
		//data
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		//act
		this.oChart.handleSelection(inputEvent);
		//assert
		//currently it is checked if the first parameter is reference equal to inputEvent, but deep equality should be sufficient
		assert.ok(this.manageSelectionsOnChartSpy.calledOnce, "manageSelectionsOnChart is only called once");
		assert.ok(this.manageSelectionsOnChartSpy.calledWith(inputEvent, false, this.oParameter),
			"manageSelectionsOnChart is called with the input parameter of handleSelection, 'false' and the chart parameter");
	});
	QUnit.test("Handle deselection", function(assert) {
		//data
		var inputEvent = {
			mParameters : {
				data : []
			}
		};
		//act
		this.oChart.handleDeselection(inputEvent);
		//assert
		//currently it is checked if the first parameter is reference equal to inputEvent, but deep equality should be sufficient
		assert.ok(this.manageSelectionsOnChartSpy.calledOnce, "manageSelectionsOnChart is only called once");
		assert.ok(this.manageSelectionsOnChartSpy.calledWith(inputEvent, true, this.oParameter),
			"manageSelectionsOnChart is called with the input parameter of handleDeselection, 'true' and the chart parameter");
	});
	QUnit.module("Set data for Bubble Chart and Scatter Plot", {
		beforeEach : function() {
			var oApi = {
				getEventCallback : noop,
				getTextNotHtmlEncoded : noop,
				getExits : noop
			};
			this.baseRepresentation = new BaseUI5ChartRepresentation(oApi, {
				dimensions : [],
				measures : [],
				requiredFilters : ["requiredFilter"]
			});
			this.baseRepresentation.oModel = {
				getData : function() {
					return {};
				}
			};
			this.baseRepresentation.metadata = {
					getPropertyMetadata : function(property) {
						if(property === "requiredFilter"){
							return {
								type: "Edm.String",
								text : "requiredFilterText"
							};
						} else if (property === "requiredFilterText"){
							return {
								type: "Edm.String"
							};
						}
					}
			};
			this.addUnusedDimensionsToChartContextStub = sinon.stub(sap.apf.ui.representations.utils.ChartDataSetHelper.prototype, "addUnusedDimensionsToChartContext", noop);
		},
		afterEach : function() {
			this.addUnusedDimensionsToChartContextStub.restore();
		}
	});
	QUnit.test("Scatter Plot", function(assert){
		this.baseRepresentation.chartType = sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.SCATTERPLOT;
		this.baseRepresentation.setData(["dataResponse"], this.baseRepresentation.metadata);
		assert.strictEqual(this.addUnusedDimensionsToChartContextStub.callCount, 1, "addUnusedDimensionsToChartContextStub has been called within setData");
		assert.strictEqual(this.addUnusedDimensionsToChartContextStub.getCall(0).args[0], this.baseRepresentation.metadata, "metadata has been handed over");
		assert.deepEqual(this.addUnusedDimensionsToChartContextStub.getCall(0).args[1], ["dataResponse"], "aDataResponse has been handed over");
	});
	QUnit.test("Bubble Chart", function(assert){
		this.baseRepresentation.chartType = sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.BUBBLE;
		this.baseRepresentation.setData(["dataResponse"], this.baseRepresentation.metadata);
		assert.strictEqual(this.addUnusedDimensionsToChartContextStub.callCount, 1, "addUnusedDimensionsToChartContextStub has been called within setData");
		assert.strictEqual(this.addUnusedDimensionsToChartContextStub.getCall(0).args[0], this.baseRepresentation.metadata, "metadata has been handed over");
		assert.deepEqual(this.addUnusedDimensionsToChartContextStub.getCall(0).args[1], ["dataResponse"], "aDataResponse has been handed over");
	});
	QUnit.test("Other Chart", function(assert){
		this.baseRepresentation.chartType = sap.apf.ui.utils.CONSTANTS.vizFrameChartTypes.BAR;
		this.baseRepresentation.setData(["dataResponse"], this.baseRepresentation.metadata);
		assert.strictEqual(this.addUnusedDimensionsToChartContextStub.callCount, 0, "addUnusedDimensionsToChartContextStub has been called within setData");
	});
});
