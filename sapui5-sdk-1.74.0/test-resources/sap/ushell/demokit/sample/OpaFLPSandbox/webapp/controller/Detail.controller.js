sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ushell.sample.OpaFLPSandbox.controller.Detail", {
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();

			oRouter.getRoute("object").attachPatternMatched(function (oEvent) {
				var oModel = this.getView().getModel();
				var objectId = oEvent.getParameter("arguments").objectId;

				oModel.metadataLoaded().then( function() {
					var sObjectPath = oModel.createKey("Objects", {
						ObjectID: objectId
					});

					this.getView().bindElement({
						path: "/" + sObjectPath
					});
				}.bind(this));
			}.bind(this), this);
		}
	});
});
