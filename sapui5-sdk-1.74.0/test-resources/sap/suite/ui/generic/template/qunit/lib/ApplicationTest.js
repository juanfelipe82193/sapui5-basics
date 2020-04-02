/**
 * tests for the sap.suite.ui.generic.template.lib.Application
 */
sap.ui.define([
	"testUtils/sinonEnhanced",
	"sap/ui/Device",
	"sap/suite/ui/generic/template/lib/Application",
	"sap/suite/ui/generic/template/lib/routingHelper",
	"sap/suite/ui/generic/template/lib/testableHelper"
], function (sinon, Device, Application, routingHelper, testableHelper) {
	"use strict";

	module("Correct determination of static private methods", {
		setup: testableHelper.startTest,
		teardown: testableHelper.endTest
	});

	function fnTestDensityClass(bTouch, aClassesInBody, sExpected, assert) {
		var oStaticStub = testableHelper.getStaticStub();
		var fnHasClass = function (sClass) {
			return aClassesInBody.some(function (currentValue) {
				return currentValue === sClass;
			});
		};
		if (!aClassesInBody.contains) {
			aClassesInBody.contains = function(className) {
				for (var i = 0; i<this.length; i++) {
					if (this[i] === className){
						return true
					}
				}
				return false;
			}
		}
		var sContentDensityClass = oStaticStub.Application_determineContentDensityClass(bTouch, {
			hasClass: fnHasClass,
			classList : aClassesInBody
		});
		assert.strictEqual(sContentDensityClass, sExpected, "Content density class must match");
	}

	QUnit.test("Test that density class is determined correctly on touch devices", fnTestDensityClass.bind(null, true, ["other"],
		"sapUiSizeCozy"));
	QUnit.test("Test that density class is determined correctly on non-touch devices", fnTestDensityClass.bind(null, false, ["other"],
		"sapUiSizeCompact"));
	QUnit.test("Test that density class is determined correctly on touch devices with preset density class", fnTestDensityClass.bind(null,
		true, ["sapUiSizeCozy"], ""));
	QUnit.test("Test that density class is determined correctly on non-touch devices with preset density class", fnTestDensityClass.bind(
		null, false, ["sapUiSizeCompact"], ""));
	QUnit.test("Test that attach to parent works correctly", function (assert) {
		var oStaticStub = testableHelper.getStaticStub();
		var oControl = {};
		var oParent = {};
		var oAddDependentSpy = sinon.spy(oParent, "addDependent");
		oStaticStub.Application_attachControlToParent(oControl, oParent);
		assert.ok(oAddDependentSpy.calledOnce, "control must have been added as dependent to parent");
		assert.ok(oAddDependentSpy.calledWithExactly(oControl), "correct control must have been added as dependent to parent");
	});

	module("Startup tests");

	QUnit.test("Test that Application can be created", function (assert) {
		var oTemplateContract = {};
		var oApplication = new Application(oTemplateContract);
		assert.ok(oApplication, "Application was created successfully");
		assert.ok(!!oTemplateContract.oApplicationProxy, "Proxy for application class has been inserted into the TemplateContract");
	});

	var oTemplateContract;
	var oApplication;
	module("Navigation tests", {
		setup: function () {
			oTemplateContract = {
				sRoutingType: "m"
			};
			oApplication = new Application(oTemplateContract);
		}
	});

	var oSandbox;
	var oTarget = {};

});
