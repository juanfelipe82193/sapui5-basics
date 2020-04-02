sap.ui.define(["./../common/utility"], function(oUtility) {
	"use strict";
	var notInTestSuite = oUtility.isNotInTestSuite(),
		appName = "MUSIC";

	var aTestList = [
		{
			name: "OPAMusic",
			module: "test-resources/sap/fe/internal/integrations/Music/AllJourneys.qunit",
			title: "Opa tests for sap.fe Music",
			group: [],
			skip: notInTestSuite
		}
	];

	return {
		aTestList: aTestList,
		appName: appName
	};
});
