sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/vbm/AnalyticMap"
], function(Controller, MessageToast, AnalyticMap) {
	"use strict";
	return Controller.extend("vbm-regression.tests.58.controller.App", {

		onInit: function() {
			
			sap.ui.getCore().loadLibrary("sap.ui.layout");
			sap.ui.getCore().loadLibrary("sap.ui.vbm");
			
			var oData = { data: {
					regionProperties: [
						{
							"code": "DE",
							"region": "Germany",
							"color": "rgb(92,186,230)",
							"tooltip": "Germany\r\nBIP: 3.577 Mrd. USD\r\nPopulation: 80,716 Mio"
						},
						{
							"code": "FR",
							"region": "France",
							"color": "rgb(182,217,87)"
						},
						{
							"code": "IT",
							"region": "Italy",
							"color": "rgb(250,195,100)"
						},
						{
							"code": "GR",
							"region": "Greece",
							"color": "rgb(140,211,255)"
						},
						{
							"code": "ES",
							"region": "Spain",
							"color": "rgb(217,152,203)"
						},
						{
							"code": "PT",
							"region": "Portugal",
							"color": "rgb(242,210,73)"
						}
				],
					Circles: [
						{
							"key": "1",
							"pos": "30;0;0",
							"tooltip": "Circle1"
						},
						{
							"key": "2",
							"pos": "30;30;0",
							"tooltip": "Circle2"
						},
						{
							"key": "3",
							"pos": "30;60;0",
							"tooltip": "Circle3"
						}
               ]

				}
			};

			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);

			var oMap = sap.ui.getCore().byId("jsviewtest_analyticMap");
			oMap.setModel(oModel);
			oMap.GeoJSONURL = "media/analyticmap/L0.json";
		},

		onRegionClick: function(e) {
			MessageToast.show("onRegionClick " + e.getParameter("code"));
		},

		onRegionContextMenu: function(e) {
			MessageToast.show("onRegionContextMenu: " + e.getParameter("code"));
		},

		onLegendClick: function(e) {
			MessageToast.show("onLegendClick; clicked on  " + e.getParameters().id);
		},

		onLegendItemClick: function(e) {
			MessageToast.show("onLegendItemClick; clicked on  " + e.getParameters().id);
		},

		onMapClick: function(e) {
			MessageToast.show("onMapClick Position: " + e.getParameter("pos"));
		},

		onMapContextMenu: function(e) {
			MessageToast.show("onMapContextMenu Position: " + e.getParameter("pos"));
		},

		onChangeModel: function() {
			var oMap = sap.ui.getCore().byId("jsviewtest_analyticMap");
			oMap.getModel().setProperty("/data/regionProperties/2/color", "rgba(255,0,0,1.0)");
			var currentData =oMap.getModel().getData();
			currentData.data.regionProperties.pop();
			currentData.data.regionProperties.pop();
			oMap.getModel().setData(currentData);
		},

		onZoomRegions: function() {
			var oMap = sap.ui.getCore().byId("jsviewtest_analyticMap");
			oMap.zoomToRegions(['DE', 'IT', 'FR']);
		},
		
		onPressRemoveRegions: function() {
			var oMap = sap.ui.getCore().byId("jsviewtest_analyticMap");
			oMap.unbindAggregation("regions");
		}
		
	});
});
