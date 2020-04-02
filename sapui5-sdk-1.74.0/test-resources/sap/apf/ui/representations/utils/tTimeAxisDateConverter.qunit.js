jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.apf.utils.filter");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.ui.representations.utils.chartDataSetHelper");
jQuery.sap.require("sap.apf.ui.representations.utils.timeAxisDateConverter");
jQuery.sap.require("sap.apf.ui.representations.utils.representationFilterHandler");
(function() {
	"use strict";

	function createApi(property) {
		var messageHandler = new sap.apf.core.MessageHandler();
		return {
			createFilter : function() {
				return new sap.apf.utils.Filter(messageHandler);
			},
			getTextNotHtmlEncoded : function(key) {
				return property ? property : key;
			}
		};
	}
	function getPropertyMetadata(propertyName) {
		var metadata = {};
		metadata.YearMonthDay = {
			"name" : "YearMonthDay",
			"type" : "Edm.String",
			"maxLength" : "10",
			"extensions" : [ {
				"name" : "aggregation-role",
				"value" : "dimension",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "creatable",
				"value" : "false",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "semantics",
				"value" : "yearmonthday",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "text",
				"value" : "IncidentDate_T",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "updatable",
				"value" : "false",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "label",
				"value" : "Start Date",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			} ],
			"sap:aggregation-role" : "dimension",
			"com.sap.vocabularies.Analytics.v1.Dimension" : {
				"Bool" : "true"
			},
			"sap:creatable" : "false",
			"sap:semantics" : "yearmonthday",
			"sap:text" : "YearMonthDay_T",
			"com.sap.vocabularies.Common.v1.Text" : {
				"Path" : "YearMonthDay_T"
			},
			"sap:updatable" : "false",
			"sap:label" : "Start Date",
			"com.sap.vocabularies.Common.v1.Label" : {
				"String" : "Year Month Day"
			},
			"Org.OData.Core.V1.Computed" : {
				"Bool" : "true"
			},
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "10"
			},
			"aggregation-role" : "dimension",
			"creatable" : "false",
			"semantics" : "yearmonthday",
			"text" : "YearMonthDay_T",
			"updatable" : "false",
			"label" : "Year Month Day",
			"dimension" : "true",
			"computed" : "true"
		};
		metadata.Revenue = {
			"name" : "Revenue",
			"type" : "Edm.Decimal",
			"precision" : "13",
			"scale" : "3",
			"extensions" : [ {
				"name" : "filterable",
				"value" : "false",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "label",
				"value" : "Revenue",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "aggregation-role",
				"value" : "measure",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "unit",
				"value" : "Currency",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			} ],
			"sap:filterable" : "false",
			"sap:label" : "Revenue",
			"com.sap.vocabularies.Common.v1.Label" : {
				"String" : "Revenue"
			},
			"sap:aggregation-role" : "measure",
			"com.sap.vocabularies.Analytics.v1.Measure" : {
				"Bool" : "true"
			},
			"sap:unit" : "Currency",
			"Org.OData.Measures.V1.ISOCurrency" : {
				"Path" : "Currency"
			},
			"dataType" : {
				"type" : "Edm.Decimal",
				"precision" : "13"
			},
			"filterable" : "false",
			"label" : "Revenue",
			"aggregation-role" : "measure",
			"unit" : "Currency",
			"measure" : "true",
			"ISOCurrency" : "Currency"
		};
		metadata.Currency = {
			"name" : "Currency",
			"type" : "Edm.String",
			"maxLength" : "3",
			"extensions" : [ {
				"name" : "semantics",
				"value" : "currency-code",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "label",
				"value" : "Currency",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "aggregation-role",
				"value" : "dimension",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "text",
				"value" : "CurrencyName",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			} ],
			"sap:semantics" : "currency-code",
			"sap:label" : "Currency",
			"com.sap.vocabularies.Common.v1.Label" : {
				"String" : "Currency"
			},
			"sap:aggregation-role" : "dimension",
			"com.sap.vocabularies.Analytics.v1.Dimension" : {
				"Bool" : "true"
			},
			"sap:text" : "CurrencyName",
			"com.sap.vocabularies.Common.v1.Text" : {
				"Path" : "CurrencyName"
			},
			"dataType" : {
				"type" : "Edm.String",
				"maxLength" : "3"
			},
			"semantics" : "currency-code",
			"label" : "Currency",
			"aggregation-role" : "dimension",
			"text" : "CurrencyName",
			"dimension" : "true"
		};
		metadata.Date = {
			"name" : "Date",
			"type" : "Edm.DateTime",
			"extensions" : [ {
				"name" : "display-format",
				"value" : "Date",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "label",
				"value" : "Date",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			}, {
				"name" : "aggregation-role",
				"value" : "dimension",
				"namespace" : "http://www.sap.com/Protocols/SAPData"
			} ],
			"sap:display-format" : "Date",
			"sap:label" : "Date",
			"com.sap.vocabularies.Common.v1.Label" : {
				"String" : "Date"
			},
			"sap:aggregation-role" : "dimension",
			"com.sap.vocabularies.Analytics.v1.Dimension" : {
				"Bool" : "true"
			},
			"dataType" : {
				"type" : "Edm.DateTime"
			},
			"display-format" : "Date",
			"label" : "Date",
			"aggregation-role" : "dimension",
			"dimension" : "true"
		};
		return metadata[propertyName];
	}
	function generateTestData() {
		var data = [];
		var line;
		var i;
		for(i = 1; i < 4; i++) {
			line = {
				"Currency" : "USD",
				"Revenue" : i * 100,
				"Date" : new Date(2017, 12, i),
				"YearMonthDay" : "2017120" + i
			};
			data.push(line);
		}
		return data;
	}
	function FormatterStub() {
		this.getFormattedValue = function(fieldName, originalFieldValue) {
			return "formatted_" + originalFieldValue;
		};
	}
	QUnit.module("UI5 Charthelper with Time Series Chart", {
		beforeEach : function() {
			var parameters = {
				"dimensions" : [ {
					"fieldName" : "Date",
					"dataType" : "date",
					"kind" : "xAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "x"
					},
					"labelDisplayOption" : "key"
				} ],
				"measures" : [ {
					"fieldName" : "Revenue",
					"kind" : "yAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "x"
					}
				} ],
				"properties" : [],
				"alternateRepresentationTypeId" : "TableRepresentation",
				"width" : {},
				"orderby" : [],
				"alternateRepresentationType" : {},
				"requiredFilters" : [ "Date" ]
			};
			this.oTimeAxisConvertor = new sap.apf.ui.representations.utils.TimeAxisDateConverter();
			var formatter = new FormatterStub();
			this.oChartDataSetHelper = new sap.apf.ui.representations.utils.ChartDataSetHelper(formatter, this.oTimeAxisConvertor);
			var metadata = {
				getPropertyMetadata : getPropertyMetadata
			};
			var data = generateTestData();
		    this.oChartDataSetHelper.createFlattenDataSet(parameters, metadata, data, createApi("Date"));
		}
	});
	QUnit.test("WHEN TimeDimension has Date Property", function(assert) {
		var helper = this.oChartDataSetHelper;
		function assertParameterDimensionsAreEnhanced() {
			var dimensions = helper.oChartDataSet.dimensions;
			assert.equal(dimensions[0].displayValue, "{formatted_Date}", "THEN display value is defined");
			assert.equal(dimensions[0].value, "{Date}", "THEN value is defined");
			assert.equal(dimensions[0].name, "Date", "THEN name is set");
			assert.equal(dimensions[0].dataType, "date", "THEN type is set");
		}
		function assertExtendedDataResponseIsPrepared() {
			var formatter = new FormatterStub();
			var data = helper.aDataResponseWithDisplayValue;
			var referenceData = generateTestData();
			var i, expectedFormattedValue;
			assert.equal(data.length, referenceData.length, "THEN identical number of lines in data response");
			for(i = 0; i < data.length; i++) {
				assert.equal(data[i].Date, referenceData[i].Date + "", "THEN Date is converted to String");
				expectedFormattedValue = formatter.getFormattedValue('Date', referenceData[i].Date);
				assert.equal(data[i].formatted_Date, expectedFormattedValue, "THEN date value has been formatted");
			}
		}
		assertParameterDimensionsAreEnhanced();
		assertExtendedDataResponseIsPrepared();
	});
	QUnit.module("UI5 Charthelper with Time Series Chart and Conversion of YYYYMMDD field", {
		beforeEach : function() {
			this.parameters = {
				"dimensions" : [ {
					"fieldName" : "YearMonthDay",
					"dataType" : "date",
					"kind" : "xAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "x"
					},
					"labelDisplayOption" : "key"
				} ],
				"measures" : [ {
					"fieldName" : "Revenue",
					"kind" : "yAxis",
					"fieldDesc" : {
						"type" : "label",
						"kind" : "text",
						"key" : "x"
					}
				} ],
				"properties" : [],
				"alternateRepresentationTypeId" : "TableRepresentation",
				"width" : {},
				"orderby" : [],
				"alternateRepresentationType" : {},
				"requiredFilters" : [ "YearMonthDay" ]
			};
			this.oTimeAxisConvertor = new sap.apf.ui.representations.utils.TimeAxisDateConverter();
			var formatter = new FormatterStub();
			this.oChartDataSetHelper = new sap.apf.ui.representations.utils.ChartDataSetHelper(formatter, this.oTimeAxisConvertor);
			this.oRepresentationFilterHandler = new sap.apf.ui.representations.utils.RepresentationFilterHandler(createApi(), this.parameters, this.oTimeAxisConvertor);
			this.metadata = {
				getPropertyMetadata : getPropertyMetadata
			};
			this.data = generateTestData();
			this.oChartDataSetHelper.createFlattenDataSet(this.parameters, this.metadata, this.data, createApi("Year Month Day"));
		},
		assertParameterDimensionsAreEnhanced : function(helper, assert) {
			var dimensions = helper.oChartDataSet.dimensions;
			assert.equal(dimensions[0].displayValue, "{formatted_YearMonthDay}", "THEN display value is defined");
			assert.equal(dimensions[0].value, "{YearMonthDay}", "THEN value is defined");
			assert.equal(dimensions[0].name, "Year Month Day", "THEN name is set");
			assert.equal(dimensions[0].dataType, "date", "THEN data type is set");
		},
		assertExtendedDataResponseIsPrepared : function(helper, assert) {
			var formatter = new FormatterStub();
			var data = helper.aDataResponseWithDisplayValue;
			var referenceData = generateTestData();
			var i, expectedFormattedValue, expectedDate;
			assert.equal(data.length, referenceData.length, "THEN identical number of lines in data response");
			for(i = 0; i < data.length; i++) {
				expectedFormattedValue = formatter.getFormattedValue('YearMonthDay', referenceData[i].YearMonthDay);
				expectedDate = sap.apf.utils.convertFiscalYearMonthDayToDateString(referenceData[i].YearMonthDay);
				assert.equal(data[i].YearMonthDay, expectedDate, "THEN YearMonthDay String is converted to Javascript Date (as String)");
				assert.equal(data[i].formatted_YearMonthDay, expectedFormattedValue, "THEN  value has been formatted");
				assert.equal(data[i].original_YearMonthDay, referenceData[i].YearMonthDay, "THEN original value preserverd");
			}
			var convertedDates = this.oTimeAxisConvertor.getConvertedDateLookUp();
			assert.equal(Object.keys(convertedDates).length, data.length, "THEN converted dates registered");
		}
	});
	QUnit.test("WHEN TimeDimension has YearMonthDay Property", function(assert) {
		var helper = this.oChartDataSetHelper;
		this.assertParameterDimensionsAreEnhanced(helper, assert);
		this.assertExtendedDataResponseIsPrepared(helper, assert);
	});
	QUnit.test("WHEN createFlattenDataSet is called again with same dataResponse", function(assert){
		var helper = this.oChartDataSetHelper;
		helper.createFlattenDataSet(this.parameters, this.metadata, this.data, createApi("Year Month Day"));
		this.assertParameterDimensionsAreEnhanced(helper, assert);
		this.assertExtendedDataResponseIsPrepared(helper, assert);
	});
	QUnit.test("WHEN selection is requested", function(assert) {
		var oTestInstance = this;
		prepareSelection();
		function prepareSelection() {
			oTestInstance.oRepresentationFilterHandler.aFilterValues = [];
			var i;
			var data = generateTestData();
			for(i = 0; i < 2; i++) {
				oTestInstance.oRepresentationFilterHandler.aFilterValues.push(data[i].YearMonthDay);
			}
		}
		var filterTerms = this.oRepresentationFilterHandler.createFilterFromSelectedValues().getInternalFilter().getFilterTerms();
		assert.equal(filterTerms[0].getValue(), "20171201", "THEN original value in selection term");
		assert.equal(filterTerms[1].getValue(), "20171202", "THEN original value in selection term");
	});
}());