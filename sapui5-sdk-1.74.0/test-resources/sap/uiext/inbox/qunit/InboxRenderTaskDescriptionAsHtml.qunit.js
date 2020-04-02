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
		var oInbox = sap.ui.getCore().byId("inbox");
		assert.equal(false, (oInbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (oInbox === null), "Checking if the Inbox Control is created and is not null.");


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

	QUnit.module("Check Expand Task Description Link visibility ");

	QUnit.asyncTest("Checking if the Show More Link is  visible if the task has HTML task description", function(assert) {

		var oShowMoreTaskDescriptionControl = sap.ui.getCore().byId("__view7-inbox--tasksRowRepeater-0");
		var oShowMoreLink = oShowMoreTaskDescriptionControl.getAggregation("taskDescriptionLink");
		var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");

		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			if (oShowMoreLink) {
				assert.equal(true, oShowMoreLink.getVisible(), "Check if Link to expand Task Description for the task is visible");
				assert.equal(oShowMoreLink.getTooltip(), _oBundle.getText("INBOX_SHOW_MORE_LINK_TOOLTIP"), "Checking If the Tooltip for link is correct");

			}
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.module("On Click of Show More Link ");

	QUnit.asyncTest("Check if complete Task Descritpion for the task is displayed", function(assert) {
			var _oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");

			var oShowMoreTaskDescriptnControl = sap.ui.getCore().byId("__view7-inbox--tasksRowRepeater-0");
			var oShowMoreLink = oShowMoreTaskDescriptnControl.getAggregation("taskDescriptionLink");
			var oTaskDescriptionContent = oShowMoreTaskDescriptnControl.getAggregation("fTV");


			assert.equal(1,oTaskDescriptionContent.getMaxLines(),  "Check if only 1 line of description is displayed");
			assert.equal(oShowMoreLink.getTooltip(), _oBundle.getText("INBOX_SHOW_MORE_LINK_TOOLTIP"), "Check Tooltip of Show More Task Description Link");
			assert.equal(oShowMoreLink.getText(), _oBundle.getText("INBOX_SHOW_MORE_TEXT"), "Check Tooltip of Show More Task Description Link");

			qutils.triggerMouseEvent(oShowMoreLink.getId(), "click");
			sap.ui.getCore().applyChanges();
			assert.equal(true, oShowMoreLink.getEnabled(), "Checking if the Show More Task Description link is clicked");


			var delayedCall = function() {

			var oTaskDescriptionContent = oShowMoreTaskDescriptnControl.getAggregation("fTV");
			var oShowLessLink = oShowMoreTaskDescriptnControl.getAggregation("taskDescriptionLink");


			assert.equal("<h2>Purchase Order for the following items</h2><ul><li>Purchase 20 laptops</li><li>Purchase 50 desk phones</li></ul>",oTaskDescriptionContent.getHtmlText(), "Checking if correct Html text is rendered");
			assert.equal(true, oShowLessLink.getVisible(), "Show less Task Description Button should be visible");
			assert.equal(oShowLessLink.getTooltip(), _oBundle.getText("INBOX_SHOW_LESS_LINK_TOOLTIP"), "Check Tooltip of Show less Task Description Link");
			assert.equal(oShowLessLink.getText(), _oBundle.getText("INBOX_SHOW_LESS_TEXT"), "Check Text of Show less Task Description Link");

			QUnit.start();
			};
			setTimeout(delayedCall, 0);
		});

	QUnit.module("On click of the Show Less Task Description Link");

	QUnit.asyncTest("Hide the Formatted HTML Task Description for a task", function(assert) {
			var oShowMoreTaskDescriptnControl = sap.ui.getCore().byId("__view7-inbox--tasksRowRepeater-0");
			var oShowLessLink = oShowMoreTaskDescriptnControl.getAggregation("taskDescriptionLink");
			var oTaskDescriptionContent =  oShowMoreTaskDescriptnControl.getAggregation("fTV");
			qutils.triggerMouseEvent(oShowLessLink.getId(), "click");
			sap.ui.getCore().applyChanges();
			var delayedCall = function() {
			var formattedTaskDescriptionDiv = jQuery.sap.byId('inbox--FormattedTaskDescription-0');

			assert.equal(true, oShowLessLink.getVisible(), "Show More Task Description Link should not be visible");
			assert.equal(oTaskDescriptionContent.getHtmlText(), "Purchase Order for the following itemsPurchase 20 laptopsPurchase 50 desk phones", "Check if correct task description is rendered");

			QUnit.start();
			};
			setTimeout(delayedCall, 0);
		});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});