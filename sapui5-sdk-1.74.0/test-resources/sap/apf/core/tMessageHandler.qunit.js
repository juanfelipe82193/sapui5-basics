jQuery.sap.registerModulePath('sap.apf.testhelper', '../testhelper');
jQuery.sap.require('sap.apf.testhelper.doubles.resourcePathHandler');
jQuery.sap.require('sap.apf.testhelper.config.sampleConfiguration');
jQuery.sap.require("sap.apf.core.messageObject");
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.utils.hashtable");
jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.messageDefinition");

(function() {
	'use strict';
QUnit.module('Message Handler', {
	beforeEach : function(assert) {
		this.currentLogLevel = jQuery.sap.log.getLevel();
		jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
		this.oMessageHandler = new sap.apf.core.MessageHandler();
		this.getLogEntries = jQuery.sap.log.getLogEntries;
	},
	afterEach : function(assert) {
		jQuery.sap.log.setLevel(this.currentLogLevel);
	},
	assertMessageInLog : function(assert, nPositionInLog, sMessageText, sComment) {
		var sEqualComment = "";
		var aLogEntries = this.getLogEntries();
		assert.ok(aLogEntries.length > nPositionInLog);
		var sMessage = aLogEntries[nPositionInLog].message;
		assert.ok(sMessage, "a Message exists in log on position " + nPositionInLog);
		var bMessageContained = sMessage.search(sMessageText) > -1;
		if (sComment === undefined) {
			sEqualComment = "log contains " + sMessageText;
		} else {
			sEqualComment = sComment;
		}
		assert.equal(bMessageContained, true, sEqualComment);
	},
	createMessageObjectWithPreviousMessages : function() {
		var oMessageObject = this.oMessageHandler.createMessageObject({
			code : "10000",
			aParameters : [],
			oCallingObject : this
		});
		var oPrevious = this.oMessageHandler.createMessageObject({
			code : "10003",
			aParameters : [],
			oCallingObject : this
		});
		oMessageObject.setPrevious(oPrevious);
		var oLast;
		var i = 0;
		for(i = 0; i < 12; i++) {
			oLast = this.oMessageHandler.createMessageObject({
				code : sap.apf.core.constants.message.code.errorInMessageDefinition,
				aParameters : [],
				oCallingObject : this
			});
			oPrevious.setPrevious(oLast);
			oPrevious = oLast;
		}
		return oMessageObject;
	}
});
QUnit.test("WHEN loadConfig used without reset THEN duplicate error message", function(assert) {
	function assertMessageForDuplicateCode(oMessageObject) {
		var sCode = oMessageObject.getCode();
		assert.equal(sCode, sap.apf.core.constants.message.code.errorExitTriggered);
		sCode = oMessageObject.getPrevious().getCode();
		assert.equal(sCode, sap.apf.core.constants.message.code.errorInMessageDefinition);
		var sMessage = oMessageObject.getPrevious().getMessage();
		var nFound = sMessage.search("Configuration includes duplicated codes");
		assert.equal((nFound > -1), true, "Duplicate entries");
	}
	var aMessages = [ {
		code : "1",
		severity : "error",
		key : "5001"
	}, {
		code : "2",
		severity : "error",
		key : "5001"
	} ];
	this.oMessageHandler.activateOnErrorHandling(true);
	this.oMessageHandler.setMessageCallback(assertMessageForDuplicateCode);
	try {
		this.oMessageHandler.loadConfig(aMessages);
		this.oMessageHandler.loadConfig(aMessages);
	} catch (oError) {
		assert.equal(oError.message.search(sap.apf.core.constants.message.code.suppressFurtherException) > -1, true, "Correct exception thrown");
	}
});
QUnit.test("WHEN loadConfig used with reset THEN no duplicate error message", function(assert) {
	var nCounterForMessages = 0;
	function assertNoMessageWasPut(oMessageObject) {
		nCounterForMessages++;
	}
	var aMessages = [ {
		code : "1",
		severity : "error",
		key : "5001"
	}, {
		code : "2",
		severity : "error",
		key : "5001"
	} ];
	this.oMessageHandler.activateOnErrorHandling(true);
	this.oMessageHandler.setMessageCallback(assertNoMessageWasPut);
	this.oMessageHandler.loadConfig(aMessages);
	this.oMessageHandler.loadConfig(aMessages, true);
	assert.equal(nCounterForMessages, 0, "No duplicate codes because of reset");
});
QUnit.test('GIVEN single message object by message code WHEN getConfigurationByCode THEN correct oMessageObject returned', function(assert) {
	var oMessageObject = {
		code : "10000",
		severity : "warning",
		rawText : "I am a rawtext warning message",
		type : "message"
	};
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();

	var oMessageObjectFromConfiguration = this.oMessageHandler.getConfigurationByCode("10000");
	assert.deepEqual(oMessageObjectFromConfiguration, oMessageObject, "Correct message object received.");
});
QUnit.test('GIVEN set callback WHEN putMessage THEN callback called', function(assert) {
	var sMessageCode = "";
	var fnCallback = function(oMessageObject) {
		sMessageCode = oMessageObject.getCode();
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "5002",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(sMessageCode, 5002, "Callback executed correctly. Right message code from message handler has been emitted.");

	sMessageCode = "";
	fnCallback = undefined;
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "5002",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(sMessageCode, "", "Message code has not been filled again. No callback was used.");
});
QUnit.test('Message callback for triggering fatal', function (assert) {
	assert.expect(2);
	var messages = [ {
		code : "1",
		severity : "error"
	}, {
		code : "2",
		severity : "fatal"
	} ];
	this.oMessageHandler.loadConfig(messages);
	
	var triggerFatal = function(messageObject){
		assert.equal(messageObject.getCode(), '1', 'Callback with correct message object called');
		
		assert.throws(function() {
			this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
				code : "2"
			}));
		}.bind(this), /APFapf1972/, "The right APF fatal thrown");
	}.bind(this);
	this.oMessageHandler.setCallbackForTriggeringFatal(triggerFatal);
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "1"
	}));
});
QUnit.test('Message callback for triggering fatal, but putMessage() with non-fatal', function (assert) {
	assert.expect(1);
	var messages = [ {
		code : "1",
		severity : "error"
	}, {
		code : "2",
		severity : "warning"
	} ];
	this.oMessageHandler.loadConfig(messages);
	
	var triggerFatal = function(messageObject){
		assert.equal(messageObject.getCode(), '1', 'Callback with correct message object called once - no endless loop');
		this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : "2"
		}));
	}.bind(this);
	this.oMessageHandler.setCallbackForTriggeringFatal(triggerFatal);
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "1"
	}));
});
QUnit.test('WHEN putMessage THEN callback AND proper text in callback', function(assert) {
	var sMessageText = "";
	var fnCallback = function(oMessageObject) {
		sMessageText = oMessageObject.getMessage();
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10000",
		aParameters : [],
		oCallingObject : this
	}));
	// TODO text source hidden
	assert.equal(sMessageText, "I am a rawtext warning message", "Rawtext received. ");
});
QUnit.test('WHEN putMessage and error message without text key THEN callback AND proper text in callback', function(assert) {
	var sMessageText = "";
	var fnCallback = function(oMessageObject) {
		sMessageText = oMessageObject.getMessage();
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	var messageDefinition = [{
		code : "5056",
		severity : "error",
		description : "The text resource locations are missing in the application configuration from {0}"
	}];
	this.oMessageHandler.loadConfig(messageDefinition);
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "5056",
		aParameters : ["somewhere"]

	}));

	assert.equal(sMessageText, "The text resource locations are missing in the application configuration from somewhere", "THEN the description was taken and parameter properly substituted");
});
QUnit.test('Message object in callback', function(assert) {
	var oExpectedMessageObject = this.oMessageHandler.createMessageObject({
		code : "10000",
		aParameters : [],
		oCallingObject : this
	});
	oExpectedMessageObject.setMessage("I am a rawtext warning message");
	var oCallbackMessageObject;
	var fnCallback = function(oMessageObject) {
		oCallbackMessageObject = oMessageObject;
	};
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10000",
		aParameters : [],
		oCallingObject : this
	}));
	assert.deepEqual(oCallbackMessageObject, oExpectedMessageObject, "Complete and correct message object via callback received. ");
});
QUnit.test('Log message to console', function(assert) {
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10000",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(this.getLogEntries().length, nLogEntriesBeforeMessage + 1, "Warning has been logged. ");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "10000 - I am a rawtext warning message", "Correct warning message been logged.");
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage].level, 2, "Logged warning message has correct level.");
	nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10001",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(this.getLogEntries().length, nLogEntriesBeforeMessage + 1, "Message has been logged. ");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "10001 - I am a rawtext error message", "Correct error message been logged.");
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage].level, 1, "Logged error message has correct level.");
	nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10002",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(this.getLogEntries().length, nLogEntriesBeforeMessage + 1, "Error has been logged. ");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "10002 - I am a rawtext error message", "Correct technical error message been logged.");
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage].level, 1, "Logged error message has correct level.");
	nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10003",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(this.getLogEntries().length, nLogEntriesBeforeMessage + 1, "Info has been logged. ");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "10003 - I am a rawtext info message", "Correct info message been logged.");
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage].level, 3, "Logged info message has correct level.");
});
QUnit.test('Log all messages to console already during createMessageObject', function(assert) {
	this.oMessageHandler = new sap.apf.core.MessageHandler(true);
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10000",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(this.getLogEntries().length, nLogEntriesBeforeMessage + 1, "Warning has been logged. ");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "10000 - I am a rawtext warning message", "Correct warning message been logged.");
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage].level, 2, "Logged warning message has correct level.");
	nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10001",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(this.getLogEntries().length, nLogEntriesBeforeMessage + 1, "Message has been logged. ");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "10001 - I am a rawtext error message", "Correct error message been logged.");
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage].level, 1, "Logged error message has correct level.");
	nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10002",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(this.getLogEntries().length, nLogEntriesBeforeMessage + 1, "Error has been logged. ");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "10002 - I am a rawtext error message", "Correct technical error message been logged.");
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage].level, 1, "Logged error message has correct level.");
	nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "10003",
		aParameters : [],
		oCallingObject : this
	}));
	assert.equal(this.getLogEntries().length, nLogEntriesBeforeMessage + 1, "Info has been logged. ");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "10003 - I am a rawtext info message", "Correct info message been logged.");
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage].level, 3, "Logged info message has correct level.");
});
QUnit.test('Message code is not registered', function(assert) {
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "NoRegisteredCode",
		aParameters : [],
		oCallingObject : this
	}));
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "9000", "Log default message as technical error, if message code cannot be found in loaded message configuration.");
	nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : "NoRegisteredCode",
		aParameters : [],
		oCallingObject : this
	}));
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "9000", "Log default message as technical error, if no message configuration is loaded.");
});
QUnit.test('Message code and text for the 900X messages', function(assert) {
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	var sRawText = "raw text";
	assert.throws(function() {
		this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : "9003",
			aParameters : [ "param1" ],
			rawText : sRawText
		}));
	}, Error, "fatal");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "9003 - raw text param1", "Correct number and raw text");
});
QUnit.test('Message code and text for message without code', function(assert) {
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	var sRawText = "raw text";
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		aParameters : [ "param1" ],
		rawText : sRawText
	}));
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "9000 - raw text param1", "Correct number and raw text");
});
QUnit.test('Creation of message with previous message', function(assert) {
	var fnCallback = function(oMessageObject) {
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	var oPrevious = this.oMessageHandler.createMessageObject({
		code : "10003",
		aParameters : [],
		oCallingObject : this
	});
	var oMessageObject = this.oMessageHandler.createMessageObject({
		code : "10000",
		aParameters : [],
		oCallingObject : this
	});
	oMessageObject.setPrevious(oPrevious);
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.putMessage(oMessageObject);
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage - 1, "10000 - I am a rawtext warning message");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage - 2, "10003 - I am a rawtext info message");
});
QUnit.test('Creation of message with many previous messages - only 10 are displayed and handled!', function(assert) {
	var oMessageObject = this.createMessageObjectWithPreviousMessages();
	var fnCallback = function(oMessageObject) {
	};
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.putMessage(oMessageObject);
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage - 1, "10000 - I am a rawtext warning message");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage - 2, "10003 - I am a rawtext info message");
	var aLogEntries = this.getLogEntries();
	var sMessage = aLogEntries[11].message;
	assert.ok(sMessage.search(sap.apf.core.constants.message.code.errorInMessageDefinition) == -1, "not more than 10 messages");
	var logMessages = this.oMessageHandler.getLogMessages();
	assert.equal(logMessages.length, 2, "Only 2 messages returned");
});
QUnit.test('Creation of message with many previous messages with unknown error code', function(assert) {
	var fnCallback = function(oMessageObject) {
	};
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.setMessageCallback(fnCallback);
	var oMessageObject = this.oMessageHandler.createMessageObject({
		code : "10000",
		aParameters : [],
		oCallingObject : this
	});
	var oPrevious = this.oMessageHandler.createMessageObject({
		code : "10003",
		aParameters : [],
		oCallingObject : this
	});
	oMessageObject.setPrevious(oPrevious);
	var oLast;
	var i = 0;
	for(i = 0; i < 12; i++) {
		oLast = this.oMessageHandler.createMessageObject({
			aParameters : [],
			oCallingObject : this
		});
		oPrevious.setPrevious(oLast);
		oPrevious = oLast;
	}
	this.oMessageHandler.putMessage(oMessageObject);
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage - 1, "10000 - I am a rawtext warning message");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage - 2, "10003 - I am a rawtext info message");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage - 3, "9000 - Unknown Error occurred  -");
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage - 10, "9000 - Unknown Error occurred  -");
	var aLogEntries = this.getLogEntries();
	var sMessage = aLogEntries[11].message;
	assert.ok(sMessage.search("9000") == -1, "not more than 10 messages");
});
QUnit.test("Method check leads to exception", function(assert) {
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	try {
		this.oMessageHandler.check(false, "checkMessage");
	} catch (oError) {
		assert.equal(oError.message.search(sap.apf.core.constants.message.code.suppressFurtherException) > -1, true, "Correct exception thrown");
	}
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	assert.equal(this.getLogEntries()[nLogEntriesBeforeMessage - 1].level, 1, "Logged fatal message has correct level.");
});
QUnit.test("Check method true - no message put", function(assert) {
	assert.expect(1);
	var sCode = "nothing";
	var fnCallback = function(oMessageObject) {
		sCode = oMessageObject.getCode();
		var sMessage = oMessageObject.getMessage();
		var bContainsText = sMessage.search("Unexpected internal error") > -1;
		assert.equal(bContainsText, true, "correct message text");
	};
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.check(true, "checkMessage");
	assert.equal(sCode, "nothing", "nothing");
});
QUnit.test("Check method with special code", function(assert) {
	assert.expect(3);
	var sCode = "nothing";
	var sCodeForCheck = "5002";
	var fnCallback = function(oMessageObject) {
		sCode = oMessageObject.getCode();
		assert.equal(sCode, sCodeForCheck, "Correct code expected");
		var sSeverity = oMessageObject.getSeverity();
		var sMessage = oMessageObject.getMessage();
		var bContainsText = sMessage.search("Error in OData request") > -1;
		assert.equal(bContainsText, true, "correct message text");
		assert.equal(sSeverity, sap.apf.core.constants.message.severity.error, "Error expected");
	};
	this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
		instances : {
			messageHandler : this.oMessageHandler
		}
	}).doLoadMessageConfigurations();
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.check(false, "checkMessage", "5002");
});
QUnit.test("WHEN technical error is put, then message callback is not called", function(assert){
	var nLogEntriesBeforeMessage = this.getLogEntries().length;
	var messageHandler = new sap.apf.core.MessageHandler();
	messageHandler.activateOnErrorHandling(true);
	messageHandler.setLifeTimePhaseRunning();
	messageHandler.loadConfig(sap.apf.core.messageDefinition, true);
	var fnCallback = function(messageObject) {
		assert.ok(false, "Message handler should not be called");
	};
	messageHandler.setMessageCallback(fnCallback);
	var messageObject = messageHandler.createMessageObject({ code : 5101, aParameters : [ "aParam"]});
	messageHandler.putMessage(messageObject);
	this.assertMessageInLog(assert, nLogEntriesBeforeMessage, "5101 - Unexpected internal error: aParam. Contact SAP.", "Correct technical message been logged.");
});
QUnit.module('MH TextResourceHandler', {
	beforeEach : function(assert) {
		this.oMessageHandler = new sap.apf.core.MessageHandler();
		this.oResourcePathHandler = new sap.apf.testhelper.doubles.ResourcePathHandler({
			instances : {
				messageHandler : this.oMessageHandler
			}
		}).doLoadMessageConfigurations();
		this.getLogEntries = jQuery.sap.log.getLogEntries;
	},
	afterEach : function(assert) {
	}
});
QUnit.test("Create message if an exception in TextResourceHandler occurs", function(assert) {
	var sMessageCode = "6000";
	var sMessageText = "messageText";
	var fnCallback = function(oMessageObject) {
		sMessageCode = oMessageObject.getCode();
		sMessageText = oMessageObject.getMessage();
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : sMessageCode,
		aParameters : ["Hugo"],
		oCallingObject : this
	}));
	assert.equal(sMessageCode, "6000", "Message code as expected");
	assert.equal(sMessageText, "Data is not available for the Hugo step.", "Message text as expected for an exception in text ressource handler");
});
QUnit.test("Put message in callback function", function(assert) {
	var sMessageCode = "5002";
	var nCallbackCalled = 0;
	var oMessageHandler = this.oMessageHandler;
	var fnCallback = function(oMessageObject) {
		nCallbackCalled++;
		oMessageHandler.putMessage(oMessageHandler.createMessageObject({
			code : "5002",
			aParameters : [ "param1", "param2" ],
			oCallingObject : this
		}));
		sMessageCode = oMessageObject.getCode();
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : sMessageCode,
		aParameters : [ "param1", "param2" ],
		oCallingObject : this
	}));
	assert.equal(nCallbackCalled, 1, "Expect callback only called once");
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
		code : sMessageCode,
		aParameters : [ "param1", "param2" ],
		oCallingObject : this
	}));
	assert.equal(nCallbackCalled, 2, "Expect that callback was called again - reset of error handler works");
});
QUnit.test("WHEN message handler not in startup phase AND non fatal message", function(assert){
		var that = this;
		var sMessageCode = "5002";
		this.messageCallbackWasCalled = false;
		var fnCallback = function(oMessageObject) {
			that.messageCallbackWasCalled = true;
			assert.equal(oMessageObject.getCode(), "5002", "THEN expected code and message is supplied");
		};
		this.oMessageHandler.setMessageCallback(fnCallback);
		this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : sMessageCode,
			aParameters : [],
			oCallingObject : this
		}));
		assert.equal(that.messageCallbackWasCalled, true, "WHEN not in startup phase THEN Message callback called");
		assert.equal(this.oMessageHandler.fatalErrorOccurredAtStartup(), false, "THEN no fatal error at startup");
});
QUnit.test("WHEN message handler in startup phase AND non fatal message", function(assert){
	var that = this;
	var sMessageCode = "5002";
	this.messageCallbackWasCalled = false;
	this.oMessageHandler.setLifeTimePhaseStartup();
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : sMessageCode,
			aParameters : [],
			oCallingObject : this
	}));
	assert.equal(that.messageCallbackWasCalled, false, "WHEN in startup phase THEN Message callback was not called");
	assert.equal(this.oMessageHandler.fatalErrorOccurredAtStartup(), false, "THEN no fatal error at startup is registered");
});
QUnit.test("WHEN message handler not in startup phase AND fatal message", function(assert){
	var that = this;
	var sMessageCode = "5004";
	this.messageCallbackWasCalled = false;
	var fnCallback = function(oMessageObject) {
		that.messageCallbackWasCalled = true;
		assert.equal(oMessageObject.getPrevious().getCode(), "5004", "THEN expected code and message is supplied");
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	assert.throws(function() {
		this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : sMessageCode,
			aParameters : [],
			oCallingObject : this
		}));
	}, Error, "fatal");
	assert.equal(that.messageCallbackWasCalled, true, "WHEN not in startup phase THEN Message callback called");
	assert.equal(this.oMessageHandler.fatalErrorOccurredAtStartup(), false, "THEN no fatal error at startup");
});
QUnit.test("WHEN message handler in startup phase AND fatal message", function(assert){
	var that = this;
	var sMessageCode = "5004";
	this.messageCallbackWasCalled = false;
	var fnCallback = function(oMessageObject) {
		that.messageCallbackWasCalled = true;
		assert.equal(oMessageObject.getPrevious().getCode(), "5004", "THEN expected code and message is supplied");
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.setLifeTimePhaseStartup();
	assert.throws(function() {
		this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : sMessageCode,
			aParameters : [],
			oCallingObject : this
		}));
	}, Error, "fatal");
	assert.equal(this.messageCallbackWasCalled, true, "WHEN in startup phase THEN Message callback was called");
	assert.equal(this.oMessageHandler.fatalErrorOccurredAtStartup(), true, "THEN fatal error at startup ");
});
QUnit.test("WHEN message handler in shutdown phase with fatal message", function(assert){
	var that = this;
	var sMessageCode = "5004";
	this.callbackWasCalled = false;
	this.oMessageHandler.setLifeTimePhaseShutdown();
	var fnCallback = function(oMessageObject) {
		assert.ok(false, "THEN message callback was called");
		that.callbackWasCalled = true;
	};
	this.oMessageHandler.setMessageCallback(fnCallback);
	this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : sMessageCode,
			aParameters : [],
			oCallingObject : this
		}));
	assert.equal(this.callbackWasCalled, false, "THEN message callback was not called");
});

QUnit.test("WHEN fatal message is raised and caught within try catch block", function(assert){
	assert.expect(2);

	this.oMessageHandler.setLifeTimePhaseRunning();
	var fnCallback = function(oMessageObject) {
		assert.ok(true, "THEN message callback was called");
	};
	this.oMessageHandler.setMessageCallback(fnCallback);

	try {
		this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : "9003",
			aParameters : [ "param1" ],
			rawText : "a text"
		}));
	} catch(error) {
		assert.ok(this.oMessageHandler.isOwnException(error), "THEN the exception is recognized as thrown by message handler instance itself");
	}
});
QUnit.test("WHEN fatal message is raised and caught within try catch block", function(assert){
	assert.expect(2);

	this.oMessageHandler.setLifeTimePhaseRunning();
	var fnCallback = function(oMessageObject) {
		assert.ok(true, "THEN message callback was called");
	};
	this.oMessageHandler.setMessageCallback(fnCallback);

	try {
		this.oMessageHandler.putMessage(this.oMessageHandler.createMessageObject({
			code : "9003",
			aParameters : [ "param1" ],
			rawText : "a text"
		}));
	} catch(error) {
		assert.ok(this.oMessageHandler.isOwnException(error), "THEN the exception is recognized as thrown by message handler instance itself");
	}
});
QUnit.test("WHEN other exception is raised and caught within try catch block", function(assert){
	assert.expect(1);

	this.oMessageHandler.setLifeTimePhaseRunning();
	var fnCallback = function(oMessageObject) {
		assert.ok(false, "THEN message callback should not be involved");
	};
	this.oMessageHandler.setMessageCallback(fnCallback);

	try {
		throw new Error("some exception")
	} catch(error) {
		assert.notOk(this.oMessageHandler.isOwnException(error), "THEN the exception is recognized as NOT thrown by message handler instance itself");
	}
});
QUnit.test("createMessageObject with enrichInfoInMessageObject", function(assert){
	assert.expect(3);
	var messageHandler = new sap.apf.core.MessageHandler();
	var textResourceHandler = {
			getMessageText : function(code, parameters) {
				assert.strictEqual(code, "5042", "Correct code handed to textResourceHandler");
				assert.deepEqual(parameters, ["aParam"], "Correct parameters handed to textResourceHandler");
				return "messageText";
			}
	};
	messageHandler.setTextResourceHandler(textResourceHandler);
	messageHandler.loadConfig(sap.apf.core.messageDefinition, true);
	var messageObject = messageHandler.createMessageObject({ 
		code : 5042,
		aParameters : [ "aParam"],
		enrichInfoInMessageObject: true 
	});
	assert.strictEqual(messageObject.getMessage(), "messageText", "MessageObject enriched with (translated) Message");
});
QUnit.module("MessageHandler without Text Ressources available");
QUnit.test("WHEN error is put, no text ressource handler is loaded", function(assert){

	var messageHandler = new sap.apf.core.MessageHandler();
	messageHandler.activateOnErrorHandling(true);
	messageHandler.setLifeTimePhaseRunning();
	messageHandler.loadConfig(sap.apf.core.messageDefinition, true);
	var fnCallback = function(messageObject) {
		assert.equal(messageObject.getMessage(), "Exception occurred: aParam", "THEN text from description is taken as default");
	};
	messageHandler.setMessageCallback(fnCallback);
	var messageObject = messageHandler.createMessageObject({ code : 5042, aParameters : [ "aParam"]});
	messageHandler.putMessage(messageObject);
});

QUnit.test("WHEN error is put, and text ressource handler raises exception", function(assert){

	var messageHandler = new sap.apf.core.MessageHandler();
	var TextResourceHandler = function() {
		this.getMessageText = function() { throw Error(); };
	};
	messageHandler.activateOnErrorHandling(true);
	messageHandler.setLifeTimePhaseRunning();
	messageHandler.setTextResourceHandler(new TextResourceHandler());
	messageHandler.loadConfig(sap.apf.core.messageDefinition, true);
	var fnCallback = function(messageObject) {
		assert.equal(messageObject.getMessage(), "The app has stopped working due to a technical error.", "THEN text from description is taken as default");
	};
	messageHandler.setMessageCallback(fnCallback);
	var messageObject = messageHandler.createMessageObject({ code : 9001});
	assert.throws(function() {
		messageHandler.putMessage(messageObject);
	}, Error, "THEN fatal error is thrown");
});
}());