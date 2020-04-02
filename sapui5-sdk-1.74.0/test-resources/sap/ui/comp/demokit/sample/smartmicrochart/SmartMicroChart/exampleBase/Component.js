sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmicrochart.SmartMicroChart.exampleBase.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartmicrochart.SmartMicroChart.exampleBase.Page",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [ "sap.m", "sap.suite.ui.microchart" ]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Page.view.xml",
						"Page.controller.js",
						"mockserver/Products.json",
						"mockserver/Revenues.json",
						"mockserver/Series.json",
						"mockserver/Sales.json",
						"mockserver/StockPrices.json",
						"mockserver/metadata.xml",
						"mockserver/metadata2.xml"
					]
				}
			}
		}
	});
});
