sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.27.controller.App", {

		onInit: function() {

			var vbi = this.byId("vbi");

			// load the json and set the default text area text
			$.getJSON("media/vbdetail/maindevices.json", function(data) {
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
			var datEvent = JSON.parse(e.mParameters.data);
			//var instance = parseInt(datEvent.Action.instance);
			var instance = datEvent.Action.instance.match(/\d+/g);
			if (instance) {
				var vbi = this.byId("vbi");

				if (instance[0] == 0) {
					$.getJSON("media/vbdetail/opendetail1devices.json", function(dat) {
						vbi.load(dat);
					});
				} else if (instance[0] == 1) {
					$.getJSON("media/vbdetail/opendetail2devices.json", function(dat) {
						vbi.load(dat);
					});
				} else if (instance[0] == 2) {
					$.getJSON("media/vbdetail/opendetail3devices.json", function(dat) {
						vbi.load(dat);
					});
				}
			}

		}

	});
});
