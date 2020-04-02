/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/* global jQuery, sap */
jQuery.sap.declare("sap.apf.ui.representations.utils.timeAxisDateConverter");
(function() {
	"use strict";
	sap.apf.ui.representations.utils.TimeAxisDateConverter = function() {
		this.oConversionDate = {};
		this.oDimensionInfo = {};
	};
	sap.apf.ui.representations.utils.TimeAxisDateConverter.prototype.constructor = sap.apf.ui.representations.utils.TimeAxisDateConverter;
	sap.apf.ui.representations.utils.TimeAxisDateConverter.prototype.bIsConversionToDateRequired = function(fieldName, oMetadata) {
		if (!this.oDimensionInfo || !this.oDimensionInfo[fieldName]) {
			return false;
		}
		if (this.oDimensionInfo[fieldName].conversionEvaluated) {
			return this.oDimensionInfo[fieldName].conversionRequired;
		}
		this.oDimensionInfo[fieldName].conversionEvaluated = true;
		if (this.oDimensionInfo[fieldName].dataType === "date" && oMetadata.getPropertyMetadata(fieldName).semantics === "yearmonthday") {
			this.oDimensionInfo[fieldName].conversionRequired = true;
			return true;
		}
		this.oDimensionInfo[fieldName].conversionRequired = false;
		return false;
	};
	sap.apf.ui.representations.utils.TimeAxisDateConverter.prototype.setConvertedDateLookUp = function(oConversionDate) {
		this.oConversionDate = oConversionDate;
	};
	sap.apf.ui.representations.utils.TimeAxisDateConverter.prototype.getConvertedDateLookUp = function() {
		return this.oConversionDate;
	};
	sap.apf.ui.representations.utils.TimeAxisDateConverter.prototype.createPropertyInfo = function(aProperties) {
		var oTimeAxisConvertorInstance = this;
		aProperties.forEach(function(oProperty) {
			oTimeAxisConvertorInstance.oDimensionInfo[oProperty.fieldName] = oProperty;
		});
	};
}());