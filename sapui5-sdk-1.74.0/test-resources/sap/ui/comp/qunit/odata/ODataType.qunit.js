/* global QUnit */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/odata/ODataType", "sap/ui/comp/odata/type/StringDate", "sap/ui/model/odata/type/Boolean", "sap/ui/model/odata/type/Byte", "sap/ui/model/odata/type/DateTime", "sap/ui/model/odata/type/DateTimeOffset", "sap/ui/model/odata/type/Decimal", "sap/ui/model/odata/type/Double", "sap/ui/model/odata/type/Single", "sap/ui/model/odata/type/Guid", "sap/ui/model/odata/type/Int16", "sap/ui/model/odata/type/Int32", "sap/ui/model/odata/type/Int64", "sap/ui/model/odata/type/SByte", "sap/ui/model/odata/type/String", "sap/ui/model/odata/type/Time", "sap/ui/comp/odata/type/FiscalDate"
	], function(ODataType, StringDate, Boolean, Byte, DateTime, DateTimeOffset, Decimal, Double, Single, Guid, Int16, Int32, Int64, SByte, String, Time, FiscalDate) {

		QUnit.module("sap.ui.comp.odata.ODataType");

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(ODataType);
		});

		QUnit.test("Shall return the proper Odata model type based on Odata primitive type (Edm type)", function(assert) {
			var oType = null;

			oType = ODataType.getType("Edm.Boolean");
			assert.ok(oType instanceof Boolean);

			oType = ODataType.getType("Edm.Byte");
			assert.ok(oType instanceof Byte);

			oType = ODataType.getType("Edm.DateTime");
			assert.ok(oType instanceof DateTime);

			oType = ODataType.getType("Edm.DateTimeOffset");
			assert.ok(oType instanceof DateTimeOffset);

			oType = ODataType.getType("Edm.Decimal");
			assert.ok(oType instanceof Decimal);

			oType = ODataType.getType("Edm.Double");
			assert.ok(oType instanceof Double);

			oType = ODataType.getType("Edm.Float");
			assert.ok(oType instanceof Single);

			oType = ODataType.getType("Edm.Guid");
			assert.ok(oType instanceof Guid);

			oType = ODataType.getType("Edm.Int16");
			assert.ok(oType instanceof Int16);

			oType = ODataType.getType("Edm.Int32");
			assert.ok(oType instanceof Int32);

			oType = ODataType.getType("Edm.Int64");
			assert.ok(oType instanceof Int64);

			oType = ODataType.getType("Edm.SByte");
			assert.ok(oType instanceof SByte);

			oType = ODataType.getType("Edm.Single");
			assert.ok(oType instanceof Single);

			oType = ODataType.getType("Edm.String");
			assert.ok(oType instanceof String);

			oType = ODataType.getType("Edm.String", {}, {}, true);
			assert.ok(oType instanceof StringDate);

			oType = ODataType.getType("Edm.String", {}, {}, {isCalendarDate: true});
			assert.ok(oType instanceof StringDate);

			oType = ODataType.getType("Edm.String", {}, {}, {isFiscalDate: true, fiscalType: "com.sap.vocabularies.Common.v1.IsFiscalYear"});
			assert.ok(oType instanceof FiscalDate);

			oType = ODataType.getType("Edm.Time");
			assert.ok(oType instanceof Time);

			oType = ODataType.getType("foo");
			assert.strictEqual(oType, null);
		});

		QUnit.test("Shall return the proper type name based on the OData primitive type (Edm type)", function(assert) {
			var sType;

			sType = ODataType.getTypeName("Edm.Boolean");
			assert.strictEqual(sType, "Boolean");

			sType = ODataType.getTypeName("Edm.Byte");
			assert.strictEqual(sType, "Byte");

			sType = ODataType.getTypeName("Edm.DateTime");
			assert.strictEqual(sType, "DateTime");

			sType = ODataType.getTypeName("Edm.DateTimeOffset");
			assert.strictEqual(sType, "DateTimeOffset");

			sType = ODataType.getTypeName("Edm.Decimal");
			assert.strictEqual(sType, "Decimal");

			sType = ODataType.getTypeName("Edm.Double");
			assert.strictEqual(sType, "Double");

			sType = ODataType.getTypeName("Edm.Float");
			assert.strictEqual(sType, "Float");

			sType = ODataType.getTypeName("Edm.Guid");
			assert.strictEqual(sType, "Guid");

			sType = ODataType.getTypeName("Edm.Int16");
			assert.strictEqual(sType, "Int16");

			sType = ODataType.getTypeName("Edm.Int32");
			assert.strictEqual(sType, "Int32");

			sType = ODataType.getTypeName("Edm.Int64");
			assert.strictEqual(sType, "Int64");

			sType = ODataType.getTypeName("Edm.SByte");
			assert.strictEqual(sType, "SByte");

			sType = ODataType.getTypeName("Edm.Single");
			assert.strictEqual(sType, "Single");

			sType = ODataType.getTypeName("Edm.String");
			assert.strictEqual(sType, "String");

			sType = ODataType.getTypeName("Edm.Time");
			assert.strictEqual(sType, "Time");

			sType = ODataType.getTypeName("foo");
			assert.strictEqual(sType, "foo");
		});

		QUnit.test("Shall return the name of the defaultValue property (e.g. in annotations) based on the OData primitive type (Edm type)", function(assert) {
			var sType;

			sType = ODataType.getDefaultValueTypeName("Edm.Boolean");
			assert.strictEqual(sType, "Bool");

			sType = ODataType.getDefaultValueTypeName("Edm.Byte");
			assert.strictEqual(sType, "Int");

			sType = ODataType.getDefaultValueTypeName("Edm.DateTime");
			assert.strictEqual(sType, "Date");

			sType = ODataType.getDefaultValueTypeName("Edm.DateTimeOffset");
			assert.strictEqual(sType, "DateTimeOffset");

			sType = ODataType.getDefaultValueTypeName("Edm.Decimal");
			assert.strictEqual(sType, "Decimal");

			sType = ODataType.getDefaultValueTypeName("Edm.Double");
			assert.strictEqual(sType, "Float");

			sType = ODataType.getDefaultValueTypeName("Edm.Float");
			assert.strictEqual(sType, "Float");

			sType = ODataType.getDefaultValueTypeName("Edm.Guid");
			assert.strictEqual(sType, "Guid");

			sType = ODataType.getDefaultValueTypeName("Edm.Int16");
			assert.strictEqual(sType, "Int");

			sType = ODataType.getDefaultValueTypeName("Edm.Int32");
			assert.strictEqual(sType, "Int");

			sType = ODataType.getDefaultValueTypeName("Edm.Int64");
			assert.strictEqual(sType, "Int");

			sType = ODataType.getDefaultValueTypeName("Edm.SByte");
			assert.strictEqual(sType, "Int");

			sType = ODataType.getDefaultValueTypeName("Edm.Single");
			assert.strictEqual(sType, "Float");

			sType = ODataType.getDefaultValueTypeName("Edm.String");
			assert.strictEqual(sType, "String");

			sType = ODataType.getDefaultValueTypeName("Edm.Time");
			assert.strictEqual(sType, "TimeOfDay");

			sType = ODataType.getDefaultValueTypeName("foo");
			assert.strictEqual(sType, undefined);
		});

		QUnit.test("Shall return a boolean value indicating whether the Odata primitive type (Edm type) is a numeric", function(assert) {
			var bIsNumeric;

			bIsNumeric = ODataType.isNumeric("Edm.Byte");
			assert.strictEqual(bIsNumeric, true);
			bIsNumeric = ODataType.isNumeric("Edm.Decimal");
			assert.strictEqual(bIsNumeric, true);
			bIsNumeric = ODataType.isNumeric("Edm.Double");
			assert.strictEqual(bIsNumeric, true);
			bIsNumeric = ODataType.isNumeric("Edm.Float");
			assert.strictEqual(bIsNumeric, true);
			bIsNumeric = ODataType.isNumeric("Edm.Int16");
			assert.strictEqual(bIsNumeric, true);
			bIsNumeric = ODataType.isNumeric("Edm.Int32");
			assert.strictEqual(bIsNumeric, true);
			bIsNumeric = ODataType.isNumeric("Edm.Int64");
			assert.strictEqual(bIsNumeric, true);
			bIsNumeric = ODataType.isNumeric("Edm.SByte");
			assert.strictEqual(bIsNumeric, true);
			bIsNumeric = ODataType.isNumeric("Edm.Single");
			assert.strictEqual(bIsNumeric, true);

			bIsNumeric = ODataType.isNumeric("Edm.String");
			assert.strictEqual(bIsNumeric, false);
			bIsNumeric = ODataType.isNumeric("Edm.Boolean");
			assert.strictEqual(bIsNumeric, false);
		});

		QUnit.test("Shall return a boolean value indicating whether the Odata primitive type (Edm type) is a date or time or datetime", function(assert) {
			var bIsDateOrTime;

			bIsDateOrTime = ODataType.isDateOrTime("Edm.DateTime");
			assert.strictEqual(bIsDateOrTime, true);
			bIsDateOrTime = ODataType.isDateOrTime("Edm.DateTimeOffset");
			assert.strictEqual(bIsDateOrTime, true);
			bIsDateOrTime = ODataType.isDateOrTime("Edm.Time");
			assert.strictEqual(bIsDateOrTime, true);

			bIsDateOrTime = ODataType.isDateOrTime("Edm.Int16");
			assert.strictEqual(bIsDateOrTime, false);
			bIsDateOrTime = ODataType.isDateOrTime("Edm.Int32");
			assert.strictEqual(bIsDateOrTime, false);
			bIsDateOrTime = ODataType.isDateOrTime("Edm.Int64");
			assert.strictEqual(bIsDateOrTime, false);
			bIsDateOrTime = ODataType.isDateOrTime("Edm.Single");
			assert.strictEqual(bIsDateOrTime, false);
			bIsDateOrTime = ODataType.isDateOrTime("Edm.String");
			assert.strictEqual(bIsDateOrTime, false);
			bIsDateOrTime = ODataType.isDateOrTime("Edm.Boolean");
			assert.strictEqual(bIsDateOrTime, false);
		});

		QUnit.start();
	});

})();
