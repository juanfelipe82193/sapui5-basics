sap.ui.define(function() {

	"use strict";
	return {
		name: "QUnit TestSuite for sap.ui.generic.app",
		defaults: {
			bootCore: true,
			ui5: {
				libs: "sap.ui.generic.app",
				noConflict: true,
				preload: "auto"
			},
			qunit: {
				version: 2,
				reorder: false
			},
			sinon: {
				version: 1,
				qunitBridge: true,
				useFakeTimers: false
			},
			module: "./{name}.qunit"
		},
		tests: {
			"../navigation/service/NavigationHandlerTest": {
				title: "qUnit Page for sap.ui.generic.app.navigation.service.NavigationHandler",
				sinon: {
					version: 4
				},
				module: [
					"test-resources/sap/ui/generic/app/navigation/service/NavigationHandlerTest.qunit"
				]
			},
			"../navigation/service/PresentationVariant": {
				title: "qUnit Page for sap.ui.generic.app.navigation.service.PresentationVariant",
				sinon: {
					version: 4
				},
				module: [
					"test-resources/sap/ui/generic/app/navigation/service/PresentationVariantTest.qunit"
				]
			},
			"../navigation/service/SelectionVariantTest": {
				title: "qUnit Page for sap.ui.generic.app.navigation.service.SelectionVariant",
				sinon: {
					version: 4
				},
				module: [
					"test-resources/sap/ui/generic/app/navigation/service/SelectionVariantTest.qunit"
				]
			},
			ApplicationController: {
				title: "qUnit Page for sap.ui.generic.app.ApplicationController",
				sinon: {
					version: 4
				}
			},
			ApplicationControllerMockServer: {
				title: "qUnit Page for sap.ui.generic.app.ApplicationController",
				sinon: {
					version: 1,
					useFakeTimers: true
				}
			},
			"transaction/BaseController": {
				title: "qUnit Page for sap.ui.generic.app.transaction.BaseController"
			},
			"transaction/DraftContext": {
				title: "qUnit Page for sap.ui.generic.app.transaction.DraftContext"
			},
			"transaction/DraftController": {
				title: "qUnit Page for sap.ui.generic.app.transaction.DraftController",
				sinon: {
					version: 4
				}
			},
			"transaction/TransactionController": {
				title: "qUnit Page for sap.ui.generic.app.transaction.TransactionController",
				ui5: {
					libs: "sap.ui.commons,sap.ui.table,sap.m",
					language: "en-US"
				}
			},
			"../util/ActionUtil": {
				title: "qUnit Page for sap.ui.generic.app.util.ActionUtil",
				ui5: {
					libs: ["sap.ui.fl", "sap.ui.comp"]
				}
			},
			"../util/DraftUtil": {
				title: "qUnit Page for sap.ui.generic.app.util.DraftUtil"
			},
			"../util/MessageUtil": {
				title: "qUnit Page for sap.ui.generic.app.util.ModelUtil",
				skip: true // ManagedObject complains about a cycle in aggregations, test was not part of old testsuite
			},
			"../util/ModelUtil": {
				title: "qUnit Page for sap.ui.generic.app.util.ModelUtil"
			},
			"../util/Queue": {
				title: "qUnit Page for sap.ui.generic.app.util.Queue"
			}
		}
	};
});
