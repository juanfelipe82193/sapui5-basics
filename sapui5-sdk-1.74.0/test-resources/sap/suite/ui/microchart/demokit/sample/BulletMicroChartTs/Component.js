sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.BulletMicroChartTs.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.BulletMicroChartTs.BulletMicroChartTs",
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
						"BulletMicroChartTs.view.xml",
						"BulletMicroChartTs.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
