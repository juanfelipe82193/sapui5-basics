/**
 * tests for the sap.suite.ui.generic.template.lib.CRUDManager
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/testableHelper", "sap/suite/ui/generic/template/lib/CRUDHelper"], function(sinon, testableHelper, CRUDHelper) {
	"use strict";

	var oDraftContext = {};
	var oDraftController = {
			getDraftContext: function(){return oDraftContext;}
	};
	var oTransactionController = {
			getDraftController: function(){return oDraftController;}
	};
	var oModel = {};
	var oComponent = {
			getModel: function(){return oModel;}
	};

	var oTemplateContract = {
			oBusyHelper: {
				setBusy: Function.prototype,
				getUnbusy: function(){return Promise.resolve();}
			},
			oApplicationProxy: {},
			getText: Function.prototype
			};

	var sandbox;
	var oStubForPrivate;

	module("lib.CRUDHelper Edit", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("CRUD Helper first test", function(assert) {
		assert.ok(true, "First test");
	});

	QUnit.test("draft, no preserve change, active", function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function() {
			return true;
		});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({});
		});
		var oTransactionControllerResult = {};
		sandbox.stub(oTransactionController, "editEntity", function(){return Promise.resolve(oTransactionControllerResult);});

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");

		var done = assert.async();
		setTimeout(function() {
			oEditPromise.then(function(oCRUDHelperResult) {
				assert.ok(true, "..that is resolved");

				assert.ok(oModel.read.calledOnce, "Model read called (once!)");
				assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
				assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");

				assert.ok(oTransactionController.editEntity.calledOnce, "TransactionController editEntity called (once!)");
				assert.equal(oTransactionController.editEntity.getCall(0).args[0].sPath, "BindingPath", "... with path");
				assert.equal(oTransactionController.editEntity.getCall(0).args[0].oModel, oModel, "... and model");
				assert.notOk(oTransactionController.editEntity.getCall(0).args[1], "BindingPath", "... and preserveChanges = false");

				assert.equal(oCRUDHelperResult,oTransactionControllerResult, "Resolved to result from TransactionController");
				done();
			}, function(){
				assert.notOk(true, "..that is rejected");
				done();
			});
		});
	});

	QUnit.test("draft, no preserve change, own draft", function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function(){return true;});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: true
				}
			});
		});
		var oTransactionControllerResult = {};
		sandbox.stub(oTransactionController, "editEntity", function(){return Promise.resolve(oTransactionControllerResult);});

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");

		var done = assert.async();
		setTimeout(function() {
			oEditPromise.then(function(oCRUDHelperResult) {
				assert.ok(true, "..that is resolved");

				assert.ok(oModel.read.calledOnce, "Model read called (once!)");
				assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
				assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");

				assert.ok(oTransactionController.editEntity.calledOnce, "TransactionController editEntity called (once!)");
				assert.equal(oTransactionController.editEntity.getCall(0).args[0].sPath, "BindingPath", "... with path");
				assert.equal(oTransactionController.editEntity.getCall(0).args[0].oModel, oModel, "... and model");
				assert.notOk(oTransactionController.editEntity.getCall(0).args[1], "BindingPath", "... and preserveChanges = false");

				assert.equal(oCRUDHelperResult,oTransactionControllerResult, "Resolved to result from TransactionController");
				done();
			}, function(){
				assert.notOk(true, "..that is rejected");
				done();
			});
		});
	});

	QUnit.test("draft, no preserve change, locked", function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function(){return true;});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: false,
					InProcessByUser: "Other User",
					InProcessByUserDescription: "Other User description"
				}
			});
		});
		sandbox.stub(oTransactionController, "editEntity");

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");

		var done = assert.async();
		setTimeout(function() {
			oEditPromise.then(function() {
				assert.notOk(true, "..that is resolved");
				done();
			}, function(oCRUDHelperResult){
				assert.ok(true, "..that is rejected");

				assert.ok(oModel.read.calledOnce, "Model read called (once!)");
				assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
				assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");

				assert.notOk(oTransactionController.editEntity.called, "TransactionController editEntity not called");

				assert.deepEqual(oCRUDHelperResult,{lockedByUser: "Other User description"}, "Rejected with locking user description");
				done();
			});
		});
	});

	QUnit.test("draft, no preserve change, unsaved changes, user cancels", function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function(){return true;});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: false,
					InProcessByUser: "",
					InProcessByUserDescription: "",
					LastChangedByUser: "Other User",
					LastChangedByUserDescription: "Other User description"
				}
			});
		});

		sandbox.stub(oTransactionController, "editEntity");

		var oUnsavedChangesDialog = {
				open: Function.prototype,
				getModel: function(){
					return {
						setProperty: Function.prototype
					};
				},
				setModel: Function.prototype,
				close: Function.prototype
			};

		sandbox.stub(oTemplateContract.oApplicationProxy, "getDialogFragment", function(sFragmentName, oController,	sModelName) {
			sandbox.stub(oUnsavedChangesDialog, "open", function() {
				oController.onCancel();
			});
			return oUnsavedChangesDialog;
		});

		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");

		var done = assert.async();
		setTimeout(function() {
			oEditPromise.then(function() {
				assert.notOk(true, "..that is resolved");
				done();
			}, function(oCRUDHelperResult){
				assert.ok(true, "..that is rejected");

				assert.ok(oModel.read.calledOnce, "Model read called (once!)");
				assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
				assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");

				assert.ok(oTemplateContract.oApplicationProxy.getDialogFragment.calledOnce, "DialogFragment read");
				assert.equal(oTemplateContract.oApplicationProxy.getDialogFragment.getCall(0).args[0], "sap.suite.ui.generic.template.ObjectPage.view.fragments.UnsavedChangesDialog", "for UnsavedChanges Dialog");

				assert.ok(oUnsavedChangesDialog.open.calledOnce, "and Dialog opened");

				assert.notOk(oTransactionController.editEntity.called, "TransactionController editEntity not called");

				assert.deepEqual(oCRUDHelperResult,{lockedByUser: "Other User description"}, "Rejected with locking user description");
				done();
			});
		});
	});

	QUnit.test("draft, no preserve change, unsaved changes, user decides to override", function(assert) {
		// prepare
		sandbox.stub(oDraftContext, "isDraftEnabled", function(){return true;});
		sandbox.stub(oDraftContext, "hasPreserveChanges", function() {
			return false;
		});
		sandbox.stub(oModel, "read", function(sPath, mParameters) {
			mParameters.success({
				DraftAdministrativeData: {
					DraftIsCreatedByMe: false,
					InProcessByUser: "",
					InProcessByUserDescription: "",
					LastChangedByUser: "Other User",
					LastChangedByUserDescription: "Other User description"
				}
			});
		});

		var oTransactionControllerResult = {};
		sandbox.stub(oTransactionController, "editEntity", function(){return Promise.resolve(oTransactionControllerResult);});

		var oUnsavedChangesDialog = {
				open: Function.prototype,
				getModel: function(){
					return {
						setProperty: Function.prototype
					};
				},
				setModel: Function.prototype,
				close: Function.prototype
			};

		sandbox.stub(oTemplateContract.oApplicationProxy, "getDialogFragment", function(sFragmentName, oController,	sModelName) {
			sandbox.stub(oUnsavedChangesDialog, "open", function() {
				oController.onEdit();
			});
			return oUnsavedChangesDialog;
		});


		// execute
		var oEditPromise = CRUDHelper.edit(oTransactionController, "EntitySet", "BindingPath", oModel, oTemplateContract);

		// check
		assert.ok(oEditPromise instanceof Promise, "Edit returned a Promise");

		var done = assert.async();
		setTimeout(function() {
			oEditPromise.then(function(oCRUDHelperResult) {
				assert.ok(true, "..that is resolved");

				assert.ok(oModel.read.calledOnce, "Model read called (once!)");
				assert.equal(oModel.read.getCall(0).args[0], "BindingPath", "... with meaningful path");
				assert.deepEqual(oModel.read.getCall(0).args[1].urlParameters, {"$expand": "DraftAdministrativeData"}, "... and needed urlParamters");

				assert.ok(oTemplateContract.oApplicationProxy.getDialogFragment.calledOnce, "DialogFragment read");
				assert.equal(oTemplateContract.oApplicationProxy.getDialogFragment.getCall(0).args[0], "sap.suite.ui.generic.template.ObjectPage.view.fragments.UnsavedChangesDialog", "for UnsavedChanges Dialog");

				assert.ok(oUnsavedChangesDialog.open.calledOnce, "and Dialog opened");

				assert.ok(oTransactionController.editEntity.calledOnce, "TransactionController editEntity called (once!)");
				assert.equal(oTransactionController.editEntity.getCall(0).args[0].sPath, "BindingPath", "... with path");
				assert.equal(oTransactionController.editEntity.getCall(0).args[0].oModel, oModel, "... and model");
				assert.notOk(oTransactionController.editEntity.getCall(0).args[1], "BindingPath", "... and preserveChanges = false");

				assert.equal(oCRUDHelperResult,oTransactionControllerResult, "Resolved to result from TransactionController");
				done();
			}, function(){
				assert.notOk(true, "..that is rejected");
				done();
			});
		});
	});


	var oMetaModel = {};
	var fnHasDraft;
	var oApplicationController = {
		getTransactionController: function(){
			return {
				getDraftController: function(){
					return {
						getDraftContext: function(){
							return {
								hasDraft: function(oContext){
									return fnHasDraft(oContext);
								}
							};
						}
					};
				}
			};
		}
	};
	var fnPropertyChanged;
	oTemplateContract.oAppComponent = {
		getModel: function(){
			return {
				attachPropertyChange: function(fnHandler){
					fnPropertyChanged = fnHandler;
				},
				getMetaModel: function (){
					return oMetaModel;
				}
			};
		},
		getApplicationController: function(){
			return oApplicationController;
		},
		getNavigationController: function(){
			return {};
		}
	};
	module("lib.CRUDHelper propertyChange", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			CRUDHelper.enableAutomaticDraftSaving(oTemplateContract);
		},
		teardown: function() {
			fnPropertyChanged = null;
			fnHasDraft = null;
			sandbox.restore();
		}
	});

	function fnPropertyChangeTest(oContext, sPath, bIsDraft, sExpectedEntitySet, oEntitySet, bCallIsExpected, assert){
		sandbox.stub(oMetaModel, "getODataEntitySet", function(sEntitySet){
			assert.strictEqual(sEntitySet, sExpectedEntitySet, "Read metadata for expected entity set");
			return oEntitySet;
		});
		fnHasDraft = function(oTheContext){
			assert.strictEqual(oTheContext, oContext, "Draft check must be done for the correct context");
			return bIsDraft;
		};
		var oEvent = {
			getParameter: function(sParameter){
				if (sParameter === "context"){
					return oContext;
				}
				if (sParameter === "path"){
					return sPath;
				}
				assert.ok(false, "Only parameters 'path' and 'context' may be retrieved");
			}
		};
		var oPropertyChangedSpy = bCallIsExpected && sandbox.stub(oApplicationController, "propertyChanged", function(){
			return Promise.resolve();
		});
		var fnMarkCurrentDraftAsModifiedSpy = bCallIsExpected && sandbox.stub(oTemplateContract.oApplicationProxy, "markCurrentDraftAsModified", function(){
				return;
		});
		fnPropertyChanged(oEvent);
		if (oPropertyChangedSpy){
			assert.ok(oPropertyChangedSpy.calledOnce, "propertyChanged on ApplicationController must have been called");
			assert.ok(oPropertyChangedSpy.calledWithExactly(sPath, oContext), "propertyChanged on ApplicationController must have been called with correct parameters");
		}
		if (fnMarkCurrentDraftAsModifiedSpy){
			assert.ok(fnMarkCurrentDraftAsModifiedSpy.calledOnce, "markCurrentDraftAsModified must have been called");
		}
	}

	QUnit.test("Parameter entered in Popup for Action with parameter", fnPropertyChangeTest.bind(null, {
		getPath: function() {
			return "/entitySetFunctionImport(key)";
		}
	}, "aPath", true, "entitySetFunctionImport", null, false));

	QUnit.test("Normal property change", fnPropertyChangeTest.bind(null, {
		getPath: function() {
			return "/TheEntitySet";
		}
	}, "aPath", true, "TheEntitySet", {}, true));

	QUnit.test("Normal property change but non-draft", fnPropertyChangeTest.bind(null, {
		getPath: function() {
			return "/TheEntitySet";
		}
	}, "aPath", false, "TheEntitySet", {}, false));
});
