/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/simple/BaseGroup"], function (BaseGroup) {
	"use strict";

	var SteppedTask = BaseGroup.extend("sap.gantt.simple.test.SteppedTask", {
		metadata: {
			aggregations: {
				task: {
					type: "sap.gantt.simple.BaseRectangle",
					multiple: false,
					sapGanttOrder: 1
				},
				steps: {
					type: "sap.gantt.simple.BaseRectangle",
					multiple: true,
					singularName: "step",
					sapGanttOrder: 0
				},

				breaks: {
					type: "sap.gantt.simple.BaseRectangle",
					multiple: true,
					singularName: "break",
					sapGanttLazy: true
				},

				utilizationLine: {
					type: "sap.gantt.simple.UtilizationLineChart",
					multiple: false,
					sapGanttLazy: true
				},
				utilizationBar: {
					type: "sap.gantt.simple.UtilizationBarChart",
					multiple: false,
					sapGanttLazy: true
				}
			}
		}
	});
	return SteppedTask;
}, true);
