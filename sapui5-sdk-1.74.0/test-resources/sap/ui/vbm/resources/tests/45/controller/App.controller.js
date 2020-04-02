sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.45.controller.App", {

		onInit: function() {

			var oData = {
				Spot11: [
					{
						"key": "1",
						"pos": "0;0;0",
						"tooltip": "Spot1",
						"select": true
					},
					{
						"key": "2",
						"pos": "30;0;0",
						"tooltip": "Spot2",
						"select": false
					},
					{
						"key": "3",
						"pos": "60;0;0",
						"tooltip": "Spot3",
						"select": false
					}
				],
				Spot00: [
					{
						"key": "4",
						"pos": "0;10;0",
						"tooltip": "Spot4",
						"select": false
					},
					{
						"key": "5",
						"pos": "30;10;0",
						"tooltip": "Spot5",
						"select": false
					},
					{
						"key": "6",
						"pos": "60;10;0",
						"tooltip": "Spot6",
						"select": false
					}
   				],
				Spot1N: [
					{
						"key": "7",
						"pos": "0;20;0",
						"tooltip": "Spot7",
						"select": true
					},
					{
						"key": "8",
						"pos": "30;20;0",
						"tooltip": "Spot8",
						"select": false
					},
					{
						"key": "9",
						"pos": "60;20;0",
						"tooltip": "Spot9",
						"select": false
					}
      			],
				Spot0N: [
					{
						"key": "10",
						"pos": "0;30;0",
						"tooltip": "Spot10",
						"select": false
					},
					{
						"key": "11",
						"pos": "30;30;0",
						"tooltip": "Spot11",
						"select": false
					},
					{
						"key": "12",
						"pos": "60;30;0",
						"tooltip": "Spot12",
						"select": false
					}
				],
				Spot01: [
					{
						"key": "13",
						"pos": "0;40;0",
						"tooltip": "Spot13",
						"select": false
					},
					{
						"key": "14",
						"pos": "30;40;0",
						"tooltip": "Spot14",
						"select": false
					},
					{
						"key": "15",
						"pos": "60;40;0",
						"tooltip": "Spot15",
						"select": false
					}
				]
			};

			// create model and set the data
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);

			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				},
				data: oData
			};

			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var model = new sap.ui.model.json.JSONModel(dataModel);
			this.getView().setModel(model);
		},

		onPressRectangularSelection: function() {
			this.byId("vbi").setRectangularSelection(true);
		},

		onPressLassoSelection: function() {
			this.byId("vbi").setLassoSelection(true);
		},
		
		onPressRectangularZoom: function() {
			this.byId("vbi").setRectZoom(true);
		}

	});
});
