sap.ui.define([
	"sap/gantt/simple/GanttRowSettings"
], function (GanttRowSettings) {
	"use strict";

	return GanttRowSettings.extend("sap.gantt.sample.GanttChart2Shapes.CustomRowSettings", {
		metadata: {
			aggregations: {
				rectangles: {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "rectangle"},
				chevrons: {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "chevron"},
				texts: {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "text"},
				diamonds: {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "diamond"},
				cursors: {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "cursor"},
				images: {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "image"},
				paths: {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "path"}
			}
		}
	});
});
