/*global QUnit */
/*eslint no-undef:1, no-unused-vars:1, strict: 1 */
jQuery.sap.require("sap.ui.qunit.QUnitUtils");
jQuery.sap.require("sap.ui.qunit.utils.createAndAppendDiv");
var createAndAppendDiv = sap.ui.require("sap/ui/qunit/utils/createAndAppendDiv");

createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");


jQuery.sap.require("sap.uiext.inbox.controller.InboxController");



module("Tests for InboxController.");
test("Test for InboxControll initialization.", function(){
	var oInboxController = new sap.uiext.inbox.controller.InboxController();
	assert.ok(oInboxController.getView() === null,"Assertion to confirm that InboxController is initialized with a null view.");
});

/*test("Test for InboxControll.setView with string parameter.", function(){
	var oInboxController = new sap.uiext.inbox.Inbox.controller.InboxController();
	assert.ok(function(){ oInboxController.setView("string"); }, /Invalid argument. Allowed only instance of sap.uiext.inbox.Inbox/,"Assertion to confirm that exception is raised for incorrect view type.");
	assert.ok(oInboxController.getView() === null,"Assertion to confirm that null is returned in case of wrong argument type for setView.");
});

test("Test for InboxControll.setView with sap.uiext.inbox.Inbox", function(){
	var oInboxController = new sap.uiext.inbox.Inbox.controller.InboxController();
	oInboxController.setView(new sap.uiext.inbox.Inbox.view.InboxMainView("inboxMainView1",oInboxController));
	assert.ok(oInboxController.getView() instanceof sap.uiext.inbox.Inbox.view.InboxMainView ,"Assertion to confirm that type of view returned by getView is sap.uiext.inbox.Inbox.view.InboxMainView or its subtype.");
}); */

