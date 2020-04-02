sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartfilterbar'",
		defaults: {
			group: "SmartFilterBar",
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
			"AdditionalConfigurationHelper": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/AdditionalConfigurationHelper.js"
				}
			},
			"ControlConfiguration": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/ControlConfiguration.js"
				}
			},
			"FilterProvider": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/FilterProvider.js"
				}
			},
			"GroupConfiguration": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/GroupConfiguration.js"
				}
			},
			"SelectOption": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/SelectOption.js"
				}
			},
			"SmartFilterBar": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/SmartFilterBar.js"
				}
			},
			"SFBMultiInput": {
				group: "SmartFilterBar",
				coverage: {
					only: "sap/ui/comp/smartfilterbar/SFBMultiInput.js"
				}
			},
			"opaTests/FieldTypes/Opa": {
				group: "SmartFilterBar"
			}
		}
	};

	return oUnitTest;
});
