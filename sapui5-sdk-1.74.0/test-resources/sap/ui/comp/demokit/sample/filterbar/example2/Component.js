sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

		return UIComponent.extend("sap.ui.comp.sample.filterbar.example2.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.filterbar.example2.FilterBar",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [ "sap.m", "sap.ui.comp" ]
			},
			config: {
				sample: {
					stretch: true,
					files: [ "FilterBar.view.xml", "FilterBar.controller.js" ]
				}
			}
		}
	});
});