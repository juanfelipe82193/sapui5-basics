/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.testhelper.interfaces.IfMessageHandler");

sap.apf.testhelper.interfaces.IfMessageHandler = function() {
	'use strict';
	/**
	 * tells the message handler about current state of booting. Error messages
	 * are handled differently during startup and after the startup.
	 * @param {integer} phase a value from @see{sap.apf.core.constants.lifeTimePhases}
	 */
	this.setLifeTimePhaseStartup = function() {
		throw new Error("not implemented");
	};

	this.setLifeTimePhaseRunning = function() {
		throw new Error("not implemented");
	};

	this.setLifeTimePhaseShutdown = function() {
		throw new Error("not implemented");
	};

	this.isOwnException = function() {
		throw new Error("not implemented");
	};
	/**
	 * @returns {boolean} flag, that indicates, whether a fatal error has been put at startup 
	 */
	this.fatalErrorOccurredAtStartup = function() {
		throw new Error("not implemented");
	};
	/**
	 * @public
	 * @description Creates a message object. The message processing is started with sap.api.putMessage, which expects as
	 * argument a message object of type sap.apf.core.MessageObject. So first create the message object and afterwards call sap.apf.api.putMessage
	 * with the message object as argument.
	 * @param {object} oConfig Configuration of the message.
	 * @param {string} oConfig.code 
	 *            The message is classified by its code. The code identifies an entry in the message configuration.
	 * @param {string[]} [oConfig.aParameters] 
	 *            Additional parameters for the message. The parameters are filled into the message text, when the message
	 *            will be processed by the message handler. 
	 * @param {object} [oConfig.oCallingObject]  
	 *            Reference of the calling object. This can be used later to
	 *            visualize on the user interface, where the error happened, e.g. path or
	 *            step.
	 * @returns {sap.apf.core.MessageObject}
	 */
	this.createMessageObject = function(oConfig) {
		throw new Error("not implemented");
	};
	/**
	 * @public
	 * @description The handling of the window.onerror by the message handler is
	 *              either switched on or off.
	 * @param {boolean} bOnOff
	 * @returns {undefined}
	 */
	this.activateOnErrorHandling = function(bOnOff) {
		throw new Error("not implemented");
	};
	/**
	 * @public
	 * @description Loads all message from the  configuration. This method is called from the resource path handler.
	 * @param {object[]} aMessages Array with message configuration objects.
	 * @param {boolean} bResetRegistry  Flag to reset registry.
	 * @returns {undefined}
	 */
	this.loadConfig = function(aMessages, bResetRegistry) {
		throw new Error("not implemented");
	};
	/**
	 * @public
	 * @description Sets a callback function, so that a message can be further
	 *              processed. This includes the display of the message on the
	 *              user interface and throwing an error to stop processing in
	 *              case of errors.
	 * @param {function} fnCallback
	 *            Either a function or undefined. The callback function will be called
	 *            with the messageObject of type sap.apf.core.MessageObject as only parameter.
	 * @returns {undefined}
	 */
	this.setMessageCallback = function(fnCallback) {
		throw new Error("not implemented");
	};
	this.setCallbackForTriggeringFatal = function(fnCallback) {
		throw new Error("setCallbackForTriggeringFatal not implemented");
	};
	/**
	 * @public
	 * @description A message is passed to the message handler for
	 *              further processing. This can be an information, warning or
	 *              error. 
	 * @param {sap.apf.core.MessageObject} oMessageObject
	 *            The message object shall be created by method sap.apf.api.createMessageObject.
	 * @returns {undefined}
	 */
	this.putMessage = function(oMessageObject) {
		throw new Error("not implemented");

	};
	/**
	 * @public
	 * @description Test whether condition is violated and puts a corresponding message.
	 * @param {boolean} booleExpression Boole expression, that is evaluated.
	 * @param {string} sMessage A text, that is included in the message text
	 * @param {string} [sCode] Error code 5100 is default, 5101 for warning. Other codes can be used, if the default message text is not specific enough.
	 * @returns {undefined}
	 */
	this.check = function(booleExpression, sMessage, sCode) {
		throw new Error("not implemented");
	};
	/**
	 * @description Injection setter. Injection is optional. If not injected, putMessage doesn't retrieve the text but instead reacts with some generic message. 
	 * @param {object} textResourceHandler
	 */
	this.setTextResourceHandler = function(textResourceHandler) {
		throw new Error("not implemented");
	};

	/**
	 * @description Resets the message handler: Unset the message callback function, loads default message configuration and cleans message log. 
	 * @returns {undefined}
	 */
	this.reset = function() {
		throw new Error("not implemented");
	};
	/**
	 * @description Returns a copy of APF log messages. The last message put is on first position in array.
	 * @returns {string[]}
	 */
	this.getLogMessages = function() {
		throw new Error("not implemented");
	};
	/**
	 * @description Returns a reference of a message configuration object. Not a copy.
	 * @param {string} sErrorCode
	 * @returns {object} oConfiguration
	 */
	this.getConfigurationByCode = function(sErrorCode) {
		throw new Error("not implemented");
	};
};