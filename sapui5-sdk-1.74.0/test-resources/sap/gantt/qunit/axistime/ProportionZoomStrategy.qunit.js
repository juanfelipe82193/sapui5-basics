/*global QUnit */
sap.ui.define([
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/GanttChart",
	"sap/gantt/misc/Format",
	"sap/gantt/qunit/data/DataProducer"
], function (ProportionZoomStrategy, GanttChart, Format, DataProducer) {
	"use strict";
	var oDataProducer = new DataProducer();
	oDataProducer.produceData("RESOURCES");
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oDataProducer.getData("RESOURCES"));

	var oGanttChart = new GanttChart({
		shapeDataNames: ["activity"],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		},
		axisTimeStrategy: new ProportionZoomStrategy({
			coarsestTimeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["1month"],
			finestTimeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["5min"],
			timeLineOptions: sap.gantt.axistime.ProportionTimeLineOptions,
			timeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["2week"],
			zoomLevel: 10,
			zoomLevels: 20,
			totalHorizon: new sap.gantt.config.TimeHorizon({
				startTime: new Date(2015, 12, 1),
				endTime: new Date(2017, 11, 15)
			})
		})
	});
	oGanttChart.setModel(oModel, "test");
	oGanttChart.placeAt("content");

	QUnit.module("Create axistime.ProportionZoomStrategy.", {
		beforeEach: function () {

			this.oStrategy = new ProportionZoomStrategy({
				coarsestTimeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["1month"],
				finestTimeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["5min"],
				timeLineOptions: sap.gantt.axistime.ProportionTimeLineOptions,
				timeLineOption: sap.gantt.axistime.ProportionTimeLineOptions["2week"],
				zoomLevel: 10,
				zoomLevels: 20,
				totalHorizon: new sap.gantt.config.TimeHorizon({
					startTime: new Date(2015, 12, 1),
					endTime: new Date(2017, 11, 15)
				})
			});
			oGanttChart.setAxisTimeStrategy(this.oStrategy);
		}
	});

	QUnit.test("Test isLowerRowTickHourSensitive  function width customed configuration values.", function (assert) {
		var oCustomedVisibleHorizonStartTime = new Date(2016, 3, 21);
		var oCustomedVisibleHorizonEndTime = new Date(2016, 10, 15);
		this.oCustomedVisibleHorizon = new sap.gantt.config.TimeHorizon({
			startTime: oCustomedVisibleHorizonStartTime,
			endTime: oCustomedVisibleHorizonEndTime
		});
		this.oStrategy.setVisibleHorizon(this.oCustomedVisibleHorizon);
		var oStrategy = this.oStrategy;

		assert.strictEqual(oStrategy.getVisibleHorizon().getStartTime(), Format.dateToAbapTimestamp(oCustomedVisibleHorizonStartTime), "startTime is set successfully after setVisibleHorizon");
		assert.strictEqual(oStrategy.getVisibleHorizon().getEndTime(), Format.dateToAbapTimestamp(oCustomedVisibleHorizonEndTime), "endTime is set successfully after setVisibleHorizon");

		var done = assert.async();
		setTimeout(function () {
			// we need some time to wait for the time line option being updated
			// assert.strictEqual(oStrategy.getTimeLineOption(), sap.gantt.axistime.ProportionTimeLineOptions["2week"], "function getTimeLineOption which is set into GanttChart works successfully");
			assert.ok(!oStrategy.isLowerRowTickHourSensitive(), "isLowerRowTickHourSensitive works successfully");
			done();
		}, 500);
	});

	QUnit.test("test createAxisTime", function (assert) {
		var oCustomedTotolHorizonStartTime = new Date(2016, 11, 1);
		var oCustomedTotolHorizonEndTime = new Date(2017, 10, 17);
		this.oCustomedTotalHorizon = new sap.gantt.config.TimeHorizon({
			startTime: oCustomedTotolHorizonStartTime,
			endTime: oCustomedTotolHorizonEndTime
		});

		// set a new Totalhorizon will invoke createAxisTime
		this.oStrategy.setTotalHorizon(this.oCustomedTotalHorizon);
		this.oAxisTime = this.oStrategy.getAxisTime();
		assert.ok(this.oAxisTime instanceof sap.gantt.misc.AxisTime, "createAxisTime retval's type is correct");
		assert.strictEqual(oCustomedTotolHorizonStartTime.getTime(), this.oAxisTime.timeRange[0].getTime(), "oAxisTime's startTime is correct");
		assert.strictEqual(oCustomedTotolHorizonEndTime.getTime(), this.oAxisTime.timeRange[1].getTime(), "oAxisTime's endTime is correct");
		assert.strictEqual(this.oAxisTime.viewRange[0], 0, "oAxisTime's ViewRange startPoint is correct");
		assert.strictEqual(this.oAxisTime.viewRange[1], 1020, "oAxisTime's ViewRange endPoint is correct");
		assert.strictEqual(this.oAxisTime.locale, oGanttChart.getLocale(), "locale is correct");
	});

	QUnit.test("Test setZoomLevel setZoomLevels", function (assert) {
		var oReturn = this.oStrategy.setZoomLevel(2);
		assert.ok(oReturn instanceof ProportionZoomStrategy, "overwritten setZoomLevel return intance");
		this.oStrategy.setZoomLevels(3);
		assert.strictEqual(this.oStrategy.getProperty("zoomLevel"), 2, "setZoomLevel is correct");
		assert.strictEqual(this.oStrategy.getProperty("zoomLevels"), 3, "setZoomLevels is correct");
	});

	QUnit.test("Test updateStopInfo getTimeLineOption", function (assert) {
		var oStopInfo = {
			index: 100,
			text: "10 minutes interval"
		};

		this.oStrategy.updateStopInfo(oStopInfo);
		assert.strictEqual(this.oStrategy.getZoomLevel(), 100, "updateStopInfo works successfully");
	});

	QUnit.test("Test set total horizon", function (assert) {
		var oCurrentVisibleHorizon = this.oStrategy.getVisibleHorizon();
		this.oStrategy.setTotalHorizon(oCurrentVisibleHorizon);
		var done = assert.async();
		setTimeout(function () {
			//we must get the dom element just before we use it
			var $hsb = jQuery(oGanttChart.getTTHsbDom());
			assert.equal($hsb.scrollLeft(), 0, "Test HSB whether exists");
			done();
		}, 1000);
	});
});
