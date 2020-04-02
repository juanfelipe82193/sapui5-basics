sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.39.controller.App", {

		onInit: function() {

			var oData = {
				mapConfiguration: GLOBAL_MAP_CONFIG,
				Spots: [
					{
						"key": "1",
						"pos": "0;0;0",
						"tooltip": "Spot1",
						"type": sap.ui.vbm.SemanticType.Default
					},
					{
						"key": "2",
						"pos": "0;30;0",
						"tooltip": "Spot2",
						"type": sap.ui.vbm.SemanticType.Default
					},
					{
						"key": "3",
						"pos": "0;60;0",
						"tooltip": "Spot3",
						"type": sap.ui.vbm.SemanticType.Default
					}
				],

				Circles: [
					{
						"key": "1",
						"pos": "35;0;0",
						"tooltip": "Circle1"
					},
					{
						"key": "2",
						"pos": "35;30;0",
						"tooltip": "Circle2"
					},
					{
						"key": "3",
						"pos": "35;60;0",
						"tooltip": "Circle3"
					}
					],

				OtherSpots: [
					{
						"key": "4",
						"pos": "20;0;0",
						"tooltip": "Spot4"
					},
					{
						"key": "5",
						"pos": "20;30;0",
						"tooltip": "Spot5"
					},
					{
						"key": "6",
						"pos": "20;60;0",
						"tooltip": "Spot6"
					}
				],
				PieSeries: [
					{
						"key": "7",
						"value": "10",
						"tooltip": "10 Items"
					},
					{
						"key": "8",
						"value": "20",
						"tooltip": "20 Items"
					},
					{
						"key": "9",
						"value": "30",
						"tooltip": "30 Items"
					}
					],

				Containers: [
					{
						"key": "10",
						"pos": "70;0;0",
						"tooltip": "Container1",
						ChartCols: [{
								"value": 60,
								"color": "Neutral"
							},
							{
								"value": 10,
								"color": "Error"
							},
							{
								"value": 20,
								"color": "Error"
							}]
						},
					{
						"key": "11",
						"pos": "70;30;0",
						"tooltip": "Container2",
						ChartCols: [{
								"value": 50,
								"color": "Neutral"
							},
							{
								"value": 8,
								"color": "Error"
							},
							{
								"value": 16,
								"color": "Error"
							},
							{
								"value": 24,
								"color": "Error"
							}]
						},
					{
						"key": "12",
						"pos": "70;60;0",
						"tooltip": "Container3",
						ChartCols: [{
								"value": 70,
								"color": "Neutral"
							},
							{
								"value": 5,
								"color": "Error"
							},
							{
								"value": 20,
								"color": "Error"
							},
							{
								"value": 45,
								"color": "Error"
							}]
						}
					]
			};

			// create model and set the data
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);
			
			this.byId("vbi").setModel(oModel);

		}
	});
});
