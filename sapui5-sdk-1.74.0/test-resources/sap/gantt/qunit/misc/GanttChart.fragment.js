sap.ui.define([
	"sap/gantt/GanttChart",
	"sap/gantt/config/Shape",
	"sap/gantt/def/SvgDefs",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/shape/Rectangle",
	"sap/gantt/shape/Group",
	"sap/gantt/test/shape/RectangleGroup"
], function(
	GanttChart,
	ShapeConfig,
	SvgDefs,
	SlashPattern,
	Rectangle
	){
	"use strict";

	var SimpleRectangle = Rectangle.extend("sap.gantt.test.shape.SimpleRectangle", {
		metadata: {
			properties: {
				enableDnD: {type: "boolean", defaultValue: "true"}
			}
		}
	});

	SimpleRectangle.prototype.getFill = function(oRawData) {
		var sFill = "@sapUiChart" + (oRawData.type + 1);
		if (oRawData.type === 2) {
			sFill = sap.ui.getCore().byId("pattern_slash_blue").getRefString();
		}
		return sFill;
	};

	SimpleRectangle.prototype.getStroke = function(oRawData) {
		return "darkgray";
	};

	SimpleRectangle.prototype.getStrokeWidth = function(oRawData) {
		return 1;
	};

	sap.ui.jsfragment("sap.gantt.qunit.misc.GanttChart", {
		createContent : function(oController) {

			var oSvgDefs = new SvgDefs({
				defs : [
					new SlashPattern("pattern_slash_blue", {
						stroke : "#008FD3"
					})
				]
			});

			var aShapeConfig = [
				new ShapeConfig({
					key: "ActivityKey",
					shapeDataName: "activity",
					modeKeys: ["D"],
					shapeClassName: "sap.gantt.test.shape.RectangleGroup",
					shapeProperties: {
						time: "{startTime}",
						endTime: "{endTime}",
						rx: 0,
						ry: 0,
						isDuration: true
					},
					groupAggregation: [
						new ShapeConfig({
							shapeClassName: "sap.gantt.test.shape.SimpleRectangle",
							shapeProperties: {
								time: "{startTime}",
								endTime: "{endTime}",
								title: "{tooltip}",
								rx: 0,
								ry: 0,
								isDuration: true
							}
						})
					]
				}),
				new ShapeConfig({
					key: "relationship",
					shapeDataName: "relationship",
					modeKeys: ["D"],
					level: 30,
					shapeClassName: "sap.gantt.shape.ext.rls.Relationship",
					shapeProperties: {
						isDuration: false,
						lShapeforTypeFS: true,
						showStart: false,
						showEnd: true,
						stroke: "{stroke}",
						strokeWidth: 1,
						type: "{relation_type}",
						fromObjectPath:"{fromObjectPath}",
						toObjectPath:"{toObjectPath}",
						fromDataId:"{fromDataId}",
						toDataId:"{toDataId}",
						fromShapeId:"{fromShapeId}",
						toShapeId:"{toShapeId}",
						title: "{tooltip}"
					}
				})
			];

			var oChart = new GanttChart({
				enableCursorLine: false,
				timeAxis: new sap.gantt.config.TimeAxis({
					planHorizon: new sap.gantt.config.TimeHorizon({
						startTime: "20140914000000",
						endTime: "20141101060610"
					}),
					initHorizon: new sap.gantt.config.TimeHorizon({
						startTime: "20140320121212",
						endTime: "20141027000000"
					})
				}),
				svgDefs: oSvgDefs,
				shapeDataNames: ["activity"],
				shapes: aShapeConfig,
				rows : {
					path : "test>/root",
					parameters : {
						arrayNames : [ "children" ]
					}
				},
				relationships:{
					path: "test>/root/relationships"
				}
			});
			var oModel = new sap.ui.model.json.JSONModel();
			oChart.setModel(oModel, "test");

			// oChart.placeAt("content");

			return oChart;
		}
	});
});
