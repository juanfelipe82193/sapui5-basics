sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.57.controller.App", {

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
					position: "0;-10;0",
					labelText: "Default",
					labelType: sap.ui.vbm.SemanticType.Default
				}),
				new sap.ui.vbm.Spot({
					position: "0;0;0",
					labelText: "Error",
					labelType: sap.ui.vbm.SemanticType.Error
				}),
				new sap.ui.vbm.Spot({
					position: "0;10;0",
					labelText: "Hidden",
					labelType: sap.ui.vbm.SemanticType.Hidden
				}),
				new sap.ui.vbm.Spot({
					position: "0;20;0",
					labelText: "Inactive",
					labelType: sap.ui.vbm.SemanticType.Inactive
				}),
				new sap.ui.vbm.Spot({
					position: "0;30;0",
					labelText: "None",
					labelType: sap.ui.vbm.SemanticType.None
				}),
				new sap.ui.vbm.Spot({
					position: "0;40;0",
					labelText: "Success",
					labelType: sap.ui.vbm.SemanticType.Success
				}),
				new sap.ui.vbm.Spot({
					position: "0;50;0",
					labelText: "Warning",
					labelType: sap.ui.vbm.SemanticType.Warning
				})
            ];

			var mapSpots = this.byId("my-spots");
			spots.forEach(function(spot) {
				mapSpots.addItem(spot);
			});
		}
	});
});
