/**
 * tests for the sap.suite.ui.generic.template.lib.CRUDManager
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/testableHelper",
                "sap/suite/ui/generic/template/lib/MessageUtils", "sap/suite/ui/generic/template/lib/CRUDHelper", "sap/suite/ui/generic/template/lib/CRUDManager",
            		"sap/ui/generic/app/util/ActionUtil"
], function(sinon, testableHelper, MessageUtils, CRUDHelper, CRUDManager, ActionUtil) {
	"use strict";

	var oContext = Object.freeze({});
	var oView = {
		getBindingContext: function(){
			return oContext;
		}
	};
	var oController = {
		getView: function(){
			return oView;
		},
		customizeMsgModelforTransientMessages: function(){
			return;
		}
	};
	var oComponentUtils = {
		isDraftEnabled: function() {},
		registerContext: function(oContext) {}
	};
	var oCommonUtils;
	var bIsBusy;
	var oBusyHelper = {
		isBusy: function(){
			return bIsBusy;
		}
	};
	var oServices = Object.freeze({
		oDraftController: {},
		oApplication: { setEditableNDC: Function.prototype }
	});
	var sandbox, oStubForPrivate;
	var oCRUDManager;

	module("activateDraftEntity", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			bIsBusy = false;
			oCRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("activateDraftEntity - does not run when busy", function(assert) {
		bIsBusy = true;
		var done = assert.async();
		var oActivationPromise = oCRUDManager.activateDraftEntity();
		oActivationPromise.catch(done);
		assert.ok(true, "function was executed without exception");
	});


	function fnTestActivation(bWithExpand, assert) {

		var oResponse;
		var aBusyPromises = [];
		sandbox.stub(oBusyHelper, "setBusy", function(oPromise){
			aBusyPromises.push(oPromise);
			bIsBusy = true;
		});
		var done = assert.async();
		var fnActivationResolved;
		var bIsActivated = false;
		var bIsApplicationInformed = false;
		var bIsCallerInformed = false;
		sandbox.stub(oServices.oDraftController, "activateDraftEntity", function(oCtx){
			assert.strictEqual(oCtx, oContext, "Correct context must have been passed to the draft controller");
			assert.ok(!fnActivationResolved, "Activation must not be called twice");
			return new Promise(function(fnResolve){
				fnActivationResolved = fnResolve;
			});
		});
		sandbox.stub(oServices.oApplication, "activationStarted", function(oCtx, oActivationPromise){
			assert.strictEqual(oCtx, oContext, "Correct context must have been passed to Application");
			oActivationPromise.then(function(){
				assert.ok(bIsActivated, "Activation must have taken place before ActivationPromise ended");
				bIsApplicationInformed = true;
				if (bIsCallerInformed && !bIsBusy){
					done();
				}
			});
		});
		var oSiblingContext = {};
		sandbox.stub(oServices.oApplication, "getDraftSiblingPromise", function(){
			return Promise.resolve(oSiblingContext);
		});
		sandbox.stub(oController, "getOwnerComponent", function(){
			return {
				getModel: function(){
					return {
						invalidateEntry: function(oEntry){
							assert.equal(oSiblingContext, oEntry, "(active) Sibling must be passed to the model for invalidation");
						}
					};
				}
			};
		});
		var oCRUDPromise = oCRUDManager.activateDraftEntity();
		oCRUDPromise.then(function(oRep){
			assert.strictEqual(oRep, oResponse, "response must have been passed to the caller");
			assert.ok(bIsActivated, "Activation must have taken place before caller is informed");
			bIsCallerInformed = true;
			if (bIsApplicationInformed && !bIsBusy){
				done();
			}
		});
		Promise.all(aBusyPromises).then(function(){
			bIsBusy = false;
			if (bIsCallerInformed && bIsApplicationInformed){
				done();
			}
		});
		setTimeout(function(){
			bIsActivated = true;
			var sPath = {};
			oResponse = {
				context: {
					getPath: function(){
						return sPath;
					}
				}
			};
			var aExpand = ["abc", "def"];
			sandbox.stub(oComponentUtils, "getPreprocessorsData", function(){
				return {
					rootContextExpand: bWithExpand && aExpand
				};
			});
			sandbox.stub(oServices.oApplication, "getDialogFragmentForView", Function.prototype);
			if (bWithExpand){
				sandbox.stub(oView, "getModel", function(sName){
					assert.ok(!sName, "Only default model must be accessed");
					return {
						read: function(vPath, oOptions){
							assert.strictEqual(vPath, sPath, "Path must be used in read correctly");
							assert.strictEqual(oOptions.urlParameters["$select"], "abc,def", "Select clause must be set correctly");
							assert.strictEqual(oOptions.urlParameters["$expand"], "abc,def", "Expand clause must be set correctly");
							setTimeout(oOptions.success, 0);
						}
					};
				});
			}
			fnActivationResolved(oResponse);
		}, 0);
	}

	QUnit.test("activateDraftEntity - runs correctly when not busy and no expands", fnTestActivation.bind(null, false));

	QUnit.test("activateDraftEntity - runs correctly when not busy and with expands", fnTestActivation.bind(null, true));


	module("Call action", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			bIsBusy = false;
			oCRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	})

	QUnit.test("Call action with or without parameters, successful", function(assert){
		// preparation for the call itself
		sandbox.stub(oServices.oApplication, "performAfterSideEffectExecution", function(fn){fn()});
		var fnParametersEntered;
		var oParameterPopupPromise;
		var oActionUtil = {
				call: function(){
					oParameterPopupPromise = new Promise(function(resolve,reject){
						fnParametersEntered = resolve;
					});
					return oParameterPopupPromise;
				}
		}
		sandbox.stub(oStubForPrivate, "getActionUtil", function(){
			return oActionUtil;
		});
		sandbox.stub(oBusyHelper, "setBusy");

		// actual call
		var mParameters = {};
		var oResult = oCRUDManager.callAction(mParameters);

		// check
		assert.ok(oResult instanceof Promise, "CallAction returned a Promise");
		assert.notOk(oBusyHelper.setBusy.called, "BusyHelper not called yet");

		// parameters entered
		var fnBackendSuccess;
		var oBackendPromise = new Promise(function(resolve, reject){
			fnBackendSuccess = resolve;
		});
		fnParametersEntered({executionPromise: oBackendPromise});

		// check
		oParameterPopupPromise.then(function(){
			assert.ok(oBusyHelper.setBusy.calledOnce, "BusyHelper called");
			assert.ok(oBusyHelper.setBusy.calledWith(oBackendPromise), "...with Backend Promise")
		});

		// preparation for result handling
		sandbox.stub(oController, "getOwnerComponent", function(){
			return {
				getAppComponent: function(){
					return {
						getConfig: Function.prototype
					};
				},
				getCreationEntitySet: function() {
					return false;
				}
			};
		});

		// provide result from backend
		var oBackendResult = {};
		fnBackendSuccess(oBackendResult);

		// checks after promise settled
		var done = assert.async();
		oResult.then(function(oResult){
			assert.ok(true, "Promise from CallAction is resolved..");
				assert.equal(oResult, oBackendResult, "...to the result returned from backend");
				done();
		}, function(){
			assert.notOk(true, "Promise from CallAction is rejected");
			done();
		});
	});

	QUnit.test("Call action with or without parameters, error from backend", function(assert){
		// preparation for the call itself
		sandbox.stub(oServices.oApplication, "performAfterSideEffectExecution", function(fn){fn()});
		var fnParametersEntered;
		var oParameterPopupPromise;
		var oActionUtil = {
				call: function(){
					oParameterPopupPromise = new Promise(function(resolve,reject){
						fnParametersEntered = resolve;
					});
					return oParameterPopupPromise;
				}
		}
		sandbox.stub(oStubForPrivate, "getActionUtil", function(){
			return oActionUtil;
		});
		sandbox.stub(oBusyHelper, "setBusy");

		// actual call
		var mParameters = {};
		var oResult = oCRUDManager.callAction(mParameters);

		// check
		assert.ok(oResult instanceof Promise, "CallAction returned a Promise");
		assert.notOk(oBusyHelper.setBusy.called, "BusyHelper not called yet");

		// parameters entered
		var fnBackendError;
		var oBackendPromise = new Promise(function(resolve, reject){
			fnBackendError = reject;
		});
		fnParametersEntered({executionPromise: oBackendPromise});

		// check
		oParameterPopupPromise.then(function(){
			assert.ok(oBusyHelper.setBusy.calledOnce, "BusyHelper called");
			assert.ok(oBusyHelper.setBusy.calledWith(oBackendPromise), "...with Backend Promise")
		});

		// preparation for result handling
		sandbox.stub(MessageUtils, "handleError", Function.prototype);

		// provide error from backend
		var oBackendError = {};
		fnBackendError(oBackendError);

		// checks after promise settled
		var done = assert.async();
		oResult.then(function(){
			assert.notOk(true, "Promise from CallAction is resolved..");
				done();
		}, function(oError){
			assert.ok(true, "Promise from CallAction is rejected..");
			assert.equal(oError, oBackendError, "...to the error returned from backend");
			done();
		});
	});

	QUnit.test("Call action with parameters, user cancels", function(assert){
		// preparation for the call itself
		sandbox.stub(oServices.oApplication, "performAfterSideEffectExecution", function(fn){fn()});
		var fnUserCancellation;
		var oActionUtil = {
				call: function(){
					return new Promise(function(resolve,reject){
						fnUserCancellation = reject;
					});
				}
		}
		sandbox.stub(oStubForPrivate, "getActionUtil", function(){
			return oActionUtil;
		});
		sandbox.stub(oBusyHelper, "setBusy");

		// actual call
		var mParameters = {};
		var oResult = oCRUDManager.callAction(mParameters);

		// check
		assert.ok(oResult instanceof Promise, "CallAction returned a Promise");

		// user cancels
		fnUserCancellation();

		// checks after promise settled
		var done = assert.async();
		oResult.then(function(){
			assert.notOk(true, "...that is resolved");
			done();
		}, function(oError){
			assert.ok(true, "...that is rejected");
			assert.equal(oError, null, "...without any error");
			assert.notOk(oBusyHelper.setBusy.called, "BusyHelper not called");
			done();
		});
	});

});
