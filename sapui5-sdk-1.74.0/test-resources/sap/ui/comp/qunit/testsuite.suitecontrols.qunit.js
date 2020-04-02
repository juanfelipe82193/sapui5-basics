sap.ui.define(function() {
	"use strict";
	return {
		name: "QUnit TestSuite for sap.ui.comp Suite Controls",
		defaults: {
			bootCore: true,
			ui5: {
				language: "en-US",
				// Libraries to load upfront in addition to the library which is tested (sap.ui.export), if null no libs are loaded
				libs: "sap.ui.core,sap.m,sap.ui.comp",
				theme: "sap_fiori_3",
				noConflict: true,
				preload: "auto",
				"xx-waitForTheme": "init"
			},
			qunit: {
				version: 2,
				reorder: false
			},
			sinon: {
				version: 4,
				qunitBridge: true,
				useFakeTimers: false
			},
			// Which files to show in the coverage report, if null, no files are excluded from coverage
			coverage: {
				only: "//sap\/ui\/comp\/.*/"
			},
			module: "./{name}.qunit",
			autostart: false
		},
		tests: {
			SmartAreaMicroChart: {
				group: "SmartAreaMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartAreaMicroChart",
				module: [
					"./smartmicrochart/SmartAreaMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartArea.*/"
				}
			},
			SmartBulletMicroChart: {
				group: "SmartBulletMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartBulletMicroChart",
				module: [
					"./smartmicrochart/SmartBulletMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartBullet.*/"
				}
			},
			SmartColumnMicroChart: {
				group: "SmartColumnMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartColumnMicroChart",
				module: [
					"./smartmicrochart/SmartColumnMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartColumn.*/"
				}
			},
			SmartComparisonMicroChart: {
				group: "SmartComparisonMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartComparisonMicroChart",
				module: [
					"./smartmicrochart/SmartComparisonMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartComparison.*/"
				}
			},
			SmartDeltaMicroChart: {
				group: "SmartDeltaMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartDeltaMicroChart",
				module: [
					"./smartmicrochart/SmartDeltaMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartDelta.*/"
				}
			},
			SmartLineMicroChart: {
				group: "SmartLineMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartLineMicroChart",
				module: [
					"./smartmicrochart/SmartLineMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartLine.*/"
				}
			},
			SmartMicroChart: {
				group: "SmartMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartMicroChart",
				module: [
					"./smartmicrochart/SmartMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartMicro.*/"
				}
			},
			SmartMicroChartBase: {
				group: "SmartMicroChartBase",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartMicroChartBase",
				module: [
					"./smartmicrochart/SmartMicroChartBase.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartMicroChartBase.*/"
				}
			},
			SmartRadialMicroChart: {
				group: "SmartRadialMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartRadialMicroChart",
				module: [
					"./smartmicrochart/SmartRadialMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartRadial.*/"
				}
			},
			SmartHarveyBallMicroChart: {
				group: "SmartHarveyBallMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartHarveyBallMicroChart",
				module: [
					"./smartmicrochart/SmartHarveyBallMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartHarveyBall.*/"
				}
			},
			SmartStackedBarMicroChart: {
				group: "SmartStackedBarMicroChart",
				title: "QUnit: sap.ui.comp.smartmicrochart.SmartStackedBarMicroChart",
				module: [
					"./smartmicrochart/SmartStackedBarMicroChart.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmicrochart\/SmartStackedBar.*/"
				}
			},
			SmartMultiInput: {
				group: "SmartMultiInput",
				title: "QUnit: sap.ui.comp.smartmultiinput.SmartMultiInput",
				module: [
					"./smartmultiinput/Basic.qunit",
					"./smartmultiinput/FixedValuesWithBinding.qunit",
					"./smartmultiinput/FixedValuesWithoutBinding.qunit",
					"./smartmultiinput/SmartFormCustomData.qunit",
					"./smartmultiinput/WithBindingContext.qunit",
					"./smartmultiinput/WithoutBindingContext.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmultiinput\/.*/"
				},
				autostart: true
			},
			SmartMultiEdit: {
				group: "SmartMultiEdit",
				title: "QUnit: sap.ui.comp.smartmultiedit.SmartMultiEdit",
				module: [
					"./smartmultiedit/Container.qunit",
					"./smartmultiedit/Field.qunit",
					"./smartmultiedit/MultiContextCase.qunit",
					"./smartmultiedit/SingleContextCase.qunit",
					"./smartmultiedit/SpecialCases.qunit"
				],
				coverage: {
					only: "//sap\/ui\/comp\/smartmultiedit\/.*/"
				},
				autostart: true
			}
		}
	};
});
