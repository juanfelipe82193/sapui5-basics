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

	QUnit.module("Opening the Task Execution UI Overlay");

	QUnit.asyncTest("Checking if Open Action Button is enabled on row selection", function(assert) {
	sap.ui.getCore().applyChanges();
		var delayedCall = function() {
			qutils.triggerMouseEvent("inbox--listViewTable-rowsel3", "click");
			sap.ui.getCore().applyChanges();
			var oOpenButton = sap.ui.getCore().byId('inbox--openActionButton');
			assert.equal(oOpenButton.getEnabled(), true, "Checking if Open Button is enabled");
			QUnit.start();
		};
		setTimeout(delayedCall, 1000);

	});

	// TODO: commented becuase the page: "/test-resources/sap/uiext/inbox/internal/InboxResizeTaskExecutnUI.html" is missing!

	/*
	QUnit.asyncTest("Checking if Task Execution UI Overlay is opened", function(assert) {
	qutils.triggerMouseEvent("inbox--openActionButton", "click");
	sap.ui.getCore().applyChanges();
		var delayedCall = function() {
			var oButton = jQuery.sap.byId("inbox--execURLFrame")[0].contentWindow.jQuery.sap.byId('__button0');
			assert.equal(oButton.length > 0, true, "Checking if Button is present");
			assert.equal(oButton.text(), "Click for Resizing the Overlay", "Checking the Text displayed on Button");
			QUnit.start();
		};
		setTimeout(delayedCall, 3000);

	});

	QUnit.asyncTest("Checking if Task Execution UI Overlay is resized", function(assert) {
		sap.ui.getCore().applyChanges();
		var iDefaultHeight = jQuery.sap.byId("inbox--taskExecUI").height();
		var iDefaultWidth = jQuery.sap.byId("inbox--taskExecUI").width();
		var oButton = jQuery.sap.byId("inbox--execURLFrame")[0].contentWindow.jQuery.sap.byId('__button0');
		qutils.triggerMouseEvent(oButton, "click");

		var delayedCall = function() {
			var iNewHeight = jQuery.sap.byId("inbox--taskExecUI").height();
			var iNewWidth = jQuery.sap.byId("inbox--taskExecUI").width();
			assert.equal(true, (iDefaultHeight != iNewHeight), "Checking if the Height of the Task ExecutionUI Overlay has changed ");
			assert.equal(true, (iDefaultWidth != iNewWidth), "Checking if the Width of the Task ExecutionUI Overlay has changed");
			QUnit.start();
		};
		setTimeout(delayedCall, 1000);

	 });


	QUnit.test("DummyTestToRestoreTheInboxState", function(assert) {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
		assert.equal("", "", "Dummy Assertion");
	});
	*/
});