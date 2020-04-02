/**
 * HL March 15.03.2014
 * TODO
 * It is not valid in UI5 as it should not rely on jQuery(document).ready(function()
 * Needs to be reworked or moved to a different location.
 * The unit under test is unclear.
 */

// this cannot be done as qunit test, because the asserts are caught
(function() {
	'use strict';

var TestHelper = function() {
	var that = this;
	this.hasBeenCalled = false;
	this.doMessageHandling = function(oMessage) {
		that.hasBeenCalled = true;
		jQuery("#messages").append("Callback function, that should display the messages, has been called");
		jQuery("#messages").append(" Code:" + oMessage.getCode() + " Text : " + "'" + oMessage.getMessage() + "'");
		throw new Error("APFapf1972");
	};
};

function executeTest() {
	sap.apf.core.check = function(booleExpr, sMessage, sCode) {
		if (!booleExpr) {
			throw new Error(sMessage);
		}
	};
	sap.apf.core.getUriGenerator = function() {
		return sap.apf.core.utils.uriGenerator;
	};
    this.fnCheckForTimeout = sap.apf.core.checkForTimeout;
    sap.apf.core.checkForTimeout = function(jqXHR) {
           return undefined;
    };
	var oResourcePathHandler = new sap.apf.core.ResourcePathHandler();
	sap.apf.core.getResourceLocation = function(sId) {
		return oResourcePathHandler.getResourceLocation(sId);
	};
	var oMessageHandler = new sap.apf.core.MessageHandler();
	sap.apf.core.loadMessageConfiguration = function(aMessages) {
		oMessageHandler.loadConfig(aMessages);
	};
	sap.apf.core.loadAnalyticalConfiguration = function(oConfig) {
	};
	oResourcePathHandler.loadConfigFromFilePath("/sap.apf.core.test/test-resources/helper/config/applicationConfiguration.json");
	var oHelper = new TestHelper();
	var callbackFunction = oHelper.doMessageHandling;
	oMessageHandler.activateOnErrorHandling(true);
	oMessageHandler.setMessageCallback(callbackFunction);
	// testing, that nothing is triggered, if assertion is ok
	jQuery("#messages").append("Only msg 10002 is expected - look in the log  for '...I am a rawtext error message'- :");
	if (oHelper.hasBeenCalled == true) {
		jQuery("#messages").append("<p>Error registered function has already been called</p>");
	}
	oMessageHandler.putMessage(oMessageHandler.createMessageObject({
		code : "10002",
		params : []
	}));
}


QUnit.module("tMessageHandlerLogging", {

});
QUnit.test("on ready", function(assert){
    executeTest();
    assert.ok(false);
});

}());	
