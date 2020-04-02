sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel",
	"sap/m/FlexItemData",
	"sap/ui/vbm/GeoMap",
	"sap/ui/vbm/Spot",
	"sap/ui/vbm/Spots"
], function(
	Controller,
	Filter,
	JSONModel,
	FlexItemData,
	GeoMap,
	Spot,
	Spots
) {
	"use strict";

	return Controller.extend("vbm-regression.bcp_tests.02.controller.App", {
		onInit: function() {
			var data = {
				spots: {
					"items": [
						{
							"pos": "37.422982;55.755202;0",
							"tooltip": "test 1",
							"type": "Success",
							"text": "good"
						},
						{
							"pos": "37.407072;39.906235;0",
							"tooltip": "test 5",
							"type": "Warning",
							"text": "bad"
						}
					]
				}
			};

			var model = new JSONModel();
			model.setData(data);

			var geoMap = new GeoMap("map", {
				width: "100%",
				height: "100%",
				vos: [
					new Spots("spots", {
						minSel: "0",
						maxSel: "n",
						items: {
							path: "/spots/items",
							template: new Spot({
								text: "{text}",
								position: "{pos}",
								tooltip: "{tooltip}",
								type: "{type}"
							})
						}
					})
				]
			});

			geoMap.setModel(model);
			geoMap.setMapConfiguration(GLOBAL_MAP_CONFIG);
			geoMap.setLayoutData(new FlexItemData({
				baseSize: "100%"
			}));
			this.getView().byId("flexBox").insertItem(geoMap);
		},

		showAll: function(event) {
			var map = sap.ui.getCore().byId("map");
			var spots = map.getVos()[0];
			var binding = spots.getBinding("items");
			binding.filter([]);
		},

		showGood: function(event) {
			var map = sap.ui.getCore().byId("map");
			var spots = map.getVos()[0];
			var binding = spots.getBinding("items");
			binding.filter([ new Filter("type", "EQ", "Success") ]);
		},

		showBad: function(event) {
			var map = sap.ui.getCore().byId("map");
			var spots = map.getVos()[0];
			var binding = spots.getBinding("items");
			binding.filter([ new Filter("type", "EQ", "Warning") ]);
		}
	});
});