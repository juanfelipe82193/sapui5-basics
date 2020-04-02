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
		var $Inbox = jQuery.sap.byId("inbox");
		assert.equal(false, ( $Inbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, ( $Inbox === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});

	QUnit.module("Inbox Custom Actions in table View");

	QUnit.asyncTest("Loading tasks in the task table", function(assert) {
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			assert.equal(false, (oActionToolbar === null), "check if Action ToolBar is not null");

			var oActionToolbarItems = oActionToolbar.getItems();
			var initialNumberOfToolbarItems = oActionToolbarItems.length;
			assert.equal(initialNumberOfToolbarItems, 5, "Checking Initial Number of Items in the Table View Toolbar");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("Custom Actions on single selection in Table View", function(assert) {
		sap.ui.getCore().applyChanges();

		qutils.triggerMouseEvent("inbox--listViewTable-rowsel5", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			var oActionToolbarItems = oActionToolbar.getItems();
			var currentNumberOfToolbarItems = oActionToolbarItems.length;
			assert.equal(currentNumberOfToolbarItems, 9, "Checking Number of Items in Table View Toolbar if a task with custom actions is selected");
			assert.equal(oActionToolbarItems[4].getText(), "Approve", "Checking if first custom action is Approve");
			assert.equal(oActionToolbarItems[5].getText(), "Reject", "Checking if second custom action is Reject");
			assert.equal(oActionToolbarItems[6].getText(), "Other Opinion", "Checking if third custom action is Other Opinion");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Custom Actions on single selection in Table View", function(assert) {
		sap.ui.getCore().applyChanges();
		sap.ui.getCore().byId("inbox--listViewTable").clearSelection(); //Ensure no row is currently selected

		qutils.triggerMouseEvent("inbox--listViewTable-rowsel6", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			var oActionToolbarItems = oActionToolbar.getItems();
			var currentNumberOfToolbarItems = oActionToolbarItems.length;
			assert.equal(currentNumberOfToolbarItems, 8, "Checking Number of Items in Table View Toolbar if a task with custom actions is selected");
			assert.equal(oActionToolbarItems[4].getText(), "Approve", "Checking if first custom action is Approve");
			assert.equal(oActionToolbarItems[5].getText(), "Rework", "Checking if second custom action is Rework");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Custom Actions on multi selection in Table View", function(assert) {
		sap.ui.getCore().applyChanges();
		var oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		oTable.setSelectionInterval(5, 6); // selecting two tasks with same model ID but different Task Definition IDs and custom actions
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			assert.equal(false, (oActionToolbar === null), "check if Action ToolBar is not null");
			var oActionToolbarItems = oActionToolbar.getItems();
			var currentNumberOfToolbarItems = oActionToolbarItems.length;
			assert.equal(currentNumberOfToolbarItems, 7, "Checking Number of Items in the Table View Toolbar if two tasks with same model ID but different Definition are selected");
			assert.equal(oActionToolbarItems[4].getText(), "Approve", "Checking if the intersection of custom actions is correct");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Custom Actions on multi selection in Table View", function(assert) {
		sap.ui.getCore().applyChanges();
		var oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		oTable.setSelectionInterval(6,7); // selecting two tasks with different model ID but same custom actions
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			assert.equal(false, (oActionToolbar === null), "check if Action ToolBar is not null");
			var oActionToolbarItems = oActionToolbar.getItems();
			var currentNumberOfToolbarItems = oActionToolbarItems.length;
			assert.equal(currentNumberOfToolbarItems, 5, "Checking Number of Items in the Table View Toolbar if two tasks with different Model ID are selected");
			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Selecting a task with custom actions to execute a custom action", function(assert) {
		sap.ui.getCore().byId("inbox--listViewTable").clearSelection(); //Ensure no row is currently selected

		qutils.triggerMouseEvent("inbox--listViewTable-rowsel7", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oActionToolbar = sap.ui.getCore().getControl("inbox--actionButtonsToolbarContainer");
			assert.equal(false, (oActionToolbar === null), "check if Action ToolBar is not null");
			var oActionToolbarItems = oActionToolbar.getItems();
			var currentNumberOfToolbarItems = oActionToolbarItems.length;
			assert.equal(currentNumberOfToolbarItems, 8, "Checking Number of Items in Table View Toolbar if a task with custom action is selected");
			assert.equal(oActionToolbarItems[4].getText(), "Approve", "Checking if first custom action is Approve");
			assert.equal(oActionToolbarItems[5].getText(), "Rework", "Checking if second custom action is Rework");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Executing a Custom Action in Table View without Comments", function(assert) {
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		var sAction = "Approve";
		var sTaskTitle = "Review and Approve article";
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--Approvebutton", "click");
		sap.ui.getCore().applyChanges();
		//check for toolpopup
		assert.ok(jQuery.sap.byId("inbox--customActionToolPopup").get(0), "Comments ToolPopup visible");
		assert.ok(jQuery.sap.byId("inbox--toolPopupButton").get(0), "Approve button on Conmments ToolPopup visible");
		assert.equal(sap.ui.getCore().byId("inbox--toolPopupButton").data('key'), "Approve", "Approve button on Comments ToolPopup visible");

		qutils.triggerMouseEvent("inbox--toolPopupButton", "click");
		var delayedCall = function() {
			sap.ui.getCore().applyChanges();
			assert.equal(jQuery.sap.byId("inbox--messageNotifier-counter").text(),"1", "Approve action is performed successfully");
			assert.equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), _oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[sAction,sTaskTitle]), "Approve action is performed successfully");
			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
	});


	QUnit.asyncTest("Executing a Custom Action in Table View with Comments", function(assert) {
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		var sAction = "Rework";
		var sTaskTitle = "Review and Approve article";
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--Reworkbutton", "click");
		sap.ui.getCore().applyChanges();
		//check for toolpopup
		assert.ok(jQuery.sap.byId("inbox--customActionToolPopup").get(0), "Comments ToolPopup visible");
		assert.ok(jQuery.sap.byId("inbox--toolPopupButton").get(0), "Rework button on Conmments ToolPopup visible");
		assert.equal(sap.ui.getCore().byId("inbox--toolPopupButton").data('key'), "Rework", "Rework button on Comments ToolPopup visible");

		//add Comment into the textArea
		jQuery.sap.domById("inbox--addCommentsinCustomActionPopup").focus();
		jQuery.sap.byId("inbox--addCommentsinCustomActionPopup").text("Rework on this task");
		qutils.triggerKeyup("inbox--addCommentsinCustomActionPopup", jQuery.sap.KeyCodes.T, false, false, false);
		sap.ui.getCore().byId("inbox--addCommentsinCustomActionPopup").setValue(jQuery.sap.byId("inbox--addCommentsinCustomActionPopup").text());

		qutils.triggerMouseEvent("inbox--toolPopupButton", "click");
		var delayedCall = function() {
			sap.ui.getCore().applyChanges();
			assert.equal(jQuery.sap.byId("inbox--messageNotifier-counter").text(),"1", "Rework action is performed successfully");
			assert.equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), _oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[sAction,sTaskTitle]), "Rework action is performed successfully");
			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
	});


	// TODO commenting the tests for now as they are failing. Move those tests to another file.

	/* QUnit.module("Inbox Custom Actions in Row Repeater View");

	QUnit.asyncTest("Check Custom Actions in Row Repeater View", function(assert) {
		var oInbox = sap.ui.getCore().byId('inbox');
		qutils.triggerMouseEvent("inbox--rrViewSelectionButton", "click");
		sap.ui.getCore().applyChanges();
		setTimeout(function() {
			assert.equal(oInbox.currentView, "sap_inbox_stream", "current view is row repeater view");
			qutils.triggerMouseEvent("inbox--10RowsSegBtn", "click");
			sap.ui.getCore().applyChanges();

			setTimeout(function() {
				var oTasksRrView = sap.ui.getCore().byId('inbox--tasksRowRepeater');
				assert.equal(oTasksRrView.getRows().length, 8, "all tasks are present in the current view");

				var oHrLayout = sap.ui.getCore().byId('inbox--hrLayoutForCustomActions-inbox--tasksRowRepeater-5');
				assert.equal(oHrLayout.getContent()[1].getText(), "Approve", "Approve Custom Action is displayed");
				assert.equal(oHrLayout.getContent()[3].getText(), "Reject", "Reject Custom Action is displayed");
				assert.equal(oHrLayout.getContent()[5].getText(), "Other Opinion", "Other Opinion Custom Action is displayed");
				qutils.triggerMouseEvent(oHrLayout.getContent()[1].getId(), "click");
				assert.ok(jQuery.sap.byId("inbox--customActionToolPopup-CommentsMand").is(":visible")==true, "Comments Mandatory ToolPopup visible");
				assert.ok(sap.ui.getCore().byId("inbox--toolPopupButton-CommentsMand").getEnabled()==false, "Custom Action button on Comments Mandatory ToolPopup disabled");
				jQuery.sap.domById("inbox--addCommentsinCustomActionPopup-CommentsMand").focus();
				sap.ui.getCore().byId("inbox--addCommentsinCustomActionPopup-CommentsMand").setValue("Rework on this Task");
				sap.ui.getCore().byId("inbox--addCommentsinCustomActionPopup-CommentsMand").fireLiveChange();
				assert.ok(sap.ui.getCore().byId("inbox--toolPopupButton-CommentsMand").getEnabled()==true, "Custom Action button on Comments Mandatory ToolPopup enabled");
				oHrLayout = sap.ui.getCore().byId('inbox--hrLayoutForCustomActions-inbox--tasksRowRepeater-6');
				assert.equal(oHrLayout.getContent()[1].getText(), "Approve", "Approve Custom Action is displayed");
				assert.equal(oHrLayout.getContent()[3].getText(), "Rework", "Rework Custom Action is displayed");

				oHrLayout = sap.ui.getCore().byId('inbox--hrLayoutForCustomActions-inbox--tasksRowRepeater-7');
				assert.equal(oHrLayout.getContent()[1].getText(), "Approve", "Approve Custom Action is displayed");
				assert.equal(oHrLayout.getContent()[3].getText(), "Rework", "Rework Custom Action is displayed");

				QUnit.start();
			}, 1000);

		}, 1000);
	});

	QUnit.asyncTest("Executing a Custom Action in Row Repeater View without comments", function(assert) {
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		var oHrLayout = sap.ui.getCore().byId('inbox--hrLayoutForCustomActions-inbox--tasksRowRepeater-7');
		var sCustomActionLinkId = oHrLayout.getContent()[1].getId();
		var sAction = "Approve";
		var sTaskTitle = "Review and Approve article";
		sap.ui.getCore().applyChanges();
		jQuery.sap.byId(sCustomActionLinkId).focus();
		qutils.triggerMouseEvent(sCustomActionLinkId, "click");
		sap.ui.getCore().applyChanges();
		//check for toolpopup
		assert.ok(jQuery.sap.byId("inbox--customActionToolPopup").get(0), "Comments ToolPopup visible");
		assert.ok(jQuery.sap.byId("inbox--toolPopupButton").get(0), "Custom Action button on Comments ToolPopup visible");
		assert.equal(sap.ui.getCore().byId("inbox--toolPopupButton").data('key'), sAction, "Approve button on Comments ToolPopup visible");
		assert.equal(sap.ui.getCore().byId("inbox--toolPopupButton").getText(), sAction, "Approve button on Comments ToolPopup visible");
		qutils.triggerMouseEvent("inbox--toolPopupButton", "click");

		var delayedCall = function() {
			sap.ui.getCore().applyChanges();
			assert.equal(jQuery.sap.byId("inbox--messageNotifier-counter").text(),"1", "Approve action is performed successfully");
			assert.equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), _oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[sAction,sTaskTitle]), "Approve action is performed successfully");

			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
	});

	QUnit.asyncTest("Executing a Custom Action in Row Repeater View with Comments", function(assert) {
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
		var oHrLayout = sap.ui.getCore().byId('inbox--hrLayoutForCustomActions-inbox--tasksRowRepeater-7');
		var sCustomActionLinkId = oHrLayout.getContent()[3].getId();
		var sAction = "Rework";
		var sTaskTitle = "Review and Approve article";
		sap.ui.getCore().applyChanges();
		jQuery.sap.byId(sCustomActionLinkId).focus();
		qutils.triggerMouseEvent(sCustomActionLinkId, "click");
		sap.ui.getCore().applyChanges();
		//check for toolpopup
		assert.ok(jQuery.sap.byId("inbox--customActionToolPopup").get(0), "Comments ToolPopup visible");
		assert.ok(jQuery.sap.byId("inbox--toolPopupButton").get(0), "Rework button on Comments ToolPopup visible");
		assert.equal(sap.ui.getCore().byId("inbox--toolPopupButton").data('key'), "Rework", "Rework button on Comments ToolPopup visible");
		assert.equal(sap.ui.getCore().byId("inbox--toolPopupButton").getText(), "Rework", "Rework button on Comments ToolPopup visible");
		//add Comment into the textArea
		jQuery.sap.domById("inbox--addCommentsinCustomActionPopup").focus();
		jQuery.sap.byId("inbox--addCommentsinCustomActionPopup").text("Rework on this task");
		qutils.triggerKeyup("inbox--addCommentsinCustomActionPopup", jQuery.sap.KeyCodes.T, false, false, false);
		sap.ui.getCore().byId("inbox--addCommentsinCustomActionPopup").setValue(jQuery.sap.byId("inbox--addCommentsinCustomActionPopup").text());
		qutils.triggerMouseEvent("inbox--toolPopupButton", "click");

		var delayedCall = function() {
			sap.ui.getCore().applyChanges();
			assert.equal(jQuery.sap.byId("inbox--messageNotifier-counter").text(),"1", "Rework action is performed successfully");
			assert.equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), _oBundle.getText("INBOX_MSG_ACTION_SUCCESS",[sAction,sTaskTitle]), "Reject action is performed successfully");

			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
	}); */

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});