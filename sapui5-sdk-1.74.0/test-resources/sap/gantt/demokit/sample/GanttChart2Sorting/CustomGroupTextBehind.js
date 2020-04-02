sap.ui.define([
	"sap/gantt/simple/BaseGroup"
], function (BaseGroup) {
	"use strict";

	var CustomGroupTextBehind = BaseGroup.extend("sap.gantt.sample.GanttChart2Sorting.CustomGroupTextBehind", {
		metadata: {
			aggregations: {
				rectangles: {type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "rectangle", sapGanttOrder: 1},
				texts: {type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "text", sapGanttOrder: 0}
			}
		}
	});

	return CustomGroupTextBehind;
});
