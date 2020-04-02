/* global QUnit */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/odata/CalendarMetadata"
	], function(CalendarMetadata) {

		QUnit.module("sap.ui.comp.odata.CalendarMetadata");

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(CalendarMetadata);
		});

		QUnit.test("Shall return the proper result based on Calendar Annotation", function(assert) {
			var oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarDate": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarHalfyear": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarMonth": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarQuarter": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarWeek": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYear": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearMonth": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearQuarter": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearWeek": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarSomethingNew": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), false);

			oField = {
				"foo": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarValue(oField), false);
		});

		QUnit.test("Shall return the proper result based on Fiscal Annotation", function(assert) {
			var oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalPeriod": {}
			};
			assert.strictEqual(CalendarMetadata.isFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalYear": {}
			};
			assert.strictEqual(CalendarMetadata.isFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalYearPeriod": {}
			};
			assert.strictEqual(CalendarMetadata.isFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalSomethingNew": {}
			};
			assert.strictEqual(CalendarMetadata.isFiscalValue(oField), false);

			oField = {
				"foo": {}
			};
			assert.strictEqual(CalendarMetadata.isFiscalValue(oField), false);
		});

		QUnit.test("Shall return the proper result based on Calendar/Fiscal Annotation", function(assert) {
			var oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarDate": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarHalfyear": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarMonth": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarQuarter": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarWeek": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYear": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearMonth": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearQuarter": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYearWeek": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarSomethingNew": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), false);

			oField = {
				"foo": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), false);

			oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalPeriod": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalYear": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalYearPeriod": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), true);

			oField = {
				"com.sap.vocabularies.Common.v1.IsFiscalSomethingNew": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), false);

			oField = {
				"foo": {}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), false);

			oField = {
				"com.sap.vocabularies.Common.v1.IsCalendarYear": {
					Bool: "false"
				}
			};
			assert.strictEqual(CalendarMetadata.isCalendarOrFiscalValue(oField), false);
		});

		QUnit.start();
	});

})();
