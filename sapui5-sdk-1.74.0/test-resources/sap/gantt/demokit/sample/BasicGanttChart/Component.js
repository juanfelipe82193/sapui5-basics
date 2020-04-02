sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.gantt.sample.BasicGanttChart.Component", {

		metadata : {
			rootView : "sap.gantt.sample.BasicGanttChart.BasicGanttChart",
			dependencies : {
				libs : [
					"sap.gantt",
					"sap.ui.table",
					"sap.m"
				]
			},
			config : {
				sample : {
					files : [
						"BasicGanttChart.view.xml",
						"BasicGanttChart.controller.js",
						"data.json"
					]
				}
			}
		}
	});

	return Component;
});