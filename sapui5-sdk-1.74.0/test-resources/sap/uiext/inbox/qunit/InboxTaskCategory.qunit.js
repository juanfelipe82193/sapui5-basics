/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit",
	"sap/ui/core/IconPool"
], function(qutils, createAndAppendDiv, jQuery, InboxMockServerQUnit, IconPool) {
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

	// Tests for Category Images in Table view
	QUnit.asyncTest("CategoryImages", function(assert) {
		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			assert.equal( oTable.getRows()[0].getCells()[0].getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oTable.getRows()[1].getCells()[0].getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oTable.getRows()[2].getCells()[0].getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oTable.getRows()[3].getCells()[0].getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oTable.getRows()[4].getCells()[0].getCategoryIconURI(), "sap-icon://task", "Default image is present in the content of first cell of the row");
			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
		sap.ui.getCore().applyChanges();
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
		setTimeout(delayedCall, 1000);
	});

	// Tests for Category Images in Stream view
	QUnit.asyncTest("StreamViewCategoryImages", function(assert) {
		var delayedCall = function() {
			sap.ui.getCore().applyChanges();
			var oTable = sap.ui.getCore().byId('inbox--tasksRowRepeater');
			assert.equal( oTable.getRows()[0].getRows()[0].getCells()[0].getContent()[1].getSrc(), "sap-icon://task", "Placeholder image is present in the content of first cell of the row");
			assert.equal( oTable.getRows()[1].getRows()[0].getCells()[0].getContent()[1].getSrc(), "sap-icon://activity-2", "Todo image is present in the content of first cell of the row");
			assert.equal( oTable.getRows()[2].getRows()[0].getCells()[0].getContent()[1].getSrc(), "sap-icon://alert", "Alert image is present in the content of first cell of the row");
			assert.equal( oTable.getRows()[3].getRows()[0].getCells()[0].getContent()[1].getSrc(), "sap-icon://notification-2", "Notification image is present in the content of first cell of the row");
			assert.equal( oTable.getRows()[4].getRows()[0].getCells()[0].getContent()[1].getSrc(), "", "Default image is present in the content of first cell of the row");
			QUnit.start();
		};
		setTimeout(delayedCall, 0);
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});