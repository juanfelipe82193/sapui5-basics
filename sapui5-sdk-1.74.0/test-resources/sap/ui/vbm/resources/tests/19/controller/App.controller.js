sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	return Controller.extend("vbm-regression.tests.19.controller.App", {

		onInit: function() {

			jQuery.sap.require("sap.m.FlexItemData");
			jQuery.sap.require("sap.ui.vbm.AnalyticMap");

			sap.ui.vbm.AnalyticMap.GeoJSONURL = "media/vbarea/DE-NI.geojson";

			var map = new sap.ui.vbm.AnalyticMap({
				height: "100%",
				width: "100%",
				initialZoom: "7",
				initialPosition: "9;52.6;0",
				layoutData: new sap.m.FlexItemData({
					baseSize: "65%"
				}),
				regions: [
					new sap.ui.vbm.Region({
						code: "DE-NI",
						color: "rgba(184,225,245,1.0)",
						tooltip: "Niedersachsen enclosing Bremen"
					}),
					new sap.ui.vbm.Region({
						code: "DE-BE",
						color: "rgba(5,71,102,1.0)"
					})
				]
			}).addStyleClass("position-absolute");
			

			this.byId("test-flex").addItem(map);

		}
	});
});
