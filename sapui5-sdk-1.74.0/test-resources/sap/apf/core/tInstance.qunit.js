sap.ui.define('sap.apf.core.tInstance', [
		'sap/apf/testhelper/doubles/sessionHandlerStubbedAjax',
		'sap/apf/testhelper/helper',
		'sap/apf/utils/utils',
		'sap/apf/testhelper/config/sampleConfiguration',
		'sap/apf/cloudFoundry/analysisPathProxy',
		'sap/apf/core/messageHandler',
		'sap/apf/core/messageObject',
		'sap/apf/core/instance',
		'sap/apf/core/path',
		'sap/apf/core/persistence',
		'sap/apf/core/metadataFactory',
		'sap/apf/core/textResourceHandler',
		'sap/apf/core/configurationFactory',
		'sap/apf/core/sessionHandler',
		'sap/apf/core/resourcePathHandler',
		'sap/apf/core/utils/annotationHandler',
		'sap/apf/core/utils/filter',
		'sap/apf/utils/startParameter',
		'sap/apf/cloudFoundry/ajaxHandler',
		'sap/ui/thirdparty/sinon'
	],
	function(SessionHandlerStubbedAjax, helper, utilsUtils, sampleConfiguration, AnalysisPathProxy,
			 MessageHandler, MessageObject, Instance, Path, Persistence,
			 MetadataFactory, TextResourceHandler, ConfigurationFactory, SessionHandler, ResourcePathHandler,
			 AnnotationHandler, Filter, StartParameter, AjaxHandler,
			 sinon) {
		'use strict';

		/*BEGIN_COMPATIBILITY*/
		MetadataFactory = MetadataFactory || sap.apf.core.MetadataFactory;
		TextResourceHandler = TextResourceHandler || sap.apf.core.TextResourceHandler;
		ConfigurationFactory = ConfigurationFactory || sap.apf.core.ConfigurationFactory;
		SessionHandler = SessionHandler || sap.apf.core.SessionHandler;
		ResourcePathHandler = ResourcePathHandler || sap.apf.core.ResourcePathHandler;
		/*END_COMPATIBILITY*/

	function createManifests () {
		var manifest;
		jQuery.ajax({
			url : "../testhelper/comp/manifest.json",
			dataType : "json",
			success : function(oData) {
				manifest = oData;
			},
			error : function(oJqXHR, sStatus, sError) {
				manifest = {};
			},
			async : false
		});
		var baseManifest;
		jQuery.ajax({
			url : "../../../../resources/sap/apf/base/manifest.json",
			dataType : "json",
			success : function(oData) {
				baseManifest = oData;
			},
			error : function(oJqXHR, sStatus, sError) {
				baseManifest = {};
			},
			async : false
		});
		return {
			manifest : manifest,
			baseManifest : baseManifest
		};
	}

	QUnit.module('Core API and Injection', {
		beforeEach: function(){
			this.spies = {};
		},
		afterEach: function(){
			var that = this;
			Object.keys(this.spies).forEach(function(member){
				that.spies[member].restore();
			});
		}
	});

	QUnit.test('MessageObject is properly created', function(assert) {
		var oMessageHandler = new MessageHandler();
		var oInstance = new Instance.constructor({
			instances: {
				messageHandler : oMessageHandler,
				startParameter : new StartParameter()
			},
			corePromise : new jQuery.Deferred()
		});
		var oMessageObject = oInstance.createMessageObject({
			code : "5021"
		});
		assert.equal(oMessageObject.getCode(), "5021", "MessageObject properly created");
	});
	QUnit.test('Core objects instantiated properly', function(assert) {
		var that = this;
		var spyAnnotationHandler = sinon.spy(AnnotationHandler, "constructor");
		this.inject = {
			instances: {
				startParameter : new StartParameter()
			},
			constructors: {
				MessageHandler : MessageHandler,
				MetadataFactory: MetadataFactory,
				TextResourceHandler: TextResourceHandler,
				ConfigurationFactory: ConfigurationFactory,
				SessionHandler: SessionHandler,
				ResourcePathHandler: ResourcePathHandler,
				Persistence: Persistence.constructor,
				Path: Path.constructor
			},
			corePromise : new jQuery.Deferred()
		};
		Object.keys(this.inject.constructors).forEach(function(member){
			sinon.spy(that.inject.constructors, member);
		});
		this.inject.instances.messageHandler = new this.inject.constructors.MessageHandler();
		// Act
		this.oInstance = new Instance.constructor(this.inject);
		// Check
		assert.ok(this.inject.constructors.MessageHandler.calledOnce, "MessageHandler constructor called exactly once");
		assert.ok(this.inject.constructors.MetadataFactory.calledOnce, "MetadataFactory constructor called exactly once");
		assert.ok(this.inject.constructors.TextResourceHandler.calledOnce, "TextResourceHandler constructor called exactly once");
		assert.ok(this.inject.constructors.ConfigurationFactory.calledOnce, "ConfigurationFactory constructor called exactly once");
		assert.ok(this.inject.constructors.Path.calledOnce, "Path constructor called exactly once");
		assert.ok(this.inject.constructors.SessionHandler.calledOnce, "SessionHandler constructor called exactly once");
		assert.ok(this.inject.constructors.ResourcePathHandler.calledOnce, "ResourcePathHandler constructor called exactly once");
		assert.ok(this.inject.constructors.Persistence.calledOnce, "Persistence constructor called exactly once");
		assert.ok(spyAnnotationHandler.calledOnce, "AnnotationHandler called exactly once");
		var call = spyAnnotationHandler.getCall(0).args;
		assert.ok(call[0].functions.getSapSystem, "THEN getSapSystem function was injected");
		assert.ok(call[0].functions.getComponentNameFromManifest, "THEN getComponentNameFromManifest was injected");
		assert.ok(call[0].functions.getODataPath, "THEN getODataPath function was injected");
		assert.ok(call[0].functions.getBaseURLOfComponent, "THEN getBaseURLOfComponent function was injected");
		assert.ok(call[0].functions.addRelativeToAbsoluteURL, "THEN function addRelativeToAbsoluteURL was injected");
		assert.ok(call[0].instances.fileExists, "THEN fileExists was injected");
		
		AnnotationHandler.constructor.restore();
	});
	QUnit.test('WHEN ajax is injected', function(assert) {
		var myAjax = function(config) {
			assert.notOk(config.messageHandler, "THEN the message handler is not mixed into the ajax configuration");
			assert.notOk(config.functions.getSapSystem, "THEN getSapSystem is not mixed into the ajax configuration");
			return utilsUtils.createPromise("GreetingsFromMyAjax");
		};
		var messageHandler = new MessageHandler();
		var instance = new Instance.constructor({
			functions : {
				ajax : myAjax
			},
			instances: {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			corePromise : new jQuery.Deferred()
		});
		instance.ajax({
			success : function(result) {
				assert.equal(result, "GreetingsFromMyAjax",
						"THEN injected AJAX is used instead of native AJAX");
			},
			error : function() {
			}
		});
	});

	QUnit.test('WHEN ajax AND resource path handler is injected', function(assert) {

		var myAjax = function(config) {
			assert.equal(config.url, "/path/to/resource", "Injected Ajax has been called");
			return utilsUtils.createPromise();
		};
		var myResourcePathHandler = function(inject) {
			assert.ok(true, inject.instances.fileExists.check("/path/to/resource"), "THEN file exists");
		};
		var messageHandler = new MessageHandler();
		new Instance.constructor({
			functions: { ajax : myAjax },
			instances: {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			constructors: {
				ResourcePathHandler : myResourcePathHandler
			},
			corePromise : new jQuery.Deferred()
		});
	});
	QUnit.test('WHEN sap-system is set', function(assert) {
		var myAjax = function(config) {
			assert.equal(config.url, "/path/to/resource;o=myERP", "THEN getSapSystem has been used by the core.ajax" );
			return utilsUtils.createPromise("GreetingsFromMyAjax");
		};
		var startParameter = new StartParameter();
		startParameter.getSapSystem = function() { return "myERP"; };
		var messageHandler = new MessageHandler();
		var instance = new Instance.constructor({
			functions : {
				ajax : myAjax
			},
			instances: {
				messageHandler : messageHandler,
				startParameter : startParameter
			},
			corePromise : new jQuery.Deferred()
		});
		instance.ajax({
			url : "/path/to/resource",
			success : function(result) {
			},
			error : function() {
			}
		});
	});
	QUnit.test('WHEN session handler constructor is injected', function(assert) {
		var done = assert.async();
		var mySessionHandler = function() {
			this.getXsrfToken = function() {
				return utilsUtils.createPromise("token");
			};
		};
		var messageHandler = new MessageHandler();
		var instance = new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			constructors : {
				SessionHandler : mySessionHandler
			},
			corePromise : new jQuery.Deferred()
		});

		instance.getXsrfToken("/path/of/no/interest").done(function(xsrfToken){
			assert.equal(xsrfToken, "token", "THEN the token is returned from injected Session Handler");
			done();
		});
	});
	QUnit.test("WHEN FileExists constructor is injected", function(assert){
		var myFileExists = function(inject) {
			assert.ok(inject.functions.getSapSystem, "THEN getSapSystem is injected");
		};
		var messageHandler = new MessageHandler();
		new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			constructors : {
				FileExists : myFileExists
			},
			corePromise : new jQuery.Deferred()
		});  
	});
	QUnit.test('WHEN resource path handler constructor is injected', function(assert) {

		var myResourcePathHandler = function(inject) {
			assert.ok(true, "THEN injected constructor for resource path handler is used");
			assert.ok(typeof inject.functions.checkForTimeout === 'function', "THEN checkForTimeout function is injected");
			assert.ok(typeof inject.functions.isUsingCloudFoundryProxy === 'function', "THEN isUsingCloudFoundryProxy function is injected");
			assert.ok(inject.instances.messageHandler, "THEN message handler is injected");
			assert.ok(inject.instances.coreApi, "THEN core api is injected");
			assert.equal(new inject.constructors.ProxyForAnalyticalConfiguration().type, "ProxyStub", "THEN expected proxy has been injected");
		};
		var messageHandler = new MessageHandler();
		var ProxyStub = function() {
			this.type = "ProxyStub";
		};
		new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			constructors : {
				ResourcePathHandler : myResourcePathHandler,
				ProxyForAnalyticalConfiguration: ProxyStub
			},
			corePromise : new jQuery.Deferred()
		});
	});

	QUnit.test('WHEN configuration factory constructor is injected into core instance', function(assert){
		assert.expect(3);
		var myConfigurationFactory = function(inject) {
			assert.ok(true, "THEN injected constructor for resource path handler is used");
			assert.ok(inject.instances.messageHandler, "THEN message handler is injected");
			assert.ok(inject.instances.coreApi, "THEN core api is injected");
		};
		new Instance.constructor({
			instances : {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			},
			constructors : {
				ConfigurationFactory : myConfigurationFactory
			},
			corePromise : new jQuery.Deferred()
		});
	});
	QUnit.test('WHEN function checkForTimeOut is injected into core instance', function(assert) {

		var myCheckForTimeOut = function() {
			return "myCheckForTimeOut";
		};
		var myResourcePathHandler = function(inject) {
			assert.equal(inject.functions.checkForTimeout(), "myCheckForTimeOut", "THEN injected checkForTimeout function is injected into resource path handler");
		};
		var messageHandler = new MessageHandler();
		new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			functions : {
				checkForTimeout : myCheckForTimeOut
			},
			constructors : {
				ResourcePathHandler : myResourcePathHandler
			},
			corePromise : new jQuery.Deferred()
		});

	});
	
	QUnit.test('WHEN metadata constructor is injected', function(assert) {

		var expectedProps = [ "prop1", "prop2"];
		var myMetadata = function() {
			this.getAllProperties = function() {
				return expectedProps;
			};
			this.isInitialized = function(){
				return jQuery.Deferred().resolve(this);
			};
		};
		var messageHandler = new MessageHandler();
		var instance = new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			constructors: {
				Metadata : myMetadata
			},
			corePromise : new jQuery.Deferred()
		});
		instance.getMetadata("/some/path").done(function(metadata){
			assert.deepEqual(metadata.getAllProperties(), expectedProps, "THEN the properties are returned from injected metadata");
		});
	});
	QUnit.test('WHEN metadata factory is created', function(assert){
		var messageHandler = new MessageHandler();

		var MetadataFactorySpy = function(inject) {

			assert.ok(inject.constructors.EntityTypeMetadata, "THEN proper injection of constructor of entity type metadata");
			assert.ok(inject.constructors.Hashtable, "THEN proper injection of constructor of hashtable");
			assert.ok(inject.constructors.Metadata, "THEN proper injection of constructor of metadata");
			assert.ok(inject.constructors.MetadataFacade, "THEN proper injection of constructor of metadata facade");
			assert.ok(inject.constructors.MetadataProperty, "THEN proper injection of constructor of metadata property");
			assert.ok(inject.constructors.ODataModel, "THEN proper injection of constructor of odata model");
			assert.ok(inject.instances.messageHandler, "THEN proper injection of instance of message handler");
			assert.ok(inject.instances.coreApi, "THEN proper injection of instance of core api");
			assert.ok(inject.instances.annotationHandler, "THEN proper injection of instance of annotation handler");
			assert.ok(inject.functions.getServiceDocuments, "THEN proper injection of function getServiceDocuments");
			assert.ok(inject.functions.getSapSystem, "THEN proper injection of function getSapSystem");

			this.getMetadataFacade = function() {
				return {};
			};
		};

		new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			constructors: {
				MetadataFactory : MetadataFactorySpy
			},
			corePromise : new jQuery.Deferred()
		});
	});
	QUnit.test('WHEN text resource handler constructor is injected', function(assert) {

		var expectedText = "expected Text";
		var myTextResourceHandler = function() {
			this.getTextNotHtmlEncoded = function() {
				return expectedText;
			};
			this.loadResourceModelAsPromise = function(){};
			this.getTextResourceModel = function(){
				return "resourceModel";
			};
		};
		var messageHandler = new MessageHandler();
		var instance = new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			constructors : {
				TextResourceHandler : myTextResourceHandler
			},
			corePromise : new jQuery.Deferred()
		});

		var text = instance.getTextNotHtmlEncoded("/some/path");
		assert.deepEqual(text, expectedText, "THEN the text is returned from injected text resource handler");
	});
	QUnit.test('WHEN odata request function is injected', function(assert) {

		var expectedResult = "expected Result";
		var myOdataRequest = function(oInject, oRequest, fnSuccess, fnError, oBatchHandler) {
				assert.ok(oInject.instances.datajs, "THEN datajs is injected");
				assert.ok(oInject.functions.getSapSystem, "THEN function getSapSystem is injected");
				return fnSuccess(expectedResult);
		};
		var messageHandler = new MessageHandler();
		var instance = new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			functions : {
				odataRequest : myOdataRequest
			},
			corePromise : new jQuery.Deferred()

		});
		function assertWrapperWasCalled(result) {
			assert.equal(result, expectedResult, "THEN the result is returned from injected odata request");
		}
		instance.odataRequest({}, assertWrapperWasCalled);
	});
	QUnit.test("WHEN Persistence is injected", function(assert) {
		var sapAppContent = "someValueForSapApp";
		var InjectedPersistence = function(inject) {
			assert.ok(typeof inject.functions.getComponentName  === "function", "THEN getComponentName is injected");
			assert.ok(inject.instances.coreApi instanceof Instance.constructor, "THEN core api is injected");
			assert.ok(inject.instances.messageHandler instanceof MessageHandler, "THEN messageHandler is injected");
			assert.strictEqual(inject.manifests.manifest["sap.app"], sapAppContent, "THEN manifest of component is injected");
			assert.notOk(inject.instances.ajaxHandler, "THEN ajax handler has been NOT injected");
		};
		var messageHandler = new MessageHandler();
		var ResourcePathHandlerStub = function(inject) {
		};
		new Instance.constructor({
				instances : {
					messageHandler : messageHandler,
					startParameter : new StartParameter()
				},
				constructors : {
					Persistence : InjectedPersistence,
					ResourcePathHandler : ResourcePathHandlerStub
				},
				functions: {
					getComponentName : function() { return "Comp1"; }
				},
				manifests: { manifest : { "sap.app" : sapAppContent}},
				corePromise : new jQuery.Deferred()
		});
	});
	QUnit.test("WHEN AjaxHandler is injected AND isUsingCloudFoundry is true", function(assert) {
		var sapAppContent = "someValueForSapApp";
		var InjectedAjaxHandler = function(inject) {
			assert.ok(inject.instances.messageHandler instanceof MessageHandler);
			assert.ok(typeof inject.functions.coreAjax === 'function', "THEN core ajax has been injected");
		};
		var InjectedPersistence = function(inject) {
			assert.ok(typeof inject.functions.getComponentName  === "function", "THEN getComponentName is injected");
			assert.ok(inject.instances.ajaxHandler instanceof InjectedAjaxHandler, "THEN ajax handler has been injected");
		};
		var messageHandler = new MessageHandler();
		var ResourcePathHandlerStub = function(inject) {
		};
		new Instance.constructor({
				instances : {
					messageHandler : messageHandler,
					startParameter : new StartParameter()
				},
				constructors : {
					Persistence : InjectedPersistence,
					AjaxHandler : InjectedAjaxHandler,
					ResourcePathHandler : ResourcePathHandlerStub
				},
				functions: {
					getComponentName : function() { return "Comp1"; },
					isUsingCloudFoundryProxy : function() {
						return true;
					}
				},
				manifests: { manifest : { "sap.app" : sapAppContent}},
				corePromise : new jQuery.Deferred()
		});
	});
	QUnit.test("WHEN Persistence is injected AND isUsingCloudFoundryProxy is true", function(assert) {
		var sampleManifest = {"sap.app" : "someValueForSapApp"};
		var InjectedPersistence = function(inject) {
			assert.ok(true, "THEN the injected persistence wins");
			assert.ok(inject.instances.messageHandler instanceof MessageHandler, "THEN messagehandler was injected");
			assert.ok(inject.instances.coreApi instanceof Instance.constructor, "THEN core api was injected");
			assert.deepEqual(inject.manifests.manifest, sampleManifest, "THEN manifest was injected");
			assert.ok(inject.instances.ajaxHandler instanceof AjaxHandler, "THEN ajax handler has been injected");
		};
		var messageHandler = new MessageHandler();
		var ResourcePathHandlerStub = function(inject) {
		};
		new Instance.constructor({
				instances : {
					messageHandler : messageHandler,
					startParameter : new StartParameter()
				},
				constructors : {
					Persistence : InjectedPersistence,
					ResourcePathHandler : ResourcePathHandlerStub
				},
				functions: {
					getComponentName : function() { return "Comp1"; },
					isUsingCloudFoundryProxy : function() {
						return true;
					}
				},
				manifests: { manifest : sampleManifest},
				corePromise : new jQuery.Deferred()
		});
	});
	QUnit.test("WHEN isUsingCloudFoundryProxy is injected", function(assert){
		var sampleManifest = {"sap.app" : "someValueForSapApp"};
		// to be able to stub the ctor it needs to be injected to the instance (this there is a reference)
		var spyAnalysisPathProxy = sinon.spy(sap.apf.cloudFoundry, "AnalysisPathProxy");
		this.spies.Persistence = Persistence.constructor;
		sinon.spy(this.spies, "Persistence");
		var ResourcePathHandlerStub = function(inject) {
		};
		new Instance.constructor({
				instances : {
					messageHandler : new MessageHandler(),
					startParameter : new StartParameter()
				},
				constructors : {
					ResourcePathHandler : ResourcePathHandlerStub
				},
				functions: {
					getComponentName : function() { return "Comp1"; },
					isUsingCloudFoundryProxy : function() {
						return true;
					}
				},
				manifests: { manifest : sampleManifest },
				corePromise : new jQuery.Deferred()
		});
		assert.strictEqual(spyAnalysisPathProxy.callCount, 1, "THEN cloud foundry analysis path proxy was created");
		assert.notOk(this.spies.Persistence.called, "THEN persistence proxy was NOT created");
		var usedInject = spyAnalysisPathProxy.getCall(0).args[0];
		assert.ok(usedInject.instances.messageHandler instanceof MessageHandler, "THEN messagehandler was injected");
		assert.ok(usedInject.instances.coreApi instanceof Instance.constructor, "THEN core api was injected");
		assert.ok(usedInject.instances.ajaxHandler instanceof AjaxHandler, "THEN ajax handler was injected");
		assert.deepEqual(usedInject.manifests.manifest, sampleManifest, "THEN manifest was injected");
		spyAnalysisPathProxy.restore();
	});
	QUnit.test('WHEN APF state serialization is injected', function(assert) {
		var wasCalled = false;
		function spyApfStateSerialization() {
			wasCalled = true;
			return jQuery.Deferred().resolve();
		}
		var instance = new Instance.constructor({
			instances : {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			},
			functions : {
				serializeApfState : spyApfStateSerialization
			},
			corePromise : new jQuery.Deferred()
		});
		instance.storeApfState();
		assert.strictEqual(wasCalled, true, "THEN the injected method is called during state backup");
	});
	QUnit.test('WHEN APF state deserialization is injected', function(assert) {
		var wasCalled = false;
		function spyApfStateDeserialization() {
			wasCalled = true;
			return jQuery.Deferred().resolve();
		}
		var instance = new Instance.constructor({
			instances : {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			},
			functions : {
				serializeApfState : function() {
					return jQuery.Deferred().resolve();
				},
				deserializeApfState : spyApfStateDeserialization
			},
			corePromise : new jQuery.Deferred()
		});
		instance.storeApfState();
		instance.restoreApfState();
		assert.strictEqual(wasCalled, true, "THEN the injected method is called during restore of APF state");
	});
	QUnit.test("checkAddStep - path.checkAddStep properly called", function(assert){
		var oInstance = new Instance.constructor({
			instances: {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			},
			constructors: {
				Path: function(){
					this.checkAddStep = function(id){
						if(id === "id"){
							return jQuery.Deferred().resolve(false, {type: "messageObject"});
						}
					};
				}
			},
			corePromise : new jQuery.Deferred()
		});
		oInstance.checkAddStep("id").done(function(canAddStep, messageObject){
			assert.strictEqual(canAddStep, false, "Path.checkAddStep properly called and boolean returned");
			assert.strictEqual(messageObject.type, "messageObject", "Path.checkAddStep properly called and messageObject returned");
		});
	});
	QUnit.test("getPathFilterInformation - path.getPathFilterInformation properly called", function(assert){
		var oInstance = new Instance.constructor({
			instances: {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			},
			constructors: {
				Path: function(){
					this.getFilterInformation = function(){
						return jQuery.Deferred().resolve("pathFilterInformation");
					};
				}
			},
			corePromise : new jQuery.Deferred()
		});
		oInstance.getPathFilterInformation().done(function(data){
			assert.strictEqual(data, "pathFilterInformation", "getPathFilterInformation properly called and result returned");
		});
	});
	QUnit.module('Rudimentary apf core API functionality', {});
	QUnit.test('getStartParameterFacade()', function(assert) {
		var componentDouble = {
			getComponentData : function() {
				var returnValue = {
					startupParameters : {
						'sap-apf-configuration-id' : [ 'configId' ]
					}
				};
				return returnValue;
			}
		};
		var startParameter = new StartParameter(componentDouble);
		var messageHandler = new MessageHandler();
		var core = new Instance.constructor({
			instances : {
				startParameter : startParameter,
				messageHandler : messageHandler
			},
			corePromise : new jQuery.Deferred()
		});
		assert.equal(core.getStartParameterFacade().getAnalyticalConfigurationId().configurationId, componentDouble.getComponentData().startupParameters['sap-apf-configuration-id'][0], "Correct Id returned");
	});
	QUnit.module("core API: destroy", {
		beforeEach : function(assert) {
			var that = this;
			sinon.stub(Path, "constructor", function() {
				this.destroy = function() {
					that.pathDestroyWasCalled = true;
				};
			});
			var componentDouble = {
				getComponentData : function() {
					var returnValue = {
						startupParameters : {
							'sap-apf-configuration-id' : [ 'configId' ]
						}
					};
					return returnValue;
				}
			};
			var startParameter = new StartParameter(componentDouble);
			var messageHandler = new MessageHandler();
			var inject = {
				instances : {
					startParameter : startParameter,
					messageHandler : messageHandler
				},
				corePromise : new jQuery.Deferred()
			};
			this.core = new Instance.constructor(inject);
		},
		afterEach : function(assert) {
			Path.constructor.restore();
		}
	});
	QUnit.test("WHEN coreAPI destroy is called", function(assert) {
		this.core.destroy();
		assert.ok(this.pathDestroyWasCalled, "THEN destroy method of path is called"); // in core instance
	});
	QUnit.module("core API - handling the manifests", {
		beforeEach : function(assert) {
			this.originalAjax = jQuery.ajax;
			helper.adjustResourcePaths(this.originalAjax);
		},
		afterEach : function() {
			jQuery.ajax = this.originalAjax;
		}
	});
	QUnit.test("WHEN manifests are injected", function(assert) {
		var spyResourcePathHandler = sinon.spy(sap.apf.core, "ResourcePathHandler");
		var spyConfigurationFactory = sinon.spy(sap.apf.core, "ConfigurationFactory");
		var oMessageHandler = new MessageHandler();
		var manifests = createManifests();
		var startParameter = new StartParameter({});
		this.oInstance = new Instance.constructor({
			manifests : manifests,
			instances : {
				startParameter : startParameter,
				messageHandler : oMessageHandler
			},
			corePromise : new jQuery.Deferred()
		});
		assert.deepEqual(spyResourcePathHandler.getCall(0).args[0].manifests, manifests, "THEN manifests are injected into ressource path handler");
		assert.deepEqual(spyConfigurationFactory.getCall(0).args[0].manifests, manifests, "THEN manifests are injected into configuration factory");
		assert.equal(spyConfigurationFactory.getCall(0).args[0].manifests.manifest["sap.apf"].activateFilterReduction, true, "THEN filter reduction switch in manifest is recognized");
		sap.apf.core.ConfigurationFactory.restore();
		sap.apf.core.ResourcePathHandler.restore();
	});
	QUnit.module("core API - instantiation of resource path handler", {
		beforeEach : function(assert) {
			this.originalAjax = jQuery.ajax;
			helper.adjustResourcePaths(this.originalAjax);
		},
		afterEach : function() {
			jQuery.ajax = this.originalAjax;
		}
	});
	QUnit.test('WHEN resource path handler is created', function(assert) {
		var myResourcePathHandler = function(inject) {
			assert.deepEqual(inject.manifests, createManifests(), "THEN manifests have been injected");
			assert.ok(inject.instances.fileExists, "THEN fileExists is injected");
			assert.ok(inject.instances.messageHandler, "THEN messageHandler is injected");
			assert.ok(inject.instances.coreApi, "THEN coreApi is injected");
		};
		var messageHandler = new MessageHandler();
		new Instance.constructor({
			instances : {
				messageHandler : messageHandler,
				startParameter : new StartParameter()
			},
			constructors : {
				ResourcePathHandler : myResourcePathHandler
			},
			functions : {
				getComponentName : function() { return "comp1"; }
			},
			corePromise : new jQuery.Deferred(),
			manifests: createManifests()
		});

	});
	QUnit.module("WHEN open path is called", {
		beforeEach : function(assert) {
				var that = this;
				that.expectedPath1 = { path : { AnalysisPathName : "TheJustOpenedPath1" }};
				that.expectedPath2 = { path : { AnalysisPathName : "TheJustOpenedPath2" }};
				that.stubPersistence = sinon.stub(Persistence, "constructor", function(){
					this.openPath = function(sPathId, localCallback, nActiveStep) {
						var oResponse;
						if (sPathId == "idOfOpenedPath1") {
							oResponse = that.expectedPath1;
						} else {
							oResponse = that.expectedPath2;
						}
						localCallback(oResponse, {}, undefined);
					};
				});
			},
			afterEach : function(assert) {
				Persistence.constructor.restore();
			}
	});
	QUnit.test("WHEN no error occurred", function(assert) {
		assert.expect(6);
		var that = this;
		var oMessageHandler = new MessageHandler();
		var oInstance = new Instance.constructor({
			instances : {
				messageHandler : oMessageHandler,
				startParameter : new StartParameter(),
				sessionHandler : new SessionHandlerStubbedAjax({ instances : { messageHandler : oMessageHandler }})
			},
			corePromise : new jQuery.Deferred()
		});
		function callback1(path, metadata, messageObject) {
			assert.equal(messageObject, undefined, "THEN no error occurred");
			assert.deepEqual(path, that.expectedPath1, "THEN the correct path object is returned");
			assert.equal(oInstance.getPathName(), "TheJustOpenedPath1", "THEN the correct Path name is set" );
		}
		function callback2(path, metadata, messageObject) {
			assert.equal(messageObject, undefined, "THEN no error occurred");
			assert.deepEqual(path, that.expectedPath2, "THEN the correct path object is returned");
			assert.equal(oInstance.getPathName(), "TheJustOpenedPath2", "THEN the correct Path name is set" );
		}
		oInstance.openPath("idOfOpenedPath1", callback1);
		oInstance.resetPath();
		oInstance.openPath("idOfOpenedPath2", callback2);
	});
	QUnit.module("WHEN open path is called AND error occurrs", {
		beforeEach : function(assert) {
			this.stubPersistence = sinon.stub(Persistence, "constructor", function(){
					this.openPath = function(sPathId, localCallback, nActiveStep) {
						var messageObject = new MessageObject({ code : "5003"});
						localCallback(undefined, {}, messageObject);
					};
			});
		},
		afterEach : function(assert) {
			this.stubPersistence.restore();
		}
	});
	QUnit.test("WHEN no error occurred", function(assert) {
		var oMessageHandler = new MessageHandler();
		var oInstance = new Instance.constructor({
			instances : {
				messageHandler : oMessageHandler,
				startParameter : new StartParameter(),
				sessionHandler : new SessionHandlerStubbedAjax({ instances : { messageHandler : oMessageHandler }})
			},
			corePromise : new jQuery.Deferred()
		});
		function callback1(path, metadata, messageObject) {
			assert.equal(messageObject.getCode(), "5003", "THEN error is returned correctly");
			assert.equal(path, undefined, "THEN the correct path object is returned");
			assert.equal(oInstance.getPathName(), "", "THEN no Path name is set" );
		}
		oInstance.openPath("idOfOpenedPath1", callback1);
	});
	QUnit.module("SmartFilterBar", {
		beforeEach : function() {
			this.coreInstance = new Instance.constructor({
				instances: {
					messageHandler : new MessageHandler(),
					startParameter : new StartParameter()
				},
				corePromise : new jQuery.Deferred()
			});
		}
	});
	QUnit.test("Get configuration if existing", function(assert){
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration('addSmartFilterBar'));
		this.coreInstance.getSmartFilterBarConfigurationAsPromise().done(function(config){
			var expectedConfig = {
					entityType: "testEntityType",
					id: "SmartFilterBar-1",
					service: "/test/service",
					type: "smartFilterBar"
			};
			assert.deepEqual(config, expectedConfig, "SmartFilterBar configuration retrieved");
		});
	});
	QUnit.test("Get configuration if NOT existing", function(assert){
		assert.expect(1); 
		var done = assert.async();
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration());
		this.coreInstance.getSmartFilterBarConfigurationAsPromise().done(function(smartFilterBarConfiguration){
			assert.strictEqual(smartFilterBarConfiguration, undefined, "No SmartFilterBar configured");
			done();
		});
	});
	QUnit.test('Get instance if no configuration exists', function (assert) {
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration());
		
		this.coreInstance.getSmartFilterBarAsPromise().done(function(smartFilterBar){
			assert.strictEqual(smartFilterBar, null, "Null indicates that an instance will never be created due to missing configuration");
		});
	});
	QUnit.test('Get instance if configuration exists but no instance is registered', function (assert) {
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration('addSmartFilterBar'));
		assert.ok(this.coreInstance.getSmartFilterBarAsPromise().done, "Promise returned");
	});
	QUnit.test('Get instance if configuration exists and instance is registered', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var oSFB = {
				type: "SmartFilterBar"
		};
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration('addSmartFilterBar'));
		this.coreInstance.getSmartFilterBarAsPromise().done(function(oSFB){
			assert.equal(oSFB.type, "SmartFilterBar", "Instance is set and returned");
			done();
		});
		setTimeout(function(){
			this.coreInstance.registerSmartFilterBarInstance(oSFB);
		}.bind(this), 1);
	});
	QUnit.test("Serialize without SFB instance", function(assert){
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration());
		assert.equal(this.coreInstance.serialize().smartFilterBar, undefined, "No SFB filter information in serializable object");
	});
	QUnit.test("Serialize", function(assert){
		assert.expect(2);
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration('addSmartFilterBar'));
		var oSFB = {
			type: "SmartFilterBar",
			fetchVariant: function(){
				assert.ok(true, "fetchVariant called");
				return { filters: "<InsertFilterHere>"};
			}
		};
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
		assert.deepEqual(this.coreInstance.serialize().smartFilterBar, {filters: "<InsertFilterHere>"},"SFB filter information assigned to the right property of serializable object");
	});
	QUnit.test("Deserialize with SFB instance and without serialized property", function(assert){
		assert.expect(1);
		var serializedObject = {
			path: {
				indicesOfActiveSteps: [],
				steps: []
			}
		};
		var oSFB = {
				type: "SmartFilterBar",
				applyVariant: function(){
					assert.ok(false, "applyVariant called, though not needed");
				},
				fireFilterChange: function(){
					assert.ok(false, "FilterChange event fired shouldn't be fired");
				},
				clearVariantSelection: function(){
					assert.ok(false, "Variant name shouldn't be cleared");
				}
			};
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
		this.coreInstance.deserialize(serializedObject);
		assert.ok(true, "Only assertion");
	});
	QUnit.test("Deserialize without SFB instance and with serialized property", function(assert){
		assert.expect(1);
		var serializedObject = {
				smartFilterBar: {filters: "<InsertFilterHere>"},
				path: {
					indicesOfActiveSteps: [],
					steps: []
				}
		};
		this.coreInstance.deserialize(serializedObject);
		assert.ok(true, "Only assertion");
	});
	QUnit.test("Deserialize", function(assert){
		assert.expect(3);
		var serializedObject = {
				smartFilterBar: {filters: "<InsertFilterHere>"},
				path: {
					indicesOfActiveSteps: [],
					steps: []
				}
		};
		var oSFB = {
				type: "SmartFilterBar",
				applyVariant: function(variant){
					assert.deepEqual(variant,  {filters: "<InsertFilterHere>"});
				},
				fireFilterChange: function(){
					assert.ok(true, "FilterChange event fired");
				},
				clearVariantSelection: function(){
					assert.ok(true, "Variant name clear called");
				}
		};
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
		this.coreInstance.deserialize(serializedObject);
	});
	QUnit.test("Serialize & Deserialize", function(assert){
		assert.expect(3);
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration('addSmartFilterBar'));
		var oSFB = {
				type: "SmartFilterBar",
				fetchVariant: function(){
					return {filters: "<InsertFilterHere>"};
				},
				applyVariant: function(variant){
					assert.deepEqual(variant,  {filters: "<InsertFilterHere>"});
				},
				fireFilterChange: function(){
					assert.ok(true, "FilterChange event fired");
				},
				clearVariantSelection: function(){
					assert.ok(true, "Variant name clear called");
				}
		};
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
		var serializedObject = this.coreInstance.serialize();
		this.coreInstance.deserialize(serializedObject);
	});
	QUnit.test("Deserialize after backward navigation", function(assert){
		assert.expect(3);
		var serializedObject = {
				smartFilterBar: {filters: "<InsertFilterHere>"},
				path: {
					indicesOfActiveSteps: [],
					steps: []
				}
		};
		var oSFB = {
				type: "SmartFilterBar",
				applyVariant: function(variant){
					assert.deepEqual(variant,  {filters: "<InsertFilterHere>"});
				},
				fireFilterChange: function(){
					assert.ok(true, "FilterChange event fired");
				},
				clearVariantSelection: function(){
					assert.ok(true, "Variant name clear called");
				}
		};
		this.coreInstance.deserialize(serializedObject);
		this.coreInstance.registerSmartFilterBarInstance(oSFB);
	});
	QUnit.test('Retrieve persistence key', function (assert) {
		this.coreInstance.loadAnalyticalConfiguration(sampleConfiguration.getSampleConfiguration('addSmartFilterBar'));
		assert.equal(this.coreInstance.getSmartFilterBarPersistenceKey('SmartFilterBar-1'), "APF67890SmartFilterBar-1", 'Correct persistence key for given SFB id returned');
	});
	QUnit.module("SmartFilterBar default filter values", {
		beforeEach : function() {
			var that = this;
			this.messageHandler = new MessageHandler();
			this.controlConfigurationStub = sinon.stub(sap.ui.comp.smartfilterbar, 'ControlConfiguration', function(controlConfig){
				return controlConfig;
			});
			this.selectOptionStub = sinon.stub(sap.ui.comp.smartfilterbar, 'SelectOption', function(selectOption){
				return selectOption;
			});
			this.coreInstance = new Instance.constructor({
				instances : {
					messageHandler : this.messageHandler,
					startParameter : new StartParameter()
				},
				functions : {
					getCombinedContext : function(){
						return jQuery.Deferred().resolve(that.externalContext);
					}	
				},
				corePromise : new jQuery.Deferred()
			});
		}, 
		afterEach : function() {
			this.selectOptionStub.restore();
			this.controlConfigurationStub.restore();
		}
	});
	QUnit.test('Empty external context', function (assert) {
		assert.expect(1);
		var done = assert.async();
		this.externalContext = new Filter(this.messageHandler);
		this.coreInstance.getSmartFilterbarDefaultFilterValues().done(function(oControlConfig){
			assert.deepEqual(oControlConfig, [], 'Empty array returned');
			done();
		});
	});
	QUnit.test('External context with simple filter', function (assert) {
		assert.expect(1);
		var done = assert.async();
		this.externalContext = new Filter(this.messageHandler, 'A', 'EQ', '1');
		this.coreInstance.getSmartFilterbarDefaultFilterValues().done(function(oControlConfig){
			var expectedControlConfig = [{
				key : 'A', 
				visibleInAdvancedArea : true,
				defaultFilterValues : [{
					sign: 'I',
					low: '1',
					operator: 'EQ', 
					high : undefined
				}]
			}];
			assert.deepEqual(oControlConfig, expectedControlConfig, 'Array with one control configuration returned');
			done();
		});
	});
	QUnit.test('External context with advanced filter', function (assert) {
		assert.expect(1);
		var done = assert.async();
		var filterA = new Filter(this.messageHandler, 'A', 'EQ', '1');
		filterA.addOr('A', 'EQ', '2');
		var filterB = new Filter(this.messageHandler, 'B', 'BT', '1', '5');
		this.externalContext = new Filter(this.messageHandler).addAnd(filterA).addAnd(filterB);
		
		this.coreInstance.getSmartFilterbarDefaultFilterValues().done(function(oControlConfig){
			var expectedControlConfig = [{
				key : 'A',
				visibleInAdvancedArea : true,
				defaultFilterValues : [{
					sign: 'I',
					low: '1',
					operator: 'EQ', 
					high : undefined
				}, 
				{
					sign: 'I',
					low: '2',
					operator: 'EQ', 
					high : undefined
				}]
			}, 
			{
				key : 'B',
				visibleInAdvancedArea : true,
				defaultFilterValues : [{
					sign: 'I',
					low: '1',
					operator: 'BT', 
					high : '5'
				}]
			}
			];
			assert.deepEqual(oControlConfig, expectedControlConfig, 'Correct control configuration resolved in promise');
			done();
		});
	});
	QUnit.module("SmartFilterBar filter and external context", { 
		beforeEach : function() {
			var that = this;
			this.messageHandler = new MessageHandler();
			this.coreInstance = new Instance.constructor({
				instances : { messageHandler : this.messageHandler,
					startParameter : new StartParameter()
				},
				functions : {
					getCombinedContext : function(){
						 return jQuery.Deferred().resolve(that.externalContext);
					}
				},
				corePromise : new jQuery.Deferred()
			});
			this.smartFilterBar = {
				getFilters : function(){
					return that.smartFilterBarFilters;
				} 
			};
			this.coreInstance.getSmartFilterBarAsPromise = function(){
				var deferred = jQuery.Deferred();
				if (that.smartFilterBar) {
					deferred.resolve(that.smartFilterBar);

				} else {
					deferred.resolve(null);
				}
				return deferred.promise();

			};
		}
	});
	QUnit.test('No SmartFilterBar', function (assert) {
		this.smartFilterBar = null;
		this.externalContext = new Filter(this.messageHandler, 'A', 'EQ', '1');
		this.coreInstance.getReducedCombinedContext().done(function(filter){
			assert.ok(filter.isEqual(this.externalContext), 'Unchanged filter from external context expected');
		}.bind(this));
	});
	QUnit.test('External context not applicable to SmartFilterBar', function (assert) {
		this.smartFilterBarFilters = [];
		this.externalContext = new Filter(this.messageHandler, 'A', 'EQ', '1');
		this.coreInstance.getReducedCombinedContext().done(function(filter){
			assert.ok(filter.isEqual(this.externalContext), 'Unchanged filter from external context expected');
		}.bind(this));
	});
	QUnit.test('External context fully applicable to SmartFilterBar', function (assert) {
		this.smartFilterBarFilters = [{
			aFilters : [{
				aFilters : [{
					oValue1 : '1', 
					oValue2 : '', 
					sOperator : 'EQ', 
					sPath : 'A'
				}],
				bAnd : false
			}, 
			{
				aFilters : [{
					oValue1 : '2', 
					oValue2 : '', 
					sOperator : 'EQ', 
					sPath : 'B'
				}],
				bAnd : false
			}], 
			bAnd : true
		}];
		this.externalContext = new Filter(this.messageHandler, 'A', 'EQ', '1').addAnd('B', 'EQ', '2');
		this.coreInstance.getReducedCombinedContext().done(function(filter){
			assert.ok(filter.isEmpty(), 'All filters applied in SmartFilterBar which results in empty filter in reduced combined context');
		});
	});
	QUnit.test('External context partially applicable to SmartFilterBar', function (assert) {
		this.smartFilterBarFilters = [{
			aFilters : [{
				aFilters : [{
					oValue1 : '1', 
					oValue2 : '', 
					sOperator : 'EQ', 
					sPath : 'A'
				}],
				bAnd : false
			}, 
			{
				aFilters : [{
					oValue1 : '2', 
					oValue2 : '', 
					sOperator : 'EQ', 
					sPath : 'B'
				}],
				bAnd : false
			}], 
			bAnd : true
		}];
		this.externalContext = new Filter(this.messageHandler, 'A', 'EQ', '1').addAnd('B', 'EQ', '2').addAnd('C', 'EQ', '3');
		this.coreInstance.getReducedCombinedContext().done(function(filter){
			assert.equal(filter.toUrlParam(), '(C%20eq%20%273%27)', 'Reduced combined context contains correct filter');
		});
	});
	
	QUnit.module("AnnotationHandler", {
		beforeEach : function() {
			this.coreInstance = new Instance.constructor({
				instances : {
					messageHandler : new MessageHandler(),
					startParameter : new StartParameter()
				},
				constructors : {
					AnnotationHandler : function(){
						this.getAnnotationsForService = function(serviceRoot){
						return serviceRoot;
						};
					}
				},
				corePromise : new jQuery.Deferred()
			});
		}
	});
	QUnit.test('getAnnotationsForService', function (assert) {
		assert.equal(this.coreInstance.getAnnotationsForService('myServiceRoot'), 'myServiceRoot' , 'getAnnotationsForService call forwarded to AnnotationHandler');
	});

	QUnit.module("Function getGenericExit");
	QUnit.test("WHEN exit function is defined", function(assert) {
		var exit = function() {};
		var instance = new Instance.constructor({
			exits : {
				testExit : exit
			},
			instances: {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			}
		});
		assert.strictEqual(instance.getGenericExit("testExit"), exit, "THEN getGenericExit returns the exit function");
	});
	QUnit.test("WHEN exit function is not defined", function(assert) {
		var instance = new Instance.constructor({
			exits : {},
			instances: {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			}
		});
		assert.strictEqual(instance.getGenericExit("testExit"), undefined, "THEN getGenericExit returns undefined");
	});
	QUnit.test("WHEN exits is not defined", function(assert) {
		var instance = new Instance.constructor({
			instances: {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			}
		});
		assert.strictEqual(instance.getGenericExit("testExit"), undefined, "THEN getGenericExit returns undefined");
	});

	QUnit.module("Function getComponent: Given a core instance and its injection object");
	QUnit.test("WHEN component is defined by injection from Component", function(assert) {
		var ComponentStub = {
			getMetadata: function() {
				return {
					getManifest: function() {}
				};
			}
		};
		var instance = new Instance.constructor({
			instances: {
				component: ComponentStub,
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			}
		});
		assert.strictEqual(instance.getComponent(), ComponentStub, "THEN getComponent returns the (injected) component.");
	});
	QUnit.test("WHEN component is not defined by injection from Component", function(assert) {
		var instance = new Instance.constructor({
			instances: {
				messageHandler : new MessageHandler(),
				startParameter : new StartParameter()
			}
		});
		assert.strictEqual(instance.getComponent(), undefined, "THEN getComponent returns undefined.");
	});
});
