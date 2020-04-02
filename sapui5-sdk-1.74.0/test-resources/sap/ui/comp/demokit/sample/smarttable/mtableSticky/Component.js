sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smarttable.mtableSticky.Component", {
		metadata: {
			rootView: {
			"viewName": "sap.ui.comp.sample.smarttable.mtableSticky.SmartTable",
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
					files: [
						"SmartTable.view.xml",
						"SmartTable.controller.js",
						"../mockserver/metadata.xml"
					]
				}
			}
		}
	});
});