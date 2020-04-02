/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/comp/smartfield/type/Currency",
	"sap/ui/model/ValidateException"
], function(Currency, ValidateException) {
	"use strict";

	QUnit.module("");

	QUnit.test("it should return the name of the data type class", function(assert) {

		// assert
		assert.strictEqual(Currency.prototype.getName.call(), "sap.ui.comp.smartfield.type.Currency");
	});

	QUnit.module("parseValue und validateValue", {
		beforeEach: function() {
			this.oFormatOptions = {
				showMeasure: false,
				parseAsString: true,
				emptyString: 0
			};
		},
		afterEach: function() {
			this.oFormatOptions = null;
		}
	});

	QUnit.test("", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
		};

		var aCurrentValues = [undefined, "EUR"];

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);

		// act
		var aValues = oCurrencyType.parseValue("123", "string", aCurrentValues);
		oCurrencyType.validateValue(aValues);

		// assert
		assert.ok(Array.isArray(aValues));
		assert.strictEqual(aValues[0], "123");
		assert.strictEqual(aValues[1], "EUR");

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test('calling .validateValue(["123", "EUR"]) should NOT raise a validate exception ' +
	           'given (Precision=3 and Scale=0)', function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3
			// scale is not specified (the default Scale is 0)
		};

		var CURRENT_VALUES = [undefined, "EUR"];

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);

		// act
		var aValues = oCurrencyType.parseValue("123", "string", CURRENT_VALUES);
		oCurrencyType.validateValue(aValues);

		// assert
		assert.ok(Array.isArray(aValues));
		var MESSAGE = "123 is an allowed value given the Precision=3 and Scale=0";
		assert.strictEqual(aValues[0], "123", MESSAGE);
		assert.strictEqual(aValues[1], "EUR");

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test('calling .validateValue(["123", "EUR"]) should raise a validate exception ' +
	           'given (Precision=3 and Scale=2)', function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 3,
			maxFractionDigits: 2
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3,
			scale: 2
		};

		var CURRENT_VALUES = [undefined, "EUR"];

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);

		// act
		var aValues = oCurrencyType.parseValue("123", "string", CURRENT_VALUES);

		try {
			oCurrencyType.validateValue(aValues);
		} catch (oException) {

			// assert
			// "123 is not an allowed value given the Precision=3 and Scale=2"
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test('calling .validateValue(["12.345", "EUR"]) should raise a validate exception ' +
	           'given (Precision=3 and Scale=2)', function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 5,
			maxFractionDigits: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 3,
			scale: 2
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);

		// act
		try {
			oCurrencyType.validateValue(["12.345", "EUR"]);
		} catch (oException) {

			// assert
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should raise a validate exception when the number of decimals places for a currency " +
	           "are exceeded (test case 1)", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 5,
			maxFractionDigits: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 5,
			scale: 3
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);

		// act
		try {
			oCurrencyType.validateValue(["12.123", "EUR"]);
		} catch (oException) {

			// assert
			// a maximum of 2 decimal places for the euro (EUR) currency are allowed
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should raise a validate exception when the number of decimals places for a currency are " +
	           "exceeded (test case 2)", function(assert) {

		// arrange
		var oFormatOptions = Object.assign({
			precision: 5,
			maxFractionDigits: 3
		}, this.oFormatOptions);

		var oConstraints = {
			precision: 5,
			scale: 3
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);

		// act
		try {
			oCurrencyType.validateValue(["12.1", "HUF"]);
		} catch (oException) {

			// assert
			// no decimal places for the Hungarian forint (HUF) currency are allowed
			assert.ok(oException instanceof ValidateException, oException.message);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should raise a validate exception when the value is NOT a string", function(assert) {

		// system under test
		var oCurrencyType = new Currency(this.oFormatOptions, this.oConstraints);

		// act
		try {
			oCurrencyType.validateValue([99.9, "EUR"]);
		} catch (oException) {

			// assert
			assert.ok(oException instanceof ValidateException);
		}

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test("it should NOT raise a validate exception when the nullable constraint is set to true and the value " +
	           "is empty", function(assert) {

		// arrange
		var oConstraints = Object.assign({
			nullable: true
		}, this.oConstraints);

		// system under test
		var oCurrencyType = new Currency(this.oFormatOptions, oConstraints);

		// act
		try {
			var aValues = oCurrencyType.parseValue("", "string", [undefined, "EUR"]),
				sValue = aValues[0];

			oCurrencyType.validateValue([sValue, "EUR"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oCurrencyType.destroy();
	});

	// BCP: 1970394800
	QUnit.test("it should NOT raise a validate exception when the nullable constraint is set to true, the value " +
	           "is empty, and emptyString format option is set to null", function(assert) {

		// arrange
		var oFormatOptions = {
			showMeasure: false,
			parseAsString: true,
			emptyString: null
		};

		var oConstraints = {
			nullable: true
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);

		// act
		try {
			var aValues = oCurrencyType.parseValue("", "string", [undefined, "EUR"]),
				sValue = aValues[0];

			oCurrencyType.validateValue([sValue, "EUR"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.test('it should NOT raise a validate exception when the nullable constraint is set to true, the value ' +
				'is empty, and emptyString format option is set to ""', function(assert) {

		// arrange
		var oFormatOptions = {
			showMeasure: false,
			parseAsString: true,
			emptyString: ""
		};

		var oConstraints = {
			nullable: true
		};

		// system under test
		var oCurrencyType = new Currency(oFormatOptions, oConstraints);

		// act
		try {
		var aValues = oCurrencyType.parseValue("", "string", [undefined, "EUR"]),
			sValue = aValues[0];

			oCurrencyType.validateValue([sValue, "EUR"]);
		} catch (oException) {

			// assert
			assert.notOk(oException instanceof ValidateException);
		}

		assert.ok(true);

		// cleanup
		oCurrencyType.destroy();
	});

	QUnit.start();
});
