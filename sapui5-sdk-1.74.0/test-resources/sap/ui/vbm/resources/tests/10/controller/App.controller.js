sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.10.controller.App", {

		onInit: function() {

			var vbi = this.byId("vbi");

			// load the json and set the default text area text
			$.getJSON("media/ZoomToMultiplePositions/main.json", function(data) {
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
			});

		},

		onPressZoom: function() {
			this.byId("vbi").zoomToGeoPosition([8.695679, 8.65036, 8.276825], [50.112653, 49.886672, 50.003326]);
		}

	});
});
