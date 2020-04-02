/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global history */
sap.ui.define([
		"sap/ui/documentation/sdk/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("sap.ui.documentation.sdk.controller.Downloads", {

			/**
			 * Called when the controller is instantiated.
			 * @public
			 */
			onInit : function () {
				this.getRouter().getRoute("downloads").attachPatternMatched(this._onMatched, this);
			},

			/**
			 * Handles "downloads" routing
			 * @function
			 * @private
			 */
			_onMatched: function () {
				this.hideMasterSide();
			}
		});
	}
);