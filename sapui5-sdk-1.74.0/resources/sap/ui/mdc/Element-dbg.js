/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Element"
], function(CoreElement) {
	"use strict";

	/**
	 * The base class for MDC composite elements
	 *
	 * @experimental
	 * @private
	 * @since 1.74
	 * @alias sap.ui.mdc.Element
	 */
	var Element = CoreElement.extend("sap.ui.mdc.Element", {
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				/**
				 * The module path of the metadata DELEGATE
				 */
				delegate: {
					type: "object",
					group: "Data"
				}
			}
		},
		renderer: CoreElement.renderer
	});

	Element.prototype.setDelegate = function(oDelegate) {
		if (this.oDelegatePromise) {
			throw new Error("setDelegate function can only be called once");
		}
		this.oDelegatePromise = new Promise(function(resolve, reject) {
			sap.ui.require([
				oDelegate.name
			], function(Delegate) {
				this.DELEGATE = Delegate;
				resolve();
			}.bind(this), function() {
				reject("Module '" + oDelegate.name + "' not found control is not ready to use");
			});
		}.bind(this));

		return this.setProperty("delegate", oDelegate, true);
	};

	Element.prototype.exit = function() {
	};

	return Element;
});
