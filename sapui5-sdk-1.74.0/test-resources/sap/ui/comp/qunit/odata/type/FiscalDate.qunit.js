/*global QUnit*/
(function () {
	"use strict";
	QUnit.config.autostart = false;

	sap.ui.define([
		'sap/ui/comp/odata/type/FiscalDate',
		"sap/ui/model/ValidateException"
	], function (FiscalDateType, ValidateException) {

		function fnFormattingParsingHandler(assert, sAnotationType, sInputData) {
			var oFiscalDate = new FiscalDateType(null, null, {
				anotationType: sAnotationType
			});
			var vFormatedValueg = oFiscalDate.formatValue(sInputData, "string");
			var vParsedValue = oFiscalDate.parseValue(vFormatedValueg, "string");

			assert.equal(sInputData, vParsedValue, "The parsing is reversing the input of the formatting.");
			oFiscalDate.destroy();
			oFiscalDate = null;
		}

		function fnValidationHandler(assert, sAnotationType, sInputData) {
			var oFiscalDate = new FiscalDateType(null, null, {
				anotationType: sAnotationType
			});

			assert.throws(function() {
				oFiscalDate.validateValue(oFiscalDate.parseValue(sInputData, "string"));
			}, function(oError) {
				return oError instanceof ValidateException;
			});
		}

		QUnit.module("FiscalDate Formatting and Parsing");

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYear", function (assert) {
			fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYear", "2012");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalPeriod", function (assert) {
			fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalPeriod", "002");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", function (assert) {
			fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", "2012002");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalQuarter", function (assert) {
			fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalQuarter", "3");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", function (assert) {
			fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", "20123");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalWeek", function (assert) {
			fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalWeek", "51");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearWeek", function (assert) {
			fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearWeek", "201251");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsDayOfFiscalYear", function (assert) {
			fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsDayOfFiscalYear", "342");
		});

		// QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearVariant", function (assert) {
		// 	fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearVariant", "");
		// });

		QUnit.module("FiscalDate Validation");

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYear", function (assert) {
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYear", "-2012");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYear", "0123");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYear", "20125");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalPeriod", function (assert) {
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalPeriod", "-1");
			// fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalPeriod", "1");
			// fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalPeriod", "12");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalPeriod", "1234");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", function (assert) {
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", "-2012003");
			// Invalid year and valid period
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", "0012002");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", "22012002");
			// Valid year and invalid period
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", "20121");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", "201212");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", "20121234");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalQuarter", function (assert) {
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalQuarter", "-4");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalQuarter", "21");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalQuarter", "5");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalQuarter", "0");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", function (assert) {
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", "-20124");
			// Inalid year and invalid quarter
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", "00124");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", "201254");
			// Valid year and invalid quarter
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", "201221");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", "20125");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", "20120");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalWeek", function (assert) {
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalWeek", "-1");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalWeek", "0");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalWeek", "54");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalWeek", "123");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearWeek", function (assert) {
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearWeek", "-201253");
			// Inalid year and valid week
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearWeek", "001224");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearWeek", "2012324");
			// Valid year and invalid week
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearWeek", "201254");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearWeek", "20120");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearWeek", "2012544");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsDayOfFiscalYear", function (assert) {
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsDayOfFiscalYear", "-1");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsDayOfFiscalYear", "0");
			fnValidationHandler(assert, "com.sap.vocabularies.Common.v1.IsDayOfFiscalYear", "372");
		});

		QUnit.start();
	});

})();