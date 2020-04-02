sap.ui.define([
		'sap/ui/core/Component',
		'sap/apf/cloudFoundry/utils',
		'sap/apf/testhelper/config/samplePropertyFiles'
	],
	function(Component, cloudFoundryUtils, testConfig) {
		'use strict';

		QUnit.module("createErrorMessageObject");
		QUnit.test("WHEN no status texts", function(assert) {
			var messageObject = cloudFoundryUtils.createErrorMessageObject({code: "1111"});
			assert.strictEqual(messageObject.getCode(), "1111", "THEN message code as expected");
			assert.strictEqual(messageObject.getPrevious(), undefined, "THEN no previous message object");
		});
		QUnit.test("WHEN 1 status text", function(assert) {
			var messageObject = cloudFoundryUtils.createErrorMessageObject({code: "1111"}, ["unhappy"]);
			assert.strictEqual(messageObject.getCode(), "1111", "THEN message code as expected");
			assert.strictEqual(messageObject.getPrevious().getCode(), "5220", "THEN  previous message object");
			assert.deepEqual(messageObject.getPrevious().getParameters(), ["unhappy "], "THEN text parameter as expected");
		});
		QUnit.test("WHEN multiple status texts", function(assert) {
			var messageObject = cloudFoundryUtils.createErrorMessageObject({code: "1111"}, ["I", "am", "unhappy"]);
			assert.strictEqual(messageObject.getCode(), "1111", "THEN message code as expected");
			assert.strictEqual(messageObject.getPrevious().getCode(), "5220", "THEN  previous message object");
			assert.deepEqual(messageObject.getPrevious().getParameters(), ["I am unhappy "], "THEN text parameter as expected");
		});

		QUnit.module("buildErrorMessage", {
			beforeEach: function () {
				var MessageHandler = function() {
					this.check = function(condition) {
						if (!condition) {
							throw "bad";
						}
					};
					this.createMessageObject = function(config) {
						return new sap.apf.core.MessageObject(config);
					};
				};
				this.messageHandler = new MessageHandler();
				this.dummyJqXHR = {status : "404", statusText : "resource not found"};
			}
		});
		QUnit.test("WHEN no parameters", function(assert) {
			var messageObject = cloudFoundryUtils.buildErrorMessage(this.dummyJqXHR, "1111", [], undefined, this.messageHandler);
			var messageObjectContainingTheHttpError = messageObject.getPrevious();

			assert.strictEqual(messageObject.getCode(), "1111", "THEN message code as expected");
			assert.deepEqual(messageObject.getParameters(), [], "THEN no parameters as expected");
			assert.strictEqual(messageObjectContainingTheHttpError.getCode(),"5214", "THEN message code as expected for http error message object");
			assert.deepEqual(messageObjectContainingTheHttpError.getParameters(),["404", "resource not found"]);
			assert.strictEqual(messageObjectContainingTheHttpError.getPrevious(), undefined, "THEN no previous message object before the http error containing messageObject");
		});
		QUnit.test("WHEN parameters", function(assert) {
			var messageObject = cloudFoundryUtils.buildErrorMessage(this.dummyJqXHR, "1111", ["1","2"], undefined, this.messageHandler);
			var messageObjectContainingTheHttpError = messageObject.getPrevious();

			assert.strictEqual(messageObject.getCode(), "1111", "THEN message code as expected");
			assert.strictEqual(messageObjectContainingTheHttpError.getPrevious(), undefined, "THEN no previous message object");
			assert.deepEqual(messageObject.getParameters(), ["1","2"], "THEN parameters as expected");
		});
		QUnit.test("WHEN previous messageObject is provided and parameters", function(assert) {
			var previousMessageObject = this.messageHandler.createMessageObject({code:"1234"});
			var messageObject = cloudFoundryUtils.buildErrorMessage(this.dummyJqXHR, "1111", ["1","2"], previousMessageObject, this.messageHandler);
			var messageObjectContainingTheHttpError = messageObject.getPrevious().getPrevious();

			assert.strictEqual(messageObject.getPrevious().getCode(), "1234", "THEN previousMessageObject as expected");
			// asserts for http error containing message object
			assert.strictEqual(messageObjectContainingTheHttpError.getCode(),"5214", "THEN message code as expected for http error message object");
			assert.deepEqual(messageObjectContainingTheHttpError.getParameters(),["404", "resource not found"]);
			assert.strictEqual(messageObjectContainingTheHttpError.getPrevious(), undefined, "THEN no previous message object before the http error containing messageObject");
		});

		QUnit.module("cloudFoundryUtils.mergeReceivedTexts", {
			beforeEach: function() {
				var MessageHandler = function() {
					this.check = function(condition) {
						if (!condition) {
							throw "bad";
						}
					};
					this.createMessageObject = function(config) {
						return new sap.apf.core.MessageObject(config);
					};
				};
				this.messageHandler = new MessageHandler();
				this.applicationId = "343EC63F05550175E10000000A445B6D";
			}
		});
		QUnit.test("WHEN empty texts and only in dev language", function(assert) {
			var text = "#FIORI: insert Fiori-Id\n" +
				"# __ldi.translation.uuid=" + this.applicationId + "\n" +
				"#ApfApplicationId=" + this.applicationId + "\n\n";
			var textFiles = {inDevelopmentLanguage: text};
			var mergeResult = cloudFoundryUtils.mergeReceivedTexts(textFiles, this.messageHandler);
			var texts = mergeResult.texts;
			assert.strictEqual(mergeResult.messageObject, undefined, "THEN no errors");
			assert.strictEqual(texts.length, 0, "THEN no texts have been extracted");
		});
		QUnit.test("WHEN corrupted texts", function(assert) {
			var text = "#FIORI: insert Fiori-Id\n" +
				"# __ldi.translation.uuid=" + this.applicationId + "\n" +
				"#ApfApplicationId=" + this.applicationId + "\n\n" +
				"#XTIT,60:Hint\n" +
				"14395631782976233920652753624875=Kategorie 1.1.1\n" +
				"# LastChangeDate=2014/10/07 15:56:42\n\n" +
				"#XTIT,60:Hint\n" +
				"# LastChangeDate=2014/10/07 15:56:42\n\n";

			var textFiles = {inDevelopmentLanguage: text};
			var mergeResult = cloudFoundryUtils.mergeReceivedTexts(textFiles, this.messageHandler);
			assert.strictEqual(mergeResult.messageObject.getCode(), "5416", "THEN error");
		});
		QUnit.test("WHEN texts only in dev language", function(assert) {
			var textDev = testConfig.getPropertyFile("dev", this.applicationId);
			var textFiles = {inDevelopmentLanguage: textDev};
			var mergeResult = cloudFoundryUtils.mergeReceivedTexts(textFiles, this.messageHandler);

			var texts = mergeResult.texts;
			assert.strictEqual(mergeResult.messageObject, undefined, "THEN no errors");
			assert.strictEqual(texts.length, 3, "THEN 3 texts have been extracted");
			assert.strictEqual(texts[0].TextElement, "14395631782976233920652753624875", "THEN correct text element");
			assert.strictEqual(texts[0].TextElementDescription, "Category 1.1.1", "THEN correct text from dev file");
			assert.strictEqual(texts[1].TextElement, "14395631877028739882768245665019", "THEN correct text element");
			assert.strictEqual(texts[1].TextElementDescription, "Category 1.1.2", "THEN correct text from dev file");
			assert.strictEqual(texts[2].TextElement, "14395631877028739882768245665031", "THEN correct text element");
			assert.strictEqual(texts[2].TextElementDescription, "Category 1.1.5", "THEN correct text from dev file");
		});
		QUnit.test("WHEN texts in requested, english and development language", function(assert) {
			var textFiles = {
				inDevelopmentLanguage: testConfig.getPropertyFile("dev", this.applicationId),
				inEnglish: testConfig.getPropertyFile("en", this.applicationId),
				inRequestedLanguage: testConfig.getPropertyFile("de", this.applicationId)
			};
			var mergeResult = cloudFoundryUtils.mergeReceivedTexts(textFiles, this.messageHandler);

			var texts = mergeResult.texts;
			assert.strictEqual(mergeResult.messageObject, undefined, "THEN no errors");
			assert.strictEqual(texts.length, 3, "THEN 3 texts have been extracted");
			assert.strictEqual(texts[0].TextElement, "14395631782976233920652753624875", "THEN correct text element");
			assert.strictEqual(texts[0].TextElementDescription, "Kategorie 1.1.1", "THEN correct text from german file");
			assert.strictEqual(texts[1].TextElement, "14395631877028739882768245665019", "THEN correct text element");
			assert.strictEqual(texts[1].TextElementDescription, "Kategorie 1.1.2", "THEN correct text from german file");
			assert.strictEqual(texts[2].TextElement, "14395631877028739882768245665031", "THEN correct text element");
			assert.strictEqual(texts[2].TextElementDescription, "En-Category 1.1.5", "THEN correct text from english file");
		});
		QUnit.test("WHEN texts in requested, alternate, english and development language", function(assert) {
			var textFiles = {
				inDevelopmentLanguage: testConfig.getPropertyFile("dev", this.applicationId),
				inEnglish: testConfig.getPropertyFile("en", this.applicationId),
				inRequestedLanguage: testConfig.getPropertyFile("de", this.applicationId),
				inAlternateLanguage: testConfig.getPropertyFile("alt", this.applicationId)
			};
			var mergeResult = cloudFoundryUtils.mergeReceivedTexts(textFiles, this.messageHandler);

			var texts = mergeResult.texts;
			assert.strictEqual(mergeResult.messageObject, undefined, "THEN no errors");
			assert.strictEqual(texts.length, 3, "THEN 3 texts have been extracted");
			assert.strictEqual(texts[0].TextElement, "14395631782976233920652753624875", "THEN correct text element");
			assert.strictEqual(texts[0].TextElementDescription, "Kategorie 1.1.1", "THEN correct text from german file");
			assert.strictEqual(texts[1].TextElement, "14395631877028739882768245665019", "THEN correct text element");
			assert.strictEqual(texts[1].TextElementDescription, "Kategorie 1.1.2", "THEN correct text from german file");
			assert.strictEqual(texts[2].TextElement, "14395631877028739882768245665031", "THEN correct text element");
			assert.strictEqual(texts[2].TextElementDescription, "Alt-Category 1.1.5", "THEN correct text from english file");
		});

		QUnit.module("cloudFoundryUtils.resolveUri", {
			beforeEach: function() {
				var oComponent;
				this.oCoreApi = {
					getComponent: function() {
						return oComponent;
					}
				};
				this.oComponentPath = "../../../../resources/sap/ui/core/";
				// sap.ui.component will load the Component corresponding to the app-id given in the manifest.
				// To avoid test overhead, we just let it load the sap.ui.core.Component.
				// It's path is relative to this test-file is: ../../../../resources/sap/ui/core/Component.js
				return Component.create({
					manifest : {
						"sap.app" : {
							"id" : "sap.ui.core"
						}
					}
				}).then(function(component) {
					oComponent = component
				});
			}
		});
		QUnit.test("WHEN resolve relative URL", function(assert) {
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "test/path"), this.oComponentPath + "test/path", "THEN simple path is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, ""), this.oComponentPath + "", "THEN empty path is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, this.oComponentPath + "test?q=12&c=asdf"), this.oComponentPath + "test?q=12&c=asdf", "THEN path with query is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, this.oComponentPath + "test#abc"), this.oComponentPath + "test#abc", "THEN path with fragment is correctly resolved");
		});
		QUnit.test("WHEN resolve absolute URL starting with slash", function(assert) {
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "/test/path"), "/test/path", "THEN simple path is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "/"), "/", "THEN empty path is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "/test?q=12&c=asdf"), "/test?q=12&c=asdf", "THEN path with query is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "/test#abc"), "/test#abc", "THEN path with fragment is correctly resolved");
		});
		QUnit.test("WHEN resolve absolute URL starting with protocol", function(assert) {
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "http://test/path"), "http://test/path", "THEN simple HTTP path is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "http://test/path?q=12&c=asdf"), "http://test/path?q=12&c=asdf", "THEN HTTP path with query is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "http://test/path#abc"), "http://test/path#abc", "THEN HTTP path with fragment is correctly resolved");

			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "https://test/path"), "https://test/path", "THEN simple HTTPS path is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "https://test/path?q=12&c=asdf"), "https://test/path?q=12&c=asdf", "THEN HTTPS path with query is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "https://test/path#abc"), "https://test/path#abc", "THEN HTTPS path with fragment is correctly resolved");

			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "ftp://test/path"), "ftp://test/path", "THEN simple FTP path is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "ftp://test/path?q=12&c=asdf"), "ftp://test/path?q=12&c=asdf", "THEN FTP path with query is correctly resolved");
			assert.strictEqual(cloudFoundryUtils.resolveUri(this.oCoreApi, "ftp://test/path#abc"), "ftp://test/path#abc", "THEN FTP path with fragment is correctly resolved");
		});
	});