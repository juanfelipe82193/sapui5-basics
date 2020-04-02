/* global QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfield/type/AbapBool",
	"sap/ui/comp/smartfield/type/DateTime",
	"sap/ui/comp/smartfield/type/DateTimeOffset",
	"sap/ui/comp/smartfield/type/Time",
	"sap/ui/comp/smartfield/type/String",
	"sap/ui/comp/smartfield/type/Decimal",
	"sap/ui/comp/smartfield/type/Int16",
	"sap/ui/comp/smartfield/type/Int32",
	"sap/ui/comp/smartfield/type/Int64",
	"sap/ui/comp/smartfield/type/SByte"
], function(AbapBool, DateTime, DateTimeOffset, Time, StringType, DecimalType, Int16Type, Int32Type, Int64Type, SByteType) {
	"use strict";

	QUnit.module("sap.ui.comp.smartfield.type", {
		beforeEach: function() {

		},
		afterEach: function() {

		}
	});

	QUnit.test("Time", function(assert) {
		var sVal, oType, sReturn;

		oType = new Time();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.Time");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("DateTime", function(assert) {
		var sVal, oType, sReturn;

		oType = new DateTime();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.DateTime");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("DateTimeOffset", function(assert) {
		var sVal, oType, sReturn;

		oType = new DateTimeOffset();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.DateTimeOffset");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("String", function(assert) {
		var sVal, oType, sReturn;

		oType = new StringType();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.String");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("Decimal", function(assert) {
		var sVal, oType, sReturn;

		oType = new DecimalType();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.Decimal");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("Int16", function(assert) {
		var sVal, oType, sReturn;

		oType = new Int16Type();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.Int16");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("Int32", function(assert) {
		var sVal, oType, sReturn;

		oType = new Int32Type();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.Int32");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("Int64", function(assert) {
		var sVal, oType, sReturn;

		oType = new Int64Type();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.Int64");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("SByte", function(assert) {
		var sVal, oType, sReturn;

		oType = new SByteType();
		oType.oFieldControl = function(sValue) {
			sVal = sValue;
		};

		assert.ok(oType);
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.SByte");
		sReturn = oType.parseValue(null, "string");
		assert.equal(sReturn, null);
		assert.equal(sVal, null);
	});

	QUnit.test("AbapBool", function(assert) {
		var oType, oTarget, bExc = false;

		oType = new AbapBool();
		assert.equal(oType.getName(), "sap.ui.comp.smartfield.type.AbapBool");

		// formatValue tests.
		oTarget = oType.formatValue();
		assert.equal(oTarget, null);

		oTarget = oType.formatValue(1, "boolean");
		assert.equal(oTarget, false);

		oTarget = oType.formatValue("X", "boolean");
		assert.equal(oTarget, true);

		try {
			oTarget = oType.formatValue("X", "bool");
		} catch (ex) {
			bExc = true;
		}

		assert.equal(bExc, true);
		bExc = false;

		// parseValue tests
		try {
			oTarget = oType.parseValue();
		} catch (ex) {
			bExc = true;
		}

		assert.equal(bExc, true);
		bExc = false;

		oTarget = oType.parseValue(true, "boolean");
		assert.equal(oTarget, "X");

		oTarget = oType.parseValue("a", "boolean");
		assert.equal(oTarget, false);

		oTarget = oType.parseValue(1, "boolean");
		assert.equal(oTarget, false);

		oTarget = oType.parseValue(false, "boolean");
		assert.equal(oTarget, false);

		// validate value
		try {
			oType.validateValue();
		} catch (ex) {
			bExc = true;
		}

		assert.equal(bExc, false);
		bExc = false;

		try {
			oType.validateValue("a");
		} catch (ex) {
			bExc = true;
		}

		assert.equal(bExc, true);
		bExc = false;
	});

	QUnit.start();

});