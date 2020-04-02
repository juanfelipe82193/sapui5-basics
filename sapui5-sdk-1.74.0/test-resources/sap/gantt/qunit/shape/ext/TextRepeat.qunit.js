/*global QUnit*/
sap.ui.define([
	"sap/gantt/config/Shape",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/GanttChart",
	"sap/gantt/shape/Group",
	"sap/gantt/shape/Rectangle",
	"sap/gantt/shape/ext/TextRepeat"
], function (ShapeConfig, TimeHorizon, GanttChart) {
	"use strict";

	QUnit.module("Create Shape by GanttChart.", {
		beforeEach: function () {
			this.oShapeConfig = new ShapeConfig({
				key: "activity",
				shapeDataName: "activity",
				shapeClassName: "sap.gantt.shape.Group",
				shapeProperties: {
					time: "{startTime}",
					endTime: "{endTime}",
					isDuration: true,
					enableDnD: true,
					referenceId: "{id}"
				},
				groupAggregation: [
					new ShapeConfig({
						shapeClassName: "sap.gantt.shape.ext.TextRepeat",
						shapeProperties: {
							time: "{startTime}",
							dy: "1.2em",
							width: 200,
							height: 16,
							text: "{description}"
						}
					}),
					new ShapeConfig({
						shapeClassName: "sap.gantt.shape.Rectangle",
						shapeProperties: {
							time: "{startTime}",
							endTime: "{endTime}",
							y: 3,
							fill: "url(#{id})"
						}
					}),
					new ShapeConfig({
						shapeClassName: "sap.gantt.shape.Rectangle",
						shapeProperties: {
							time: "{startTime}",
							endTime: "{endTime}",
							title: "{tooltip}",
							isDuration: true,
							yBias: 5,
							stroke: "#84caec",
							strokeWidth: 2,
							fill: "#fff"
						}
					})
				]
			});
			var oTimeAxisConfig = new sap.gantt.config.TimeAxis({
				planHorizon: new TimeHorizon({
					startTime: "20170101000000",
					endTime: "20171031000000"
				})
			});

			this.oGanttChart = new GanttChart({
				timeAxis: oTimeAxisConfig,
				shapes: [this.oShapeConfig]
			});

			this.oActivity = this.oGanttChart.getShapeInstance("activity");
			var aAggregations = this.oActivity.getShapes();
			for (var i = 0; i < aAggregations.length; i++) {
				if (aAggregations[i] instanceof sap.gantt.shape.ext.TextRepeat) {
					this.oTextRepeat = aAggregations[i];
					break;
				}
			}

			this.oData = {
				id: "activity_01",
				startTime: "20170216000000",
				endTime: "20170223000000",
				description: "Activity 01"
			};

			this.oRowInfo = {
				rowHeight: 32,
				y: 0,
				uid: "PATH:0000|SCHEME:ac_main[0]",
				data: {
					activity: [this.oData]
				}
			};
		},
		afterEach: function () {
			this.oActivity = undefined;
			this.oTextRepeat = undefined;
			this.oShapeConfig = undefined;
			this.oData = undefined;
			this.oRowInfo = undefined;
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test getter method of TextRepeat class.", function (assert) {
		assert.strictEqual(this.oTextRepeat.getChildTagName(this.oData, this.oRowInfo), "pattern");
		assert.strictEqual(this.oTextRepeat.getReferenceId(this.oData, this.oRowInfo), "activity_01");
		assert.strictEqual(this.oTextRepeat.getContent(this.oData, this.oRowInfo),
			"<pattern id='activity_01' patternUnits='userSpaceOnUse' width=200 height=16 x=1035.075907590759 y=0><text dx=0 dy=1.2em font-size=12 font-family=''>Activity 01</text></pattern>");
	});
});
