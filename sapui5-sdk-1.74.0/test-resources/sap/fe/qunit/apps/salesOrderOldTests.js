sap.ui.define(["./../common/utility"], function(oUtility) {
	"use strict";
	var notInTestSuite = oUtility.isNotInTestSuite(),
		appName = "SALESORDER_OLD";

	var aTestList = [
		{
			name: "OPASalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrder/SalesOrderOPAPart1.qunit",
			title: "Opa tests for sap.fe SalesOrder Operation Available Journey, Main and Side Effects",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "52_OPASalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrder/SalesOrderOPAPart2.qunit",
			title: "Opa tests for sap.fe SalesOrder Draft Create Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "53_OPASalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrder/SalesOrderOPAPart3.qunit",
			title: "Opa tests for sap.fe SalesOrder Edit Object Page Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "54_OPASalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrder/SalesOrderOPAPart4.qunit",
			title: "Opa tests for sap.fe SalesOrder Paginator, Deeplinking, PreferredMode create",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "55_OPASalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrder/SalesOrderOPAPart5.qunit",
			title: "Opa tests for sap.fe SalesOrder Related Apps, Inline Create",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "56_OPASalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrder/SalesOrderOPAPart6.qunit",
			title: "Opa tests for sap.fe SalesOrder Draft Delete",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "57_OPASalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrder/SalesOrderOPAPart7.qunit",
			title: "Opa tests for sap.fe SalesOrder Edit Sub ObjectPage",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "58_OPASalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrder/SalesOrderOPAPart8.qunit",
			title: "Opa tests for sap.fe SalesOrder Action Parameter Dialog",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "Paginator_Qunits",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/Paginators.qunit",
			title: "sap.fe.Paginator Unit Tests",
			group: [],
			skip: notInTestSuite
		}
	];

	return {
		aTestList: aTestList,
		appName: appName
	};
});
