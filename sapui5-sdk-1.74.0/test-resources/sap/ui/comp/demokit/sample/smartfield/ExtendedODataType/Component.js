sap.ui.define([
	"sap/ui/core/UIComponent",
	"./StringExtended"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfield.ExtendedODataType.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartfield.ExtendedODataType.Main",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: ["sap.m", "sap.ui.comp"]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Main.view.xml",
						"Main.controller.js",
						"mockserver/metadata.xml",
						"mockserver/Items.json",
						"StringExtended.js"
					]
				}
			}
		}
	});
});