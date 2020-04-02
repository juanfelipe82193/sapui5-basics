
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vbm/GeoMap",
	"sap/m/FlexItemData"
], function(Controller, GeoMap, FlexItemData) {
	"use strict";
	return Controller.extend("vbm-regression.bcp_tests.05.controller.App", {

		onInit: function() {
			
			this.oVBI = new sap.ui.vbm.GeoMap({
				width : "100%",
				height: "100%"
			});

			this.mapConfig = [];

			this.mapConfig.push(GLOBAL_MAP_CONFIG);
			this.mapConfig.push({
				MapProvider: [{
					name: "CARTO",
					tileX: "256",
					tileY: "256",
					maxLOD: "20",
					copyright: "Leaflet | Â© OpenStreetMap contributors Â© CARTO",
					Source: [{
						id: "s1",
						url: "https://cartodb-basemaps-1.global.ssl.fastly.net/light_all/{LOD}/{X}/{Y}.png"
					}]
				}],
				MapLayerStacks: [{
					name: "DEFAULT",
					MapLayer: {
						name: "layer1",
						refMapProvider: "CARTO",
						opacity: "1.0",
						colBkgnd: "RGB(255,255,255)"
					}
				}]
			});
			this.mapConfig.push({
				MapProvider: [{
					name: "CARTO",
					tileX: "256",
					tileY: "256",
					maxLOD: "20",
					copyright: "Leaflet | Â© OpenStreetMap contributors Â© CARTO",
					Source: [{
						id: "s1",
						url: "https://cartodb-basemaps-1.global.ssl.fastly.net/rastertiles/voyager/{LOD}/{X}/{Y}.png"
					}]
				}],
				MapLayerStacks: [{
					name: "DEFAULT",
					MapLayer: {
						name: "layer1",
						refMapProvider: "CARTO",
						opacity: "1.0",
						colBkgnd: "RGB(255,255,255)"
					}
				}]
			});
			
			this.oVBI.setLayoutData(new FlexItemData({
				baseSize: "100%"
			}));
			this.getView().byId("flexBox").insertItem(this.oVBI);
		},

		rnd: function(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		
		onChangeMapConfig: function() {

			var index = this.rnd(0, this.mapConfig.length - 1);
			var config = this.mapConfig[index];

			this.oVBI.setMapConfiguration(config);

			if (config.MapLayerStacks.length) {
				index = this.rnd(0, config.MapLayerStacks.length - 1);
				this.oVBI.setRefMapLayerStack(config.MapLayerStacks[index].name);
			}
		}

	});
});

