/*global QUnit, window */

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
		}
	});

	sap.ui.require([
		"test-resources/sap/ui/documentation/sdk/qunit/SampleTester"
	], function(SampleTester) {
		new SampleTester(
			'sap.ui.comp',
			[
				"sap.ui.comp.sample.personalization.exampleForTreeTableWithOData", // non-existent sample
				"sap.ui.comp.sample.personalization.exampleForTreeTableWithOData2", // non-existent sample
				"sap.ui.comp.sample.smartformColumn"
			] /*Excludes*/
		).placeAt('content');
	});

})();