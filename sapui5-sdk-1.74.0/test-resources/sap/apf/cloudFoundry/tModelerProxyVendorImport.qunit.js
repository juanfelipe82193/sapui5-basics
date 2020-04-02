sap.ui.define([
		'sap/apf/cloudFoundry/modelerProxy',
		'sap/apf/core/messageObject'
	],
	function(ModelerProxy, MessageObject) {
		'use strict';

	MessageObject = MessageObject || sap.apf.core.MessageObject;

	var jqXHR404 = {
			status : 404,
			statusText : "Not Found"
	};
	var jqXHR500 = {
			status : 500,
			statusText : "InternalServerError"
	};
	var DefaultMessageHandler = function() {
		this.check = function(condition) {
			if (!condition) {
				throw "bad";
			}
		};
		this.createMessageObject = function(config) {
			return new MessageObject(config);
		};
	};
	function getSampleConfigurationsFromVendorLayer() {
		return [{
				application: "appId1",
				applicationName: "app1",
				analyticalConfiguration: "confId1",
				analyticalConfigurationName: "conf1"
			}, {
				application: "appId2",
				applicationName: "app2",
				analyticalConfiguration: "confId2",
				analyticalConfigurationName: "conf2"
			},{
				application: "appId3",
				applicationName: "app3",
				analyticalConfiguration: "confId3",
				analyticalConfigurationName: "conf3"
			}];
	}
	function getSampleConfiguration() {
		return {
			steps: [],
			bindings : []
		};
	}
	var vendorContentUri = "/vendorContent";
	var vendorContentConfigurationUri = "/vcConfigurations";
	var readAllConfigurationsUrl = vendorContentConfigurationUri + "?$select=Application,ApplicationName,AnalyticalConfiguration,AnalyticalConfigurationName";
	var analyticalConfigurationsUri = "/sap/apf/design-time/customer-content/v1/AnalyticalConfigurations";
	var getDefaultManifests = function () {
		var manifest = {
			"sap.app": {
				dataSources: {
					"apf.designTime.customer.applications": {
						uri: "/hugo"
					},
					"apf.designTime.customer.analyticalConfigurations": {
						uri: analyticalConfigurationsUri
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
						uri: vendorContentUri
					},
					"apf.designTime.vendor.analyticalConfigurations": {
						uri: vendorContentConfigurationUri
					}
				}
			}
		};
		return {manifest: manifest};
	};
	function commonSetup(context) {
		var ajaxHandler = {
				send:  function(settings) {
					context.ajaxStub(settings);
				}
		};
		var inject = {
				instances : {
					ajaxHandler : ajaxHandler,
					messageHandler : new DefaultMessageHandler()
				},
				manifests : getDefaultManifests()
		};
		context.modelerProxy = new ModelerProxy.ModelerProxy({}, inject);
	}
	QUnit.module("M: readAllConfigurationsFromVendorLayer", {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test("WHEN readAllConfigurationsFromVendorLayer is called AND SUCCESS", function(assert){
		assert.expect(2);
		var done = assert.async();

		this.ajaxStub = function(settings) {
			assert.equal(settings.url, readAllConfigurationsUrl, "THEN url as expected");
			setTimeout(function() {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}, 1);
		};
		var expectedConfigs = [{ configurationText: "conf1", applicationText: "app1", value: "appId1.confId1" },
		                       { configurationText: "conf2", applicationText: "app2", value: "appId2.confId2" },
		                       { configurationText: "conf3", applicationText: "app3", "value": "appId3.confId3"}];

		this.modelerProxy.readAllConfigurationsFromVendorLayer().done(function(configs){
			assert.deepEqual(configs, expectedConfigs, "THEN configuration in expected format");
			done();
		});
	});

	QUnit.test("WHEN readAllConfigurationsFromVendorLayer is called AND SUCCESS AND configuration list is NULL", function(assert){
		assert.expect(2);
		var done = assert.async();

		this.ajaxStub = function(settings) {
			assert.equal(settings.url, readAllConfigurationsUrl, "THEN url as expected");
			setTimeout(function() {
				settings.success(null);
			}, 1);
		};

		this.modelerProxy.readAllConfigurationsFromVendorLayer().done(function(configs){
			assert.deepEqual(configs, [], "THEN configuration is empty array");
			done();
		});
	});
	QUnit.test("WHEN readAllConfigurationsFromVendorLayer is called AND ERROR", function(assert){
		assert.expect(4);
		var done = assert.async();

		this.ajaxStub = function(settings) {
			assert.equal(settings.url, readAllConfigurationsUrl);
			settings.error(jqXHR404);
		};

		this.modelerProxy.readAllConfigurationsFromVendorLayer().fail(function(messageObject){
			assert.strictEqual(messageObject.getCode(), "5231", "THEN message code as expected");
			assert.strictEqual(messageObject.getPrevious().getCode(), "5214", "THEN message code of technical message as expected");
			assert.deepEqual(messageObject.getPrevious().getParameters(), [404, "Not Found"], "THEN message code as expected");
			done();
		});
	});
	QUnit.module("M: importVendorContent", {
		beforeEach : function() {
			commonSetup(this);
		}
	});
	QUnit.test("WHEN importVendorContent is called AND configuration does NOT exist in customer layer AND success on copy", function(assert){
		assert.expect(7);
		this.ajaxStub = function(settings) {
			if (settings.url === analyticalConfigurationsUri + "/confId3") {
				assert.strictEqual(settings.type, "HEAD", "THEN head request");
				settings.error(jqXHR404);
			} else if (settings.url === vendorContentUri + "/confId3") {
				assert.strictEqual(settings.type, "PUT", "THEN PUT request");
				settings.success();
			} else if (settings.url === readAllConfigurationsUrl) {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}
		};
		function assertImportIsFine(configurationId, metadata, messageObject) {
			assert.strictEqual(configurationId, "confId3", "THEN configuration id was returned");
			assert.strictEqual(messageObject, undefined, "THEN no error");
			assert.ok(jQuery.isEmptyObject(metadata), "THEN metadata is returned as empty object");
		}
		function assertCallbackOverwriteNotCalled() {
			assert.ok(false, "SHALL not be called");
		}

		var registerApplicationCreatedOnServer = function (applicationId, applicationName){
				assert.strictEqual(applicationId, "appId3", "THEN applicationId was added");
				assert.strictEqual(applicationName, "app3", "THEN applicationName was added");
		};
		this.modelerProxy.importVendorContent("appId3", "confId3", assertCallbackOverwriteNotCalled, assertImportIsFine, registerApplicationCreatedOnServer);
	});
	QUnit.test("WHEN importVendorContent is called AND configuration does NOT exist in customer layer AND error other than 404", function(assert){
		assert.expect(4);
		this.ajaxStub = function(settings) {
			if (settings.url === analyticalConfigurationsUri + "/confId3") {
				assert.strictEqual(settings.type, "HEAD", "THEN head request");
				settings.error(jqXHR500);
			} else if (settings.url === vendorContentUri + "/confId3") {
				assert.strictEqual(settings.type, "PUT", "THEN PUT request");
				settings.success();
			} else if (settings.url === readAllConfigurationsUrl) {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}
		};
		function assertImportIsFine(configurationId, metadata, messageObject) {
			assert.strictEqual(messageObject.getCode(), "5214", "THEN error code as expected");
			assert.deepEqual(messageObject.getParameters(), [ 500, "InternalServerError"], "THEN error parameters as expected");
			assert.ok(jQuery.isEmptyObject(metadata), "THEN metadata is returned as empty object");
		}
		function assertCallbackOverwriteNotCalled() {
			assert.ok(false, "SHALL not be called");
		}

		var registerApplicationCreatedOnServer = function (applicationId, applicationName){
					assert.ok(false, "THEN this function shall not be called");
		};
		this.modelerProxy.importVendorContent("appId3", "confId3", assertCallbackOverwriteNotCalled, assertImportIsFine, registerApplicationCreatedOnServer);
	});
	QUnit.test("WHEN importVendorContent is called AND configuration does NOT exist in customer layer AND error on copy", function(assert){
		assert.expect(5);
		this.ajaxStub = function(settings) {
			if (settings.url === analyticalConfigurationsUri + "/confId3") {
				assert.strictEqual(settings.type, "HEAD", "THEN head request");
				settings.error(jqXHR404);
			} else if (settings.url === vendorContentUri + "/confId3") {
				assert.strictEqual(settings.type, "PUT", "THEN PUT request");
				settings.error(jqXHR500);
			} else if (settings.url === readAllConfigurationsUrl) {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}
		};
		function assertImportShowsError(configurationId, metadata, messageObject) {
			assert.strictEqual(configurationId, undefined, "THEN NO configuration id was returned");
			assert.strictEqual(messageObject.getCode(), "5214", "THEN error code as expected");
			assert.deepEqual(messageObject.getParameters(), [ 500, "InternalServerError"], "THEN error parameters as expected");
		}
		function assertCallbackOverwriteNotCalled() {
			assert.ok(false, "SHALL not be called");
		}
		var applicationHandler = {
				getList : function() { return [ "appId1", "appId2"]; },
				addApplicationCreatedOnServer : function (applicationId, applicationName){
					assert.ok(false, "THEN this function shall not be called");
				}
		};
		this.modelerProxy.importVendorContent("appId3", "confId3", assertCallbackOverwriteNotCalled, assertImportShowsError, applicationHandler);
	});
	QUnit.test("WHEN importVendorContent is called AND configuration exists in customer layer AND confirmOverwrite AND success on copy", function(assert){
		assert.expect(7);
		this.ajaxStub = function(settings) {
			if (settings.url === analyticalConfigurationsUri + "/confId1") {
				assert.strictEqual(settings.type, "HEAD", "THEN head request");
				settings.success();
			} else if (settings.url === vendorContentUri + "/confId1") {
				assert.strictEqual(settings.type, "PUT", "THEN PUT request");
				settings.success();
			} else if (settings.url === readAllConfigurationsUrl) {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}
		};
		function assertImportIsFine(configurationId, metadata, messageObject) {
			assert.strictEqual(configurationId, "confId1", "THEN configuration id was returned");
			assert.strictEqual(messageObject, undefined, "THEN no error");
			assert.ok(jQuery.isEmptyObject(metadata), "THEN metadata is returned as empty object");
		}
		function callbackConfirmOverwriteTrue(confirmYes, confirmNo, configurationName) {
			assert.ok(true, "THEN the confirmCallbackOverwrite was called");
			assert.strictEqual(configurationName, "conf1", "THEN configuration name was extracted properly");
			confirmYes();
		}
		this.modelerProxy.importVendorContent("appId1", "confId1", callbackConfirmOverwriteTrue, assertImportIsFine);
	});
	QUnit.test("WHEN importVendorContent is called AND configuration exists in customer layer AND confirmOverwrite AND error on copy", function(assert){
		assert.expect(7);
		this.ajaxStub = function(settings) {
			var readAllConfigurationsUrl =  vendorContentConfigurationUri + "?$select=Application,ApplicationName,AnalyticalConfiguration,AnalyticalConfigurationName";

			if (settings.url === analyticalConfigurationsUri + "/confId1") {
				assert.strictEqual(settings.type, "HEAD", "THEN head request");
				settings.success();
			} else if (settings.url === vendorContentUri + "/confId1") {
				assert.strictEqual(settings.type, "PUT", "THEN PUT request");
				settings.error(jqXHR500);
			} else if (settings.url === readAllConfigurationsUrl) {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}
		};
		function assertImportShowsError(configurationId, metadata, messageObject) {
			assert.strictEqual(configurationId, undefined, "THEN NO configuration id was returned");
			assert.strictEqual(messageObject.getCode(), "5214", "THEN error code as expected");
			assert.deepEqual(messageObject.getParameters(), [ 500, "InternalServerError"], "THEN error parameters as expected");
		}
		function callbackConfirmOverwriteTrue(confirmYes, confirmNo, configurationName) {
			assert.ok(true, "THEN the confirmCallbackOverwrite was called");
			assert.strictEqual(configurationName, "conf1", "THEN configuration name was extracted properly");
			confirmYes();
		}
		this.modelerProxy.importVendorContent("appId1", "confId1", callbackConfirmOverwriteTrue, assertImportShowsError);
	});
	QUnit.test("WHEN importVendorContent is called AND configuration exists in customer layer AND confirmCreateNew AND success on copy/create", function(assert){
		assert.expect(9);
		this.ajaxStub = function(settings) {
			if (settings.url === analyticalConfigurationsUri + "/confId1") {
				assert.strictEqual(settings.type, "HEAD", "THEN head request");
				settings.success();
			} else if (settings.url === vendorContentConfigurationUri + "/confId1?$select=SerializedAnalyticalConfiguration") {
				settings.success({ serializedAnalyticalConfiguration : getSampleConfiguration()});
			} else if (settings.url === analyticalConfigurationsUri) {
				assert.strictEqual(settings.type, "POST", "THEN post expected");
				assert.strictEqual(settings.dataType, "json", "THEN dataType as expected");
				var expectedData = {
							analyticalConfigurationName : "newName",
							application : "appId1",
							serializedAnalyticalConfiguration : getSampleConfiguration()
				};
				settings.data = JSON.parse(settings.data);
				assert.deepEqual(settings.data, expectedData, "THEN data as expected");
				settings.success({ "analyticalConfiguration": "confId4"});
			} else if (settings.url === readAllConfigurationsUrl) {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}
		};
		function assertImportIsFine(configurationId, metadata, messageObject) {
			assert.strictEqual(configurationId, "confId4", "THEN newly created configuration id was returned");
			assert.strictEqual(messageObject, undefined, "THEN no error");
			assert.ok(jQuery.isEmptyObject(metadata), "THEN metadata is returned as empty object");
		}
		function callbackConfirmOverwriteFalse(confirmYes, confirmCreateNew, configurationName) {
			assert.ok(true, "THEN the confirmCallbackOverwrite was called");
			assert.strictEqual(configurationName, "conf1", "THEN configuration name was extracted properly");
			confirmCreateNew("newName");
		}
		this.modelerProxy.importVendorContent("appId1", "confId1", callbackConfirmOverwriteFalse, assertImportIsFine);
	});
	QUnit.test("WHEN importVendorContent is called AND configuration exists in customer layer AND confirmCreateNew AND error on read from vendor layer", function(assert){
		assert.expect(6);
		this.ajaxStub = function(settings) {
			if (settings.url === analyticalConfigurationsUri + "/confId1") {
				assert.strictEqual(settings.type, "HEAD", "THEN head request");
				settings.success();
			} else if (settings.url === vendorContentConfigurationUri + "/confId1?$select=SerializedAnalyticalConfiguration") {
				settings.error(jqXHR500);
			} else if (settings.url === readAllConfigurationsUrl) {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}
		};
		function assertImportShowsErrors(configurationId, metadata, messageObject) {
			assert.strictEqual(configurationId, undefined, "THEN NO configuration id was returned");
			assert.strictEqual(messageObject.getCode(), "5214", "THEN error code as expected");
			assert.deepEqual(messageObject.getParameters(), [ 500, "InternalServerError"], "THEN error parameters as expected");
		}
		function callbackConfirmOverwriteFalse(confirmYes, confirmCreateNew, configurationName) {
			assert.ok(true, "THEN the confirmCallbackOverwrite was called");
			assert.strictEqual(configurationName, "conf1", "THEN configuration name was extracted properly");
			confirmCreateNew("newName");
		}
		this.modelerProxy.importVendorContent("appId1", "confId1", callbackConfirmOverwriteFalse, assertImportShowsErrors);
	});
	QUnit.test("WHEN importVendorContent is called AND configuration exists in customer layer AND confirmCreateNew AND error on create in customer layer", function(assert){
		assert.expect(9);
		this.ajaxStub = function(settings) {
			if (settings.url === analyticalConfigurationsUri + "/confId1") {
				assert.strictEqual(settings.type, "HEAD", "THEN head request");
				settings.success();
			} else if (settings.url === vendorContentConfigurationUri + "/confId1?$select=SerializedAnalyticalConfiguration") {
				settings.success({ serializedAnalyticalConfiguration : getSampleConfiguration()});
			} else if (settings.url === analyticalConfigurationsUri) {
				assert.strictEqual(settings.type, "POST", "THEN post expected");
				assert.strictEqual(settings.dataType, "json", "THEN dataType as expected");
				var expectedData = {
							analyticalConfigurationName : "newName",
							application : "appId1",
							serializedAnalyticalConfiguration : getSampleConfiguration()
				};
				settings.data = JSON.parse(settings.data);
				assert.deepEqual(settings.data, expectedData, "THEN data as expected");
				settings.error(jqXHR500);
			} else if (settings.url === readAllConfigurationsUrl) {
				settings.success(getSampleConfigurationsFromVendorLayer());
			}
		};
		function assertImportShowsErrors(configurationId, metadata, messageObject) {
			assert.strictEqual(configurationId, undefined, "THEN NO configuration id was returned");
			assert.strictEqual(messageObject.getCode(), "5214", "THEN error code as expected");
			assert.deepEqual(messageObject.getParameters(), [500, "InternalServerError"], "THEN error parameters as expected");
		}
		function callbackConfirmOverwriteFalse(confirmYes, confirmCreateNew, configurationName) {
			assert.ok(true, "THEN the confirmCallbackOverwrite was called");
			assert.strictEqual(configurationName, "conf1", "THEN configuration name was extracted properly");
			confirmCreateNew("newName");
		}
		this.modelerProxy.importVendorContent("appId1", "confId1", callbackConfirmOverwriteFalse, assertImportShowsErrors);
	});
});