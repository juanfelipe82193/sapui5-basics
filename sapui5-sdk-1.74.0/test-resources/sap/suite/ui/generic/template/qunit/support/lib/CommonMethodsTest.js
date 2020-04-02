/*
 * tests for the sap.suite.ui.generic.template.support.lib.CommonChecks
 */
sap.ui.define([
	"sap/suite/ui/generic/template/support/lib/CommonMethods",
	"test-resources/sap/suite/ui/generic/template/qunit/support/lib/CommonChecksTest"
], function (CommonMethods) {
	"use strict";

	QUnit.module("CommonMethods", {
		setup: function () {
		},
		teardown: function () {
		}
	});

	/**
	 * test getDynamicComparator of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("getDynamicComparator", function (assert) {

		function compareArrays(aArray1, aArray2) {
			if (aArray1.length !== aArray2.length) {
				return false;
			}

			for (var i in aArray1) {
				if (aArray1.hasOwnProperty(i) && aArray2.hasOwnProperty(i)) {
					if (aArray1[i] !== aArray2[i]) {
						return false;
					}
				}
			}
			return true;
		}

		var oA = {name: "aaaa", size: 3, age: 2};
		var oB = {name: "bbbb", size: 2, age: 3};
		var oC = {name: "cccc", size: 1, age: 3};
		var aArray = [oA, oB, oC];

		assert.ok(compareArrays(aArray.sort(CommonMethods.getDynamicComparator("name")), [oA, oB, oC]), "Sort by property name ascending");
		assert.ok(compareArrays(aArray.sort(CommonMethods.getDynamicComparator("-name")), [oC, oB, oA]), "Sort by property name descending");
		assert.ok(compareArrays(aArray.sort(CommonMethods.getDynamicComparator("size")), [oC, oB, oA]), "Sort by property size ascending");
		assert.ok(compareArrays(aArray.sort(CommonMethods.getDynamicComparator("-size")), [oA, oB, oC]), "Sort by property size descending");
		assert.ok(compareArrays(aArray.sort(CommonMethods.getDynamicComparator("age")), [oA, oB, oC]), "Sort by property age ascending");
		assert.ok(compareArrays(aArray.sort(CommonMethods.getDynamicComparator("-age")), [oB, oC, oA]), "Sort by property age descending");
	});

	/**
	 * test getFileFromURI of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("getFileFromURI", function (assert) {
		var fnDone = assert.async();
		setTimeout(function () {
			var oPromise = CommonMethods.getFileFromURI("test-resources/sap/suite/ui/generic/template/qunit/support/testdata/manifest.DiagnosticsTool.json");
			oPromise.then(function (oData) {
				assert.ok(oData.successful, "Manifest loaded from file");
				fnDone();
			});
		});
	});

	/**
	 * test set-/getApplicationStatus of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("set-/getApplicationStatus", function (assert) {
		assert.equal(CommonMethods.getApplicationStatus(), CommonMethods.mApplicationStatus.UNKNOWN, "check default application status");
		CommonMethods.setApplicationStatus(CommonMethods.mApplicationStatus.RENDERED);
		assert.equal(CommonMethods.getApplicationStatus(), CommonMethods.mApplicationStatus.RENDERED, "application status equals set application status");
	});

	/**
	 * test isValidApplicationStatus of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("isValidApplicationStatus", function (assert) {
		assert.ok(CommonMethods.isValidApplicationStatus(CommonMethods.mApplicationStatus.UNKNOWN), "check UNKNOWN application status");
		assert.ok(CommonMethods.isValidApplicationStatus(CommonMethods.mApplicationStatus.RENDERED), "check RENDERED application status");
		assert.ok(CommonMethods.isValidApplicationStatus(CommonMethods.mApplicationStatus.FAILED), "check FAILED application status");
		assert.ok(CommonMethods.isValidApplicationStatus(CommonMethods.mApplicationStatus.LOADING), "check LOADING application status");
		assert.ok(!CommonMethods.isValidApplicationStatus("dummy"), "check dummy application status");
	});

	/**
	 * test set-/getAppComponent of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("set-/getAppComponent", function (assert) {
		assert.ok(Object.keys(CommonMethods.getAppComponent()).length === 0, "check default app component");
		var oAppComponent = {test: "Test"};
		assert.ok(CommonMethods.setAppComponent(oAppComponent), "check set app component");
		assert.equal(CommonMethods.getAppComponent().test, "Test", "check get app component");
	});

	/**
	 * test concatStrings of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("concatStrings", function (assert) {
		assert.equal(CommonMethods.concatStrings(), "", "Empty input");
		assert.equal(CommonMethods.concatStrings([]), "", "Empty array as input");
		assert.equal(CommonMethods.concatStrings({}), "", "Empty object as input");
		assert.equal(CommonMethods.concatStrings(["Test1"]), "Test1", "Valid input with length 1");
		assert.equal(CommonMethods.concatStrings(["Test1", "Test2"]), "Test1, Test2", "Valid input with length 2");
		assert.equal(CommonMethods.concatStrings(["Test1", {}]), "Test1", "Ignore empty objects at the end");
		assert.equal(CommonMethods.concatStrings(["Test1", {}, "Test2"]), "Test1, Test2", "Ignore empty objects in the middle");
	});

	/**
	 * test hasObjectContent of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("hasObjectContent", function (assert) {
		assert.equal(CommonMethods.hasObjectContent(), false, "Empty input");
		assert.equal(CommonMethods.hasObjectContent([]), false, "Empty array as input");
		assert.equal(CommonMethods.hasObjectContent({}), false, "Empty object as input");
		assert.equal(CommonMethods.hasObjectContent(["Test1"]), true, "Not empty array");
		assert.equal(CommonMethods.hasObjectContent({name: "Test1"}), true, "Not empty object");
		assert.equal(CommonMethods.hasObjectContent({name: {}}), true, "Not empty object, deep test");
	});

	/**
	 * test getApplicationName of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("getApplicationName", function (assert) {
		assert.equal(CommonMethods.getApplicationName(), "", "Empty input");
		assert.equal(CommonMethods.getApplicationName(""), "", "Empty string as input");
		assert.equal(CommonMethods.getApplicationName("#"), "", "# as input");
		assert.equal(CommonMethods.getApplicationName("localhost/test#appName-object?dummy"), "appName-object", "Valid input, split by ?");
		assert.equal(CommonMethods.getApplicationName("localhost/test#appName-object/dummy"), "appName-object", "Valid input, split by /");
		assert.equal(CommonMethods.getApplicationName("localhost/test#appName-object~dummy"), "appName-object", "Valid input, split by ~");
		assert.equal(CommonMethods.getApplicationName("localhost/test#appName-object&dummy"), "appName-object", "Valid input, split by &");
	});

	/**
	 * test shortenURL of sap.suite.ui.generic.template.support.lib.CommonMethods
	 */
	QUnit.test("shortenURL", function (assert) {
		assert.equal(CommonMethods.shortenURL(), "", "Empty input");
		assert.equal(CommonMethods.shortenURL(""), "", "Empty string as input");
		assert.equal(CommonMethods.shortenURL("localhost/test#"), "localhost/test#", "Valid input, empty hash");
		assert.equal(CommonMethods.shortenURL("localhost/test"), "localhost/test", "Valid input, without hash");
		assert.equal(CommonMethods.shortenURL("localhost/test#appName-object?dummy"), "localhost/test#appName-object", "Valid input, split by ?");
		assert.equal(CommonMethods.shortenURL("localhost/test#appName-object/dummy"), "localhost/test#appName-object", "Valid input, split by /");
		assert.equal(CommonMethods.shortenURL("localhost/test#appName-object~dummy"), "localhost/test#appName-object", "Valid input, split by ~");
		assert.equal(CommonMethods.shortenURL("localhost/test#appName-object&dummy"), "localhost/test#appName-object", "Valid input, split by &");
	});
});
