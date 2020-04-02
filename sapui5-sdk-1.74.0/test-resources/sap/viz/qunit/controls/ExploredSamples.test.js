(function() {
	"use strict";

	// prevent QUnit from starting
	QUnit.config.autostart = false;

	sap.ui.loader.config({
		map: {
			// override sinon version for MockServer and others
			"*": {
				"sap/ui/thirdparty/sinon": "sap/ui/thirdparty/sinon-4",
				"sap/ui/thirdparty/sinon-qunit": "sap/ui/qunit/sinon-qunit-bridge"
			}
		},
		shim: {
			// ensure that sinon-4 is loaded before the sinon-qunit-bridge
			// (due to the version dependency, this shim isn't pre-configured in ui5loader-autoconfig)
			"sap/ui/qunit/sinon-qunit-bridge": {
				deps: ["sap/ui/thirdparty/sinon-4"]
			}
		}
	});

	sap.ui.require(['sap/ui/demo/mock/qunit/SampleTester'], function(SampleTester) {
		new SampleTester(
			'sap.viz'
		).placeAt('content');
	});

}());
