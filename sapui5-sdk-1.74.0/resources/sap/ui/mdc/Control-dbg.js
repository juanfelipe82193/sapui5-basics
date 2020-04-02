/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Control"
], function(Control) {
	"use strict";

	/**
	 * The base class for MDC composite controls
	 *
	 * @experimental
	 * @private
	 * @since 1.61
	 * @alias sap.ui.mdc.Control
	 */
	var Control = Control.extend("sap.ui.mdc.Control", {
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				/**
				 * The width
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: "100%",
					invalidate: true
				},
				/**
				 * The height
				 */
				height: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: "100%",
					invalidate: true
				},
				/**
				 * The module path of the metadata DELEGATE
				 */
				delegate: {
					type: "object",
					group: "Data"
				},
				/**
				 * The personalization
				 */
				personalization: {
					type: "any",
					multiple: false
				}
			}
		},
		renderer: Control.renderer
	});

	Control.prototype.setDelegate = function(oDelegate) {
		this.oDelegatePromise = new Promise(function(resolve, reject) {
			sap.ui.require([
				oDelegate.name
			], function(Delegate) {
				this.DELEGATE = Delegate;
				resolve(Delegate);
			}.bind(this), function() {
				reject("Module not found control is not ready to use");
			});
		}.bind(this));

		return this.setProperty("delegate", oDelegate, true);
	};

	Control.prototype.exit = function() {
	};

	return Control;
});
