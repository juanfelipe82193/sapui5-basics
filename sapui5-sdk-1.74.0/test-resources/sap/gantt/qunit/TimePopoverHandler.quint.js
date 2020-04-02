/*global QUnit */
sap.ui.require([
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/shape/Rectangle"
], function (qutils) {
	"use strict";

	var oData = {
		root: {
			id: "root",
			children: [
				{ // Row order number is 1
					text: "node1",
					id: "01",
					rectangle: [
						{
							id: "01_01",
							startTime: "20170801000000",
							endTime: "20170811000000"
						},
						{
							id: "01_02",
							startTime: "20170821000000",
							endTime: "20170831000000"
						}
					]
				}
			],
			timeIntervals: [
				{
					startTime: "20170821000000",
					endTime: "20170831000000"
				}
			]
		}
	};

	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oData);

	var oRectangleConfig = new sap.gantt.config.Shape({
		key: "rectangle",
		shapeClassName: "sap.gantt.shape.Rectangle",
		shapeDataName: "rectangle",
		level: 1,
		shapeProperties: {
			enableDnD: true,
			time: "{startTime}",
			endTime: "{endTime}",
			title: "rectangle"
		}
	});

	var oGanttChartWithTable = new sap.gantt.GanttChartWithTable({
		columns: [new sap.ui.table.Column({
			label: "Text",
			template: "text"
		})],
		timeAxis: new sap.gantt.config.TimeAxis({
			planHorizon: new sap.gantt.config.TimeHorizon({
				startTime: "20170501000000",
				endTime: "20171031000000"
			})
		}),
		height: "410px",
		shapeDataNames: [
			"rectangle"
		],
		shapes: [
			oRectangleConfig
		],
		rows: {
			path: "/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});

	oGanttChartWithTable.setModel(oModel);
	oGanttChartWithTable.placeAt('content');
	var oGanttChart = oGanttChartWithTable._oGanttChart;

	qutils.delayTestStart(1000);
	QUnit.test("Test time popover", function (assert) {

		var aSvgNode = d3.select(oGanttChart.getDomSelectorById("svg"));
		var $ShapeDom = aSvgNode.select("rect")[0][0];

		qutils.triggerMouseEvent($ShapeDom, "mousedown", 41, 15, 351, 165, 0);
		qutils.triggerMouseEvent($ShapeDom, "mousemove", 1350, 16, 370, 200, 0);
		qutils.triggerMouseEvent($ShapeDom, "mousemove", 1591, 15, 611, 199, 0);
		qutils.triggerMouseEvent($ShapeDom, "mousemove", 1430, 16, 450, 200, 0);

		var resData = oGanttChart._oTimePopoverHandler.oTimePopover.getModel("time").getData();
		var expData = {
			startNewDate: "2017-08-09 22:49:08",
			endNewDate: "2017-08-19 23:57:02",
			offsetX: -38,
			offsetY: -16,
			placement: "Right"
		};
		assert.deepEqual(resData, expData, "Test time popover successfully.");
	});

});
