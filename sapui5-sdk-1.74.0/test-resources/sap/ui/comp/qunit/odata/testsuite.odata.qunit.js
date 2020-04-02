sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.odata'",
		defaults: {
			group: "OData",
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
			"CalendarMetadata": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/CalendarMetadata.js"
				}
			},
			"ChartMetadata": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/ChartMetadata.js"
				}
			},
			"CriticalityMetadata": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/CriticalityMetadata.js"
				}
			},
			"MetadataAnalyser": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/MetadataAnalyser.js"
				}
			},
			"ODataType": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/ODataType.js"
				}
			},
			"SideEffects": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/SideEffects.js"
				}
			},
			"FiscalMetadata": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/FiscalMetadata.js"
				}
			},
			"FiscalFormat": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/FiscalFormat.js"
				}
			},
			"type/StringDate": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/type/StringDate.js"
				}
			},
			"type/FiscalDate": {
				group: "OData",
				coverage: {
					only: "sap/ui/comp/odata/type/FiscalDate.js"
				}
			}
		}
	};

	return oUnitTest;
});
