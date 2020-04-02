sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.DeltaMicroChart.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.DeltaMicroChart.DeltaMicroChart",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart"
				]
			},
			config: {
				sample: {
					files: [
						"DeltaMicroChart.view.xml",
						"DeltaMicroChart.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
