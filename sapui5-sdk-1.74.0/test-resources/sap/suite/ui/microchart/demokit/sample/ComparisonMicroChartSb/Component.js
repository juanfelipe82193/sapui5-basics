sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ComparisonMicroChartSb.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.ComparisonMicroChartSb.ComparisonMicroChartSb",
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
						"ComparisonMicroChartSb.view.xml",
						"ComparisonMicroChartSb.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
