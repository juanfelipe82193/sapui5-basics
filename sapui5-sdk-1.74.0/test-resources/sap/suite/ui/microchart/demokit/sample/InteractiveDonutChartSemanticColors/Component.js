sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.suite.ui.microchart.sample.InteractiveDonutChartSemanticColors.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.InteractiveDonutChartSemanticColors.Page",
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
						"Page.view.xml",
						"Page.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
