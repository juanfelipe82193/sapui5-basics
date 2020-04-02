sap.ui.define([
	"sap/apf/core/messageObject",
	"sap/apf/core/messageDefinition",
	"sap/apf/utils/hashtable"
], function(MessageObject, messageDefinition, Hashtable){

	/**
	 * @description Constructor, simply clones the MessageHandler
	 */
	var doubleMessageHandler = function() {
		'use strict';
		this.raiseOnCheck = function() {
			this.check = function(booleExpr, sMessage, sCode) {
				if (!booleExpr) {
					throw new Error(sMessage);
				}
			};
			return this;
		};
		this.putMessageOnCheck = function() {
			this.check = function(booleExpr, sMessage, sCode) {
				if (!booleExpr) {
					var oMessageObject = this.createMessageObject({
						code: sCode || "5100",
						aParameters: [sMessage]
					});
					this.putMessage(oMessageObject);
				}
			};
			return this;
		};
		/**
		* @description basic setup, when messaging is not tested
		*/
		this.doubleCheckAndMessaging = function() {
			this.raiseOnCheck();
			this.loadMessageConfiguration = function() {
			};
			this.createMessageObject = function(oConfig) {
				return new MessageObject(oConfig);
			};
			this.putMessage = function(oMessage) {
				throw new Error("error");
			};
			return this;
		};
		this.doubleGetConfigurationByCode = function() {
			var messageDefinitions = new Hashtable(this);
			var i;
			for (i = 0; i < messageDefinition.length; i++) {
				messageDefinitions.setItem(messageDefinition[i].code, messageDefinition[i]);
			}
			this.getConfigurationByCode = function(code) {
				return messageDefinitions.getItem(code);
			};
		};
		this.supportLoadConfigWithoutAction = function() {
			this.loadConfig = function() {
			};
			return this;
		};
		this.spyPutMessage = function() {
			this.spyResults = {};
			this.createMessageObject = function(oConf) {
				return oConf;
			};
			this.putMessage = function(oMessageObject) {
				var spyResultsTmp;
				if (this.spyResults.putMessage) {
					if (jQuery.isArray(this.spyResults.putMessage)) {
						this.spyResults.putMessage.push(oMessageObject);
					} else {
						spyResultsTmp = this.spyResults.putMessage;
						this.spyResults.putMessage = [];
						this.spyResults.putMessage.push(spyResultsTmp, oMessageObject);
					}
				} else {
					this.spyResults.putMessage = oMessageObject;
				}
			};
			return this;
		};
		this.supportActivateOnErrorHandlingWithoutAction = function() {
			this.activateOnErrorHandling = function() {};
			return this;
		};
		this.supportSetMessageCallbackWithoutAction = function() {
			this.setMessageCallback = function() {};
			return this;
		};
		this.supportSetLifeTimePhaseWithoutAction = function() {
			this.setLifeTimePhaseStartup = function() {};
			this.setLifeTimePhaseShutdown = function () {};
			this.setLifeTimePhaseRunning = function(){};
			return this;
		};
		this.supportSetTextResourceHandlerWithoutAction = function() {
			this.setTextResourceHandler = function() {};
			return this;
		};
		this.supportIsOwnExceptionReturn = function(returnValue) {
			this.isOwnException = function() {
				return returnValue;
			};
			return this;
		};
	};
	sap.apf.testhelper.doubles.MessageHandler = doubleMessageHandler;
	return doubleMessageHandler;
}, true /*Global_Export*/);
