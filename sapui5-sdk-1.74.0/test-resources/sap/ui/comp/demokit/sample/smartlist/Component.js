sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartlist.Component", {
		metadata: {
			rootView: {
			"viewName": "sap.ui.comp.sample.smartlist.SmartList",
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
						"SmartList.view.xml", "SmartList.controller.js", "../smarttable/mockserver/metadata.xml"
					]
				}
			}
		}
	});
});