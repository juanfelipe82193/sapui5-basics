jQuery.sap.require('sap.apf.ui.representations.utils.chartDataSetHelper');
jQuery.sap.require("sap.apf.ui.representations.utils.timeAxisDateConverter");
jQuery.sap.require("sap.apf.ui.utils.formatter");
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../../testhelper');
jQuery.sap.require("sap.apf.testhelper.doubles.UiInstance");
jQuery.sap.require("sap.apf.testhelper.doubles.createUiApiAsPromise");
jQuery.sap.require("sap.apf.testhelper.odata.sampleService");
jQuery.sap.require('sap.apf.testhelper.config.representationHelper');
(function() {
	"use strict";
	var oChartDataSetHelper,
		oRepresentationHelper,
		oParameter,
		oMetadata,
		aDataResponse;
	function _getsampleMetadata() {
		return {
			getPropertyMetadata : oRepresentationHelper.setPropertyMetadataStub.call()
		};
	}
	function commonSetup(context, dimensions, measures, metadata, data){
		var timeAxisConverter = {
			createPropertyInfo : function(){},
			setConvertedDateLookUp : function(){}
		};
		context.chartDataSetHelper = new sap.apf.ui.representations.utils.ChartDataSetHelper({}, timeAxisConverter);
		context.chartDataSetHelper.createFlattenDataSet({
			dimensions : dimensions || [],
			measures : measures || [],
			requiredFilters : []
		}, metadata, data);
	}
	QUnit.module("Display value of dimensions or filters", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				oRepresentationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				oParameter = oRepresentationHelper.representationDataDimension();
				oMetadata = _getsampleMetadata();
				aDataResponse = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				var oFormatter = new sap.apf.ui.utils.formatter({
					getEventCallback : that.oGlobalApi.oApi.getEventCallback.bind(that.oGlobalApi.oApi),
					getTextNotHtmlEncoded : that.oGlobalApi.oApi.getTextNotHtmlEncoded,
					getExits : that.oGlobalApi.oUiApi.getCustomFormatExit()
				}, oMetadata, aDataResponse);
				var oTimeAxisDateConverter = new sap.apf.ui.representations.utils.TimeAxisDateConverter();
				oChartDataSetHelper = new sap.apf.ui.representations.utils.ChartDataSetHelper(oFormatter, oTimeAxisDateConverter);
				done();
			});
		},
		afterEach: function(){
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When initializing chart data set helper", function(assert) {
		assert.notEqual(oChartDataSetHelper, undefined, "then instance of chart dataset helper is created");
		assert.notEqual(oChartDataSetHelper.oFormatter, undefined, "then instance of formatter is created");
		assert.strictEqual(oChartDataSetHelper.aDataResponseWithDisplayValue.length, 0, "then aDataResponseWithDisplayValue is an empty array");
		assert.notEqual(oChartDataSetHelper.oDisplayOptionHandler, undefined, "then instance of display option handler is created");
	});
	QUnit.test("When createFlattenDataSet is called", function(assert) {
		var aExpectedDimensions = [ {
			name : "Company Code Country",
			value : "{CompanyCodeCountry}",
			identity:"CompanyCodeCountry",
			displayValue : "{CompanyCodeCountry}"
		} ];
		var aExpectedMeasures = [ {
			name : "Revenue in Display Currency",
			value : "{RevenueAmountInDisplayCrcy_E}",
			identity:"RevenueAmountInDisplayCrcy_E"
		} ];
		oChartDataSetHelper.createFlattenDataSet(oParameter, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		assert.strictEqual(oChartDataSetHelper.oChartDataSet.dimensions.length, 1, "then one dimesion is available in chart dataset which is used for both dimension and filter property");
		assert.notEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0]["CompanyCodeCountry"], undefined, "then expected column name is same as dimension name");
		assert.strictEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0]["CompanyCodeCountry"], "AR", "then data is populated for dimension");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.dimensions, aExpectedDimensions, "then correct dimensions are formed");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.measures, aExpectedMeasures, "then correct measures are formed");
	});
	QUnit.test("When createFlattenDataSet is called for dimension not having display option", function(assert) {
		var aExpectedDimensions = [ {
			name : "Company Code Country",
			value : "{CompanyCodeCountry}",
			identity:"CompanyCodeCountry",
			displayValue : "{CompanyCodeCountry}"
		} ];
		oChartDataSetHelper.createFlattenDataSet(oParameter, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		assert.strictEqual(oChartDataSetHelper.oChartDataSet.dimensions.length, 1, "then one dimesion is available in chart dataset which is used for both dimension and filter property");
		assert.notEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0]["CompanyCodeCountry"], undefined, "then expected column name is same as dimension name");
		assert.strictEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0]["CompanyCodeCountry"], "AR", "then data is populated for dimension");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.dimensions, aExpectedDimensions, "then correct dimensions are formed");
	});
	QUnit.test("When createFlattenDataSet is called for dimension having key as display option", function(assert) {
		oParameter.dimensions[0]["labelDisplayOption"] = "key";
		var sExpectedColumnName = "formatted_CompanyCodeCountry";
		var aExpectedDimensions = [ {
			name : "Company Code Country",
			value : "{CompanyCodeCountry}",
			identity:"CompanyCodeCountry",
			displayValue : "{" + sExpectedColumnName + "}"
		} ];
		oChartDataSetHelper.createFlattenDataSet(oParameter, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		assert.notEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0][sExpectedColumnName], undefined, "then the new formatted column is created for key");
		assert.strictEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0][sExpectedColumnName], "AR", "then data is populated for new formatted column");
		assert.strictEqual(oChartDataSetHelper.oChartDataSet.dimensions.length, 1, "then one dimesion is available in chart dataset");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.dimensions, aExpectedDimensions, "then correct dimension is formed");
		//cleanup
		delete oParameter.dimensions[0]["labelDisplayOption"];
	});
	QUnit.test("When createFlattenDataSet is called for dimension having text as display option", function(assert) {
		oParameter.dimensions[0].labelDisplayOption = "text";
		var sExpectedColumnName = "CompanyCodeCountryName";
		var aExpectedDimensions = [ {
			name : "Company Code Country",
			value : "{CompanyCodeCountry}",
			identity:"CompanyCodeCountry",
			displayValue : "{" + sExpectedColumnName + "}"
		} ];
		oChartDataSetHelper.createFlattenDataSet(oParameter, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		assert.notEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0][sExpectedColumnName], undefined, "then the expected column name for text is returned");
		assert.strictEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0][sExpectedColumnName], "Argentina", "then data is populated");
		assert.strictEqual(oChartDataSetHelper.oChartDataSet.dimensions.length, 1, "then one dimesions is available in chart dataset");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.dimensions, aExpectedDimensions, "then correct dimension is formed");
		//cleanup
		delete oParameter.dimensions[0]["labelDisplayOption"];
	});
	QUnit.test("When createFlattenDataSet is called for dimension having keyAndText as display option", function(assert) {
		oParameter.dimensions[0].labelDisplayOption = "keyAndText";
		var sExpectedColumnName = "CompanyCodeCountry_" + "CompanyCodeCountryName";
		var aExpectedDimensions = [ {
			name : "Company Code Country",
			value : "{CompanyCodeCountry}",
			identity:"CompanyCodeCountry",
			displayValue : "{" + sExpectedColumnName + "}"
		} ];
		oChartDataSetHelper.createFlattenDataSet(oParameter, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		assert.notEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0][sExpectedColumnName], undefined, "then the new column is created for keyAndText");
		assert.strictEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0][sExpectedColumnName], "Argentina (AR)", "then data is populated for new column");
		assert.strictEqual(oChartDataSetHelper.oChartDataSet.dimensions.length, 1, "then one dimesion is available in chart dataset");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.dimensions, aExpectedDimensions, "then correct dimension is formed");
		//cleanup
		delete oParameter.dimensions[0]["labelDisplayOption"];
	});
	QUnit.test("When getModel is called", function(assert) {
		//arrange
		oChartDataSetHelper.createFlattenDataSet(oParameter, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		//act
		var oChartModel = oChartDataSetHelper.getModel();
		//assert
		assert.deepEqual(oChartModel.getData().data, oChartDataSetHelper.aDataResponseWithDisplayValue, "then correct model is set to the chart");
	});
	QUnit.module("Filter property plotted on chart", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				oRepresentationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				oParameter = oRepresentationHelper.representationDataDimension();
				oParameter.requiredFilters = [ "CompanyCodeCountry" ];
				oMetadata = _getsampleMetadata();
				aDataResponse = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				var oFormatter = new sap.apf.ui.utils.formatter({
					getEventCallback : that.oGlobalApi.oApi.getEventCallback.bind(that.oGlobalApi.oApi),
					getTextNotHtmlEncoded : that.oGlobalApi.oApi.getTextNotHtmlEncoded,
					getExits : that.oGlobalApi.oUiApi.getCustomFormatExit()
				}, oMetadata, aDataResponse);
				var oTimeAxisDateConverter = new sap.apf.ui.representations.utils.TimeAxisDateConverter();
				oChartDataSetHelper = new sap.apf.ui.representations.utils.ChartDataSetHelper(oFormatter, oTimeAxisDateConverter);
				done();
			});
		},
		afterEach : function(assert) {
			oParameter.requiredFilters = [];
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When createFlattenDataSet is called", function(assert) {
		oChartDataSetHelper.createFlattenDataSet(oParameter, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		assert.strictEqual(oChartDataSetHelper.oChartDataSet.dimensions.length, 1, "then one dimesion is available in chart dataset which is used for both dimension and filter property");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.context, [], "then no context added in chart data set");
	});
	QUnit.module("Filter property not plotted on chart", {
		beforeEach : function(assert) {
			var done = assert.async();
			var that = this;
			sap.apf.testhelper.doubles.createUiApiAsPromise().done(function(oApi) {
				that.oGlobalApi = oApi;
				oRepresentationHelper = sap.apf.testhelper.config.representationHelper.prototype;
				oParameter = oRepresentationHelper.representationDataDimension();
				oParameter.requiredFilters = [ "YearMonth" ];
				oMetadata = _getsampleMetadata();
				aDataResponse = sap.apf.testhelper.odata.getSampleService(that.oGlobalApi.oApi, 'sampleData');
				var oFormatter = new sap.apf.ui.utils.formatter({
					getEventCallback : that.oGlobalApi.oApi.getEventCallback.bind(that.oGlobalApi.oApi),
					getTextNotHtmlEncoded : that.oGlobalApi.oApi.getTextNotHtmlEncoded,
					getExits : that.oGlobalApi.oUiApi.getCustomFormatExit()
				}, oMetadata, aDataResponse);
				var oTimeAxisDateConverter = new sap.apf.ui.representations.utils.TimeAxisDateConverter();
				oChartDataSetHelper = new sap.apf.ui.representations.utils.ChartDataSetHelper(oFormatter, oTimeAxisDateConverter);
				done();
			});
		},
		afterEach : function(assert) {
			oParameter.requiredFilters = [];
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("When createFlattenDataSet is called", function(assert) {
		var aExpectedDimensions = [ {
			name : "Company Code Country",
			value : "{CompanyCodeCountry}",
			identity:"CompanyCodeCountry",
			displayValue : "{CompanyCodeCountry}"
		}, {
			name : "YearMonth",
			value : "{YearMonth}",
			identity: "YearMonth"
		} ];
		oChartDataSetHelper.createFlattenDataSet(oParameter, oMetadata, aDataResponse, this.oGlobalApi.oApi);
		assert.strictEqual(oChartDataSetHelper.oChartDataSet.dimensions.length, 2, "then two dimesions (one of dimension and other is filter property which is not in dimension) are available in chart dataset");
		assert.notEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0]["CompanyCodeCountry"], undefined, "then expected column name is same as dimension name");
		assert.strictEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[0]["CompanyCodeCountry"], "AR", "then data is populated for dimension");
		assert.notEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[1]["YearMonth"], undefined, "then expected column name for required filter is same as filter name");
		assert.strictEqual(oChartDataSetHelper.aDataResponseWithDisplayValue[1]["YearMonth"], "201305", "then data is populated for filter");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.context, [ "YearMonth" ], "then context added in chart data set");
		assert.deepEqual(oChartDataSetHelper.oChartDataSet.dimensions, aExpectedDimensions, "then correct dimensions are formed");
	});
	QUnit.module("Original fieldname");
	QUnit.test("get the original fieldname", function(assert){
		var fieldname = sap.apf.ui.representations.utils.ChartDataSetHelper.getFieldNameForOriginalContentOfProperty("propertyName");
		assert.strictEqual(fieldname, "original_propertyName");
	});
	QUnit.module("addUnusedDimensionsToChartContext", {
		beforeEach : function(assert) {
			this.aData = [{
				__metadata : "metadata",
				Dimension1 : "Value1",
				Dimension2 : "Value2",
				Dimension2Text : "TextValue2",
				Measure1 : "Value1"
			}];
			this.metadata = {
				getPropertyMetadata : function(property){
					if(property){
						return {
							label : property + "Label",
							text : property === "Dimension2" ? property + "Text" : undefined,
							"aggregation-role" : property.indexOf("Measure") >= 0 ? "measure" : undefined
						};
					}
					return {};
				}
			};
			var dimensions = [{
				fieldName : "Dimension1"
			},{
				fieldName : "Dimension2"
			}];
			var measures = [{
				fieldName : "Measure1"
			}];
			commonSetup(this, dimensions, measures, this.metadata, this.aData);
			this.initialChartDataSet = {
				context : [],
				dimensions : [{
					"displayValue": "{Dimension1}",
					"identity": "Dimension1",
					"name": "Dimension1Label",
					"value": "{Dimension1}"
				},
				{
					"displayValue": "{Dimension2}",
					"identity": "Dimension2",
					"name": "Dimension2Label",
					"value": "{Dimension2}"
				}],
				measures: [{
					"identity": "Measure1",
					"name": "Measure1Label",
					"value": "{Measure1}"
				}],
				data : {
					path : "/data"
				}
			};
			assert.deepEqual(this.chartDataSetHelper.oChartDataSet, this.initialChartDataSet, "ChartDataSet has correctly been initialized");
			
		}
	});
	QUnit.test("All properties are used as dimensions (or text)", function(assert) {
		this.chartDataSetHelper.addUnusedDimensionsToChartContext(this.metadata, this.aData);
		assert.deepEqual(this.chartDataSetHelper.oChartDataSet, this.initialChartDataSet, "ChartDataSet has not changed");
	});
	QUnit.test("Additional properties are assigned to context", function(assert) {
		this.aData[0].UnusedProperty = "Value";
		this.chartDataSetHelper.addUnusedDimensionsToChartContext(this.metadata, this.aData);

		var expectedDataSet = this.initialChartDataSet;
		expectedDataSet.dimensions.push({
			name : "UnusedPropertyLabel",
			identity : "UnusedProperty",
			value : "{UnusedProperty}"
		});
		expectedDataSet.context.push("UnusedProperty");
		assert.deepEqual(this.chartDataSetHelper.oChartDataSet, expectedDataSet, "Unused property is pushed into dimensions and context");
	});
	QUnit.test("Unused Measures are not assigned to context", function(assert) {
		this.aData[0].Measure2 = "Value2";
		this.chartDataSetHelper.addUnusedDimensionsToChartContext(this.metadata, this.aData);

		assert.deepEqual(this.chartDataSetHelper.oChartDataSet, this.initialChartDataSet, "ChartDataSet has not changed");
	});
	QUnit.test("When Data is empty", function(assert) {
		this.aData = [];
		this.chartDataSetHelper.addUnusedDimensionsToChartContext(this.metadata, this.aData);
		assert.deepEqual(this.chartDataSetHelper.oChartDataSet, this.initialChartDataSet, "ChartDataSet has not changed");
	});
	QUnit.module("addPropertyToContext", {
		beforeEach : function(assert){
			commonSetup(this);
			assert.deepEqual(this.chartDataSetHelper.oChartDataSet, {
				context : [],
				dimensions : [],
				measures : [],
				data : {
					path : "/data"
				}
			}, "ChartDataSet has correctly been initialized");
		}
	});
	QUnit.test("Property without labels", function(assert) {
		this.chartDataSetHelper.addPropertyToContext("Property1", {});
		assert.deepEqual(this.chartDataSetHelper.oChartDataSet, {
			context : ["Property1"],
			dimensions : [{
				name : "Property1",
				identity : "Property1",
				value : "{Property1}"
			}],
			measures : [],
			data : {
				path : "/data"
			}
		}, "Property has been added to the chartDataSet");
	});
	QUnit.test("Property with label in metadata", function(assert) {
		this.chartDataSetHelper.addPropertyToContext("Property1", {label: "PropertyLabel1"});
		assert.deepEqual(this.chartDataSetHelper.oChartDataSet, {
			context : ["Property1"],
			dimensions : [{
				name : "PropertyLabel1",
				identity : "Property1",
				value : "{Property1}"
			}],
			measures : [],
			data : {
				path : "/data"
			}
		}, "Property has been added to the chartDataSet");
	});
})();