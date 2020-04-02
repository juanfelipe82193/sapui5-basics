sap.ui.define(function() {

	"use strict";
	return {
		name: "TestSuite for sap.suite.ui.commons",
		defaults: {
			title: "{name} - sap.suite.ui.commons",
			bootCore: true,
			ui5: {
				libs: ["sap.suite.ui.commons", "sap.ui.commons"],
				theme: "sap_bluecrystal",
				noConflict: false,
				preload: "auto"
			},
			qunit: {
				version: 2,
				reorder: false
			},
			sinon: {
				version: "edge",
				qunitBridge: true,
				useFakeTimers: false
			},
			module: "./{name}.qunit"
		},
		tests: {
			BusinessCard: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			ChartTile: {
				title: "Chart Tile QUnit page",
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"]
				}
			},
			ColumnMicroChart: {
				title: "ColumnMicroChart QUnit page",
				ui5: {
					libs: ["sap.m", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					"xx-waitForTheme": "init"
				}
			},
			ComparisonChart: {
				title: "Comparison Chart QUnit page",
				ui5: {
					libs: ["sap.m", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					"xx-waitForTheme": "init"
				}
			},
			DateRangeScroller: {},
			DateRangeSlider: {},
			DateRangeSliderInternal: {},
			DeltaMicroChart: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en",
					"xx-waitForTheme": "init"
				}
			},
			DynamicContainer: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			FacetOverview: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			FeedAggregator: {},
			FeedItemHeader: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			FeedItemUtils: {},
			FeedTile: {
				ui5: {
					language: "en"
				}
			},
			GenericTile: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en"
				}
			},
			HarveyBallMicroChart: {
				ui5: {
					libs: ["sap.ui.commons", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					"xx-waitForTheme": "init"
				}
			},
			HeaderCell: {
				ui5: {
					libs: ["sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en"
				}
			},
			HeaderContainer: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en"
				}
			},
			InfoTile: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			JamContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			LaunchTile: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			LinkActionSheet: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			MicroAreaChart: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.microchart", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en",
					"xx-waitForTheme": "init"
				}
			},
			MonitoringContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			MonitoringTile: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			NewsContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			NoteTaker: {},
			NoteTakerCard: {
				ui5: {
					language: "en"
				}
			},
			NoteTakerFeeder: {
				ui5: {
					libs: ["sap.ui.commons", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			NumericContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					theme: "sap_belize",
					language: "en"
				}
			},
			NumericTile: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			PictureZoomIn: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			SplitButton: {},
			ThingCollection: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			ThreePanelThingInspector: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"]
				}
			},
			ThreePanelThingViewer: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"]
				}
			},
			TileContent: {
				ui5: {
					libs: ["sap.m", "sap.suite.ui.commons"],
					language: "en"
				}
			},
			UnifiedThingGroup: {},
			UnifiedThingInspector: {
				ui5: {
					libs: ["sap.m", "sap.ui.commons", "sap.suite.ui.commons"]
				}
			},
			VerticalNavigationBar: {
				ui5: {
					language: "en"
				}
			},
			ViewRepeater: {
				ui5: {
					libs: ["sap.ui.commons", "sap.ui.ux3", "sap.suite.ui.commons"],
					language: "en"
				}
			}
		}
	};
});
