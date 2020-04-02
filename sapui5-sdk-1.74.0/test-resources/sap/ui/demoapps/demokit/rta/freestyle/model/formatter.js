sap.ui.define([
	"sap/ui/core/ValueState"
], function(ValueState) {
	"use strict";

	var bDemokitAvailable;

	function getDemokitPath(sFileName) {
		if (bDemokitAvailable === false) {
			return bDemokitAvailable;
		}

		var sFilePath = jQuery.sap.getModulePath('sap.ui.documentation').replace('resources', 'test-resources') + '/sdk/images/' + sFileName;

		if (typeof bDemokitAvailable !== "boolean") {
			bDemokitAvailable = [200, 301, 302, 304].indexOf(jQuery.ajax({
				async: false,
				url: sFilePath
			}).status) !== -1;
		}

		return bDemokitAvailable && sFilePath;
	}

	return {
		/**
		 * Formatter for the title of the master list. iCount is the number of entries. It is negative when the number has not yet been determined.
		 *
		 * @param {Integer} iCount
		 * @returns {String}
		 */
		listTitle: function(iCount) {
			var oBundle = this.getResourceBundle();
			return (iCount < 0) ? oBundle.getText("xtit.products") : oBundle.getText("xtit.productMasterProducts", [iCount]);
		},

		/**
		 * Formatter for retrieving corresponding status codes for availability statuses.
		 * @param {Integer} iAvailabilityCode
		 * @returns {String}
		 */
		formatAvailabilityStatusFromCode: function(iAvailabilityCode) {
			switch (iAvailabilityCode) {
				case 1:
					return ValueState.Error;
				case 2:
					return ValueState.Warning;
				case 3:
					return ValueState.Success;
				default:
					return ValueState.None;
			}
		},

		/**
		 * Formatter for retrieving custom availability text.
		 *
		 * @param {String} sAvailabilityText - default availability text for the model
		 * @param {Integer} iAvailabilityCode - availability code (1 - out of stock, 2 - less than 10, 3 - in stock)
		 * @param {Integer} iAvailability - amount of items left in stock
		 * @returns {string}
		 */
		formatAvailabilityTextFromCode: function(sAvailabilityText, iAvailabilityCode, iAvailability) {
			if (iAvailabilityCode == 2 && iAvailability > 0) {
				return this.getResourceBundle().getText("xfld.inStockLeft", [iAvailability]);
			}
			return sAvailabilityText || "";
		},

		/**
		 * Formatter for images uri - return absolute uri related to the current entry point directory path.
		 *
		 * @param {String} sFileName
		 * @returns {string}
		 */
		formatImageUrl: function (sFileName) {
			return sFileName
				? getDemokitPath(sFileName) || jQuery.sap.getModulePath("sap.ui.demoapps.rta.freestyle.localService.img") + '/' + sFileName
				: null;
		},

		/**
		 * Formatter for Measures - Returns concatenated string with Measure and Unit
		 *
		 * @param {float}
		 *            fMeasure A measure
		 * @param {string}
		 *            sUnit A unit
		 * @returns {string} A combined textual representation of measure and unit
		 * @public
		 */
		formatMeasure: function(fMeasure, sUnit) {
			if (!fMeasure || !sUnit) {
				return "";
			}
			return this.getResourceBundle().getText("xfld.formatMeasure", [fMeasure, sUnit]);
		}
	};
});
