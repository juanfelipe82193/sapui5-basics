sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.21.controller.App", {

		onInit: function() {

			var vbi = this.byId("vbi");

			// load the json and set the default text area text
			$.getJSON("media/spotpiedetail/main.json", function(data) {
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

				// create new items for the map
				$.getJSON("media/spotpiedetail/new_block.json", function(dat) {
					vbi.load(dat);
				});

				$.getJSON("media/spotpiedetail/new_pie.json", function(dat) {
					vbi.load(dat);
				});

				$.getJSON("media/spotpiedetail/new_flags.json", function(dat) {
					vbi.load(dat);
				});
			});

		},

		onOpenDetailWindow: function() {
			var vbi = this.byId("vbi");
			$.getJSON("media/spotpiedetail/opendetail.json", function(dat) {
				vbi.load(dat);
			});
		},

		onClearEverything: function() {
			var vbi = this.byId("vbi");
			$.getJSON("media/spotpiedetail/clear.json", function(dat) {
				vbi.load(dat);
			});
		}
	});
});
