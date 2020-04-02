/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/ui/base/Object"], function(BaseObject) {
	"use strict";

	/**
	 * @class
	 * An object that provides error handling information during runtime.
	 * @extends sap.ui.base.Object
	 * @constructor
	 * @public
	 * @alias sap.fe.navigation.NavError
	 * @param {string} sErrorCode The code for an internal error of a consumer that allows you to track the source locations
	 */
	var NavError = BaseObject.extend("sap.fe.navigation.NavError" /** @lends sap.fe.navigation.NavError */, {
		metadata: {
			publicMethods: [
				// getter methods of properties
				"getErrorCode"
			],
			properties: {},
			library: "sap.fe"
		},

		constructor: function(sErrorCode) {
			BaseObject.apply(this);

			this._sErrorCode = sErrorCode;
		}
	});

	/**
	 * Returns the error code with which the instance has been created.
	 * @public
	 * @returns {string} The error code of the error
	 *
	 */
	NavError.prototype.getErrorCode = function() {
		return this._sErrorCode;
	};

	// final step for library
	return NavError;
});
