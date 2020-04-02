sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/base/strings/formatMessage"
], function (Controller, MessageToast, formatMessage) {
	"use strict";

	return Controller.extend("sap.suite.ui.commons.demokit.tutorial.icecream.11.controller.ProcessFlow", {
		formatMessage: formatMessage,

		onNavButtonPressed: function () {
			this.getOwnerComponent().getRouter().navTo("home");
		},

		getValuesDelta: function (fFirstValue, fSecondValue) {
			return fSecondValue - fFirstValue;
		},

		onNodePressed: function (oEvent) {
			var sItemTitle = oEvent.getParameters().getTitle();
			MessageToast.show(this.getResourceBundle().getText("processFlowNodeClickedMessage", [sItemTitle]));
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		}
	});
});
