sap.ui.define(["./../common/utility"], function(oUtility) {
	"use strict";
	var notInTestSuite = oUtility.isNotInTestSuite(),
		appName = "ITELO";

	var aTestList = [
		{
			name: "OPAIteloDraftBackend",
			module: "test-resources/sap/fe/internal/integrations/Itelo/DraftJourneys.qunit",
			title:
				"Opa tests for sap.fe Draft against nodejs simplified itelo (you can use url parameter useBackendUrl to point to a system)",
			group: [],
			skip: notInTestSuite
		}
	];

	return {
		aTestList: aTestList,
		appName: appName
	};
});
