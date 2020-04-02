sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Library 'sap.ui.comp'",
		defaults: {
			group:"Library",
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
				group: "FilterBar Testsuite",
				page: "test-resources/sap/ui/comp/qunit/filterbar/testsuite.filterbar.qunit.html"
			},
			"NavPopover": {
				group: "NavPopover Testsuite",
				page: "test-resources/sap/ui/comp/qunit/navpopover/testsuite.navpopover.qunit.html"
			},
			"OData": {
				group: "OData Testsuite",
				page: "test-resources/sap/ui/comp/qunit/odata/testsuite.odata.qunit.html"
			},
			"Providers": {
				group: "Providers Testsuite",
				page: "test-resources/sap/ui/comp/qunit/providers/testsuite.providers.qunit.html"
			},
			"SmartField": {
				group: "SmartField Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartfield/testsuite.smartfield.qunit.html"
			},
			"SmartFilterBar": {
				group: "SmartFilterBar Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartfilterbar/testsuite.smartfilterbar.qunit.html"
			},
			"SmartForm": {
				group: "SmartForm Testsuite",
				page: "test-resources/sap/ui/comp/qunit/smartform/testsuite.smartform.qunit.html"
			},
			"Personalization": {
				group: "Personalization Testsuite",
				page: "test-resources/sap/ui/comp/qunit/personalization/testsuite.personalization.qunit.html" //TBD: Move Personalization to the new approach
			},

			"smartchart/SmartChart": {
				group: "SmartChart",
				coverage: {
					only: "sap/ui/comp/smartchart/SmartChart.js"
				}
			},
			"variants/EditableVariantItem": {
				group: "Variants",
				coverage: {
					only: "sap/ui/comp/variants/EditableVariantItem.js"
				}
			},
			"variants/VariantItem": {
				group: "Variants",
				coverage: {
					only: "sap/ui/comp/variants/VariantItem.js"
				}
			},
			"variants/VariantManagement": {
				group: "Variants",
				coverage: {
					only: "sap/ui/comp/variants/VariantManagement.js"
				}
			},
			"ExploredSamples": {
				group: "ExploredSamples",
				module: "./ExploredSamples.qunit", //overwrite default --> different folder layer
				autostart: false
			},
			"valuehelpdialog/ItemsCollection": {
				group: "ValueHelpDialog",
				coverage: {
					only: "sap/ui/comp/valuehelpdialog/ItemsCollection.js"
				}
			},
			"valuehelpdialog/ValueHelpDialog": {
				group: "ValueHelpDialog",
				coverage: {
					only: "sap/ui/comp/valuehelpdialog/ValueHelpDialog.js"
				}
			},
			"providers/TokenParser": {
				group: "ValueHelpDialog",
				coverage: {
					only: "sap/ui/comp/providers/TokenParser.js"
				}
			},
			"smarttable/SmartTable": {
				group: "SmartTable",
				coverage: {
					only: "sap/ui/comp/smarttable/SmartTable.js"
				}
			},
			"smartlist/SmartList": {
				group: "SmartList",
				coverage: {
					only: "sap/ui/comp/smartlist/SmartList.js"
				}
			},
			"state/UIState": {
				group: "state",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/state/UIState.js"
				}
			},
			"smartvariants/PersonalizableInfo": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/PersonalizableInfo.js"
				}
			},
			"smartvariants/SmartVariantManagement": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/SmartVariantManagement.js"
				}
			},
			"smartvariants/SmartVariantManagementUi2": {
				group: "SmartVariants",
				coverage: {
					only: "sap/ui/comp/smartvariants/SmartVariantManagementUi2.js"
				}
			},
			"designtime/Designtime": {
				group: "DesignTime",
				module: "./designtime/Designtime.qunit"
			},
			"designtime/Library": {
				group: "DesignTime",
				module: "./designtime/Library.qunit",
				sinon: false,
				autostart: true
			},
			"config/condition/DateRangeType": {
				group: "Condition",
				coverage: {
					only: [
						"sap/ui/comp/config/condition/Type.js",
						"sap/ui/comp/config/condition/DateRangeType.js"
					]
				}
			},
			"util/MultiCurrencyUtil": {
				skip: Device.system.phone,
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/MultiCurrencyUtil.js"
				}
			},
			"util/FormatUtil": {
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/FormatUtil.js"
				}
			},
			"util/DateTimeUtil": {
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/DateTimeUtil.js"
				}
			},
			"util/FilterUtil": {
				group: "Util",
				coverage: {
					only: "sap/ui/comp/util/FilterUtil.js"
				}
			},
			"type/Interval": {
				group: "Type",
				module: "./type/Interval.qunit",
				sinon: false,
				autostart: true,
				coverage: {
				  only: "sap/ui/comp/type/Interval.js"
				}
			 }
		}
	};

	return oUnitTest;
});
