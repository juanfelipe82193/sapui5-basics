sap.ui.define(function() {
	"use strict";

	return {
		/*
		 * Name of the test suite.
		 *
		 * This name will be used in the title of the index page / testsuite page.
		 */
		name: "Testsuite sap.apf.cloudFoundry",


		/*
		 * An Object with default settings for all tests.
		 *
		 * The defaults and the test configuration will be merged recursively in a way
		 * that the merge contains properties from both, defaults and test config;
		 * if a property is defined by both config objects, the value from the test config will be used.
		 * There's no special handling for other types of values, e.g an array value in the defaults
		 * will be replaced by an array value in the test config.
		 */
		defaults: {
			qunit: {
				version: 2
			},
			sinon: {
				qunitBridge: true,
				version: 1
			},
			loader: {
				paths: {
					local: "test-resources/sap/apf/cloudFoundry/qunit/",
					"sap/apf/testhelper": "test-resources/sap/apf/testhelper/"
				}
			},
			ui5: {
				libs: ["sap.m"], // TODO remove when dependency in sap.apf.utils.utils.js resolved
				language: "en",
				preload: "async",
				noConflict: true
			},
			bootCore: true
		},


		/*
		 * A map with the individual test configurations, keyed by a unique test name.
		 *
		 * There's no technical limitation for the length or the characters of the test names.
		 * The will be used only in the overview page showing all tests of your suite.
		 *
		 * But by default, the name is also used to derive the ID of the module that contains the test cases.
		 * It is therefore suggested to use module ID like names (no blanks, no special chars other than / or dot)
		 * If you have multiple tests that execute the same module but with different configurations
		 * (e.g. different QUnit versions or different URL parameters), you have to make up unique names
		 * and manually configure the module IDs for them.
		 */
		tests: {
			/*
			 * A test named 'Test1'.
			 * By default, it will require the module 'my/package/Test1.qunit'
			 * assuming that your testsuite configuration is stored in my/packge/testsuite.qunit.js.
			 */
			tAjaxHandler: {
				title: "Ajax- Cloud Foundry Proxy",
				ui5: {
					language: "en",
					preload: "async"
				}
			},
			tAnalysisPathProxy: {
				title: "Analysis Paths - Cloud Foundry Proxy",
			},
			tModelerProxy: {
				title: "Modeler - Cloud Foundry Proxy",
				ui5: {
					libs: ["sap.m,sap.ui.layout"],
					language: "en",
					preload: "async"
				}
			},
			tModelerProxyVendorImport: {
				title: "Modeler Vendor Import - Cloud Foundry Proxy",
				ui5: {
					language: "en",
					preload: "async"
				}
			},
			tRuntimeProxy: {
				title: "Runtime - Cloud Foundry Proxy",
				ui5: {
					language: "en",
					preload: "async"
				}
			}
			// ,
			// tUtils: {
			// 	title: "Utils - Cloud Foundry Proxy",
			// 	ui5: {
			// 		language: "en",
			// 		preload: "async"
			// 	}
			// }
		}
	};
});