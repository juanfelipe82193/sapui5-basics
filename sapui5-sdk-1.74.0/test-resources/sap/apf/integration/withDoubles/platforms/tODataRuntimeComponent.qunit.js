sap.ui.define([
	'sap/apf/testhelper/helper',
	'sap/apf/integration/withDoubles/platforms/componentFactory',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/core/persistence',
	'sap/ui/thirdparty/sinon'
], function(helper, ComponentFactory, Metadata, Persistence, sinon) {
	'use strict';
	Metadata = Metadata || sap.apf.testhelper.doubles.Metadata;

	QUnit.module("Startup of Runtime with OData Proxy", {
		afterEach: function() {
			this.component.destroy();
		}
	});

	QUnit.test("WHEN the configuration id is injected in the URL parameters and OData Proxy shall be used per default", function(assert) {
		assert.expect(6);
		var done = assert.async();
		var oComponent;
		var sContainerId = "Container-odata";

		var oCompContainer;
		var spyCloudFoundryPersistence = sinon.spy(sap.apf.cloudFoundry, "AnalysisPathProxy");
		var spyCorePersistence = sinon.spy(Persistence, "constructor");

		function odataRequest(oInject, request, success) {
			var data;
			if (request.requestUri ===
				"/hugo-xs1/AnalyticalConfigurationQueryResults('" + ComponentFactory.configurationId + "')") {
				assert.ok(true, "THEN analytical configuration requested from expected service");
				data = {
					SerializedAnalyticalConfiguration: JSON.stringify(ComponentFactory.createConfiguration()),
					Application: ComponentFactory.applicationId
				};
				success(data);
				return;
			}
			if (request.requestUri === "/hugo-xs1/$batch") {
				assert.ok(true, "THEN texts requested from expected service");
				var texts = [{
					TextElement: "143EC63F05550175E10000000A445B6D",
					Language: "",
					TextElementType: "XTIT",
					TextElementDescription: "TITLE1",
					MaximumLength: 30,
					Application: ComponentFactory.applicationId,
					TranslationHint: "Hint",
					LastChangeUTCDateTime: "/Date(1412692222731)/"
				}, {
					TextElement: "243EC63F05550175E10000000A445B6D",
					Language: "",
					TextElementType: "XTIT",
					TextElementDescription: "TITLE2",
					MaximumLength: 30,
					Application: ComponentFactory.applicationId,
					TranslationHint: "Hint",
					LastChangeUTCDateTime: "/Date(1412692229733)/"
				}];
				data = {__batchResponses: [{data: {results: texts}}]};
				success(data);
			}
		}
		function SessionHandler() {
			this.getXsrfToken = function() {
				var deferred = jQuery.Deferred();
				deferred.resolve(ComponentFactory.applicationId);
				return deferred.promise();
			};
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
		function beforeCreateContent(api) {
			function onAfterStartApfCallback() {
				var steps = oComponent.getApi().getStepTemplates();
				assert.strictEqual(steps.length, 0, "THEN all steps of configuration have been loaded");
				var textFromConfig = oComponent.getApi().getTextNotHtmlEncoded("243EC63F05550175E10000000A445B6D");
				assert.strictEqual(textFromConfig, "TITLE2", "THEN text from configuration as expected");
				assert.strictEqual(spyCloudFoundryPersistence.callCount, 0, "THEN cloud foundry persistence for analysis path is NOT used");
				assert.strictEqual(spyCorePersistence.callCount, 1, "THEN core persistence for analysis path is used");
				spyCloudFoundryPersistence.restore();
				spyCorePersistence.restore();
				done();
			}
			api.setCallbackAfterApfStartup(onAfterStartApfCallback);
		}

		helper.injectURLParameters({
			'sap-apf-configuration-id': ComponentFactory.configurationId
		});
		// GIVEN a Component with activateLrep === true, and a stubbed ajax which simulates LREP
		// prove that a specific configuration is returned, proven by counting a specific number of steps.
		// prove its text pool is returned by proving by a specific text key resolution.
		oComponent = ComponentFactory.createRuntimeComponent("sap.apf.test.odata", beforeCreateContent, {
			functions: {
				odataRequest: odataRequest
			},
			constructors: {
				SessionHandler: SessionHandler,
				Metadata: Metadata,
				UiInstance : UiInstanceStub
			}
		}, undefined);
		oCompContainer = new sap.ui.core.ComponentContainer(sContainerId, {component: oComponent});
		oCompContainer.setComponent(oComponent);
		this.component = oComponent;
		oCompContainer.placeAt("placeForComponent");
	});
});