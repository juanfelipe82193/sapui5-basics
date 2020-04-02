/* global QUnit */
(function () {
	"use strict";
	QUnit.config.autostart = false;

	sap.ui.define([
		'sap/ui/comp/odata/FiscalFormat',
		"sap/ui/model/ValidateException"
	], function (FiscalFormat, ValidateException) {

		function fnFormattingParsingHandler(assert, sformat, sInputData) {
			// var oFiscalFormat =  FiscalFormat.getDateInstance({ anotationType: sAnotationType });
			var oFiscalFormat =  FiscalFormat.getDateInstance({ format: sformat, calendarType: "Gregorian" });
			var vFormatedValueg = oFiscalFormat.format(sInputData);
			var vParsedValue = oFiscalFormat.parse(vFormatedValueg);

			assert.equal(sInputData, vParsedValue, "The parsing is reversing the input of the formatting.");
			oFiscalFormat.destroy();
			oFiscalFormat = null;
		}

		function fnValidationHandler(assert, sformat, sInputData) {
			var oFiscalFormat = FiscalFormat.getDateInstance({ format: sformat, calendarType: "Gregorian" });
			assert.equal(oFiscalFormat.validate(oFiscalFormat.parse(sInputData)), false, "The validation fails.");

			oFiscalFormat.destroy();
			oFiscalFormat = null;
		}

		QUnit.module("FiscalFormat Formatting and Parsing");

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalPeriod", function (assert) {
			fnFormattingParsingHandler(assert, "PPP", "002");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", function (assert) {
			fnFormattingParsingHandler(assert, "YYYYPPP", "2012002");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalQuarter", function (assert) {
			fnFormattingParsingHandler(assert, "Q", "3");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", function (assert) {
			fnFormattingParsingHandler(assert, "YYYYQ", "20123");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalWeek", function (assert) {
			fnFormattingParsingHandler(assert, "WW", "51");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearWeek", function (assert) {
			fnFormattingParsingHandler(assert, "YYYYWW", "201251");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsDayOfFiscalYear", function (assert) {
			fnFormattingParsingHandler(assert, "d", "342");
		});

		// QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearVariant", function (assert) {
		// 	fnFormattingParsingHandler(assert, "com.sap.vocabularies.Common.v1.IsFiscalYearVariant", "");
		// });

		QUnit.module("FiscalFormat Validation");

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYear", function (assert) {
			fnValidationHandler(assert, "YYYY", "-2012");
			fnValidationHandler(assert, "YYYY", "0123");
			fnValidationHandler(assert, "YYYY", "20125");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalPeriod", function (assert) {
			// fnValidationHandler(assert, "P", "-1");
			// fnValidationHandler(assert, "P", "1");
			// fnValidationHandler(assert, "P", "12");
			fnValidationHandler(assert, "PPP", "1234");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearPeriod", function (assert) {
			fnValidationHandler(assert, "YYYYPPP", "-2012003");
			// Invalid year and valid period
			fnValidationHandler(assert, "YYYYPPP", "0012002");
			fnValidationHandler(assert, "YYYYPPP", "22012002");
			// Valid year and invalid period
			fnValidationHandler(assert, "YYYYPPP", "20121");
			fnValidationHandler(assert, "YYYYPPP", "201212");
			fnValidationHandler(assert, "YYYYPPP", "20121234");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalQuarter", function (assert) {
			fnValidationHandler(assert, "Q", "-4");
			fnValidationHandler(assert, "Q", "21");
			fnValidationHandler(assert, "Q", "5");
			fnValidationHandler(assert, "Q", "0");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearQuarter", function (assert) {
			fnValidationHandler(assert, "YYYYQ", "-20124");
			// Inalid year and invalid quarter
			fnValidationHandler(assert, "YYYYQ", "00124");
			fnValidationHandler(assert, "YYYYQ", "201254");
			// Valid year and invalid quarter
			fnValidationHandler(assert, "YYYYQ", "201221");
			fnValidationHandler(assert, "YYYYQ", "20125");
			fnValidationHandler(assert, "YYYYQ", "20120");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalWeek", function (assert) {
			fnValidationHandler(assert, "WW", "-1");
			fnValidationHandler(assert, "WW", "0");
			fnValidationHandler(assert, "WW", "54");
			fnValidationHandler(assert, "WW", "123");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsFiscalYearWeek", function (assert) {
			fnValidationHandler(assert, "YYYYWW", "-201253");
			// Inalid year and valid week
			fnValidationHandler(assert, "YYYYWW", "001224");
			fnValidationHandler(assert, "YYYYWW", "2012324");
			// Valid year and invalid week
			fnValidationHandler(assert, "YYYYWW", "201254");
			fnValidationHandler(assert, "YYYYWW", "20120");
			fnValidationHandler(assert, "YYYYWW", "2012544");
		});

		QUnit.test("Formatting/Parsing com.sap.vocabularies.Common.v1.IsDayOfFiscalYear", function (assert) {
			fnValidationHandler(assert, "d", "-1");
			fnValidationHandler(assert, "d", "0");
			fnValidationHandler(assert, "d", "372");
		});

		QUnit.start();
	});

})();
