/*global QUnit */
sap.ui.define([
	"sap/gantt/def/SvgDefs",
	"sap/gantt/def/pattern/SlashPattern",
	"sap/gantt/qunit/data/DataProducer",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/test/shape/OrderShape",
	"sap/gantt/test/shape/CustomSelectedShape"
], function(SvgDefs, SlashPattern, DataProducer, qutils) {
	"use strict";


	var oSvgDefs = new SvgDefs({
		defs: [new SlashPattern("pattern_slash_grey", {
			stroke: "#CAC7BA"
		}), new SlashPattern("pattern_slash_blue", {
			stroke: "#008FD3"
		}), new SlashPattern("pattern_slash_green", {
			stroke: "#99D101"
		}), new SlashPattern("pattern_slash_orange", {
			stroke: "#F39B02"
		}), new SlashPattern("pattern_slash_lightblue", {
			stroke: "#9FCFEB"
		})]
	});

	var aChartSchemesConfig = [
		new sap.gantt.config.ChartScheme({
			key: "ac_main",
			rowSpan: 1,
			shapeKeys: ["order", "order_overlap_shortage", "order_overlap_meet", "order_overlap_surplus", "ActivityKey", "activity_overlap", "phase", "task", "calendar"] //, "dt", "warning"
		}), new sap.gantt.config.ChartScheme({
			key: "ubc_hr",
			rowSpan: 2,
			modeKey: "C",
			shapeKeys: ["ubc"]
		}), new sap.gantt.config.ChartScheme({
			key: "ulc_main",
			name: "Utilization",
			icon: "./image/utilization.png",
			rowSpan: 2,
			modeKey: "U",
			haveBackground: true,
			shapeKeys: ["ulc"]
		}),
		new sap.gantt.config.ChartScheme({
			key: "ac_expand_overlap",
			name: "Overlaps",
			icon: "./image/overlap.png",
			rowSpan: 1,
			shapeKeys: ["order_greedy", "activity_greedy"]
		}),
		new sap.gantt.config.ChartScheme({
			key: "ubc_expand_hr",
			name: "Details",
			icon: "./image/overlap.png",
			rowSpan: 1,
			modeKey: "C",
			shapeKeys: ["activity_greedy", "ubc_overcapacity_projection"]
		})
	];

	var oDataProducer = new DataProducer();
	oDataProducer.produceData("RESOURCES");
	// create model and load data
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oDataProducer.getData("RESOURCES"));

	// create GanttChart
	var oGanttChart = new sap.gantt.GanttChart({
		timeAxis: new sap.gantt.config.TimeAxis({
			planHorizon: new sap.gantt.config.TimeHorizon({
				startTime: "20140912000000",
				endTime: "20151027060610"
			}),
			initHorizon: new sap.gantt.config.TimeHorizon({
				startTime: "20140920121212",
				endTime: "20141027000000"
			})
		}),
		chartSchemes: aChartSchemesConfig,
		svgDefs: oSvgDefs,
		shapeDataNames: ["activity"],
		shapes: [new sap.gantt.config.Shape({
			key: "activity",
			shapeDataName: "activity",
			shapeClassName: "sap.gantt.test.shape.OrderShape",
			selectedClassName: "sap.gantt.test.shape.CustomSelectedShape",
			shapeProperties: {
				time: "{startTime}",
				endTime: "{endTime}",
				title: "{tooltip}",
				rx: 0,
				ry: 0,
				isDuration: true
			}
		})],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});
	oGanttChart.setTimeZoomRate(1);
	oGanttChart.setModel(oModel, "test");
	oGanttChart.placeAt("content");
	oGanttChart.handleExpandChartChange(true, aChartSchemesConfig, [0, 1]);

	// qutils.delayTestStart(8000);
	QUnit.module("Gantt Chart - Basic Rendering Test");

	QUnit.test("Gantt Chart set timeAxis", function (assert) {
		var oNewTimeAxis = new sap.gantt.config.TimeAxis({
			planHorizon: sap.gantt.config.DEFAULT_PLAN_HORIZON
		});

		oGanttChart.setTimeAxis(oNewTimeAxis);
		var oCurrentVisibleHorizon = oGanttChart.getAxisTimeStrategy().getVisibleHorizon();

		assert.strictEqual(oCurrentVisibleHorizon.getStartTime(), sap.gantt.config.DEFAULT_INIT_HORIZON.getStartTime(), "Set initHorizon without start time and end time failed: start time not equal");
		assert.strictEqual(oCurrentVisibleHorizon.getEndTime(), sap.gantt.config.DEFAULT_INIT_HORIZON.getEndTime(), "Set initHorizon without start time and end time failed: end time not equal");
	});

	QUnit.test("Gantt Chart Rendering Ok", function (assert) {
		var done = assert.async();
		setTimeout(function () {
			assert.equal(oGanttChart.$().find(".sapGanttChartSvg").length, 1, "Chart SVG created correctly");
			done();
		}, 1000);
	});

	QUnit.test("Test for setZoomRate function", function (assert) {

		var oStrategy = oGanttChart.getAxisTimeStrategy(),
			oOldStartTime = oStrategy.getVisibleHorizon().getStartTime(),
			oOldEndTime = oStrategy.getVisibleHorizon().getEndTime();

		var done = assert.async();
		setTimeout(function () {
			oGanttChart.setTimeZoomRate(0.7);
			var oNewHorizon = oStrategy.getVisibleHorizon();
			assert.ok((oOldStartTime !== oNewHorizon.getStartTime()) || (oOldEndTime !== oNewHorizon.getEndTime()), "visibleHorizon start and end time changed after setZoomRate");
			done();
		}, 1000);

	});

	QUnit.test("Gantt Chart _prepareHorizontalDrawingRange", function (assert) {
		var bReady = oGanttChart._prepareHorizontalDrawingRange();
		var iVisibleWidth = oGanttChart.getVisibleWidth();

		if (bReady) {
			assert.ok(oGanttChart._oStatusSet.nWidth >= iVisibleWidth, "nWidth should be no less than iVisibleWidth");
		} else {
			assert.ok(true, "OK");
		}

	});

	QUnit.test("(RTL mode) Gantt Chart _prepareHorizontalDrawingRange", function (assert) {
		sap.ui.getCore().getConfiguration().setRTL(true);
		var bReady = oGanttChart._prepareHorizontalDrawingRange();
		var iVisibleWidth = oGanttChart.getVisibleWidth();

		if (bReady) {
			assert.ok(oGanttChart._oStatusSet.nWidth >= iVisibleWidth, "nWidth should be no less than iVisibleWidth");
		} else {
			assert.ok(true, "OK");
		}
		sap.ui.getCore().getConfiguration().setRTL(false);
	});

	QUnit.module("shapeSelectionMode property", {
		beforeEach: function () {
			this.oGanttChart = new sap.gantt.GanttChart();
		},
		afterEach: function () {
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test for getShapeSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChart.getShapeSelectionMode(), "Equal to default");

		this.oGanttChart.setProperty("shapeSelectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChart.getShapeSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setShapeSelectionMode function", function (assert) {
		this.oGanttChart.setShapeSelectionMode("None");
		assert.strictEqual("None", this.oGanttChart.getProperty("shapeSelectionMode"), "Changed to expectation");
	});

	//Test for deprecated function
	QUnit.module("selectionMode property", {
		beforeEach: function () {
			this.oGanttChart = new sap.gantt.GanttChart();
		},
		afterEach: function () {
			this.oGanttChart.destroy();
		}
	});

	QUnit.test("Test for getSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChart.getSelectionMode(), "Equal to default");

		this.oGanttChart.setProperty("selectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChart.getSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setSelectionMode function", function (assert) {
		this.oGanttChart.setSelectionMode("None");
		assert.strictEqual("None", this.oGanttChart.getProperty("selectionMode"), "Changed to expectation");
	});
}, false);
