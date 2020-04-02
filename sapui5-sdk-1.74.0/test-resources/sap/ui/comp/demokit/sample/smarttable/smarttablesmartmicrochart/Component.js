sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smarttable.smarttablesmartmicrochart.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smarttable.smarttablesmartmicrochart.App",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [ "sap.m", "sap.suite.ui.microchart", "sap.ui.comp" ]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"App.view.xml",
						"App.controller.js",
						"mockserver/metadata.xml",
						"mockserver/Products.json"
					]
				}
			}
		}
	});
});