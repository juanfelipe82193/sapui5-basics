/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/ui/core/format/DateFormat'
], function(DateFormat) {
	"use strict";

	var DateTimeFormatter = function() {
		this.oDisplayFormatterMap = _getMapForDisplayFormat();
	};
	DateTimeFormatter.prototype.constructor = DateTimeFormatter;
	function _getMapForDisplayFormat() {
		var displayFormatterMap = new Map();
		displayFormatterMap.set("Date", _getDisplayDate);
		displayFormatterMap.set(undefined, _returnOriginalValue);
		return displayFormatterMap;
	}
	function _getDisplayDate(originalFieldValue) {
		var dateFormatter = DateFormat.getDateInstance({ style : "short" });
		var dateFormat = dateFormatter.format(originalFieldValue, true);
		return dateFormat;
	}
	function _returnOriginalValue(originalFieldValue) {
		return originalFieldValue;
	}
	DateTimeFormatter.prototype.getFormattedValue = function(oMetadata, originalFieldValue) {
		var displayFormat = oMetadata["sap:display-format"] !== undefined ? oMetadata["sap:display-format"] : undefined;
		var dateValue = new Date(originalFieldValue);
		if (dateValue.toLocaleString() === "Invalid Date") {
			return "-";
		}
		var formattedDateValue = this.oDisplayFormatterMap.get(displayFormat) !== undefined ? this.oDisplayFormatterMap.get(displayFormat).call(this, dateValue) : dateValue;
		//if null or not instance of date then CVOM has to handle.Requested to CVOM already
		return formattedDateValue;
	};
	return DateTimeFormatter;
}, true /*global_export*/);
