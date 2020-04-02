sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ColumnMicroChartSb.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.ColumnMicroChartSb.ColumnMicroChartSb",
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
						"ColumnMicroChartSb.view.xml",
						"ColumnMicroChartSb.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
