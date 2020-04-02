sap.ui.define(["./../common/utility"], function(oUtility) {
	"use strict";
	var notInTestSuite = oUtility.isNotInTestSuite(),
		appName = "SALESORDER_FCL";

	var aTestList = [
		{
			name: "SalesOrderFCL-Overview",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderFCL/Overview.qunit",
			title: "Opa tests for sap.fe SalesOrderFCL Overview Journey",
			group: [oUtility.getTestGroups().SANITY],
			skip: notInTestSuite
		},
		{
			name: "SalesOrderFCL-ShellNavigation",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderFCL/ShellNavigation.qunit",
			title: "Opa tests for sap.fe SalesOrderFCL Shell Navigation Journey",
			group: [oUtility.getTestGroups().SANITY],
			skip: notInTestSuite
		}
	];

	return {
		aTestList: aTestList,
		appName: appName
	};
});
