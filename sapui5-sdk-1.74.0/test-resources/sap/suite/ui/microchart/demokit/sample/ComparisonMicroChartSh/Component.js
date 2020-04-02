sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ComparisonMicroChartSh.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.ComparisonMicroChartSh.ComparisonMicroChartSh",
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
						"ComparisonMicroChartSh.view.xml",
						"ComparisonMicroChartSh.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
