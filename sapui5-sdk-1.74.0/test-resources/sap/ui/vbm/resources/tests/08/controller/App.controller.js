sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.08.controller.App", {

		onInit: function() {

			var vbi = this.byId("vbi");

			var data = $.getJSON("media/vbthumbnail/main.json", function(data) {
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

		onMinimize: function() {
			this.byId("vbi").minimize(300, 300, 0, 0, "25px Arial", "rgba(255,0,0,0)", 0, "Map thumbnail")
		},

		onAllowEvents: function() {
			var data = $.getJSON("media/vbthumbnail/AddEvents.json", function(data) {
				this.byId("vbi").load(data);
			}.bind(this));
		},

		onMaximize: function() {
			this.byId("vbi").maximize();
		},

		onMapSubmit: function(e) {
			var datEvent = JSON.parse(e.mParameters.data);

			if (datEvent.Action.name == "AWAKE") {
				MessageToast.show("click event received");
			}

			if (datEvent.Action.name == "ZOOMEDAWAKE") {
				MessageToast.show("right-click event received");
			}
		}

	});
});
