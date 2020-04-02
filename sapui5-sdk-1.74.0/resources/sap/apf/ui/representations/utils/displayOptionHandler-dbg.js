/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/* global jQuery, sap */
jQuery.sap.declare("sap.apf.ui.representations.utils.displayOptionHandler");
jQuery.sap.require("sap.apf.core.constants");
(function() {
	"use strict";
	sap.apf.ui.representations.utils.DisplayOptionHandler = function() {
	};
	function _checkIfMultipleUnitsExist(aDataResponse, sDisplayUnitName) {
		var nDataCount, bHasMultipleUnit = false;
		var sUnitValue = aDataResponse[0][sDisplayUnitName];
		for(nDataCount = 0; nDataCount < aDataResponse.length; nDataCount++) {
			if (sUnitValue !== aDataResponse[nDataCount][sDisplayUnitName]) {
				bHasMultipleUnit = true;
				break;
			}
		}
		return bHasMultipleUnit;
	}
	sap.apf.ui.representations.utils.DisplayOptionHandler.prototype.constructor = sap.apf.ui.representations.utils.DisplayOptionHandler;
	/**
	 * @param  oProperty - dimension/required filter property, 
	 * @param sLabelDisplayOption - key/text/keyAndText, 
	 * @param oMetadata - metadata 
	 * @description generates the column name based on display options for a given proeprty
	 * @returns sColumnName - generated column name
	**/
	sap.apf.ui.representations.utils.DisplayOptionHandler.prototype.getColumnNameBasedOnDisplayOption = function(sProperty, sLabelDisplayOption, oMetadata) {
		var sColumnName;
		var sPropertyFieldName = sProperty;
		if (sLabelDisplayOption === undefined) {
			sColumnName = sPropertyFieldName;
		}
		if (sLabelDisplayOption === sap.apf.core.constants.representationMetadata.labelDisplayOptions.TEXT) {
			sColumnName = oMetadata.getPropertyMetadata(sPropertyFieldName).text;
		}
		if (sLabelDisplayOption === sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY) {
			sColumnName = "formatted_" + sPropertyFieldName;
		}
		if (sLabelDisplayOption === sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY_AND_TEXT) {
			sColumnName = sPropertyFieldName + "_" + oMetadata.getPropertyMetadata(sPropertyFieldName).text;
		}
		return sColumnName;
	};
	/**
	 * @param oMeasure - measure value,
	 * @param oMetadata - metadata
	 * @param aDataResponse - the data response of a representation
	 * @param oApi -
	 * @description generates the display name by appending available unit for a given measure
	 * @returns sDisplayName - generated display name
	**/
	sap.apf.ui.representations.utils.DisplayOptionHandler.prototype.getDisplayNameForMeasure = function(oMeasure, oMetadata, aDataResponse, oApi) {
		var oMeasureMetadata = oMetadata.getPropertyMetadata(oMeasure.fieldName);
		var sDisplayName = oMeasureMetadata.label ? oMeasureMetadata.label : oMeasureMetadata.name;
		var sDisplayUnitName = oMetadata.getPropertyMetadata(oMeasureMetadata.name).unit;
		var sDisplayUnitValue = aDataResponse[0] ? aDataResponse[0][sDisplayUnitName] : undefined;
		if (oMeasure.fieldDesc) {
			sDisplayName = oApi.getTextNotHtmlEncoded(oMeasure.fieldDesc);
		}
		if (sDisplayUnitName && sDisplayUnitValue && !_checkIfMultipleUnitsExist(aDataResponse, sDisplayUnitName)) {
			sDisplayName = oApi.getTextNotHtmlEncoded("displayUnit", [ sDisplayName, sDisplayUnitValue ]);
		}
		return sDisplayName;
	};
	sap.apf.ui.representations.utils.DisplayOptionHandler.prototype.getDisplayNameForDimension = function(oDimension, oMetadata, oApi) {
		var oDimensionMetadata = oMetadata.getPropertyMetadata(oDimension.fieldName);
		var sDisplayName = oDimensionMetadata.label ? oDimensionMetadata.label : oDimensionMetadata.name;
		if (oDimension.fieldDesc) {
			sDisplayName = oApi.getTextNotHtmlEncoded(oDimension.fieldDesc);
		}
		return sDisplayName;
	};
}());