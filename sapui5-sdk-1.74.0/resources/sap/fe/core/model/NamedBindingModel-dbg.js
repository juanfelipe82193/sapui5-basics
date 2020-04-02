/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

sap.ui.define(
	[],
	function() {
		"use strict";

		/**
		 * Register a named Binding
		 * @param {sap.ui.model.Binding} oBinding binding instance that should be registered in the model
		 * @private
		 */
		function registerNamedBinding(oBinding) {
			this.mNamedBindings = this.mNamedBindings || {};
			if (!this.mNamedBindings[oBinding.sId]) {
				this.mNamedBindings[oBinding.sId] = oBinding;
			} else if (this.mNamedBindings[oBinding.sId].promise) {
				/* In case a refrence binding was defined first we replace it with the real binding */
				var fnResolve = this.mNamedBindings[oBinding.sId].resolve;
				this.mNamedBindings[oBinding.sId] = oBinding;
				fnResolve(oBinding);
			} else {
				throw new Error("Duplicate ID for named binding: " + oBinding.sId);
			}
		}

		/**
		 * Unregister a named Binding
		 * @param {sap.ui.model.Binding} oBinding binding instance that should be unregistered in the model
		 * @private
		 */
		function unregisterNamedBinding(oBinding) {
			if (this.mNamedBindings && this.mNamedBindings[oBinding.sId]) {
				delete this.mNamedBindings[oBinding.sId];
			}
		}

		/**
		 * Access a named binding
		 * @param {String} sReferenceId ID of a named binding
		 * @returns {Promise.<sap.ui.model.Binding>} Resolve function returns the binding instance
		 * @private
		 * @sap-restricted
		 * @static
		 */
		function getBindingForReference(sReferenceId) {
			this.mNamedBindings = this.mNamedBindings || {};
			if (typeof this.mNamedBindings[sReferenceId] === "undefined") {
				var fnResolve,
					promise = new Promise(function(resolve, reject) {
						fnResolve = resolve;
					});
				this.mNamedBindings[sReferenceId] = {
					promise: promise,
					resolve: fnResolve
				};
				return promise;
			} else if (this.mNamedBindings[sReferenceId].promise) {
				return this.mNamedBindings[sReferenceId].promise;
			} else {
				return Promise.resolve(this.mNamedBindings[sReferenceId]);
			}
		}

		/**
		 * Manage named list bindings
		 *
		 * @function
		 * @name sap.fe.core.model.NamedBindingModel#upgrade
		 * @param {sap.ui.model.odata.v4.ODataModel} oModel OData v4 model instance
		 * @return {Promise} Promise that resolves when the model has been upgraded
		 * @private
		 * @sap-restricted
		 * @static
		 */
		function upgrade(oModel) {
			if (oModel.isNamedBindingModel === undefined) {
				var fnOriginal = {};

				oModel.registerNamedBinding = registerNamedBinding.bind(oModel);
				oModel.unregisterNamedBinding = unregisterNamedBinding.bind(oModel);
				oModel.getBindingForReference = getBindingForReference.bind(oModel);

				/* Overwrite bindList */
				fnOriginal.bindList = oModel.bindList;
				oModel.bindList = function(sPath, oContext, vSorters, vFilters, mParameters) {
					var sNamedBindingId = mParameters && mParameters.id,
						oListBinding;
					//delete the id from mParameters to avoid it being forwarded to the URL
					if (mParameters) {
						delete mParameters.id;
					}
					oListBinding = fnOriginal.bindList.apply(this, arguments);
					if (sNamedBindingId) {
						oListBinding.sId = sNamedBindingId;
						this.registerNamedBinding(oListBinding);
					}
					return oListBinding;
				};

				/* Overwrite bindingDestroyed */
				fnOriginal.bindingDestroyed = oModel.bindingDestroyed;
				oModel.bindingDestroyed = function(oBinding) {
					this.unregisterNamedBinding(oBinding);
					fnOriginal.bindingDestroyed.apply(this, arguments);
				};

				oModel.isNamedBindingModel = true;
			}
			return Promise.resolve();
		}
		/**
		 * @classdesc
		 * Static Model transformation for {@link sap.ui.model.odata.v4.ODataModel}
		 * to allow using named bindings
		 *
		 * @see {@link sap.ui.model.odata.v4.ODataModel}
		 * @namespace
		 * @alias sap.fe.core.model.NamedBindingModel
		 * @private
		 * @sap-restricted
		 * @experimental This module is only for experimental use! <br/><b>This is only a POC and maybe deleted</b>
		 * @since 1.49.0
		 */
		var NamedBindingModel = {
			upgrade: upgrade
		};

		return NamedBindingModel;
	},
	/* bExport= */ true
);
