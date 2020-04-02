/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global sap, jQuery, sinon */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require("sap.apf.modeler.core.textPool");
jQuery.sap.require("sap.apf.utils.parseTextPropertyFile");
sap.ui.define("sap/apf/modeler/core/tTextPool",[
	"sap/base/i18n/ResourceBundle"
], function(ResourceBundle){
	'use strict';
	function commonSetupTextPool(assert, context, applicationId, expectedUuid, odataDoChangeOperationsInBatch) {
		context.ApplicationId = applicationId || "543EC63F05550175E10000000A445B6D";
		context.expectedUuid = expectedUuid || "543ec63f-0555-0175-e100-00000a445b6d";
		context.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
		context.texts = [ {
			TextElement : "143EC63F05550175E10000000A445B6D",
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE1",
			MaximumLength : 30,
			Application : context.ApplicationId,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412692222731)/"
		}, {
			TextElement : "243EC63F05550175E10000000A445B6D",
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE2",
			MaximumLength : 30,
			Application : context.ApplicationId,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412692229733)/"
		}, {
			TextElement : "343EC63F05550175E10000000A445B6D",
			Language : "",
			TextElementType : "XLAB",
			TextElementDescription : "uniqueLabelText",
			MaximumLength : 15,
			Application : context.ApplicationId,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412690202721)/"
		} ];
		var guidCounter = 0;
		context.odataProxy = {
				create : function(type, data, callback, async) {
					guidCounter++;
					data.TextElement = "newGuid" + guidCounter;
					if(async !== true){
						assert.ok(false, "Async false handed over to creation of texts");
					}
					callback(data, {
						meta : "data"
					}, undefined);

				},
				doChangeOperationsInBatch : function(batchRequests, callback) {
					if (odataDoChangeOperationsInBatch) {
						odataDoChangeOperationsInBatch(batchRequests, callback);
					}
				}
		};
		context.inject = {
				instances : {
					messageHandler : context.messageHandler,
					persistenceProxy : context.odataProxy
				},
				constructors : {
					Hashtable : sap.apf.utils.Hashtable
				},
				isUsingCloudFoundryProxy : context.isUsingCloudFoundryProxy
		};
		context.textPool = new sap.apf.modeler.core.TextPool(context.inject, context.ApplicationId, context.texts);
	}
	QUnit.module("M: TextPool and text parser", {
		beforeEach : function(assert) {
			commonSetupTextPool(assert, this);
		}
	});
	QUnit.test("Get Texts keys after init with textElementType selection", function(assert) {
		var keys = this.textPool.getTextKeys("XTIT");
		assert.equal(keys.length, 2, "2 Titles expected");
	});
	QUnit.test("WHEN Get Text with unknown guid", function(assert) {
		var key = this.textPool.get("UNKNOWN_GUID");
		var expectedTextElement = {
				"Application" : "543EC63F05550175E10000000A445B6D",
				"Language" : "",
				"MaximumLength" : 10,
				"TextElement" : "UNKNOWN_GUID",
				"TextElementDescription" : "UNKNOWN_GUID",
				"TextElementType" : "XFLD",
				"TranslationHint" : ""
		};
		assert.deepEqual(key, expectedTextElement, "THEN the unknown key is returned");
	});
	QUnit.test("Get Texts keys after init without textElementType selection", function(assert) {
		var keys = this.textPool.getTextKeys();
		assert.equal(keys.length, 3, "3 Texts expected");
	});
	QUnit.test("set empty text and get the special predefined key", function(assert) {
		this.textPool.setTextAsPromise("", {
			TextElementType : "YMESG",
			MaximumLength : 21,
			TranslationHint : "Just Do it"
		}).done(function(textKey){
			assert.equal(textKey, sap.apf.core.constants.textKeyForInitialText, "Expected Guid");
			var text = this.textPool.get(sap.apf.core.constants.textKeyForInitialText);
			assert.equal(text.TextElement, sap.apf.core.constants.textKeyForInitialText, "Correct Key");
			assert.equal(text.TextElementDescription, "", "Correct Value");
			assert.ok(this.textPool.isInitialTextKey(textKey), "Expect key for initial text");
		}.bind(this));

	});
	QUnit.test("Get (intermediate and persistent) Texts keys after creation of new texts", function(assert) {
		var keys, text, keyOnDB;
		this.textPool.setTextAsPromise("Do not do it", {
			TextElementType : "YMESG",
			MaximumLength : 21,
			TranslationHint : "Just Do it"
		}).done(function(newKey){
			keys = this.textPool.getTextKeys("YMESG");
			assert.equal(keys.length, 1, "1 YMESG expected");
			assert.equal(keys[0], newKey, "Correct key was returned");
			text = this.textPool.get(newKey);
			assert.equal(text.TextElementType, "YMESG", "correct Type");
			assert.equal(text.MaximumLength, 21, "correct Length");
			assert.equal(text.TextElementDescription, "Do not do it", "correct text");
			assert.equal(text.TranslationHint, "Just Do it", "correct translation hint");
			keys = this.textPool.getTextKeys("XLAB");
			assert.equal(keys.length, 1, "1 Label expected");
			text = this.textPool.get(keys[0]);
			assert.equal(text.TextElementDescription, "uniqueLabelText", "correct label text");
			keyOnDB = this.textPool.getPersistentKey(keys[0]);
			assert.equal(keys[0], keys[0], "no change of key expected for already persistent key");
			keyOnDB = this.textPool.getPersistentKey(newKey);
			assert.equal(keyOnDB, "newGuid1", "Correct persistentKey of newly created text");
			keys = this.textPool.getTextKeys("YMESG");
			assert.equal(keys.length, 1, "1 YMESG expected");
			this.textPool.setTextAsPromise("Do not do it", {
				TextElementType : "YMESG",
				MaximumLength : 21,
				TranslationHint : "Just Do it"
			}).done(function(sameNewKey){
				assert.equal(sameNewKey, newKey, "No new key has been created");
				keys = this.textPool.getTextKeys("YMESG");
				assert.equal(keys.length, 1, "1 YMESG expected");
			}.bind(this));

		}.bind(this));

	});
	QUnit.test("GetTextsByTypeAndLength", function(assert) {
		this.textPool.setTextAsPromise("Do not do it", {
			TextElementType : "YMESG",
			MaximumLength : 21,
			TranslationHint : "Just Do it"
		});
		this.textPool.setTextAsPromise("Label1", {
			TextElementType : "XLAB",
			MaximumLength : 10,
			TranslationHint : "Nice"
		});
		this.textPool.setTextAsPromise("Label2", {
			TextElementType : "XLAB",
			MaximumLength : 10,
			TranslationHint : "Very Nice"
		});
		this.textPool.setTextAsPromise("Label3", {
			TextElementType : "XLAB",
			MaximumLength : 11,
			TranslationHint : "Nice"
		});
		var labelTexts = this.textPool.getTextsByTypeAndLength('XLAB', 10);
		assert.equal(labelTexts.length, 2, "Expected Number of labels");
		assert.equal(labelTexts[0].TextElementDescription, "Label1", "Expected Description");
		assert.equal(labelTexts[1].TextElementDescription, "Label2", "Expected Description");
	});
	QUnit.test("Export Texts", function(assert) {
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern : "yyyy/MM/dd HH:mm:ss"
		});
		function getDate(millisecondsSince1970) {
			var oDate = new Date(millisecondsSince1970);
			return oDateFormat.format(oDate);
		}
		var fileString = this.textPool.exportTexts("NameOfAnalyticalConfiguration");
		var expectedPropertyFile = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + this.expectedUuid + "\n" + "#ApfApplicationId=" + this.ApplicationId + "\n\n" + "#XLAB,15:Hint\n" + "343EC63F05550175E10000000A445B6D=uniqueLabelText\n"
		+ "# LastChangeDate=" + getDate(1412690202721) + "\n\n" + "#XTIT,30:Hint\n" + "143EC63F05550175E10000000A445B6D=TITLE1\n" + "# LastChangeDate=" + getDate(1412692222731) + "\n\n" + "#XTIT,30:Hint\n"
		+ "243EC63F05550175E10000000A445B6D=TITLE2\n" + "# LastChangeDate=" + getDate(1412692229733) + "\n\n"
		+ "#XTIT,250\nAnalyticalConfigurationName=NameOfAnalyticalConfiguration\n# LastChangeDate";
		assert.ok(fileString.search(expectedPropertyFile) > -1, "Text property file as expected");
	});
	QUnit.test("Parse a valid text file", function(assert) {
		var i;
		var fileString = this.textPool.exportTexts("NameOfAnalyticalConfiguration");
		var textFileInformation = sap.apf.utils.parseTextPropertyFile(fileString, {
			instances : {
				messageHandler : this.messageHandler
			}
		});
		assert.equal(textFileInformation.Application, this.ApplicationId, "Correct Application Id extracted from file");
		assert.equal(textFileInformation.TextElements.length, 3, "3 Texts expected");
		var expectedTexts = [ {
			TextElement : "343EC63F05550175E10000000A445B6D",
			Language : "",
			TextElementType : "XLAB",
			TextElementDescription : "uniqueLabelText",
			MaximumLength : 15,
			Application : this.ApplicationId,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412690202721)/"
		}, {
			TextElement : "143EC63F05550175E10000000A445B6D",
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE1",
			MaximumLength : 30,
			Application : this.ApplicationId,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412692222731)/"
		}, {
			TextElement : "243EC63F05550175E10000000A445B6D",
			Language : "",
			TextElementType : "XTIT",
			TextElementDescription : "TITLE2",
			MaximumLength : 30,
			Application : this.ApplicationId,
			TranslationHint : "Hint",
			LastChangeUTCDateTime : "/Date(1412692229733)/"
		} ];
		// test properties, that must be equal:
		for(i = 0; i < 3; i++) {
			for( var property in [ 'TextElement', 'Language', 'TextElementType', 'MaximumLength', 'Application', 'TranslationHing' ]) {
				assert.equal(textFileInformation.TextElements[i][property], expectedTexts[i][property], "Text Element Entry has valid property " + property);
			}
			assert.equal(textFileInformation.TextElements[i].LastChangeUTCDateTime.substring(0, 15), expectedTexts[i].LastChangeUTCDateTime.substring(0, 15), "Last Change date does not differ up to the seconds");
		}
	});
	QUnit.test("Parse text property file with missing apf application id", function(assert) {
		var propertyFile = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + this.expectedUuid + "\n" + "#XLAB,15:Hint\n" + "343EC63F05550175E10000000A445B6D=uniqueLabelText\n" + "# LastChangeDate=2014/10/07 15:56:42\n\n"
		+ "#XTIT,30:Hint\n" + "143EC63F05550175E10000000A445B6D=TITLE1\n" + "# LastChangeDate=2014/10/07 16:30:22\n\n" + "#XTIT,30:Hint\n" + "243EC63F05550175E10000000A445B6D=TITLE2\n" + "# LastChangeDate=2014/10/07 16:30:29\n\n";
		var textFileInformation = sap.apf.utils.parseTextPropertyFile(propertyFile, {
			instances : {
				messageHandler : this.messageHandler
			}
		});
		assert.equal(textFileInformation.Messages[0].code, 5410, "Expected error message");
	});
	QUnit.test("Parse text property file with missing entry", function(assert) {
		var propertyFile = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + this.expectedUuid + "\n" + "#ApfApplicationId=" + this.ApplicationId + "\n\n" + "#XLAB,15:Hint\n" + "343EC63F05550175E10000000A445B6D=uniqueLabelText\n"
		+ "# LastChangeDate=2014/10/07 15:56:42\n\n" + "#XTIT,30:Hint\n" + "#XTIT,30:Hint\n" + "243EC63F05550175E10000000A445B6D=TITLE2\n" + "# LastChangeDate=2014/10/07 16:30:29\n\n";
		var textFileInformation = sap.apf.utils.parseTextPropertyFile(propertyFile, {
			instances : {
				messageHandler : this.messageHandler
			}
		});
		assert.equal(textFileInformation.Messages[0].code, 5411, "Expected error message");
	});
	QUnit.test("Parse text property file with wrong guid format for TextElement", function(assert) {
		var propertyFile = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + this.expectedUuid + "\n" + "#XLAB,15:Hint\n" + "343EC63F05550175E10000000A445B6D=uniqueLabelText\n" + "# LastChangeDate=2014/10/07 15:56:42\n\n"
		+ "#XTIT,30:Hint\n" + "14ZEC63F05550175E10000000A445B6D=TITLE1\n" //letter Z is not valid
		+ "# LastChangeDate=2014/10/07 16:30:22\n\n" + "#XTIT,30:Hint\n" + "2EC63F05550175E10000000A445B6D=TITLE2\n" //too short
		+ "# LastChangeDate=2014/10/07 16:30:29\n\n";
		var textFileInformation = sap.apf.utils.parseTextPropertyFile(propertyFile, {
			instances : {
				messageHandler : this.messageHandler
			}
		});
		assert.equal(textFileInformation.Messages[0].code, 5412, "Expected error message");
		assert.equal(textFileInformation.Messages[1].code, 5412, "Expected error message");
	});
	QUnit.test("Special char = ", function(assert){
		var textEntryWithQuotedEqual = "Text2 \= Text2";
		var textEntryWithUnquotedEqual = "NameOfAnalyticalConfiguration = Unknown";
		var propertyFile = "#FIORI: insert Fiori-Id\n" 
			+ "# __ldi.translation.uuid=" + this.expectedUuid + "\n"
			+ "#ApfApplicationId=" + this.ApplicationId + "\n\n"
			+ "#XLAB,15:Hint\n"
			+ "343EC63F05550175E10000000A445B6D=uniqueLabelText\n" 
			+ "# LastChangeDate=2014/10/07 15:56:42\n\n"
			+ "#XTIT,30:Hint\n" 
			+ "14AEC63F05550175E10000000A445B6D=" + textEntryWithQuotedEqual  + "\n"
			+ "# LastChangeDate=2014/10/07 16:30:22\n\n"
			+ "#XTIT,30:Hint\n" 
			+ "2EC63F05550175E10000000A445B6D23=" + textEntryWithUnquotedEqual + "\n"
			+ "# LastChangeDate=2014/10/07 16:30:29\n\n";

		var textFileInformation = sap.apf.utils.parseTextPropertyFile(propertyFile, {
			instances : {
				messageHandler : this.messageHandler
			}
		});
		assert.equal(textFileInformation.Messages.length, 0, "THEN noerror message");
		assert.equal(textFileInformation.TextElements.length, 3, "THEN 3 entries detected");
		assert.equal(textFileInformation.TextElements[1].TextElementDescription, textEntryWithQuotedEqual, "THEN entry is returned");
		assert.equal(textFileInformation.TextElements[2].TextElementDescription, textEntryWithUnquotedEqual, "THEN entry is returned");
	});
	QUnit.test("Entry after the AnalyticalConfigurationName", function(assert){
		var propertyFile = "#FIORI: insert Fiori-Id\n" 
			+ "# __ldi.translation.uuid=" + this.expectedUuid + "\n"
			+ "#ApfApplicationId=" + this.ApplicationId + "\n\n"
			+ "#XLAB,15:Hint\n"
			+ "343EC63F05550175E10000000A445B6D=uniqueLabelText\n" 
			+ "# LastChangeDate=2014/10/07 15:56:42\n\n"
			+ "#XTIT,30:Hint\n" 
			+ "14AEC63F05550175E10000000A445B6D=TITLE1\n"
			+ "# LastChangeDate=2014/10/07 16:30:22\n\n"
			+ "#XTIT,40\n" 
			+ "AnalyticalConfigurationName=NameOfAnalyticalConfiguration\n"
			+ "# LastChangeDate=2014/10/07 16:30:22\n\n"
			+ "#XTIT,30:Hint\n" 
			+ "2EC63F05550175E10000000A445B6D23=TITLE2\n"
			+ "# LastChangeDate=2014/10/07 16:30:29\n\n";
		var textFileInformation = sap.apf.utils.parseTextPropertyFile(propertyFile, {
			instances : {
				messageHandler : this.messageHandler
			}
		});
		assert.equal(textFileInformation.Messages.length, 0, "THEN noerror message");
		assert.equal(textFileInformation.TextElements.length, 3, "THEN 3 entries detected");
	});

	QUnit.module("M: Error wrong Application Id during export of textPool", {
		beforeEach : function(assert) {
			this.expectedUuid = "<please enter valid translation uuid, if you want to upload into a SAP translation system>";
			this.ApplicationId = "BadGuid";
			commonSetupTextPool(assert, this, this.ApplicationId, this.expectedUuid);
		}
	});
	QUnit.test("Export Texts", function(assert) {
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern : "yyyy/MM/dd HH:mm:ss"
		});
		function getDate(millisecondsSince1970) {
			var oDate = new Date(millisecondsSince1970);
			return oDateFormat.format(oDate);
		}
		var fileString = this.textPool.exportTexts("NameOfAnalyticalConfiguration");
		var expectedPropertyFile = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + this.expectedUuid + "\n" + "#ApfApplicationId=" + this.ApplicationId + "\n\n" + "#XLAB,15:Hint\n" + "343EC63F05550175E10000000A445B6D=uniqueLabelText\n"
		+ "# LastChangeDate=" + getDate(1412690202721) + "\n\n" + "#XTIT,30:Hint\n" + "143EC63F05550175E10000000A445B6D=TITLE1\n" + "# LastChangeDate=" + getDate(1412692222731) + "\n\n" + "#XTIT,30:Hint\n"
		+ "243EC63F05550175E10000000A445B6D=TITLE2\n" + "# LastChangeDate=" + getDate(1412692229733) + "\n\n"
		+ "#XTIT,250\nAnalyticalConfigurationName=NameOfAnalyticalConfiguration";
		assert.ok(fileString.search(expectedPropertyFile) > -1, "Text property file as expected");
		assert.equal(this.messageHandler.spyResults.putMessage.code, 5409, "Technical Error has been logged");
	});
	QUnit.module("M: Error missing format during export of textPool", {
		beforeEach : function() {
			this.ApplicationId = "543EC63F05550175E10000000A445B6D";
			this.expectedUuid = "543ec63f-0555-0175-e100-00000a445b6d";
			this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging().spyPutMessage();
			this.texts = [ {
				TextElement : "143EC63F05550175E10000000A445B6D",
				Language : "",
				TextElementType : "",
				TextElementDescription : "TITLE1",
				MaximumLength : 30,
				Application : this.ApplicationId,
				TranslationHint : "Hint",
				LastChangeUTCDateTime : "/Date(1412692222731)/"
			}, {
				TextElement : "243EC63F05550175E10000000A445B6D",
				Language : "",
				TextElementType : "XTIT",
				TextElementDescription : "TITLE2",
				MaximumLength : "",
				Application : this.ApplicationId,
				TranslationHint : "Hint",
				LastChangeUTCDateTime : "/Date(1412692229733)/"
			}, {
				TextElement : "343EC63F05550175E10000000A445B6D",
				Language : "",
				TextElementType : "XLAB",
				TextElementDescription : "uniqueLabelText",
				MaximumLength : 15,
				Application : this.ApplicationId,
				TranslationHint : "Hint",
				LastChangeUTCDateTime : "/Date(1412690202721)/"
			} ];
			var guidCounter = 0;
			this.odataProxy = {
					create : function(type, data, callback) {
						guidCounter++;
						data.TextElement = "newGuid" + guidCounter;
						callback(data, {
							meta : "data"
						}, undefined);
					}
			};
			this.inject = {
					instances : {
						messageHandler : this.messageHandler,
						persistenceProxy : this.odataProxy
					},
					constructors : {
						Hashtable : sap.apf.utils.Hashtable
					}
			};
			this.textPool = new sap.apf.modeler.core.TextPool(this.inject, this.ApplicationId, this.texts);
		}
	});
	QUnit.test("Export Texts", function(assert) {
		var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
			pattern : "yyyy/MM/dd HH:mm:ss"
		});
		function getDate(millisecondsSince1970) {
			var oDate = new Date(millisecondsSince1970);
			return oDateFormat.format(oDate);
		}
		var fileString = this.textPool.exportTexts("NameOfAnalyticalConfiguration");
		var expectedPropertyFile = "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + this.expectedUuid + "\n" + "#ApfApplicationId=" + this.ApplicationId + "\n\n" + "#XLAB,15:Hint\n" + "343EC63F05550175E10000000A445B6D=uniqueLabelText\n"
		+ "# LastChangeDate=" + getDate(1412690202721) + "\n\n" + "#<Add text type>,30:Hint\n" + "143EC63F05550175E10000000A445B6D=TITLE1\n" + "# LastChangeDate=" + getDate(1412692222731) + "\n\n" + "#XTIT,<Add maximum length>:Hint\n"
		+ "243EC63F05550175E10000000A445B6D=TITLE2\n" + "# LastChangeDate=" + getDate(1412692229733) + "\n\n"
		+ "#XTIT,250\nAnalyticalConfigurationName=NameOfAnalyticalConfiguration";
		assert.ok(fileString.search(expectedPropertyFile) > -1, "Text property file as expected");
		assert.equal(this.messageHandler.spyResults.putMessage.code, 5408, "Technical Error has been logged");
	});
	QUnit.module("M: Read exported text bundle with UI5 ressource bundle mechanismn", {
		beforeEach : function(assert) {
			commonSetupTextPool(assert, this, this.ApplicationId, this.expectedUuid);
			this.url = '/path/to/property/file.properties';
			this.server = sinon.fakeServer.create();
			var fileString = this.textPool.exportTexts("NameOfAnalyticalConfiguration");
			this.server.respondWith(this.url, fileString);
		},
		afterEach : function() {
			this.server.restore();
		}
	});
	QUnit.test("Export texts and check, whether UI5 can read those texts from ressourcebundle", function(assert) {
		var bundle = ResourceBundle.create({
			url : this.url,
			includeInfo : false
		});
		var text = bundle.getText("343EC63F05550175E10000000A445B6D");
		assert.equal(text, "uniqueLabelText", "Text could be retrieved with UI5 bundle <" + text + ">");
	});
	QUnit.module("M: TextPool - delete texts by guid", {
		beforeEach : function(assert) {
			var assertRemoveOperationIsOk = function(batchRequests, callback) {
				var expectedBatchRequests = [ {
					"entitySetName" : "texts",
					"inputParameters" : [ {
						"name" : "TextElement",
						"value" : "143EC63F05550175E10000000A445B6D"
					}, {
						"name" : "Language",
						"value" : ""
					} ],
					"method" : "DELETE"
				}, {
					"entitySetName" : "texts",
					"inputParameters" : [ {
						"name" : "TextElement",
						"value" : "243EC63F05550175E10000000A445B6D"
					}, {
						"name" : "Language",
						"value" : ""
					} ],
					"method" : "DELETE"
				} ];
				assert.deepEqual(batchRequests, expectedBatchRequests, "Expected structure of batch request");
				callback(undefined);
			};
			commonSetupTextPool(assert, this, undefined, undefined, assertRemoveOperationIsOk);
		}
	});
	QUnit.test("remove 2 texts from textPool", 6, function(assert) {
		var that = this;
		var done = assert.async();
		var textToBeRemoved1 = this.textPool.get("143EC63F05550175E10000000A445B6D");
		assert.equal(textToBeRemoved1.TextElement, "143EC63F05550175E10000000A445B6D", "Text exists in text pool");
		var textToBeRemoved2 = this.textPool.get("243EC63F05550175E10000000A445B6D");
		assert.equal(textToBeRemoved2.TextElement, "243EC63F05550175E10000000A445B6D", "Text exists in text pool");
		var assertTextPoolIsCleared = function(messageObject) {
			assert.equal(messageObject, undefined);
			textToBeRemoved1 = that.textPool.get("143EC63F05550175E10000000A445B6D");
			assert.equal(textToBeRemoved1.TextElementDescription, "143EC63F05550175E10000000A445B6D", "Text is no longer available in run time (too)");
			textToBeRemoved2 = that.textPool.get("243EC63F05550175E10000000A445B6D");
			assert.equal(textToBeRemoved2.TextElementDescription, "243EC63F05550175E10000000A445B6D", "Text is no longer available in run time (too)");
			done();
		};
		this.textPool.removeTexts([ textToBeRemoved1.TextElement, textToBeRemoved2.TextElement ], "applicationguid", assertTextPoolIsCleared);
	});
	QUnit.module("M: TextPool on Cloud Foundry - delete texts by guid", {
		beforeEach : function(assert) {
			var assertRemoveOperationIsOk = function(batchRequests, callback) {
				var expectedBatchRequests = [ {
					"entitySetName" : "texts",
					"inputParameters" : [ {
						"name" : "TextElement",
						"value" : "143EC63F05550175E10000000A445B6D"
					}, {
						"name" : "Language",
						"value" : ""
					} ],
					"method" : "DELETE"
				}, {
					"entitySetName" : "texts",
					"inputParameters" : [ {
						"name" : "TextElement",
						"value" : "243EC63F05550175E10000000A445B6D"
					}, {
						"name" : "Language",
						"value" : ""
					} ],
					"method" : "DELETE"
				} ];
				assert.deepEqual(batchRequests, expectedBatchRequests, "Expected structure of batch request");
				callback(undefined);
			};
			this.isUsingCloudFoundryProxy = true;
			commonSetupTextPool(assert, this, undefined, undefined, assertRemoveOperationIsOk);
		}
	});
	QUnit.test("remove 2 texts from textPool", 6, function(assert) {
		var that = this;
		var done = assert.async();
		var textToBeRemoved1 = this.textPool.get("143EC63F05550175E10000000A445B6D");
		assert.equal(textToBeRemoved1.TextElement, "143EC63F05550175E10000000A445B6D", "Text exists in text pool");
		var textToBeRemoved2 = this.textPool.get("243EC63F05550175E10000000A445B6D");
		assert.equal(textToBeRemoved2.TextElement, "243EC63F05550175E10000000A445B6D", "Text exists in text pool");
		var assertTextPoolIsCleared = function(messageObject) {
			assert.equal(messageObject, undefined);
			textToBeRemoved1 = that.textPool.get("143EC63F05550175E10000000A445B6D");
			assert.equal(textToBeRemoved1.TextElementDescription, "143EC63F05550175E10000000A445B6D", "Text is no longer available in run time (too)");
			textToBeRemoved2 = that.textPool.get("243EC63F05550175E10000000A445B6D");
			assert.equal(textToBeRemoved2.TextElementDescription, "243EC63F05550175E10000000A445B6D", "Text is no longer available in run time (too)");
			done();
		};
		this.textPool.removeTexts([ textToBeRemoved1.TextElement, textToBeRemoved2.TextElement ], "applicationguid", assertTextPoolIsCleared);
	});
});
