sap.ui.define(function() {

	"use strict";

	return {
		name: "Library 'sap.ui.export'",	/* Just for a nice title on the pages */
		defaults: {
			group: "Export",
			qunit: {
				version: 2					// Whether QUnit should be loaded and if so, what version
			},
			sinon: {
				version: 1					// Whether Sinon should be loaded and if so, what version
			},
			ui5: {
				language: "en-US",
				rtl: false,					// Whether to run the tests in RTL mode
				libs: ["sap.ui.export", "sap.m"],		// Libraries to load upfront in addition to the library which is tested (sap.ui.export), if null no libs are loaded
				"xx-waitForTheme": true		// Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only:	"[sap/ui/export]",	// Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true		// Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/",
					"sap/ui/export/mock": "test-resources/sap/ui/export/demokit/sample/localService/"
				}
			},
			page: "test-resources/sap/ui/export/qunit/teststarter.qunit.html?test={name}",
			autostart: true					// Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"Spreadsheet": {
				sinon: false /*uses Mockserver*/
			},
			"ExportUtils": {},
			"ExploredSamples": {
				group: "Library",
				loader: {
					map: {
						"*": {
							"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4",
							"sap/ui/thirdparty/sinon-qunit": "sap/ui/qunit/sinon-qunit-bridge"
						}
					}
				},
				runAfterLoader: "sap/ui/demo/mock/qunit/SampleTesterErrorHandler",
				sinon: {
					version: 4 // MockServer dependencies are overrules by loader config above 
				},
				ui5: {
					libs: ["sap.ui.export", "sap.ui.documentation"],
					"xx-componentPreload": "off"
				},
				autostart: false
			}
		}
	};

});