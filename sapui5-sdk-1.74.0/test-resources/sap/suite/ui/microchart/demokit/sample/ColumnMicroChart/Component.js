sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = sap.ui.core.UIComponent.extend("sap.suite.ui.microchart.sample.ColumnMicroChart.Component", {

		metadata: {
			rootView: {
				"viewName": "sap.suite.ui.microchart.sample.ColumnMicroChart.ColumnMicroChart",
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
						"ColumnMicroChart.view.xml",
						"ColumnMicroChart.controller.js"
					]
				}
			}
		}
	});

	return Component;
});
