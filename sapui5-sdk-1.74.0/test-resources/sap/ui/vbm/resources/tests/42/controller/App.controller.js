sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.42.controller.App", {

		onInit: function() {
			var data = {
				mapConfiguration: GLOBAL_MAP_CONFIG
			};
			
			var model = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(model);
		},

		onAreaClick: function() {
			MessageToast.show("Area clicked");
		},

		onAreaContextMenu: function() {
			MessageToast.show("Area context menu");
		},

		onAreaEdgeContextMenu: function() {
			MessageToast.show("Area edgeContextMenu");
		},

		onSpotContextMenu: function(event) {
			MessageToast.show("Spot contextMenu");
		},

		onSpotClick: function(event) {
			MessageToast.show("Spot clicked");
		},

		onMapContextMenu: function() {
			MessageToast.show("Map context menu");
		},

		onMapClick: function() {
			MessageToast.show("Map click");
		},

		onMapZoomChanged: function() {
			MessageToast.show("Map zoom changed");
		},

		onMapCenterChanged: function() {
			MessageToast.show("Map center changed");
		}		
	});
});
