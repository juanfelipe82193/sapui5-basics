/* global QUnit, sinon */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/util/FormatUtil"
	], function(FormatUtil) {

		// add global configuration for Currency Symbol test
		sap.ui.getCore().getConfiguration().getFormatSettings().addCustomCurrencies({
			"DOLLAR": {
				"symbol": "$",
				"digits": 2
			},
			"EURO": {
				"symbol": "€",
				"digits": 2
			}
		});

		/**
		 * Texts Start
		 */
		QUnit.module("sap.ui.comp.util.FormatUtil - Texts");

		QUnit.test("getFormatterFunctionFromDisplayBehaviour", function(assert) {
			var testFunction = function(mResult, sId, sDesc) {
				var sDisplayBehaviour, fnFormatter, sResult;
				for (sDisplayBehaviour in mResult) {
					fnFormatter = FormatUtil.getFormatterFunctionFromDisplayBehaviour(sDisplayBehaviour);
					assert.ok(fnFormatter);

					sResult = fnFormatter(sId, sDesc);
					assert.strictEqual(sResult, mResult[sDisplayBehaviour]);
				}
			};

			// Execution - 1 (Both Id & Desc are available)
			testFunction({
				descriptionAndId: "d (i)",
				idAndDescription: "i (d)",
				descriptionOnly: "d",
				idOnly: "i"
			}, "i", "d");

			// Execution - 2 (Only Id is available)
			testFunction({
				descriptionAndId: "i",
				idAndDescription: "i",
				descriptionOnly: undefined,
				idOnly: "i"
			}, "i");
		});

		QUnit.test("getFormattedExpressionFromDisplayBehaviour", function(assert) {
			var testFunction = function(mResult, sId, sDesc) {
				var sDisplayBehaviour, sResult;
				for (sDisplayBehaviour in mResult) {
					sResult = FormatUtil.getFormattedExpressionFromDisplayBehaviour(sDisplayBehaviour, sId, sDesc);
					assert.strictEqual(sResult, mResult[sDisplayBehaviour]);
				}
			};

			// Execution - 1 (Both Id & Desc are available)
			testFunction({
				descriptionAndId: "d (i)",
				idAndDescription: "i (d)",
				descriptionOnly: "d",
				idOnly: "i"
			}, "i", "d");

			// Execution - 2 (Only Id is available)
			testFunction({
				descriptionAndId: "i",
				idAndDescription: "i",
				descriptionOnly: undefined,
				idOnly: "i"
			}, "i");
		});

		QUnit.test("getTextsFromDisplayBehaviour", function(assert) {
			var testFunction = function(mResult, sId, sDesc) {
				var sDisplayBehaviour, sResult;
				for (sDisplayBehaviour in mResult) {
					sResult = FormatUtil.getTextsFromDisplayBehaviour(sDisplayBehaviour, sId, sDesc);
					assert.deepEqual(sResult, mResult[sDisplayBehaviour]);
				}
			};

			// Execution - 1 (Both Id & Desc are available)
			testFunction({
				descriptionAndId: {
					firstText: "d",
					secondText: "i"
				},
				idAndDescription: {
					firstText: "i",
					secondText: "d"
				},
				descriptionOnly: {
					firstText: "d",
					secondText: undefined
				},
				idOnly: {
					firstText: "i",
					secondText: undefined
				}
			}, "i", "d");

			// Execution - 2 (Only Id is available)
			testFunction({
				descriptionAndId: {
					firstText: "i",
					secondText: undefined
				},
				idAndDescription: {
					firstText: "i",
					secondText: undefined
				},
				descriptionOnly: {
					firstText: undefined,
					secondText: undefined
				},
				idOnly: {
					firstText: "i",
					secondText: undefined
				}
			}, "i");

		});

		QUnit.test("getFormattedRangeText", function(assert) {
			var done = assert.async();
			sap.ui.require([
				"sap/m/P13nConditionPanel"
			], function(P13nConditionPanel) {
				var fSpy = this.spy(P13nConditionPanel, "getFormatedConditionText"), sResult;

				assert.ok(fSpy.notCalled);

				sResult = FormatUtil.getFormattedRangeText("EQ", "10");

				assert.ok(fSpy.calledOnce);
				assert.equal(sResult, "=10");

				sResult = FormatUtil.getFormattedRangeText("BT", "1", "2", false);

				assert.ok(fSpy.calledTwice);
				assert.equal(sResult, "1...2");

				sResult = FormatUtil.getFormattedRangeText("BT", "1", "2", true);

				assert.ok(fSpy.calledThrice);
				assert.equal(sResult, "!(1...2)");

				fSpy.restore();
				done();
			}.bind(this));
		});
		/**
		 * Texts End
		 */

		/**
		 * Resume other FormatUtil module
		 */
		QUnit.module("sap.ui.comp.util.FormatUtil");

		QUnit.test("getAmountCurrencyFormatter", function(assert) {
			var vValue = 123, sCurrency, sResult;

			var fnInitSpy = this.spy(FormatUtil, "_initialiseCurrencyFormatter");

			assert.ok(fnInitSpy.notCalled);
			assert.ok(!FormatUtil._fAmountCurrencyFormatter);

			var fFormatter = FormatUtil.getAmountCurrencyFormatter();

			assert.ok(typeof fFormatter === "function");
			assert.ok(fnInitSpy.calledOnce);
			assert.ok(FormatUtil._fAmountCurrencyFormatter);
			assert.strictEqual(fFormatter, FormatUtil._fAmountCurrencyFormatter);

			// EUR
			sCurrency = "EUR";
			sResult = fFormatter(vValue, sCurrency);
			assert.strictEqual(sResult, "123.00" + FormatUtil._FIGURE_SPACE);

			// JPY
			sCurrency = "JPY";
			sResult = fFormatter(vValue, sCurrency);
			assert.strictEqual(sResult, "123" + FormatUtil._PUNCTUATION_SPACE + FormatUtil._FIGURE_SPACE + FormatUtil._FIGURE_SPACE + FormatUtil._FIGURE_SPACE);

			// *
			sCurrency = "*";
			sResult = fFormatter(vValue, sCurrency);
			assert.strictEqual(sResult, "");

			// EUR but no value
			sCurrency = "EUR";
			vValue = undefined;
			sResult = fFormatter(vValue, sCurrency);
			assert.strictEqual(sResult, "");
			fnInitSpy.restore();
		});

		QUnit.test("getCurrencySymbolFormatter", function(assert) {
			var sCurrency, sResult;

			var fnInitSpy = this.spy(FormatUtil, "_initialiseCurrencyFormatter");

			assert.ok(fnInitSpy.notCalled);
			assert.ok(!FormatUtil._fCurrencySymbolFormatter);

			var fFormatter = FormatUtil.getCurrencySymbolFormatter();

			assert.ok(typeof fFormatter === "function");
			assert.ok(fnInitSpy.calledOnce);
			assert.ok(FormatUtil._fCurrencySymbolFormatter);
			assert.strictEqual(fFormatter, FormatUtil._fCurrencySymbolFormatter);

			// Locale dependent - so uses the custom definition done at the beginning of this class
			// EUR
			sCurrency = "EURO";
			sResult = fFormatter(sCurrency);
			assert.strictEqual(sResult, "€");

			// JPY
			sCurrency = "DOLLAR";
			sResult = fFormatter(sCurrency);
			assert.strictEqual(sResult, "$");

			// *
			sCurrency = "*";
			sResult = fFormatter(sCurrency);
			assert.strictEqual(sResult, "");
			fnInitSpy.restore();
		});

		QUnit.test("getMeasureUnitFormatter", function(assert) {
			var vValue = 123.456, sMeasure, sResult;

			var fnInitSpy = this.spy(FormatUtil, "_initialiseSpaceChars");

			assert.ok(fnInitSpy.notCalled);
			assert.ok(!FormatUtil._fMeasureFormatter);

			var fFormatter = FormatUtil.getMeasureUnitFormatter();

			assert.ok(typeof fFormatter === "function");
			assert.ok(fnInitSpy.calledOnce);
			assert.ok(FormatUtil._fMeasureFormatter);
			assert.strictEqual(fFormatter, FormatUtil._fMeasureFormatter);

			// Except *, Unit is irrelevant
			sMeasure = "HUGO";
			sResult = fFormatter(vValue, sMeasure);
			assert.strictEqual(sResult, "123.456" + FormatUtil._FIGURE_SPACE);

			// *
			sMeasure = "*";
			sResult = fFormatter(vValue, sMeasure);
			assert.strictEqual(sResult, "");

			// Unit but no value
			sMeasure = "FOO";
			vValue = undefined;
			sResult = fFormatter(vValue, sMeasure);
			assert.strictEqual(sResult, "");
			fnInitSpy.restore();
		});

		QUnit.test("getInlineMeasureUnitFormatter", function(assert) {
			var vValue = 123.456, sMeasure, sResult;

			var fnInitSpy = this.spy(FormatUtil, "_initialiseSpaceChars");

			assert.ok(fnInitSpy.notCalled);
			assert.ok(!FormatUtil._fInlineMeasureFormatter);

			var fFormatter = FormatUtil.getInlineMeasureUnitFormatter();

			assert.ok(typeof fFormatter === "function");
			assert.ok(fnInitSpy.calledOnce);
			assert.ok(FormatUtil._fInlineMeasureFormatter);
			assert.strictEqual(fFormatter, FormatUtil._fInlineMeasureFormatter);

			// Unit is suffixed to the value
			sMeasure = "PCS";
			sResult = fFormatter(vValue, sMeasure);
			assert.strictEqual(sResult, vValue + FormatUtil._FIGURE_SPACE + sMeasure);

			// *
			sMeasure = "*";
			sResult = fFormatter(vValue, sMeasure);
			assert.strictEqual(sResult, "");

			// Unit but no value
			sMeasure = "FOO";
			vValue = undefined;
			sResult = fFormatter(vValue, sMeasure);
			assert.strictEqual(sResult, "");

			// Value but no unit
			sMeasure = undefined;
			vValue = 123.456;
			sResult = fFormatter(vValue, sMeasure);
			assert.strictEqual(sResult, vValue);

			fnInitSpy.restore();
		});

		QUnit.test("getInlineAmountFormatter", function(assert) {
			var vValue = 123, sCurrency, sResult;

			var fnInitSpy = this.spy(FormatUtil, "_initialiseCurrencyFormatter");

			assert.ok(fnInitSpy.notCalled);
			assert.ok(!FormatUtil._fInlineAmountFormatter);

			var fFormatter = FormatUtil.getInlineAmountFormatter();

			assert.ok(typeof fFormatter === "function");
			assert.ok(fnInitSpy.calledOnce);
			assert.ok(FormatUtil._fInlineAmountFormatter);
			assert.strictEqual(fFormatter, FormatUtil._fInlineAmountFormatter);

			// EUR
			sCurrency = "EUR";
			sResult = fFormatter(vValue, sCurrency);
			assert.strictEqual(sResult, vValue + ".00" + FormatUtil._FIGURE_SPACE + sCurrency);

			// JPY
			sCurrency = "JPY";
			sResult = fFormatter(vValue, sCurrency);
			assert.strictEqual(sResult, vValue + FormatUtil._FIGURE_SPACE + sCurrency);

			// *
			sCurrency = "*";
			sResult = fFormatter(vValue, sCurrency);
			assert.strictEqual(sResult, "");

			// EUR but no value
			sCurrency = "EUR";
			vValue = undefined;
			sResult = fFormatter(vValue, sCurrency);
			assert.strictEqual(sResult, "");

			fnInitSpy.restore();
		});

		QUnit.test("getInlineGroupFormatterFunction", function(assert) {
			var done = assert.async();
			sap.ui.require([
				"sap/ui/model/odata/type/Decimal", "sap/ui/model/odata/type/String"
			], function(Decimal, String) {
				var fFormatter;
				FormatUtil.getInlineAmountFormatter();
				FormatUtil.getInlineMeasureUnitFormatter();

				var fAmountSpy = this.spy(FormatUtil, "_fInlineAmountFormatter");
				var fMeasureSpy = this.spy(FormatUtil, "_fInlineMeasureFormatter");
				var fDescriptionSpy = this.spy(FormatUtil, "_getTextFormatterForIdOnly");

				var oAmountField = {
					name: "foo",
					type: "Edm.Decimal",
					unit: "PathToUnit",
					isCurrencyField: true,
					precision: 10,
					scale: 3,
					modelType: sinon.createStubInstance(Decimal)
				};

				var oMeasureField = {
					name: "foo",
					type: "Edm.Decimal",
					unit: "PathToUnit",
					isCurrencyField: false,
					precision: 10,
					scale: 3,
					modelType: sinon.createStubInstance(Decimal)
				};

				var oDescriptionField = {
					name: "foo",
					type: "Edm.String",
					description: "PathToDescription",
					modelType: sinon.createStubInstance(String)
				};

				var oTypedField = {
					name: "foo",
					type: "Edm.String",
					modelType: sinon.createStubInstance(String)
				};

				var oUnknownField = {
					name: "foo"
				};

				// Test amount
				fFormatter = FormatUtil.getInlineGroupFormatterFunction(oAmountField);

				// Formatter exists
				assert.ok(fFormatter);
				assert.ok(fAmountSpy.notCalled);
				assert.ok(oAmountField.modelType.formatValue.notCalled);

				fFormatter(1234.567, "EUR");

				assert.ok(fAmountSpy.calledOnce);
				// modelType is not used, even if it exists
				assert.ok(oAmountField.modelType.formatValue.notCalled);

				// Test measure
				fFormatter = FormatUtil.getInlineGroupFormatterFunction(oMeasureField);

				// Formatter exists
				assert.ok(fFormatter);
				assert.ok(fMeasureSpy.notCalled);
				assert.ok(oMeasureField.modelType.formatValue.notCalled);

				fFormatter(1234.567, "PCS");

				assert.ok(fMeasureSpy.calledOnce);
				// modelType is used, if it exists
				assert.ok(oMeasureField.modelType.formatValue.calledOnce);

				// Test measure without modelType
				delete oMeasureField.modelType;
				fFormatter = FormatUtil.getInlineGroupFormatterFunction(oMeasureField);

				// Formatter exists
				assert.ok(fFormatter);
				assert.ok(!fMeasureSpy.calledTwice);
				fFormatter(1234.567, "PCS");
				assert.ok(fMeasureSpy.calledTwice);

				// Test description
				fFormatter = FormatUtil.getInlineGroupFormatterFunction(oDescriptionField);

				// Formatter exists
				assert.ok(fFormatter);
				assert.ok(fDescriptionSpy.notCalled);
				assert.ok(oDescriptionField.modelType.formatValue.notCalled);

				fFormatter("id", "desc");

				assert.ok(fDescriptionSpy.calledOnce);
				// modelType is not used, even if it exists
				assert.ok(oDescriptionField.modelType.formatValue.notCalled);

				fDescriptionSpy.reset();
				// Test description field by disabling description
				fFormatter = FormatUtil.getInlineGroupFormatterFunction(oDescriptionField, true);

				// Formatter exists
				assert.ok(fFormatter);
				assert.ok(fDescriptionSpy.notCalled);
				assert.ok(oDescriptionField.modelType.formatValue.notCalled);

				fFormatter("id", "desc");

				// description is not used, even if it exists as it is disabled
				assert.ok(fDescriptionSpy.notCalled);
				// modelType is used, as description is disabled
				assert.ok(oDescriptionField.modelType.formatValue.calledOnce);

				// Test Typed Field
				fFormatter = FormatUtil.getInlineGroupFormatterFunction(oTypedField);

				// Formatter exists
				assert.ok(fFormatter);
				assert.ok(oTypedField.modelType.formatValue.notCalled);

				fFormatter("foo");

				// only modelType is used
				assert.ok(oTypedField.modelType.formatValue.calledOnce);

				// Test unknown field
				fFormatter = FormatUtil.getInlineGroupFormatterFunction(oUnknownField);

				// no formatter for unknown field
				assert.ok(!fFormatter);

				done();
			}.bind(this));
		});

		QUnit.test("getWidth", function(assert) {
			var sWidth;

			// maxLength
			sWidth = FormatUtil.getWidth({
				name: "foo",
				maxLength: 5
			});
			assert.strictEqual(sWidth, "5.75em");

			sWidth = FormatUtil.getWidth({
				name: "foo",
				maxLength: 255
			});
			assert.strictEqual(sWidth, "30em", "Max Limit");

			// precision
			sWidth = FormatUtil.getWidth({
				name: "foo",
				precision: 10
			});
			assert.strictEqual(sWidth, "10.75em");

			sWidth = FormatUtil.getWidth({
				name: "foo",
				precision: 32
			});
			assert.strictEqual(sWidth, "30em", "Max Limit");

			// DateTime
			sWidth = FormatUtil.getWidth({
				name: "foo",
				type: "Edm.DateTime",
				displayFormat: "Date"
			});
			assert.strictEqual(sWidth, "9em", "Date");
			// CalendarDate
			sWidth = FormatUtil.getWidth({
				name: "foo",
				type: "Edm.String",
				isCalendarDate: true
			});
			assert.strictEqual(sWidth, "9em", "Date");

			// String with DescriptionOnlt
			sWidth = FormatUtil.getWidth({
				name: "foo",
				type: "Edm.String",
				description: "textPath",
				displayBehaviour: "descriptionAndId"
			});
			assert.strictEqual(sWidth, "30em", "Max Limit");
			// other properties ignored for description fields
			sWidth = FormatUtil.getWidth({
				name: "foo",
				type: "Edm.String",
				maxLength: 5,
				description: "textPath",
				displayBehaviour: "descriptionAndId"
			});
			assert.strictEqual(sWidth, "30em", "Max Limit");

			// Boolean fields
			sWidth = FormatUtil.getWidth({
				name: "foo",
				type: "Edm.Boolean"
			});
			assert.strictEqual(sWidth, "3em", "Min Limit");

			// Metadata below Min limit
			sWidth = FormatUtil.getWidth({
				name: "foo",
				maxLength: "2"
			});
			assert.strictEqual(sWidth, "3em", "Min Limit");

			// Metadata "Max" value
			sWidth = FormatUtil.getWidth({
				name: "foo",
				maxLength: "Max"
			}, 25, 10);
			assert.strictEqual(sWidth, "25em", "Custom Max Limit");

			// Metadata "Unknown" value
			sWidth = FormatUtil.getWidth({
				name: "foo",
				maxLength: "?"
			}, 25, 10);
			assert.strictEqual(sWidth, "25em", "Custom Max Limit");

			// Custom Min, Max
			sWidth = FormatUtil.getWidth({
				name: "foo",
				type: "Edm.Boolean"
			}, 10, 5);
			assert.strictEqual(sWidth, "5em", "Custom Min Limit");

			// Custom Min, Max (undeterminate width)
			sWidth = FormatUtil.getWidth({
				name: "foo",
				type: "Edm.String"
			}, 10, 5);
			assert.strictEqual(sWidth, "10em", "Custom Max Limit");
		});

		QUnit.start();
	});

})();
