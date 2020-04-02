sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleDeltaMode.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartmicrochart.SmartBulletMicroChart.exampleDeltaMode.Page",
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
						"mockserver/metadata.xml"
					]
				}
			}
		}
	});
});
