/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/model/odata/type/String",
	"sap/ui/model/ValidateException"
], function (String, ValidateException) {
	"use strict";

	var StringExtended = String.extend("custom.type.StringExtended");

	/**
	 * Validates whether the given value in model representation is valid and meets the
	 * defined constraints.
	 *
	 * @param {string} sValue
	 *   the value to be validated
	 * @throws {sap.ui.model.ValidateException} if the value is not valid
	 * @public
	 */
	StringExtended.prototype.validateValue = function (sValue) {
		String.prototype.validateValue.call(this, sValue);
		if (sValue.trim().length === 0) {
			// The custom error message should be handled by the application developer
			throw new ValidateException("Enter a valid value and not only spaces.");
		}
	};

	/**
	 * Returns the type's name.
	 *
	 * @returns {string}
	 *   the type's name
	 * @public
	 */
	StringExtended.prototype.getName = function () {
		return "custom.type.StringExtended";
	};

	return StringExtended;
});