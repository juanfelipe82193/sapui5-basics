/**
 * tests for the sap.suite.ui.generic.template.lib.StatePreserver
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/StatePreserver", "sap/suite/ui/generic/template/lib/testableHelper"
], function(sinon, StatePreserver, testableHelper) {
	"use strict";
	
	var oSandbox;
	var oComponentRegistryEntry = {
		viewLevel: {},
		utils: {
			getHeaderDataAvailablePromise: function(){
				return new Promise(function(fnResolve){ setTimeout(fnResolve, 100); });
			}
		}
	};
	var sCurrentHash;
	var oNavigationControllerProxy = {
		getCurrentHash: function(iViewLevel){
			if (iViewLevel !== oComponentRegistryEntry.viewLevel){
				throw new Error("View level must be taken form the component registry");
			}
			return sCurrentHash;
		}
	};
	var oApplicationProxy = {
		areTwoKnownPathesIdentical: function(sPath1, sPath2, bIsRoot){
			if (bIsRoot !== (oComponentRegistryEntry.viewLevel === 1)){
				throw new Error("Root detection seems not to be valid");
			}
			return Promise.resolve(!!sPath1 && !!sPath2 && sPath1 === sPath2);
		}	
	};
	var oTemplateContract = {
		oNavigationControllerProxy: oNavigationControllerProxy,
		oApplicationProxy: oApplicationProxy,
		componentRegistry: {
			theComponentId: oComponentRegistryEntry
		}
	};
	var oSettings = {
		oComponent: {
			getId: function(){
				return "theComponentId";
			}
		},
		appStateName: Object.create(null)
	};
	var oCrossAppNavService;
	
	function fnSetNavigateByExchangingQueryParamNoKey(assert){
		var done = assert.async();
		oSandbox.stub(oNavigationControllerProxy, "navigateByExchangingQueryParam", function(sAppStateName, sKey){
			assert.strictEqual(sAppStateName, oSettings.appStateName, "AppStateName must be used correctly");
			assert.equal(sKey, "", "No key must be used in this scenario");
			done();
		});
	}
	
	module("sap.suite.ui.generic.template.lib.NavigationController", {
		setup: function() {
			testableHelper.startTest();
			oCrossAppNavService = Object.create(null);
			testableHelper.getStaticStub().StatePreserver_setCrossAppNavService(oCrossAppNavService);                         
			oSandbox = sinon.sandbox.create();

		},
		teardown: function() {
			oSandbox.restore();
			testableHelper.endTest();
		}
	});

	test("Shall be instantiable", function(assert) {
		var oStatePreserver = new StatePreserver(oTemplateContract, oSettings);
		assert.ok(oStatePreserver, "StatePreserver should be instantiable");
	});
	
	test("Set the page to the first state", function(assert){
		var done = assert.async();
		fnSetNavigateByExchangingQueryParamNoKey(assert);
		var oStatePreserver = new StatePreserver(oTemplateContract, oSettings);
		oSandbox.stub(oSettings, "applyState", function(oState){
			assert.deepEqual(oState, Object.create(null), "State must be empty initially");
			done();
		});
		oStatePreserver.applyAppState("firstKey", false);
	});
	
	test("State change must be handled: No state at all", function(assert) {
		fnSetNavigateByExchangingQueryParamNoKey(assert);
		oSandbox.spy(oSettings, "getCurrentState");
		var oStatePreserver = new StatePreserver(oTemplateContract, oSettings);
		oStatePreserver.stateChanged();
	});
	
	
	test("State change must be handled: State without any lifecycle information", function(assert) {
		fnSetNavigateByExchangingQueryParamNoKey(assert);
		var oMyData = { a: 1, b: 2};
		oSandbox.stub(oSettings, "getCurrentState", function(){
			return {
				info:{
					data: oMyData
				}	
			};
		});
		var oStatePreserver = new StatePreserver(oTemplateContract, oSettings);
		oStatePreserver.stateChanged();
	});	
});