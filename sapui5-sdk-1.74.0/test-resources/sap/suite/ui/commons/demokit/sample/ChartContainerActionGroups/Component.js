sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.ChartContainerActionGroups.Component", {

		metadata: {
			rootView: "sap.suite.ui.commons.sample.ChartContainerActionGroups.ChartContainer",
			dependencies: {
				libs: [
					"sap.m",
					"sap.ui.core",
					"sap.suite.ui.commons"
				]
			},
			config: {
				sample: {
					files: [
						"ActionGroups1.fragment.xml",
						"ActionGroups2.fragment.xml",
						"ChartContainer.view.xml",
						"ChartContainer.controller.js",
						"ChartContainerSelectionDetails.js",
						"ChartContainerData.json"
					]
				}
			}
		}
	});
});
