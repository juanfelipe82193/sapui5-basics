/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ---------------------------------------------------------------------------------------
// Helper class used to execute model specific logic in FieldBase
// ---------------------------------------------------------------------------------------

sap.ui.define([
	'sap/ui/mdc/util/BaseType'
], function(
	BaseType
) {
	"use strict";
	/**
	 * Delegate class for sap.ui.mdc.base.FieldBase.<br>
	 * <b>Note:</b> The class is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.72.0
	 * @alias sap.ui.mdc.field.FieldBaseDelegate
	 */
	var FieldBaseDelegate = {

			/**
			 * Maps the Edm type names to real type names
			 *
			 * If already a real type is given it is just returned;
			 *
			 * @param {object} oPayload payload for delegate
			 * @param {string} sType given type
			 * @returns {string} data type name
			 */
			getDataTypeClass: function(oPayload, sType) {

				// only not V4 specific types
				var mEdmTypes = {
						"Edm.Boolean": "sap.ui.model.odata.type.Boolean",
						"Edm.Byte": "sap.ui.model.odata.type.Byte",
						"Edm.DateTime": "sap.ui.model.odata.type.DateTime", // only for V2  constraints: {displayFormat: 'Date' }
						"Edm.DateTimeOffset": "sap.ui.model.odata.type.DateTimeOffset", //constraints: { V4: true, precision: n }
						"Edm.Decimal": "sap.ui.model.odata.type.Decimal", //constraints: { precision, scale, minimum, maximum, minimumExclusive, maximumExclusive}
						"Edm.Double": "sap.ui.model.odata.type.Double",
						"Edm.Float": "sap.ui.model.odata.type.Single",
						"Edm.Guid": "sap.ui.model.odata.type.Guid",
						"Edm.Int16": "sap.ui.model.odata.type.Int16",
						"Edm.Int32": "sap.ui.model.odata.type.Int32",
						"Edm.Int64": "sap.ui.model.odata.type.Int64",
						//Edm.Raw not supported
						"Edm.SByte": "sap.ui.model.odata.type.SByte",
						"Edm.Single": "sap.ui.model.odata.type.Single",
						"Edm.String": "sap.ui.model.odata.type.String", //constraints: {maxLength, isDigitSequence}
						"Edm.Time": "sap.ui.model.odata.type.Time" // only V2
				};

				if (mEdmTypes[sType]) {
					sType = mEdmTypes[sType];
				}

				return sType;

			},

			/**
			 * To know what control is rendered the Field needs to know if the type
			 * represents a date, a number or something else in a normalized way.
			 *
			 * As default "string" is returned.
			 *
			 * @param {object} oPayload payload for delegate
			 * @param {string} sType given type
			 * @param {object} oFormatOptions used FormatOptions
			 * @param {object} oConstraints used Constraints
			 * @returns {sap.ui.mdc.condition.BaseType} output "Date", "DateTime" or "Time"...
			 */
			getBaseType: function(oPayload, sType, oFormatOptions, oConstraints) {

				switch (sType) {
				case "sap.ui.model.type.Date":
					return BaseType.Date;

				case "sap.ui.model.odata.type.DateTime":
					if (oConstraints && (oConstraints.displayFormat === "Date" || oConstraints.isDateOnly)) {
						return BaseType.Date;
					} else {
						return BaseType.DateTime;
					}
					break;

				case "sap.ui.model.type.DateTime":
				case "sap.ui.model.odata.type.DateTimeOffset":
					return BaseType.DateTime;

				case "sap.ui.model.type.Time":
				case "sap.ui.model.odata.type.Time":
					return BaseType.Time;

				case "sap.ui.model.type.Boolean":
				case "sap.ui.model.odata.type.Boolean":
				case "sap.ui.mdc.base.type.Boolean":
					return BaseType.Boolean;

				case "sap.ui.model.type.Unit":
				case "sap.ui.model.type.Currency":
					if (!oFormatOptions || !oFormatOptions.hasOwnProperty("showMeasure") || oFormatOptions.showMeasure) {
						return BaseType.Unit;
					} else {
						return BaseType.Numeric;
					}
					break;

				case "sap.ui.model.type.Integer":
				case "sap.ui.model.type.Float":
				case "sap.ui.model.odata.type.Decimal":
				case "sap.ui.model.odata.type.Int16":
				case "sap.ui.model.odata.type.Int32":
				case "sap.ui.model.odata.type.Int64":
				case "sap.ui.model.odata.type.Single":
				case "sap.ui.model.odata.type.Double":
					return BaseType.Numeric;

				default:
					return BaseType.String;

				}

			},

			/**
			 * In Field case the used data type might come from the binding.
			 * In V4-unit or currency case it might need to be formatted once.
			 * For later initializing the internal type the currencies must be returned.
			 *
			 * @param {object} oPayload payload for delegate
			 * @param {object} oType type from binding
			 * @param {any} vValue given value
			 * @returns {object} infos needed to initialize internal type (needs to set bTypeInitialized to true if initialized)
			 */
			initializeTypeFromBinding: function(oPayload, oType, vValue) {

				return {};

			},

			/**
			 * In Field case the used data type might come from the binding.
			 * In V4-unit or currency case it might need to be formatted once.
			 * This function initializes the unit type.
			 *
			 * @param {object} oPayload payload for delegate
			 * @param {object} oType type from binding
			 * @param {object} oTypeInitialization infos needed to initialize internal type
			 */
			initializeInternalUnitType: function(oPayload, oType, oTypeInitialization) {

			},

			/**
			 * Checks if a ListBinding supports $Search.
			 *
			 * @param {object} oPayload payload for delegate
			 * @param {sap.ui.model.ListBinding} oListBinding ListBinding
			 * @return {boolean} true if $search is supported
			 * @since 1.73.0
			 */
			isSearchSupported: function(oPayload, oListBinding) {

				return false; // only on V4

			},

			/**
			 * Checks if a ListBinding supports $Search.
			 *
			 * @param {object} oPayload payload for delegate
			 * @param {sap.ui.model.ListBinding} oListBinding ListBinding
			 * @param {string} sSearch search string
			 * @since 1.73.0
			 */
			executeSearch: function(oPayload, oListBinding, sSearch) {

				// only on V4

			}

	};
	return FieldBaseDelegate;
});