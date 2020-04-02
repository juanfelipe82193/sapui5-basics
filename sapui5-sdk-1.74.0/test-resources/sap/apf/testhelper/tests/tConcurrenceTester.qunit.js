sap.ui.define("sap/apf/testhelper/tests/tConcurrenceTester", [
	"sap/apf/testhelper/concurrenceTester"
], function(concurrenceTester){
	'use strict';

	QUnit.module("Concurrence testing functions");
	QUnit.test("forEachPermutation", function(assert) {
		var remaining = ["0,1,2", "0,2,1", "1,0,2", "1,2,0", "2,0,1", "2,1,0"];
		concurrenceTester.forEachPermutationOfLength(3, function(permutation){
			var position = remaining.indexOf(permutation.toString());
			assert.notEqual(position, -1);
			if (position >= 0) {
				remaining.splice(position, 1);
			}
		});
		assert.deepEqual(remaining, []);
	});
	QUnit.test("forEachFragmentation", function(assert) {
		var remaining = ["0,0,0", "0,0,1", "0,0,2", "0,1,1", "0,1,2", "0,2,2", "1,1,1", "1,1,2", "1,2,2", "2,2,2"];
		concurrenceTester.forEachFragmentationOfLengthOf(3, 2, function(fragmentation) {
			var position = remaining.indexOf(fragmentation.toString());
			assert.notEqual(position, -1);
			if (position >= 0) {
				remaining.splice(position, 1);
			}
		});
		assert.deepEqual(remaining, []);
	});
});