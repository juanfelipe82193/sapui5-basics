sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vbm/GeoMap",
	"sap/ui/vbm/Spot",
	"sap/ui/vbm/Spots",
	"sap/ui/model/json/JSONModel"
], function(Controller, GeoMap, Spot, Spots, JSONModel) {
	"use strict";
	return Controller.extend("vbm-regression.bcp_tests.03.controller.App", {

		onInit: function() {

			this.oSpots = new sap.ui.vbm.Spots();
			
			var oMap = new sap.ui.vbm.GeoMap({
			   vos : [ this.oSpots]
			});
			
			this.oTemplateSpot = new sap.ui.vbm.Spot({
				position: "{pos}"
			});

			var oMapConfig = {
				"MapProvider": [{
					"name": "OSM",
					"type": "",
					"description": "",
					"tileX": "256",
					"tileY": "256",
					"maxLOD": "20",
					"copyright": "Tiles Courtesy of OpenMapTiles",
					"Source": [{
						"id": "s1",
						"url": "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
					}]
				}],
				"MapLayerStacks": [{
					"name": "Default",
					"MapLayer": [{
						"name": "OSM",
						"refMapProvider": "OSM"
					}]
				}]
			};

			oMap.setMapConfiguration(oMapConfig);

			var data = {
				positions: [
					{pos: "-120.083855;37.386051;0"},
					{pos: "-95.083855;37.386051;0"},
					{pos: "95.083855;37.386051;0"}
				]
			};

			var model = new sap.ui.model.json.JSONModel();
			model.setData(data);

			this.oSpots.setModel(model);

			this.getView().byId("flexBox").insertItem(oMap);
		},

		onBind: function() {
			var button = this.byId("btn")
			
			if (button.getText() === "Bind Spots") {
				this.oSpots.bindAggregation("items", {
					path : "/positions",
					template : this.oTemplateSpot
				});
				button.setText("Unbind Spots");
			}
			else {
				button.setText("Bind Spots");
				this.oSpots.unbindAggregation("items");
			}
		}

	});
});

