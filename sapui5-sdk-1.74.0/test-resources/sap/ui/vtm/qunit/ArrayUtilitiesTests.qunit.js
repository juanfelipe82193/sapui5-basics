/* global QUnit*/

sap.ui.define([
	"sap/ui/vtm/ArrayUtilities"
], function(
	arrayUtils
) {
	"use strict";

	QUnit.test("arrayUtilitiesTests", function (assert) {
		var obj1 = { a: 1, b: "2" };
		var obj2 = { c: 3, d: "4" };

		//shallow clone
		var result = sap.ui.vtm.ArrayUtilities.shallowClone([obj1, obj2]);
		assert.ok(result.length === 2 && result[0] === obj1 && result[1] === obj2);

		// deep clone
		result = sap.ui.vtm.ArrayUtilities.deepClone([obj1, obj2], function (item) { return item; });
		assert.ok(result.length === 2 && result[0] === obj1 && result[1] === obj2);
		assert.ok(sap.ui.vtm.ArrayUtilities.deepClone([obj1, obj2]) === undefined);

		// index
		assert.ok(sap.ui.vtm.ArrayUtilities.findIndex([obj1, obj2], function (item) { return item === obj2; }) === 1);
		assert.ok(sap.ui.vtm.ArrayUtilities.findIndex([obj1, obj2], function (item) { return false; }) === -1);

		// flatten
		result = sap.ui.vtm.ArrayUtilities.flatten([[obj1], [obj2]]);
		assert.ok(result.length === 2 && result[0] === obj1 && result[1] === obj2);

		// areEqual
		assert.ok(sap.ui.vtm.ArrayUtilities.areEqual([[1, 2], [1, 2], [1, 2]]));
		assert.ok(sap.ui.vtm.ArrayUtilities.areEqual([[1, 2, 3, 4], [1, 2, 3, 4]]));
		assert.ok(!sap.ui.vtm.ArrayUtilities.areEqual([[1, 2, 3], [1, 2, 3, 4]]));
		assert.ok(!sap.ui.vtm.ArrayUtilities.areEqual([[1, 2, 3, 4], [1, 2, 3]]));
		assert.ok(!sap.ui.vtm.ArrayUtilities.areEqual([[1, 2, 3, 4], [1, 2, 4, 3]]));
		assert.ok(sap.ui.vtm.ArrayUtilities.areEqual([[1, 2, 3, 4], ["1", "2", "3", "4"]], function (val1, val2) { return ("" + val1) == ("" + val2); }));
	});

	QUnit.done(function() {
		jQuery("#qunit-fixture").hide();
	});
});