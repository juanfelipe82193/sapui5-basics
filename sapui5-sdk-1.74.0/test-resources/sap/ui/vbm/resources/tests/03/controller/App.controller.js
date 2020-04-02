sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.03.controller.App", {

		onResize300x300: function() {
			this.byId("vbi").setHeight("300px");
			this.byId("vbi").setWidth("300px");
		},
		
		onResize600x600: function() {
			this.byId("vbi").setHeight("600px");
			this.byId("vbi").setWidth("600px");
		},
		
		onResize600x800: function() {
			this.byId("vbi").setWidth("600px");
			this.byId("vbi").setHeight("800px");
		},
		
		onResizePercent: function() {
			this.byId("vbi").setHeight("30%");
			this.byId("vbi").setWidth("30%");
		},
		
		onResizeFull: function() {
			this.byId("vbi").setHeight("100%");
			this.byId("vbi").setWidth("100%");
		},

		onInit: function() {

			var appConfig = {
				"SAPVB": {
					"version": "2.0",
					"xmlns:VB": "VB",
					"Windows": {
						"Set": {
							"Window": {
								"id": "W1",
								"type": "geo",
								"refScene": "S1",
							}
						}
					},
					"Scenes": {
						"Set": {
							"SceneGeo": {
								"id": "S1",
								"refMapLayerStack": "lsMapQuest"
							}
						}
					},
					"MapProviders": {
						"Set": {
							"MapProvider": {}
						}
					},
					"MapLayerStacks": {
						"Set": {
							"MapLayerStack": {}
						}
					}
				}
			};

			var vbi = this.byId("vbi");

			var userStoredData = GLOBAL_MAP_CONFIG;
			appConfig.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
			appConfig.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

			var scene = userStoredData.MapLayerStacks;
			if (scene instanceof Array) {
				appConfig.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
			} else {
				appConfig.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
			}
			vbi.setConfig(appConfig);
		}

	});
});
