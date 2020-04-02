// define order shape for legend class
sap.ui.define(["sap/gantt/test/shape/OrderShape"], function (OrderShape) {
	"use strict";

	var LegendOrderShape = OrderShape.extend("sap.gantt.test.shape.LegendOrderShape", {
		metadata: {
			properties: {
				type: {type: "number"},
				status: {type: "number"}
			}
		}
	});

	LegendOrderShape.prototype.getType = function (oRawData) {
		if (this.mShapeConfig.hasShapeProperty("type")) {
			return this._configFirst("type", oRawData);
		}
		return oRawData.type;
	};

	LegendOrderShape.prototype.getStatus = function (oRawData) {
		if (this.mShapeConfig.hasShapeProperty("status")) {
			return this._configFirst("status", oRawData);
		}
		return oRawData.status;
	};

	LegendOrderShape.prototype.getWidth = function (oRawData) {
		if (this.mShapeConfig.hasShapeProperty("width")) {
			return this._configFirst("width", oRawData, true);
		}
		return oRawData.status;
	};

	LegendOrderShape.prototype.getAriaLabel = function (oRawData) {
		if (this.mShapeConfig.hasShapeProperty("ariaLabel")) {
			return this._configFirst("ariaLabel", oRawData);
		}
		return oRawData.xName + " " + oRawData.yName;
	};

	LegendOrderShape.prototype.getTitle = function (oRawData) {
		if (this.mShapeConfig.hasShapeProperty("title")) {
			return this._configFirst("title", oRawData);
		}
		return oRawData.xName + " " + oRawData.yName;
	};

	LegendOrderShape.prototype.getLegend = function(oData) {
		var sType = this.getType(oData), sStatus = this.getStatus(oData);
		if (sType == sap.gantt.DIMENSION_LEGEND_NIL) {
			switch (sStatus){
				case 0: return "Planned";
				case 1: return "Executed";
				case 2: return "In Execution";
			}
		}

		if (sStatus == sap.gantt.DIMENSION_LEGEND_NIL) {
			switch (sType){
				//for activity
				case 0: return "Travel";
				case 1: return "Loading";
				case 2: return "Unloading";
				case 3: return "Coupling";
				case 4: return "Uncoupling";
				//for order
				case 5: return "Freight Order";
			}
		}
		return "";
	};

	return LegendOrderShape;
}, true);
