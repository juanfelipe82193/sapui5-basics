/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([
	'sap/ui/core/format/NumberFormat'
], function(NumberFormat) {
	"use strict";
	var DecimalFormatter = function() {
		this.aSupportedSemantics = [ "currency-code", undefined ];
		this.oSemanticsFormatterMap = _getMapForSemantic();
	};
	DecimalFormatter.prototype.constructor = DecimalFormatter;
	function _getMapForSemantic() {
		var semanticsFormatterMap = new Map();
		semanticsFormatterMap.set("currency-code", _currencyFormatter);
		semanticsFormatterMap.set(undefined, _defaultFormatter);
		return semanticsFormatterMap;
	}
	function _currencyFormatter(oMetaData, originalFieldValue) {
		var currencyFormatter = NumberFormat.getCurrencyInstance();
		return currencyFormatter.format(originalFieldValue);
	}
	function _defaultFormatter(oMetaData, originalFieldValue, precision) {
		var fixedFloat = NumberFormat.getFloatInstance({
			style : 'standard',
			minFractionDigits : precision
		});
		return fixedFloat.format(originalFieldValue);
	}
	DecimalFormatter.prototype.getFormattedValue = function(oMetaData, originalFieldValue, precision) {
		var sSemantics;
		if (this.aSupportedSemantics.indexOf(oMetaData["semantics"]) !== -1) {
			sSemantics = oMetaData["semantics"];
		}
		return this.oSemanticsFormatterMap.get(sSemantics).call(self, oMetaData, originalFieldValue, precision);
	};
	return DecimalFormatter;
}, true /*global_export*/);
