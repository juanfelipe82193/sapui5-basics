sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.sample.ChartContainerFixFlexLayout.Component", {
		metadata : {
			rootView : "sap.suite.ui.commons.sample.ChartContainerFixFlexLayout.ChartContainer",
			includes : [ "style.css" ],
			dependencies : {
				libs : [
					"sap.m",
					"sap.ui.core",
					"sap.suite.ui.commons"
				]
			},
			config : {
				sample : {
					files : [
						"ChartContainer.view.xml",
						"ChartContainer.controller.js",
						"ChartContainerData1.json",
						"ChartContainerData2.json",
						"style.css"
					]
				}
			}
		}
	});
});
