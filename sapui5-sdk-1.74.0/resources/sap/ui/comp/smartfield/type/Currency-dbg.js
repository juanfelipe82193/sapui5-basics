/*
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/model/type/Currency",
	"sap/ui/model/ValidateException"
], function(
	Core,
	CurrencyBase,
	ValidateException
) {
	"use strict";

	var Currency = CurrencyBase.extend("sap.ui.comp.smartfield.type.Currency", {
		constructor: function(oFormatOptions, oConstraints) {
			CurrencyBase.apply(this, arguments);
			this.bParseWithValues = true;
			this.sName = "Currency";
		}
	});

	Currency.prototype.parseValue = function(vValue, sInternalType, aCurrentValues) {
		var aValues = CurrencyBase.prototype.parseValue.apply(this, arguments);

		if (aValues[1] === undefined) {
			aValues[1] = aCurrentValues[1];
		}

		return aValues;
	};

	Currency.prototype.validateValue = function(vValues) {
		var sValue = vValues[0],
			bNullValue = sValue === null;

		if (this.oConstraints.nullable && (bNullValue || (sValue === this.oFormatOptions.emptyString))) {
			return;
		}

		var rDecimal = /^[-+]?(\d+)(?:\.(\d+))?$/,
			aMatches = rDecimal.exec(sValue);

		if ((typeof sValue !== "string") || (aMatches === null)) {
			throw new ValidateException(getText("EnterNumber"));
		}

		var iIntegerDigits = aMatches[1].length,
			iFractionDigits = (aMatches[2] || "").length,
			iPrecision = this.oConstraints.precision || Infinity,
			sCurrency = vValues[1],
			iScaleOfCurrency = this.oOutputFormat.oLocaleData.getCurrencyDigits(sCurrency),
			iScale = Math.min(this.oConstraints.scale || 0, iScaleOfCurrency);

		if (iFractionDigits > iScale) {

			if (iScale === 0) {

				// enter a number with no decimal places
				throw new ValidateException(getText("EnterInt"));
			}

			if ((iIntegerDigits + iScale) > iPrecision) {

				// enter a number with a maximum of {iPrecision - iScale} digits to the left of the decimal
				// separator and a maximum of {iScale} decimal places
				throw new ValidateException(getText("EnterNumberIntegerFraction", [iPrecision - iScale, iScale]));
			}

			// enter a number with a maximum of {iScale} decimal places
			throw new ValidateException(getText("EnterNumberFraction", [iScale]));
		}

		if (iIntegerDigits > (iPrecision - iScale)) {

			// enter a number with a maximum of {iPrecision - iScale} digits to the left of
			// the decimal separator
			throw new ValidateException(getText("EnterNumberInteger", [iPrecision - iScale]));
		}
	};

	function getText(sKey, aParams) {
		return Core.getLibraryResourceBundle().getText(sKey, aParams);
	}

	Currency.prototype.getName = function() {
		return "sap.ui.comp.smartfield.type.Currency";
	};

	return Currency;
});
