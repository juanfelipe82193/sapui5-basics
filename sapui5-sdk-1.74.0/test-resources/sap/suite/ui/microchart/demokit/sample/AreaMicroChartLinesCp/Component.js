sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.AreaMicroChartLinesCp.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.AreaMicroChartLinesCp.AreaMicroChartLinesCp",
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
						"AreaMicroChartLinesCp.view.xml",
						"AreaMicroChartLinesCp.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
