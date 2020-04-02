sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmultiinput.inSmartForm.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartmultiinput.inSmartForm.SmartMultiInput",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: ["sap.m", "sap.ui.comp"]
			},
			config: {
				sample: {
					stretch: true,
					files: ["SmartMultiInput.view.xml", "SmartMultiInput.controller.js", "../mockserver/metadata.xml",
						"../mockserver/Products.json", "../mockserver/Categories.json", "../mockserver/CategoriesVH.json"]
				}
			}
		}
	});
});