/**
 * tests for the sap.suite.ui.generic.template.lib.CRUDManager
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/testableHelper",
                "sap/suite/ui/generic/template/lib/MessageUtils", "sap/suite/ui/generic/template/lib/CRUDHelper", "sap/suite/ui/generic/template/lib/CRUDManager"], function(sinon, testableHelper, MessageUtils, CRUDHelper, CRUDManager) {
	"use strict";

	var oController = {}, oComponentUtils, oCommonUtils, oBusyHelper;
	var oServices = {
		oDraftController: {},
		oApplication: {
			setEditableNDC: Function.prototype,
			mustRequireRequestsCanonical: function(){
				return true;
			}
		}
	};
	var sandbox, oStubForPrivate;
	var oCRUDManager;

	module("lib.CRUDManager-addEntry", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			oCRUDManager = new CRUDManager(oController, oComponentUtils, oServices, oCommonUtils, oBusyHelper);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("Add Entry - draft case", function(assert) {
		// preparation
		var oTable = {};
		sandbox.stub(oController, "getOwnerComponent", function() {
			return {
				getEntitySet: Function.prototype,
				getCreationEntitySet: function() {
					return false;
				},
				getMetadata:function(){
					return {
						getName: function() {
							return "sap.suite.ui.generic.template.ListReport.Component"
						}
					}
				}
			};
		});
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: Function.prototype,
				getBindingContext: Function.prototype
			};
		});
		sandbox.stub(oServices.oDraftController, "getDraftContext", function() {
			return {
				isDraftEnabled: function() {
					return true;
				}
			};
		});
		sandbox.stub(oServices.oApplication, "getBusyHelper", function(){
			return {setBusy: Function.prototype};
		});
		sandbox.stub(oServices.oApplication, "markCurrentDraftAsModified", function(){
			return true;
		});

		var oContext = {};
		sandbox.stub(oServices.oDraftController, "createNewDraftEntity", function() {
			return new Promise(function(resolve) {
				resolve({
					context: oContext
				});
			});
		});

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {

			// execution
			var oResult = oCRUDManager.addEntry(oTable);

			// check
			assert.ok(oResult instanceof Promise, "returned a Promise");

			oResult.then(function(result) {
				assert.ok(true, "...that is resolved");
				assert.equal(result.newContext, oContext, "providing new Context...");
				assert.equal(result.tableBindingPath, "", "... and empty TableBindingPath");
				done();
			}, function() {
				assert.notOk(true, "...that is rejected");
				done();
			});
		});
	});

	QUnit.test("Add Entry - draft case - negativ test", function(assert) {
		// preparation
		var oTable = {};
		sandbox.stub(oController, "getOwnerComponent", function() {
			return {
				getEntitySet: Function.prototype,
				getCreationEntitySet: function() {
					return false;
				},
				getMetadata:function(){
					return {
						getName: function() {
							return "sap.suite.ui.generic.template.ListReport.Component"
						}
					}
				}
			};
		});
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: Function.prototype,
				getBindingContext: Function.prototype
			};
		});
		sandbox.stub(oServices.oDraftController, "getDraftContext", function() {
			return {
				isDraftEnabled: function() {
					return true;
				}
			};
		});
		var oErrorFromDC = {};
		sandbox.stub(oServices.oDraftController, "createNewDraftEntity", function() {
			return new Promise(function(resolve, reject) {
//			negativ test: backend returns unsuccessful
				reject(oErrorFromDC);
			});
		});
		sandbox.stub(oServices.oApplication, "getBusyHelper", function(){
			return {setBusy: Function.prototype};
		});

		var oErrorFromHandleError = {};
		sandbox.stub(oStubForPrivate, "handleError", function(sOperation, reject){
			reject(oErrorFromHandleError);
		});

		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {

			// execution
			var oResult = oCRUDManager.addEntry(oTable);

			// check
			assert.ok(oResult instanceof Promise, "returned a Promise");

			oResult.then(function(result) {
				assert.notOk(true, "...that is resolved");
				done();
			}, function() {
				assert.ok(true, "...that is rejected");
				assert.ok(oStubForPrivate.handleError.calledOnce, "handleError was called");
				assert.equal(oStubForPrivate.handleError.args[0][0],MessageUtils.operations.addEntry, "with operation addEntry");
				assert.equal(oStubForPrivate.handleError.args[0][2],oErrorFromDC, "and the error as returned from DraftController");
				done();
			});
		});
	});

	QUnit.test("Add Entry - draft case - negativ test 2", function(assert) {
		// stubbing only MessageUtils.handleError, but not (private) CRUDManager.handleError
		// preparation
		var oTable = {};
		sandbox.stub(oController, "getOwnerComponent", function() {
			return {
				getEntitySet: Function.prototype,
				getCreationEntitySet: function() {
					return false;
				},
				getMetadata:function(){
					return {
						getName: function() {
							return "sap.suite.ui.generic.template.ListReport.Component"
						}
					}
				}
			};
		});
		sandbox.stub(oController, "getView", function() {
			return {
				getModel: Function.prototype,
				getBindingContext: Function.prototype
			};
		});
		var oErrorFromCRUDHelper = {};
		sandbox.stub(CRUDHelper, "create", function() {
//			negativ test: backend returns unsuccessful
			return Promise.reject(oErrorFromCRUDHelper);
		});

		sandbox.stub(MessageUtils, "handleError", Function.prototype);
		sandbox.stub(oServices.oApplication, "getBusyHelper", function(){
			return {setBusy: Function.prototype};
		});


		var done = assert.async(); // provides a done function to signal the test framework, that all checks are done
		setTimeout(function() {

			// execution
			var oResult = oCRUDManager.addEntry(oTable);

			// check
			assert.ok(oResult instanceof Promise, "returned a Promise");

			oResult.then(function() {
				assert.notOk(true, "...that is resolved");
				done();
			}, function(error) {
				assert.ok(true, "...that is rejected");
				assert.equal(error, oErrorFromCRUDHelper, "...and the error as returned from CRUDHelper");
				assert.ok(MessageUtils.handleError.calledOnce, "handleError (from MessageUtils) was called");
				done();
			});
		});
	});

});
