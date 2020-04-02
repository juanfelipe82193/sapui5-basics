sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmicrochart.SmartAreaMicroChart.Component", {
		metadata : {
			rootView : {
				"viewName": "sap.ui.comp.sample.smartmicrochart.SmartAreaMicroChart.Page",
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
						"mockserver/metadataTarget.xml",
						"mockserver/metadataMaximize.xml",
						"mockserver/metadataMinimize.xml",
						"mockserver/metadataNeutral.xml",
						"mockserver/Series.json",
						"mockserver/StockPrices.json"
					]
				}
			}
		}
	});
});
