sap.ui.define([
	"sap/gantt/simple/GanttRowSettings"
], function (GanttRowSettings) {
	"use strict";

	var CustomRowSettings = GanttRowSettings.extend("sap.gantt.sample.GanttChart2Sorting.CustomRowSettings", {
		metadata: {
			aggregations: {
				rectangles: {type: "sap.gantt.simple.BaseRectangle", multiple: true, singularName: "rectangle", sapGanttOrder: 0},
				chevrons: {type: "sap.gantt.simple.BaseChevron", multiple: true, singularName: "chevron", sapGanttOrder: 0},
				texts: {type: "sap.gantt.simple.BaseText", multiple: true, singularName: "text", sapGanttOrder: 1}
			}
		}
	});

	return CustomRowSettings;
});
