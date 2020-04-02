/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ------------------------------------------------------------------------------------------
// Utility class used for condition equaly validation
// ------------------------------------------------------------------------------------------
sap.ui.define(['sap/base/util/deepEqual', 'sap/base/util/merge'], function(deepEqual, merge) {
	"use strict";

	/**
	 * Utility class used by smart controls for creating stable ids
	 *
	 * @private
	 * @experimental This module is only for internal/experimental use!
	 */
	var ConditionUtil = {


		/**
		 * Comparing two conditions for equality.
		 *
		 * @param {sap.ui.mdc.FilterField} oFilterField - instance of the FilterField
		 * @param {object} oCondition1
		 * @param {object} oCondition2
		 * @returns {boolean} are the two condition equal ?
		 *
		 */
		compareConditions: function(oFilterField, oCondition1, oCondition2) {
			return deepEqual(oCondition1, oCondition2);
		},

		toExternal: function(oCondition, sType, oFormatOptions, oConstraints) {
			var oConditionConv = merge({}, oCondition);

			var sValue0 = oCondition.values[0], sValue1;

			if (oCondition.operator === "BT") {
				sValue1 = oCondition.values[1];
			}

			switch (sType) {
				case "Edm.Date":
				case "sap.ui.model.type.Date":
				case "sap.ui.model.odata.type.Date":
				case "Edm.DateTime":
				case "sap.ui.model.odata.type.DateTime":
				case "Edm.TimeOfDay":
				case "sap.ui.model.type.Time":
				case "sap.ui.model.odata.type.TimeOfDay":
					if (sValue0 && sValue0 instanceof Date) {
						sValue0 = sValue0.toJSON();
						if (sValue0.indexOf('Z') === (sValue0.length - 1)) {
							sValue0 = sValue0.substr(0, sValue0.length - 1);
						}
					}
					if (sValue1 && sValue1 instanceof Date) {
						sValue1 = sValue1.toJSON();
						if (sValue1.indexOf('Z') === (sValue1.length - 1)) {
							sValue1 = sValue1.substr(0, sValue1.length - 1);
						}
					}
					break;

				case "Edm.DateTimeOffset":
				case "sap.ui.model.type.DateTime":
				case "sap.ui.model.odata.type.DateTimeOffset":
					if (sValue0 && sValue0 instanceof Date) {
						sValue0 = sValue0.toJSON();
					}
					if (sValue1 && sValue1 instanceof Date) {
						sValue1 = sValue1.toJSON();
					}
					break;

				default:
					break;
			}

			oConditionConv.values[0] = sValue0;
			if (sValue1) {
				oConditionConv.values[1] = sValue1;
			}

			return oConditionConv;
		},

		toInternal: function(oCondition, sType, oFormatOptions, oConstraints) {
			var oConditionConv = merge({}, oCondition);

			var sValue0 = oCondition.values[0], sValue1;

			if (oCondition.operator === "BT") {
				sValue1 = oCondition.values[1];
			}

			switch (sType) {
				case "Edm.Date":
				case "sap.ui.model.type.Date":
				case "sap.ui.model.odata.type.Date":
				case "Edm.DateTime":
				case "sap.ui.model.odata.type.DateTime":
				case "Edm.TimeOfDay":
				case "sap.ui.model.type.Time":
				case "sap.ui.model.odata.type.TimeOfDay":
				case "Edm.DateTimeOffset":
				case "sap.ui.model.type.DateTime":
				case "sap.ui.model.odata.type.DateTimeOffset":
					if (sValue0) {
						sValue0 = new Date(sValue0);
					}
					if (sValue1) {
						sValue0 = new Date(sValue0);
					}
					break;

				default:
					break;
			}

			oConditionConv.values[0] = sValue0;
			if (sValue1) {
				oConditionConv.values[1] = sValue1;
			}

			return oConditionConv;
		}
	};
	return ConditionUtil;
}, /* bExport= */true);