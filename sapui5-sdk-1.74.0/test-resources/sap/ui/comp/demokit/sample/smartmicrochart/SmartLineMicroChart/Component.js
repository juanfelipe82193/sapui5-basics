sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmicrochart.SmartLineMicroChart.Component", {
		metadata : {
			rootView : {
				"viewName": "sap.ui.comp.sample.smartmicrochart.SmartLineMicroChart.Page",
				"type": "XML",
				"async": true
			},
			dependencies : {
				libs : ["sap.m", "sap.suite.ui.microchart"]
			},
			config : {
				sample : {
					stretch : true,
					files : [
						"Page.view.xml",
						"Page.controller.js",
						"mockserver/metadata.xml",
						"mockserver/StockPrices.json"
					]
				}
			}
		}
	});
});
