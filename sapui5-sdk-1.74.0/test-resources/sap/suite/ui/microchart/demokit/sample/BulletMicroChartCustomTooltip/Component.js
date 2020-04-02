sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.BulletMicroChartCustomTooltip.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.BulletMicroChartCustomTooltip.BulletMicroChartCustomTooltip",
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
						"BulletMicroChartCustomTooltip.view.xml",
						"BulletMicroChartCustomTooltip.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
