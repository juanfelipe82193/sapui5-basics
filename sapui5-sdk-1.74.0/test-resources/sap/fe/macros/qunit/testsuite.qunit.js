sap.ui.define(["sap/ui/Device"], function(Device) {
	"use strict";

	return {
		name: "Library 'sap.fe.macros'" /* Just for a nice title on the pages */,
		defaults: {
			group: "Library",
			qunit: {
				version: 2
				// Whether QUnit should be loaded and if so, what version
			},
			sinon: {
				version: 4
				// Whether Sinon should be loaded and if so, what version
			},
			ui5: {
				language: "en-US",
				rtl: false, // Whether to run the tests in RTL mode
				libs: ["sap.ui.mdc"], // Libraries to load upfront in addition to the library which is tested (sap.ui.mdc), if null no libs are loaded
				"xx-waitForTheme": true
				// Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only: "[sap/ui/mdc]", // Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true
				// Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
				}
			},
			page: "test-resources/sap/fe/macros/qunit/teststarter.qunit.html?testsuite={suite}&test={name}",
			autostart: true,
			module: "./{name}.qunit"
			// Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"ChartDelegate": {
				group: "macros",
				module: "./macros/ChartDelegate.qunit"
			},
			"FormTemplating": {
				group: "macros",
				module: "./macros/FormTemplating.qunit"
			},
			"FormHelper": {
				group: "macros",
				module: "./macros/FormHelper.qunit"
			},
			"FormContainerTemplating": {
				group: "macros",
				module: "./macros/FormContainerTemplating.qunit"
			},
			"FieldHelper": {
				group: "macros",
				module: "./macros/FieldHelper.qunit"
			},
			"CommonHelper": {
				group: "macros",
				module: "./macros/CommonHelper.qunit"
			},
			"MacroMetadata": {
				group: "macros",
				loader: {
					paths: {
						"sap/fe/macros/fragments": "test-resources/sap/fe/macros/qunit/macros/fragments"
					}
				},
				module: "./macros/MacroMetadata.qunit"
			},
			"MicroChartHelper": {
				group: "macros",
				module: "./macros/MicroChartHelper.qunit"
			},
			"MicroChartContainer": {
				group: "macros",
				module: "./macros/MicroChartContainer.qunit",
				sinon: true
			},
			"PhantomUtil": {
				group: "macros",
				module: "./macros/PhantomUtil.qunit"
			},
			"StableIdHelper": {
				group: "macros",
				module: "./macros/StableIdHelper.qunit"
			},
			"TableHelper": {
				group: "macros",
				module: "./macros/TableHelper.qunit"
			},
			"TableRuntime": {
				group: "macros",
				module: "./macros/TableRuntime.qunit"
			},
			"TableSelectionMode": {
				group: "macros",
				module: "./macros/TableSelectionMode.qunit"
			},
			"ValueHelpTemplating": {
				group: "macros",
				module: "./macros/ValueHelpTemplating.qunit"
			}
		}
	};
});
