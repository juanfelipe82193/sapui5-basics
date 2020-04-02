/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit"
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

	QUnit.module("Visibility of Notification Bar");

	QUnit.asyncTest("Checking if Notification Bar is shown on claiming a task", function(assert) {
		var delayedCall = function() {
			var oNotificationBar = sap.ui.getCore().getControl("inbox--notificationBar");
			assert.ok( oNotificationBar != undefined, "Checking if Notification Bar is not undefined.");
			QUnit.start();
		};
		setTimeout(delayedCall, 300);

	});

	QUnit.asyncTest("Checking if Notification Bar is shown on claiming a task", function(assert) {

		qutils.triggerMouseEvent("inbox--listViewTable-rowsel3", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			var oActionToolbarItems = oActionToolbar.getItems();
			assert.equal(oActionToolbarItems[1].getEnabled(), true, "Checking if first custom action is Approve");
			QUnit.start();
		};
		setTimeout(delayedCall, 300);

	});

	QUnit.asyncTest("Checking if Notification Bar is shown on claiming a task", function(assert) {

		qutils.triggerMouseEvent("inbox--claimActionButton", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {
			var oNotificationBar = sap.ui.getCore().getControl("inbox--notificationBar");
			var oMessageNotifier = oNotificationBar.getMessageNotifier();
			assert.ok(jQuery.sap.byId("inbox--notificationBar").length > 0, "Checking if Notification Bar is created and is not undefined.");
			assert.equal(oMessageNotifier.getMessages().length, 1, "Checking if message was created in Notification Bar");
			QUnit.start();
		};
		setTimeout(delayedCall, 300);

	});

	/*	QUnit.asyncTest("Checking if Notification Bar is shown if Search returns no tasks ", function(assert) {
			jQuery.sap.domById("inbox--searchField").focus();
			sap.ui.getCore().getControl("inbox--searchField").setValue("qwerty");

			var delayedCall = function(){
				qutils.triggerKeydown("inbox--searchField", jQuery.sap.KeyCodes.ENTER, false, false, false);
				QUnit.start();
			};
			setTimeout(delayedCall, 1000);


			var delayedCall = function() {
				sap.ui.getCore().applyChanges();
				var oNotificationBar = sap.ui.getCore().getControl("inbox--notificationBar");
				var oMessageNotifier = oNotificationBar.getMessageNotifier();
				var sMessages = [];
				sMessages = oMessageNotifier.getMessages();

				assert.ok(jQuery.sap.byId("inbox--notificationBar").length > 0, "Checking if Notification Bar is created and is not undefined.");
				assert.equal(oMessageNotifier.getMessages().length, 2, "Checking if Two messages are created in Notification Bar ");
				//equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), "No data available ", "Checking if No data available is displayed");
				assert.equal(sMessages[1].getText(),"No data available", "Checking if No Data Available is displayed");


				QUnit.start();
			};
			setTimeout(delayedCall, 1000);



		}); */


	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});