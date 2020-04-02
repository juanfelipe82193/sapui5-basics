sap.ui.define([
	"sap/ui/Device"
],function(
	Device
){
	"use strict";
	var oUnitTest =  {
		name: "Package 'sap.ui.comp.smartfield'",
		defaults: {
			group: "SmartField",
			qunit: {
				version: 2
			},
			sinon: {
				version: 4,
				useFakeTimers: false
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
			"AnnotationHelper": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/AnnotationHelper.js"
				}
			},
			"BindingUtil": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/BindingUtil.js"
				}
			},
			"ControlFactoryBase": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/ControlFactoryBase.js"
				}
			},
			"Currency": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/type/Currency.js"
				}
			},
			"FieldControl": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/FieldControl.js"
				}
			},
			"JSONControlFactory": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/JSONControlFactory.js"
				}
			},
			"JSONTypes": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/JSONTypes.js"
				}
			},
			"ODataControlFactory": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/ODataControlFactory.js"
				}
			},
			"ODataHelper": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "sap/ui/comp/smartfield/ODataHelper.js"
				}
			},
			"ODataTypes": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/ODataTypes.js"
				}
			},
			"SideEffectUtil": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/SideEffectUtil.js"
				}
			},
			"SmartField": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/SmartField.js"
				}
			},
			"SmartLabel": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/SmartLabel.js"
				}
			},
			"TextArrangementDelegate": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/TextArrangementDelegate.js"
				}
			},
			"TextArrangementGuid": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/type/TextArrangementGuid.js"
				}
			},
			"TextArrangementString": {
				group: "SmartField",
				coverage: {
					only: "sap/ui/comp/smartfield/type/TextArrangementString.js"
				}
			},
			"SmartFieldIntegrationTests": {
				group: "SmartField"
			},
			"Types": {
				group: "SmartField",
				coverage: {
					only: [
						"sap/ui/comp/smartfield/type/AbapBool.js",
						"sap/ui/comp/smartfield/type/DateTime.js",
						"sap/ui/comp/smartfield/type/DateTimeOffset.js",
						"sap/ui/comp/smartfield/type/Time.js",
						"sap/ui/comp/smartfield/type/String.js",
						"sap/ui/comp/smartfield/type/Decimal.js",
						"sap/ui/comp/smartfield/type/Int16.js",
						"sap/ui/comp/smartfield/type/Int32.js",
						"sap/ui/comp/smartfield/type/Int64.js",
						"sap/ui/comp/smartfield/type/SByte.js"
					]
				}
			},
			"opa/SmartFieldTypes.opa": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			},
			"opa/SmartFieldTextInEditModeSource.opa": {
				group: "SmartField",
				autostart: true,
				coverage: {
					only: "[sap/ui/comp/smartfield]"
				}
			}
		}
	};

	return oUnitTest;
});
