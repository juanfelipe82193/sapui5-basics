sap.ui.define([
	"sap/suite/ui/commons/networkgraph/Utils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/ui/thirdparty/sinon",
	"sap/ui/thirdparty/sinon-qunit"
], function (Utils, createAndAppendDiv) {
	"use strict";

	document.body.setAttribute("style", "height: 100%;");
	var html = document.getElementsByTagName('html')[0];
	html.setAttribute("style", "height: 100%;");
	createAndAppendDiv("content").setAttribute("style", "height: 100%;");
	createAndAppendDiv("qunit_results").setAttribute("style", "height: 100%; overflow-y: hidden");

	function createFakeArray(arr) {
		var i, oResult = {};
		for (i = 0; i < arr.length; i++) {
			oResult[i] = arr[i];
		}
		oResult.length = arr.length;
		return oResult;
	}

	QUnit.module("Network graph utils");

	QUnit.test("Find on array called if present.", function (assert) {
		var array = [1, 2],
			spy = sinon.spy();
		array.find = spy;
		Utils.find(array, function () { return true; });

		assert.equal(spy.callCount, 1, "Find function should be called on array.");
	});

	QUnit.test("Find - Empty array returns undefined.", function (assert) {
		var array = createFakeArray([]),
			oResult,
			spy = sinon.spy();

		oResult = Utils.find(array, spy);

		assert.equal(typeof oResult, "undefined", "Result should be undefined.");
		assert.equal(spy.callCount, 0, "Callback shouldn't have been called.");
	});

	QUnit.test("Find - Array with no result.", function (assert) {
		var aInput = [1, 2, 3],
			array = createFakeArray(aInput),
			aResults = [false, false, false],
			oResult,
			fnCallback = function (oValue, i) {
				assert.equal(aInput[i], oValue, "Correct index should be passed.");
				aResults[i] = true;
			};

		oResult = Utils.find(array, fnCallback);

		assert.equal(typeof oResult, "undefined", "Result should be undefined.");
		aResults.forEach(function (oResult, i) {
			if (!oResult) {
				assert.ok(false, "Callback should be called at index: " + i);
			}
		});
	});

	QUnit.test("Find - Finds value in an array.", function (assert) {
		var array = createFakeArray([1, 2, 3]),
			oResult,
			fnCallback = function (oValue) {
				return oValue === 2;
			};

		oResult = Utils.find(array, fnCallback);

		assert.equal(oResult, 2, "Number 2 should have been found in the array.");
	});

	QUnit.test("Find - This should be provided in callback.", function (assert) {
		var array = createFakeArray([1]),
			oFakeThis = {
				id: "My test id"
			},
			fnCallback = function (oValue) {
				assert.equal(this.id, oFakeThis.id, "This should be set to oFakeThis.");
			};

		assert.expect(1);
		Utils.find(array, fnCallback, oFakeThis);
	});
});
