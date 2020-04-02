sap.ui.define(["./common/testHelper", "./common/utility"], function(TestHelper, Utility) {
	"use strict";
	var sSelectedTests = Utility.searchParams("runTests"),
		sSelectedTestGroups = Utility.searchParams("runTestGroups"),
		sExcludeTestGroups = Utility.searchParams("excludeTestGroups");

	return {
		name: "QUnit TestSuite for sap.fe (runs only under /testsuite)",
		defaults: {
			ui5: {
				noConflict: true,
				theme: "sap_belize"
			},
			sinon: false,
			loader: {
				paths: {
					tests: "test-resources/sap/fe/qunit",
					qunit: "test-resources/sap/fe/qunit"
				}
			},
			bootCore: true,
			qunit: {
				version: 1
			}
		},
		tests: TestHelper.createTestSuite(sSelectedTestGroups, sSelectedTests, sExcludeTestGroups)
	};
});
