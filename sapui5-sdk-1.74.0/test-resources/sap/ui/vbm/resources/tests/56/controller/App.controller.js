sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.56.controller.App", {

		onInit: function() {

			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				}
			};

			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var model = new sap.ui.model.json.JSONModel(dataModel);
			model.setSizeLimit(3000)
			this.getView().setModel(model);


			var spots = [
				new sap.ui.vbm.Spot({
					type: sap.ui.vbm.SemanticType.Error,
					text: "1234",
					position: "20;0;0",
					tooltip: "Error"
				}),
                         new sap.ui.vbm.Spot({
					type: sap.ui.vbm.SemanticType.Warning,
					position: "40;0;0",
					tooltip: "Warning"
				}),
                         new sap.ui.vbm.Spot({
					type: sap.ui.vbm.SemanticType.Success,
					text: "34567",
					position: "60;0;0",
					tooltip: "Success"
				}),
                         new sap.ui.vbm.Spot({
					type: sap.ui.vbm.SemanticType.Default,
					position: "80;0;0",
					tooltip: "Default"
				}),
                         new sap.ui.vbm.Spot({
					type: sap.ui.vbm.SemanticType.Inactive,
					position: "100;0;0",
					tooltip: "Inactive"
				})
            ];

			var mapSpots = this.byId("my-spots");
			spots.forEach(function(spot) {
				mapSpots.addItem(spot);
			});
		}
	});
});
