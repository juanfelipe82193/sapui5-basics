/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/apf/utils/proxyTextHandlerForLocalTexts',
	'sap/apf/testhelper/config/samplePropertyFiles',
	'sap/apf/utils/utils',
	'sap/apf/cloudFoundry/utils',
	'sap/apf/cloudFoundry/modelerProxy',
	'sap/apf/core/messageObject',
	'sap/apf/core/utils/filter',
	'sap/ui/thirdparty/sinon'
], function(ProxyTextHandlerForLocalTexts, SamplePropertyFiles, utils, cloudFoundryUtils, proxyModule, MessageObject, Filter,
			sinon) {
	'use strict';

	/*BEGIN_COMPATIBILITY*/
	Filter = Filter || sap.apf.core.utils.Filter;
	/*END_COMPATIBILITY*/

	var testData = {
			textElementId: "LLLLLLLL05550175E10000000LLLLLLL",
			applicationId: "AAAAAAAA05550175E10000000AAAAAAA",
			configurationId: "BBBBBBBB05550175E10000000BBBBBBB",
			configurationName: "configForTesting",
			createConfiguration: function() {
				return {
					analyticalConfigurationName: testData.configurationName,
					categories: [],
					steps: [],
					requests: [],
					bindings: [],
					navigationTargets: [],
					representationTypes: []
				};
			}
	};

	var getManifests = function () {
		var manifest = {
				"sap.app": {
					dataSources: {
						"apf.designTime.customer.applications": {
							uri: "/hugo"
						},
						"apf.designTime.customer.analyticalConfigurations": {
							uri: "/otto"
						},
						"apf.designTime.customer.applicationAndAnalyticalConfiguration": {
							uri: "/hans"
						},
						"apf.designTime.textFileAndAnalyticalConfigurations": {
							uri: "/walter"
						},
						"apf.designTime.textFiles": {
							uri: "/ingo"
						},
						"apf.designTime.vendor.importToCustomerLayer": {
							uri: "/vendorContent"
						},
						"apf.designTime.vendor.analyticalConfigurations": {
							uri: "/vendorContentConf"
						}
					}
				}
		};
		return {manifest: manifest};
	};
	var jqXHR200 = {status: 200, statusText : "OK"};
	var jqXHR403 = {status: 403, statusText : "Forbidden"};
	var jqXHR404 = {status: 404, statusText : "Not Found"};
	/**
	 * Common asserts to test whether the provided messageObject is in the expected state.
	 * This method asserts the messageCode of the messageObject as well as the provided parameters.
	 *
	 * @param {QUnit.assert} assert - QUnit.assert object to access QUnit’s built-in assertions
	 * @param {sap.apf.core.MessageObject} messageObject - this messageObject is object under test of this method
	 * @param {string} expectedMessageCode - this is the expected message code for the tested messageObject
	 * @param {string[]} expectedParametersInMessageObject - this array contains the expected parameters the message object shall contain (correct order is important!)
	 */
	var commonAssertsForMessageObjectCreation = function(assert, messageObject, expectedMessageCode, expectedParametersInMessageObject){
		assert.strictEqual(messageObject.getCode(), expectedMessageCode, "THEN error code as expected");
		assert.strictEqual(messageObject.getParameters().length, expectedParametersInMessageObject.length, "THEN number of parameters in messageObject as expected");
		expectedParametersInMessageObject.forEach(function(singleExpectedParameter, index) {
			assert.deepEqual(messageObject.getParameters()[index], singleExpectedParameter, "THEN parameter no. " + index + " as expected");
		});
	};
	/**
	 * Common asserts to test whether the method buildErrorMessage was called with the expected parameters.
	 * This method asserts the provided parameters for the call of buildErrorMessage. It also expects that
	 * buildErrorMessage has only been called once.
	 *
	 * @param {QUnit.assert} assert - QUnit.assert object to access QUnit’s built-in assertions
	 * @param {sinon.spy} spyBuildErrorMessage - it spies on the method buildErrorMessage of sap.apf.cloudFoundry.utils
	 * @param {object[]} expectedParameters - this array contains the expected parameters the method buildErrorMessage shall be called with (correct order is important!)
	 */
	var commonAssertsForBuildErrorMessage = function (assert, spyBuildErrorMessage, expectedParameters) {
		assert.strictEqual(spyBuildErrorMessage.callCount, 1, "THEN buildErrorMessage has only been called once");
		assert.strictEqual(spyBuildErrorMessage.getCall(0).args.length, expectedParameters.length, "THEN number of parameters for method buildErrorMessage as expected");
		expectedParameters.forEach(function(singleExpectedParameter, index){
			assert.deepEqual(spyBuildErrorMessage.getCall(0).args[index], singleExpectedParameter, "THEN parameter no. " + index + " as expected");
		});
	};

	QUnit.module("Create operations for Applications", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");
		},
		afterEach: function () {
			this.spyBuildErrorMessage.restore();
		}
	});
	function assertContractOnParameter(assert, parameter, expectedObject){
		Object.keys(expectedObject).forEach(function(key){
			assert.deepEqual(parameter[key], expectedObject[key], "THEN " + key + " is ok");
			assert.notStrictEqual(parameter[key], undefined, "THEN " + key + " is defined");
		});
	}
	QUnit.test("WHEN requesting CREATE for an application", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(7);
		var done = assert.async();
		var inputDataContract = {
				ApplicationName: "myApplication"
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri, "THEN URL is correct");
					assert.strictEqual(settings.type, "POST", "THEN post is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					// proxy to server contract comprising the REST request document
					var restRequestDocument = {
							applicationName: "myApplication",
							textFile: {
								inDevelopmentLanguage : ""
							}
					};
					settings.data = JSON.parse(settings.data);
					assertContractOnParameter(assert, settings.data, restRequestDocument);
					done();
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler : ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		// input to proxy contract
		modelerProxy.create('application', inputDataContract, undefined);
		// --------------------
		// Verify - see ajax above
		// --------------------
	});
	QUnit.test("WHEN requesting CREATE for an application with existing application id", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(7);
		var done = assert.async();
		var inputDataContract = {
				Application: testData.applicationId,
				ApplicationName: "myApplication"
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "/" + testData.applicationId, "THEN URL is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					// proxy to server contract comprising the REST request document
					var restRequestDocument = {
							applicationName: "myApplication",
							textFile: {
								inDevelopmentLanguage : ""
							}
					};
					settings.data = JSON.parse(settings.data);
					assertContractOnParameter(assert, settings.data, restRequestDocument);
					done();
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler : ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		// input to proxy contract
		modelerProxy.create('application', inputDataContract, undefined);
		// --------------------
		// Verify - see ajax above
		// ------------------
	});
	QUnit.test("WHEN successfully creating an Application", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(6);
		var done = assert.async();
		var inputDataContract = {
				ApplicationName: "myApplication"
		};
		var restResponseDocument = {
				application: "111142GUID"
		};
		var responseObjectFromProxyToAPF = {
				Application: restResponseDocument.application,
				ApplicationName: inputDataContract.ApplicationName
		};
		var ajaxHandler = {
				// WHEN feeding the responseDocument format to the proxy's success continuation
				send: function (settings) {
					setTimeout(function () {
						settings.success(restResponseDocument, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler : ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var applicationContinuation = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during create");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			// output to application contract comprising the REST response document
			assertContractOnParameter(assert, data, responseObjectFromProxyToAPF);
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('application', inputDataContract, applicationContinuation);
		// --------------------
		// Verify - see applicationContinuation
		// --------------------
	});
	QUnit.test("WHEN successfully creating an Application but the returned data is an empty object", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(8);
		var done = assert.async();
		var inputDataContract = {
				ApplicationName: "myApplication"/*,
				SemanticObject: "fioriApplication"*/
		};
		var requestBody = {
				applicationName: inputDataContract.ApplicationName,
				textFile: {
					inDevelopmentLanguage : "" // on create of an application this shall be empty
				}
		};
		var response = {};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.strictEqual(settings.data.applicationName, requestBody.applicationName, "THEN application name is set correctly");
					assert.strictEqual(settings.type, "POST", "THEN post is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success(response, "OK", jqXHR200);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler : ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5227", "THEN error code as expected");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR200, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5227", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('application', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully creating an Application but the returned data is undefined", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(8);
		var done = assert.async();
		var inputDataContract = {
				ApplicationName: "myApplication"/*,
				SemanticObject: "fioriApplication"*/
		};
		var requestBody = {
				applicationName: inputDataContract.ApplicationName,
				textFile: {
					inDevelopmentLanguage : "" // on create of an application this shall be empty
				}
		};
		var response;
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.strictEqual(settings.data.applicationName, requestBody.applicationName, "THEN application name is set correctly");
					assert.strictEqual(settings.type, "POST", "THEN post is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success(response, "OK", jqXHR200);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler : ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5227", "THEN error code as expected");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR200, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5227", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('application', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during the creation of an Application", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(8);
		var done = assert.async();
		var inputDataContract = {
				ApplicationName: "myApplication"/*,
				SemanticObject: "fioriApplication"*/
		};
		var requestBody = {
				applicationName: inputDataContract.ApplicationName,
				textFile: {
					inDevelopmentLanguage : "" // on create of an application this shall be empty
				}
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.strictEqual(settings.data.applicationName, requestBody.applicationName, "THEN application name is set correctly");
					assert.strictEqual(settings.type, "POST", "THEN post is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler : ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5227", "THEN error code as expected");
			assert.strictEqual(this.spyBuildErrorMessage.callCount, 1, "THEN error message has been built");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR403, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5227", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('application', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Create operations for Analytical Configurations", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();

			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");

			this.stubbedProxyTextHandlerForLocalTexts = new ProxyTextHandlerForLocalTexts({
				instances : {messageHandler: this.messageHandler}
			});
			this.stubCreateTextFileOfApplication = sinon.stub(this.stubbedProxyTextHandlerForLocalTexts, "createTextFileOfApplication");
		},
		afterEach: function () {
			this.stubCreateTextFileOfApplication.restore();
			this.spyBuildErrorMessage.restore();
		}
	});
	QUnit.test("WHEN successfully creating an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(12);
		var done = assert.async();
		var testTextFileContent = "this is a textfile";
		var analyticalConfiguration = testData.createConfiguration();

		var inputDataContract = {
				AnalyticalConfigurationName: "configForTesting",
				Application: "111142",
				SerializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
		};
		var expectedConfigHeader = {
				AnalyticalConfigurationName: "configForTesting",
				Application: "111142"
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;
		var expectedConfig = jQuery.extend(true, {}, analyticalConfiguration);
		var requestBody = {
				analyticalConfigurationName: inputDataContract.AnalyticalConfigurationName,
				application: inputDataContract.Application,
				serializedAnalyticalConfiguration: JSON.stringify(expectedConfig),
				textFile: {
					inDevelopmentLanguage: testTextFileContent
				}
		};
		var response = {
				analyticalConfiguration: testData.configurationId
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.strictEqual(settings.data.analyticalConfigurationName, requestBody.analyticalConfigurationName, "THEN analytical configuration name is set correctly");
					assert.strictEqual(settings.data.application, requestBody.application, "THEN applicationId is set correctly");
					assert.deepEqual(JSON.parse(settings.data.serializedAnalyticalConfiguration), JSON.parse(requestBody.serializedAnalyticalConfiguration), "THEN analytical configuration is set correctly");
					assert.strictEqual(settings.data.textFile.inDevelopmentLanguage, requestBody.textFile.inDevelopmentLanguage, "THEN textfile is set correctly");
					assert.strictEqual(settings.type, "POST", "THEN post is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success(response, "OK");
					}, 1);
				}
		};

		this.stubCreateTextFileOfApplication.returns(testTextFileContent);

		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler : ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test

		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(data.AnalyticalConfiguration, response.analyticalConfiguration, "THEN analytical configuration id is returned correctly");
			assert.strictEqual(data.AnalyticalConfigurationName, requestBody.analyticalConfigurationName, "THEN analytical configuration name is returned correctly");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during create");
			assert.strictEqual(this.stubCreateTextFileOfApplication.getCall(0).args[0], requestBody.application, "THEN createTextFileOfApplication is called with the correct parameters");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully creating an Analytical Configuration but the returned data is an empty object", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(10);
		var done = assert.async();
		var testTextFileContent = "this is a textfile";
		var analyticalConfiguration = testData.createConfiguration();
		var inputDataContract = {
				AnalyticalConfigurationName: "configForTesting",
				Application: "111142",
				SerializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
		};
		var expectedConfigHeader = {
				AnalyticalConfigurationName: "configForTesting",
				Application: "111142"
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;
		var requestBody = {
				analyticalConfigurationName: inputDataContract.AnalyticalConfigurationName,
				application: inputDataContract.Application,
				serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration),
				textFile: {
					inDevelopmentLanguage: testTextFileContent
				}
		};
		var response = {};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.strictEqual(settings.data.analyticalConfigurationName, requestBody.analyticalConfigurationName, "THEN analytical configuration name is set correctly");
					assert.strictEqual(settings.data.application, requestBody.application, "THEN applicationId is set correctly");
					assert.deepEqual(JSON.parse(settings.data.serializedAnalyticalConfiguration), JSON.parse(requestBody.serializedAnalyticalConfiguration), "THEN analytical configuration is set correctly");
					assert.strictEqual(settings.type, "POST", "THEN post is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success(response, "OK", jqXHR200);
					}, 1);
				}
		};

		this.stubCreateTextFileOfApplication.returns(testTextFileContent);

		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler : ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test

		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject.getCode(), "5226", "THEN error code as expected");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR200, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5226", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully creating an Analytical Configuration but the returned data is undefined", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(10);
		var done = assert.async();
		var testTextFileContent = "this is a textfile";
		var analyticalConfiguration = testData.createConfiguration();
		var inputDataContract = {
				AnalyticalConfigurationName: "configForTesting",
				Application: "111142",
				SerializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
		};
		var expectedConfigHeader = {
				AnalyticalConfigurationName: "configForTesting",
				Application: "111142"
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;

		var requestBody = {
				analyticalConfigurationName: inputDataContract.AnalyticalConfigurationName,
				application: inputDataContract.Application,
				serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration),
				textFile: {
					inDevelopmentLanguage: testTextFileContent
				}
		};
		var response;
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.strictEqual(settings.data.analyticalConfigurationName, requestBody.analyticalConfigurationName, "THEN analytical configuration name is set correctly");
					assert.strictEqual(settings.data.application, requestBody.application, "THEN applicationId is set correctly");
					assert.deepEqual(JSON.parse(settings.data.serializedAnalyticalConfiguration), JSON.parse(requestBody.serializedAnalyticalConfiguration), "THEN analytical configuration is set correctly");
					assert.strictEqual(settings.type, "POST", "THEN post is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success(response, "OK", jqXHR200);
					}, 1);
				}
		};

		this.stubCreateTextFileOfApplication.returns(testTextFileContent);

		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject.getCode(), "5226", "THEN error code as expected");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR200, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5226", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during the creation of an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(10);
		var done = assert.async();
		var testTextFileContent = "this is a textfile";
		var analyticalConfiguration = testData.createConfiguration();
		var inputDataContract = {
				AnalyticalConfigurationName: "configForTesting",
				Application: "111142",
				SerializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
		};
		var expectedConfigHeader = {
				AnalyticalConfigurationName: "configForTesting",
				Application: "111142"
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;

		var requestBody = {
				analyticalConfigurationName: inputDataContract.AnalyticalConfigurationName,
				application: inputDataContract.Application,
				serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration),
				textFile: {
					inDevelopmentLanguage: testTextFileContent
				}
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.strictEqual(settings.data.analyticalConfigurationName, requestBody.analyticalConfigurationName, "THEN analytical configuration name is set correctly");
					assert.strictEqual(settings.data.application, requestBody.application, "THEN applicationId is set correctly");
					assert.deepEqual(JSON.parse(settings.data.serializedAnalyticalConfiguration), JSON.parse(requestBody.serializedAnalyticalConfiguration), "THEN analytical configuration is set correctly");
					assert.strictEqual(settings.type, "POST", "THEN post is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};

		this.stubCreateTextFileOfApplication.returns(testTextFileContent);

		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject.getCode(), "5226", "THEN error code as expected");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR403, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5226", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Create operations for Texts", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function(){
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyCreatePseudoGuid = sinon.stub(utils, "createPseudoGuid");
			this.stubbedProxyTextHandlerForLocalTexts = new ProxyTextHandlerForLocalTexts({
				instances: {
					messageHandler: this.messageHandler
				}});
			this.spyAddText = sinon.spy(this.stubbedProxyTextHandlerForLocalTexts, "addText");
		},
		afterEach: function () {
			this.spyCreatePseudoGuid.restore();
			this.spyAddText.restore();
		}
	});
	QUnit.test("WHEN successfully creating local texts", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(3);
		var done = assert.async();
		var generatedPseudoGuidForTest = "1234567890";
		var request = {
				TextElementDescription : "TextDescription1",
				Language : sap.apf.core.constants.developmentLanguage,
				TextElementType : "XFLD",
				MaximumLength : 10,
				Application : "111142",
				TranslationHint : "TranslateIt"
		};
		var expectedResult = {
				TextElementDescription : "TextDescription1",
				Language : sap.apf.core.constants.developmentLanguage,
				TextElementType : "XFLD",
				MaximumLength : 10,
				Application : "111142",
				TranslationHint : "TranslateIt",
				TextElement : generatedPseudoGuidForTest
		};

		this.spyCreatePseudoGuid.returns(generatedPseudoGuidForTest);

		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts: this.stubbedProxyTextHandlerForLocalTexts
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during readCollection");

			assert.strictEqual(this.spyAddText.callCount, 1, "THEN spyAddText has been called once");
			assert.deepEqual(this.spyAddText.getCall(0).args, [expectedResult], "THEN arguments as expected");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('texts', request, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Read operations for Applications", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");
		},
		afterEach: function () {
			// teardown here
			this.spyBuildErrorMessage.restore();
		}
	});
	QUnit.test("WHEN successfully reading an Application list", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(8);
		var done = assert.async();
		var response = {
				applications: [{
					application: "111142",
					applicationName: "myApplication"
				}, {
					application: "111143",
					applicationName: "myApplication2"
				}]
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "?$select=Application,ApplicationName", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(response, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during readCollection");
			assert.strictEqual(data.length, response.applications.length, "THEN length of application list is returned correctly");
			assert.strictEqual(data[0].Application, response.applications[0].application, "THEN application id of first list entry is returned correctly");
			assert.strictEqual(data[1].Application, response.applications[1].application, "THEN application id of second list entry is returned correctly");
			assert.strictEqual(data[0].ApplicationName, response.applications[0].applicationName, "THEN application name of first list entry is returned correctly");
			assert.strictEqual(data[1].ApplicationName, response.applications[1].applicationName, "THEN application name of second list entry is returned correctly");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('application', callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully reading an Application list AND null is returned for application list", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(4);
		var done = assert.async();
		var response = {
				applications: null
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "?$select=Application,ApplicationName", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(response, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during readCollection");
			assert.strictEqual(data.length, 0, "THEN length of application list is returned correctly");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('application', callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully reading an Application list but the returned data is an empty object", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(6);
		var done = assert.async();
		var response = {};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "?$select=Application,ApplicationName", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(response, "OK", jqXHR200);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5229", "THEN error code as expected");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR200, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5229", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('application', callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully reading an Application list but the returned data is undefined", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(6);
		var done = assert.async();
		var response;
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "?$select=Application,ApplicationName", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(response, "OK", jqXHR200);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5229", "THEN error code as expected");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR200, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5229", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('application', callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during the read operation of an Application list", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(6);
		var done = assert.async();
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "?$select=Application,ApplicationName", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject.getCode(), "5229", "THEN error code as expected");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR403, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5229", "THEN message code has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('application', callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Read operations for Analytical Configuration List", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();

			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");

			this.stubbedProxyTextHandlerForLocalTexts = new ProxyTextHandlerForLocalTexts({
				instances: {messageHandler: this.messageHandler}});
			this.spyInitApplicationTexts = sinon.spy(this.stubbedProxyTextHandlerForLocalTexts, "initApplicationTexts");
		},
		afterEach: function () {
			this.spyInitApplicationTexts.restore();
			this.spyBuildErrorMessage.restore();
		}
	});
	QUnit.test("WHEN successfully reading an Analytical Configuration list", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(7);
		var done = assert.async();
		var requestUrlParameters = {
				application: "111142"
		};

		var response = {
				analyticalConfigurations:
					[
					 {
						 analyticalConfiguration: "BBBBBBBB05550175E10000000BBBBBBB",
						 analyticalConfigurationName: "Config1",
						 serializedAnalyticalConfiguration : "configurationString1"
					 },
					 {
						 analyticalConfiguration: "CCCCCCCC05550175E10000000CCCCCCCC",
						 analyticalConfigurationName: "Config2",
						 serializedAnalyticalConfiguration : "configurationString2"
					 }
					 ],
					 textFile: {
						 inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", requestUrlParameters.application)
					 }
		};
		var expectedResult = [{
			AnalyticalConfiguration: "BBBBBBBB05550175E10000000BBBBBBB",
			AnalyticalConfigurationName: "Config1",
			Application: requestUrlParameters.application,
			SerializedAnalyticalConfiguration : "configurationString1"
		}, {
			AnalyticalConfiguration: "CCCCCCCC05550175E10000000CCCCCCCC",
			AnalyticalConfigurationName: "Config2",
			Application: requestUrlParameters.application,
			SerializedAnalyticalConfiguration : "configurationString2"
		}];
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri + "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=(Application%20eq%20%27" + requestUrlParameters.application + "%27)", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(response, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts: this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during readCollection");
			assert.strictEqual(data.length, response.analyticalConfigurations.length, "THEN returned data contains two Configurations");
			assert.deepEqual(data, expectedResult, "THEN returned data contains only expected values");
			assert.strictEqual(this.spyInitApplicationTexts.callCount, 1, "THEN spyInitApplicationTexts has been called once");
			assert.deepEqual(this.spyInitApplicationTexts.getCall(0).args, [requestUrlParameters.application, response.textFile.inDevelopmentLanguage], "THEN arguments as expected");
			done();
		}.bind(this);

		// this filter is there to make the 'application' available for readCollection
		var filterForApplication = new Filter(this.messageHandler, 'Application', 'eq', requestUrlParameters.application);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('configuration', callback, undefined, undefined, filterForApplication);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully reading an Analytical Configuration list AND null is returned for configuration list", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(4);
		var done = assert.async();
		var requestUrlParameters = {
				application: "111142"
		};

		var response = {
				analyticalConfigurations: null,
				textFile: {
					inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", requestUrlParameters.application)
				}
		};
		var expectedResult = [];
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri + "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=(Application%20eq%20%27" + requestUrlParameters.application + "%27)", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(response, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts: this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during readCollection");
			assert.deepEqual(data,  expectedResult, "THEN returned data contains no Configurations");
			done();
		};

		// this filter is there to make the 'application' available for readCollection
		var filterForApplication = new Filter(this.messageHandler, 'Application', 'eq', requestUrlParameters.application);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('configuration', callback, undefined, undefined, filterForApplication);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully reading an Analytical Configuration list but the returned data is an empty object", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(9);
		var done = assert.async();
		var requestUrlParameters = {
				application: "111142"
		};
		var response = {};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri + "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=(Application%20eq%20%27" + requestUrlParameters.application + "%27)", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(response, "OK", jqXHR200);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject.getCode(), "5223", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], requestUrlParameters.application, "THEN applicationId as parameter");
			assert.strictEqual(jQuery.isEmptyObject(data), true, "THEN data is an empty object due to error");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR200, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5223", "THEN message code has been provided");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[2], [requestUrlParameters.application], "THEN parameters has been provided");
			done();
		}.bind(this);
		// this filter is there to make the 'application' available for readCollection
		var filterApplication = new Filter(this.messageHandler, 'Application', 'eq', requestUrlParameters.application);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('configuration', callback, undefined, undefined, filterApplication);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN successfully reading an Analytical Configuration list but the returned data is undefined", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(9);
		var done = assert.async();
		var requestUrlParameters = {
				application: "111142"
		};
		var response;
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri + "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=(Application%20eq%20%27" + requestUrlParameters.application + "%27)", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(response, "OK", jqXHR200);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject.getCode(), "5223", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], requestUrlParameters.application, "THEN applicationId as parameter");
			assert.strictEqual(data, undefined, "THEN data is undefined due to error");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR200, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5223", "THEN message code has been provided");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[2], [requestUrlParameters.application], "THEN parameters has been provided");
			done();
		}.bind(this);
		// this filter is there to make the 'application' available for readCollection
		var filterApplication = new Filter(this.messageHandler, 'Application', 'eq', requestUrlParameters.application);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('configuration', callback, undefined, undefined, filterApplication);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during the read operation of an Analytical Configuration List", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(8);
		var done = assert.async();
		var requestUrlParameters = {
				application: "111142"
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri + "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=(Application%20eq%20%27" + requestUrlParameters.application + "%27)", "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5223", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], requestUrlParameters.application, "THEN applicationId as parameter");
			assert.strictEqual(data, undefined, "THEN data is undefined due to error");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR403, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5223", "THEN message code has been provided");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[2], [requestUrlParameters.application], "THEN parameter has been provided");
			done();
		}.bind(this);
		// this filter is there to make the 'application' available for readCollection
		var filter = new Filter(this.messageHandler, 'Application', 'eq', requestUrlParameters.application);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('configuration', callback, undefined, undefined, filter);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Read single entity of Analytical Configuration", {
		beforeEach : function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");
		},
		afterEach : function () {
			this.spyBuildErrorMessage.restore();
		}
	});
	QUnit.test("WHEN successfully reading an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(5);
		var done = assert.async();
		var inputContractForParametersIntoModelerProxy = [{value : testData.configurationId}];
		var inputContractForApplicationIdIntoModelerProxy = testData.applicationId;
		var responseFromServer = {
				analyticalConfiguration: {
					serializedAnalyticalConfiguration: JSON.stringify(testData.createConfiguration()),
					analyticalConfigurationName: testData.configurationName
				}
		};
		var expectedUriForReadingASingleAnalyticalConfiguration = getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri
		+ '/' + inputContractForParametersIntoModelerProxy[0].value
		+ '?$select=AnalyticalConfigurationName,SerializedAnalyticalConfiguration';
		var expectedDataProvidedByTheModelerProxyInTheCallback = {
				Application : inputContractForApplicationIdIntoModelerProxy,
				SerializedAnalyticalConfiguration : responseFromServer.analyticalConfiguration.serializedAnalyticalConfiguration,
				AnalyticalConfiguration : inputContractForParametersIntoModelerProxy[0].value
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedUriForReadingASingleAnalyticalConfiguration, "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(responseFromServer, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during readEntity");
			assert.deepEqual(data, expectedDataProvidedByTheModelerProxyInTheCallback, "THEN data provided by the modeler proxy in the callback is as expected");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.readEntity('configuration', callback, inputContractForParametersIntoModelerProxy, undefined, inputContractForApplicationIdIntoModelerProxy);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during reading an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(15);
		var done = assert.async();
		var inputContractForParametersIntoModelerProxy = [{value : testData.configurationId}];
		var inputContractForApplicationIdIntoModelerProxy = testData.applicationId;
		var responseFromServer = jqXHR403;
		var expectedUriForReadingASingleAnalyticalConfiguration = getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri
		+ '/' + inputContractForParametersIntoModelerProxy[0].value
		+ '?$select=AnalyticalConfigurationName,SerializedAnalyticalConfiguration';
		var expectedDataProvidedByTheModelerProxyInTheCallback;

		var expectedMessageCode = '5221';
		var expectedParametersInMessageObjectText = [ 
		inputContractForApplicationIdIntoModelerProxy,
		inputContractForParametersIntoModelerProxy[0].value
		];
		var originalMessageObject = this.messageHandler.createMessageObject("original message object for testing");
		var expectedParametersForBuildErrorMessage = 
			[
			responseFromServer,
			expectedMessageCode,
			expectedParametersInMessageObjectText,
			originalMessageObject,
			this.messageHandler
		];

		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedUriForReadingASingleAnalyticalConfiguration, "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.error(responseFromServer, "error", undefined, originalMessageObject);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(data, expectedDataProvidedByTheModelerProxyInTheCallback, "THEN data is undefined due to error");
			commonAssertsForMessageObjectCreation(assert, messageObject, expectedMessageCode, expectedParametersInMessageObjectText);
			commonAssertsForBuildErrorMessage(assert, this.spyBuildErrorMessage, expectedParametersForBuildErrorMessage);
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readEntity('configuration', callback, inputContractForParametersIntoModelerProxy, undefined, inputContractForApplicationIdIntoModelerProxy);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.test("WHEN successfully reading an Analytical Configuration for export", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(5);
		var done = assert.async();
		var inputContractForParametersIntoModelerProxy = [{value : testData.configurationId}];
		var inputContractForApplicationIdIntoModelerProxy = testData.applicationId;
		var responseFromServer = {
				analyticalConfiguration: {
					creationUtcDateTime: "today",
					lastChangeUtcDateTime: "tomorrow"
				}
		};
		var expectedUriForReadingASingleAnalyticalConfiguration = getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri
		+ '/' + inputContractForParametersIntoModelerProxy[0].value
		+ '?$select=Application,CreationUtcDateTime,LastChangeUtcDateTime,ServiceInstance';
		var expectedDataProvidedByTheModelerProxyInTheCallback = {
				CreationUTCDateTime : "today",
				LastChangeUTCDateTime : "tomorrow"
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedUriForReadingASingleAnalyticalConfiguration, "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success(responseFromServer, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during readEntity");
			assert.deepEqual(data, expectedDataProvidedByTheModelerProxyInTheCallback, "THEN data provided by the modeler proxy in the callback is as expected");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.readEntity('configuration', callback, inputContractForParametersIntoModelerProxy,
				["CreationUTCDateTime", "LastChangeUTCDateTime"], inputContractForApplicationIdIntoModelerProxy);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during reading an Analytical Configuration for export", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(15);
		var done = assert.async();
		var inputContractForParametersIntoModelerProxy = [{value : testData.configurationId}];
		var inputContractForApplicationIdIntoModelerProxy = testData.applicationId;
		var responseFromServer = jqXHR403;
		var expectedUriForReadingASingleAnalyticalConfiguration = getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri
		+ '/' + inputContractForParametersIntoModelerProxy[0].value
		+ '?$select=Application,CreationUtcDateTime,LastChangeUtcDateTime,ServiceInstance';
		var expectedDataProvidedByTheModelerProxyInTheCallback;

		var expectedMessageCode = '5221';
		var expectedParametersInMessageObjectText = 
			[ inputContractForApplicationIdIntoModelerProxy, inputContractForParametersIntoModelerProxy[0].value];
		var originalMessageObject = this.messageHandler.createMessageObject("original message object for testing");
		var expectedParametersForBuildErrorMessage = 
			[ responseFromServer, expectedMessageCode, expectedParametersInMessageObjectText,
			  originalMessageObject, this.messageHandler];

		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedUriForReadingASingleAnalyticalConfiguration, "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.error(responseFromServer, "error", undefined, originalMessageObject);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(data, expectedDataProvidedByTheModelerProxyInTheCallback, "THEN data is undefined due to error");
			commonAssertsForMessageObjectCreation(assert, messageObject, expectedMessageCode, expectedParametersInMessageObjectText);
			commonAssertsForBuildErrorMessage(assert, this.spyBuildErrorMessage, expectedParametersForBuildErrorMessage);
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readEntity('configuration', callback, inputContractForParametersIntoModelerProxy,
				["CreationUTCDateTime", "LastChangeUTCDateTime"], inputContractForApplicationIdIntoModelerProxy);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN success AND empty data during reading an Analytical Configuration for export", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(15);
		var done = assert.async();
		var inputContractForParametersIntoModelerProxy = [{value : testData.configurationId}];
		var inputContractForApplicationIdIntoModelerProxy = testData.applicationId;
		var responseFromServer = jqXHR200;
		var expectedUriForReadingASingleAnalyticalConfiguration = getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri
		+ '/' + inputContractForParametersIntoModelerProxy[0].value
		+ '?$select=Application,CreationUtcDateTime,LastChangeUtcDateTime,ServiceInstance';
		var expectedDataProvidedByTheModelerProxyInTheCallback;

		var expectedMessageCode = '5221';
		var expectedParametersInMessageObjectText =
			[inputContractForApplicationIdIntoModelerProxy, inputContractForParametersIntoModelerProxy[0].value];
		var originalMessageObject;
		var expectedParametersForBuildErrorMessage = 
			[responseFromServer, expectedMessageCode, expectedParametersInMessageObjectText, originalMessageObject,
			 this.messageHandler];

		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedUriForReadingASingleAnalyticalConfiguration, "THEN URL is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					setTimeout(function () {
						settings.success({}, "ok", jqXHR200);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(data, expectedDataProvidedByTheModelerProxyInTheCallback, "THEN data is undefined due to error");
			commonAssertsForMessageObjectCreation(assert, messageObject, expectedMessageCode, expectedParametersInMessageObjectText);
			commonAssertsForBuildErrorMessage(assert, this.spyBuildErrorMessage, expectedParametersForBuildErrorMessage);
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.readEntity('configuration', callback, inputContractForParametersIntoModelerProxy,
				["CreationUTCDateTime", "LastChangeUTCDateTime"], inputContractForApplicationIdIntoModelerProxy);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.module("Read single entity is called in a not supported way", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyCheck = sinon.spy(this.messageHandler, "check");
		},
		afterEach: function () {
			this.spyCheck.restore();
		}
	});
	QUnit.test("WHEN calling read single entity with entitySet 'application'", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(2);
		var inputContractForEntitySetName = 'application';
		var expectedParametersForCallingCheckMethod = [
		                                               false,
		                                               'The read single entity operation on entity set ' + inputContractForEntitySetName + ' is currently not supported by the modeler proxy.'
		                                               ];
		var inject = {
				instances: {messageHandler: this.messageHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy.readEntity(inputContractForEntitySetName, undefined, undefined, undefined, undefined);
		// --------------------
		// Verify
		// --------------------
		assert.strictEqual(this.spyCheck.callCount, 1, "THEN check method of messageHandler was called once");
		assert.deepEqual(this.spyCheck.getCall(0).args, expectedParametersForCallingCheckMethod, "THEN check method of messageHandler was called with the expected parameters");
	});

	QUnit.module("Read operations for texts", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();
		},
		afterEach: function () {
		}
	});
	QUnit.test("WHEN reading texts from any layer", function (assert) {
		var done = assert.async();
		var inject = {
				instances: {messageHandler: this.messageHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during readCollection");
			assert.strictEqual(data.length, 0, "THEN returned data contains two Configurations");
			assert.deepEqual(data, [], "THEN returned data contains only expected values");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.readCollection('texts', callback, undefined, undefined, undefined, undefined);
	});

	QUnit.module("Update operations for Applications", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");

			this.stubbedProxyTextHandlerForLocalTexts = new ProxyTextHandlerForLocalTexts({
				instances : {
					messageHandler: this.messageHandler
				}});
			this.stubCreateTextFileOfApplication = sinon.stub(this.stubbedProxyTextHandlerForLocalTexts, "createTextFileOfApplication");
		},
		afterEach: function () {
			this.stubCreateTextFileOfApplication.restore();
			this.spyBuildErrorMessage.restore();
		}
	});
	QUnit.test("WHEN successfully updating an Application", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(5);
		var done = assert.async();
		var testTextFileContent = "this is a textfile";
		var inputDataContract = {
				ApplicationName: "myApplication"/*,
				SemanticObject: ""*/
		};
		var inputParameters = [{value: "111142"}];
		var requestBody = {
				applicationName: inputDataContract.ApplicationName
		};
		var response = {};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "/111142", "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, requestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success(response, "OK"); // in case of update there is no data returned
					}, 1);
				}
		};

		this.stubCreateTextFileOfApplication.returns(testTextFileContent);

		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during update");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.update('application', inputDataContract, callback, inputParameters);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during the update of an Application", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(9);
		var done = assert.async();
		var testTextFileContent = "this is a textfile";
		var inputDataContract = {
				ApplicationName: "myApplication"/*,
				SemanticObject: ""*/
		};
		var inputParameters = [{value: "111142"}];
		var requestBody = {
				applicationName: inputDataContract.ApplicationName
		};

		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "/111142", "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, requestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};
		this.stubCreateTextFileOfApplication.returns(testTextFileContent);
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5228", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], "111142", "THEN applicationId as parameter");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR403, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5228", "THEN message code has been provided");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[2], ["111142"], "THEN parameters has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.update('application', inputDataContract, callback, inputParameters);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Update operations for Analytical Configurations", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();

			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");

			this.stubbedProxyTextHandlerForLocalTexts = new ProxyTextHandlerForLocalTexts({
				instances : {messageHandler: this.messageHandler}});
			this.stubCreateTextFileOfApplication = sinon.stub(this.stubbedProxyTextHandlerForLocalTexts, "createTextFileOfApplication");
		},
		afterEach: function () {
			this.spyBuildErrorMessage.restore();
			this.stubCreateTextFileOfApplication.restore();
		}
	});
	QUnit.test("WHEN successfully updating an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(6);
		var done = assert.async();
		var testTextFileContent = "this is a textfile";
		var expectedAnalyticalConfigurationId = testData.configurationId;
		var analyticalConfiguration = testData.createConfiguration();
		var expectedConfigHeader = {
				Application: testData.applicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;
		var serializedAnalyticalConfiguration = JSON.stringify(analyticalConfiguration);
		var inputDataContract = {
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				Application: testData.applicationId,
				SerializedAnalyticalConfiguration: serializedAnalyticalConfiguration
		};
		var requestBody = {
				analyticalConfigurationName : inputDataContract.AnalyticalConfigurationName,
				serializedAnalyticalConfiguration : inputDataContract.SerializedAnalyticalConfiguration,
				textFile: {
					inDevelopmentLanguage: testTextFileContent
				}
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, requestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success({}, "OK");
					}, 1);
				}
		};

		this.stubCreateTextFileOfApplication.returns(testTextFileContent);

		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during update");
			done();
		};
		// --------------------
		// Act
		// --------------------

		modelerProxy.update('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during the update of an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(11);
		var done = assert.async();
		var testTextFileContent = "this is a textfile";
		var analyticalConfiguration = testData.createConfiguration();

		var expectedAnalyticalConfigurationId = testData.configurationId;
		var analyticalConfiguration = testData.createConfiguration();
		var expectedConfigHeader = {
				Application: testData.applicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName
		};

		analyticalConfiguration.configHeader = expectedConfigHeader;
		var serializedAnalyticalConfiguration = JSON.stringify(analyticalConfiguration);
		var inputDataContract = {
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				Application: testData.applicationId,
				SerializedAnalyticalConfiguration: serializedAnalyticalConfiguration
		};
		var requestBody = {
				analyticalConfigurationName : inputDataContract.AnalyticalConfigurationName,
				serializedAnalyticalConfiguration : inputDataContract.SerializedAnalyticalConfiguration,
				textFile: {
					inDevelopmentLanguage: testTextFileContent
				}
		};

		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, requestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};

		this.stubCreateTextFileOfApplication.returns(testTextFileContent);

		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: ajaxHandler},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5233", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], testData.applicationId, "THEN applicationId as parameter of error message");
			assert.strictEqual(messageObject.getParameters()[1], expectedAnalyticalConfigurationId, "THEN analyticalConfigurationId as parameter of error message");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR403, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5233", "THEN message code has been provided");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[2], [testData.applicationId, expectedAnalyticalConfigurationId], "THEN parameters has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.update('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Import operations for Analytical Configurations via update method", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();
		},
		afterEach: function () {
		}
	});
	QUnit.test("WHEN successfully importing an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(6);
		var done = assert.async();
		var analyticalConfiguration = testData.createConfiguration();
		var expectedApplicationId = testData.applicationId;
		var expectedAnalyticalConfigurationId = testData.configurationId;

		var expectedConfigHeader = {
				Application: testData.applicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};

		analyticalConfiguration.configHeader = expectedConfigHeader;
		var serializedAnalyticalConfiguration = JSON.stringify(analyticalConfiguration);
		var inputDataContract = {
				Application: expectedApplicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				SerializedAnalyticalConfiguration: serializedAnalyticalConfiguration,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		var requestBody = {
				analyticalConfigurationName: inputDataContract.AnalyticalConfigurationName,
				application: inputDataContract.Application,
				serializedAnalyticalConfiguration: inputDataContract.SerializedAnalyticalConfiguration
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applicationAndAnalyticalConfiguration"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, requestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success({}, "OK");
					}, 1);
				}
		};

		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during update");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.update('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs while importing an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(8);
		var done = assert.async();
		var analyticalConfiguration = testData.createConfiguration();
		var expectedApplicationId = testData.applicationId;
		var expectedAnalyticalConfigurationId = testData.configurationId;

		var expectedConfigHeader = {
				Application: testData.applicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};

		analyticalConfiguration.configHeader = expectedConfigHeader;
		var serializedAnalyticalConfiguration = JSON.stringify(analyticalConfiguration);
		var inputDataContract = {
				Application: expectedApplicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				SerializedAnalyticalConfiguration: serializedAnalyticalConfiguration,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		var requestBody = {
				analyticalConfigurationName: inputDataContract.AnalyticalConfigurationName,
				application: inputDataContract.Application,
				serializedAnalyticalConfiguration: inputDataContract.SerializedAnalyticalConfiguration
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applicationAndAnalyticalConfiguration"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, requestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};

		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5233", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], testData.applicationId, "THEN applicationId as parameter of error message");
			assert.strictEqual(messageObject.getParameters()[1], expectedAnalyticalConfigurationId, "THEN analyticalConfigurationId as parameter of error message");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.update('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Import operations for Analytical Configurations via create method", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();
		},
		afterEach: function () {
		}
	});
	QUnit.test("WHEN successfully importing an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(7);
		var done = assert.async();
		var analyticalConfiguration = testData.createConfiguration();
		var expectedApplicationId = testData.applicationId;
		var expectedAnalyticalConfigurationId = testData.configurationId;
		var expectedConfigHeader = {
				Application: testData.applicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;
		var serializedAnalyticalConfiguration = JSON.stringify(analyticalConfiguration);
		var inputDataContract = {
				Application: expectedApplicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: analyticalConfiguration.configHeader.AnalyticalConfigurationName,
				SerializedAnalyticalConfiguration: serializedAnalyticalConfiguration,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		var requestBody = {
				analyticalConfigurationName: inputDataContract.AnalyticalConfigurationName,
				application: inputDataContract.Application,
				serializedAnalyticalConfiguration: inputDataContract.SerializedAnalyticalConfiguration
		};
		var ajaxHandler = {
				send: function (settings) {
					if (settings.type === "HEAD") {
						assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
						setTimeout(function () {
							settings.error(jqXHR404, "error");
						}, 1);
						return;
					}
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applicationAndAnalyticalConfiguration"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, requestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.success({}, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during update");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN importing an Analytical Configuration, that already exists under another application", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(2);
		var done = assert.async();
		var analyticalConfiguration = testData.createConfiguration();
		var expectedApplicationId = testData.applicationId;
		var expectedAnalyticalConfigurationId = testData.configurationId;
		var expectedConfigHeader = {
				Application: testData.applicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;
		var serializedAnalyticalConfiguration = JSON.stringify(analyticalConfiguration);
		var inputDataContract = {
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: analyticalConfiguration.configHeader.AnalyticalConfigurationName,
				Application: expectedApplicationId,
				SerializedAnalyticalConfiguration: serializedAnalyticalConfiguration,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		var ajaxHandler = {
				send: function (settings) {
					if (settings.type === "HEAD") {
						assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
						setTimeout(function () {
							settings.success({}, "OK");
						}, 1);
						return;
					}
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5238", "THEN error code as expected");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN importing an Analytical Configuration AND error at HEAD request", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(2);
		var done = assert.async();
		var analyticalConfiguration = testData.createConfiguration();
		var expectedApplicationId = testData.applicationId;
		var expectedAnalyticalConfigurationId = testData.configurationId;
		var expectedConfigHeader = {
				Application: testData.applicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;
		var serializedAnalyticalConfiguration = JSON.stringify(analyticalConfiguration);
		var inputDataContract = {
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: analyticalConfiguration.configHeader.AnalyticalConfigurationName,
				Application: expectedApplicationId,
				SerializedAnalyticalConfiguration: serializedAnalyticalConfiguration,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		var ajaxHandler = {
				send: function (settings) {
					if (settings.type === "HEAD") {
						assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
						setTimeout(function () {
							settings.error(jqXHR403, "error");
						}, 1);
						return;
					}
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5214", "THEN error code as expected");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs while importing an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(9);
		var done = assert.async();
		var analyticalConfiguration = testData.createConfiguration();
		var expectedApplicationId = testData.applicationId;
		var expectedAnalyticalConfigurationId = testData.configurationId;
		var expectedConfigHeader = {
				Application: testData.applicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: testData.configurationName,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		analyticalConfiguration.configHeader = expectedConfigHeader;
		var serializedAnalyticalConfiguration = JSON.stringify(analyticalConfiguration);
		var inputDataContract = {
				Application: expectedApplicationId,
				AnalyticalConfiguration : testData.configurationId,
				AnalyticalConfigurationName: analyticalConfiguration.configHeader.AnalyticalConfigurationName,
				SerializedAnalyticalConfiguration: serializedAnalyticalConfiguration,
				CreationUTCDateTime: "1516801337838",
				LastChangeUTCDateTime: "1516801337838"
		};
		var requestBody = {
				analyticalConfigurationName: inputDataContract.AnalyticalConfigurationName,
				application: inputDataContract.Application,
				serializedAnalyticalConfiguration: inputDataContract.SerializedAnalyticalConfiguration
		};
		var ajaxHandler = {
				send: function (settings) {
					if (settings.type === "HEAD") {
						assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
						setTimeout(function () {
							settings.error(jqXHR404, "error");
						}, 1);
						return;
					}
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applicationAndAnalyticalConfiguration"].uri + "/" + expectedAnalyticalConfigurationId, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, requestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.dataType, "json", "THEN correct datatype");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};

		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5233", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], testData.applicationId, "THEN applicationId as parameter of error message");
			assert.strictEqual(messageObject.getParameters()[1], expectedAnalyticalConfigurationId, "THEN analyticalConfigurationId as parameter of error message");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.create('configuration', inputDataContract, callback);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Delete operations for Applications", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");
		},
		afterEach: function () {
			this.spyBuildErrorMessage.restore();
		}
	});
	QUnit.test("WHEN successfully deleting an Application", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(3);
		var done = assert.async();
		var applicationId = "111142";
		var inputDataContract = [{value : applicationId}];
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "/" + inputDataContract[0].value, "THEN URL is correct");
					assert.strictEqual(settings.type, "DELETE", "THEN delete is used");
					setTimeout(function () {
						settings.success({}, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (data, metadata, messageObject) {
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during remove");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.remove('application', inputDataContract, callback, undefined, undefined, undefined);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during the deletion of an Application", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(7);
		var done = assert.async();
		var applicationId = "111142";
		var inputDataContract = [{value : applicationId}];
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.applications"].uri + "/" + inputDataContract[0].value, "THEN URL is correct");
					assert.strictEqual(settings.type, "DELETE", "THEN delete is used");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		var callback = function (metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5237", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], inputDataContract[0].value, "THEN applicationId as parameter of error message");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR403, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5237", "THEN message code has been provided");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[2], [inputDataContract[0].value], "THEN parameters has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.remove('application', inputDataContract, callback, undefined, undefined, undefined);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Delete operations for Analytical Configurations", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");
		},
		afterEach: function () {
			this.spyBuildErrorMessage.restore();
		}
	});
	QUnit.test("WHEN successfully deleting an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(4);
		var done = assert.async();
		var analyticalConfigurationId = "67890";
		var applicationId = "111142";
		var inputDataContract = [{value : analyticalConfigurationId}];
		var emptyObject = {};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri + "/" + inputDataContract[0].value, "THEN URL is correct");
					assert.strictEqual(settings.type, "DELETE", "THEN delete is used");
					setTimeout(function () {
						settings.success(emptyObject, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test (SUT)
		var callback = function (metadata, messageObject) {
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.strictEqual(messageObject, undefined, "THEN No error occurs during update");
			done();
		};
		// --------------------
		// Act
		// --------------------
		modelerProxy.remove('configuration', inputDataContract, callback, undefined, applicationId, undefined);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});
	QUnit.test("WHEN an error occurs during the deletion of an Analytical Configuration", function (assert) {
		// --------------------
		// Arrange
		// --------------------
		assert.expect(9);
		var done = assert.async();
		var analyticalConfigurationId = "67890";
		var applicationId = "111142";
		var inputDataContract = [{value : analyticalConfigurationId}];
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, getManifests().manifest["sap.app"].dataSources["apf.designTime.customer.analyticalConfigurations"].uri + "/" + inputDataContract[0].value, "THEN URL is correct");
					assert.strictEqual(settings.type, "DELETE", "THEN delete is used");
					setTimeout(function () {
						settings.error(jqXHR403, "error");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test (SUT)
		var callback = function (metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5225", "THEN error code as expected");
			assert.strictEqual(messageObject.getParameters()[0], applicationId, "THEN correct applicationId as parameter");
			assert.strictEqual(messageObject.getParameters()[1], inputDataContract[0].value, "THEN correct analyticalConfigurationId as parameter");
			assert.strictEqual(jQuery.isEmptyObject(metadata), true, "THEN Metadata is empty");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[0], jqXHR403, "THEN jqxhr has been provided");
			assert.strictEqual(this.spyBuildErrorMessage.getCall(0).args[1], "5225", "THEN message code has been provided");
			assert.deepEqual(this.spyBuildErrorMessage.getCall(0).args[2], [applicationId, inputDataContract[0].value], "THEN parameters has been provided");
			done();
		}.bind(this);
		// --------------------
		// Act
		// --------------------
		modelerProxy.remove('configuration', inputDataContract, callback, undefined, applicationId, undefined);
		// --------------------
		// Verify - see callback/ajax above
		// --------------------
	});

	QUnit.module("Read in batch", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.check = function(booleExpr) {
					if (!booleExpr) {
						throw "checkFailed";
					}
				};
			};
			this.messageHandler = new MessageHandler();
			this.applicationId = 'anne';
			this.dummyResult = [{
				AnalyticalConfiguration: 'ABCDEFG12345',
				AnalyticalConfigurationName: 'walter',
				Application: this.applicationId
			},{
				AnalyticalConfiguration: 'ABCDEFG12346',
				AnalyticalConfigurationName: 'walter2',
				Application: this.applicationId
			}];
			this.testTextElement = [{ TextElement : '12345', TextDescription : "nice"}];
			var ajaxHandler = {
					send: function (settings) {
						// do nothing here
					}
			};
			this.stubbedProxyTextHandlerForLocalTexts = new ProxyTextHandlerForLocalTexts({
				instances : {messageHandler: this.messageHandler}});
			this.stubGetTextElements = sinon.stub(this.stubbedProxyTextHandlerForLocalTexts, "getTextElements");
			var inject = {
					instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler, proxyTextHandlerForLocalTexts: this.stubbedProxyTextHandlerForLocalTexts},
					manifests: getManifests()
			};
			this.stubbedModelerProxy = new proxyModule.ModelerProxy({}, inject);
			this.stubReadCollection = sinon.stub(this.stubbedModelerProxy, "readCollection", function(entitySetName,callback,inputParameters){
				if(inputParameters === "errorCase"){
					callback(undefined, undefined, this.messageHandler.createMessageObject({code : "1234"}));
				} else {
					callback(this.dummyResult, undefined, undefined);
				}
			}.bind(this));
			var filterForApplication = new Filter(this.messageHandler, 'Application', 'eq', this.applicationId);
			this.requestConfigurations = [{entitySetName: 'configuration', inputParameters: undefined, selectList: undefined, filter: filterForApplication}];
			this.requestConfigurationsForErrorCase = [{entitySetName: 'configuration', inputParameters: 'errorCase', selectList: undefined, filter: filterForApplication}];
		},
		afterEach: function () {
			this.stubReadCollection.restore();
			this.stubGetTextElements.restore();
		}
	});
	QUnit.test("WHEN readCollectionsInBatch is called successfully", function (assert) {
		this.stubGetTextElements.returns(this.testTextElement);
		var callback = function(result, messageObject){
			assert.strictEqual(messageObject, undefined, "THEN No error occurs");
			assert.deepEqual(result, [this.dummyResult, this.testTextElement], "THEN result is correct");
			assert.strictEqual(this.stubReadCollection.callCount, 1, "THEN readCollection is only called once");
			assert.strictEqual(this.stubReadCollection.getCall(0).args[0], this.requestConfigurations[0].entitySetName, "THEN readCollection is called with the correct parameters");
			assert.strictEqual(this.stubReadCollection.getCall(0).args[2], this.requestConfigurations[0].inputParameters, "THEN readCollection is called with the correct parameters");
			assert.strictEqual(this.stubReadCollection.getCall(0).args[3], this.requestConfigurations[0].selectList, "THEN readCollection is called with the correct parameters");
			assert.strictEqual(this.stubReadCollection.getCall(0).args[4], this.requestConfigurations[0].filter, "THEN readCollection is called with the correct parameters");
			assert.strictEqual(this.stubGetTextElements.callCount, 1, "THEN getTextElements is only called once");
			assert.strictEqual(this.stubGetTextElements.getCall(0).args[0], this.applicationId, "THEN getTextElements is called with the correct parameter");
		}.bind(this);
		this.stubbedModelerProxy.readCollectionsInBatch(this.requestConfigurations, callback);
	});
	QUnit.test("WHEN readCollectionsInBatch is called in error case", function (assert) {
		this.stubGetTextElements.returns(this.testTextElement);
		var callback = function(result, messageObject){
			assert.strictEqual(messageObject.type, 'messageObject', "THEN readCollection is called with the right callback as parameter (messageObject as second parameter)");
			assert.strictEqual(messageObject.getCode(), "1234", "THEN Error occurs");
			assert.strictEqual(this.stubReadCollection.callCount, 1, "THEN readCollection is only called once");
			assert.strictEqual(this.stubReadCollection.getCall(0).args[0], this.requestConfigurationsForErrorCase[0].entitySetName, "THEN readCollection is called with the correct parameters");
			assert.strictEqual(this.stubReadCollection.getCall(0).args[2], this.requestConfigurationsForErrorCase[0].inputParameters, "THEN readCollection is called with the correct parameters");
			assert.strictEqual(this.stubReadCollection.getCall(0).args[3], this.requestConfigurationsForErrorCase[0].selectList, "THEN readCollection is called with the correct parameters");
			assert.strictEqual(this.stubReadCollection.getCall(0).args[4], this.requestConfigurationsForErrorCase[0].filter, "THEN readCollection is called with the correct parameters");
			assert.strictEqual(this.stubGetTextElements.callCount, 0, "THEN getTextElements is not called");
		}.bind(this);
		this.stubbedModelerProxy.readCollectionsInBatch(this.requestConfigurationsForErrorCase, callback);
	});

	QUnit.module("Private methods for do change operations in batch - aka textpool cleanup",{
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyBuildErrorMessage = sinon.spy(cloudFoundryUtils, "buildErrorMessage");
			this.spyCheck = sinon.spy(this.messageHandler, "check");

			this.stubbedProxyTextHandlerForLocalTexts = new ProxyTextHandlerForLocalTexts({
				instances : {messageHandler: this.messageHandler}});
			this.spyInitApplicationTexts = sinon.spy(this.stubbedProxyTextHandlerForLocalTexts, "initApplicationTexts");
			this.spyAddText = sinon.spy(this.stubbedProxyTextHandlerForLocalTexts, "addText");
			this.spyRemoveText = sinon.spy(this.stubbedProxyTextHandlerForLocalTexts, "removeText");
			this.spyCreateTextFileOfApplication = sinon.spy(this.stubbedProxyTextHandlerForLocalTexts, "createTextFileOfApplication");

			var inject = {
					instances: {messageHandler: this.messageHandler, proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts, ajaxHandler: {} },
					manifests: getManifests()
			};
			this.stubbedModelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
			this.spy_deleteLocalText = sinon.spy(this.stubbedModelerProxy,"_deleteLocalText");
			this.spy_createOrUpdateLocalText = sinon.spy(this.stubbedModelerProxy,"_createOrUpdateLocalText");

			this.singleDelete = {entitySetName: 'texts', inputParameters: [{value: testData.textElementId}], method: 'DELETE', application: testData.applicationId, data: undefined};
			var postData = {
					TextElement : undefined,
					TextElementDescription: 'This is the text',
					Language: sap.apf.core.constants.developmentLanguage,
					TextElementType: 'XTIT',
					MaximumLength: 200,
					Application: testData.applicationId,
					TranslationHint: 'This is a hint'
			};
			this.singlePost = {entitySetName: 'texts', inputParameters: undefined, method: 'POST', application: undefined, data: postData};
			var putData = JSON.parse(JSON.stringify(postData));
			putData.TextElement = testData.textElementId;
			this.singlePut = {entitySetName: 'texts', inputParameters: undefined, method: 'PUT', application: undefined, data: putData};
			this.setOfRequests = [this.singleDelete, this.singlePost, this.singlePut];
		},
		afterEach : function () {
			this.spy_createOrUpdateLocalText.restore();
			this.spy_deleteLocalText.restore();

			this.spyCreateTextFileOfApplication.restore();
			this.spyRemoveText.restore();
			this.spyAddText.restore();
			this.spyInitApplicationTexts.restore();
			this.spyBuildErrorMessage.restore();
			this.spyCheck.restore();
		}
	});
	QUnit.test("WHEN _readConfigurationListAndTextFile is called successfully", function (assert) {
		assert.expect(5);
		var done = assert.async();
		var requestUrlParameters = {
				applicationId: "111142"
		};
		var inputDataContract = requestUrlParameters.applicationId;
		var expectedRequestUri = getManifests().manifest["sap.app"].dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri +
		'?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=(Application%20eq%20'
		+ "'" + requestUrlParameters.applicationId + "'" + ')';

		var analyticalConfiguration = testData.createConfiguration();
		var responseFromServer = {
				analyticalConfigurations:
					[
					 {
						 analyticalConfiguration: analyticalConfiguration,
						 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
						 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
					 },
					 {
						 analyticalConfiguration: analyticalConfiguration,
						 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
						 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
					 }
					 ],
					 textFile: {
						 inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", requestUrlParameters.applicationId)
					 }
		};
		var expectedResult = responseFromServer;
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedRequestUri, "THEN URL is correct");
					assert.deepEqual(settings.data, undefined, "THEN request is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					assert.strictEqual(settings.async, true, "THEN async is used");
					setTimeout(function () {
						settings.success(responseFromServer, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy._readConfigurationListAndTextFile(inputDataContract).then(function (value) {
			assert.deepEqual(value, expectedResult, "THEN value from resolving promise as expected");
			done();
		}, function (reason) {
			assert.ok(false, "THEN the promise should be resolved");
		});
	});
	QUnit.test("WHEN _readConfigurationListAndTextFile is called successfully AND null is returned for analytical configurations", function (assert) {
		assert.expect(1);
		var done = assert.async();
		var requestUrlParameters = {
				applicationId: "111142"
		};
		var inputDataContract = requestUrlParameters.applicationId;

		var responseFromServer = {
				analyticalConfigurations: null,
				textFile: {
					inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", requestUrlParameters.applicationId)
				}
		};
		var expectedResult = {
				analyticalConfigurations: [],
				textFile: {
					inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", requestUrlParameters.applicationId)
				}
		};

		var ajaxHandler = {
				send: function (settings) {
					setTimeout(function () {
						settings.success(responseFromServer, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler: ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy._readConfigurationListAndTextFile(inputDataContract).then(function (value) {
			assert.deepEqual(value, expectedResult, "THEN value from resolving promise as expected");
			done();
		}, function (reason) {
			assert.ok(false, "THEN the promise should be resolved");
		});
	});
	QUnit.test("WHEN _readConfigurationListAndTextFile is called in an error case", function (assert) {
		assert.expect(14);
		var done = assert.async();
		var requestUrlParameters = {
				applicationId: "111142"
		};
		var inputDataContract = requestUrlParameters.applicationId;
		var expectedRequestUri = getManifests().manifest["sap.app"].dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri +
		'?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=(Application%20eq%20'
		+ "'" + requestUrlParameters.applicationId + "'" + ')';
		var responseFromServer = jqXHR403;
		var expectedMessageCode = "5222";
		var expectedParametersInMessageObjectText = [requestUrlParameters.applicationId];
		var originalMessageObject = this.messageHandler.createMessageObject("original message object for testing");
		var expectedParametersForBuildErrorMessage = 
			[responseFromServer, expectedMessageCode, expectedParametersInMessageObjectText,
			 originalMessageObject, this.messageHandler];

		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedRequestUri, "THEN URL is correct");
					assert.deepEqual(settings.data, undefined, "THEN request is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					assert.strictEqual(settings.async, true, "THEN async is used");
					setTimeout(function () {
						settings.error(responseFromServer, "error", undefined, originalMessageObject);
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler : ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy._readConfigurationListAndTextFile(inputDataContract).then(function (value) {
			assert.ok(false, "THEN the promise should be rejected");
		}, function (reason) {
			commonAssertsForMessageObjectCreation(assert, reason, expectedMessageCode, expectedParametersInMessageObjectText);
			commonAssertsForBuildErrorMessage(assert, this.spyBuildErrorMessage, expectedParametersForBuildErrorMessage);
			done();
		}.bind(this));
	});
	QUnit.test("WHEN _readConfigurationListAndTextFile is called successfully and server returns more data than expected - ROBUSTNESS CASE", function (assert) {
		assert.expect(5);
		var done = assert.async();
		var requestUrlParameters = {
				applicationId: "111142"
		};
		var inputDataContract = requestUrlParameters.applicationId;
		var expectedRequestUri = getManifests().manifest["sap.app"].dataSources["apf.designTime.textFileAndAnalyticalConfigurations"].uri +
		'?$select=AnalyticalConfiguration,AnalyticalConfigurationName,SerializedAnalyticalConfiguration&$filter=(Application%20eq%20'
		+ "'" + requestUrlParameters.applicationId + "'" + ')';

		var analyticalConfiguration = testData.createConfiguration();
		var responseFromServer = {
				analyticalConfigurations:
					[
					 {
						 analyticalConfiguration: analyticalConfiguration,
						 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
						 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration),
						 additionalMember: "I am not needed at all"
					 },
					 {
						 analyticalConfiguration: analyticalConfiguration,
						 additionalMember: "I am not needed at all",
						 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
						 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
					 }
					 ],
					 textFile: {
						 inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", requestUrlParameters.applicationId),
						 additionalMember: "I am not needed at all"
					 },
					 additionalMember: "I am not needed at all"
		};
		var expectedResult = {
				analyticalConfigurations:
					[
					 {
						 analyticalConfiguration: analyticalConfiguration,
						 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
						 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
					 },
					 {
						 analyticalConfiguration: analyticalConfiguration,
						 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
						 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
					 }
					 ],
					 textFile: {
						 inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", requestUrlParameters.applicationId)
					 }
		};
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedRequestUri, "THEN URL is correct");
					assert.deepEqual(settings.data, undefined, "THEN request is correct");
					assert.strictEqual(settings.type, "GET", "THEN get is used");
					assert.strictEqual(settings.async, true, "THEN async is used");
					setTimeout(function () {
						settings.success(responseFromServer, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {messageHandler: this.messageHandler, ajaxHandler : ajaxHandler },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy._readConfigurationListAndTextFile(inputDataContract).then(function (value) {
			assert.deepEqual(value, expectedResult, "THEN value from resolving promise as expected");
			done();
		}, function (reason) {
			assert.ok(false, "THEN the promise should be resolved");
		});
	});
	QUnit.test("WHEN _initText is called", function(assert){
		// Arrange
		var applicationId = testData.applicationId;
		var propertyFileString = sap.apf.testhelper.config.getPropertyFile("dev", applicationId);
		var expectedParameters = [applicationId, propertyFileString];
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: {} },
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// Act
		modelerProxy._initText(applicationId, propertyFileString);
		// Verify
		assert.strictEqual(this.spyInitApplicationTexts.callCount, 1, "THEN initApplicationTexts has only been called once");
		assert.deepEqual(this.spyInitApplicationTexts.getCall(0).args, expectedParameters, "THEN parameters for call of initApplicationTexts as expected");
	});
	QUnit.test("WHEN _applyChangesOnTextFile is called with an empty request configuration list", function (assert) {
		assert.expect(3);
		var dataInputContract = [];
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputContract);

		assert.strictEqual(this.spy_deleteLocalText.callCount, 0, "THEN _deleteLocalText was not called at all");
		assert.strictEqual(this.spy_createOrUpdateLocalText.callCount, 0, "THEN _createOrUpdateLocalText was not called at all");
		assert.strictEqual(this.spyCheck.callCount, 0, "THEN check has not been called at all");
	});
	QUnit.test("WHEN _applyChangesOnTextFile is called with a single DELETE", function (assert) {
		assert.expect(2);
		var dataInputContract = [this.singleDelete];
		var expectedParameters = [this.singleDelete.application, this.singleDelete.inputParameters[0].value];
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputContract);

		assert.strictEqual(this.spy_deleteLocalText.callCount, 1, "THEN _deleteLocalText is called only once");
		assert.deepEqual(this.spy_deleteLocalText.getCall(0).args, expectedParameters, "THEN _deleteLocalText is called with the expected parameters");
	});
	QUnit.test("WHEN _applyChangesOnTextFile is called with a single POST", function(assert){
		assert.expect(2);
		var dataInputContract = [this.singlePost];
		var expectedParameters = [this.singlePost.data];
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputContract);

		assert.strictEqual(this.spy_createOrUpdateLocalText.callCount, 1, "THEN _createOrUpdateLocalText is called only once");
		assert.deepEqual(this.spy_createOrUpdateLocalText.getCall(0).args, expectedParameters, "THEN _createOrUpdateLocalText is called with the expected parameters");
	});
	QUnit.test("WHEN _applyChangesOnTextFile is called with a single PUT", function(assert){
		assert.expect(2);
		var dataInputContract = [this.singlePut];
		var expectedParameters = [this.singlePut.data];
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputContract);

		assert.strictEqual(this.spy_createOrUpdateLocalText.callCount, 1, "THEN _createOrUpdateLocalText is called only once");
		assert.deepEqual(this.spy_createOrUpdateLocalText.getCall(0).args, expectedParameters, "THEN _createOrUpdateLocalText is called with the expected parameters");
	});
	QUnit.test("INDUCTION _applyChangesOnTextFile", function(assert) {
		var dataInputContract_IH = [this.singlePut, this.singlePut]; // IH abbreviates induction hypothesis
		var dataInputContract_Single = [this.singlePost];
		var lengthOfIH = dataInputContract_IH.length;
		var lengthOfSingle = 1;
		var dataInputConcatenated = [];
		Array.prototype.push.apply(dataInputConcatenated, dataInputContract_IH);
		Array.prototype.push.apply(dataInputConcatenated, dataInputContract_Single);
		var lengthOfN = lengthOfIH + lengthOfSingle;
		// --------------------------------------
		// prove on arbitrary list of length N-1
		// --------------------------------------
		assert.expect((1 + lengthOfIH) + (1 + lengthOfN));
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputContract_IH);
		assert.strictEqual(this.spy_createOrUpdateLocalText.callCount, dataInputContract_IH.length, "THEN IH condition true");
		dataInputContract_IH.forEach(function(contract, index) {
			assert.deepEqual(this.spy_createOrUpdateLocalText.getCall(index).args, [dataInputContract_IH[index].data], "THEN IH condition true");
		}.bind(this));
		// --------------------------------------
		// Prove induction step from N-1 to N
		// --------------------------------------
		this.spy_createOrUpdateLocalText.reset();
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputConcatenated);
		assert.strictEqual(this.spy_createOrUpdateLocalText.callCount, lengthOfN,
				"THEN induction condition on callCount is true");
		dataInputConcatenated.forEach(function(contract, index) {
			if (index < dataInputConcatenated.length - 1) {
				assert.deepEqual(this.spy_createOrUpdateLocalText.getCall(index).args, [dataInputContract_IH[index].data],
						"AND induction condition on parameters is true for the first n-1 elements");
			} else {
				assert.deepEqual(this.spy_createOrUpdateLocalText.getCall(index).args, [dataInputContract_Single[0].data],
						"AND induction condition on parameters is true for the last element");
			}
		}.bind(this));
	});
	QUnit.test("WHEN _applyChangesOnTextFile is called with a set of DELETE, POST and PUT requests", function(assert){
		assert.expect(5);
		var dataInputContract = this.setOfRequests;
		var expectedParametersDelete = [this.singleDelete.application, this.singleDelete.inputParameters[0].value];
		var expectedParametersPost = [this.singlePost.data];
		var expectedParametersPut = [this.singlePut.data];
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputContract);

		assert.strictEqual(this.spy_deleteLocalText.callCount, 1, "THEN _deleteLocalText is called only once");
		assert.deepEqual(this.spy_deleteLocalText.getCall(0).args, expectedParametersDelete, "THEN _deleteLocalText is called with the expected parameters for delete");
		assert.strictEqual(this.spy_createOrUpdateLocalText.callCount, 2, "THEN _createOrUpdateLocalText is called twice");
		assert.deepEqual(this.spy_createOrUpdateLocalText.getCall(0).args, expectedParametersPost, "THEN _createOrUpdateLocalText is called with the expected parameters for post");
		assert.deepEqual(this.spy_createOrUpdateLocalText.getCall(1).args, expectedParametersPut, "THEN _createOrUpdateLocalText is called with the expected parameters for put");
	});
	QUnit.test("WHEN _applyChangesOnTextFile is called with an unsupported http verb", function (assert) {
		var singleHead = {entitySetName: 'texts', inputParameters: undefined, method: 'HEAD', application: undefined, data: undefined};
		var dataInputContract = [singleHead];
		var expectedParametersForCheck =
			[ false,
			 'The method ' + singleHead.method + ' is not supported during text processing in batch mode by the modeler proxy.'
			];
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputContract);

		assert.strictEqual(this.spyCheck.callCount, 1, "THEN check has only been called once");
		assert.deepEqual(this.spyCheck.getCall(0).args, expectedParametersForCheck, "THEN method check has been called with the expected parameters");
	});
	QUnit.test("WHEN _applyChangesOnTextFile is called with an unsupported entitySetName", function (assert) {
		var singlePostInvalidEntitySetName = {entitySetName: 'configuration', inputParameters: undefined, method: 'POST', application: undefined, data: undefined};
		var dataInputContract = [singlePostInvalidEntitySetName];
		var expectedParametersForCheck = 
			[ false, 'The create/update/delete operation on entity set ' + singlePostInvalidEntitySetName.entitySetName + ' is not supported by the modeler proxy.'
			];
		this.stubbedModelerProxy._applyChangesOnTextFile(dataInputContract);

		assert.strictEqual(this.spyCheck.callCount, 1, "THEN check has only been called once");
		assert.deepEqual(this.spyCheck.getCall(0).args, expectedParametersForCheck, "THEN method check has been called with the expected parameters");
	});

	QUnit.test("WHEN _createTextFileOfApplication is called", function (assert) {
		// Arrange
		var applicationId = testData.applicationId;
		var expectedParameters = [applicationId];
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					coreApi: {}
					},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// Act
		modelerProxy._createTextFileOfApplication(applicationId);
		// Verify
		assert.strictEqual(this.spyCreateTextFileOfApplication.callCount, 1, "THEN createTextFileOfApplication has only been called once");
		assert.deepEqual(this.spyCreateTextFileOfApplication.getCall(0).args, expectedParameters, "THEN parameters for call of createTextFileOfApplication as expected");
	});
	QUnit.test("WHEN _createOrUpdateLocalText is called", function (assert) {
		// Arrange
		var text = {test: "I am a test text object"};
		var expectedParameters = [text];
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					ajaxHandler: {}
					},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// Act
		modelerProxy._createOrUpdateLocalText(text);
		// Verify
		assert.strictEqual(this.spyAddText.callCount, 1, "THEN addText has only been called once");
		assert.deepEqual(this.spyAddText.getCall(0).args, expectedParameters, "THEN parameters for call of addText as expected");
	});
	QUnit.test("WHEN _deleteLocalText is called", function (assert) {
		// Arrange
		var applicationId = testData.applicationId;
		var textElementId = "I am a test GUID";
		var expectedParameters = [{
			application: applicationId,
			inputParameters: [{value: textElementId}]
		}];
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
					coreApi: {}
					},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// Act
		modelerProxy._deleteLocalText(applicationId, textElementId);
		// Verify
		assert.strictEqual(this.spyRemoveText.callCount, 1, "THEN removeText has only been called once");
		assert.deepEqual(this.spyRemoveText.getCall(0).args, expectedParameters, "THEN parameters for call of removeText as expected");
	});
	QUnit.test("WHEN _updateRemoteTextFile is called successfully for import from file", function (assert) {
		assert.expect(5);
		var done = assert.async();
		var inputDataContract = {
				applicationId: testData.applicationId,
				textFileLanguage: sap.apf.core.constants.developmentLanguage,
				serializedTextFile: JSON.stringify(sap.apf.testhelper.config.getPropertyFile("dev", testData.applicationId)),
				isTextPoolCleanup: false
		};
		var requestUrlParameters = {
				applicationId: inputDataContract.applicationId,
				textFileLanguage: sap.apf.core.constants.developmentLanguage
		};
		var expectedRequestUri = getManifests().manifest["sap.app"].dataSources["apf.designTime.textFiles"].uri + '/'
		+ requestUrlParameters.applicationId + '/' + requestUrlParameters.textFileLanguage;
		var expectedRequestBody = {
				serializedTextFile: inputDataContract.serializedTextFile
		};
		var responseFromServer;
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedRequestUri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, expectedRequestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.async, true, "THEN async is used");
					setTimeout(function () {
						settings.success(responseFromServer, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy._updateRemoteTextFile(inputDataContract.applicationId, inputDataContract.textFileLanguage, inputDataContract.serializedTextFile, inputDataContract.isTextPoolCleanup).then(function () {
			assert.ok(true, "THEN resolving promise as expected");
			done();
		}, function (reason) {
			assert.ok(false, "THEN the promise should be resolved");
		});
	});
	QUnit.test("WHEN _updateRemoteTextFile is called in an error case for import from file", function (assert) {
		assert.expect(15);
		var done = assert.async();
		var inputDataContract = {
				applicationId: testData.applicationId,
				textFileLanguage: sap.apf.core.constants.developmentLanguage,
				serializedTextFile: JSON.stringify(sap.apf.testhelper.config.getPropertyFile("dev", testData.applicationId)),
				isTextPoolCleanup: false
		};
		var requestUrlParameters = {
				applicationId: inputDataContract.applicationId,
				textFileLanguage: sap.apf.core.constants.developmentLanguage
		};
		var expectedRequestUri = getManifests().manifest["sap.app"].dataSources["apf.designTime.textFiles"].uri + '/'
		+ requestUrlParameters.applicationId + '/' + requestUrlParameters.textFileLanguage;
		var expectedRequestBody = {
				serializedTextFile: inputDataContract.serializedTextFile
		};
		var responseFromServer = jqXHR403;
		var expectedMessageCode = '5230';
		var expectedParametersInMessageObjectText = [ requestUrlParameters.applicationId ];
		var originalMessageObject = this.messageHandler.createMessageObject("original message object for testing");
		var expectedParametersForBuildErrorMessage =
			[ responseFromServer, expectedMessageCode, expectedParametersInMessageObjectText,
			  originalMessageObject, this.messageHandler ];
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedRequestUri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, expectedRequestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.async, true, "THEN async is used");
					setTimeout(function () {
						settings.error(responseFromServer, "error", undefined, originalMessageObject);
					}, 1);
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy._updateRemoteTextFile(inputDataContract.applicationId, inputDataContract.textFileLanguage, inputDataContract.serializedTextFile, inputDataContract.isTextPoolCleanup).then(function () {
			assert.ok(false, "THEN the promise should be rejected");
		}, function (reason) {
			assert.ok(true, "THEN rejected the promise as expected");
			commonAssertsForMessageObjectCreation(assert, reason, expectedMessageCode, expectedParametersInMessageObjectText);
			commonAssertsForBuildErrorMessage(assert, this.spyBuildErrorMessage, expectedParametersForBuildErrorMessage);
			done();
		}.bind(this));
	});
	QUnit.test("WHEN _updateRemoteTextFile is called successfully for textpool cleanup", function (assert) {
		assert.expect(5);
		var done = assert.async();
		var inputDataContract = {
				applicationId: testData.applicationId,
				textFileLanguage: sap.apf.core.constants.developmentLanguage,
				serializedTextFile: JSON.stringify(sap.apf.testhelper.config.getPropertyFile("dev", testData.applicationId)),
				isTextPoolCleanup: true
		};
		var requestUrlParameters = {
				applicationId: inputDataContract.applicationId,
		};
		var expectedRequestUri = getManifests().manifest["sap.app"].dataSources["apf.designTime.textFiles"].uri + '/'
		+ requestUrlParameters.applicationId;
		var expectedRequestBody = {
				serializedTextFile: inputDataContract.serializedTextFile
		};
		var responseFromServer;
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedRequestUri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, expectedRequestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.async, true, "THEN async is used");
					setTimeout(function () {
						settings.success(responseFromServer, "OK");
					}, 1);
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy._updateRemoteTextFile(inputDataContract.applicationId, inputDataContract.textFileLanguage, inputDataContract.serializedTextFile, inputDataContract.isTextPoolCleanup).then(function () {
			assert.ok(true, "THEN resolving promise as expected");
			done();
		}, function (reason) {
			assert.ok(false, "THEN the promise should be resolved");
		});
	});
	QUnit.test("WHEN _updateRemoteTextFile is called in an error case for textpool cleanup", function (assert) {
		assert.expect(15);
		var done = assert.async();
		var inputDataContract = {
				applicationId: testData.applicationId,
				textFileLanguage: sap.apf.core.constants.developmentLanguage,
				serializedTextFile: JSON.stringify(sap.apf.testhelper.config.getPropertyFile("dev", testData.applicationId)),
				isTextPoolCleanup: true
		};
		var requestUrlParameters = {
				applicationId: inputDataContract.applicationId,
		};
		var expectedRequestUri = getManifests().manifest["sap.app"].dataSources["apf.designTime.textFiles"].uri + '/'
		+ requestUrlParameters.applicationId;
		var expectedRequestBody = {
				serializedTextFile: inputDataContract.serializedTextFile
		};
		var responseFromServer = jqXHR403;
		var expectedMessageCode = '5230';
		var expectedParametersInMessageObjectText = [ requestUrlParameters.applicationId ];
		var originalMessageObject = this.messageHandler.createMessageObject("original message object for testing");
		var expectedParametersForBuildErrorMessage =
			[ responseFromServer, expectedMessageCode, expectedParametersInMessageObjectText,
			  originalMessageObject, this.messageHandler ];
		var ajaxHandler = {
				send: function (settings) {
					assert.strictEqual(settings.url, expectedRequestUri, "THEN URL is correct");
					settings.data = JSON.parse(settings.data);
					assert.deepEqual(settings.data, expectedRequestBody, "THEN request is correct");
					assert.strictEqual(settings.type, "PUT", "THEN put is used");
					assert.strictEqual(settings.async, true, "THEN async is used");
					setTimeout(function () {
						settings.error(responseFromServer, "error", undefined, originalMessageObject);
					}, 1);
				}
		};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler: ajaxHandler
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// --------------------
		// Act
		// --------------------
		modelerProxy._updateRemoteTextFile(inputDataContract.applicationId, inputDataContract.textFileLanguage, inputDataContract.serializedTextFile, inputDataContract.isTextPoolCleanup).then(function () {
			assert.ok(false, "THEN the promise should be rejected");
		}, function (reason) {
			assert.ok(true, "THEN rejected the promise as expected");
			commonAssertsForMessageObjectCreation(assert, reason, expectedMessageCode, expectedParametersInMessageObjectText);
			commonAssertsForBuildErrorMessage(assert, this.spyBuildErrorMessage, expectedParametersForBuildErrorMessage);
			done();
		}.bind(this));
	});
	QUnit.module("Do change operations in batch - aka textpool cleanup No.1", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();
			this.spyCheck = sinon.spy(this.messageHandler, "check");
		},
		afterEach: function () {
			this.spyCheck.restore();
		}
	});
	QUnit.test("WHEN doChangeOperationsInBatch is called with an entitySetName other than 'texts' - ROBUSTNESS CASE for import from file", function (assert) {
		// Arrange
		var unallowedEntitySetName = 'application';
		var isTextPoolCleanup = false;
		var requestConfigurations =
			[
			 {entitySetName: 'texts', inputParameters: undefined, method: 'POST', application: undefined, data: undefined},
			 {entitySetName: unallowedEntitySetName, inputParameters: undefined, method: 'POST', application: undefined, data: undefined}
		];
		var expectedParameters =
			[ false,
			  'The create/update/delete operation in batch on entity set ' + unallowedEntitySetName + ' is not supported by the modeler proxy.'
		];
		var doNothing = function () {};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler: {
						send: function(){}
					}
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// Act
		modelerProxy.doChangeOperationsInBatch(requestConfigurations, doNothing, testData.applicationId, isTextPoolCleanup);
		// Verify
		assert.strictEqual(this.spyCheck.callCount, 1, "THEN check was called only once");
		assert.deepEqual(this.spyCheck.getCall(0).args, expectedParameters, "THEN parameters as expected");
	});
	QUnit.test("WHEN doChangeOperationsInBatch is called with an entitySetName other than 'texts' - ROBUSTNESS CASE for textpool cleanup", function (assert) {
		// Arrange
		var unallowedEntitySetName = 'application';
		var isTextPoolCleanup = true;
		var requestConfigurations =
			[
			 {entitySetName: 'texts', inputParameters: undefined, method: 'POST', application: undefined, data: undefined},
			 {entitySetName: unallowedEntitySetName, inputParameters: undefined, method: 'POST', application: undefined, data: undefined}
		];
		var expectedParameters =
			[ false,
			  'The create/update/delete operation in batch on entity set ' + unallowedEntitySetName + ' is not supported by the modeler proxy.'
		];
		var doNothing = function () {};
		var inject = {
				instances: {
					messageHandler: this.messageHandler,
					ajaxHandler: {
						send: function(){}
					}
				},
				manifests: getManifests()
		};
		var modelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		// Act
		modelerProxy.doChangeOperationsInBatch(requestConfigurations, doNothing, testData.applicationId, isTextPoolCleanup);
		// Verify
		assert.strictEqual(this.spyCheck.callCount, 1, "THEN check was called only once");
		assert.deepEqual(this.spyCheck.getCall(0).args, expectedParameters, "THEN parameters as expected");
	});
	QUnit.module("Do change operations in batch - aka textpool cleanup No.2", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();

			this.responseFromServer = jqXHR403;
			var responseFromServerLocal = this.responseFromServer;
			var ajaxHandler = {
					send: function (settings) {
						setTimeout(function () {
							settings.error(responseFromServerLocal, "error");
						}, 1);
					}
			};
			var inject = {
					instances: {
						messageHandler: this.messageHandler,
						ajaxHandler: ajaxHandler
					},
					manifests: getManifests()
			};
			this.stubbedModelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
		},
		afterEach: function () {
		}
	});
	QUnit.test("WHEN doChangeOperationsInBatch and _readConfigurationListAndTextFile fails for import from file", function (assert) {
		// Arrange
		assert.expect(3);
		var done = assert.async();
		var applicationId = testData.applicationId;
		var isTextPoolCleanup = false;
		var inputDataContract =
			[ {entitySetName: 'texts', inputParameters: undefined, method: 'POST', application: applicationId, data: undefined},
			  {entitySetName: 'texts', inputParameters: undefined, method: 'DELETE', application: applicationId, data: undefined},
			  {entitySetName: 'texts', inputParameters: undefined, method: 'POST', application: applicationId, data: undefined}
			];
		var expectedMessageCode = "5222";
		var expectedParametersInMessageObjectText = [
		                                             inputDataContract[0].application
		                                             ];
		// Verify
		var callback = function (messageObject) {
			commonAssertsForMessageObjectCreation(assert, messageObject, expectedMessageCode, expectedParametersInMessageObjectText);
			done();
		};
		// Act
		this.stubbedModelerProxy.doChangeOperationsInBatch(inputDataContract, callback, applicationId, isTextPoolCleanup);
	});
	QUnit.test("WHEN doChangeOperationsInBatch and _readConfigurationListAndTextFile fails for textpool cleanup", function (assert) {
		// Arrange
		assert.expect(3);
		var done = assert.async();
		var applicationId = testData.applicationId;
		var isTextPoolCleanup = true;
		var inputDataContract =
			[ {entitySetName: 'texts', inputParameters: undefined, method: 'POST', application: applicationId, data: undefined},
			  {entitySetName: 'texts', inputParameters: undefined, method: 'DELETE', application: applicationId, data: undefined},
			  {entitySetName: 'texts', inputParameters: undefined, method: 'POST', application: applicationId, data: undefined}
			];
		var expectedMessageCode = "5222";
		var expectedParametersInMessageObjectText = [
		                                             inputDataContract[0].application
		                                             ];
		// Verify
		var callback = function (messageObject) {
			commonAssertsForMessageObjectCreation(assert, messageObject, expectedMessageCode, expectedParametersInMessageObjectText);
			done();
		};
		// Act
		this.stubbedModelerProxy.doChangeOperationsInBatch(inputDataContract, callback, applicationId, isTextPoolCleanup);
	});
	QUnit.module("Do change operations in batch - aka textpool cleanup No.3", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();

			this.responseFromServer = jqXHR403;
			var responseFromServerLocalError = this.responseFromServer;
			var analyticalConfiguration = testData.createConfiguration();
			var responseFromServerSuccess = {
					analyticalConfigurations:
						[
						 {
							 analyticalConfiguration: analyticalConfiguration,
							 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
							 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
						 },
						 {
							 analyticalConfiguration: analyticalConfiguration,
							 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
							 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
						 }
						 ],
						 textFile: {
							 inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", testData.applicationId)
						 }
			};
			var callCountAjax = 0;
			var ajaxHandler = {
					send: function (settings) {
						callCountAjax++;
						setTimeout(function () {
							if(callCountAjax === 1){ // only the first request shall be successful (in order to reach the reject of _updateRemoteTextFile)
								settings.success(responseFromServerSuccess, "OK");
							} else {
								settings.error(responseFromServerLocalError, "error");
							}
						}, 1);
					}
			};
			var inject = {
					instances: {
						messageHandler: this.messageHandler,
						ajaxHandler: ajaxHandler,
						proxyTextHandlerForLocalTexts: {
							initApplicationTexts: function(){},
							addText: function(){},
							removeText: function(){},
							createTextFileOfApplication: function(){}
						}
					},
					manifests: getManifests()
			};
			var doNothing = function () {
				// do nothing here
			};
			this.stubbedModelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
			this.stub_initText = sinon.stub(this.stubbedModelerProxy, "_initText", doNothing());
			this.stub_applyChangesOnTextFile = sinon.stub(this.stubbedModelerProxy, "_applyChangesOnTextFile", doNothing());
			this.stub_createTextFileOfApplication = sinon.stub(this.stubbedModelerProxy, "_createTextFileOfApplication", doNothing());
		},
		afterEach: function () {
			this.stub_initText.restore();
			this.stub_applyChangesOnTextFile.restore();
			this.stub_createTextFileOfApplication.restore();
		}
	});
	QUnit.test("WHEN doChangeOperationsInBatch and _updateRemoteTextFile fails for import from file", function (assert) {
		// Arrange
		assert.expect(3);
		var done = assert.async();
		var applicationId = testData.applicationId;
		var isTextPoolCleanup = false;
		var inputParameters = [{value: "4711"}];
		var inputDataContract =
			[{entitySetName: 'texts', inputParameters: inputParameters,
				method: 'POST', application: applicationId, data: undefined
			},
			 {entitySetName: 'texts', inputParameters: inputParameters,
				 method: 'DELETE', application: applicationId, data: undefined
			 },
			 {entitySetName: 'texts', inputParameters: inputParameters,
				 method: 'POST', application: applicationId, data: undefined
			 }
			];
		var expectedMessageCode = "5230";
		var expectedParametersInMessageObjectText = [ inputDataContract[0].application ];
		// Verify
		var callback = function (messageObject) {
			commonAssertsForMessageObjectCreation(assert, messageObject, expectedMessageCode, expectedParametersInMessageObjectText);
			done();
		};
		// Act
		this.stubbedModelerProxy.doChangeOperationsInBatch(inputDataContract, callback, applicationId, isTextPoolCleanup);
	});
	QUnit.test("WHEN doChangeOperationsInBatch and _updateRemoteTextFile fails for textpool cleanup", function (assert) {
		// Arrange
		assert.expect(3);
		var done = assert.async();
		var applicationId = testData.applicationId;
		var isTextPoolCleanup = true;
		var inputParameters = [{value: "4711"}];
		var inputDataContract =
			[{entitySetName: 'texts', inputParameters: inputParameters, method: 'POST', application: applicationId, data: undefined},
			 {entitySetName: 'texts', inputParameters: inputParameters, method: 'DELETE', application: applicationId, data: undefined},
			 {entitySetName: 'texts', inputParameters: inputParameters, method: 'POST', application: applicationId, data: undefined}
			];
		var expectedMessageCode = "5230";
		var expectedParametersInMessageObjectText = [ inputDataContract[0].application ];
		// Verify
		var callback = function (messageObject) {
			commonAssertsForMessageObjectCreation(assert, messageObject, expectedMessageCode, expectedParametersInMessageObjectText);
			done();
		};
		// Act
		this.stubbedModelerProxy.doChangeOperationsInBatch(inputDataContract, callback, applicationId, isTextPoolCleanup);
	});
	QUnit.module("Do change operations in batch - aka textpool cleanup No.4", {
		beforeEach: function () {
			var MessageHandler = function () {
				this.createMessageObject = function (config) {
					return new MessageObject(config);
				};
				this.isOwnException = function () {
				};
				this.putMessage = function (oMessageObject) {
				};
				this.check = function () {
				};
			};
			this.messageHandler = new MessageHandler();

			var analyticalConfiguration = testData.createConfiguration();
			var responseFromServer = {
					analyticalConfigurations:
						[
						 {
							 analyticalConfiguration: analyticalConfiguration,
							 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
							 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
						 },
						 {
							 analyticalConfiguration: analyticalConfiguration,
							 analyticalConfigurationName: analyticalConfiguration.analyticalConfigurationName,
							 serializedAnalyticalConfiguration: JSON.stringify(analyticalConfiguration)
						 }
						 ],
						 textFile: {
							 inDevelopmentLanguage: sap.apf.testhelper.config.getPropertyFile("dev", testData.applicationId)
						 }
			};
			this.responseFromServer = responseFromServer;
			var callCountAjax = 0;
			var ajaxHandler = {
					send: function (settings) {
						callCountAjax++;
						setTimeout(function () {
							if(callCountAjax === 1){ // the request in _readConfigurationListAndTextFile
								settings.success(responseFromServer, "OK");
							} else if (callCountAjax === 2) { // the request in _updateRemoteTextFile
								settings.success({}, "OK");
							} else { // this case should not happen as there are only two requests in doChangeOperationsInBatch
								settings.error(jqXHR403, "error");
							}
						}, 1);
					}
			};
			var doNothing = function(){
				// do nothing here
			};
			this.stubbedProxyTextHandlerForLocalTexts = new ProxyTextHandlerForLocalTexts(
				{
					instances : {
						messageHandler: this.messageHandler
					}
				});
			this.stub_addText = sinon.stub(this.stubbedProxyTextHandlerForLocalTexts, "addText", doNothing());
			var inject = {
					instances: {
						messageHandler: this.messageHandler,
						proxyTextHandlerForLocalTexts : this.stubbedProxyTextHandlerForLocalTexts,
						ajaxHandler: ajaxHandler
					},
					manifests: getManifests()
			};
			this.stubbedModelerProxy = new proxyModule.ModelerProxy({}, inject); // System under test
			this.spy_readConfigurationListAndTextFile = sinon.spy(this.stubbedModelerProxy, "_readConfigurationListAndTextFile");
			this.stub_initText = sinon.stub(this.stubbedModelerProxy, "_initText", doNothing());
			this.stub_applyChangesOnTextFile = sinon.stub(this.stubbedModelerProxy, "_applyChangesOnTextFile", doNothing());
			this.stub_createOrUpdateLocalTexts = sinon.stub(this.stubbedModelerProxy, "_createOrUpdateLocalText", doNothing());
			this.stub_deleteLocalText = sinon.stub(this.stubbedModelerProxy, "_deleteLocalText", doNothing());

			this.returnFromCreateTextFileOfApplication = sap.apf.testhelper.config.getPropertyFile("dev", testData.applicationId);
			this.stub_createTextFileOfApplication = sinon.stub(this.stubbedModelerProxy, "_createTextFileOfApplication", function () {
				return this.returnFromCreateTextFileOfApplication;
			}.bind(this));
			this.spy_updateRemoteTextFile = sinon.spy(this.stubbedModelerProxy, "_updateRemoteTextFile");
		},
		afterEach: function () {
			this.stub_initText.restore();
			this.stub_applyChangesOnTextFile.restore();
			this.stub_createTextFileOfApplication.restore();
			this.stub_createOrUpdateLocalTexts.restore();
			this.stub_deleteLocalText.restore();
			this.spy_readConfigurationListAndTextFile.restore();
			this.stub_addText.restore();
			this.spy_updateRemoteTextFile.restore();
		}
	});
	QUnit.test("WHEN calling doChangeOperationsInBatch successfully for import from file", function (assert) {
		assert.expect(10);
		var done = assert.async();
		var applicationId = testData.applicationId;
		var isTextPoolCleanup = false;
		var inputDataContract =
			[
			 {entitySetName: 'texts', inputParameters: undefined, method: 'POST',  data: {TextElementDescription: 'this is a text'}},
			 {entitySetName: 'texts', inputParameters: [{value: testData.textElementId}], method: 'DELETE',  data: undefined},
			 {entitySetName: 'texts', inputParameters: undefined, method: 'POST',  data: {TextElementDescription: 'this is a text'}}
			];
		var expectedParamsReadConfiguration = [applicationId];
		var expectedParamsInitText = [applicationId, this.responseFromServer.textFile.inDevelopmentLanguage];
		var expectedParamsApplyChanges = [inputDataContract];
		var expectedParamsCreateTextFile = [applicationId];
		var expectedParamsUpdateRemoteTextFile = [applicationId, 'DEV', this.returnFromCreateTextFileOfApplication, isTextPoolCleanup];
		// Verify
		var callback = function(){
			assert.strictEqual(this.spy_readConfigurationListAndTextFile.callCount, 1, "THEN _readConfigurationListAndTextFile has only been called once");
			assert.deepEqual(this.spy_readConfigurationListAndTextFile.getCall(0).args, expectedParamsReadConfiguration, "THEN _readConfigurationListAndTextFile was called with the expected parameters");
			assert.strictEqual(this.stub_initText.callCount, 1, "THEN _initText has only been called once");
			assert.deepEqual(this.stub_initText.getCall(0).args, expectedParamsInitText, "THEN _initText was called with the expected parameters");
			assert.strictEqual(this.stub_applyChangesOnTextFile.callCount, 1, "THEN _applyChangesOnTextFile has only been called once");
			assert.deepEqual(this.stub_applyChangesOnTextFile.getCall(0).args, expectedParamsApplyChanges, "THEN _applyChangesOnTextFile was called with the expected parameters");
			assert.strictEqual(this.stub_createTextFileOfApplication.callCount, 1, "THEN _createTextFileOfApplication has only been called once");
			assert.deepEqual(this.stub_createTextFileOfApplication.getCall(0).args, expectedParamsCreateTextFile, "THEN _createTextFileOfApplication was called with the expected parameters");
			assert.strictEqual(this.spy_updateRemoteTextFile.callCount, 1, "THEN _updateRemoteTextFile has only been called once");
			assert.deepEqual(this.spy_updateRemoteTextFile.getCall(0).args, expectedParamsUpdateRemoteTextFile, "THEN _updateRemoteTextFile was called with the expected parameters");
			done();
		}.bind(this);
		this.stubbedModelerProxy.doChangeOperationsInBatch(inputDataContract, callback, applicationId, isTextPoolCleanup);
	});
	QUnit.test("WHEN calling doChangeOperationsInBatch successfully for textpool cleanup", function (assert) {
		assert.expect(10);
		var done = assert.async();
		var applicationId = testData.applicationId;
		var isTextPoolCleanup = true;
		var inputDataContract =
			[
			 {entitySetName: 'texts', inputParameters: undefined, method: 'POST',  data: {TextElementDescription: 'this is a text'}},
			 {entitySetName: 'texts', inputParameters: [{value: testData.textElementId}], method: 'DELETE',  data: undefined},
			 {entitySetName: 'texts', inputParameters: undefined, method: 'POST',  data: {TextElementDescription: 'this is a text'}}
			];
		var expectedParamsReadConfiguration = [applicationId];
		var expectedParamsInitText = [applicationId, this.responseFromServer.textFile.inDevelopmentLanguage];
		var expectedParamsApplyChanges = [inputDataContract];
		var expectedParamsCreateTextFile = [applicationId];
		var expectedParamsUpdateRemoteTextFile = [applicationId, 'DEV', this.returnFromCreateTextFileOfApplication, isTextPoolCleanup];
		// Verify
		var callback = function(){
			assert.strictEqual(this.spy_readConfigurationListAndTextFile.callCount, 1, "THEN _readConfigurationListAndTextFile has only been called once");
			assert.deepEqual(this.spy_readConfigurationListAndTextFile.getCall(0).args, expectedParamsReadConfiguration, "THEN _readConfigurationListAndTextFile was called with the expected parameters");
			assert.strictEqual(this.stub_initText.callCount, 1, "THEN _initText has only been called once");
			assert.deepEqual(this.stub_initText.getCall(0).args, expectedParamsInitText, "THEN _initText was called with the expected parameters");
			assert.strictEqual(this.stub_applyChangesOnTextFile.callCount, 1, "THEN _applyChangesOnTextFile has only been called once");
			assert.deepEqual(this.stub_applyChangesOnTextFile.getCall(0).args, expectedParamsApplyChanges, "THEN _applyChangesOnTextFile was called with the expected parameters");
			assert.strictEqual(this.stub_createTextFileOfApplication.callCount, 1, "THEN _createTextFileOfApplication has only been called once");
			assert.deepEqual(this.stub_createTextFileOfApplication.getCall(0).args, expectedParamsCreateTextFile, "THEN _createTextFileOfApplication was called with the expected parameters");
			assert.strictEqual(this.spy_updateRemoteTextFile.callCount, 1, "THEN _updateRemoteTextFile has only been called once");
			assert.deepEqual(this.spy_updateRemoteTextFile.getCall(0).args, expectedParamsUpdateRemoteTextFile, "THEN _updateRemoteTextFile was called with the expected parameters");
			done();
		}.bind(this);
		this.stubbedModelerProxy.doChangeOperationsInBatch(inputDataContract, callback, applicationId, isTextPoolCleanup);
	});

	QUnit.module("URI resolution before calling APIs", {
		beforeEach: function() {
			var that = this;
			that.resolveUriStub = sinon.stub();
			that.resolveUriStub.returnsArg(0);
			var coreApi = {
				getComponent: function() {
					return {
						getManifestObject: function() {
							return {
								resolveUri: that.resolveUriStub
							};
						}
					};
				}
			};
			var ajaxHandler = {
				send: function(option, settings) {
					// Usually in this test module, we are not interested in fulfilling the ajax request, as this would trigger lots of code execution we'd need to incorporate in the mocks that has nothing to do in URI resolution
					// However, if tests need to call the success function, we expose it here for them to use.
					that.callAjaxSuccess = option.success;
					that.callAjaxError = option.error;
				}
			};
			var proxyTextHandlerForLocalTexts = {
				createTextFileOfApplication: function() {},
				addText: function() {}
			};
			var inject = {
				instances: {
					ajaxHandler: ajaxHandler,
					coreApi: coreApi,
					proxyTextHandlerForLocalTexts: proxyTextHandlerForLocalTexts
				},
				manifests: getManifests()
			};
			this.oModelerProxy = new proxyModule.ModelerProxy({}, inject);
		}
	});
	QUnit.test("create: application", function(assert) {
		this.oModelerProxy.create("application", {});
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("create: configuration && data.CreationUTCDateTime && data.LastChangeUTCDateTime", function(assert) {
		this.oModelerProxy.create("configuration", { CreationUTCDateTime: 1, LastChangeUTCDateTime: 1, SerializedAnalyticalConfiguration: "{}" });
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("create: configuration", function(assert) {
		this.oModelerProxy.create("configuration", { SerializedAnalyticalConfiguration: "{}" });
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("create: texts", function(assert) {
		this.oModelerProxy.create("texts", {}, function() {});
		assert.strictEqual(this.resolveUriStub.callCount, 0, "THEN no URI was resolved (as no call to the backend was supposed to be made)");
	});
	QUnit.test("readCollection: application", function(assert) {
		this.oModelerProxy.readCollection("application");
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("readCollection: configuration", function(assert) {
		this.oModelerProxy.readCollection("configuration", null, null, null, {
			getFilterTermsForProperty: function() {
				return [{
					getValue: function() {}
				}];
			},
			toUrlParam: function() {}
		});
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("readCollection: texts", function(assert) {
		this.oModelerProxy.readCollection("texts", function() {});
		assert.strictEqual(this.resolveUriStub.callCount, 0, "THEN no URI was resolved (as no call to the backend was supposed to be made)");
	});
	QUnit.test("readEntity: configuration: readAnalyticalConfigurationForExport", function(assert) {
		this.oModelerProxy.readEntity("configuration", null, [{}], ["CreationUTCDateTime", "LastChangeUTCDateTime"]);
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("readEntity: configuration: readSingleConfiguration", function(assert) {
		this.oModelerProxy.readEntity("configuration", null, [{}]);
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("update: application", function(assert) {
		this.oModelerProxy.update("application", {}, null, [{}]);
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("update: configuration && data.CreationUTCDateTime && data.LastChangeUTCDateTime", function(assert) {
		this.oModelerProxy.update("configuration", { CreationUTCDateTime: 1, LastChangeUTCDateTime: 1, SerializedAnalyticalConfiguration: "{}" });
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("update: configuration", function(assert) {
		this.oModelerProxy.update("configuration", { SerializedAnalyticalConfiguration: "{}" });
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("remove: application", function(assert) {
		this.oModelerProxy.remove("application", [{}]);
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("remove: configuration", function(assert) {
		this.oModelerProxy.remove("configuration", [{}]);
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("_readConfigurationListAndTextFile", function(assert) {
		// This function returns a promise. We must wait for this promise before checking whether the URI was resolved. So, we must call the ajax success function here.
		var promise = this.oModelerProxy._readConfigurationListAndTextFile();
		this.callAjaxSuccess({ analyticalConfigurations: [], textFile: {} });
		return promise.then(function() {
			assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
		}.bind(this));
	});
	QUnit.test("_updateRemoteTextFile", function(assert) {
		// This function returns a promise. We must wait for this promise before checking whether the URI was resolved. So, we must call the ajax success function here.
		var promise = this.oModelerProxy._updateRemoteTextFile();
		this.callAjaxSuccess();
		return promise.then(function() {
			assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
		}.bind(this));
	});
	QUnit.test("_updateRemoteTextFile: textPoolCleanup", function(assert) {
		// This function returns a promise. We must wait for this promise before checking whether the URI was resolved. So, we must call the ajax success function here.
		var promise = this.oModelerProxy._updateRemoteTextFile(null, null, null, true);
		this.callAjaxSuccess();
		return promise.then(function() {
			assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
		}.bind(this));
	});
	QUnit.test("readAllConfigurationsFromVendorLayer", function(assert) {
		this.oModelerProxy.readAllConfigurationsFromVendorLayer();
		assert.strictEqual(this.resolveUriStub.callCount, 1, "THEN the URI was resolved");
	});
	QUnit.test("importVendorContent: Existing, Overwrite", function(assert) {
		// setup
		var done = assert.async();
		this.oModelerProxy.readAllConfigurationsFromVendorLayer = function() {
			return jQuery.Deferred().resolve([]).promise();
		};
		function callbackConfirmOverwrite(callbackOverwrite) {
			callbackOverwrite();
		}
		function callbackImport() {
			assert.strictEqual(this.resolveUriStub.callCount, 2, "THEN the URI was resolved 2 times (check + importConfigurationFromVendorLayer)");
			done();
		}
		// act
		this.oModelerProxy.importVendorContent(null, null, callbackConfirmOverwrite, callbackImport.bind(this));
		this.callAjaxSuccess(); // Head
		this.callAjaxSuccess(); // Put (importConfigurationFromVendorLayer)
	});
	QUnit.test("importVendorContent: Existing, create new", function(assert) {
		// setup
		var done = assert.async();
		this.oModelerProxy.readAllConfigurationsFromVendorLayer = function() {
			return jQuery.Deferred().resolve([]).promise();
		};
		function callbackConfirmOverwrite(callbackOverwrite, callbackCreateNew) {
			callbackCreateNew();
		}
		function callbackImport() {
			assert.strictEqual(this.resolveUriStub.callCount, 3, "THEN the URI was resolved 3 times (check + callbackCreateNew + copyConfigurationToCustomerLayer)");
			done();
		}
		// act
		this.oModelerProxy.importVendorContent(null, null, callbackConfirmOverwrite, callbackImport.bind(this));
		this.callAjaxSuccess(); // Head
		this.callAjaxSuccess({ serializedAnalyticalConfiguration: "{}" }); // Get (callbackCreateNew)
		this.callAjaxSuccess({ serializedAnalyticalConfiguration: "{}" }); // Post (copyConfigurationToCustomerLayer)
	});
	QUnit.test("importVendorContent: Non-Existing", function(assert) {
		// setup
		var done = assert.async();
		this.oModelerProxy.readAllConfigurationsFromVendorLayer = function() {
			return jQuery.Deferred().resolve([]).promise();
		};
		function callbackImport() {
			assert.strictEqual(this.resolveUriStub.callCount, 2, "THEN the URI was resolved 2 times (check + importConfigurationFromVendorLayer)");
			done();
		}
		function registerApplicationCreatedOnServer() {}
		// act
		this.oModelerProxy.importVendorContent(null, null, null, callbackImport.bind(this), registerApplicationCreatedOnServer);
		this.callAjaxError({ status: 404 }); // Head
		this.callAjaxSuccess(); // Put (importConfigurationFromVendorLayer)
	});
});
