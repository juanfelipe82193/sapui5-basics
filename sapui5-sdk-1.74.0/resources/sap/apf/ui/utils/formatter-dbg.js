/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2018 SAP SE. All rights reserved
*/

sap.ui.define([
	'sap/apf/ui/utils/stringToDateFormatter',
	'sap/apf/ui/utils/dateTimeFormatter',
	'sap/apf/ui/utils/timeFormatter',
	'sap/apf/ui/utils/decimalFormatter'
], function(StringToDateFormatter, DateTimeFormatter, TimeFormatter, DecimalFormatter) {
	"use strict";

	var formatter = function(oFormatterArgs, metadata, dataResponse) {
		this.metadata = metadata;
		this.dataResponse = dataResponse;
		this.oFormatterArgs = oFormatterArgs;
		this.oDataTypeFormatterMap = _dataTypeFormatterMap();
	};
	formatter.prototype.constructor = formatter;
	function _dataTypeFormatterMap() {
		var datatypeFormatterMap = new Map();
		datatypeFormatterMap.set("Edm.String", _typeStringFormatter);
		datatypeFormatterMap.set("Edm.DateTime", _typeDateTimeFormatter);
		datatypeFormatterMap.set("Edm.Time", _typeTimeFormatter);
		datatypeFormatterMap.set("Edm.Decimal", _typeDecimalFormatter);
		return datatypeFormatterMap;
	}
	function _typeStringFormatter(oMetadata, originalFieldValue) {
		var stringToDateFormatterClass = new StringToDateFormatter();
		return stringToDateFormatterClass.getFormattedValue(oMetadata, originalFieldValue, this.oFormatterArgs);
	}
	function _typeDateTimeFormatter(oMetadata, originalFieldValue) {
		var dateTimeFormatterClass = new DateTimeFormatter();
		return dateTimeFormatterClass.getFormattedValue(oMetadata, originalFieldValue);
	}
	function _typeTimeFormatter(oMetadata, originalFieldValue) {
		var timeFormatterClass = new TimeFormatter();
		return timeFormatterClass.getFormattedValue(oMetadata, originalFieldValue);
	}
	function _typeDecimalFormatter(oMetadata, originalFieldValue) {
		var typeDecimalFormatterClass = new DecimalFormatter();
		var oMetaData = oMetadata.unit !== undefined ? _getPropertyMetadata(this, oMetadata.unit) : oMetadata;
		var precision = 0;
		if (oMetadata !== undefined && this.dataResponse !== undefined && this.dataResponse[0] !== undefined) {
			precision = isNaN(oMetadata.scale) ? this.dataResponse[0][oMetadata.scale] : oMetadata.scale;
		}
		return typeDecimalFormatterClass.getFormattedValue(oMetaData, originalFieldValue, precision);
	}
	function _getPropertyMetadata(formatter, fieldName) {
		if (formatter.metadata && formatter.metadata.getPropertyMetadata) {
			return formatter.metadata.getPropertyMetadata(fieldName);
		}
		return formatter.metadata;
	}
	/**
	 * formats the originalFieldValue according to its metadata. Always returns a string or if no formatting applied
	 * the original value
	 * @param {string} fieldName name of the property
	 * @param {any} originalFieldValue
	 * @returns {any} convertedValue
	 */
	formatter.prototype.getFormattedValue = function(fieldName, originalFieldValue) {
		if (originalFieldValue === null) {
			return "null";
		}
		var formattedFieldValue;
		var oMetadata = _getPropertyMetadata(this, fieldName);
		var oDataType = oMetadata.dataType !== undefined ? oMetadata.dataType.type : undefined;
		if (oDataType === undefined) {
			oDataType = oMetadata.type;
		}
		if (this.oDataTypeFormatterMap.has(oDataType)) {
			formattedFieldValue = this.oDataTypeFormatterMap.get(oDataType).call(this, oMetadata, originalFieldValue);
		} else {
			formattedFieldValue = originalFieldValue;
		}
		var metadataObject = jQuery.extend(true, {}, oMetadata);
		formattedFieldValue = _applyCustomFormatting(metadataObject, fieldName, originalFieldValue, formattedFieldValue, this.oFormatterArgs);
		return formattedFieldValue;
	};
	/**
	 * formats the originalFieldValue according to its metadata. Always returns always as string
	 * the original value
	 * @param {string} fieldName name of the property
	 * @param {any} originalFieldValue
	 * @returns {string} convertedValue
	 */
	formatter.prototype.getFormattedValueAsString = function(fieldName, originalFieldValue) {
		return this.getFormattedValue(fieldName, originalFieldValue) + "";
	};
	formatter.prototype.getFormatStringTooltip = function(measure) {
		return this.getFormatString(measure);
	};
	formatter.prototype.getFormatString = function(measure) {
		var self = this;
		var formatterInstance = sap.viz.ui5.format.ChartFormatter.getInstance();
		sap.viz.ui5.api.env.Format.numericFormatter(formatterInstance);
		var fieldName = measure.fieldName;
		formatterInstance.registerCustomFormatter("measureFormatter", function(value) {
			// check with CVOM Team if not supported value
			var formattedMeasureValue = "-";
			if (value !== null) {
				formattedMeasureValue = self.getFormattedValue(fieldName, value);
			}
			return formattedMeasureValue;
		});
		var sFormatString = "measureFormatter";
		return sFormatString;
	};
	/**
	 * @method getFormattedValueForTextProperty
	 * @param {oTextToBeFormatted} -
	 *            the texts which has to be concatenated oTextToBeFormatted ={
	 *            text:textField, key:fieldName }
	 * @description returns the concatenated string (e.g. Customer Name(Customer
	 *              Id) for a text field
	 */
	formatter.prototype.getFormattedValueForTextProperty = function(fieldName, oTextToBeFormatted) {
		var sFormattedText;
		if (oTextToBeFormatted.key) {
			sFormattedText = oTextToBeFormatted.text + " (" + oTextToBeFormatted.key + ")";
		} else {
			sFormattedText = oTextToBeFormatted.text;
		}
		var metadataObject = jQuery.extend(true, {}, _getPropertyMetadata(this, fieldName));
		sFormattedText = _applyCustomFormatting(metadataObject, fieldName, oTextToBeFormatted.text, sFormattedText, this.oFormatterArgs);
		return sFormattedText;
	};
	/**
	 * @private
	 * @method _applyCustomFormatting
	 * @description calls the application specific formatting if it is available
	 */
	function _applyCustomFormatting(metadataObject, fieldName, originalFieldValue, formattedFieldValue, oFormatterArgs) {
		var appFormattedFieldValue;
		var customFormatAvailable = oFormatterArgs.getExits !== undefined ? oFormatterArgs.getExits.customFormat : undefined;
		if (customFormatAvailable === undefined) {
			return formattedFieldValue;
		}
		appFormattedFieldValue = oFormatterArgs.getExits.customFormat.apply(oFormatterArgs, [ metadataObject, fieldName, originalFieldValue, formattedFieldValue ]);
		formattedFieldValue = appFormattedFieldValue !== undefined ? appFormattedFieldValue : formattedFieldValue;
		return formattedFieldValue;
	}
	return formatter;
}, true /*global_export*/);
