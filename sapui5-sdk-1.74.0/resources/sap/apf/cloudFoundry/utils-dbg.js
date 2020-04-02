/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
/*global sap, jQuery*/

sap.ui.define([
	'sap/apf/core/messageObject',
	'sap/apf/utils/hashtable',
	'sap/apf/utils/parseTextPropertyFile'
], function(MessageObject, HashTable, parseTextPropertyFile) {
	'use strict';

	/*BEGIN_COMPATIBILITY*/
	HashTable = HashTable || sap.apf.utils.Hashtable;
	parseTextPropertyFile = parseTextPropertyFile || sap.apf.utils.parseTextPropertyFile;
	/*END_COMPATIBILITY*/

	function getLanguageVector() {
		return ["inRequestedLanguage", "inAlternateLanguage", "inEnglish", "inDevelopmentLanguage"];
	}

	var moduleObject = {
		/**
		 * combines all error messages from the server to a single message object
		 * @param {object} messageDefinition configuration object of the message
		 * @param {string[]} errorMessagesFromServer
		 * @returns {sap.apf.core.MessageObject} messageObject
		 */
		createErrorMessageObject: function(messageDefinition, errorMessagesFromServer) {
			var messageObject = new MessageObject(messageDefinition);
			var messages = "";
			if (errorMessagesFromServer) {
				errorMessagesFromServer.forEach(function(message) {
					messages = messages + message + ' ';
				});
				messageObject.setPrevious(new MessageObject({code: '5220', aParameters: [messages]}));
			}
			return messageObject;
		},
		/**
		 * creates a messageObject with the provided parameters. creates another messageObject for the http error and sets this as previous
		 * @param {object} jqXHR - ajax jqXHR object that contains the http error
		 * @param {string} messageCode - type from message definition
		 * @param {string[]|undefined} parameters - contains all parameters that the message type needs, the order is important
		 * @param {sap.apf.core.MessageObject|undefined} previousMessageObject - created messageObject will be attached to this
		 * @param {sap.apf.core.MessageHandler} messageHandler
		 */
		buildErrorMessage: function (jqXHR, messageCode, parameters, previousMessageObject, messageHandler) {
			var technicalMessage = messageHandler.createMessageObject({code : "5214", aParameters : [jqXHR.status, jqXHR.statusText]});

			var message = messageHandler.createMessageObject({code : messageCode, aParameters : parameters}); // parameters contains httpStatusCode, textStatus and errorThrown
			if (previousMessageObject) {
				message.setPrevious(previousMessageObject);
				previousMessageObject.setPrevious(technicalMessage);
			} else {
				message.setPrevious(technicalMessage);
			}
			return message;
		},
		/**
		 * merges the received texts, that come from server
		 * @param {object} textFiles
		 * @param {sap.apf.core.MessageHandler} messageHandler
		 * @return
		 */
		mergeReceivedTexts: function(textFiles, messageHandler) {
			var explainingMessageObject = undefined; // intended for return value
			var textTable = new HashTable(messageHandler);
			var languageVector = getLanguageVector();

			languageVector.forEach(function(language) {
				var textFile = textFiles[language];
				if (!textFile || textFile === "null") {
					return;
				}
				var parseResult = parseTextPropertyFile(textFile, {instances: {messageHandler: messageHandler}});
				var currentMessageObject;
				if (parseResult.Messages.length > 0) {
					explainingMessageObject = explainingMessageObject || new MessageObject({code: '5416'});
					currentMessageObject = explainingMessageObject;
					parseResult.Messages.forEach(function(messageObject) {
						currentMessageObject.setPrevious(messageObject);
						currentMessageObject = messageObject;
					});
				}
				parseResult.TextElements.forEach(function(text) {
					if (text.TextElement && !textTable.hasItem(text.TextElement)) {
						textTable.setItem(text.TextElement, text);
					}
				});
			});
			var texts = [];
			textTable.getKeys().forEach(function(key) {
				texts.push(textTable.getItem(key));
			});
			return {texts: texts, messageObject: explainingMessageObject};
		},

		/**
		 * Resolves URIs: If they are absolute, they will not be modified.
		 * If they are relative, they will be rewritten as relative to the Component instead of the execution environment (i.e. the Fiori Launchpad)
		 * We can't get the ManifestObject at construction of the Proxies, as the CoreAPI is not fully present at this time.
		 * @param {sap.apf.core.Instance|sap.apf.modeler.core.Instance} oCoreApi Runtime or Modeler Instance providing access to UIComponent through oCoreApi.getComponent()
		 * @param {string} sURI URI to be resolved
		 * @returns {string} The resolved URI
		 */
		resolveUri: function resolveUri(oCoreApi, sURI) {
			if (oCoreApi && oCoreApi.getComponent && oCoreApi.getComponent()) {
				return oCoreApi.getComponent().getManifestObject().resolveUri(sURI);
			}
			return sURI; // Fallback to prevent errors in case no UIComponent is present
		}
	};
	/*BEGIN_COMPATIBILITY*/
	sap.apf.cloudFoundry = sap.apf.cloudFoundry || {};
	return moduleObject;
});