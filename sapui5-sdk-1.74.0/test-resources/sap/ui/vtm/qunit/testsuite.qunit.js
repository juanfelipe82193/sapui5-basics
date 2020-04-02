sap.ui.define([
	"sap/ui/Device"
], function(
	Device
) {
	"use strict";

	return {
		name: "Library sap.ui.vtm",
		defaults: {
			group: "Default",
			qunit: {
				version: 2
			},
			sinon: false,
			ui5: {
				language: "en-US",
				rtl: false,					// Whether to run the tests in RTL mode
				libs: [ sap.ui.vtm ],		// Libraries to load upfront in addition to the library which is tested (sap.ui.vk), if null no libs are loaded
				"xx-waitForTheme": true		// Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only:	"[sap/ui/vtm]",		// Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true		// Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/vtm/qunit": "test-resources/sap/ui/vtm/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
				}
			},
			autostart: true					// Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"MatrixInversionTests": {},
			"MatrixMultiplicationTests": {}
		}
	};
});
