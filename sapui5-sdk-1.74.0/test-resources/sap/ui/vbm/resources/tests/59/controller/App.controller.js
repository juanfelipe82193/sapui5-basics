sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.59.controller.App", {

		onInit: function() {

			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				},
				data: {
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
			var model = new sap.ui.model.json.JSONModel(dataModel);
			this.getView().setModel(model);

			sap.ui.vbm.AnalyticMap.GeoJSONURL = "media/analyticmap/L0.json";

//			setTimeout(function() {
//				this.byId("map").zoomToRegions(['DE', 'IT', 'FR']);
//			}.bind(this), 0);

		},

	});
});
