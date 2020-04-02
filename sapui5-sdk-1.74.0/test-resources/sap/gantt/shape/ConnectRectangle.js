sap.ui.define([
	"sap/gantt/shape/Rectangle"
],function (Rectangle) {
	"use strict";

	var ConnectRectangle = Rectangle.extend("sap.gantt.test.shape.ConnectRectangle");

	ConnectRectangle.prototype.getRLSAnchors = function (oData, oRowInfo) {
		var _x = this.getX(oData, oRowInfo);
		var _y = this.getY(oData, oRowInfo);
		return {
			startPoint: {
				x: _x,
				y: _y + this.getHeight(oData) / 2,
				height: this.getHeight(oData)
			},
			endPoint: {
				x: _x + this.getWidth(oData, oRowInfo),
				y: _y + this.getHeight(oData) / 2,
				height: this.getHeight(oData)
			}
		};
	};

	return ConnectRectangle;
}, true);
