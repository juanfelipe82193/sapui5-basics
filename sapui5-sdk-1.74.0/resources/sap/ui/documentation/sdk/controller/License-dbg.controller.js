/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global location */
sap.ui.define([
		"sap/ui/documentation/sdk/controller/BaseController",
		"sap/ui/documentation/library"
	], function (BaseController, library) {
		"use strict";

		return BaseController.extend("sap.ui.documentation.sdk.controller.License", {

			onInit: function () {
				this.getRouter().getRoute("license").attachPatternMatched(this._onTopicMatched, this);
			},

			_onTopicMatched: function (oEvent) {
				// Get the LICENSE.txt file and display it. In case of error redirect to NotFound view.
				library._getLicense()
					.done(function (sLicense) {
						if (sLicense !== "") {
							this.getView().byId("licenseText").setText(sLicense);
						} else {
							this.getRouter().myNavToWithoutHash("sap.ui.documentation.sdk.view.NotFound", "XML", false);
						}
					}.bind(this))
					.fail(function () {
						this.getRouter().myNavToWithoutHash("sap.ui.documentation.sdk.view.NotFound", "XML", false);
					}.bind(this));
			}
		});

	}
);