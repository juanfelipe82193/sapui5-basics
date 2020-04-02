sap.ui.define(function() {

	"use strict";
	return {
		name: "QUnit TestSuite for sap.suite.ui.microchart",
		defaults: {
			bootCore: true,
			ui5: {
				language: "en-US",
				libs: "sap.ui.core,sap.m,sap.suite.ui.microchart",
				theme: "sap_belize",
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
			coverage: {
				only: "//sap\/suite\/ui\/microchart\/.*/"
			},
			module: "./{name}.qunit"
		},
		tests: {
			AreaMicroChart: {
				title: "QUnit: sap.suite.ui.microchart.AreaMicroChart",
				ui5: {
					theme: "sap_bluecrystal"
				}
			},
			BulletMicroChart: {
				title: "QUnit: sap.suite.ui.microchart.BulletMicroChart",
				ui5: {
					theme: "sap_bluecrystal"
				}
			},
			ColumnMicroChart: {
				title: "QUnit: sap.suite.ui.microchart.ColumnMicroChart",
				ui5: {
					theme: "sap_bluecrystal"
				}
			},
			ComparisonMicroChart: {
				title: "QUnit: sap.suite.ui.microchart.ComparisonMicroChart"
			},
			DeltaMicroChart: {
				title: "QUnit: sap.suite.ui.microchart.DeltaMicroChart",
				coverage: {
					only: "//sap\/suite\/ui\/microchart\/Delta.*/"
				},
				ui5: {
					theme: "sap_bluecrystal",
					language: "en-US"
				}
			},
			ExploredSamples: {
				title: "Test Page for 'Explored' samples from sap.suite.ui.microchart",
				loader: {
					paths: {
						"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
					}
				},
				runAfterLoader: "sap/ui/demo/mock/qunit/SampleTesterErrorHandler",
				qunit: {
					version: 2
				},
				sinon: {
					version: 1 // because SDK samples implicitly use MockServer
				},
				ui5: {
					libs: ["sap.ui.layout", "sap.m", "sap.suite.ui.microchart", "sap.ui.documentation"],
					theme: "sap_bluecrystal",
					"xx-componentPreload": "off"
				},
				autostart: false
			},
			HarveyBallMicroChart: {
				title: "QUnit: sap.suite.ui.microchart.HarveyBallMicroChart",
				ui5: {
					theme: "sap_bluecrystal"
				}
			},
			HarveyBallMicroChartItem: {
				title: "QUnit: sap.suite.ui.microchart.HarveyBallMicroChartItem"
			},
			InteractiveBarChart: {
				title: "QUnit: sap.suite.ui.microchart.InteractiveBarChart"
			},
			InteractiveBarChartBar: {
				title: "qUnit Page for sap.suite.ui.microchart.InteractiveBarChartBar"
			},
			InteractiveDonutChart: {
				title: "qUnit Page for sap.suite.ui.microchart.InteractiveDonutChart"
			},
			InteractiveDonutChartSegment: {
				title: "qUnit Page for sap.suite.ui.microchart.InteractiveDonutChartSegment"
			},
			InteractiveLineChart: {
				title: "qUnit Page for sap.suite.ui.microchart.InteractiveLineChart"
			},
			InteractiveLineChartPoint: {
				title: "qUnit Page for sap.suite.ui.microchart.InteractiveLineChartPoint"
			},
			LineMicroChart: {
				title: "QUnit: sap.suite.ui.microchart.LineMicroChart"
			},
			RadialMicroChart: {
				title: "qUnit Page for sap.suite.ui.microchart.RadialMicroChart",
				ui5: {
					theme: "sap_bluecrystal"
				}
			},
			StackedBarMicroChart: {
				title: "QUnit: sap.suite.ui.microchart.StackedBarMicroChart"
			},
			library: {
				title: "QUnit: library - sap.suite.ui.microchart",
				ui5: {
					libs: "sap.suite.ui.microchart, sap.m, sap.ui.layout, sap.ui.comp, sap.ui.fl"
				}
			}
		}
	};
});
