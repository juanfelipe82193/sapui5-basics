sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.26.controller.App", {

		onInit: function() {

			var vbi = this.byId("vbi");

			// load the json and set the default text area text
			$.getJSON("media/vbdetailroute/main.json", function(data) {
				var userStoredData = GLOBAL_MAP_CONFIG;
				data.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
				data.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

				var scene = userStoredData.MapLayerStacks;
				if (scene instanceof Array) {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
				} else {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
				}
				vbi.load(data);

				$.getJSON("media/vbdetailroute/opendetail2.json", function(data) {
					vbi.load(data);
				})
				
				vbi.zoomToGeoPosition(-1	, 40, 7);

			});




		}

	});
});
