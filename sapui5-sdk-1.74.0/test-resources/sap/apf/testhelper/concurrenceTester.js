sap.ui.define(function(){
	'use strict';
	
	var concurrenceTester = {};
	
	concurrenceTester.testSeries = function concurrenceTest(name, newTestEnvironment, numberOfInstructions, numberOfCallbacks) {
		forEachFragmentationOfLengthOf(numberOfInstructions, numberOfCallbacks, function(fragmentation) {
			forEachPermutationOfLength(numberOfCallbacks, function(callbackIdPermutation) {
				QUnit.test(name + "; permutation=" + callbackIdPermutation + "; fragmentation=" + fragmentation, function(assert) {
					var that = this;
					var env = newTestEnvironment.call(that, assert);
					var permutatedCallbacks = callbackIdPermutation.map(function(i) { return env.callbacks[i]; });
					var instructions = env.instructions;
					
					var instructionIndex = 0;
					var i = 0;
					for (; i < permutatedCallbacks.length; ++i) {
						for (; fragmentation[instructionIndex] === i; ++instructionIndex) {
							instructions[instructionIndex].call(that);
						}
						permutatedCallbacks[i].call(that);
					}
					for (; instructionIndex < instructions.length; ++instructionIndex) {
						instructions[instructionIndex].call(that);
					}
					
					env.assert.call(that, assert);
				});
			});
		});
	};
	
	concurrenceTester.forEachPermutationOfLength = forEachPermutationOfLength;
	concurrenceTester.forEachFragmentationOfLengthOf = forEachFragmentationOfLengthOf;

	function forEachPermutationOfLength(n, callback) {
		if (n === 0) {
			callback([]);
		} else {
			for (var i = 0; i < n; ++i) {
				forEachPermutationOfLength(n - 1, function(subPermutation) {
					var permutation = subPermutation.slice();
					permutation.splice(i, 0, n - 1);
					callback(permutation);
				});
			}
		}
	}
	
	function forEachFragmentationOfLengthOf(length, n, callback) {
		if (length === 0) {
			callback([]);
		} else if (length === 1) {
			for (var i = 0; i <= n; ++i) {
				callback([i]);
			}
		} else {
			forEachFragmentationOfLengthOf(length - 1, n, function(subFragmentation) {
				for (var i = subFragmentation[length - 2]; i <= n; ++i) {
					var fragmentation = subFragmentation.slice();
					fragmentation.push(i);
					callback(fragmentation);
				}
			});
		}
	}
	return concurrenceTester;
});