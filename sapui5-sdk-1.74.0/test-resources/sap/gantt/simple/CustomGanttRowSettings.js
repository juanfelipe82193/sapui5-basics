/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/gantt/simple/GanttRowSettings"
], function(GanttRowSettings) {
	"use strict";

	var CustomGanttRowSettings = GanttRowSettings.extend("sap.gantt.simple.test.CustomGanttRowSettings", /** @lends sap.gantt.simple.GanttRowSettings.prototype */{
		metadata: {
			aggregations: {
				/**
				 * The controls for the shapes.
				 */
				tasks : {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "task"},

				/**
				 * The controls for the shapes.
				 */
				projects : {type : "sap.gantt.simple.BaseShape", multiple : true, singularName : "project"}

			}
		}
	});

	return CustomGanttRowSettings;
});
