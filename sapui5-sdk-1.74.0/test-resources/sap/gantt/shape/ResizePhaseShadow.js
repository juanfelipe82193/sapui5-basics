//defined a resize shadow shape for phase
sap.ui.define(["sap/gantt/shape/ResizeShadowShape"], function (ShadowShape) {
	"use strict";

	var ResizePhaseShadow = ShadowShape.extend("sap.test.gantt.ResizePhaseShadow", {});
	ResizePhaseShadow.prototype.getStroke = function (oRawData) {
		return "black";
	};
	ResizePhaseShadow.prototype.getFillOpacity = function (oRawData) {
		return 1;
	};
	ResizePhaseShadow.prototype.getStrokeWidth = function (oRawData) {
		return 3;
	};
	ResizePhaseShadow.prototype.getStrokeOpacity = function (oRawData) {
		return 1;
	};
	return ResizePhaseShadow;
}, true);
