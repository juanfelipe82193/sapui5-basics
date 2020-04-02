/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit",
	"sap/ui/core/format/DateFormat",
	"jquery.sap.keycodes"
], function(qutils, createAndAppendDiv, jQuery, InboxMockServerQUnit, DateFormat) {
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

	QUnit.asyncTest("SwitchToStreamView", function(assert) {
		qutils.triggerMouseEvent("inbox--rrViewSelectionButton", "click");
		sap.ui.getCore().applyChanges();
		assert.ok(jQuery.sap.byId("inbox--tasksRowRepeater").get(0), "RowRepeater displayed in Stream View");
		assert.ok(jQuery.sap.byId("inbox--tasksRowRepeater").find(".sapUiRrRow"), "Rows displayed in RowRepeater displayed in Stream View");
		var delayedCall = function() {
			sap.ui.getCore().applyChanges();
			assert.equal(jQuery.sap.byId("inbox--tasksRowRepeater").find(".sapUiRrRow").size(),"5", "5 Rows displayed in RowRepeater displayed in Stream View");
			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.module("Comments");

	QUnit.asyncTest("CheckIfCommentsButtonDisplay", function(assert) {
		assert.ok(jQuery.sap.byId("inbox--tasksRowRepeater-row_0").find("#inbox--commentsSegBtn-inbox--tasksRowRepeater-0"), "Comments button displayed when SupportsComments is true");
		assert.ok(jQuery.sap.byId("inbox--tasksRowRepeater-row_1").find("#inbox--commentsSegBtn-inbox--tasksRowRepeater-1"), "Comments button not displayed when SupportsComments is false");
		assert.ok(jQuery.sap.byId("inbox--tasksRowRepeater-row_2").find("#inbox--commentsSegBtn-inbox--tasksRowRepeater-2"), "Comments button not displayed when SupportsComments is not available");
		QUnit.start();
	});

	QUnit.asyncTest("RetrieveComments", function(assert) {
		qutils.triggerMouseEvent("inbox--commentsSegBtn-inbox--tasksRowRepeater-0", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {
			//Whole Comment section available?
			assert.ok(jQuery.sap.byId("inbox--comments-0").children("section").get(0), "Comment section found for task");

			// number of comments
			assert.equal(jQuery.sap.byId("inbox--comments-0").find(".sapuiextInboxTaskComments").text().slice(0,1), "1", "Text for Number of comments is correct");

			//Testing Comment Feeder section - START
			//Comment Feeder seciontion visible?
			assert.ok(jQuery.sap.byId("inbox--comments-0").find("#inbox--comments-0-InboxTaskCommentFeeder").get(0), "Comment feeder for new comments is visible for the task");
			//No media link resource implementation yet. So checking for default image visibility
			assert.equal(sap.ui.getCore().getControl("inbox--comments-0-InboxTaskCommentFeeder").getThumbnailSrc(), "", "comment feeder thumbnail property is empty");
			//Testing Comment Feeder section - END


			//Check for attributes displayed in comments - START
			//Feeder Image
			//No media link resource implementation yet. So checking for default image visibility
			//equal(jQuery.sap.byId("__comment0-inbox--comments-0-0-thumb").attr("src"), "../../../../../resources/sap/uiext/inbox/themes/" + sap.ui.getCore().getConfiguration().getTheme() + "/img/comments/person_placeholder_48.png", "Default Sender image rendered for comment");
			assert.equal(jQuery.sap.byId("__comment0-inbox--comments-0-0-thumb").attr("src"), "http://localhost/myservice/UserInfoCollection(SAP__Origin='LOCALHOST_C73_00',UniqueName='USER.PRIVATE_DATASOURCE.un:Abhishek')/$value", "Default Sender image rendered for comment");

			/* assert.equal(jQuery.sap.byId("__comment0-inbox--comments-0-0-thumb").attr("alt"), "Kumar, Abhishek", "Correct Alt for Sender Image for Comment"); */

			// date/time
			var sTimestamp = DateFormat.getDateTimeInstance({style : "full"}).format(new Date(1371821677347));
			assert.equal(jQuery.sap.byId("__comment0-inbox--comments-0-0").children(".sapuiextInboxCommentChunkByline").text(), sTimestamp, "Timestamp rendered for comment");

			//Sender Text
			assert.equal(jQuery.sap.byId("__comment0-inbox--comments-0-0").find(".sapuiextInboxCommentSenderText").text(), "Kumar, Abhishek", "Correct sender text rendered for comment");

			//Comment Text
			var iSenderTextLength = jQuery.sap.byId("__comment0-inbox--comments-0-0").find(".sapuiextInboxCommentSenderText").text().length;
			assert.equal(jQuery.sap.byId("__comment0-inbox--comments-0-0").children(".sapuiextInboxCommentText").text().slice(iSenderTextLength + 1), "Super idea", "Proper Comment Text rendered for comment");

			//Check for attributes displayed in comments - END

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("AddComments", function(assert) {
		jQuery.sap.domById("inbox--comments-0-InboxTaskCommentFeeder-input").focus();
		jQuery.sap.byId("inbox--comments-0-InboxTaskCommentFeeder-input").text("Okay done");
		qutils.triggerKeyup("inbox--comments-0-InboxTaskCommentFeeder-input", jQuery.sap.KeyCodes.T, false, false, false);
		qutils.triggerMouseEvent("inbox--comments-0-InboxTaskCommentFeeder-send", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var aComments = sap.ui.getCore().getControl("inbox--comments-0").getComments();
			assert.ok(aComments, "Comments visible after adding a comment");
			assert.equal(aComments.length,"2", "Correct number of Comments - (2) - visible after adding a comment");


			//Check attributes of last added comment via API
			var iLastCommentAdded = aComments.length - 1;
			assert.equal(aComments[iLastCommentAdded].getText(), "Okay done","Comment Text of the added comment");
			assert.equal(aComments[iLastCommentAdded].getSender(), "Kumar, Abhishek","Sender Name of the added comment");
			//No media link resource implementation yet. So checking for default image visibility
			assert.equal(aComments[iLastCommentAdded].getThumbnailSrc(), "http://localhost/myservice/UserInfoCollection(SAP__Origin='LOCALHOST_C73_00',UniqueName='USER.PRIVATE_DATASOURCE.un:Abhishek')/$value","Thunmbnail source of the added comment");


			// number of comments
			assert.equal(jQuery.sap.byId("inbox--comments-0").find(".sapuiextInboxTaskComments").text().slice(0,1), "2", "Text for Number of comments is correct");

			//Testing Comment Feeder section - START
			//Comment Feeder seciontion visible?
			assert.ok(jQuery.sap.byId("inbox--comments-0").find("#inbox--comments-0-InboxTaskCommentFeeder").get(0), "Comment feeder for new comments is visible for the task");
			//No media link resource implementation yet. So checking for default image visibility
			assert.equal(sap.ui.getCore().getControl("inbox--comments-0-InboxTaskCommentFeeder").getThumbnailSrc(), "", "comment feeder thumbnail property is empty");
			//Testing Comment Feeder section - END

			//Check for attributes displayed in newly added comments (DOM)- START
			//Feeder Image
			//No media link resource implementation yet. So checking for default image visibility
			//equal(jQuery.sap.byId("inbox--comments-0-new-1-thumb").attr("src"), "../../../../../resources/sap/uiext/inbox/themes/" + sap.ui.getCore().getConfiguration().getTheme() + "/img/comments/person_placeholder_48.png", "Default Sender image rendered for comment");
			assert.equal(jQuery.sap.byId("inbox--comments-0-new-1-thumb").attr("src"), "http://localhost/myservice/UserInfoCollection(SAP__Origin='LOCALHOST_C73_00',UniqueName='')/$value", "Default Sender image rendered for comment");
			/* assert.equal(jQuery.sap.byId("inbox--comments-0-new-1-thumb").attr("alt"), "Kumar, Abhishek", "Correct Alt for Sender Image for Comment"); */

			// date/time
			//TODO: Timestamp is currently not bound from the addComment response. So the timestamp might change. Commenting out and needs to be added when this is fixes
			var sTimestamp = DateFormat.getDateTimeInstance({style : "full"}).format(new Date(1372261883107));
			assert.equal(jQuery.sap.byId("inbox--comments-0-new-1").children(".sapuiextInboxCommentChunkByline").text(), sTimestamp, "Timestamp rendered for newly added comment");

			//Sender Text
			assert.equal(jQuery.sap.byId("inbox--comments-0-new-1").find(".sapuiextInboxCommentSenderText").text(), "Kumar, Abhishek", "Correct sender text rendered for comment");

			//Comment Text
			var iSenderTextLength = jQuery.sap.byId("inbox--comments-0-new-1").find(".sapuiextInboxCommentSenderText").text().length;
			assert.equal(jQuery.sap.byId("inbox--comments-0-new-1").children(".sapuiextInboxCommentText").text().slice(iSenderTextLength + 1), "Okay done", "Proper Comment Text rendered for comment");

			//proper message displayed

			assert.equal(jQuery.sap.byId("inbox--notificationBar-inplaceMessage").text(), "Comment added successfully", "Correct message text rendered for comment");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("LongComment", function(assert) {
		// Check if long comment(>500 characters) is being trimmed
		jQuery.sap.domById("inbox--comments-0-InboxTaskCommentFeeder-input").focus();
		jQuery.sap.byId("inbox--comments-0-InboxTaskCommentFeeder-input").empty();
		// Set long comment
		jQuery.sap.byId("inbox--comments-0-InboxTaskCommentFeeder-input").text("Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo ");
		qutils.triggerKeyup("inbox--comments-0-InboxTaskCommentFeeder-input", jQuery.sap.KeyCodes.T, false, false, false);
		qutils.triggerMouseEvent("inbox--comments-0-InboxTaskCommentFeeder-send", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
		var vComments = sap.ui.getCore().getControl("inbox--comments-0").getComments();
		var index = vComments.length - 1;
		assert.equal(vComments[index].getText(), "Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negredo Negr","Comment Text of the added comment");

		QUnit.start();
	};
	setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("HideComments", function(assert) {
		qutils.triggerMouseEvent("inbox--commentsSegBtn-inbox--tasksRowRepeater-0", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {

			//Comment section not available?
			assert.ok(!jQuery.sap.byId("inbox--comments-0").children("section").get(0), "Comment section not found for task");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});