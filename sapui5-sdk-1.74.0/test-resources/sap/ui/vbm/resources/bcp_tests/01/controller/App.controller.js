
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/NumericContent",
	"sap/ui/vbm/AnalyticMap",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function(Controller, NumericContent, AnalyticMap, MessageToast, JSONModel) {
	"use strict";
	return Controller.extend("vbm-regression.bcp_tests.01.controller.App", {

		onInit: function() {
			var data = {
				Circles: [{
					"pos": "-99.996246;48.368888;0",
					"tooltip": "North America",
					"radius": "100",
					"color": "rgb(171,219,242)",
					"valueAmount": "250K",
					"percent": "25%",
					"indicator": "Up",
					"valueColor": "Good"
					}, {
					"pos": "-56.9210990;-12.6818710;0",
					"tooltip": "LATAM",
					"radius": "100",
					"valueAmount": "2.2M",
					"percent": "35%",
					"indicator": "Down",
					"valueColor": "Error"
					}, {
					"pos": "9.0966796875;49.28214015975995;0",
					"tooltip": "Europe",
					"radius": "80",
					"valueAmount": "3.5M",
					"percent": "0%",
					"indicator": "None",
					"valueColor": "Neutral"
					}, {
					"pos": "95.6260170;51.8872670;0",
					"tooltip": "Asia PAC",
					"radius": "100",
					"valueAmount": "350K",
					"percent": "25%",
					"indicator": "Down",
					"valueColor": "Critical"
					}, {
					"pos": "18.0509740;2.0465460;0",
					"tooltip": "Africa",
					"radius": "100",
					"valueAmount": "1.6M",
					"percent": "45%",
					"indicator": "Up",
					"valueColor": "Good"
				}]
			};

			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				},
				regionProperties: data
			};

			var model = new JSONModel(dataModel);
			this.getView().setModel(model);

			sap.ui.vbm.AnalyticMap.GeoJSONURL = "media/analyticmap/continent.json";

			var template = new sap.m.NumericContent({
				value: "{valueAmount}",
				scale: "{percent}",
				valueColor: "{valueColor}",
				indicator: "{indicator}",
				state: "Loaded",
				truncateValueTo: 6,
				press: [this.onClickNum, this]
			});
			var container = new sap.ui.vbm.Container({
				position: "{pos}",
				item: template
			});
			var containers = new sap.ui.vbm.Containers();
			containers.bindAggregation("items", {
				path: "/regionProperties/Circles",
				template: container,
			});
			this.byId("map").addVo(containers);
		 },

		onClickNum: function(e){
			sap.m.MessageToast.show("The numeric content is pressed.");
		}
	});
});

