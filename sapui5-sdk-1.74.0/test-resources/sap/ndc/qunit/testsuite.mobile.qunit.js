sap.ui.define(function () {
	"use strict";
	return {
		name: "sap.ndc",
		defaults: {
			group: "Default",
			qunit: {
				version: 2
			},
			sinon: false,
			ui5: {
				language: "en",
				libs: ["sap.ndc"],
				"xx-waitForTheme": true
			},
			coverage: {
				only: ["sap/ndc"]
			},
			page: "test-resources/sap/ndc/qunit/testsandbox.qunit.html?test={name}",
			autostart: true
		},
		tests: {
			"BarcodeScannerButton": {
				coverage: {
					only: ["sap/ndc/BarcodeScannerButton"]
				}
			}
		}
	};
});
