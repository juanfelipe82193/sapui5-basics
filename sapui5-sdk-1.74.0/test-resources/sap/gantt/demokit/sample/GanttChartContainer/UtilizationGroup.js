/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/simple/BaseGroup"], function (BaseGroup) {
	"use strict";

	var UtilizationGroup = BaseGroup.extend("sap.gantt.sample.GanttChartContainer.UtilizationGroup", {
		metadata: {
			aggregations: {
				utilizationLine: {
					type: "sap.gantt.simple.UtilizationLineChart",
					multiple: false,
					sapGanttLazy: true
				}
			}
		}
	});

	return UtilizationGroup;
}, true);
