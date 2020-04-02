sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.43.controller.App", {

		onInit: function() {
			var data = {
				scaleVisible: true,
				legendVisible: true,
				navcontrolVisible: true,
				disableZoom: false,
				disablePan: false,
				centerPosition: "11.5;48",
				zoomlevel: 7,
				mapConfiguration: GLOBAL_MAP_CONFIG
			};
			
			jQuery.sap.require("sap.ui.model.json.JSONModel");
			var model = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(model);
		},
		
		onCheckBoxSelect: function() {
			this.byId("vbi").m_saVO = null;
		}
		
	});
});
