// define overlap rectangle class
sap.ui.define(["sap/gantt/shape/Rectangle"], function (Rectangle) {
	"use strict";

	var OverlapRectangle = Rectangle.extend("sap.gantt.test.shape.OverlapRectangle", {});

	OverlapRectangle.prototype.getX = function (oRawData, oObjectInfo) {
		if (this.mShapeConfig.hasShapeProperty("x")){
			return this._configFirst("x", oRawData);
		}
		var oAxisTime = this.getAxisTime();
		return sap.ui.getCore().getConfiguration().getRTL() ? oAxisTime.timeToView(oRawData.start) - this.getWidth(oRawData, oObjectInfo) - 2 : oAxisTime.timeToView(oRawData.start) + 1;
	};

	OverlapRectangle.prototype.getY = function(oRawData, oObjectInfo){
		if (this.mShapeConfig.hasShapeProperty("y")){
			return this._configFirst("y", oRawData);
		}
		return this.getRowYCenter(oRawData, oObjectInfo) - this.getHeight(oRawData) + this.getStrokeWidth(oRawData);
	};

	OverlapRectangle.prototype.getWidth = function(oRawData, oObjectInfo){
		if (this.mShapeConfig.hasShapeProperty("width")){
			return this._configFirst("width", oRawData, oObjectInfo);
		}
		var oAxisTime = this.getAxisTime();
		var width = sap.ui.getCore().getConfiguration().getRTL() ?
				oAxisTime.timeToView(oRawData.start) - oAxisTime.timeToView(oRawData.start + oRawData.width) - 3 :
				oAxisTime.timeToView(oRawData.start + oRawData.width) - oAxisTime.timeToView(oRawData.start) - 3;
		if (width === 0 || width < 0 || !width ) {
			width = 1;
		}

		return width;
	};

	return OverlapRectangle;
}, true);
