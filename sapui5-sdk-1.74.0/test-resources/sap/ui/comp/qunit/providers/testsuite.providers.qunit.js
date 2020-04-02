sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.providers'",
		defaults: {
			group: "Providers",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4
			},
			ui5: {
				language: "en-US",
				rtl: false,
				libs: [
					"sap.ui.comp"
				],
				"xx-waitForTheme": true
			},
			coverage: {
				only: "sap/ui/comp",
				branchCoverage: true
			},
			loader: {
				paths: {
					"sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
				}
			},
			autostart: false,
			module: "./{name}.qunit"
		},
		tests: {
			"BaseValueListProvider": {
				group: "Providers",
				coverage: {
					only: "sap/ui/comp/providers/BaseValueListProvider.js"
				}
			},
			"ChartProvider": {
				group: "Providers",
				coverage: {
					only: "sap/ui/comp/providers/ChartProvider.js"
				}
			},
			"ControlProvider": {
				group: "Providers",
				coverage: {
					only: "sap/ui/comp/providers/ControlProvider.js"
				}
			},
			"TableProvider": {
				group: "Providers",
				coverage: {
					only: "sap/ui/comp/providers/TableProvider.js"
				}
			},
			"ValueHelpProvider": {
				group: "Providers",
				coverage: {
					only: "sap/ui/comp/providers/ValueHelpProvider.js"
				}
			},
			"ValueListProvider": {
				group: "Providers",
				coverage: {
					only: "sap/ui/comp/providers/ValueListProvider.js"
				}
			}
		}
	};

	return oUnitTest;
});
