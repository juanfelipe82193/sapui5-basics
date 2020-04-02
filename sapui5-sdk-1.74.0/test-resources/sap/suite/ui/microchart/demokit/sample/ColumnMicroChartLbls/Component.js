sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ColumnMicroChartLbls.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.ColumnMicroChartLbls.ColumnMicroChartLbls",
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
						"ColumnMicroChartLbls.view.xml",
						"ColumnMicroChartLbls.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
