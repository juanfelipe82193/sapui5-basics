sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.29.controller.App", {

		onInit: function() {

			var vbi = this.byId("vbi");

			// load the json and set the default text area text
			$.getJSON("media/vbselectstate/selectstate.json", function(data) {
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

		onPressColorWheelInfo: function() {

			jQuery.sap.require("sap.ui.layout.VerticalLayout");
			var dialog = new sap.m.Dialog({
				title: "Select a test",
				content: [
					new sap.ui.layout.VerticalLayout({
						content: [
							new sap.m.Text({
								text: "Refer to the color wheel below to check hue shift for the second row."
							}).addStyleClass("red-text"),
							new sap.m.Text({
								text: "1. Initial state of Pie = Orange. Therefore it can change 90 degrees to green."
							}),
							new sap.m.Text({
								text: "2. Initial state of triangle = Green. Therefore it can change 90 degrees to blue."
							}),
							new sap.m.Text({
								text: "3. Initial state of circle = green. Therefore it can change 90 degrees to blue."
							}),
							new sap.m.Text({
								text: "4. Inital state of circle = purple. Therefore it can change 90 degree to red."
							}),
							new sap.m.Text({
								text: "5. Inital state of spot = blue. Therefore it can change 90 degrees to purple."
							}),
							new sap.m.Text({
								text: "6. Initial state of box = blue. Therefore it can change 90 degrees to purple."
							}),
							new sap.m.Image({
								src: "img/colorWheel.jpeg"
							}),
							new sap.m.Text({
								text: "You will notice the hue shift is always anti-clockwise."
							}).addStyleClass("voffset-25")
						]
					})
				]
			});

			dialog.setBeginButton(new sap.m.Button({
				text: "Close",
				press: function() {
					dialog.close();
				}
			}));

			dialog.open();
		}


	});
});
