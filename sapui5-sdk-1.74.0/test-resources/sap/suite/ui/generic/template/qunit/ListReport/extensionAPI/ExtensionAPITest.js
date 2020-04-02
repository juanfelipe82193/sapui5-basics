/**
 * tests for the sap.suite.ui.generic.template.ListReport.extensionAPI.NonDraftTransactionController
 */

sap.ui.define(["testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/ListReport/extensionAPI/ExtensionAPI"], function(Sinon, ExtensionAPI) {
	"use strict";

	var sandbox;
	var oStubForPrivate;
	var sut;
	var oTemplateUtils = {
		oServices: {
			oApplicationController: {
				invokeActions: Function.prototype
			}
		},
			oComponentUtils: {
				isDraftEnabled: Function.prototype
			}
	};
	var oController = {};
	var oState = {};

	QUnit.module("ListReport/ExtensionAPI/ExtensionAPI", {
		before: function() {
			sandbox = Sinon.sandbox.create();
			sut = new ExtensionAPI(oTemplateUtils, oController, oState);
		},
		after: function() {
			sandbox.restore();
		}
	}, function(){
		QUnit.test("invokeActions", function(assert) {
			var oExpectedResult = {};
			sandbox.stub(oTemplateUtils.oServices.oApplicationController, "invokeActions", function() {
				return Promise.resolve(oExpectedResult);
			});

			var oPromise = sut.invokeActions();
			assert.ok(oPromise instanceof Promise, "invokeActions returned a Promise");

			var done = assert.async();
			setTimeout(function() {
				oPromise.then(function(oActualResult) {
					assert.equal(oActualResult, oExpectedResult, "...that was resolved to the same result as the promise returned from application controller");
					done();
				}, function() {
					assert.notOk(true, "...that was rejected");
					done();
				});
			});
		});
	});

});
