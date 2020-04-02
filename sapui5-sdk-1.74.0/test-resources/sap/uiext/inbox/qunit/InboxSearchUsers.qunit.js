/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit",
	"jquery.sap.keycodes"
], function(qutils, createAndAppendDiv, jQuery, InboxMockServerQUnit) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");

	// setup mock server and inbox control
	InboxMockServerQUnit.setup();


	QUnit.module("Load");

	QUnit.test("InboxCreationOk", function(assert) {
		sap.ui.getCore().applyChanges();
		var oInbox = jQuery.sap.byId("inbox");
		assert.equal(false, (oInbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (oInbox === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});

	QUnit.module("SearchUsers");

	QUnit.asyncTest("CheckIfForwardButton is Enabled on click of Task", function(assert) {
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {

			qutils.triggerMouseEvent("inbox--listViewTable-rowsel0", "click");
			sap.ui.getCore().applyChanges();
			//check if Forward button is enabled
			assert.equal(sap.ui.getCore().getControl("inbox--forwardActionButton").getEnabled(), true, "Forward Button is enabled");
			QUnit.start();

		};
		setTimeout(delayedCall, 500);

	});

	QUnit.asyncTest("Check If Search Users Popup is shown on click of Forward", function(assert) {
		qutils.triggerMouseEvent("inbox--forwardActionButton", "click");
		var delayedCall = function() {
			sap.ui.getCore().applyChanges();

			assert.ok(jQuery.sap.byId("inbox--forwardTasksPopUp").length > 0, "Checking if the Search Users Popup is created and is not undefined.");
			QUnit.start();
		};

		setTimeout(delayedCall, 500);

	});

	QUnit.asyncTest("SearchUsersFailure on Clicking search icon", function(assert) {
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		var sSearchPattern = "fail";
		sap.ui.getCore().getControl("inbox--oSearch").setValue("fail");
		qutils.triggerMouseEvent("inbox--oSearch-tf-searchico", "click");

		var delayedCall = function() {
			sap.ui.getCore().applyChanges();

			//TODO: Failure message should not be displayed here. Needs to be changed once discussed with UX.

			assert.equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), _oBundle.getText("INBOX_MSG_NO_USER_FOUND",[sSearchPattern]), "Correct message text rendered on failure of Search Users");
			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
	});

	QUnit.asyncTest("SearchUsersFailure on pressing Enter", function(assert) {
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		var sSearchPattern = "fail";
		sap.ui.getCore().getControl("inbox--oSearch").setValue("fail");
		qutils.triggerKeyup("inbox--oSearch", jQuery.sap.KeyCodes.ENTER, false, false, false);

		var delayedCall = function() {
			sap.ui.getCore().applyChanges();

			//TODO: Failure message should not be displayed here. Needs to be changed once discussed with UX.

			assert.equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), _oBundle.getText("INBOX_MSG_NO_USER_FOUND",[sSearchPattern]), "Correct message text rendered on failure of Search Users");

			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("Check if first row is not selected if searchUsers returns empty table on Clicking search icon", function(assert) {
		sap.ui.getCore().getControl("inbox--oSearch").setValue("xyz");
		qutils.triggerMouseEvent("inbox--oSearch-tf-searchico", "click");

		var delayedCall = function() {
			var oUserTable = sap.ui.getCore().getControl("inbox--userTable");
			oUserTable.rerender();

			assert.ok(oUserTable.getSelectedIndex() < 0, "The first row in the search results is not selected if no any result is returned");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("Check if first row is not selected if searchUsers returns empty table on pressing Enter", function(assert) {
		sap.ui.getCore().getControl("inbox--oSearch").setValue("xyz");
		qutils.triggerKeyup("inbox--oSearch", jQuery.sap.KeyCodes.ENTER, false, false, false);

		var delayedCall = function() {
			var oUserTable = sap.ui.getCore().getControl("inbox--userTable");
			oUserTable.rerender();

			assert.ok(oUserTable.getSelectedIndex() < 0, "The first row in the search results is not selected if no any result is returned");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("Check if first row is selected if searchUsers returns one result on Clicking search icon", function(assert) {
		sap.ui.getCore().getControl("inbox--oSearch").setValue("tes");
		qutils.triggerMouseEvent("inbox--oSearch-tf-searchico", "click");

		var delayedCall = function() {
			var oUserTable = sap.ui.getCore().getControl("inbox--userTable");
			oUserTable.rerender();

			assert.equal(oUserTable.getSelectedIndex() , 0, "The first row in the search results is selected if one result is returned");
			assert.equal(oUserTable.getRows()[0].getCells()[0].getValue() ,"TestUser",  "Correct Value Rendered in Column 1 for Row 1 in User Table");
			assert.equal(oUserTable.getRows()[0].getCells()[1].getValue() ,"TestUser",  "Correct Value Rendered in Column 2 for Row 1 in User Table");

			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
	});

	QUnit.asyncTest("Check if first row is selected if searchUsers returns one result on pressing Enter", function(assert) {
		sap.ui.getCore().getControl("inbox--oSearch").setValue("tes");
		qutils.triggerKeyup("inbox--oSearch", jQuery.sap.KeyCodes.ENTER, false, false, false);

		var delayedCall = function() {
			var oUserTable = sap.ui.getCore().getControl("inbox--userTable");
			oUserTable.rerender();

			assert.equal(oUserTable.getSelectedIndex() , 0, "The first row in the search results is selected if one result is returned");
			assert.equal(oUserTable.getRows()[0].getCells()[0].getValue() ,"TestUser",  "Correct Value Rendered in Column 1 for Row 1 in User Table");
			assert.equal(oUserTable.getRows()[0].getCells()[1].getValue() ,"TestUser",  "Correct Value Rendered in Column 2 for Row 1 in User Table");

			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("SearchUsers on Clicking search icon", function(assert) {
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		var sSearchPattern = "fail";
		sap.ui.getCore().getControl("inbox--oSearch").setValue("adm");
		qutils.triggerMouseEvent("inbox--oSearch-tf-searchico", "click");

		var delayedCall = function() {
			var oUserTable = sap.ui.getCore().getControl("inbox--userTable");
			assert.ok(oUserTable , "User Table is not undefined");

			//sap.ui.getCore().applyChanges();
			//applychanges() is not working on the PopUp Dialog. Not sure if this is a bug. So calling an explicit rerender on the table, after the binding.
			oUserTable.rerender();

			//check the values rendered in the table
			assert.ok(oUserTable.getRows().length > 0 , "Rows Rendered in User Table");

			assert.equal(oUserTable.getSelectedIndex() , 0, "The first row in the search results is selected if more than one results are returned");
			assert.equal(oUserTable.getRows()[0].getCells()[0].getValue() ,"admin",  "Correct Value Rendered in Column 1 for Row 1 in User Table");
			assert.equal(oUserTable.getRows()[0].getCells()[1].getValue() ,"admin",  "Correct Value Rendered in Column 2 for Row 1 in User Table");

			assert.equal(oUserTable.getRows()[1].getCells()[0].getValue() ,"Administrator",  "Correct Value Rendered in Column 1 for Row 2 in User Table");
			assert.equal(oUserTable.getRows()[1].getCells()[1].getValue() ,"Administrator",  "Correct Value Rendered in Column 2 for Row 2 in User Table");

			sap.ui.getCore().getControl("inbox--oSearch").setValue("");
			assert.equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), _oBundle.getText("INBOX_MSG_FOR_NO_DATA"), "Empty table when searchfield is blank");

			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
	});

	QUnit.asyncTest("SearchUsers on Clicking pressing enter", function(assert) {
		sap.ui.getCore().getControl("inbox--oSearch").setValue("adm");
		qutils.triggerKeyup("inbox--oSearch", jQuery.sap.KeyCodes.ENTER, false, false, false);

		var delayedCall = function() {
			var oUserTable = sap.ui.getCore().getControl("inbox--userTable");
			assert.ok(oUserTable , "User Table is not undefined");

			oUserTable.rerender();

			//check the values rendered in the table
			assert.ok(oUserTable.getRows().length > 0 , "Rows Rendered in User Table");

			assert.equal(oUserTable.getSelectedIndex() , 0, "The first row in the search results is selected if more than one results are returned");
			assert.equal(oUserTable.getRows()[0].getCells()[0].getValue() ,"admin",  "Correct Value Rendered in Column 1 for Row 1 in User Table");
			assert.equal(oUserTable.getRows()[0].getCells()[1].getValue() ,"admin",  "Correct Value Rendered in Column 2 for Row 1 in User Table");

			assert.equal(oUserTable.getRows()[1].getCells()[0].getValue() ,"Administrator",  "Correct Value Rendered in Column 1 for Row 2 in User Table");
			assert.equal(oUserTable.getRows()[1].getCells()[1].getValue() ,"Administrator",  "Correct Value Rendered in Column 2 for Row 2 in User Table");

		//	qutils.triggerMouseEvent("inbox--forwardTasksPopUp-close", "click");

			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("Check if the searchfield is cleared after closing the popup", function(assert) {
		sap.ui.getCore().getControl("inbox--oSearch").setValue("xyz");
		qutils.triggerMouseEvent("inbox--oSearch-tf-searchico", "click");
		qutils.triggerMouseEvent("inbox--forwardTasksPopUp-close", "click");

		var delayedCall = function() {
			qutils.triggerMouseEvent("inbox--forwardActionButton", "click");
			assert.equal(sap.ui.getCore().getControl("inbox--oSearch").getValue(), "","SearchField is reset after closing the popup");
			qutils.triggerMouseEvent("inbox--forwardTasksPopUp-close", "click");
			QUnit.start();
		};
		setTimeout(delayedCall, 600);
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});