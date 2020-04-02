/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/simple/BasePath",
	"sap/gantt/simple/GanttUtils"
], function (BasePath, GanttUtils) {
	"use strict";

	var CustomPath = BasePath.extend("sap.gantt.simple.test.customShapes.CustomPath", {
		metadata: {
			properties: {
				height: {type: "float"}
			}
		}
	});

	CustomPath.prototype.getWidth = function () {
		return this._iBaseRowHeight * 0.625;
	};

	CustomPath.prototype.getD = function() {
		var x = GanttUtils.getValueX(this);
		var sD = "M " + (x - this.getWidth() / 2) + " ";
		sD += (this.getRowYCenter() + this.getHeight() / 2) + " ";
		sD += "h " + this.getWidth();
		return sD;
	};

	return CustomPath;
});
