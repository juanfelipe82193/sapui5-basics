sap.ui.define([
	"sap/gantt/simple/BasePath"
], function (BasePath) {
	"use strict";

	var CustomShape = BasePath.extend("sap.gantt.sample.GanttChart2CustomShape.CustomShape", {
		metadata: {
			properties: {
				type: {type: "int", defaultValue: 1}
			}
		}
	});

	CustomShape.prototype.getD = function () {
		if (this.getType() === 1) {
			return this._getType1D();
		} else {
			return this._getType2D();
		}
	};

	CustomShape.prototype._getType1D = function () {
		var iYCenter = this.getRowYCenter(),
			iXCenter = this.getXByTime(this.getTime()),
			iHeight = this._iBaseRowHeight - 10,
			iBottom = iYCenter + iHeight / 2,
			iTop = iYCenter;

		return "M " + iXCenter + " " + iBottom + " L " + (iXCenter + 5) + " " + iTop + " L " + (iXCenter - 5) + " " +
			iTop + " Z";
	};

	CustomShape.prototype._getType2D = function () {
		var iYCenter = this.getRowYCenter(),
			iXStart = this.getXByTime(this.getTime()),
			iXEnd = this.getXByTime(this.getEndTime()),
			iHeight = this._iBaseRowHeight - 10,
			iBottom = iYCenter + iHeight / 2,
			iTop = iYCenter - iHeight / 2;

		return "M " + iXStart + " " + iBottom + " Q " + (iXStart - 10) + " " + iYCenter + " " + iXStart + " " + iTop +
			" L " + iXEnd + " " + iTop + " Q " + (iXEnd + 10) + " " + iYCenter + " " + iXEnd + " " + iBottom + " Z";
	};

	return CustomShape;
});
