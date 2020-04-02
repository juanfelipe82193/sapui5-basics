/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/demoapps/rta/freestyle/model/formatter"
], function(Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demoapps.rta.freestyle.controller.BaseController", {
		formatter: formatter, // make formatters available

		/**
		 * Convenience method for getting the view model by name (must not be called in onInit)
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Convenience method to get the global model containing the global state of the app.
		 * @returns {sap.ui.model.Model} the global Propery model
		 */
		getApplicationProperties: function() {
			return this.getOwnerComponent().getModel("appProperties");
		},

		/**
		 * Convenience method to get the controller of the whole app
		 * @returns {sap.ui.demoapps.rta.freestyle.controller.Application} the application controller
		 */
		getApplication: function() {
			return this.getApplicationProperties().getProperty("/applicationController");
		}
	});

});
