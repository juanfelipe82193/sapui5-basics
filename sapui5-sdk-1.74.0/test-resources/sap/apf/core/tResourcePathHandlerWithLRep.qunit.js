jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper/');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfCoreApi');
jQuery.sap.require('sap.apf.testhelper.interfaces.IfMessageHandler');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require('sap.apf.testhelper.mockServer.wrapper');
jQuery.sap.require('sap.apf.core.constants');
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.utils.startParameter");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.utils.fileExists");
sap.apf.testhelper.injectURLParameters({
	'sap-apf-configuration-id' : "543EC63F05550175E10000000A445B6D.643EC63F05550175E10000000A445B6D"
});
(function() {
	'use strict';
	sap.apf.testhelper.doubles.MessageHandlerXXX = function() {
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
	sap.apf.testhelper.doubles.MessageHandlerXXX.prototype = new sap.apf.testhelper.interfaces.IfMessageHandler();
	sap.apf.testhelper.doubles.MessageHandlerXXX.prototype.constructor = sap.apf.testhelper.doubles.MessageHandlerXXX;

	QUnit.module("Load application configuration directly where ActivateLRep is set", {
		beforeEach : function(assert) {
			var that = this;
			that.application = "543EC63F05550175E10000000A445B6D";
			that.configuration = "643EC63F05550175E10000000A445B6D";
			this.originalAjax = jQuery.ajax;
			sap.apf.testhelper.adjustResourcePaths(this.originalAjax);
			this.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().raiseOnCheck().spyPutMessage();
			this.LrepProxy = function() {
				this.readEntity = function(entitySetName, callback, inputParameters, selectList,  application, layer, directives) {
					var data = {};
					assert.equal(entitySetName, 'configuration', "THEN configuration is read FROM LREP");
					assert.equal(inputParameters[0].value, that.configuration, "THEN correct configuration is requested");
					
					assert.equal(application, that.application, "THEN correct application is supplied");
					data.Application = that.application;
					data.AnalyticalConfiguration = that.configuration;
					data.SerializedAnalyticalConfiguration = JSON.stringify(sap.apf.testhelper.config.getSampleConfiguration());
					data.AnalyticalConfigurationName = "configForTesting";
					assert.equal(directives.noMetadata, true, "THEN directive is set to avoid reading metadata");
					callback(data, {});
				};
				this.readCollection = function(entitySetName, callback, inputParameters, selectList, filter, async) {
					assert.equal(entitySetName, 'texts', "THEN texts are read FROM LREP");
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
		},
		afterEach : function(assert) {
			jQuery.ajax = this.originalAjax;
			if (this.originalLrepProxy) {
				sap.apf.core.LayeredRepositoryProxy = this.originalLrepProxy;
			}
		},
		loadManifestAndResourcePathHandler : function() {
			var manifest;
			var that = this;
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

			manifest["sap.apf"].activateLrep = true;
			this.originalLrepProxy = sap.apf.core.LayeredRepositoryProxy;
			sap.apf.core.LayeredRepositoryProxy = this.LrepProxy;
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

			this.coreApi = new sap.apf.testhelper.interfaces.IfCoreApi();
			this.coreApi.getXsrfToken = function() {
				return sap.apf.utils.createPromise('otto');
			};
			this.coreApi.getStartParameterFacade = function() {
				var startParameterFacade = new sap.apf.utils.StartParameter({}, {
					manifest : manifest,
					baseManifest : baseManifest
				});
				return startParameterFacade;
			};
			this.coreApi.getUriGenerator = function() {
				return sap.apf.core.utils.uriGenerator;
			};
			this.coreApi.loadMessageConfiguration = function(conf, bResetRegistry) {
				if (bResetRegistry) {
					that.loadedApfMessageConfiguration = conf;
				} else {
					that.loadedApplicationMessageConfiguration = conf;
				}
			};
			this.coreApi.registerTextWithKey = function(key, text) {};
			this.coreApi.getEntityTypeMetadata = function() {
				return {
					getPropertyMetadata : function() {
						return {};
					}
				};
			};
			this.coreApi.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
				var oInject = {
					instances: {
						datajs: OData
					}
				};
				sap.apf.core.odataRequestWrapper(oInject, oRequest, fnSuccess, fnError, oBatchHandler);
			};
			this.coreApi.loadAnalyticalConfiguration = function(object) {
				that.loadedAnalyticalConfiguration = object;
			};
			this.coreApi.loadTextElements = function(textElements) {
				that.loadedTextElements = textElements;
			};
			var SpyFileExists = function() {
				var fileExists = new sap.apf.core.utils.FileExists();
				that.headRequests = [];
				this.check = function (sUrl) {
					that.headRequests.push(sUrl);
					return fileExists.check(sUrl);
				};
			};
			this.corePromise = jQuery.Deferred();
			this.oInject = {
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.coreApi,
					fileExists : new SpyFileExists()
				},
				functions : {
					initTextResourceHandlerAsPromise : sap.apf.utils.createPromise,
					isUsingCloudFoundryProxy : function() { return false; }
				},
				manifests : {
					manifest : manifest,
					baseManifest : baseManifest
				},
				corePromise : this.corePromise
			};
			this.resPathHandler = new sap.apf.core.ResourcePathHandler(this.oInject);
		}
	});
	QUnit.test("WHEN activateLrep is set in Manifest", function(assert) {
		this.loadManifestAndResourcePathHandler();
		var done = assert.async();
		this.corePromise.done(function(){
			assert.equal(this.loadedAnalyticalConfiguration.steps.length, 10, "THEN analytical configuration with 10 steps has been loaded");
			assert.equal(this.loadedAnalyticalConfiguration.steps[0].id, "stepTemplate1", "THEN the first step has expected id");
			this.headRequests.forEach(function(url){
				assert.equal(url.search('/resources/sap/apf/resources/i18n/apfUi.properties'), -1, "no head request on apfUi.properties");
				assert.equal(url.search('/resources/config/sampleConfiguration.json'), -1, "no head request on sample configuration");
			});
			done();
		}.bind(this));
		
	});
}());
