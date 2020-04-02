sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.MicroProcessFlowRenderType.Component", {
		metadata: {
			rootView: "sap.suite.ui.commons.sample.MicroProcessFlowRenderType.MicroProcessFlow",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					files: [
						"MicroProcessFlow.view.xml",
						"MicroProcessFlow.controller.js"
					]
				}
			}
		}
	});
});
