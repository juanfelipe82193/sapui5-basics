sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.41.controller.App", {

		onInit: function() {
			var spots = [
				{
					"key": "0",
					"pos": "-30;40;0",
					"tooltip": "Spot1",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "0",
					"alignmentName": "center"
				}, {
					"key": "1",
					"pos": "-30;20;0",
					"tooltip": "Spot2",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "1",
					"alignmentName": "top center"
				}, {
					"key": "2",
					"pos": "-30;0;0",
					"tooltip": "Spot3",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "2",
					"alignmentName": "top right"
				}, {
					"key": "3",
					"pos": "0;40;0",
					"tooltip": "Spot1",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "3",
					"alignmentName": "center right"
				}, {
					"key": "4",
					"pos": "0;20;0",
					"tooltip": "Spot2",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "4",
					"alignmentName": "bottom right"
				}, {
					"key": "5",
					"pos": "0;0;0",
					"tooltip": "Spot3",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "5",
					"alignmentName": "bottom center"
				}, {
					"key": "6",
					"pos": "30;40;0",
					"tooltip": "Spot1",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "6",
					"alignmentName": "bottom left"
				}, {
					"key": "7",
					"pos": "30;20;0",
					"tooltip": "Spot2",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "7",
					"alignmentName": "center left"
				}, {
					"key": "8",
					"pos": "30;0;0",
					"tooltip": "Spot3",
					"type": sap.ui.vbm.SemanticType.Default,
					"alignment": "8",
					"alignmentName": "top left"
				}
			];

			var routes = [{
				position: "30;-20;0;30;60;0"
			}, {
				position: "0;-20;0;0;60;0"
			}, {
				position: "-30;-20;0;-30;60;0"
			}, {
				position: "-40;-20;0;40;-20;0"
			}, {
				position: "-40;0;0;40;00;0"
			}, {
				position: "-40;20;0;40;20;0"
			}, {
				position: "-40;40;0;40;40;0"
			}]

			var data = {
				spots: spots,
				mapConfiguration: GLOBAL_MAP_CONFIG,
				routes: routes
			}
			var oModel = new sap.ui.model.json.JSONModel(data);

			this.byId("vbi").setModel(oModel);
		},

		onSpotContextMenu: function(event) {

		}
	});
});
