sap.ui.define([
	'sap/apf/testhelper/config/samplePropertyFiles',
	'sap/apf/testhelper/helper',
	'sap/apf/integration/withDoubles/platforms/componentFactory',
	'sap/apf/core/persistence',
	'sap/ui/thirdparty/sinon'
	],
	function(testTextFiles, helper, ComponentFactory, Persistence, sinon) {
		'use strict';

		QUnit.module("Cloud Foundry - Startup of Runtime", {
			afterEach : function() {
				this.component.destroy();
			}
		});

		QUnit.test("WHEN lrep is activated via manifest", function(assert) {
			assert.expect(5);
			var done = assert.async();
			var sContainerId = "Cont-lrep";
			var oComponent;
			var componentData = {};
			helper.injectURLParameters({
				'sap-apf-configuration-id': ComponentFactory.applicationId + "." + ComponentFactory.configurationId
			});
			componentData.startupParameters = jQuery.sap.getUriParameters().mParams;

			var originalAjax = jQuery.ajax;
			var redefinedAjax = function(settings, options) {
				var dummyXhr = {
					getResponseHeader: function() {
						return "nothing";
					}
				};
				var deferred;
				if (typeof settings === 'string' && settings.search("/sap/bc/lrep/content/sap/apf/dt/" + ComponentFactory.applicationId + "/text.properties") > -1) {
					var data = testTextFiles.getPropertyFile("dev", ComponentFactory.applicationId);
					assert.ok(true, "THEN proxy requested configuration and texts under URL, that is unique for cloud foundry");
					deferred = jQuery.Deferred();
					deferred.resolve(data, "OK", dummyXhr);
					return deferred.promise();
				} else if (typeof settings === 'string' && settings.search(ComponentFactory.configurationId + ".apfconfiguration") > -1) {
					deferred = jQuery.Deferred();
					var config = JSON.stringify(ComponentFactory.createConfiguration());
					deferred.resolve(config, "OK", dummyXhr);
					return deferred.promise();
				}
				return originalAjax(settings, options);
			};
			var stub = sinon.stub(jQuery, "ajax", redefinedAjax);
			var spyCloudFoundryPersistence = sinon.spy(sap.apf.cloudFoundry, "AnalysisPathProxy");
			var spyCorePersistence = sinon.spy(Persistence, "constructor");
			function beforeCreateContent(api) {
				function onAfterStartApfCallback() {
					var steps = oComponent.getApi().getStepTemplates();
					assert.strictEqual(steps.length, 0, "THEN all steps of configuration have been loaded");
					var text = oComponent.getApi().getTextNotHtmlEncoded("14395631877028739882768245665019");
					assert.strictEqual(text, "Category 1.1.2", "THEN text from loaded text file loaded");
					assert.strictEqual(spyCloudFoundryPersistence.callCount, 0, "THEN cloud foundry persistence for analysis path is NOT used");
					assert.strictEqual(spyCorePersistence.callCount, 1, "THEN core persistence for analysis path is used");
					stub.restore();
					spyCloudFoundryPersistence.restore();
					spyCorePersistence.restore();
					done();
				}

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
					constructors : { UiInstance : UiInstanceStub }
			};
			// GIVEN a Component with activateLrep === true, and a stubbed ajax which simulates LREP
			// prove that a specific configuration is returned, proven by counting a specific number of steps.
			// prove its text pool is returned by proving by a specific text key resolution.
			oComponent = ComponentFactory.createRuntimeComponent("sap.apf.test.lrep", beforeCreateContent, inject, componentData, {
				"sap.apf": {
					activateLrep: true
				}
			});

			this.component = oComponent;
			var oCompContainer = new sap.ui.core.ComponentContainer(sContainerId, {
				component: oComponent
			});
			oCompContainer.setComponent(oComponent);
			oCompContainer.placeAt("placeForComponent");
		});
	});