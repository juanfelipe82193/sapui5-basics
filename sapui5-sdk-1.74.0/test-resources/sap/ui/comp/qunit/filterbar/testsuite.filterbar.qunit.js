sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.filterbar'",
		defaults: {
			group: "FilterBar",
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
			"FilterBar": {
				coverage: {
					only: "sap/ui/comp/filterbar/FilterBar.js"
				}
			},
			"FilterGroupItem": {
				coverage: {
					only: "sap/ui/comp/filterbar/FilterGroupItem.js"
				}
			},
			"FilterItem": {
				coverage: {
					only: "sap/ui/comp/filterbar/FilterItem.js"
				}
			},
			"VariantConverterFrom": {
				coverage: {
					only: "sap/ui/comp/filterbar/VariantConverterFrom.js"
				}
			},
			"VariantConverterTo": {
				coverage: {
					only: "sap/ui/comp/filterbar/VariantConverterTo.js"
				}
			}
		}
	};

	return oUnitTest;
});
