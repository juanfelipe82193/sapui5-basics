sap.ui.define(function() {

	"use strict";

	return {
		name: "QUnit TestSuite for sap.gantt 1.x",

		/**
		 * An Object with default settings for all tests.
		 *
		 * The defaults and the test configuration will be merged recursively in a way
		 * that the merge contains properties from both, defaults and test config;
		 * if a property is defined by both config objects, the value from the test config will be used.
		 * There's no special handling for other types of values, e.g an array value in the defaults
		 * will be replaced by an array value in the test config.
		 */
		defaults: {
			group: "Control",
			qunit: {
				version: 2                  // Whether QUnit should be loaded and if so, what version
			},
			sinon: {
				version: 1                  // Whether Sinon should be loaded and if so, what version
			},
			ui5: {
				language: "en-US",
				rtl: false,                 // Whether to run the tests in RTL mode
				libs: [
					"sap.gantt"
				],                          // Libraries to load upfront in addition to the library which is tested (sap.ui.table), if null no libs are loaded
				"xx-waitForTheme": true     // Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only:	["sap/gantt"],      // Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true        // Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/gantt/qunit": "test-resources/sap/gantt/qunit/",
					"sap/gantt/test/shape": "test-resources/sap/gantt/shape/"
				}
			},
			page: "test-resources/sap/gantt/qunit/teststarter.qunit.html?test={name}",
			autostart: true                 // Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"axistime/AxisTimeStrategyBase": {
				group: "Zooming",
				sinon: true
			},
			"axistime/FullScreenStrategy": {
				group: "Zooming",
				ui5: {
					libs: ["sap.gantt"]
				},
				sinon: false
			},
			"axistime/ProportionZoomStrategy": {
				group: "Zooming",
				ui5: {
					libs: ["sap.gantt"]
				},
				sinon: true
			},
			"axistime/StepwiseZoomStrategy": {
				group: "Zooming",
				ui5: {
					libs: ["sap.gantt"]
				},
				sinon: false
			},
			"config/ChartScheme": {
				group: "Shape Configuration Elements"
			},
			"config/ColumnAttribute": {
				group: "Shape Configuration Elements"
			},
			"config/ContainerLayout": {
				group: "Shape Configuration Elements"
			},
			"config/ExpandChart": {
				group: "Shape Configuration Elements"
			},
			"config/ExpandChartGroup":{
				group: "Shape Configuration Elements"
			},
			"config/GanttChartLayout":{
				group: "Shape Configuration Elements"
			},
			"config/Hierarchy":{
				group: "Shape Configuration Elements"
			},
			"config/HierarchyColumn":{
				group: "Shape Configuration Elements"
			},
			"config/LayoutGroup":{
				group: "Shape Configuration Elements"
			},
			"config/Locale":{
				group: "Shape Configuration Elements"
			},
			"config/Mode":{
				group: "Shape Configuration Elements"
			},
			"config/ModeGroup":{
				group: "Shape Configuration Elements"
			},
			"config/ObjectType":{
				group: "Shape Configuration Elements"
			},
			"config/SettingGroup":{
				group: "Shape Configuration Elements"
			},
			"config/SettingItem":{
				group: "Shape Configuration Elements"
			},
			"config/Shape":{
				group: "Shape Configuration Elements"
			},
			"config/TimeAxis":{
				group: "Shape Configuration Elements"
			},
			"config/TimeHorizon":{
				group: "Shape Configuration Elements"
			},
			"config/ToolbarGroup":{
				group: "Shape Configuration Elements"
			},
			"config/ToolbarScheme":{
				group: "Shape Configuration Elements"
			},

			"control/AssociateContainerLegend": {
				group: "Inner Control",
				ui5: {
					libs: ["sap.gantt", "sap.m"]
				}
			},
			"control/Cell": {
				group: "Inner Control"
			},
			"control/Toolbar": {
				group: "Inner Control"
			},

			"def/cal/Calendar": {
				group: "SVG Def"
			},
			"def/cal/TimeInterval": {
				group: "SVG Def"
			},

			"def/filter/MorphologyFilter": {
				group: "SVG Def"
			},
			"def/gradient/LinearGradient": {
				group: "SVG Def"
			},
			"def/gradient/RadialGradient": {
				group: "SVG Def"
			},
			"def/pattern/Slash": {
				group: "SVG Def"
			},

			"drawer/AdhocLine": {
				group: "Drawer",
				sinon: true
			},
			"drawer/CalendarPattern": {
				group: "Drawer"
			},
			"drawer/CursorLine": {
				group: "Drawer",
				sinon: true
			},
			"drawer/NowLine": {
				group: "Drawer",
				sinon: true
			},
			"drawer/ShapeCrossRow": {
				group: "Drawer"
			},
			"drawer/VerticalLine": {
				group: "Drawer",
				ui5: {
					libs: ["sap.gantt"]
				}
			},

			"misc/AxisOrdinal": {
				group: "Miscellaneous"
			},
			"misc/AxisTime": {
				group: "Miscellaneous"
			},
			"misc/Format": {
				group: "Miscellaneous"
			},
			"misc/RelativeTimeFormatter": {
				group: "Miscellaneous"
			},
			"misc/RTL": {
				group: "Miscellaneous",
				ui5: {
					rtl: true
				}
			},
			"misc/ShapeSelectionBehavior": {
				group: "Miscellaneous"
			},
			"misc/ShapeSelectionModel": {
				group: "Miscellaneous",
				autostart: false,
				sinon: true
			},
			"misc/Utility": {
				group: "Miscellaneous"
			},
			// "misc/UtilityDatum": {
			// 	group: "Miscellaneous"
			// },

			"shape/Circle": {
				"group": "Shape Element"
			},
			"shape/ClipPath": {
				"group": "Shape Element"
			},
			"shape/Line": {
				"group": "Shape Element"
			},
			"shape/Path": {
				"group": "Shape Element"
			},
			"shape/Polygon": {
				"group": "Shape Element"
			},
			"shape/Polyline": {
				"group": "Shape Element"
			},
			"shape/Rectangle": {
				"group": "Shape Element"
			},
			"shape/ResizeShadowShape": {
				"group": "Shape Element"
			},
			"shape/SelectedShape": {
				"group": "Shape Element"
			},
			"shape/Shape": {
				"group": "Shape Element"
			},
			"shape/Text": {
				"group": "Shape Element"
			},
			"shape/cal/Calendar": {
				"group": "Shape Element"
			},
			"shape/ext/Chevron": {
				"group": "Shape Element"
			},
			"shape/ext/Cursor": {
				"group": "Shape Element"
			},
			"shape/ext/Diamond": {
				"group": "Shape Element"
			},
			"shape/ext/Iconfont": {
				"group": "Shape Element"
			},
			"shape/ext/Pentangle": {
				"group": "Shape Element"
			},
			"shape/ext/TextRepeat": {
				"group": "Shape Element"
			},
			"shape/ext/Triangle": {
				"group": "Shape Element"
			},
			"shape/ext/ubc/UbcBorderPath": {
				"group": "Shape Element"
			},
			"shape/ext/ubc/UbcOverCapacityZonePolygon": {
				"group": "Shape Element"
			},
			"shape/ext/ubc/UbcShortageCapacityPolygon": {
				"group": "Shape Element"
			},
			"shape/ext/ubc/UbcTooltipRectangle": {
				"group": "Shape Element"
			},
			"shape/ext/ubc/UbcUnderCapacityZonePolygon": {
				"group": "Shape Element"
			},
			"shape/ext/ubc/UbcUsedPolygon": {
				"group": "Shape Element"
			},
			"shape/ext/ulc/UlcBorderPath": {
				"group": "Shape Element"
			},
			"shape/ext/ulc/UlcClipingPath": {
				"group": "Shape Element"
			},
			"shape/ext/ulc/UlcMiddleLine": {
				"group": "Shape Element"
			},
			"shape/ext/ulc/UlcOverCapacityZoneRectangle": {
				"group": "Shape Element"
			},
			"shape/ext/ulc/UlcOverClipRectangle": {
				"group": "Shape Element"
			},
			"shape/ext/ulc/UlcRectangle": {
				"group": "Shape Element"
			},
			"shape/ext/ulc/UlcTooltipRectangle": {
				"group": "Shape Element"
			},
			"shape/ext/ulc/UlcUnderClipRectangle": {
				"group": "Shape Element"
			},

			"AsyncLoading": {},
			"AdhocLine": {},
			// "AutoScrollHandler": {
			// 	ui5: {
			// 		libs: ["sap.gantt", "sap.ui.table"]
			// 	}
			// },
			"BirdEyeHandler": {},
			"ChartEvent": {},
			"CustomizedDataType": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			"DateFormatConstant": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			"GanttChart": {},
			"GanttChartContainer": {},
			"Special-ID-and-Type-OData": {
				module: "./GanttChartWithTable_oData_SpecifiedIdAndType.qunit",
				sinon: false /*uses Mockserver*/
			},
			"Special-ID-and-Type-JSON": {
				module: "./GanttChartWithTable_SpecifiedIdAndType.qunit"
			},
			"GanttChartWithTable": {},
			"MouseWheelHandler": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			"Relationship": {},
			"RelationshipRTL": {
				ui5: {
					rtl: true
				}
			},
			"setTableProperties": {},
			"TableReference": {
				ui5: {
					libs: ["sap.gantt"]
				}
			},
			"TimePeriodZoomHandler": {
				ui5: {
					libs: ["sap.gantt"]
				}
			}
		}
	};
});
