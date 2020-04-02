/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the filterbar and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([], function() {
	"use strict";
	/**
	 * Delegate class for sap.ui.mdc.FilterBar.
	 * <b>Note:</b>
	 * The class is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.61.0
	 * @alias sap.ui.mdc.FilterBarDelegate
	 */
	var FilterBarDelegate = {

		/**
		 * Fetches the relevant metadata for a given payload and returns property info array.
		 * @param {object} oFilterBar - the instance of filter bar
		 * @returns {Promise} once resolved an array of property info is returned
		*/
		fetchProperties: function(oFilterBar) {
			return Promise.resolve([]);
		},



		/**
		 * Can be used to create and returns the column (with a template) for the specified property info name.
		 *
		 * @param {String} sPropertyName The name of the property info object/json
		 * @param {sap.ui.mdc.FilterBar} oFilterBar - the instance of filter bar
		 * @param {Object} mPropertyBag Instance of property bag from Flex change API
		 * @returns {Promise} Promise that resolves with true/false to allow/prevent default behavior of the change
		 * @public
		 */
		beforeAddFilterFlex: function(sPropertyName, oFilterBar, mPropertyBag) {
			return Promise.resolve(true);
		},

		/**
		 * Can be used to trigger any necessary follow-up steps on removal of filter items. The returned boolean value inside the Promise can be used to
		 * prevent default follow-up behaviour of Flex.
		 *
		 * @param {sap.ui.mdc.FilterField} oFilterField The mdc.FilterField that was removed
		 * @param {sap.ui.mdc.FilterBar} oFilterBar - the instance of filter bar
		 * @param {Object} mPropertyBag Instance of property bag from Flex change API
		 * @returns {Promise} Promise that resolves with true/false to allow/prevent default behavior of the change
		 * @public
		 */
		afterRemoveFilterFlex: function(oFilterField, oFilterBar, mPropertyBag) {
			// return true within the Promise for default behavior
			return Promise.resolve(true);
		}
	};
	return FilterBarDelegate;
});