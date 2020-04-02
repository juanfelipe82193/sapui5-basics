sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartchart.semanticDimensionColoring.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartchart.semanticDimensionColoring.SmartChart",
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
						"SmartChart.view.xml",
						"SmartChart.controller.js",
						"mockserver/metadata.xml",
						"mockserver/Team.json"
					],
					stretch: true
				}
			}
		}
	});
});
