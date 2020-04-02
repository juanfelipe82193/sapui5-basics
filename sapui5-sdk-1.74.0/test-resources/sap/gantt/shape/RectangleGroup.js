sap.ui.define(["sap/gantt/shape/Group" ,"sap/gantt/shape/Rectangle"], function(Group, Rectangle) {
	"use strict";

	var RectangleGroup = Group.extend("sap.gantt.test.shape.RectangleGroup",{});

	RectangleGroup.prototype.getRLSAnchors = function(oRawData, oObjectInfo){
			var shapes = this.getShapes();
			var rectangleShapeClass;
			for (var i in shapes){
				if (shapes[i] instanceof Rectangle){
					rectangleShapeClass = shapes[i];
					break;
				}
			}

			var _x = rectangleShapeClass.getX(oRawData, oObjectInfo);
			var _y = rectangleShapeClass.getY(oRawData, oObjectInfo) + rectangleShapeClass.getHeight() / 2;
			return {
				startPoint: {
					x: _x,
					y: _y,
					height: rectangleShapeClass.getHeight(oRawData, oObjectInfo)
				},
				endPoint: {
					x: _x + rectangleShapeClass.getWidth(oRawData, oObjectInfo),
					y: _y,
					height:rectangleShapeClass.getHeight(oRawData, oObjectInfo)
				}
			};
	};
	return RectangleGroup;
}, true);
