/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define([
	'sap/apf/utils/parseTextPropertyFile',
	'sap/apf/utils/hashtable',
	'sap/apf/utils/utils'
], function(parseTextPropertyFile, Hashtable, utils) {
	'use strict';
	/**
	 * TextHandler gets a property file and transforms it to the odata format, that is required by the
	 * modeler and vice versa transforms the odata format from modeler to a text property file. The text
	 * property file is stored on the server.
	 *
	 * @param {{instances : { messageHandler : sap.apf.core.MessageHandler}}} inject
	 * @constructor
	 */
	var ProxyTextHandlerForLocalTexts = function(inject) {
		var messageHandler = inject.instances.messageHandler;
		var textPool = {};
		/**
		 * transform text property file into hashMap for internal persistence
		 *
		 * @param {string} applicationId - guid of application for text file
		 * @param {string} propertyFileString - text file content
		 */
		this.initApplicationTexts = function(applicationId, propertyFileString) {
			var textTable = textPool[applicationId] || new Hashtable(messageHandler);
			if (propertyFileString === "" || propertyFileString === null) {
				textPool[applicationId] = textTable;
				return;
			}
			var parseResult = parseTextPropertyFile(propertyFileString, { instances : { messageHandler : messageHandler }});
			parseResult.TextElements.forEach(function(text) {
				if (text.TextElement) {
					textTable.setItem(text.TextElement, text);
				}
			});
			textPool[applicationId] = textTable;
		};
		/**
		 * get content as a property file string
		 *
		 * @param {string} applicationId
		 * @return {string} textFile as string
		 */
		this.createTextFileOfApplication = function(applicationId) {
			if (!textPool[applicationId]) {
				return "";
			}
			var textPropertyFile = utils.renderHeaderOfTextPropertyFile(applicationId, messageHandler);
			return textPropertyFile + utils.renderTextEntries(textPool[applicationId], messageHandler);
		};
		/**
		 * get all text elements of an application
		 *
		 * @param {string} applicationId
		 * @return {object[]} - [ { TextElement : guid1,
		 * 								TextDescription : "nice",
		 * 								Application : guid,
		 * 								TextElementType: "XTIT" //(e.g.),
		 * 								Language: "",
		 * 								MaximumLength: 30,
		 * 								TranslationHint: "any String",
		 * 								LastChangeUTCDateTime: '/Date(<timestamp in ms since 1.1.1970>)/'
		 * 								},
		 * 							]
		 */
		this.getTextElements = function(applicationId) {
			if (!textPool[applicationId]) {
				return [];
			}
			var textElements = [];
			textPool[applicationId].each(function(key, textElement){
				textElements.push(textElement);
			});
			return textElements;
		};
		/**
		 * add or update a single text element to the local text pool of an application and return its guid
		 *
		 * @param {{ TextElement : string|undefined, TextElementDescription: string, Language: string, TextElementType: string, MaximumLength: number, Application: string, TranslationHint: string }} textToAdd
		 * @return {string} guid of the added text element or created random GUID when not yet existing
		 */
		this.addText = function(textToAdd) {
			// it is necessary to add the member TextElement directly on the incoming object textToAdd -> 2nd parameter of HashTable.setItem(...);
			if (!textToAdd.TextElement) {
				textToAdd.TextElement = utils.createPseudoGuid(32);
			}
			var textTable = textPool[textToAdd.Application] || new Hashtable(messageHandler);
			textTable.setItem(textToAdd.TextElement, textToAdd);
			textPool[textToAdd.Application] = textTable;
			return textToAdd.TextElement;
		};

		/**
		 * delete a single text element from the local text pool of an application
		 *
		 * @param {{application : string, inputParameters : {value : string}[]}} data
		 */
		this.removeText =  function(data) {
			var applicationId = data.application;
			var sTextElementId = data.inputParameters[0].value;
			var textTable = textPool[applicationId] || new Hashtable(messageHandler);
			if (textTable.hasItem(sTextElementId)) {
				textTable.removeItem(sTextElementId);
			}
		};
	};
	/* BEGIN_COMPATIBILITY */
	sap.apf.utils.ProxyTextHandlerForLocalTexts = ProxyTextHandlerForLocalTexts;
	/* END_COMPATIBILITY */
	return ProxyTextHandlerForLocalTexts;
}, true /*Global_Export*/);