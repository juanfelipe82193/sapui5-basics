/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global sap, jQuery, sinon */
(function() {
	'use strict';
	//noinspection JSLint
	jQuery.sap.require("sap.apf.utils.hashtable");
	jQuery.sap.require("sap.apf.core.textResourceHandler");
	jQuery.sap.require("sap.apf.testhelper.interfaces.IfResourcePathHandler");
	jQuery.sap.require("sap.apf.core.resourcePathHandler");
	jQuery.sap.require("sap.apf.core.messageObject");
	jQuery.sap.require("sap.apf.core.utils.uriGenerator"); // need apfLocation for ui5 resource loading by UI5
	jQuery.sap.declare('sap.apf.testhelper.stub.tPropertyStub');
	sap.apf.testhelper.stub.TestInstance = function(oMessageHandler) {
		var that = this;
		var oInject = {
			messageHandler : oMessageHandler,
			coreApi : that
		};
		var oResourcePathHandler;
		// Handler ------
		this.ajax = function(oSettings) {
			return sap.apf.core.ajax(oSettings);
		};
		/**
		 * @description Returns the instance of the UriGenerator. For internal core using only.
		 */
		this.getUriGenerator = function() {
			return sap.apf.core.utils.uriGenerator;
		};
		// Handler oMessageHandler ------
		this.getMessageHandler = function() {
			return oMessageHandler;
		};
		/**
		 * @see sap.apf#putMessage for api definition.
		 * @see sap.apf.core.MessageHandler#putMessage for implementation.
		 */
		this.putMessage = function(oMessage) {
			return oMessageHandler.putMessage(oMessage);
		};
		/**
		 * @see sap.apf.core.MessageHandler#check
		 */
		this.check = function(bExpression, sMessage, sCode) {
			return oMessageHandler.check(bExpression, sMessage, sCode);
		};
		/**
		 * @see sap.apf#createMessageObject for api definition.
		 * @see sap.apf.core.MessageHandler#createMessageObject
		 */
		this.createMessageObject = function(oConfig) {
			return oMessageHandler.createMessageObject(oConfig);
		};
		/**
		 * @description Message configurations are loaded.
		 * @see sap.apf.core.MessageHandler#loadConfig
		 */
		this.loadMessageConfiguration = function(aMessages, bResetRegistry) {
			oMessageHandler.loadConfig(aMessages, bResetRegistry);
		};
		/**
		 * @see sap.apf#activateOnErrorHandling for api definition.
		 * @see sap.apf.core.MessageHandler#activateOnErrorHandling
		 */
		this.activateOnErrorHandling = function(bOnOff) {
			oMessageHandler.activateOnErrorHandling(bOnOff);
		};
		/**
		 * @see sap.apf#setCallbackForMessageHandling for api definition.
		 * @see sap.apf.core.MessageHandler#setMessageCallback
		 */
		this.setCallbackForMessageHandling = function(fnCallback) {
			oMessageHandler.setMessageCallback(fnCallback);
		};
		/**
		 * @see sap.apf#setApplicationCallbackForMessageHandling for api definition.
		 * @see sap.apf.core.MessageHandler#setApplicationMessageCallback
		 */
		this.setApplicationCallbackForMessageHandling = function(fnCallback) {
			oMessageHandler.setApplicationMessageCallback(fnCallback);
		};
		/**
		 * @see sap.apf#getLogMessages for api definition.
		 * @see sap.apf.core.MessageHandler#getLogMessages
		 */
		this.getLogMessages = function() {
			return oMessageHandler.getLogMessages();
		};
		// Handler ------
		/**
		 * @see sap.apf#loadApplicationConfig for api definition.
		 * @see sap.apf.core.ResourcePathHandler#loadConfigFromFilePath
		 */
		this.loadApplicationConfig = function(sFilePath) {
			oResourcePathHandler.loadConfigFromFilePath(sFilePath);
		};
		/**
		 * @see sap.apf#getApplicationConfigProperties for api definition.
		 * @see sap.apf.core.ResourcePathHandler#getConfigurationProperties
		 */
		this.getApplicationConfigProperties = function() {
			return oResourcePathHandler.getConfigurationProperties();
		};
		/**
		 * @see sap.apf.core.ResourcePathHandler#getResourceLocation
		 */
		this.getResourceLocation = function(sResourceIdentifier) {
			return oResourcePathHandler.getResourceLocation(sResourceIdentifier);
		};
		/**
		 * @see sap.apf.core.ResourcePathHandler#getPersistenceConfiguration
		 */
		this.getPersistenceConfiguration = function() {
			return oResourcePathHandler.getPersistenceConfiguration();
		};
		/**
		 * @see sap.apf.core.ResourcePathHandler#getApplicationConfigurationURL
		 */
		this.getApplicationConfigurationURL = function() {
			return oResourcePathHandler.getApplicationConfigurationURL();
		};
		// Handler ------
		/**
		 * @see sap.apf.core.ConfigurationFactory#loadConfig
		 */
		this.loadAnalyticalConfiguration = function() {
			return {};
		};
		oResourcePathHandler = new sap.apf.core.ResourcePathHandler(oInject);
		//        oMessageHandler.setTextResourceHandler(oTextResourceHandler);
	};
	function commonSetupMessageHandlerAndCoreApiAsDoneManyTimes(oContext) {
		oContext.oMessageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
		oContext.oCoreApi = new sap.apf.testhelper.doubles.CoreApi({
			instances : {
				messageHandler : oContext.oMessageHandler
			}
		});
		oContext.oCoreApi.getUriGenerator = function() { //Extend the oApi
			return sap.apf.core.utils.uriGenerator;
		};
		oContext.oCoreApi.loadMessageConfiguration = function() {
			return false;
		};
		oContext.oCoreApi.getResourceLocation = function() {
			return "no location since it is stubbed by locally";
		};
		var oInject = {
			instances : {
				messageHandler : oContext.oMessageHandler,
				coreApi : oContext.oCoreApi
			}
		};
		oContext.oTextHandler = new sap.apf.core.TextResourceHandler(oInject); // <<<<< unit under test*/
	}
	function commonSetupResourcePathHandlerUsingAnInstance(oContext) {
		oContext.oMessageHandler = new sap.apf.core.MessageHandler();
		oContext.oCoreApi = new sap.apf.testhelper.stub.TestInstance(oContext.oMessageHandler);
		oContext.oInject = {
			instances : {
				messageHandler : oContext.oMessageHandler,
				coreApi : oContext.oCoreApi
			}
		};
		oContext.oTextHandler = new sap.apf.core.TextResourceHandler(oContext.oInject); // <<<<< unit under test*/
	}
	QUnit.module('TRH -- Stubbing', {
		beforeEach : function(assert) {
			commonSetupMessageHandlerAndCoreApiAsDoneManyTimes(this);
			sap.apf.testhelper.stub.textResourceHandlerStub.setup(this);
			this.checkSpy = sinon.spy(this.oMessageHandler, "check");
			this.putMessageSpy = sinon.spy(this.oMessageHandler, "putMessage");
		},
		afterEach : function(assert) {
			this.checkSpy.restore();
			this.putMessageSpy.restore();
			sap.apf.testhelper.stub.textResourceHandlerStub.teardown();
		}
	});
	QUnit.test("GIVEN core.TextRessourceHandler & its stub WHEN getMessage THEN stubbed text returned", function(assert) {
		this.stub.addText(200, "OK");
		var sEncodedText = this.oTextHandler.getMessageText(200);
		assert.equal(sEncodedText, "OK");
		assert.ok(this.stub.stubSapResources.called);
		assert.ok(!this.putMessageSpy.threw());
		assert.ok(!this.checkSpy.threw());
	});
	QUnit.test("GIVEN core.TextRessourceHandler & its stub WHEN getMessage twice THEN stubbed texts returned", function(assert) {
		this.stub.addText(200, "OK");
		this.stub.addText(201, "OK1");
		var sEncodedText = this.oTextHandler.getMessageText(200);
		var sEncodedText1 = this.oTextHandler.getMessageText(201);
		assert.equal(sEncodedText, "OK");
		assert.equal(sEncodedText1, "OK1");
		assert.ok(this.stub.stubSapResources.called);
		assert.ok(!this.putMessageSpy.threw());
		assert.ok(!this.checkSpy.threw());
	});
	QUnit.test("GIVEN core.TextRessourceHandler & its stub WHEN getMessage THEN predefined text returned", function(assert) {
		var sEncodedText = this.oTextHandler.getMessageText(5205);
		assert.equal(sEncodedText, "Error during server request; maximum number of analysis paths exceeded");
		assert.ok(!this.putMessageSpy.threw());
		assert.ok(!this.checkSpy.threw());
	});
	QUnit.module('TRH -- GIVEN coreApi, ajax stub & ResourcePathHandler', {
		beforeEach : function(assert) {
			commonSetupResourcePathHandlerUsingAnInstance(this);
			sap.apf.testhelper.stub.textResourceHandlerStub.setup(this);
			sap.apf.testhelper.stub.stubJQueryAjax();
			this.checkSpy = sinon.spy(this.oMessageHandler, "check");
			this.putMessageSpy = sinon.spy(this.oMessageHandler, "putMessage");
			this.oResourcePathHandler = new sap.apf.core.ResourcePathHandler({
				instances : {
					messageHandler : this.oMessageHandler,
					coreApi : this.oCoreApi	
				}
			});
		},
		afterEach : function(assert) {
			this.checkSpy.restore();
			this.putMessageSpy.restore();
			sap.apf.testhelper.stub.textResourceHandlerStub.teardown();
			jQuery.ajax.restore();
		}
	});
	QUnit.test("WHEN teardown THEN stub restore() works", function(assert) {
		assert.ok(1);
	});
	QUnit.test("WHEN loadApplicationConfig THEN ajax stub works", function(assert) {
		this.oCoreApi.loadApplicationConfig('/helper/config/applicationConfigurationIntegration.json'); //Load Application Configuration
		assert.ok(jQuery.ajax.called);
		assert.ok(!this.putMessageSpy.threw());
		assert.ok(!this.checkSpy.threw());
	});
	QUnit.test("WHEN loadApplicationConfig THEN ajax stub works", function(assert) {
		this.oCoreApi.loadApplicationConfig('/helper/config/applicationConfiguration.json'); //Load Application Configuration
		assert.ok(jQuery.ajax.called);
		assert.ok(!this.putMessageSpy.threw());
		assert.ok(!this.checkSpy.threw());
	});
	QUnit.test("WHEN check THEN nothing", function(assert) {
		this.oCoreApi.check(true, "checked 3001", 3001);
		assert.ok(!this.putMessageSpy.calledOnce);
		assert.ok(!this.checkSpy.threw());
	});
	QUnit.module('TRH -- GIVEN coreApi, ajax stub & ResourcePathHandler', {
		beforeEach : function() {
			commonSetupResourcePathHandlerUsingAnInstance(this);
			sap.apf.testhelper.stub.textResourceHandlerStub.setup(this);
			sap.apf.testhelper.stub.stubJQueryAjax();
			this.oResourcePathHandler = new sap.apf.core.ResourcePathHandler({
				messageHandler : this.oMessageHandler,
				coreApi : this.oCoreApi
			});
		},
		afterEach : function() {
			sap.apf.testhelper.stub.textResourceHandlerStub.teardown();
			jQuery.ajax.restore();
		}
	});
	QUnit.test("WHEN check THEN logs but does not throw", function(assert) {
		this.oCoreApi.loadApplicationConfig("applicationConfiguration");
		this.oCoreApi.check(false, "checked 3001", 3001);
		assert.ok(1); // check on console: displayed text indexed by 3001
	});
}());