// define overlap rectangle class
sap.ui.define(["sap/gantt/shape/Path"], function(Rectangle) {
	"use strict";

	var OverlapProjectionPath = Rectangle.extend("sap.test.gantt.OverlapProjectionPath", {});

	OverlapProjectionPath.prototype.getIsClosed = function (oRawData) {
		if (this.mShapeConfig.hasShapeProperty("isClosed")) {
			return this._configFirst("isClosed", oRawData);
		}
		return true;
	};

	OverlapProjectionPath.prototype.getFill = function (oRawData) {
		return "@sapUiChartBad";
	};

	OverlapProjectionPath.prototype.getStrokeWidth = function (oRawData) {
		return 4;
	};

	OverlapProjectionPath.prototype.getStrokeColor = function (oRawData, oProperty) {
		return "@sapUiChartBad";
	};

	OverlapProjectionPath.prototype.getD = function (oRawData, oObjectInfo) {
		var path = "";
		var drawData = [];
		if (oRawData.overlapLines && oRawData.overlapLines.length > 0) {
			drawData = oRawData.overlapLines;
		} else if (oRawData.ubc_overcapacity && oRawData.ubc_overcapacity.length > 0) {
			drawData = oRawData.ubc_overcapacity;
		}
		var oAxisTime = this.getAxisTime();
		var y1 = this._getY1(oRawData, oObjectInfo);
		var y2 = this._getY2(oRawData, oObjectInfo);
		for (var i = 0; i < drawData.length; i++) {
			var x1 = this._getX1(drawData[i], oAxisTime);
			var x2 = this._getX2(drawData[i], oAxisTime);
			path += ("M " + x1 + " " + y1 + " l " + (x2 - x1) + " 0 " + "l " + "0 " + (y2 - y1) + " l " + (x1 - x2) + " 0 z");
		}

		return path;
	};

	OverlapProjectionPath.prototype._getX1 = function (oRawData, oXAxis) {
		var strokeWidth = this.getStrokeWidth(oRawData);
		if (oRawData.start) {
			return oXAxis.timeToView(oRawData.start) + strokeWidth / 2;
		}
		return oXAxis.timeToView(sap.gantt.misc.Format.abapTimestampToDate(oRawData.start_date)) + strokeWidth / 2;
	};

	OverlapProjectionPath.prototype._getX2 = function (oRawData, oXAxis) {
		var strokeWidth = this.getStrokeWidth(oRawData);
		if (oRawData.start && oRawData.width) {
			return oXAxis.timeToView(oRawData.start + oRawData.width) - strokeWidth / 2;
		}

		return oXAxis.timeToView(sap.gantt.misc.Format.abapTimestampToDate(oRawData.end_date)) - strokeWidth / 2;
	};

	OverlapProjectionPath.prototype._getY1 = function (oRawData, oObjectInfo) {
		return oObjectInfo.y;
	};

	OverlapProjectionPath.prototype._getY2 = function (oRawData, oObjectInfo) {
		return oObjectInfo.y + oObjectInfo.rowHeight;
	};

	return OverlapProjectionPath;
}, true);
