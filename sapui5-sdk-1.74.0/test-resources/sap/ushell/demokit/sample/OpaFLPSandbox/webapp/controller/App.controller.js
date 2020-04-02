sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ushell.sample.OpaFLPSandbox.controller.App", {
		onInit: function () {
			var oViewModel = new JSONModel({
				busy: true
			});

			this.getView().setModel(oViewModel, "appView");

			this.getOwnerComponent().getModel().metadataLoaded()
				.then(function() {
					oViewModel.setProperty("/busy", false);
				});
		}
	});
});
