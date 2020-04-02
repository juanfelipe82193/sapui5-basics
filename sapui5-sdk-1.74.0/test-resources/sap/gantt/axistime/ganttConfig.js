sap.ui.define([], function() {
	"use strict";

	return {
		shapeDataNames : ["top", "order", "milestone", "constraint", "relationship"],
		configShape: function() {

			var aShapes = [];

			sap.ui.define(["sap/gantt/shape/Group"], function (Group) {
				var RectangleGroup = Group.extend("sap.test.RectangleGroup");

				RectangleGroup.prototype.getRLSAnchors = function(oRawData, oObjectInfo) {
					var shapes = this.getShapes();
					var rectangleShapeClass;
					var _x, _y;

					for (var i in shapes) {
						if (shapes[i] instanceof sap.gantt.shape.Rectangle) {
							rectangleShapeClass = shapes[i];
						}
					}

					_x = rectangleShapeClass.getX(oRawData);
					_y = rectangleShapeClass.getY(oRawData, oObjectInfo) + rectangleShapeClass.getHeight() / 2;

					return {
						startPoint: {
							x: _x,
							y: _y,
							height:rectangleShapeClass.getHeight(oRawData)
						},
						endPoint: {
							x: _x + rectangleShapeClass.getWidth(oRawData),
							y: _y,
							height:rectangleShapeClass.getHeight(oRawData)
						}
					};
				};

				return RectangleGroup;
			}, true);

			sap.ui.define(["sap/gantt/shape/Rectangle"], function (Rectangle) {
				var shapeRectangle = Rectangle.extend("sap.test.shapeRectangle");

				shapeRectangle.prototype.getFill = function (oRawData) {
					switch (oRawData.level) {
					case "1":
						return "#FAC364";
					default:
						return "#5CBAE5";
					}
				};

				return shapeRectangle;
			}, true);

			sap.ui.define(["sap/gantt/shape/SelectedShape"], function (SelectedShape) {
				var selectRectange = SelectedShape.extend("sap.test.selectRectange");

				selectRectange.prototype.getStroke = function (oRawData) {
					switch (oRawData.level) {
					case "1":
						return "#B57506";
					default:
						return "#156589";
					}
				};
				selectRectange.prototype.getStrokeWidth = function () {
					return 2;
				};

				return selectRectange;
			});

			// define a milestone (diamond)
			sap.ui.define(["sap/gantt/shape/ext/Diamond", "sap/ui/core/Core"], function (Diamond, Core) {
				var milestone = Diamond.extend("sap.test.Milestone");
				return milestone;
			}, true);

			// define a constraint (triangle)
			sap.ui.define(["sap/gantt/shape/ext/Triangle", "sap/ui/core/Core"], function (Triangle, Core) {
				var constraint = Triangle.extend("sap.test.Constraint");
				return constraint;
			}, true);

			var oTopShape = new sap.gantt.config.Shape({
				key: "top",
				shapeDataName: "order",
				shapeClassName: "sap.test.shapeRectangle",
				selectedClassName: "sap.test.selectRectange",
				level: 5,
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					height: 20,
					isDuration: true,
					enableDnD: true
				}
			});

			var oOrderShape = new sap.gantt.config.Shape({
				key: "order",
				shapeDataName: "order",
				shapeClassName: "sap.test.RectangleGroup",
				selectedClassName: "sap.test.selectRectange",
				level: 5,
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					height: 20,
					isDuration: true,
					enableDnD: true
				},
				groupAggregation: [
					new sap.gantt.config.Shape({
						shapeClassName: "sap.test.shapeRectangle",
						selectedClassName: "sap.test.selectRectange",
						shapeProperties: {
							time: "{startTime}",
							endTime: "{endTime}",
							title: "{tooltip}",
							height: 20,
							isDuration: true,
							enableDnD: true
						}
					})
				]
			});
			// define a milestone config
			var oDiamondConfig = new sap.gantt.config.Shape({
				key: "diamond",
				shapeClassName: "sap.test.Milestone",
				shapeDataName: "milestone",
				level: 5,
				shapeProperties: {
					time: "{endTime}",
					strokeWidth: 2,
					title: "{tooltip}",
					verticalDiagonal: 18,
					horizontalDiagonal: 18,
					yBias: -1,
					fill: "#666666"
				}
			});
			// define a constraint config
			var oTriangleConfig = new sap.gantt.config.Shape({
				key: "triangle",
				shapeClassName: "sap.test.Constraint",
				shapeDataName: "constraint",
				level: 5,
				shapeProperties: {
					time: "{time}",
					strokeWidth: 1,
					title: "{tooltip}",
					fill: "#666666",
					rotationAngle: "{ratationAngle}",
					base: 6,
					height: 6,
					distanceOfyAxisHeight: 3,
					yBias: 7
				}
			});

			var oRelShape = new sap.gantt.config.Shape({
				key: "relationship",
				shapeDataName: "relationship",
				level: 30,
				shapeClassName: "sap.gantt.shape.ext.rls.Relationship",
				shapeProperties: {
					isDuration: false,
					lShapeforTypeFS: true,
					showStart: false,
					showEnd: true,
					stroke: "#848F94",
					strokeWidth: 1,
					type: "{relation_type}",
					fromObjectPath:"{fromObjectPath}",
					toObjectPath:"{toObjectPath}",
					fromDataId:"{fromDataId}",
					toDataId:"{toDataId}",
					fromShapeId:"{fromShapeId}",
					toShapeId:"{toShapeId}",
					title: "{tooltip}",
					id: "{guid}"
				}
			});

			aShapes = [oTopShape, oOrderShape, oDiamondConfig, oTriangleConfig, oRelShape];

			return aShapes;

		}
	};

});
