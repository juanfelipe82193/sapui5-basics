sap.ui.define(function() {

	"use strict";
	return {
		name: "Library sap.ui.vbm",
		defaults: {
			group: "Default",
			qunit: {
				version: 2
			},
			sinon: false,
			ui5: {
				language: "en-US",
				rtl: false,					// Whether to run the tests in RTL mode
				libs: [ "sap.ui.vbm" ],		// Libraries to load upfront in addition to the library which is tested (sap.ui.vbm), if null no libs are loaded
				"xx-waitForTheme": true		// Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only:	[ "sap/ui/vbm" ],	// Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true		// Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/vbm/qunit": "test-resources/sap/ui/vbm/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
				}
			},
			page: "test-resources/sap/ui/vbm/qunit/teststarter.qunit.html?test={name}",
			autostart: true					// Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"Adapter": {
				qunit: {
					version: 1
				},
				coverage: {
					only: [ "sap/ui/vbm/Adapter.js" ]
				}
			},
			"Cluster": {
				coverage: {
					only: [ "sap/ui/vbm/Cluster.js" ]
				}
			},
			"ClusterTree": {
				coverage: {
					only: [ "sap/ui/vbm/ClusterTree.js" ]
				}
			},
			"GeoMap": {
				coverage: {
					only: [ "sap/ui/vbm/GeoMap.js" ]
				}
			},
			"Spot": {
				coverage: {
					only: [ "sap/ui/vbm/Spot.js" ]
				}
			},
			"Spots": {
				coverage: {
					only: [ "sap/ui/vbm/Spots.js" ]
				}
			},
			"VBIJSONParser": {
				autostart: false,
				coverage: {
					only: [ "sap/ui/vbm/VBIJSONParser.js" ]
				}
			},
			"1780022375": {
				coverage: {
					only: [ "sap/ui/vbm/Container.js" ]
				}
			},
			"MapConfigurationCallback": {
				coverage: {
					only: [ "sap/ui/vbm/lib/sapmapprovider.js" ]
				}
			}
		}
	};
});
