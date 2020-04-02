sap.ui.define([
	'sap/apf/testhelper/helper',
	'sap/apf/integration/withDoubles/platforms/componentFactory',
	'sap/apf/testhelper/doubles/metadata'
], function(helper, ComponentFactory, Metadata) {
	'use strict';
	jQuery.sap.require("sap.apf.testhelper.modelerComponent.Component");
	jQuery.sap.require('sap.ui.thirdparty.sinon');

	sap.apf.testhelper.injectURLParameters({
		"createContent" : "false"
	});
	function setup(context) {
		context.originalCoreInstance = sap.apf.modeler.core.Instance;
	}
	function teardown(context) {
		context.oComponentContainer.destroy();
		sap.apf.modeler.core.Instance = context.originalCoreInstance;
	}

	QUnit.module("Extension of Modeler Component", {
		beforeEach : function() {
			setup(this);
		},
		afterEach : function() {
			teardown(this);
		}
	});
	QUnit.test("WHEN sap.m.routing.Router is defined as router in manifest", function(assert) {
		assert.expect(2);
		var comp;
		var originalRouter = sap.m.routing.Router;
		sap.apf.modeler.core.Instance = function(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};

		};
		sap.m.routing.Router = function() {
			this.initialize = function() {
				assert.ok(true, "THEN correct router is initialized");
			};
			this.destroy = function() {
				assert.ok(true, "THEN router is finally destroyed");
			};
			this.getTargets = function() {
				return { destroy : function() {}};
			};
			this.getViews = function() {
				return { destroy : function() {}};
			};
		};
		comp = new sap.apf.testhelper.modelerComponent.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
		sap.m.routing.Router = originalRouter;
	});
	QUnit.test("WHEN a component extends the modeler component", function(assert) {
		assert.expect(3);
		var comp;
		sap.apf.modeler.core.Instance = function(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
			assert.strictEqual(typeof inject.functions.getNavigationTargetForGenericRuntime, 'function',
				"THEN function getNavigationTargetForGenericRuntime is injected");
			assert.strictEqual(typeof inject.functions.getCatalogServiceUri, 'function',
				"THEN function getCatalogServiceUri is injected");
			assert.ok(inject.instances.component, "THEN component is injected");
		};
		comp = new sap.apf.testhelper.modelerComponent.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
	});
	QUnit.test("WHEN a component extends the modeler component and in manifest activateLrep is set to true", function(assert) {
		assert.expect(3);
		var spyModelerProxy = sinon.spy(sap.apf.cloudFoundry.modelerProxy, "ModelerProxy");
		var spyOdataProxy = sinon.spy(sap.apf.core, "OdataProxy");
		var spyLayeredRepositoryProxy = sinon.spy(sap.apf.core, "LayeredRepositoryProxy");
		var comp = new sap.apf.testhelper.modelerComponent.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
		assert.strictEqual(spyModelerProxy.callCount, 0, "THEN Modeler Proxy was NOT created");
		assert.strictEqual(spyOdataProxy.callCount, 0, "THEN OData Proxy was NOT created");
		assert.strictEqual(spyLayeredRepositoryProxy.callCount, 1, "THEN Layered Repository Proxy was created");
		spyModelerProxy.restore();
		spyOdataProxy.restore();
		spyLayeredRepositoryProxy.restore();
	});
	QUnit.test("Injection of getRuntimeUrl", function(assert) {
		assert.expect(1);
		var that = this;
		var instance;
		sap.apf.modeler.core.Instance = function(persistenceConfiguration, inject) {
			that.originalCoreInstance.call(this, persistenceConfiguration, inject);
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
			instance = this;
		};
		var comp = new sap.apf.testhelper.modelerComponent.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
		instance.navigateToGenericRuntime("AppID", "ConfigID", function(URL){
			assert.strictEqual(URL, "testURL", "injected getRuntimeUrl called and used");
		});
	});
	QUnit.module("Injection of catalog service function into instance", {
		beforeEach : function() {
			setup(this);
		},
		afterEach : function() {
			teardown(this);
		}
	});
	QUnit.test("WHEN manifest provides catalog service", function(assert) {
		var comp;
		sap.ui.controller("sap.apf.modeler.ui.controller.applicationList", {
			onInit : function() {
			}
		});
		sap.apf.modeler.core.Instance = function(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
			assert.equal(inject.functions.getCatalogServiceUri(), "/sap/opu/odata/iwfnd/catalogservice;v=2", "THEN the injected function for catalog service provides the expected uri");
		};
		comp = new sap.apf.modeler.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
	});
	QUnit.test("WHEN manifest provides outbound navigation to runtime", function(assert) {
		var comp;
		sap.ui.controller("sap.apf.modeler.ui.controller.applicationList", {
			onInit : function() {
			}
		});
		sap.apf.modeler.core.Instance = function(persistenceConfiguration, inject) {
			this.getUriGenerator = function() {
				return new function() {
					this.getApfLocation = function() {
						return "PathOfNoInterest";
					};
				};
			};
			this.setCallbackForMessageHandling = function(fnCallback) {
			};
			var expectedNavigationTarget = {
				"action" : "executeAPFConfiguration",
				"semanticObject" : "FioriApplication"
			};
			assert.deepEqual(inject.functions.getNavigationTargetForGenericRuntime(), expectedNavigationTarget,
				"THEN the injected function for navigation targets returns the expected semantic object and action");
		};
		comp = new sap.apf.modeler.Component();
		this.oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		this.oComponentContainer.setComponent(comp);
		this.oComponentContainer.placeAt("componentContainer");
	});
	QUnit.module("Injection of function isUsingCloudFoundryProxy", {
		beforeEach : function() {
			this.spyModelerProxy = sinon.spy(sap.apf.cloudFoundry.modelerProxy, "ModelerProxy");
			this.spyOdataProxy = sinon.spy(sap.apf.core, "OdataProxy");
			this.spyLayeredRepositoryProxy = sinon.spy(sap.apf.core, "LayeredRepositoryProxy");
			this.manifestForModelerCloudFoundry = {
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
		},
		afterEach : function() {
			this.spyModelerProxy.restore();
			this.spyOdataProxy.restore();
			this.spyLayeredRepositoryProxy.restore();
		}
	});
	QUnit.test("WHEN function isUsingCloudFoundryProxy is injected", function(assert){
		assert.expect(3);
		var spyCoreInstance = sinon.spy(sap.apf.modeler.core, "Instance");

		function isUsingCloudFoundryProxy() {
			assert.ok(true, "THEN isUsingCloudFoundryProxy has been called");
			return true;
		}
		var oComponent = ComponentFactory.createModelerComponent(undefined, {
			functions: {
				isUsingCloudFoundryProxy : isUsingCloudFoundryProxy
			}
		}, undefined, this.manifestForModelerCloudFoundry, true);
		var oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		oComponentContainer.setComponent(oComponent);
		oComponentContainer.placeAt("componentContainer");
		assert.strictEqual(spyCoreInstance.callCount, 1, "THEN core instance is created");
		var coreInject = spyCoreInstance.getCall(0).args[1];
		assert.strictEqual(coreInject.functions.isUsingCloudFoundryProxy, isUsingCloudFoundryProxy,
				"THEN function for cloud foundry proxy activation is also injected into instance");
		spyCoreInstance.restore();
		oComponentContainer.destroy();
	});
	QUnit.test("Inject of isUsingCloudFoundryProxy function which returns true", function(assert){
		var oComponent;
		oComponent = ComponentFactory.createModelerComponent(undefined, {
			functions: {
				isUsingCloudFoundryProxy : function() { return true; }
			}
		}, undefined, this.manifestForModelerCloudFoundry, true);
		var oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		oComponentContainer.setComponent(oComponent);
		oComponentContainer.placeAt("componentContainer");
		assert.strictEqual(this.spyModelerProxy.callCount, 1, "THEN Modeler Proxy is created");
		assert.strictEqual(this.spyOdataProxy.callCount, 0, "THEN OData Proxy is NOT created");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 0, "THEN Layered Repository Proxy is NOT created");
		oComponentContainer.destroy();
	});
	QUnit.test("Inject of isUsingCloudFoundryProxy function which returns false", function(assert){
		var oComponent;
			oComponent = ComponentFactory.createModelerComponent(undefined, {
				functions: {
					isUsingCloudFoundryProxy : function() { return false; }
				}
			}, undefined, this.manifestForModelerCloudFoundry, true);
		var oComponentContainer = new sap.ui.core.ComponentContainer("TestApplication", {
			height : "100%"
		});
		oComponentContainer.setComponent(oComponent);
		oComponentContainer.placeAt("componentContainer");
		assert.strictEqual(this.spyModelerProxy.callCount, 0, "THEN Modeler Proxy is NOT created");
		assert.strictEqual(this.spyOdataProxy.callCount, 1, "THEN OData Proxy is created");
		assert.strictEqual(this.spyLayeredRepositoryProxy.callCount, 0, "THEN Layered Repository Proxy is NOT created");
		oComponentContainer.destroy();
	});
});