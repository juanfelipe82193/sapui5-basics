sap.ui.define([
	"sap/gantt/simple/BasePath"
], function (BasePath) {
	"use strict";

	var CustomPath = BasePath.extend("sap.gantt.sample.GanttChart2Shapes.CustomPath");

	CustomPath.prototype.getD = function () {
		var oAxisTime = this.getAxisTime(),
			iXStart = oAxisTime.timeToView(this.getTime()),
			iXEnd = oAxisTime.timeToView(this.getEndTime()),
			iYCenter = this.getRowYCenter();

		return "M " + iXStart + " " + iYCenter + " L " + iXEnd + " " + (iYCenter - 10) +
			" L " + iXEnd + " " + (iYCenter + 10) + " L " + iXStart + " " + iYCenter;
	};

	return CustomPath;
});
