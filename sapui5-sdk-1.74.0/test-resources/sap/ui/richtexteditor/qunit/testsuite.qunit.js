sap.ui.define(function() {

	"use strict";

	return {
		name: "Library 'sap.ui.richtexteditor'",	/* Just for a nice title on the pages */
		defaults: {
			group: "Control",
			qunit: {
				version: 2					// Whether QUnit should be loaded and if so, what version
			},
			sinon: {
				version: 1					// Whether Sinon should be loaded and if so, what version
			},
			ui5: {
				language: "en-US",
				rtl: false,							// Whether to run the tests in RTL mode
				libs: ["sap.ui.richtexteditor", "sap.m"],	// Libraries to load upfront in addition to the library which is tested, if null no libs are loaded
				"xx-waitForTheme": true				// Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only:	"[sap/ui/richtexteditor]",	// Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true		// Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit",
					"sap/ui/richtexteditor/qunit": "test-resources/sap/ui/richtexteditor/qunit/"
				}
			},
			page: "test-resources/sap/ui/richtexteditor/qunit/teststarter.qunit.html?test={name}",
			autostart: true					// Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			/* Control */
			"RichTextEditor": {
				ui5: {
					libs: ["sap.ui.richtexteditor"]
				}
			},
			"RTESplitButton": {
				ui5: {
					libs: ["sap.ui.richtexteditor", "sap.m"]
				}
			},
			"Toolbar": {
				ui5: {
					libs: ["sap.ui.richtexteditor", "sap.m"]
				}
			}
		}
	};
});