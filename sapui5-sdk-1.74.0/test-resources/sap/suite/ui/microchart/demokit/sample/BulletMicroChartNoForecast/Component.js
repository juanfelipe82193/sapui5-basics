sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.BulletMicroChartNoForecast.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.BulletMicroChartNoForecast.BulletMicroChartNoForecast",
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
						"BulletMicroChartNoForecast.view.xml",
						"BulletMicroChartNoForecast.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
