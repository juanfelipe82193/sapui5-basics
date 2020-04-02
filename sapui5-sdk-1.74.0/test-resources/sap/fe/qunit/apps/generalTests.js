sap.ui.define(["sap/ui/Device", "./../common/utility"], function(Device, oUtility) {
	"use strict";
	var notInTestSuite = oUtility.isNotInTestSuite(),
		appName = "GENERAL";

	var aTestList = [
		{
			name: "MockServerTest",
			module: "test-resources/sap/fe/internal/qunit/MockServerTest.qunit",
			title: "MockServer Smoke Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "DraftModel",
			module: "test-resources/sap/fe/internal/qunit/model/DraftModel.qunit",
			title: "sap.fe.core.model.DraftModel - Unit Tests",
			group: [],
			skip: notInTestSuite,
			qunit: {
				version: 2
			}
		},
		{
			name: "AnnotationHelperOP",
			module: "test-resources/sap/fe/internal/qunit/AnnotationHelperOP.qunit",
			title: "sap.fe.templates.ObjectPage.AnnotationHelper - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "MessagePopOver",
			module: "test-resources/sap/fe/internal/qunit/messagePopover/MessagePopover.quint",
			title: "sap.fe.messagePopover - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "TemplatingExpressions",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/qunit/TemplatingExpressions.qunit",
			title: "sap.fe - Templating Expressions Unit Tests",
			group: [],
			skip: Device.browser.internet_explorer
		},
		{
			name: "MessageHandling",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/MessageHandling.qunit",
			title: "Message Handling - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "Routing",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/Routing.qunit",
			title: "Routing - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "FlexibleColumnLayout",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/FlexibleColumnLayout.qunit",
			title: "FlexibleColumnLayout - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "EditFlow",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/EditFlow.qunit",
			title: "EditFlow - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "NavigationHandler",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/NavigationHandler.qunit",
			title: "NavigationHandler - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "NavigationUtility",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/NavigationUtility.qunit",
			title: "NavigationUtility - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "AnnotationHelper_Qunits",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/AnnotationHelper.qunit",
			title: "sap.fe.AnnotationHelper Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "Operations",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/operations.qunit",
			title: "Operations - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "CacheHandlerService",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/qunit/services/CacheHandlerTest.qunit",
			title: "Cache Handler Service - Unit Tests",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "NavigationHelper",
			sinon: {
				version: "edge"
			},
			module: "test-resources/sap/fe/internal/qunit/NavigationHelper.qunit",
			title: "Navigation helper - Unit Tests",
			group: [],
			skip: notInTestSuite
		}
	];

	return {
		aTestList: aTestList,
		appName: appName
	};
});
