sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.ProcessFlowUpdateLanes.Component", {
		metadata: {
			rootView: "sap.suite.ui.commons.sample.ProcessFlowUpdateLanes.ProcessFlow",
			dependencies: {
				libs: [
					"sap.m",
					"sap.ui.layout",
					"sap.ui.core",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					files: [
						"ProcessFlow.view.xml",
						"ProcessFlow.controller.js",
						"ProcessFlowNodes.json"
					]
				}
			}
		}
	});
});
