/* global QUnit*/

sap.ui.define([
	"sap/ui/vtm/Lookup"
], function(
	lookup
) {
	"use strict";

	QUnit.test("lookupTests", function (assert) {
		var test = function (lookup, equalsFunc) {
			var key = "testKey";
			var value1 = "testValue1";
			var value2 = "testValue2";

			assert.ok(lookup.hasValue(key) === false);
			assert.ok(lookup.getValues(key).length === 0);

			lookup.addValue(key, value1);
			var result = lookup.getValues(key);
			assert.ok(result.length === 1 && result[0] === value1);

			lookup.addValue(key, value2);
			result = lookup.getValues(key);
			assert.ok(result.length === 2 && result[0] === value1 && result[1] === value2);
			assert.ok(lookup.hasValue(key) === true);

			lookup.removeValue(key, value1);
			result = lookup.getValues(key);
			assert.ok(result.length === 1 && result[0] === value2);

			lookup.removeValue(key, value1);
			result = lookup.getValues(key);
			assert.ok(result.length === 1 && result[0] === value2);

			lookup.removeValue(key, value2, equalsFunc);
			result = lookup.getValues(key);
			assert.ok(result.length === 0);
		};

		var lookup1 = new sap.ui.vtm.Lookup();
		test(lookup1);

		var lookup2 = new sap.ui.vtm.Lookup();
		test(lookup2, function (value1, value2) { return value1 === value2; });
	});

	QUnit.done(function() {
		jQuery("#qunit-fixture").hide();
	});
});