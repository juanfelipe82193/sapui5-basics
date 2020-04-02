sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartlist.smartListTree.Component", {
		metadata: {
			rootView: {
			"viewName": "sap.ui.comp.sample.smartlist.smartListTree.SmartTree",
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
						"SmartTree.view.xml", "SmartTree.controller.js"
					]
				}
			}
		}
	});
});