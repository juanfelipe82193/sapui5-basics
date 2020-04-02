// define resizing shadow class
sap.ui.define(["sap/gantt/shape/ResizeShadowShape"], function (ShadowShape) {
	"use strict";

	var ResizeShadowPath = ShadowShape.extend("sap.test.gantt.ResizeShadowPath", {});

	ResizeShadowPath.prototype.getStroke = function (oRawData) {
		return "red";
	};
	ResizeShadowPath.prototype.getFillOpacity = function (oRawData) {
		return 0;
	};
	ResizeShadowPath.prototype.getStrokeWidth = function (oRawData) {
		return 2;
	};
	ResizeShadowPath.prototype.getStrokeOpacity = function (oRawData) {
		return 0.5;
	};
	return ResizeShadowPath;
}, true);
