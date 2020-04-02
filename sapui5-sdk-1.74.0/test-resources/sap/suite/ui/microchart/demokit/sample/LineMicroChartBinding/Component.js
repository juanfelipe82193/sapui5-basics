sap.ui.define(['sap/ui/core/UIComponent'], function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.LineMicroChartBinding.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.LineMicroChartBinding.Page",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.microchart",
					"sap.ui.layout"
				]
			},
			config: {
				sample: {
					files: [
						"Page.view.xml",
						"Page.controller.js",
						"SampleData.json"
					]
				}
			}
		}
	});

	return Component;
});
