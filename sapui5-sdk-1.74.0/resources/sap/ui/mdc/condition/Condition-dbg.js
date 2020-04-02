/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
		'sap/base/Log'
	],
	function(
		Log
	) {
		"use strict";

		var Condition = function() {};

		/**
		 * creates a condition instance for the Item condition
		 *
		 * @param {string} sKey the operator for the condition
		 * @param {string} sDescription the description of the operator
		 * @param {object} oInParameters in-parameters of the condition
		 * @param {object} oOutParameters out-parameters of the condition
		 * @return {object} the new condition object with the given fieldPath, the operator EEQ and the sKey and sDescription as aValues.
		 * @public
		 */
		Condition.createItemCondition = function(sKey, sDescription, oInParameters, oOutParameters) {
			var aValues = [sKey, sDescription];
			if (sDescription === null || sDescription === undefined) {
				aValues.pop();
			}
			return this.createCondition("EEQ", aValues, oInParameters, oOutParameters);
		};

		/**
		 * creates a condition instance for the condition model
		 *
		 * @param {string} sOperator the operator for the condition
		 * @param {any[]} aValues the array of values for the condition
		 * @param {object} oInParameters in-parameters of the condition
		 * @param {object} oOutParameters out-parameters of the condition
		 * @return {object} the new condition object with the given fieldPath, operator and values.
		 * @public
		 */
		Condition.createCondition = function(sOperator, aValues, oInParameters, oOutParameters) {
			var oCondition = { operator: sOperator, values: aValues, isEmpty: null }; // use null as undefined is not recognized by filter
			if (oInParameters) {
				oCondition.inParameters = oInParameters;
			}
			if (oOutParameters) {
				oCondition.outParameters = oOutParameters;
			}
			return oCondition;
		};

		Condition._removeEmptyConditions = function(aConditions) {
			for (var i = aConditions.length - 1; i > -1; i--) {
				if (aConditions[i].isEmpty) {
					aConditions.splice(parseInt(i), 1);
				}
			}
			return aConditions;
		};

		/**
		 * Returns the index of a condition in an Array of conditions
		 *
		 * For EEQ conditions only the key part of the values is compared as the text part
		 * might be different (translation missing...)
		 *
		 * @param {object} oCondition condition to check
		 * @param {object[]} aConditions Array of conditions
		 * @return {int} index of the condition, -1 if not found
		 * @public
		 */
		Condition.indexOfCondition = function(oCondition, aConditions) {

			var iIndex = -1;

			// compare operator and value. in EEQ case, compare only key
			for (var i = 0; i < aConditions.length; i++) {
				if (this.compareConditions(oCondition, aConditions[i])) {
					iIndex = i;
					break;
				}
			}

			return iIndex;

		};

		/**
		 * Compares two conditions
		 *
		 * For EEQ conditions only the key part of the values is compared as the text part
		 * might be different (translation missing...)
		 *
		 * @param {object} oCondition1 condition to check
		 * @param {object} oCondition2 condition to check
		 * @return {boolean} true if conditions are equal
		 * @public
		 */
		Condition.compareConditions = function(oCondition1, oCondition2) {

			var bEqual = false;

			// compare operator and value. in EEQ case, compare only key
			if (oCondition1.operator === oCondition2.operator) {
				var sCheckValue1;
				var sCheckValue2;
				if (oCondition1.operator === "EEQ") {
					var oCheckValue1 = {value: oCondition1.values[0]};
					var oCheckValue2 = {value: oCondition2.values[0]};
					if (oCondition1.inParameters && oCondition2.inParameters) {
						// TODO: also compare in-parameters (but only of set on both)
						oCheckValue1.inParameters = oCondition1.inParameters;
						oCheckValue2.inParameters = oCondition2.inParameters;
					}
					if (oCondition1.outParameters && oCondition2.outParameters) {
						// TODO: also compare out-parameters (but only of set on both)
						oCheckValue1.outParameters = oCondition1.outParameters;
						oCheckValue2.outParameters = oCondition2.outParameters;
					}
					sCheckValue1 = JSON.stringify(oCheckValue1);
					sCheckValue2 = JSON.stringify(oCheckValue2);
				} else {
					sCheckValue1 = oCondition1.values.toString();
					sCheckValue2 = oCondition2.values.toString();
				}

				if (sCheckValue1 === sCheckValue2) {
					bEqual = true;
				}
			}

			return bEqual;

		};

		return Condition;
	}, /* bExport= */ true);
