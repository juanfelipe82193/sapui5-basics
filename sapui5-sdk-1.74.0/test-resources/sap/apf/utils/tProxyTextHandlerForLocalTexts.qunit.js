/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

jQuery.sap.registerModulePath("sap.apf.testhelper", "../testhelper");
sap.ui.define([
		'sap/apf/utils/proxyTextHandlerForLocalTexts',
		'sap/apf/testhelper/config/samplePropertyFiles',
		'sap/apf/core/messageObject',
		'sap/apf/core/constants',
		'sap/apf/utils/utils'
	],
	function(ProxyTextHandlerForLocalTexts, SamplePropertyFiles, MessageObject, constants, utils) {
		'use strict';

		var applicationIdForTesting = "111142AAAAAAAAAAAAAAAAAAAAAAAAAA"; // this id has to have a length of 32
		var MessageHandler = function () {
			this.createMessageObject = function (config) {
				return new MessageObject(config);
			};
			this.isOwnException = function () {
			};
			this.putMessage = function (oMessageObject) {
			};
			this.check = function (condition) {
				if(!condition){
					throw "bad";
				}
			};
		};

		QUnit.module("Test for function initApplicationTexts", {
			beforeEach: function () {
				this.messageHandler = new MessageHandler();
				this.textFile = SamplePropertyFiles.getPropertyFile("dev", applicationIdForTesting);
				this.inject = {
					instances : {
						messageHandler : this.messageHandler
					}
				};
			}
		});
		QUnit.test("WHEN initApplicationTexts is called once", function (assert) {
			var textHandler = new ProxyTextHandlerForLocalTexts(this.inject);

			textHandler.initApplicationTexts(applicationIdForTesting, this.textFile);

			var result = textHandler.getTextElements(applicationIdForTesting);

			assert.strictEqual(result.length, 3, "THEN three texts have been loaded");
			assert.strictEqual(result[0].TextElement, "14395631782976233920652753624875", "THEN correct text element #1");
			assert.strictEqual(result[0].TextElementDescription, "Category 1.1.1", "THEN correct text from dev file #1");
			assert.strictEqual(result[1].TextElement, "14395631877028739882768245665019", "THEN correct text element #2");
			assert.strictEqual(result[1].TextElementDescription, "Category 1.1.2", "THEN correct text from dev file #2");
			assert.strictEqual(result[2].TextElement, "14395631877028739882768245665031", "THEN correct text element #3");
			assert.strictEqual(result[2].TextElementDescription, "Category 1.1.5", "THEN correct text from dev file #3");
		});

		QUnit.module("Tests for function addText", {
			beforeEach: function () {
				this.messageHandler = new MessageHandler();
				this.textFile = SamplePropertyFiles.getPropertyFile("dev", applicationIdForTesting);
				this.inject = {
					instances : {
						messageHandler : this.messageHandler
					}
				};
				this.text1 = {
					TextElementDescription : "TextDescription1",
					Language : constants.developmentLanguage,
					TextElementType : "XFLD",
					MaximumLength : 10,
					Application : applicationIdForTesting,
					TranslationHint : "TranslateIt"
				};
			}
		});
		QUnit.test("WHEN addText is called with a text but w/o ID before initApplicationTexts has been called", function (assert) {
			var textHandler = new ProxyTextHandlerForLocalTexts(this.inject);

			var textElement = textHandler.addText(this.text1);
			var result = textHandler.getTextElements(applicationIdForTesting);

			assert.strictEqual(result.length, 1, "THEN number of elements in result is correct");
			assert.notStrictEqual(textElement, undefined, "THEN text element has been created #1");
			assert.strictEqual(result[0].TextElement, textElement, "THEN text element ID is found via its application ID #1");
			assert.strictEqual(result[0].TextElementDescription, this.text1.TextElementDescription, "THEN correct text is found via its application ID #1");
		});
		QUnit.test("WHEN addText is called with text and ID before initApplicationTexts has been called", function (assert) {
			var textHandler = new ProxyTextHandlerForLocalTexts(this.inject);
			this.text1.TextElement = "GUID42";

			textHandler.addText(this.text1);
			var result = textHandler.getTextElements(applicationIdForTesting);

			assert.strictEqual(result.length, 1, "THEN number of elements in result is correct");
			assert.strictEqual(result[0].TextElement, this.text1.TextElement, "THEN text element ID is found via its application ID #1");
			assert.strictEqual(result[0].TextElementDescription, this.text1.TextElementDescription, "THEN correct text is found via its application ID #1");
		});
		QUnit.test("WHEN addText is called after initApplicationTexts has been called successfully", function (assert) {
			var textHandler = new ProxyTextHandlerForLocalTexts(this.inject);

			textHandler.initApplicationTexts(applicationIdForTesting, this.textFile);

			var textElement = textHandler.addText(this.text1);
			var result = textHandler.getTextElements(applicationIdForTesting);

			assert.strictEqual(result.length, 4, "THEN number of elements in result is correct");
			assert.strictEqual(result[0].TextElement, "14395631782976233920652753624875", "THEN correct text element #1");
			assert.strictEqual(result[0].TextElementDescription, "Category 1.1.1", "THEN correct text from dev file #1");
			assert.strictEqual(result[1].TextElement, "14395631877028739882768245665019", "THEN correct text element #2");
			assert.strictEqual(result[1].TextElementDescription, "Category 1.1.2", "THEN correct text from dev file #2");
			assert.strictEqual(result[2].TextElement, "14395631877028739882768245665031", "THEN correct text element #3");
			assert.strictEqual(result[2].TextElementDescription, "Category 1.1.5", "THEN correct text from dev file #3");
			assert.strictEqual(result[3].TextElement, textElement, "THEN correct text element #4");
			assert.strictEqual(result[3].TextElementDescription, "TextDescription1", "THEN correct text from dev file #4");

		});

		QUnit.module("Tests for function createTextFileOfApplication", {
			beforeEach: function () {
				this.messageHandler = new MessageHandler();
				this.textFile = SamplePropertyFiles.getPropertyFile("dev", applicationIdForTesting);
				this.inject = {
					instances : {
						messageHandler : this.messageHandler
					}
				};
				this.text1 = {
					TextElementDescription : "TextDescription1",
					Language : constants.developmentLanguage,
					TextElementType : "XFLD",
					MaximumLength : 10,
					Application : applicationIdForTesting,
					TranslationHint : "TranslateIt"
				};
			}
		});
		QUnit.test("WHEN textpool has 4 elements and requested application is existing", function(assert){
			var spyRenderHeaderOfTextPropertyFile = sinon.spy(utils, "renderHeaderOfTextPropertyFile");
			var spyRenderTextEntries = sinon.spy(utils, "renderTextEntries");

			var textHandler = new ProxyTextHandlerForLocalTexts(this.inject);
			textHandler.initApplicationTexts(applicationIdForTesting, this.textFile);

			textHandler.addText(this.text1);
			textHandler.createTextFileOfApplication(applicationIdForTesting);

			assert.strictEqual(spyRenderHeaderOfTextPropertyFile.callCount, 1, "THEN renderHeaderOfTextPropertyFile has been called once");
			assert.deepEqual(spyRenderHeaderOfTextPropertyFile.getCall(0).args, [applicationIdForTesting, this.messageHandler], "THEN arguments as expected");
			assert.strictEqual(spyRenderHeaderOfTextPropertyFile.callCount, 1, "THEN renderTextEntries has been called once");
			assert.strictEqual(spyRenderTextEntries.getCall(0).args[1], this.messageHandler, "THEN second argument as expected");
			var keys = spyRenderTextEntries.getCall(0).args[0].getKeys();
			assert.strictEqual(keys.length, 4, "THEN hashtable with 4 elements as first argument");
			spyRenderHeaderOfTextPropertyFile.restore();
			spyRenderTextEntries.restore();
		});
		QUnit.test("WHEN new Application is created with NULL as text file", function(assert){

			var textHandler = new ProxyTextHandlerForLocalTexts(this.inject);
			textHandler.initApplicationTexts(applicationIdForTesting, null);

			var textElements = textHandler.getTextElements(applicationIdForTesting);
			assert.deepEqual(textElements, [], "THEN no text elements");
		});
		QUnit.test("WHEN textpool has 0 elements and requested application is NOT existing", function(assert){
			var textHandler = new ProxyTextHandlerForLocalTexts(this.inject);

			var textFile = textHandler.createTextFileOfApplication(applicationIdForTesting);

			assert.strictEqual(textFile, "", "THEN empty string is returned");
		});
	}
);