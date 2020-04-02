sap.ui.define(["sap/gantt/shape/Rectangle"], function (Rectangle) {
	"use strict";

	var OrderShape = Rectangle.extend("sap.gantt.test.shape.OrderShape", {});

	var fnOrderTypeColor = function(type) {
		// 1: Truck, 2: Trailer, 3: Handling Resource, 4: Driver
		switch (type) {
			case 0:
				return "@sapUiChartPaletteSequentialNeutralLight1";
			case 1:
				return "@sapUiChartSequence1";
			case 2:
				return "@sapUiChartSequence2";
			case 3:
				return "@sapUiChartSequence3";
			case 4:
				return "@sapUiChartPaletteSequentialHue1Light2";
			default:
				return "@sapUiChartCritical";
		}
	};

	OrderShape.prototype.getFill = function(oRawData){
		if (this.mShapeConfig.hasShapeProperty("fill")) {
			return this._configFirst("fill", oRawData);
		}

		if (oRawData.status === 0) {
			return "white";
		} else if (oRawData.status === 1) {
			return fnOrderTypeColor(oRawData.type);
		} else if (oRawData.status === 2) {
			switch (oRawData.type) {
			case 0:
				return sap.ui.getCore().byId("pattern_slash_grey").getRefString();
			case 1:
				return sap.ui.getCore().byId("pattern_slash_blue").getRefString();
			case 2:
				return sap.ui.getCore().byId("pattern_slash_green").getRefString();
			case 3:
				return sap.ui.getCore().byId("pattern_slash_orange").getRefString();
			case 4:
				return sap.ui.getCore().byId("pattern_slash_lightblue").getRefString();
			default:
				return sap.ui.getCore().byId("pattern_slash_grey").getRefString();
			}
		}
	};

	OrderShape.prototype.getStroke = function (oRawData) {
		if (this.mShapeConfig.hasShapeProperty("stroke")) {
			return this._configFirst("stroke", oRawData);
		}
		return fnOrderTypeColor(oRawData.type);
	};

	OrderShape.prototype.getTitle = function(oRawData){
		if (oRawData.tooltip){
			return oRawData.tooltip;
		} else {
			return oRawData.startTime;
		}
	};

	return OrderShape;
}, true);
