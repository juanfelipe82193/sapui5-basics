sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.02.controller.App", {

		onInit: function() {

			// create the controls and position them.............................//
			var vbi1 = this.byId("vbi1"),
				vbi2 = this.byId("vbi2");

			// load the projects into the controls...............................//
			var dat = $.getJSON("media/vbroute/main.json", function(dat) {
				var userStoredData = GLOBAL_MAP_CONFIG;
				dat.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
				dat.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

				var scene = userStoredData.MapLayerStacks;
				if (scene instanceof Array) {
					dat.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
				} else {
					dat.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
				}
				vbi1.load(dat);
			});

			var dat1 = $.getJSON("media/vbcircle/main.json", function(dat1) {
				var userStoredData = GLOBAL_MAP_CONFIG;
				dat1.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
				dat1.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

				var scene = userStoredData.MapLayerStacks;
				if (scene instanceof Array) {
					dat1.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
				} else {
					dat1.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
				}
				vbi2.load(dat1);
			});

		}

	});
});
