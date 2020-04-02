/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/uiext/inbox/composite/InboxComment",
	"sap/uiext/inbox/composite/InboxTaskComments",
	"jquery.sap.global",
	"jquery.sap.keycodes"
], function(qutils, createAndAppendDiv, InboxComment, InboxTaskComments, jQuery) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width:80%;");
	createAndAppendDiv("uiArea2").setAttribute("style", "width:80%;");
	createAndAppendDiv("uiArea3").setAttribute("style", "width:80%;");



	var sSender = "Sender";
	var sChunkSender = "Chunk Sender";
	var sTimestamp = "date/time";
	var sEventSourceId = "";
	var sEvent = "";
	var sEventParameter = "";

	function handleCommentSubmit(oEvent){
		sEventSourceId = oEvent.oSource.getId();
		sEvent = "CommentSubmit";
		sEventParameter = oEvent.getParameter('text');
		oInbxTComm2.addComment(new InboxComment({
			sender: sChunkSender + "3",
			text: "Comment Text 3",
			thumbnailSrc: "../images/feeder/m_01.png",
			timestamp:  sTimestamp
		}));
	}

	var oInbxTComm1 = new InboxTaskComments("Chunk1",{
		feederThumbnailSrc: "../images/feeder/w_01.png",
		feederSender: "Sender",
		showHeader: true
	}).placeAt("uiArea1");
	oInbxTComm1.attachCommentSubmit(handleCommentSubmit);

	var oInbxTComm2 = new InboxTaskComments("Chunk2",{
			feederThumbnailSrc: "../images/feeder/w_01.png",
			feederSender: "Sender",
			showHeader: true
	}).placeAt("uiArea2");
	oInbxTComm2.attachCommentSubmit(handleCommentSubmit);

	var oInbxTComm3 = new InboxTaskComments("Chunk3",{
		feederThumbnailSrc: "../images/feeder/w_01.png",
		feederSender: "Sender",
		showHeader: false
	}).placeAt("uiArea3");


	oInbxTComm2.addComment(new InboxComment({
		sender: sChunkSender + "1",
		text: "Comment Text",
		thumbnailSrc: "../images/feeder/m_01.png",
		timestamp:  sTimestamp
	}));

	oInbxTComm2.addComment(new InboxComment({
		sender: sChunkSender + "2",
		text: "Comment Text 2",
		thumbnailSrc: "../images/feeder/m_01.png",
		timestamp:  sTimestamp
	}));

	oInbxTComm2.addComment(new InboxComment({
		sender: sChunkSender + "3",
		text: "Comment Text 3",
		thumbnailSrc: "../images/feeder/m_01.png",
		timestamp:  sTimestamp
	}));

	var rb = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");

	QUnit.module("Appearance");

	QUnit.test("FeedChunk styles", function(assert) {
		//without comments
		//ok(!jQuery.sap.byId("Chunk1").children("section").get(0), "No comment section found for Chunk without comments");

		// default comment feeder visible even if comments are not added
		assert.ok(!jQuery.sap.byId("Chunk1").find("#Chunk1-CommentFeeder").get(0), "Defaut comment feeder visible for task Commenter without comments");

		//with comments
		assert.ok(jQuery.sap.byId("Chunk2").children("section").get(0), "Comment section found for Chunk with comments");

		// default comment feeder if comments
		assert.ok(jQuery.sap.byId("Chunk2").find("#Chunk2-InboxTaskCommentFeeder").get(0), "Defaut visible comment feeder for Task Commenter with comments");
		assert.equal(sap.ui.getCore().getControl("Chunk2-InboxTaskCommentFeeder").getThumbnailSrc(), "../images/feeder/w_01.png", "comment feeder thumbnail source");

		//comment
		//ok(!jQuery.sap.byId("commentChunk1").children("section").get(0), "No comment section found for comment-Chunk");

	});

	QUnit.test("Output of Attribute", function(assert) {
		// Feeder sender thumb for task commenter without comments
		assert.equal(jQuery.sap.byId("Chunk1-InboxTaskCommentFeeder-thumb").attr("src"), "../images/feeder/w_01.png", "Feeder Sender image rendered for task commenter without comments");

		//equal(jQuery.sap.byId("__comment2-thumb").attr("src"), "../images/feeder/m_01.png", "Sender image rendered for comment chunk");
		assert.equal(jQuery.sap.byId("__comment2-thumb").attr("src"), "undefined/UserInfoCollection(SAP__Origin='',UniqueName='')/$value", "Sender image rendered for comment chunk");

		// date/time
		assert.equal(jQuery.sap.byId("__comment2").children(".sapuiextInboxCommentChunkByline").text(), sTimestamp, "Timestamp rendered for comment");

		// number of comments
		assert.equal(jQuery.sap.byId("Chunk2").find(".sapuiextInboxTaskComments").text().slice(0,1), "3", "Number of comments displayed");

		// all comments link
		assert.ok(jQuery.sap.byId("Chunk2-all").get(0), "Link to show all comments displayed");

		// comments displayed, by default only 2
		assert.ok(!jQuery.sap.byId("__comment0").get(0) && jQuery.sap.byId("__comment1").get(0) && jQuery.sap.byId("__comment2").get(0), "Only last 2 comments displayed by default");

	});

	QUnit.module("Behaviour");

	QUnit.asyncTest("Add comment", function(assert) {

		jQuery.sap.domById("Chunk2-InboxTaskCommentFeeder-input").focus();
		jQuery.sap.byId("Chunk2-InboxTaskCommentFeeder-input").text("Test");
		qutils.triggerKeyup("Chunk2-InboxTaskCommentFeeder-input", jQuery.sap.KeyCodes.T, false, false, false);
		qutils.triggerMouseEvent("Chunk2-InboxTaskCommentFeeder-send", "click");
		assert.equal(sEvent, "CommentSubmit", "event fired on adding a new comment");
		assert.equal(sEventSourceId, "Chunk2", "Event on right ID");
		var aComments = oInbxTComm2.getComments();
		/* var iLastComment = aComments.length-1;
		assert.equal(sEventParameter, aComments[iLastComment].getText(), "comment text returned from event must be the same as the last one in aggregation");
		assert.equal(aComments[iLastComment].getText(), "Test","Text of the comment");
		assert.equal(aComments[iLastComment].getSender(), "Sender","Sender of the comment");
		assert.equal(aComments[iLastComment].getThumbnailSrc(), "../images/feeder/w_01.png","Thunmbnail source of the comment"); */
		sEvent = "";
		sEventSourceId = "";
		sEventParameter = "";

		var delayedCall = function() {
			// new comment must be displayed at last one
			aComments = jQuery.sap.byId("Chunk2").children("section").children("article");
			/* iLastComment = aComments.length-1;
			assert.equal(aComments.get(iLastComment).id, "Chunk2-new-3", "New comment must be the first one"); */

			// comment counter must be increased
			assert.equal(jQuery.sap.byId("Chunk2").find(".sapuiextInboxTaskComments").text().slice(0,1), "4", "Number of comments correct");

			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("show all comments", function(assert) {

		qutils.triggerMouseEvent("Chunk2-all", "click");

		var delayedCall = function() {
			assert.ok(jQuery.sap.byId("__comment3").get(0) && jQuery.sap.byId("__comment0").get(0) && jQuery.sap.byId("__comment1").get(0) && jQuery.sap.byId("__comment2").get(0), "All comments displayed");
			assert.equal(jQuery.sap.byId("Chunk2-all").text(), rb.getText('INBOX_TASK_MAX_COMMENTS'), "Link to show only max. number of comments if all comments are shown");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("show max comments", function(assert) {

		qutils.triggerMouseEvent("Chunk2-all", "click");

		var delayedCall = function() {
			assert.ok(jQuery.sap.byId("__comment3").get(0) && !jQuery.sap.byId("__comment0").get(0) && !jQuery.sap.byId("__comment1").get(0) && jQuery.sap.byId("__comment2").get(0), "Only Max. number of comments displayed");
			assert.equal(jQuery.sap.byId("Chunk2-all").text(), rb.getText('INBOX_TASK_ALL_COMMENTS'), "Link to show only max. number of comments if all comments are shown");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.asyncTest("show and hide busy indicator", function(assert) {

		var oTaskComment3 = sap.ui.getCore().getControl("Chunk3");
		oTaskComment3.showBusy(true);
		var oBusyIndicator = oTaskComment3.getAggregation('busyIndicator');
		assert.ok(oBusyIndicator, "Busy Indicator aggregation is set");
		assert.ok(oBusyIndicator.getBusy(), "Busy Indicator is set to busy");

		oTaskComment3.showBusy(false);
		assert.ok(!(oTaskComment3.getAggregation('busyIndicator')), "Busy Indicator aggregation is destroyed");

		QUnit.start();

	});

	QUnit.asyncTest("show and hide header", function(assert) {

		var oTaskComment3 = sap.ui.getCore().getControl("Chunk3");
		assert.ok(!(oTaskComment3.getShowHeader()), "Visibility of header is set to false");
		oTaskComment3.setShowHeader(true);

		var delayedCall = function() {
			assert.ok(oTaskComment3.getShowHeader(), "Visibility of header is set to true");
			assert.equal(jQuery.sap.byId("Chunk3").find(".sapuiextInboxTaskComments").text().slice(0,1), "0", "Header is visible and number of comments is correct");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);

	});
});