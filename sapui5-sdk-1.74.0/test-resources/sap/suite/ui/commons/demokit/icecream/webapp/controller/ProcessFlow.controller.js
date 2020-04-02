sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.demo.tutorial.controller.ProcessFlow", {

		onNavButtonPressed: function() {
			this.getOwnerComponent().getRouter().navTo("home");
		},

		/**
		 * Handles the press event on a process flow node.
		 *
		 * @param {sap.ui.base.Event} oEvent The press event object
		 */
		onNodePressed: function(oEvent) {
			var sItemTitle = oEvent.getParameters().getTitle();
			MessageToast.show(this.getResourceBundle().getText("processFlowNodeClickedMessage", [sItemTitle]));
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Calculates difference between expected and actual values
		 * @param {float} fFirstValue Expected value
		 * @param {float} fSecondValue Actual value
		 * @returns {number} Textual representation of delta between two given values with specifier measurement unit
		 */
		getValuesDelta: function(fFirstValue, fSecondValue) {
			return fSecondValue - fFirstValue;
		}
	});
});
