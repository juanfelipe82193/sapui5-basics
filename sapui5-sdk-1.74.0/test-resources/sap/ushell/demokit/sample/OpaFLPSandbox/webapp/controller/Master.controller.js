sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ushell.sample.OpaFLPSandbox.controller.Master", {
		onSelectObject: function (oEvent) {
			this.getOwnerComponent().getRouter().navTo("object", {
				objectId:  oEvent.getSource().getBindingContext().getProperty("ObjectID")
			}, true);
		}
	});
});
