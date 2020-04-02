/**
 * tests for the sap.suite.ui.generic.template.ListReport.controller.WorklistHandler.js
 */
sap.ui.define([ "sap/ui/model/json/JSONModel",
				 "testUtils/sinonEnhanced",
				 "sap/suite/ui/generic/template/ListReport/controller/WorklistHandler",
				"sap/suite/ui/generic/template/lib/testableHelper"
				 ], function(JSONModel, sinon, WorklistHandler, testableHelper){
	"use strict";

	var sandbox; // sinon sandbox
	var bAreDataShownInTable;
	var bDiffEntitySets = false;
	var sEntitySet = "entitySet";
	var oEntityType = {properties: "smth"};
	var sSmartTableType = "t";
	var oEntitySet = {
			entityType: "entityType"};
	var oEntityTypeProperties = {};
	var oState = {
		oSmartTable: {
			getEntitySet: function() {
				return sEntitySet;
			},
			getModel: function() {
				return {
					getMetaModel: function() {}
				};
			}
		},
		oSmartFilterbar: {
			getFilters: function() {
				return {};
			}
		},
		oIappStateHandler: {
			areDataShownInTable: function(){
				return bAreDataShownInTable;
			},
			changeIappState: function() {
				// nothing
			}
		},
		oWorklistData: {
			bWorklistEnabled: true,
			oSearchField:{}
		}
	};
	var oConfig;
	var oAppComponent = {
		getConfig: function(){ return oConfig; }
	};
	var oComponent = {
		getAppComponent: function(){ return oAppComponent; }
	};
	var mControls;
	var oController = {
		getOwnerComponent: function(){ return oComponent; },
		byId: function(sControlId){ return mControls[sControlId]; }
	};
	var aSelectionVariantFilters = [{id: "S0"}, {id: "S1"}];
	var oTemplateUtils = {
		oCommonUtils: {
			setEnabledToolbarButtons: function(oSubControl) {
				// do nothing. function is needed to prevent type errors
			}
		},
		oServices: {
			oApplication: {
				getBusyHelper: function() {
					return {
						getBusyDelay: function() {
							return 0; // for the test every asynchronous operation is considered as 'long running'
						}
					};
				}
			}
		}
	};
	var oSettings = {
		"multiSelect": true,
		"variantManagementHidden": false,
		"isWorklist": true,
		"smartVariantManagement":false
	};
	function getGetKey(sKey){
		return function(){ return sKey; };
	}

	function fnPrepareEnvironment(oSettings) {
		if (!oSettings) {
			oConfig.pages = [{
				entitySet: "STTA_C_MP_Product",
				component: {
					name: "sap.suite.ui.generic.template.ListReport",
					list: true
				}
			}];
		} else {
			oConfig.pages = [{
				entitySet: "STTA_C_MP_Product",
				component: {
					name: "sap.suite.ui.generic.template.ListReport",
					list: true,
					settings: oSettings
				}
			}];
		}
		return oConfig;
	}



var oStubForPrivate;

	function fnCommonSetUp() {
		bAreDataShownInTable = true; // default
		oConfig = {};
		mControls = Object.create(null);
		sandbox = sinon.sandbox.create();
	}

	function fnCommonTeardown() {
		sandbox.restore();
	}

	module("Initialization",{
		setup : fnCommonSetUp,
		teardown: fnCommonTeardown
	});

	function fnPerformTestForWorklist(oSettings) {
		fnPrepareEnvironment(oSettings);
		var oWorklistHandler = new WorklistHandler(oState,oController,oTemplateUtils);
		assert.ok(oWorklistHandler,"Worklist class initialized successfully");
	}
	test("Initialization",fnPerformTestForWorklist.bind(null,oSettings));

	function fnTestForSettings(oSettings) {
		var oConfig = fnPrepareEnvironment(oSettings);
		assert.ok(oConfig.pages[0].component.settings,"Valid Settings available for Worklist");
	}
	test("Check for valid Settings",fnTestForSettings.bind(null,oSettings));

	function fnTestForInvalidSettings(oSettings) {
		var oConfig = fnPrepareEnvironment(oSettings);
		assert.ok(!oConfig.pages[0].component.settings,"Valid Settings not available for Worklist");
	}
	test("Check for invalid Settings",fnTestForInvalidSettings.bind(null,""));

});
