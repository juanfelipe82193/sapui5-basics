sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ComparisonMicroChartCv.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.ComparisonMicroChartCv.ComparisonMicroChartCv",
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
						"ComparisonMicroChartCv.view.xml",
						"ComparisonMicroChartCv.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
