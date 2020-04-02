/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define('sap/apf/ui/utils/tFormatter', [
	'sap/apf/ui/utils/formatter',
	'sap/apf/ui/utils/stringToDateFormatter',
	'sap/apf/ui/utils/dateTimeFormatter',
	'sap/apf/ui/utils/timeFormatter',
	'sap/apf/ui/utils/decimalFormatter',
	'sap/apf/core/constants'
], function(Formatter, StringToDateFormatter, DateTimeFormatter, TimeFormatter,
		DecimalFormatter, constants) {
	'use strict';

	var doNothing = function() {};
	var getText = function(key) {
		return "text : " + key;
	};
	var getActiveStep = function() {
		var selectedRep = {};
		selectedRep.getSelectedRepresentationInfo = function() {
			var repInfo = {
					representationId : "Step-4-Representation-1"
			};
			return repInfo;
		};
		return selectedRep;
	};

	function _getMetaData() {
		var newMetadata = {
			getPropertyMetadata : function(sPropertyName) {
				var metadata;
				switch (sPropertyName) {
					case "Edm.StringDataType":
						metadata = {
							"name" : "CalendarYearMonth",
							"isCalendarYearMonth" : "true",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "Edm.StringType":
						metadata = {
							"name" : "CalendarYearMonth",
							"isCalendarYearMonth" : "true",
							"type" : "Edm.String",
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "Edm.DateTimeDataType":
						metadata = {
							"name" : "CalendarYearMonth",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.DateTime"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "Edm.DateTimeType":
						metadata = {
							"name" : "CalendarYearMonth",
							"type" : "Edm.DateTime",
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "Edm.TimeDataType":
						metadata = {
							"name" : "Departure Time",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.Time"
							},
							"aggregation-role" : "dimension",
							"label" : "Departure Time"
						};
						break;
					case "Edm.TimeType":
						metadata = {
							"name" : "Departure Time",
							"type" : "Edm.Time",
							"aggregation-role" : "dimension",
							"label" : "Departure Time"
						};
						break;
					case "Edm.DecimalDataType":
						metadata = {
							"name" : "Revenue Amount",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.Decimal"
							},
							"aggregation-role" : "measure",
							"label" : "Revenue Amount"
						};
						break;
					case "Edm.DecimalType":
						metadata = {
							"name" : "Revenue Amount",
							"type" : "Edm.Decimal",
							"aggregation-role" : "dimension",
							"label" : "Revenue Amount"
						};
						break;
					case "CalendarYearMonthDayCustomFormatting":
						metadata = {
							"name" : "CalendarYearMonthDay",
							"sap:semantics" : "yearmonthday",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month Day"
						};
						break;
					case "CalendarYearMonthDayNotCustomFormatting":
						metadata = {
							"name" : "CalendarYearMonthDay",
							"sap:semantics" : "yearmonthday",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month Day"
						};
						break;
					case "RevenueCustomFormatting":
						metadata = {
							"name" : "Revenue",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.Decimal"
							},
							"aggregation-role" : "measure",
							"label" : "Revenue"
						};
						break;
					case "RevenueWithoutExit":
						metadata = {
							"name" : "Revenue",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.Decimal"
							},
							"aggregation-role" : "measure",
							"label" : "Revenue"
						};
						break;
					default:
						metadata = {};
						break;
				}
				return metadata;
			}
		};
		return newMetadata;
	}
	function _getDataResponse() {
		var aDataResponse = [ {
			"CalendarDate" : "20140310",
			"CalendarWeek" : "201421",
			"CalendarQuarter" : "20142",
			"YearMonth" : "201305",
			"BestPossibleDays" : "23",
			"PostingDate_E" : "/Date(1335830400000)/",
			"DepartureTime" : "13:20:20",
			"SAPClient" : "777",
			"CompanyCode" : "1000",
			"Customer" : "1001",
			"DisplayCurrencyDecimals" : "2",
			"CustomerName" : "Nelson Tax & Associates",
			"DaysSalesOutstanding" : "54.66",
			"RevenueAmountInCoCodeCrcy_E" : "3844.82",
			"CoArea" : "1000",
			"RevenueAmountInDisplayCrcy_E.CURRENCY" : "USD",
			"measureunit" : "KG",
			"Revenue" : 3000
		} ];
		return aDataResponse;
	}
	QUnit.module('Test for Edm.Type String', {
		beforeEach : function(assert) {
				this.formatter = new Formatter({
					getEventCallback : doNothing,
					getTextNotHtmlEncoded : getText,
					getExits : {}
				}, _getMetaData(), _getDataResponse());
		}
	});
	QUnit.test("When oMetaData.dataType.type has value of Edm.String", function(assert) {
		var spyOnStringToDateFormatter = sinon.spy(StringToDateFormatter.prototype, "getFormattedValue");
		this.formatter.getFormattedValue("Edm.StringDataType", _getDataResponse()[0].YearMonth);
		assert.strictEqual(spyOnStringToDateFormatter.calledWith(_getMetaData().getPropertyMetadata("Edm.StringDataType"), _getDataResponse()[0].YearMonth), true, "Since datatype is Edm.String hence type string formatter function called");
		spyOnStringToDateFormatter.restore();
	});
	QUnit.test("When oMetaData.type has value of  Edm.String", function(assert) {
		var spyOnStringToDateFormatter = sinon.spy(StringToDateFormatter.prototype, "getFormattedValue");
		this.formatter.getFormattedValue("Edm.StringType", _getDataResponse()[0].YearMonth);
		assert.strictEqual(spyOnStringToDateFormatter.calledWith(_getMetaData().getPropertyMetadata("Edm.StringType"), _getDataResponse()[0].YearMonth), true, "Since type is Edm.String hence type string formatter function called");
		spyOnStringToDateFormatter.restore();
	});
	QUnit.test("When oMetaData.dataType.type has value of Edm.DateTime", function(assert) {
		var spyOnDateTimeFormatter = sinon.spy(DateTimeFormatter.prototype, "getFormattedValue");
		this.formatter.getFormattedValue("Edm.DateTimeDataType", _getDataResponse()[0].CalendarDate);
		assert.strictEqual(spyOnDateTimeFormatter.calledWith(_getMetaData().getPropertyMetadata("Edm.DateTimeDataType"), _getDataResponse()[0].CalendarDate), true, "Since datatype is Edm.DateTime hence type date time formatter function called");
		spyOnDateTimeFormatter.restore();
	});
	QUnit.test("When oMetaData.type has value of Edm. DateTime", function(assert) {
		var spyOnDateTimeFormatter = sinon.spy(DateTimeFormatter.prototype, "getFormattedValue");
		this.formatter.getFormattedValue("Edm.DateTimeType", _getDataResponse()[0].CalendarDate);
		assert.strictEqual(spyOnDateTimeFormatter.calledWith(_getMetaData().getPropertyMetadata("Edm.DateTimeType"), _getDataResponse()[0].CalendarDate), true, "Since type is Edm.DateTime hence type date time formatter function called");
		spyOnDateTimeFormatter.restore();
	});
	QUnit.test("When oMetaData.dataType.type has value of Edm.Time", function(assert) {
		var spyOnTimeFormatter = sinon.spy(TimeFormatter.prototype, "getFormattedValue");
		this.formatter.getFormattedValue("Edm.TimeDataType", _getDataResponse()[0].DepartureTime);
		assert.strictEqual(spyOnTimeFormatter.calledWith(_getMetaData().getPropertyMetadata("Edm.TimeDataType"), _getDataResponse()[0].DepartureTime), true, "Since datatype is Edm.Time hence type time formatter function called");
		spyOnTimeFormatter.restore();
	});
	QUnit.test("When oMetaData.type has value of Edm.Time", function(assert) {
		var spyOnTimeFormatter = sinon.spy(TimeFormatter.prototype, "getFormattedValue");
		this.formatter.getFormattedValue("Edm.TimeType", _getDataResponse()[0].DepartureTime);
		assert.strictEqual(spyOnTimeFormatter.calledWith(_getMetaData().getPropertyMetadata("Edm.TimeType"), _getDataResponse()[0].DepartureTime), true, "Since type is Edm.Time hence type time formatter function called");
		spyOnTimeFormatter.restore();
	});
	QUnit.test("When oMetaData.dataType.type has value of Edm.Decimal", function(assert) {
		var spyOnTimeFormatter = sinon.spy(DecimalFormatter.prototype, "getFormattedValue");
		this.formatter.getFormattedValue("Edm.DecimalDataType", _getDataResponse()[0].RevenueAmountInCoCodeCrcy_E);
		assert.strictEqual(spyOnTimeFormatter.calledWith(_getMetaData().getPropertyMetadata("Edm.DecimalDataType"), _getDataResponse()[0].RevenueAmountInCoCodeCrcy_E), true,
				"Since datatype is Edm.Decimal hence type decimal formatter function called");
		spyOnTimeFormatter.restore();
	});
	QUnit.test("When oMetaData.type has value of Edm.Decimal", function(assert) {
		var spyOnTimeFormatter = sinon.spy(DecimalFormatter.prototype, "getFormattedValue");
		this.formatter.getFormattedValue("Edm.DecimalType", _getDataResponse()[0].RevenueAmountInCoCodeCrcy_E);
		assert.strictEqual(spyOnTimeFormatter.calledWith(_getMetaData().getPropertyMetadata("Edm.DecimalType"), _getDataResponse()[0].RevenueAmountInCoCodeCrcy_E), true, "Since type is Edm.Time hence type decimal formatter function called");
		spyOnTimeFormatter.restore();
	});
	QUnit.test("When oMetaData.type has value of other types(Edm.Int16,Edm.Int32 etc)", function(assert) {
		var formattedValue = this.formatter.getFormattedValue("Edm.Int16", _getDataResponse()[0].BestPossibleDays);
		assert.strictEqual(formattedValue, _getDataResponse()[0].BestPossibleDays, "Since formatting is not availble for the given type hence returned original value");
	});
	QUnit.test("When original field value is null", function(assert) {
		var formattedValue = this.formatter.getFormattedValue("Edm.StringDataType", null);
		assert.strictEqual(formattedValue, "null", "Since original value is null hence returned null value");
	});
	QUnit.test("When Key is available", function(assert) {
		var oTextToBeFormattedWithId = {
			"text" : "CustomerName",
			"key" : "CustomerId"
		};
		var fieldName = "CustomerName";
		var formattedTextWithId = this.formatter.getFormattedValueForTextProperty(fieldName, oTextToBeFormattedWithId);
		assert.strictEqual(formattedTextWithId, "CustomerName (CustomerId)", "Then Formatted text is concatenated with key");
	});
	QUnit.test("When Key is not available", function(assert) {
		var oTextToBeFormatted = {
			"text" : "CustomerName"
		};
		var fieldName = "CustomerName";
		var formattedText = this.formatter.getFormattedValueForTextProperty(fieldName, oTextToBeFormatted);
		assert.strictEqual(formattedText, "CustomerName", "Then Formatted text is not concatenated with key");
	});
	QUnit.test("When oMetaData.type has value of other types(Edm.Int16,Edm.Int32 etc)", function(assert) {
		var formattedValue = this.formatter.getFormattedValue("Edm.Int16", 32);
		assert.strictEqual(formattedValue, 32, "Since formatting is not availble for the given type hence returned original value");
	});
	QUnit.test("When oMetaData.type has value of other types(Edm.Int16,Edm.Int32 etc)", function(assert) {
		var formattedValue = this.formatter.getFormattedValueAsString("Edm.Int16", 32);
		assert.strictEqual(formattedValue, "32", "String is returned although getFormattedValue returns non string");
	});
	function _customFormattingSameStepDiffRepPieDim(propertyMetadata, fieldName, originalFieldValue, formattedFieldValue) {
		var sActiveStep = getActiveStep();
		var selectedRepresentationId = sActiveStep !== undefined ? sActiveStep.getSelectedRepresentationInfo().representationId : undefined;
		if (((fieldName == "CalendarYearMonthDayCustomFormatting") && (selectedRepresentationId !== undefined && selectedRepresentationId === "Step-4-Representation-1"))) {
			return originalFieldValue + " ABC ";
		}
	}
	function _customFormattingSameStepDiffRepColumnDim(propertyMetadata, fieldName, originalFieldValue, formattedFieldValue) {
		var sActiveStep = getActiveStep();
		var selectedRepresentationId = sActiveStep !== undefined ? sActiveStep.getSelectedRepresentationInfo().representationId : undefined;
		selectedRepresentationId = "Step-4-Representation-2";
		if (((fieldName == "CalendarYearMonthDayCustomFormatting") && (selectedRepresentationId !== undefined && selectedRepresentationId === "Step-4-Representation-2"))) {
			return originalFieldValue + " XYZ ";
		}
	}
	function _customFormattingSameStepDiffRepPieMeasure(propertyMetadata, fieldName, originalFieldValue, formattedFieldValue) {
		var sActiveStep = getActiveStep();
		var selectedRepresentationId = sActiveStep !== undefined ? sActiveStep.getSelectedRepresentationInfo().representationId : undefined;
		if (((fieldName == "RevenueCustomFormatting") && (selectedRepresentationId !== undefined && selectedRepresentationId === "Step-4-Representation-1"))) {
			return originalFieldValue + " ABC ";
		}
	}
	function _customFormattingSameStepDiffRepColumnMeasure(propertyMetadata, fieldName, originalFieldValue, formattedFieldValue) {
		var sActiveStep = getActiveStep();
		var selectedRepresentationId = sActiveStep !== undefined ? sActiveStep.getSelectedRepresentationInfo().representationId : undefined;
		selectedRepresentationId = "Step-4-Representation-2";
		if (((fieldName == "RevenueCustomFormatting") && (selectedRepresentationId !== undefined && selectedRepresentationId === "Step-4-Representation-2"))) {
			return originalFieldValue + " XYZ ";
		}
	}
	function _customFormattingProp(propertyMetadata, fieldName, originalFieldValue, formattedFieldValue) {
		if (fieldName == "RevenueCustomFormatting") {
			return originalFieldValue + " XYZ ";
		}
	}
	function _customFormattingReturnUndefined(propertyMetadata, fieldName, originalFieldValue, formattedFieldValue) {
		return undefined;
	}
	function _customFormattingReturnNull(propertyMetadata, fieldName, originalFieldValue, formattedFieldValue) {
		return null;
	}
	QUnit.module("Custom formatting", {});

	QUnit.test("When exit does not have the custom formatting(app specific formatting)", function(assert) {
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : {}
		}, _getMetaData(), _getDataResponse());
		var formatedValue = formatter.getFormattedValue("CalendarYearMonthDayNotCustomFormatting", _getDataResponse()[0].CalendarDate);
		assert.strictEqual(formatedValue, "3/10/14", "Then APF specific formatted value has been returned");
	});
	QUnit.test("When custom formatting called via setEventCallback with event type and functionCallback", function(assert) {
		var getCustomFormatExit = function() {
			return {
				customFormat : _customFormattingProp
			};
		};
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : getCustomFormatExit()
		}, _getMetaData(), _getDataResponse());

		var formatedValue = formatter.getFormattedValue("RevenueCustomFormatting", _getDataResponse()[0].Revenue);
		assert.strictEqual(formatedValue, "3000 XYZ ", "Then with original value custom value of XYZ added");
	});
	QUnit.test("When custom formatting called via customFormat(oApi) with only functionCallback", function(assert) {
		this.customFormatFunction = _customFormattingProp;
		var getCustomFormatExit = function() {
			return {
				customFormat : _customFormattingProp
			};
		};
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : getCustomFormatExit()
		}, _getMetaData(), _getDataResponse());

		var formatedValue = formatter.getFormattedValue("RevenueCustomFormatting", _getDataResponse()[0].Revenue);
		assert.strictEqual(formatedValue, "3000 XYZ ", "Then with original value custom value of XYZ added");
	});
	QUnit.test("When step and property is same but represenations are different and property belongs to dimension", function(assert) {
		var getCustomFormatExit = function() {
			return {
				customFormat : _customFormattingSameStepDiffRepPieDim
			};
		};
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : getCustomFormatExit()
		}, _getMetaData(), _getDataResponse());

		var formatedValue = formatter.getFormattedValue("CalendarYearMonthDayCustomFormatting", _getDataResponse()[0].CalendarDate);
		assert.strictEqual(formatedValue, "20140310 ABC ", "Then with original value custom value of ABC added");
	});
	QUnit.test("When step and property is same but represenations are different and property belongs to dimension", function(assert) {
		var getCustomFormatExit = function() {
			return {
				customFormat :_customFormattingSameStepDiffRepColumnDim
			};
		};
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : getCustomFormatExit()
		}, _getMetaData(), _getDataResponse());
		var formatedValue = formatter.getFormattedValue("CalendarYearMonthDayCustomFormatting", _getDataResponse()[0].CalendarDate);
		assert.strictEqual(formatedValue, "20140310 XYZ ", "Then with original value custom value of XYZ added");
	});
	QUnit.test("When step and property is same but represenations are different and property belongs to measure", function(assert) {
		var getCustomFormatExit = function() {
			return {
				customFormat : _customFormattingSameStepDiffRepPieMeasure
			};
		};
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : getCustomFormatExit()
		}, _getMetaData(), _getDataResponse());
		var formatedValue = formatter.getFormattedValue("RevenueCustomFormatting", _getDataResponse()[0].Revenue);
		assert.strictEqual(formatedValue, "3000 ABC ", "Then with original value custom value of ABC added");
	});
	QUnit.test("When step and property is same but represenations are different and property belongs to measure", function(assert) {
		var getCustomFormatExit = function() {
			return {
				customFormat : _customFormattingSameStepDiffRepColumnMeasure
			};
		};
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : getCustomFormatExit()
		}, _getMetaData(), _getDataResponse());
		var formatedValue = formatter.getFormattedValue("RevenueCustomFormatting", _getDataResponse()[0].Revenue);
		assert.strictEqual(formatedValue, "3000 XYZ ", "Then with original value custom value of XYZ added");
	});
	QUnit.test("When custom formatting value returned as undefined", function(assert) {
		var getCustomFormatExit = function() {
			return {
				customFormat : _customFormattingReturnUndefined
			};
		};
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : getCustomFormatExit()
		}, _getMetaData(), _getDataResponse());
		var formatedValue = formatter.getFormattedValue("RevenueCustomFormatting", _getDataResponse()[0].Revenue);
		assert.strictEqual(formatedValue, "3,000", "Then APF specific formatted value has been returned");
	});
	QUnit.test("When custom formatting value returned as null", function(assert) {
		var getCustomFormatExit = function() {
			return {
				customFormat : _customFormattingReturnNull
			};
		};
		var formatter = new Formatter({
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText,
			getExits : getCustomFormatExit()
		}, _getMetaData(), _getDataResponse());
		var formatedValue = formatter.getFormattedValue("RevenueCustomFormatting", _getDataResponse()[0].Revenue);
		assert.strictEqual(formatedValue, null, "Then return app specific custom formatted value");
	});
	QUnit.module("Without Exit Object", {
		beforeEach : function(assert) {
				this.formatter = new Formatter({
					getEventCallback : doNothing,
					getTextNotHtmlEncoded : getText
				}, _getMetaData(), _getDataResponse());
		}
	});
	QUnit.test("When Exit object is not available", function(assert) {
		var formatedValue = this.formatter.getFormattedValue("RevenueWithoutExit", _getDataResponse()[0].Revenue);
		assert.strictEqual(formatedValue, "3,000", "Then generic APF formatter value should be returned and custom formatter cannot be triggered");
	});
});
