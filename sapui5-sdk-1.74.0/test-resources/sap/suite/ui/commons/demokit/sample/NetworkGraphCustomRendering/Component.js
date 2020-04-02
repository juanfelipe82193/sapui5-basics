sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.NetworkGraphCustomRendering.Component", {
		metadata: {
			rootView: "sap.suite.ui.commons.sample.NetworkGraphCustomRendering.NetworkGraph",
			dependencies: {
				libs: [
					"sap.m",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"NetworkGraph.view.xml",
						"NetworkGraph.controller.js",
						"NetworkGraphCustomNode.js",
						"graph.json"
					]
				}
			}
		}
	});
});
