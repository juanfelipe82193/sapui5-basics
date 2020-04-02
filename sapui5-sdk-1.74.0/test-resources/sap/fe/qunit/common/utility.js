sap.ui.define([], function() {
	"use strict";

	var _testGroups = {
		SANITY: "SANITY",
		REGRESSION: "REGRESSION",
		INTERNAL: "INTERNAL"
	};

	function getTestGroups() {
		return _testGroups;
	}

	function isNotInTestSuite() {
		return location.pathname.indexOf("/testsuite") !== 0 && location.pathname.indexOf("/test-resources") !== 0;
	}

	function searchParams(param) {
		var params = new URL(location).searchParams;
		return params.get(param);
	}

	return {
		getTestGroups: getTestGroups,
		searchParams: searchParams,
		isNotInTestSuite: isNotInTestSuite
	};
});
