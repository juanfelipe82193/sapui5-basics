/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE"); All rights reserved
 */
/*global sap:false,jQuery:false, sinon */
sap.ui.define([
	'sap/apf/testhelper/stub/ajaxStub',
	"sap/base/i18n/ResourceBundle"
], function(AjaxStub, ResourceBundle){
	'use strict';
	function setup(testContext) {
		sap.apf.testhelper.stub.textResourceHandlerStub.testContext = testContext;
		testContext.stub = {};
		testContext.stub.textHash = {};
		testContext.stub.aPropertyFiles = [];
		testContext.stub.aPropertyFiles[0] = {};
		testContext.stub.aPropertyFiles[0].aKeys = [];
		testContext.stub.addText = function(key, value) {
			testContext.stub.textHash[key] = value;
			testContext.stub.aPropertyFiles[0].aKeys.push(key);
		};
		/**
		 * Builds bundle of UI5 without called UI5.
		 * @constructor
		 */
		testContext.stub.ResourceBundleStub = function() {
			this.aPropertyFiles = testContext.stub.aPropertyFiles;
			this.getText = function(inKey) {
				var result = testContext.stub.textHash[inKey];
				if (result !== undefined) {
					return result;
				}
				return "This text is not defined";
			};
			this._enhance = function (oBundleStub) {
				/*oBundleStub.aPropertyFiles[0].aKeys.forEach(function(key) {
					aProperties.aKeys.push(key);
					testContext.stub.addText(key, oBundleStub.getText(key));
				});*/
			};
		};
		testContext.stub.resourceBundle = new testContext.stub.ResourceBundleStub(); // attention: singleton per test
		AjaxStub.givenApfMessagesProperties(testContext.stub);
		testContext.stub.stubSapResources = sinon.stub(ResourceBundle, "create", function(settings) {
			if (settings && settings.async) {
				return new Promise(function(resolve){ // Actual Promise needed by UI5
					resolve(testContext.stub.resourceBundle);
				});
			}
			return testContext.stub.resourceBundle;
		});
		testContext.stub.stubUI5getOriginInfo = sinon.stub(sap.ui.getCore().getConfiguration(), "getOriginInfo", function() {
			return "it is stubbed by ...stub.ResourceHandlerStub";
		});
	}
	function teardown() {
		var testContext = sap.apf.testhelper.stub.textResourceHandlerStub.testContext;
		testContext.stub.stubUI5getOriginInfo.restore();
		testContext.stub.stubSapResources.restore();
	}
	sap.apf.testhelper.stub.textResourceHandlerStub = {};
	sap.apf.testhelper.stub.textResourceHandlerStub.setup = setup;
	sap.apf.testhelper.stub.textResourceHandlerStub.teardown = teardown;
	return {
		teardown: teardown,
		setup: setup
	};
}, true /*Global_Export*/);