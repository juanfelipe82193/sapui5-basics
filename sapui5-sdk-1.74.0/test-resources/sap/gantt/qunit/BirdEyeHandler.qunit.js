
/*global QUnit */
sap.ui.define([
	"sap/gantt/GanttChartContainer",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/qunit/data/DataProducer",
	"sap/gantt/shape/Rectangle"
], function (GanttChartContainer, ProportionZoomStrategy, DataProducer) {
	"use strict";

	var oShapeConfig = new sap.gantt.config.Shape({
		key: "activity",
		shapeClassName: "sap.gantt.shape.Rectangle",
		shapeDataName: "activity",
		level: 10,
		countInBirdEye: true,
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

	var aToolbarSchemesConfig = [
		new sap.gantt.config.ToolbarScheme({
			key: "Global_VisibleRowsBirdEye",
			birdEye: new sap.gantt.config.BirdEyeGroup({
				position: "L1",
				overflowPriority: sap.m.OverflowToolbarPriority.Low,
				birdEyeRange: sap.gantt.config.BirdEyeRange.VisibleRows
			})
		}),
		new sap.gantt.config.ToolbarScheme({
			key: "Local_VisibleRowsBirdEye",
			birdEye: new sap.gantt.config.BirdEyeGroup({
				position: "L1",
				overflowPriority: sap.m.OverflowToolbarPriority.Low,
				birdEyeRange: sap.gantt.config.BirdEyeRange.VisibleRows
			})
		}),
		new sap.gantt.config.ToolbarScheme({
			key: "Local_AllRowsBirdEye",
			birdEye: new sap.gantt.config.BirdEyeGroup({
				position: "L1",
				overflowPriority: sap.m.OverflowToolbarPriority.Low,
				birdEyeRange: sap.gantt.config.BirdEyeRange.AllRows
			})
		})
	];

	var aContainerLayouts = [
		new sap.gantt.config.ContainerLayout({
			key: "layout",
			text: "TEST",
			toolbarSchemeKey: "Global_VisibleRowsBirdEye"
		})
	];

	// create GanttChart
	var oDataProducer = new DataProducer();
	oDataProducer.produceData();
	oDataProducer.produceData("TOL");

	var oProportionZoomStrategy1 = new ProportionZoomStrategy({
		totalHorizon: new sap.gantt.config.TimeHorizon({
			startTime: "20140918000000",
			endTime: "20160127000000"
		}),
		visibleHorizon: new sap.gantt.config.TimeHorizon({
			startTime: "20150918000000",
			endTime: "20151027000000"
		})
	});

	var oGanttChart1 = new sap.gantt.GanttChartWithTable({
		hierarchies: [
			new sap.gantt.config.Hierarchy({
				toolbarSchemeKey: "Local_VisibleRowsBirdEye",
				columns: [new sap.gantt.config.HierarchyColumn({
					key: "h1",
					title: "Unique ID",
					contentType: "1",
					sortAttribute: "uuid",
					filterAttribute: "uuid",
					attribute: "uuid"
				})]
			})
		],
		toolbarSchemes: aToolbarSchemesConfig,
		axisTimeStrategy: oProportionZoomStrategy1,
		shapeDataNames: ["activity"],
		shapes: [oShapeConfig],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});
	var oModel1 = new sap.ui.model.json.JSONModel();
	oModel1.setData(oDataProducer.getData("sap_hierarchy"));
	oGanttChart1.setModel(oModel1, "test");

	var oProportionZoomStrategy2 = new sap.gantt.axistime.ProportionZoomStrategy({
		totalHorizon: new sap.gantt.config.TimeHorizon({
			startTime: "20140918000000",
			endTime: "20160127000000"
		}),
		visibleHorizon: new sap.gantt.config.TimeHorizon({
			startTime: "20150918000000",
			endTime: "20151027000000"
		})
	});

	var oGanttChart2 = new sap.gantt.GanttChartWithTable({
		hierarchies: [
			new sap.gantt.config.Hierarchy({
				toolbarSchemeKey: "Local_AllRowsBirdEye",
				columns: [new sap.gantt.config.HierarchyColumn({
					key: "h1",
					title: "Unique ID",
					contentType: "1",
					sortAttribute: "uuid",
					filterAttribute: "uuid",
					attribute: "uuid"
				})]
			})
		],
		toolbarSchemes: aToolbarSchemesConfig,
		axisTimeStrategy: oProportionZoomStrategy2,
		shapeDataNames: ["activity"],
		shapes: [oShapeConfig],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});
	var oModel2 = new sap.ui.model.json.JSONModel();
	oModel2.setData(oDataProducer.getData("TOL"));
	oGanttChart2.setModel(oModel2, "test");

	var oGantt = new GanttChartContainer({
		toolbarSchemes: aToolbarSchemesConfig,
		containerLayouts: aContainerLayouts,
		containerLayoutKey: "layout",
		ganttCharts: [oGanttChart1, oGanttChart2]
	});
	oGantt.placeAt("qunit-fixture");
	sap.ui.getCore().applyChanges();

	QUnit.test("Test visible range bird eye", function (assert) {
		var done = assert.async();
		// assert.expect(2);

		setTimeout(function () {
			var oVisiblRowsBirdEyeButton = oGanttChart1._oToolbar._oBirdEyeButton;
			oVisiblRowsBirdEyeButton.firePress();

			var oCurrentVisibleHorizon = oGanttChart1._oGanttChart.getAxisTimeStrategy().getVisibleHorizon();
			assert.ok(oCurrentVisibleHorizon.getStartTime() < "20150919000000", "Start time false.");
			assert.ok(oCurrentVisibleHorizon.getEndTime() > "20151012000000", "End time false."); // lower because of IE
			done();
		}, 1000);
	});

	QUnit.test("Test container bird eye", function (assert) {

		var done = assert.async();
		// assert.expect(2);

		setTimeout(function () {
			var oContainerBirdEyeButton = oGantt._oToolbar._oBirdEyeButton;
			oContainerBirdEyeButton.firePress();

			var oCurrentVisibleHorizon = oGanttChart1._oGanttChart.getAxisTimeStrategy().getVisibleHorizon();
			assert.ok(oCurrentVisibleHorizon.getStartTime() < "20140920000000", "Start time false.");
			assert.ok(oCurrentVisibleHorizon.getEndTime() > "20151013000000", "End time false."); // lower because of IE
			done();
		}, 1000);
	});
});
