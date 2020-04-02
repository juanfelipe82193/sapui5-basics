sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.31.controller.App", {

		onInit: function() {



			var vbi1 = this.byId("vbi1"),
				vbi2 = this.byId("vbi2");

			// load the json and set the default text area text
			$.getJSON("media/vblabeltext/mainNewDesignBase.json", function(data) {
				var userStoredData = GLOBAL_MAP_CONFIG;
				data.SAPVB.MapLayerStacks.Set.MapLayerStack = userStoredData.MapLayerStacks;
				data.SAPVB.MapProviders.Set.MapProvider = userStoredData.MapProvider;

				var scene = userStoredData.MapLayerStacks;
				if (scene instanceof Array) {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks[0].name;
				} else {
					data.SAPVB.Scenes.Set.SceneGeo.refMapLayerStack = userStoredData.MapLayerStacks.name;
				}
				vbi1.load(data);
				vbi2.load(data);

				$.getJSON("media/vblabeltext/mainNewDesignDataArrow.json", function(data) {
					vbi1.load(data);
					vbi2.load(data);

					$.getJSON("media/vblabeltext/mainNewDesignDataRounded.json", function(data) {
						vbi2.load(data);
					});
				});





			});

		}
	});
});
