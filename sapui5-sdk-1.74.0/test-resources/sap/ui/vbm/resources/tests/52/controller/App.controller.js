sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.52.controller.App", {

		onInit: function() {

			var dataModel = {
				map: {
					mapConfiguration: GLOBAL_MAP_CONFIG
				}
			};

			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var model = new sap.ui.model.json.JSONModel(dataModel);
			this.getView().setModel(model);

			var oArea = new sap.ui.vbm.Area({
				position: "-12.65625;18.979034953717857;0;-50.4686647;20.9152589;0;-79.6021797;-4.8035256;0;-58.7084469;-31.3778753;0;21.0408719;-31.3778753;0;55.4713897;0.490725;0;-39.8746594;0.1962919;0;-25.4550408;-17.7671106;0;23.203125;-10.833311252656364;0",
				hotScale: "1;1;1",
				color: "rgba(0,124,192,.7)",
				colorBorder: 'rgba(0,124,192,.8)',
			});

			var oAreas = new sap.ui.vbm.Areas({
				items: [oArea]
			});

			var oMap = new sap.ui.vbm.GeoMap({
				width: "500px",
				height: "500px",
				mapConfiguration: dataModel.map.mapConfiguration,
				vos: [oAreas]
			});

			jQuery.sap.require("sap.ui.commons.Dialog");

			this.oDialog = new sap.m.Dialog({
				content: [oMap]
			});
			
			this.oDialog.setEndButton(new sap.m.Button({
				text: "Close",
				press: function() {
					this.oDialog.close()
				}.bind(this)
			}))

		},
		
		onPressOpenDialog: function() {
			this.oDialog.open();
		}

	});
});
