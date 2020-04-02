sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function (Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.38.controller.App", {

		onInit: function () {

			sap.ui.getCore().loadLibrary("sap.ui.vbm");
			sap.ui.getCore().loadLibrary("sap.suite.ui.microchart");

			jQuery.sap.require("sap.ui.vbm.SemanticType");
			jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChart");
			jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChartData");

			var oData = {
				legendItems: [
					{
						"text": "Legend Item 1",
						"color": "rgb(92,186,230)",
					},
					{
						"text": "Legend Item 2",
						"color": "rgb(182,217,87)"
					},
					{
						"text": "Legend Item 3",
						"color": "rgb(250,195,100)"
					}
				],
				
				Spots: [
					{
						"key": "1",
						"pos": "0;0;0",
						"tooltip": "Spot1",
						"labelText": "labeltext",
						"type": sap.ui.vbm.SemanticType.Default
					},
					{
						"key": "2",
						"pos": "0;30;0",
						"tooltip": "Spot2",
						"labelText": "labeltext",
						"type": sap.ui.vbm.SemanticType.Default
					},
					{
						"key": "3",
						"pos": "0;60;0",
						"tooltip": "Spot3",
						"labelText": "labeltext",
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

			var oMap = sap.ui.getCore().byId("jsviewtest_geoMap");
			oMap.setModel(oModel);
		},

		onPressRemoveChartChangeModel: function () {
			var oMap = sap.ui.getCore().byId("jsviewtest_geoMap");
			var oData = oMap.getModel().getData();
			if( oData.Containers.length )
        		oData.Containers = oData.Containers.splice( 0, oData.Containers.length - 1 );
	       
			oMap.getModel().setData( oData );
		},

		onPressRemoveChartVO: function () {
			var oMap = sap.ui.getCore().byId("jsviewtest_geoMap");
			oMap.removeVo("containers");

		},

		onPressRemoveSpotVO: function () {
			var oMap = sap.ui.getCore().byId("jsviewtest_geoMap");
			oMap.removeVo("spots");

		},

		onPressAddSpotVO: function () {
			var oMap = sap.ui.getCore().byId("jsviewtest_geoMap");
			var spots = new sap.ui.vbm.Spots({
				items: [
					new sap.ui.vbm.Spot({
						position: "110;30;0",
						text: "this is spot1"
					}),
					new sap.ui.vbm.Spot({
						position: "110;40;0",
						text: "this is spot2"
					}),
					new sap.ui.vbm.Spot({
						position: "110;50;0",
						text: "this is spot3"
					}),
					new sap.ui.vbm.Spot({
						position: "110;55;0",
						text: "this is spot4"
					}),
					new sap.ui.vbm.Spot({
						position: "110;60;0",
						text: "this is spot5"
					}),
					new sap.ui.vbm.Spot({
						position: "110;65;0",
						text: "this is spot6"
					})
				]
			});

			oMap.addVo(spots);

		},

		onLegendVisible: function() {
			var oMap = sap.ui.getCore().byId("jsviewtest_geoMap");
			var button = this.getView().byId("btnHide");

			if (button.getText() === "Hide Legend") {
				oMap.setLegendVisible(false);
				button.setText("Show Legend");
			}
			else {
				button.setText("Hide Legend");
				oMap.setLegendVisible(true);
			}
		},

		onDestroyLegend: function() {
			var oMap = sap.ui.getCore().byId("jsviewtest_geoMap");
			oMap.destroyLegend();
			oMap.invalidate();
		}
		
	});
});
