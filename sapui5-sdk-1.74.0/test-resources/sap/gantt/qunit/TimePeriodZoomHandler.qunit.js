/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/config/Shape",
	"sap/gantt/eventHandler/TimePeriodZoomHandler",
	"sap/gantt/qunit/data/DataProducer",
	"sap/gantt/shape/Rectangle"
], function (qutils, ShapeConfig, TimePeriodZoomHandler, DataProducer) {
	"use strict";

	var oShapeConfig = new ShapeConfig({
		key: "activity",
		shapeClassName: "sap.gantt.shape.Rectangle",
		shapeDataName: "activity",
		level: 10,
		shapeProperties: {
			time: "{startTime}",
			endTime: "{endTime}",
			fill: "#A52A2A",
			height: 21,
			rx: 10,
			ry: 10,
			yBias: 0.5,
			isDuration: true,
			enableDnD: true
		}
	});

	var oDataProducer = new DataProducer();
	oDataProducer.produceData();
	// create model and load data
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oDataProducer.getData("sap_hierarchy"));

	var oProportionZoomStrategy = new sap.gantt.axistime.ProportionZoomStrategy({
		totalHorizon: new sap.gantt.config.TimeHorizon({
			startTime: "20150918000000",
			endTime: "20161027000000"
		}),
		visibleHorizon: new sap.gantt.config.TimeHorizon({
			startTime: "20150918000000",
			endTime: "20151027000000"
		})
	});
	// create GanttChart
	var oGanttChart = new sap.gantt.GanttChart({
		axisTimeStrategy: oProportionZoomStrategy,
		shapeDataNames: ["activity"],
		shapes: [oShapeConfig],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});
	oGanttChart.setModel(oModel, "test");
	oGanttChart.placeAt("qunit-fixture");

	// qutils.delayTestStart(3000);

	var oTimePeriodZoomHandler = new TimePeriodZoomHandler(oGanttChart);
	oGanttChart._oTimePeriodZoomHandler = oTimePeriodZoomHandler;

	QUnit.test("Test Active Change", function (assert) {
		oTimePeriodZoomHandler.activate();
		assert.strictEqual(oTimePeriodZoomHandler.isActive(), true, "Test active mode");

		oTimePeriodZoomHandler.deactivate();
		assert.strictEqual(oTimePeriodZoomHandler.isActive(), false, "Test deactive mode");

		oTimePeriodZoomHandler.invertActiveStatus();
		assert.strictEqual(oTimePeriodZoomHandler.isActive(), true, "Test invert active mode");
	});

	QUnit.test("Test Handle Drag Start", function (assert) {
		var oFakeEvent = {
			type: "mousedown",
			clientX: 50,
			pageX: 50,
			offsetX: 40
		};
		oTimePeriodZoomHandler.handleDragStart(oFakeEvent);
		assert.strictEqual(oTimePeriodZoomHandler.isTimePeriodZoomEnabled(), true, "Test Handle Drag Start");
	});

	QUnit.test("Test Handle Dragging", function (assert) {
		var oFakeEvent = {
			type: "mousemove",
			clientX: 60,
			pageX: 60,
			offsetX: 40
		};
		oTimePeriodZoomHandler.handleDragging(oFakeEvent);
		assert.strictEqual(oTimePeriodZoomHandler.isActive(), true, "Test Handle Dragging: status");
	});

	QUnit.test("Test Handle End", function (assert) {
		var oOldStartTime = oGanttChart.getAxisTimeStrategy().getVisibleHorizon().getStartTime();
		var oFakeEvent = {
			type: "mouseup",
			clientX: 70,
			pageX: 70,
			offsetX: 40
		};
		oTimePeriodZoomHandler.handleDragEnd(oFakeEvent);
		var oCurrentVisibleHorizon = oGanttChart.getAxisTimeStrategy().getVisibleHorizon();
		assert.strictEqual(oTimePeriodZoomHandler.isActive(), false, "Test Handle End: status");
		assert.ok(oOldStartTime !== oCurrentVisibleHorizon.getStartTime(), "Test Handle End: start time");
	});
});
