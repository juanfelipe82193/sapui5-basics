/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ---------------------------------------------------------------------------------------
// Helper class used to execute model specific logic in FieldBase
// ---------------------------------------------------------------------------------------

sap.ui.define([
	'sap/ui/mdc/field/FieldBaseDelegate',
	'sap/ui/mdc/util/BaseType'
], function(
		FieldBaseDelegate,
		BaseType
) {
	"use strict";

	/**
	 * Delegate class for sap.ui.mdc.base.FieldBase.<br>
	 * <h3><b>Note:</b></h3>
	 * The class is experimental and the API/behaviour is not finalized and hence this should not be used for productive usage.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.74.0
	 * @alias sap.ui.mdc.odata.v4.FieldBaseDelegate
	 */
	var ODataFieldBaseDelegate = Object.assign({}, FieldBaseDelegate);

	ODataFieldBaseDelegate.getDataTypeClass = function(oPayload, sType) {

		// V4 specific types
		var mEdmTypes = {
				"Edm.Date": "sap.ui.model.odata.type.Date", // V4 Date
				"Edm.TimeOfDay": "sap.ui.model.odata.type.TimeOfDay" // V4 constraints: {precision}
		};

		if (mEdmTypes[sType]) {
			sType = mEdmTypes[sType];
		} else {
			sType = FieldBaseDelegate.getDataTypeClass(oPayload, sType);
		}

		return sType;

	};

	ODataFieldBaseDelegate.getBaseType = function(oPayload, sType, oFormatOptions, oConstraints) {

		// TODO: enum
		switch (sType) {
		case "sap.ui.model.odata.type.Date":
			return BaseType.Date;

		case "sap.ui.model.odata.type.TimeOfDay":
			return BaseType.Time;

		case "sap.ui.model.odata.type.Unit":
		case "sap.ui.model.odata.type.Currency":
			if (!oFormatOptions || !oFormatOptions.hasOwnProperty("showMeasure") || oFormatOptions.showMeasure) {
				return BaseType.Unit;
			} else {
				return BaseType.Numeric;
			}
			break;

		default:
			return FieldBaseDelegate.getBaseType(oPayload, sType, oFormatOptions, oConstraints);

		}

	};


	ODataFieldBaseDelegate.initializeTypeFromBinding = function(oPayload, oType, vValue) {

		// V4 Unit and Currency types have a map with valid units and create an internal customizing for it.
		// The Field needs to keep this customizing logic when creating the internal type.
		// (As external RAW binding is used there is no formatting on parsing.)

		var oResult = {};
		if (oType && (oType.isA("sap.ui.model.odata.type.Unit") || oType.isA("sap.ui.model.odata.type.Currency"))
				&& Array.isArray(vValue) && vValue.length > 2 && vValue[2] !== undefined) {
			// format once to set internal customizing. Allow null as valid values for custom units
			oType.formatValue(vValue, "string");
			oResult.bTypeInitialized = true;
			oResult.mCustomUnits = vValue[2]; // TODO: find a better way to provide custom units to internal type
		}

		return oResult;

	};

	ODataFieldBaseDelegate.initializeInternalUnitType = function(oPayload, oType, oTypeInitialization) {

		if (oTypeInitialization && oTypeInitialization.mCustomUnits) {
			// if already initialized initialize new type too.
			oType.formatValue([null, null, oTypeInitialization.mCustomUnits], "string");
		}

	};

	ODataFieldBaseDelegate.isSearchSupported = function(oPayload, oListBinding) {

		return !!oListBinding.changeParameters;

	};

	ODataFieldBaseDelegate.executeSearch = function(oPayload, oListBinding, sSearch) {

		if (sSearch) {
			oListBinding.changeParameters({ $search: sSearch });
		} else {
			oListBinding.changeParameters({ $search: undefined });
		}

	};

	return ODataFieldBaseDelegate;
});