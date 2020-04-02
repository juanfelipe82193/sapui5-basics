/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define('sap/apf/ui/utils/tStringToDateFormatter', [
	'sap/apf/ui/utils/stringToDateFormatter',
	'sap/apf/utils/utils'
],function(StringToDateFormatter, utils) {
	'use strict';

	var doNothing = function() {
	};
	var getText = function(key) {
		return "text : " + key;
	};
	function _getMetaData() {
		var newMetadata = {
			getPropertyMetadata : function(sPropertyName) {
				var metadata;
				switch (sPropertyName) {
					case "CalendarYearMonthWithDataType":
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
					case "CalendarYearMonthWithType":
						metadata = {
							"name" : "CalendarYearMonth",
							"isCalendarYearMonth" : "true",
							"type" : "Edm.String",
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "CalendarYearMonthWithoutSemantics":
						metadata = {
							"name" : "CalendarYearMonth",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "CalendarYearMonthWithSemantics":
						metadata = {
							"name" : "CalendarYearMonth",
							"sap:semantics" : "yearmonth",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "CalendarYearMonthWithSemanticsString":
						metadata = {
							"name" : "CalendarYearMonth",
							"sap:semantics" : {
								"String" : "yearmonth"
							},
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "CalendarYearMonthIsTrue":
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
					case "CalendarYearMonthIsUndefined":
						metadata = {
							"name" : "CalendarYearMonth",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "CalendarYearMonthDaySemantics":
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
					case "CalendarDateIsTrue":
						metadata = {
							"name" : "CalendarYearMonthDay",
							"isCalendarDate" : "true",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month Day"
						};
						break;
					case "CalendarDateIsUndefined":
						metadata = {
							"name" : "CalendarYearMonthDay",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month Day"
						};
						break;
					case "CalendarYearQuarterIsTrue":
						metadata = {
							"name" : "CalendarQuarter",
							"isCalendarYearQuarter" : "true",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "CalendarYearQuarterIsUndefined":
						metadata = {
							"name" : "CalendarQuarter",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "CalendarYearWeekIsTrue":
						metadata = {
							"name" : "CalendarWeek",
							"isCalendarYearWeek" : "true",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "CalendarYearWeekIsUndefined":
						metadata = {
							"name" : "CalendarWeek",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
						};
						break;
					case "UnsupportedSemantics":
						metadata = {
							"name" : "CalendarWeek",
							"sap:semantics" : "unsupportedSemantics",
							"dataType" : {
								"maxLength" : "10",
								"type" : "Edm.String"
							},
							"aggregation-role" : "dimension",
							"label" : "Year and Month"
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
	function _valueAfterFormatted() {
		var aFormattedValue = [{
			"CalendarYearMonth" : "text : month-5-shortName 2013",
			"CalendarYearMonthDay" : "3/10/14",
			"CalendarQuarter" : "Q2 2014",
			"CalendarWeek" : "CW21 2014",
			"Currency" : "EUR"
		}];
		return aFormattedValue;
	}
	function _getDataResponse() {
		var aDataResponse = [ {
			"CalendarDate" : "20140310",
			"CalendarWeek" : "201421",
			"CalendarQuarter" : "20142",
			"YearMonth" : "201305",
			"PostingDate_E" : "/Date(1335830400000)/",
			"CurrencyCode" : "EUR"
		} ];
		return aDataResponse;
	}
	QUnit.module('Test for data type of Edm.String', {
		beforeEach : function(assert) {
			this.formatter = new StringToDateFormatter();
		}
	});
	QUnit.test("When sap:semantics is undefined", function(assert) {
		var formatedValue = this.formatter.getFormattedValue("CalendarYearMonthWithoutSemantics", _getDataResponse()[0].YearMonth);
		assert.strictEqual(formatedValue, _getDataResponse()[0].YearMonth, "Then since no semantic value is defined hence value will not be formatted");
	});
	QUnit.test("When sap:semantics is yearmonth", function(assert) {
		var oFormattedArgs = {
			getEventCallback : doNothing,
			getTextNotHtmlEncoded : getText
		};
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearMonthWithSemantics"), _getDataResponse()[0].YearMonth, oFormattedArgs);
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].CalendarYearMonth, "Then formatted the given year month value as " + formatedValue);
	});
	QUnit.test("When sap:semantics.string is yearmonth", function(assert) {
		var oFormattedArgs = {
				getEventCallback : doNothing,
				getTextNotHtmlEncoded : getText
			};
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearMonthWithSemanticsString"), _getDataResponse()[0].YearMonth, oFormattedArgs);
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].CalendarYearMonth, "Then formatted the given year month value as " + formatedValue);
	});
	QUnit.test("When isCalendarYearMonth is true", function(assert) {
		var oFormattedArgs = {
				getEventCallback : doNothing,
				getTextNotHtmlEncoded : getText
		};
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearMonthIsTrue"), _getDataResponse()[0].YearMonth, oFormattedArgs);
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].CalendarYearMonth, "Then formatted the given year month value as " + formatedValue);
	});
	QUnit.test("When isCalendarYearMonth is undefined", function(assert) {
		var oFormattedArgs = {
				getEventCallback : doNothing,
				getTextNotHtmlEncoded : getText
			};
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearMonthIsUndefined"), _getDataResponse()[0].YearMonth, oFormattedArgs);
		assert.strictEqual(formatedValue, _getDataResponse()[0].YearMonth, "Then value will not be formatted it will return the original value");
	});
	QUnit.test("When sap:semantics is yearmonthday", function(assert) {
		var date = _getDataResponse()[0].CalendarDate;
		var spy = sinon.spy(utils, "convertFiscalYearMonthDayToDate");
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearMonthDaySemantics"), date);
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].CalendarYearMonthDay, "Then formatted the given year month day value as " + formatedValue);
		assert.strictEqual(spy.callCount, 1, "THEN official conversion routine has been called");
		assert.ok(spy.calledWith(date), "THEN official conversion routine was called with expected argument");
		spy.restore();
	});
	QUnit.test("When sap:semantics is yearmonthday AND date string is supplied", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearMonthDaySemantics"), new Date(Date.UTC(2014, 2, 10)).toString());
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].CalendarYearMonthDay, "Then formatted the given year month day value as " + formatedValue);
	});
	QUnit.test("When sap:semantics is yearmonthday and original value in un supported format", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearMonthDaySemantics"), _getDataResponse()[0].PostingDate_E);
		assert.strictEqual(formatedValue, "-", "Then since formatted value is in unsupported format so returning as -(Hypen)");
	});
	QUnit.test("When sap:semantics is not supported by formatter", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("UnsupportedSemantics"), _getDataResponse()[0].CurrencyCode);
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].Currency, "Then since given semantics was not supported by formatter hence returned original value " + formatedValue);
	});
	QUnit.test("When isCalendarDate is true", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarDateIsTrue"), _getDataResponse()[0].CalendarDate);
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].CalendarYearMonthDay, "Then formatted the given year month day value as " + formatedValue);
	});
	QUnit.test("When isCalendarDate is undefined", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarDateIsUndefined"), _getDataResponse()[0].CalendarDate);
		assert.strictEqual(formatedValue, _getDataResponse()[0].CalendarDate, "Then value will not be formatted it will return the original value");
	});
	QUnit.test("When isCalendarYearQuarter is true", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearQuarterIsTrue"), _getDataResponse()[0].CalendarQuarter);
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].CalendarQuarter, "Then formatted the given year quarter value as " + formatedValue);
	});
	QUnit.test("When isCalendarYearQuarter is undefined", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearQuarterIsUndefined"), _getDataResponse()[0].CalendarQuarter);
		assert.strictEqual(formatedValue, _getDataResponse()[0].CalendarQuarter, "Then value will not be formatted it will return the original value");
	});
	QUnit.test("When isCalendarYearWeek is true", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearWeekIsTrue"), _getDataResponse()[0].CalendarWeek);
		assert.strictEqual(formatedValue, _valueAfterFormatted()[0].CalendarWeek, "Then formatted the given year calendar week value as " + formatedValue);
	});
	QUnit.test("When isCalendarYearWeek is undefined", function(assert) {
		var formatedValue = this.formatter.getFormattedValue(_getMetaData().getPropertyMetadata("CalendarYearWeekIsUndefined"), _getDataResponse()[0].CalendarWeek);
		assert.strictEqual(formatedValue, _getDataResponse()[0].CalendarWeek, "Then value will not be formatted it will return the original value");
	});
});
