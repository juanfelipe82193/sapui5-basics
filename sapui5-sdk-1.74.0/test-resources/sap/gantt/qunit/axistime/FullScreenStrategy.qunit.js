/*global QUnit */
sap.ui.define("FullScreenStrategyTestCase", [
	"sap/gantt/axistime/FullScreenStrategy",
	"sap/gantt/GanttChart",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/qunit/data/DataProducer"
], function (FullScreenStrategy, GanttChart, TimeHorizon, DataProducer) {
	"use strict";

	var oDataProducer = new DataProducer();
	oDataProducer.produceData("RESOURCES");
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oDataProducer.getData("RESOURCES"));

	var oStrategy = new FullScreenStrategy({
		visibleHorizon: new TimeHorizon({
			startTime: "20150918000000",
			endTime: "20151027000000"
		}),
		coarsestTimeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["5min"],
		finestTimeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["1month"],
		timeLineOptions: sap.gantt.config.DEFAULT_TIME_ZOOM_STRATEGY,
		timeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["30min"]
	});
	var oGanttChart = new GanttChart({
		axisTimeStrategy: oStrategy,
		shapeDataNames: ["activity"],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});
	oGanttChart.setModel(oModel, "test");
	oGanttChart.placeAt("content");
	QUnit.module("Create axistime.FullScreenStrategy.");

	QUnit.test("Test initial visible horizon.", function (assert) {
		var oVisibleHorizon = oStrategy.getVisibleHorizon();

		assert.strictEqual(oVisibleHorizon.getStartTime(), "20150918000000");
		assert.strictEqual(oVisibleHorizon.getEndTime(), "20151027000000");
	});

	QUnit.test("Test syncContext function.", function (assert) {
		var oSyncResult = oStrategy.syncContext(400);

		assert.ok(!oSyncResult.zoomLevelChanged, "zoomLevelChanged is correct");
		assert.ok(oSyncResult.axisTimeChanged, "axisTimeChanged is correct");
	});

	QUnit.test("Test setVisibleHorizon function", function (assert) {
		oStrategy.attachEvent("_redrawRequest", function (oEvent){
			assert.strictEqual(oEvent.getParameter("forceUpdate"), true, "forceUpdate is correct");
			assert.strictEqual(oEvent.getParameter("reasonCode"), "visibleHorizonUpdated", "reasonCode is correct");
		});
		var oCustomedVisibleHorizonStartTime = new Date(2016, 9, 21);
		var oCustomedVisibleHorizonEndTime = new Date(2019, 10,15);
		var oCustomedVisibleHorizon = new sap.gantt.config.TimeHorizon({
			startTime: oCustomedVisibleHorizonStartTime,
			endTime: oCustomedVisibleHorizonEndTime
		});

		oStrategy.setVisibleHorizon(oCustomedVisibleHorizon);

		var oVisibleHorizon = oStrategy.getVisibleHorizon();
		var oTotalHorizon = oStrategy.getTotalHorizon();
		assert.strictEqual(oVisibleHorizon.getStartTime(), oTotalHorizon.getStartTime(), "start time is same");
		assert.strictEqual(oVisibleHorizon.getEndTime(), oTotalHorizon.getEndTime(), "end time is same");
	});

	QUnit.test("Test default configuration values.", function (assert) {
		oStrategy = new FullScreenStrategy();
		assert.strictEqual(oStrategy.getCoarsestTimeLineOption(), sap.gantt.axistime.ProportionTimeLineOptions["1month"], "coarsestTimeLineOption's defaultvalue is correct");
		assert.strictEqual(oStrategy.getFinestTimeLineOption(), sap.gantt.axistime.ProportionTimeLineOptions["5min"], "finestTimeLineOption's defaultvalue is correct");
		assert.strictEqual(oStrategy.getTimeLineOptions(), sap.gantt.axistime.ProportionTimeLineOptions, "TimeLineOptions's defaultvalue is correct");
		assert.strictEqual(oStrategy.getTimeLineOption(), sap.gantt.axistime.ProportionTimeLineOptions["4day"], "TimeLineOption's defaultvalue is correct");
		assert.strictEqual(oStrategy.getMouseWheelZoomType(), sap.gantt.MouseWheelZoomType.None, "mouseWheelZoomType defaultvalue is correct");
	});
	QUnit.test("Test setMouseWheelZoomType method", function(assert) {
		var result = oStrategy.setMouseWheelZoomType(sap.gantt.MouseWheelZoomType.FineGranular);
		assert.deepEqual(result, oStrategy, "setter method return 'this' correctly.");
		assert.strictEqual(oStrategy.getMouseWheelZoomType(), sap.gantt.MouseWheelZoomType.None, "mouseWheelZoomType value is not changed.");
	});
});
