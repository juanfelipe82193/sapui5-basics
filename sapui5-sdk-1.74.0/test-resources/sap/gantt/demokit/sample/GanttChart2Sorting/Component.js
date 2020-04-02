sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.gantt.sample.GanttChart2Sorting.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.gantt.sample.GanttChart2Sorting.Container",
				"type": "XML",
				"async": true
			},

			dependencies: {
				libs: [
					"sap.gantt",
					"sap.ui.table",
					"sap.m"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Component.js",
						"Container.controller.js",
						"Container.view.xml",
						"data.json",
						"CustomGroup.js",
						"CustomGroupTextBehind.js",
						"CustomRowSettings.js"
					]
				}
			}
		}
	});
});
