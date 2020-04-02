/**
 * tests for the sap.suite.ui.generic.template.ListReport.extensionAPI.NonDraftTransactionController
 */

sap.ui.define(["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/lib/testableHelper",
		"sap/suite/ui/generic/template/ListReport/extensionAPI/NonDraftTransactionController"], function(Sinon,
		testableHelper, NonDraftTransactionController) {
	"use strict";

	var sandbox;
	var oStubForPrivate;
	var sut;
	var oTemplateUtils = {
		oServices: {
			oTransactionController: {
				triggerSubmitChanges: Function.prototype,
				resetChanges: Function.prototype
			}
		},
		oCommonUtils: {
			securedExecution: function(fnFunction) {
				return fnFunction();
			}
		}
	};
	var oController = {
		getView: function() {
			return {
				getModel: function() {
					return {
						hasPendingChanges: function() {
							return false;
						}
					}
				}
			}
		}
	};
	var oState;

	module("ListReport/ExtensionAPI/NonDraftTransactionController", {
		setup: function() {
			sandbox = sinon.sandbox.create();
			oStubForPrivate = testableHelper.startTest();
			sut = new NonDraftTransactionController(oTemplateUtils, oController, oState);
		},
		teardown: function() {
			testableHelper.endTest();
			sandbox.restore();
		}
	});

	QUnit.test("straight forward case: edit + save", function(assert) {
		sandbox.stub(oTemplateUtils.oServices.oTransactionController, "triggerSubmitChanges", function() {
			return Promise.resolve();
		});

		sut.edit("Test Context");
		var oPromise = sut.save();
		assert.ok(oPromise instanceof Promise, "save returned a Promise");

		var done = assert.async();
		setTimeout(function() {
			oPromise.then(function() {
				assert.ok(true, "...that was resolved");
				done();
			}, function() {
				assert.notOk(true, "...that was rejected");
				done();
			});
		});
	});

	QUnit.test("negative case: edit + save, error from backend", function(assert) {
		sandbox.stub(oTemplateUtils.oServices.oTransactionController, "triggerSubmitChanges", function() {
			return Promise.reject();
		});

		sut.edit("Test Context");
		var oPromise = sut.save();
		assert.ok(oPromise instanceof Promise, "save returned a Promise");

		var done = assert.async();
		setTimeout(function() {
			oPromise.then(function() {
				assert.notOk(true, "...that was resolved");
				done();
			}, function() {
				assert.ok(true, "...that was rejected");
				done();
			});
		});
	});

	QUnit.test("negative case: save without edit", function(assert) {
		try {
			sut.save();
			assert.notOk(true, "save raised no exception");
		} catch (oError) {
			assert.ok(oError instanceof Error, "save raised an exception");
		}
	});

	QUnit.test("negative case: cancel without edit", function(assert) {
		try {
			sut.cancel();
			assert.notOk(true, "cancel raised no exception");
		} catch (oError) {
			assert.ok(oError instanceof Error, "cancel raised an exception");
		}
	});

	QUnit.test("negative case: calling edit twice", function(assert) {
		sut.edit("Test Context");
		try {
			sut.edit("Test Context");
			assert.notOk(true, "2. edit raised no exception");
		} catch (oError) {
			assert.ok(oError instanceof Error, "2. edit raised an exception");
		}
	});

	QUnit.test("edit -> cancel -> edit", function(assert) {
		try {
			sut.edit("Test Context");
			sut.cancel();
			sut.edit("Test Context");
			assert.ok(true, "edit -> cancel -> edit without Exception");
		} catch (oError) {
			assert.notOk(true, "Excption raised");
		}
	});

	QUnit.test("edit -> save -> edit (after save has completed)", function(assert) {
		sandbox.stub(oTemplateUtils.oServices.oTransactionController, "triggerSubmitChanges", function() {
			return Promise.resolve();
		});

		sut.edit("Test Context");
		var oPromise = sut.save();
		assert.ok(oPromise instanceof Promise, "save returned a Promise");

		var done = assert.async();
		setTimeout(function() {
			oPromise.then(function() {
				assert.ok(true, "...that was resolved");
				try {
					sut.edit("Test Context");
					assert.ok(true, "edit -> save -> edit without Exception");
				} catch (oError) {
					assert.notOk(true, "Excption raised");
				}
				done();
			}, function() {
				assert.notOk(true, "...that was rejected");
				done();
			});
		});
	});

	QUnit.test("edit -> save -> edit (before save has completed)", function(assert) {
		sandbox.stub(oTemplateUtils.oServices.oTransactionController, "triggerSubmitChanges", function() {
			return new Promise(Function.prototype);
		});

		sut.edit("Test Context");
		var oPromise = sut.save();
		assert.ok(oPromise instanceof Promise, "save returned a Promise");

		try {
			sut.edit("Test Context");
		} catch (oError) {
			assert.ok(true, "Excption raised");
		}
	});

	QUnit.test("edit -> save -> save (before 1. save has completed)", function(assert) {
		// Save should check for and set a busy indication
		// if save is called again while still running, it should return a rejected promise

		// preparation
		var resolve1;
		sandbox.stub(oTemplateUtils.oServices.oTransactionController, "triggerSubmitChanges", function() {
			return new Promise(function(resolve) {
				resolve1 = resolve;
			});
		});

		var bIsBusy = false;

		sandbox.stub(oTemplateUtils.oCommonUtils, "securedExecution", function(fnFunction) {
			if (bIsBusy) { return Promise.reject(); }
			bIsBusy = true;
			return fnFunction().then(function() {
				bIsBusy = false;
			});
		});

		sut.edit("Test Context");
		var oPromise1 = sut.save();

		// execution: 2. save
		try {
			var oPromise2 = sut.save();
		} catch (oError) {
			assert.notOk(true, "Excption raised");
		}

		// check
		assert.ok(oPromise1 instanceof Promise, "first save returned a Promise");
		assert.ok(oPromise2 instanceof Promise, "second save returned a Promise");

		// checks for 2. call of save
		oPromise2.then(function() {
			assert.notOk(true, "Promise from second call to save was resolved");
			// now that the 2. call is returned (although not like expected), assume the first call returns from backend
			resolve1();
		}, function() {
			assert.ok(true, "Promise from second call to save was rejected");
			// now that the 2. call is rejected, assume the first call returns from backend
			resolve1();
		});

		var done = assert.async();
		setTimeout(function() {
			// checks for 1. call of save
			oPromise1.then(function() {
				assert.ok(true, "Promise from first call to save was resolved");
				done();
			}, function() {
				assert.notOk(true, "Promise from first call to save was rejected");
				done();
			});

		});
	});

});
