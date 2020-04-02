sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smarttable.mtableCustom.Component", {
		metadata: {
			rootView: {
			"viewName": "sap.ui.comp.sample.smarttable.mtableCustom.SmartTable",
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