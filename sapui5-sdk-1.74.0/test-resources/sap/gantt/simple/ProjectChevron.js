/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/simple/BaseGroup"], function (BaseGroup) {
	"use strict";

	var ProjectChevron = BaseGroup.extend("sap.gantt.simple.test.ProjectChevron", {
		metadata: {
			aggregations: {
				chevron: {
					type: "sap.gantt.simple.BaseChevron",
					multiple: false,
					sapGanttOrder: 1
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

	ProjectChevron.prototype.getTime = function() {
		var oTime = this.getProperty("time");
		return oTime ? oTime : this.getChevron().getTime();
	};

	ProjectChevron.prototype.getEndTime = function() {
		var oEndTime = this.getProperty("endTime");
		return oEndTime ? oEndTime : this.getChevron().getEndTime();
	};

	return ProjectChevron;
}, true);
