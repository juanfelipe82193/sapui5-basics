sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ComparisonMicroChart.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.ComparisonMicroChart.ComparisonMicroChart",
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
						"ComparisonMicroChart.view.xml",
						"ComparisonMicroChart.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
