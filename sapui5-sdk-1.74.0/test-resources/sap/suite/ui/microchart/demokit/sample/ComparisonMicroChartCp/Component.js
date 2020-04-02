sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ComparisonMicroChartCp.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.ComparisonMicroChartCp.ComparisonMicroChartCp",
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
						"ComparisonMicroChartCp.view.xml",
						"ComparisonMicroChartCp.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
