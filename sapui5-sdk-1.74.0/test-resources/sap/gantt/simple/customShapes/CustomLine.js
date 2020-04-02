/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/simple/BaseLine",
	"sap/gantt/simple/GanttUtils",
	"sap/gantt/misc/Format"
], function (BaseLine, GanttUtils, Format) {
	"use strict";

	var CustomLine = BaseLine.extend("sap.gantt.simple.test.customShapes.CustomLine", {
		metadata: {
			properties: {
				height: {type: "float"}
			}
		}
	});

	CustomLine.prototype.getWidth = function () {
		var oAxisTime = this.getAxisTime();
		if (oAxisTime == null) { return 0; }

		var nRetVal,
			startTime = oAxisTime.timeToView(Format.abapTimestampToDate(this.getTime())),
			endTime = oAxisTime.timeToView(Format.abapTimestampToDate(this.getEndTime()));

		//if nRetVal is not numeric, return itself
		if (!jQuery.isNumeric(startTime) || !jQuery.isNumeric(endTime)) {
			return 0;
		}

		nRetVal = Math.abs(endTime - startTime);

		// set minimum width 1 to at least make the shape visible
		nRetVal = nRetVal <= 0 ? 1 : nRetVal;

		return nRetVal;
	}

	CustomLine.prototype.getX1 = function () {
		return GanttUtils.getValueX(this);
	};

	CustomLine.prototype.getY1 = function () {
		return this.getRowYCenter() + this.getHeight() / 2;
	};

	CustomLine.prototype.getX2 = function () {
		return this.getX1() + this.getWidth();
	};

	CustomLine.prototype.getY2 = function () {
		return this.getY1();
	};

	return CustomLine;
});
