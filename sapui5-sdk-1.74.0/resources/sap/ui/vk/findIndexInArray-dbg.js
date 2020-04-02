
sap.ui.define([
], function(
) {
	"use strict";


	var findIndexInArray = function(array, predicate, thisArg) {

		var result = -1;

		if (Array.isArray(array) && typeof predicate === "function") {
			for (var index = 0; index < array.length; index++) {
				if (predicate.call(thisArg, array[index], index, array)) {
					result = index;
					break;
				}
			}
		}

		return result;
	};

	return findIndexInArray;
});
