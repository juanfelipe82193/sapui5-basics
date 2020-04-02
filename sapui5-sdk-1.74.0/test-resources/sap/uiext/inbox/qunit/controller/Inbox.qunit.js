/*global QUnit */
/*eslint no-undef:1, no-unused-vars:1, strict: 1 */
jQuery.sap.require("sap.ui.qunit.QUnitUtils");
jQuery.sap.require("sap.ui.qunit.utils.createAndAppendDiv");
var createAndAppendDiv = sap.ui.require("sap/ui/qunit/utils/createAndAppendDiv");

createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");
createAndAppendDiv("inboxArea");


jQuery.sap.require("sap.uiext.inbox.Inbox");



module("Tests for Inbox control initialization.");
test("Test for Inbox control initialization.", function(){
	var oInbox = new sap.uiext.inbox.Inbox();
	var oController  = oInbox.oController;
	assert.ok(oController instanceof sap.uiext.inbox.controller.InboxController,"Assertion to confirm that Inbox is initialized with a Controller of type sap.uiext.inbox.controller.InboxController");
});

/* QUnit.test("Test for Inbox control destroy.", function(assert) {
	var oInbox = new sap.uiext.inbox.Inbox("inbox1");
	oInbox.placeAt("inboxArea");
	sap.ui.getCore().applyChanges();
	oInbox.destroy();
	assert.ok(sap.ui.getCore().byId("inbox1") === undefined);
	assert.ok(sap.ui.getCore().byId("inbox1__button") === undefined)
}); */


