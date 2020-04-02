sap.ui.define([
	'sap/apf/testhelper/config/samplePropertyFiles',
	'sap/apf/testhelper/helper',
	'sap/apf/integration/withDoubles/platforms/componentFactory',
	'sap/apf/core/persistence'
], function(testTextFiles, helper, ComponentFactory, Persistence) {
	'use strict';

	var getAnalysisPathList = function() {
		return [{
			analysisPath : "x1",
			analysisPathName : "Name1",
			lastChangeUtcDateTime : "yesterday",
			structuredAnalysisPath : JSON.stringify({ "dummy" : "path"})
		},{
			analysisPath : "x2",
			analysisPathName : "Name2",
			lastChangeUtcDateTime : "longAgo",
			structuredAnalysisPath : JSON.stringify({ "dummy" : "path2"})
		}];
	};

	QUnit.module("Cloud Foundry - Startup of Runtime", {
		beforeEach: function() {
			helper.injectURLParameters({
				'sap-apf-configuration-id': ComponentFactory.configurationId
			});
		},
		afterEach : function() {
			this.component.destroy();
		}
	});

	QUnit.test("WHEN isUsingCloudFoundry returns true and analysis paths are read", function (assert) {
		assert.expect(3);
		var done = assert.async();

		var sContainerId = "Cont-cf1";
		var oComponent;
		var originalAjax = jQuery.ajax;
		var redefinedAjax = function(settings, options) {
			var deferred = jQuery.Deferred();
			var xmlHttpRequest = {
					getResponseHeader : function(arg1) {
						if (arg1 === "x-csrf-token") {
							return "1234456";	
						}
						return null;
					}
			};
			if (settings.url.search("/hugo-cloud-foundry") > -1) {
				var analyticalConfiguration = {};
				analyticalConfiguration.serializedAnalyticalConfiguration = JSON.stringify(ComponentFactory.createConfiguration());
				analyticalConfiguration.analyticalConfigurationName = "configForTesting";
				var textFiles = {
					inEnglish: testTextFiles.getPropertyFile("en", ComponentFactory.applicationId),
					inDevelopmentLanguage: testTextFiles.getPropertyFile("dev", ComponentFactory.applicationId)
				};
				var data = {
					analyticalConfiguration: analyticalConfiguration,
					textFiles: textFiles
				};
				setTimeout(function() {
					deferred.resolve(data, "OK", xmlHttpRequest);
				}, 1);
				return deferred.promise();
			} else if (settings.url.search("/hugo-egon-analysisPaths") > -1) {
				setTimeout(function() {
					deferred.resolve({"analysisPaths": getAnalysisPathList()}, "OK", xmlHttpRequest);
				}, 1);
				return deferred.promise();
			}
			return originalAjax(settings, options);
		};
		var stub = sinon.stub(jQuery, "ajax", redefinedAjax);
		var spyCloudFoundryPersistence = sinon.spy(sap.apf.cloudFoundry, "AnalysisPathProxy");
		var spyCorePersistence = sinon.spy(Persistence, "constructor");

		function assertPathsAreRead(response, metadata, messageObject) {
			var expectedResult = {
				paths : [{
					AnalysisPath : "x1",
					AnalysisPathName : "Name1",
					LastChangeUTCDateTime : "yesterday",
					StructuredAnalysisPath : { "dummy" : "path"}
				},{
					AnalysisPath : "x2",
					AnalysisPathName : "Name2",
					LastChangeUTCDateTime : "longAgo",
					StructuredAnalysisPath : { "dummy" : "path2"}
				}],
				status : "successful"
			};
			assert.deepEqual(response, expectedResult, "THEN paths with expected structure");
			assert.strictEqual(messageObject, undefined, "THEN no error");
			assert.ok(jQuery.isEmptyObject(metadata), "THEN metadata as expected");
			stub.restore();
			spyCloudFoundryPersistence.restore();
			spyCorePersistence.restore();
			done();
		}
		function onAfterStartApfCallback() {
			oComponent.getApi().readPaths(assertPathsAreRead);
		}
		function beforeCreateContent(api) {
			api.setCallbackAfterApfStartup(onAfterStartApfCallback);
		}
		function UiInstanceStub() {
			this.createApplicationLayout = function() {
				return Promise.resolve();
			};
			this.handleStartup = function() {
				var deferred = jQuery.Deferred();
				deferred.resolve();
				return deferred.promise();
			};
		}
		var inject = {
			constructors : {
				UiInstance : UiInstanceStub
			},
			functions: {
				isUsingCloudFoundryProxy: function() {
					return true;
				}
			}
		};
		// GIVEN a Component with activateLrep === true, and a stubbed ajax which simulates LREP
		// prove that a specific configuration is returned, proven by counting a specific number of steps.
		// prove its text pool is returned by proving by a specific text key resolution.
		oComponent = ComponentFactory.createRuntimeComponent("sap.apf.test.cf", beforeCreateContent, inject, undefined);
		this.component = oComponent;
		var oCompContainer = new sap.ui.core.ComponentContainer(sContainerId, {
			component: oComponent
		});
		oCompContainer.setComponent(oComponent);
		oCompContainer.placeAt("placeForComponent");
	});

	QUnit.test("WHEN isUsingCloudFoundryProxy returns true in component functions inject", function(assert) {
		assert.expect(5);
		var done = assert.async();
		helper.injectURLParameters({
			'sap-apf-configuration-id': ComponentFactory.configurationId
		});
		var sContainerId = "Cont-cf";
		var oComponent;
		var originalAjax = jQuery.ajax;
		var redefinedAjax = function(settings, options) {
			var xmlHttpRequest = {
					getResponseHeader : function(arg1) {
						if (arg1 === "x-csrf-token") {
							return "1234456";	
						}
						return null;
					}
			};
			if (settings.url.search("/hugo-cloud-foundry") > -1) {
				var analyticalConfiguration = {};
				var deferred = jQuery.Deferred();
				analyticalConfiguration.serializedAnalyticalConfiguration = JSON.stringify(ComponentFactory.createConfiguration());
				analyticalConfiguration.analyticalConfigurationName = "configForTesting";
				var textFiles = {
					inEnglish: testTextFiles.getPropertyFile("en", ComponentFactory.applicationId),
					inDevelopmentLanguage: testTextFiles.getPropertyFile("dev", ComponentFactory.applicationId)
				};
				var data = {
					analyticalConfiguration: analyticalConfiguration,
					textFiles: textFiles
				};
				assert.ok(true, "THEN proxy requests configuration and texts under an URL, that is unique for cloud foundry");
				setTimeout(function() {
					deferred.resolve(data, "OK", xmlHttpRequest);
				}, 1);
				return deferred.promise();
			}
			return originalAjax(settings, options);
		};
		var stub = sinon.stub(jQuery, "ajax", redefinedAjax);
		var spyCloudFoundryPersistence = sinon.spy(sap.apf.cloudFoundry, "AnalysisPathProxy");
		var spyCorePersistence = sinon.spy(Persistence, "constructor");
		function onAfterStartApfCallback() {
			var steps = oComponent.getApi().getStepTemplates();
			assert.strictEqual(steps.length, 0, "THEN all steps of configuration have been loaded");
			var text = oComponent.getApi().getTextNotHtmlEncoded("14395631877028739882768245665019");
			assert.strictEqual(text, "En-Category 1.1.2", "THEN text from loaded text file loaded");
			assert.strictEqual(spyCloudFoundryPersistence.callCount, 1, "THEN cloud foundry persistence for analysis path is used");
			assert.strictEqual(spyCorePersistence.callCount, 0, "THEN core persistence for analysis path is NOT used");
			stub.restore();
			spyCloudFoundryPersistence.restore();
			spyCorePersistence.restore();
			done();
		}
		function beforeCreateContent(api) {
			api.setCallbackAfterApfStartup(onAfterStartApfCallback);
		}
		function UiInstanceStub() {
			this.createApplicationLayout = function() {
				return Promise.resolve();
			};
			this.handleStartup = function() {
				var deferred = jQuery.Deferred();
				deferred.resolve();
				return deferred.promise();
			};
		}
		var inject = {
				constructors : {
					UiInstance : UiInstanceStub
				},
				functions: {
					isUsingCloudFoundryProxy: function() {
						return true;
					}
				}
		};
		// GIVEN a Component with activateLrep === true, and a stubbed ajax which simulates LREP
		// prove that a specific configuration is returned, proven by counting a specific number of steps.
		// prove its text pool is returned by proving by a specific text key resolution.
		oComponent = ComponentFactory.createRuntimeComponent("sap.apf.test.cf", beforeCreateContent, inject, undefined);
		this.component = oComponent;
		var oCompContainer = new sap.ui.core.ComponentContainer(sContainerId, {
			component: oComponent
		});
		oCompContainer.setComponent(oComponent);
		oCompContainer.placeAt("placeForComponent");
	});
});