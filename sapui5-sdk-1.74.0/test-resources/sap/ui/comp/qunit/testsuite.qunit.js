(function() {
	"use strict";

	window.suite = function () {

		/*
		 * Add test pages to this test suite function.
		 */
		var aTests = [
			"ExploredSamples",
			"testsuite.smartcontrols", // testsuite_smartcontrols has been replaced by testsuite.smartcontrols, which is using a teststarter/js-only approach
			"testsuite.suitecontrols"
		];


		var oSuite = new parent.jsUnitTestSuite();
		var contextPath = "/" + window.location.pathname.split("/")[1];

		for (var i = 0; i < aTests.length; i++) {
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/" + aTests[i] + ".qunit.html");
		}

		return oSuite;
	};

})();
