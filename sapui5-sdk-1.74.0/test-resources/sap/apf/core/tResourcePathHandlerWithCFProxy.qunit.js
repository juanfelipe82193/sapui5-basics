jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require("sap.apf.core.utils.checkForTimeout");
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require("sap.apf.core.utils.fileExists");
jQuery.sap.require("sap.apf.utils.utils");
(function() {
	'use strict';
	sap.apf.testhelper.injectURLParameters({
		'sap-apf-configuration-id' : "643EC63F05550175E10000000A445B6D"
	});
	var MessageHandler = function() {
		this.setup = function() {
			if (this.check.restore) {
				this.check.restore();
			}
			if (this.putMessage.restore) {
				this.putMessage.restore();
			}
			if (this.createMessageObject.restore) {
				this.createMessageObject.restore();
			}
			sinon.stub(this, "check", function(booleExpr, sMessage) {
				if (!booleExpr) {
					throw new Error(sMessage);
				}
				return true;
			});
			sinon.stub(this, "putMessage", function(oMessage) {
				throw new Error(oMessage);
			});
			sinon.stub(this, "createMessageObject", function(oConfig) {
				return new sap.apf.core.MessageObject(oConfig);
			});
		};
	};
	MessageHandler.prototype = new sap.apf.testhelper.interfaces.IfMessageHandler();
	MessageHandler.prototype.constructor = MessageHandler;

	function commonCoreSetup(oContext, inject) {
		oContext.oMessageHandler = new MessageHandler();

		oContext.corePromise = new jQuery.Deferred();
		oContext.oMessageHandler.setup();
		oContext.oMessageHandler.aaaDebug = "tResourcePathHandler";
		oContext.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
		oContext.coreApi.aaaDebug = "tResourcePathHandler";
		oContext.coreApi.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.coreApi.getStartParameterFacade = function() {
			return new sap.apf.utils.StartParameter();
		};
		oContext.coreApi.loadMessageConfiguration = function() {
		};
		oContext.coreApi.registerTextWithKey = function(guid, title) {
		};
		oContext.coreApi.ajax = function(context) {
			((inject && inject.functions &&  inject.functions.ajax) || jQuery.ajax)(context);
		};
		oContext.coreApi.loadAnalyticalConfiguration = function(object) {
			oContext.loadedAnalyticalConfiguration = object;
		};
		oContext.coreApi.loadTextElements = function(textElements) {
			oContext.loadedTextElements = textElements;
		};
	}
	QUnit.module("WHEN cloud foundry proxy for analytical configuration shall be used", {
		beforeEach: function(){
			commonCoreSetup(this);
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
			this.manifests = {
					manifest : manifest,
					baseManifest : baseManifest
			};
		},
		afterEach: function(){
		}	
	});
	QUnit.test("WHEN injected function isUsingCloudFoundryProxy returns true", function(assert){
		var done = assert.async();
		var that = this;
		that.application = "543EC63F05550175E10000000A445B6D";
		that.configuration = "643EC63F05550175E10000000A445B6D";
		var oInject = {
			instances: {
				messageHandler : this.oMessageHandler,
				coreApi : this.coreApi,
				fileExists :  new sap.apf.core.utils.FileExists()
			},
			functions : {
				isUsingCloudFoundryProxy : function() {
					return true;
				},
				checkForTimeout : sap.apf.core.utils.checkForTimeout,
				initTextResourceHandlerAsPromise : sap.apf.utils.createPromise
			},
			manifests : this.manifests,
			corePromise : this.corePromise
		};
		var savedProxy = sap.apf.cloudFoundry.RuntimeProxy;
		sap.apf.cloudFoundry.RuntimeProxy = function(serviceConfiguration, inject) {
			assert.deepEqual(inject.manifests, that.manifests, "THEN manifests are injected");
			this.readEntity = function(entitySetName, callback, inputParameters, selectList) {
				var data = {};
				assert.equal(entitySetName, 'configuration', "THEN configuration is read");
				assert.equal(inputParameters[0].value, that.configuration, "THEN correct configuration is requested");
				data.Application = that.application;
				data.AnalyticalConfiguration = that.configuration;
				data.SerializedAnalyticalConfiguration = JSON.stringify(sap.apf.testhelper.config.getSampleConfiguration());
				data.AnalyticalConfigurationName = "configForTesting";
				callback(data, {});
			};
			this.readCollection = function(entitySetName, callback, inputParameters, selectList, filter, async) {
				assert.equal(entitySetName, 'texts', "THEN texts are read");
				var aTerms = filter.getFilterTermsForProperty('Application');
				assert.equal(aTerms[0].getValue(), that.application, "THEN application is provided in the filter");
				//supply some texts
				var texts = [ {
					TextElement : "343EC63F05550175E10000000A445B6D",
					Language : "",
					TextElementType : "XLAB",
					TextElementDescription : "uniqueLabelText",
					MaximumLength : 15,
					Application : that.application,
					TranslationHint : "Hint",
					LastChangeUTCDateTime : "/Date(1412690202721)/"
				}, {
					TextElement : "143EC63F05550175E10000000A445B6D",
					Language : "",
					TextElementType : "XTIT",
					TextElementDescription : "TITLE1",
					MaximumLength : 30,
					Application : that.application,
					TranslationHint : "Hint",
					LastChangeUTCDateTime : "/Date(1412692222731)/"
				} ];
				setTimeout(function() {callback(texts, {}); },1);
			};
		};
		new sap.apf.core.ResourcePathHandler(oInject);
		 
		this.corePromise.done(function(){
			assert.equal(this.loadedAnalyticalConfiguration.steps.length, 10, "THEN analytical configuration with 10 steps has been loaded");
			assert.equal(this.loadedAnalyticalConfiguration.steps[0].id, "stepTemplate1", "THEN the first step has expected id");
			assert.equal(this.loadedTextElements.length, 2, "THEN two texts have been loaded");
			sap.apf.cloudFoundry.RuntimeProxy = savedProxy;
			done();
		}.bind(this));
	});
	QUnit.test("WHEN constructor for the proxy is injected", function(assert){
		var done = assert.async();
		var that = this;
		that.application = "543EC63F05550175E10000000A445B6D";
		that.configuration = "643EC63F05550175E10000000A445B6D";
		var Proxy = function(serviceConfiguration, inject) {
			assert.deepEqual(inject.manifests, that.manifests, "THEN manifests are injected");
			this.readEntity = function(entitySetName, callback, inputParameters, selectList) {
				var data = {};
				assert.equal(entitySetName, 'configuration', "THEN configuration is read");
				assert.equal(inputParameters[0].value, that.configuration, "THEN correct configuration is requested");
				data.Application = that.application;
				data.AnalyticalConfiguration = that.configuration;
				data.SerializedAnalyticalConfiguration = JSON.stringify(sap.apf.testhelper.config.getSampleConfiguration());
				data.AnalyticalConfigurationName = "configForTesting";
				callback(data, {});
			};
			this.readCollection = function(entitySetName, callback, inputParameters, selectList, filter, async) {
				assert.equal(entitySetName, 'texts', "THEN texts are read");
				var aTerms = filter.getFilterTermsForProperty('Application');
				assert.equal(aTerms[0].getValue(), that.application, "THEN application is provided in the filter");
				//supply some texts
				var texts = [ {
					TextElement : "343EC63F05550175E10000000A445B6D",
					Language : "",
					TextElementType : "XLAB",
					TextElementDescription : "uniqueLabelText",
					MaximumLength : 15,
					Application : that.application,
					TranslationHint : "Hint",
					LastChangeUTCDateTime : "/Date(1412690202721)/"
				}, {
					TextElement : "143EC63F05550175E10000000A445B6D",
					Language : "",
					TextElementType : "XTIT",
					TextElementDescription : "TITLE1",
					MaximumLength : 30,
					Application : that.application,
					TranslationHint : "Hint",
					LastChangeUTCDateTime : "/Date(1412692222731)/"
				} ];
				setTimeout(function() {callback(texts, {}); },1);
			};
		};
		var oInject = {
			instances: {
				messageHandler : this.oMessageHandler,
				coreApi : this.coreApi,
				fileExists :  new sap.apf.core.utils.FileExists()
			},
			functions : {
				isUsingCloudFoundryProxy : function() {
					return true;
				},
				checkForTimeout : sap.apf.core.utils.checkForTimeout,
				initTextResourceHandlerAsPromise : sap.apf.utils.createPromise
			},
			constructors : {
				ProxyForAnalyticalConfiguration : Proxy
			},
			manifests : this.manifests,
			corePromise : this.corePromise
		};
		new sap.apf.core.ResourcePathHandler(oInject);
		this.corePromise.done(function(){
			assert.equal(this.loadedAnalyticalConfiguration.steps.length, 10, "THEN analytical configuration with 10 steps has been loaded");
			assert.equal(this.loadedAnalyticalConfiguration.steps[0].id, "stepTemplate1", "THEN the first step has expected id");
			assert.equal(this.loadedTextElements.length, 2, "THEN two texts have been loaded");
			done();
		}.bind(this));
	});
}());
