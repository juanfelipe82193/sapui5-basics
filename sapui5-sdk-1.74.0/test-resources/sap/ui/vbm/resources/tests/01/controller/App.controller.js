sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.01.controller.App", {

		onPressAbout: function() {
			console.log(99)
		},

		onInit: function() {

			var vbi = this.byId("vbi");
			$.getJSON("media/vbload01/main.json", function(dat) {

				var userStoredData = GLOBAL_MAP_CONFIG;
				dat.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
				dat.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

				var scene = userStoredData.MapLayerStacks;
				if (scene instanceof Array) {
					dat.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
				} else {
					dat.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
				}

				vbi.load(dat);
			});

		}

	});
});
