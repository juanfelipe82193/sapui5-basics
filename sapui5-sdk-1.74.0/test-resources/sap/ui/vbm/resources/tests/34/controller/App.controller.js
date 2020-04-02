sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.34.controller.App", {

		onInit: function() {

			this.nameDictionary = {
				"Scene1|VO1|Spots.0": "Spot 0",
				"Scene1|VO1|Spots.1": "Spot 1",
				"Scene1|VO1|Spots.2": "Spot 2",
				"Scene1|VO2|Links.0": "Blue Route",
				"Scene1|VO2|Links.1": "Green Route",
				"Spots.0": "Spot 0",
				"Spots.1": "Spot 1",
				"Spots.2": "Spot 2",
				"Links.0": "Blue Route",
				"Links.1": "Green Route"
			}

			var vbi = this.byId("vbi");

			// load the json and set the default text area text
			$.getJSON("media/vbdnd/main.json", function(data) {
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

		onSubmit: function(e) {
			var x, y;
			var datEvent = JSON.parse(e.mParameters.data);
			if (datEvent.Action.name === "DROPIT") {

				var sourceObject = this.nameDictionary[datEvent.Action.Params.Param[0]["#"]],
					destinationObject = this.nameDictionary[datEvent.Action.instance];

				MessageToast.show(sourceObject + " dropped on " + destinationObject);
			}
		}
	});
});
