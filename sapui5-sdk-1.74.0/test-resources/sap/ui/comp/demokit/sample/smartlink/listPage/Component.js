sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartlink.listPage.Component", {
		metadata: {
			rootView: {
			"viewName": "sap.ui.comp.sample.smartlink.listPage.Example",
			"type": "XML",
			"async": true
			},
			dependencies: {
				libs: [
					"sap.m"
				]
			},
			config: {
				sample: {
					files: [
						"Example.view.xml",
						"Example.controller.js"
					]
				}
			}
		}
	});
});