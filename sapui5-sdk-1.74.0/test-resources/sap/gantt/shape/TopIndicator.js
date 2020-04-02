sap.ui.define(["sap/gantt/shape/Rectangle"], function(Rectangle) {
	"use strict";

	var TopIndicator = Rectangle.extend("sap.gantt.test.shape.TopIndicator", {});

	var fnGetFillColor = function(util) {
		if (util === 0) {
			return "@sapUiChartPaletteQualitativeHue1";
		}
		if (util) {
			if (util <= 50) {
				return "@sapUiChartPaletteSemanticBad";
			} else if (util <= 90) {
				return "transparent";
			} else {
				return "@sapUiChartPaletteSemanticBadDark2";
			}
		} else {
			return "transparent";
		}
	};
	var fnGetStrokeColor = function(util) {
		if (!util || util > 50 && util <= 90) {
			return "transparent";
		} else {
			return "#FFF";
		}
	};
	TopIndicator.prototype.getFill = function(oRawData){
		if (this.mShapeConfig.hasShapeProperty("fill")) {
			return this._configFirst("fill", oRawData);
		}
		return fnGetFillColor(oRawData.util);
	};

	TopIndicator.prototype.getStroke = function (oRawData) {
		if (this.mShapeConfig.hasShapeProperty("stroke")) {
			return this._configFirst("stroke", oRawData);
		}
		return fnGetStrokeColor(oRawData.util);
	};

	TopIndicator.prototype.getY = function(oRawData, oObjectInfo){
		if (this.mShapeConfig.hasShapeProperty("y")){
			return this._configFirst("y", oRawData);
		}
		return oObjectInfo.y - this.getHeight(oRawData) + this.getStrokeWidth(oRawData);
	};

	return TopIndicator;
}, true);
