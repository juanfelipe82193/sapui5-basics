sap.ui.define(function () {

	"use strict";

	return {
		name: "QUnit TestSuite for sap.gantt.simple",

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
			group: "Default",
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
					"sap.ui.table",
					"sap.m",
					"sap.ui.layout"
				],                          // Libraries to load upfront in addition to the library which is tested (sap.ui.table), if null no libs are loaded
				"xx-waitForTheme": true     // Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only: "[sap/gantt/simple]",   // Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true        // Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/gantt/simple/test": "test-resources/sap/gantt/qunit/simple",
					"sap/gantt/test/simple": "test-resources/sap/gantt/simple",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
				}
			},
			page: "test-resources/sap/gantt/qunit/simple/teststarter.qunit.html?test={name}",
			autostart: true                 // Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"BaseCalendar": {
				group: "Shape",
				coverage: {
					only: null /*full report*/
				}
			},
			"BaseChevron": {
				coverage: {
					only: ["sap/gantt/simple/BaseChevron"]
				}
			},
			"BaseCursor": {
				coverage: {
					only: ["sap/gantt/simple/BaseCursor"]
				}
			},
			"BaseConditionalShape": {
				coverage: {
					only: ["sap/gantt/simple/BaseConditionalShape"]
				}
			},
			"BaseDiamond": {
				coverage: {
					only: ["sap/gantt/simple/BaseDiamond"]
				}
			},
			"BaseGroup": {
				coverage: {
					only: ["sap/gantt/simple/BaseGroup"]
				}
			},
			"BaseImage": {
				coverage: {
					only: ["sap/gantt/simple/BaseImage"]
				}
			},
			"BaseLine": {
				coverage: {
					only: ["sap/gantt/simple/BaseLine"]
				}
			},
			"BasePath": {
				coverage: {
					only: ["sap/gantt/simple/BasePath"]
				}
			},
			"BaseShape": {
				coverage: {
					only: ["sap/gantt/simple/BaseShape"]
				}
			},
			"BaseText": {
				coverage: {
					only: ["sap/gantt/simple/BaseText"]
				}
			},
			"ContainerToolbar": {
				coverage: {
					only: ["sap/gantt/simple/ContainerToolbar"]
				}
			},
			"ExpandModel": {
				coverage: {
					only: ["sap/gantt/simple/ExpandModel"]
				}
			},
			"GanttChartContainer": {
				coverage: {
					only: ["sap/gantt/simple/GanttChartContainer"]
				}
			},
			"GanttChartWithTable": {
				sinon: true,
				coverage: {
					only: ["sap/gantt/simple/GanttChartWithTable"]
				}
			},
			"GanttConnectExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttConnectExtension"]
				}
			},
			"GanttDragDropExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttDragDropExtension"]
				}
			},
			"GanttPointerExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttPointerExtension"]
				}
			},

			"GanttPopoverExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttPopoverExtension"]
				}
			},
			"GanttResizeExtension": {
				coverage: {
					only: ["sap/gantt/simple/GanttResizeExtension"]
				}
			},
			"UtilizationChart": {
				coverage: {
					only: ["sap/gantt/simple/UtilizationChart"]
				}
			},
			"GanttRowSettings": {
				coverage: {
					only: ["sap/gantt/simple/GanttRowSettings"]
				}
			},
			"Relationship": {}
		}
	};
});
