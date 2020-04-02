/*global QUnit */
/*eslint no-undef:1, no-unused-vars:1, strict: 1 */
jQuery.sap.require("sap.ui.qunit.QUnitUtils");
jQuery.sap.require("sap.ui.qunit.utils.createAndAppendDiv");
var createAndAppendDiv = sap.ui.require("sap/ui/qunit/utils/createAndAppendDiv");

createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");


jQuery.sap.require("sap.uiext.inbox.controller.InboxController");
jQuery.sap.require("sap.uiext.inbox.controller.InboxControllerAsync");
jQuery.sap.require("sap.uiext.inbox.controller.InboxControllerFactory");

module("Tests for getController method of InboxControllerFactory");
test("Test for getController method when InboxControllerFactory is created with bAsync parameter as false.", function(){
	var oConfig = {};
	oConfig.bAsyncValue = false;
	var oControllerFactory = new sap.uiext.inbox.controller.InboxControllerFactory(oConfig);
	var oController  = oControllerFactory.getController();
	assert.ok(oController instanceof sap.uiext.inbox.controller.InboxController,"Assertion to confirm that the getController method is returning an instance of sap.uiext.inbox.controller.InboxController when InboxControllerFactory is created with value of bAsync as 'false'.");
	assert.ok(!(oController instanceof sap.uiext.inbox.controller.InboxControllerAsync),"Assertion to confirm that the getController method is not returning an instance of sap.uiext.inbox.controller.InboxControllerAsync when InboxControllerFactory is created with value of bAsync as 'false'.");
	});

test("Test for getController method when InboxControllerFactory is created with bAsync parameter as true.", function(){
	var oConfig = {};
	oConfig.bAsyncValue = true;
	var oControllerFactory = new sap.uiext.inbox.controller.InboxControllerFactory(oConfig);
	var oController  = oControllerFactory.getController();
	assert.ok(oController instanceof sap.uiext.inbox.controller.InboxControllerAsync,"Assertion to confirm that the getController method is returning an instance of sap.uiext.inbox.controller.InboxControllerAsync when InboxControllerFactory is created with value of bAsync as 'true'.");
	});

test("Test for getController method when InboxControllerFactory is created with bAsync parameter as string.", function(){
	var oControllerFactory = new sap.uiext.inbox.controller.InboxControllerFactory("abc");
	var oController  = oControllerFactory.getController();
	assert.ok(oController === null,"Assertion to confirm that the getController method is returning null when InboxControllerFactory is created with value of bAsync as 'abc'.");
	});

test("Test for getController method when InboxControllerFactory is created with bAsync parameter as number.", function(){
	var oControllerFactory = new sap.uiext.inbox.controller.InboxControllerFactory(1.25);
	var oController  = oControllerFactory.getController();
	assert.ok(oController === null,"Assertion to confirm that the getController method is returning null when InboxControllerFactory is created with value of bAsync as 1.25.");
	});
