sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.variantmanagement.Component", {
		metadata: {
			rootView: {
			"viewName": "sap.ui.comp.sample.variantmanagement.VariantManagement",
			"type": "XML",
			"async": true
			},
			dependencies: {
				libs: [
					"sap.m", "sap.ui.comp"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"VariantManagement.view.xml", "VariantManagement.controller.js"
					]
				}
			}
		}
	});
});