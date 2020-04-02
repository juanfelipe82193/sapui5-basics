sap.ui.define(["sap/gantt/shape/SelectedShape"], function (SelectedShape) {
	"use strict";
	var CustomSelectedShape = SelectedShape.extend("sap.gantt.test.shape.CustomSelectedShape", {});


	var fnSelectionColor = function(type) {
		switch (type) {
			case 0:
				return "@sapUiChartPaletteSemanticNeutralDark2"; //black
			case 1:
				return "@sapUiChartCritical"; //yellow
			case 2:
				return "mediumpurple"; //light purple
			case 4:
				return "@sapUiChart5"; //purple
			case "TOL":
				return "@sapUiChart1"; //blue
			default:
				return "@sapUiChartBad"; //red
		}
	};

	CustomSelectedShape.prototype.getFill = function(oRawData, oConfig){
		return "none";
	};

	CustomSelectedShape.prototype.getStroke = function (oRawData) {
		return fnSelectionColor(oRawData.type);
	};
	CustomSelectedShape.prototype.getStrokeWidth = function (oRawData) {
		return 2;
	};

	return CustomSelectedShape;
}, true);
