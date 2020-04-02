/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit",
	"sap/ui/core/IconPool",
	"sap/ui/Device"
], function(
	qutils,
	createAndAppendDiv,
	jQuery,
	InboxMockServerQUnit,
	IconPool,
	Device
) {
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

	QUnit.module("FilterPreservation");

	QUnit.asyncTest("GetReadyTaskTest", function(assert) {
		qutils.triggerMouseEvent("inbox--filterViewButton", "click");
		sap.ui.getCore().applyChanges();
		var oTable = sap.ui.getCore().byId('inbox--listViewTable');
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_STATUS_READY", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			assert.equal( oTable.getRows()[0].getCells()[4].getText(), "Ready", "task has status Ready");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("SwitchToCompletedTasks", function(assert) {


			var oTable = sap.ui.getCore().byId('inbox--listViewTable');

			qutils.triggerMouseEvent("inbox--filterComboBox2-icon", "click");
			sap.ui.getCore().applyChanges();
			qutils.triggerMouseEvent("inbox--li_completedTasks", "click");
			sap.ui.getCore().applyChanges();
			var delayedCall = function() {

				assert.equal(false, (oTable === undefined), "Checking if the Table is not undefined.");
				if ( !(Device.browser.msie && Device.browser.version < 10)) {
					assert.equal( oTable.getRows()[0].getCells()[4].getText(), "Completed", "task has status Completed");
				}

				QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("SwitchBackToOpenTasks", function(assert) {


		var oTable = sap.ui.getCore().byId('inbox--listViewTable');

		qutils.triggerMouseEvent("inbox--filterComboBox2-icon", "click");
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--li_openTasks", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {

			assert.equal( oTable.getRows()[0].getCells()[4].getText(), "Ready", "task has status Completed");

			QUnit.start();
	};
	setTimeout(delayedCall, 500);
});

	QUnit.asyncTest("CreationDatePreservationTest", function(assert) {
		qutils.triggerMouseEvent("__item2", "click");
		sap.ui.getCore().applyChanges();
		var oTable = sap.ui.getCore().byId('inbox--listViewTable');
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_DATETIME_WEEK", "click");
		var delayedCall = function() {

			sap.ui.getCore().applyChanges();
			assert.equal( oTable.getRows()[0].getCells()[5].getText(), "Low", "task created on last week");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("SwitchToCompletedTasks", function(assert) {


		var oTable = sap.ui.getCore().byId('inbox--listViewTable');

		qutils.triggerMouseEvent("inbox--filterComboBox2-icon", "click");
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--li_completedTasks", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {

			assert.equal( oTable.getRows()[0].getCells()[4].getText(), "Completed", "task has status Completed");

			QUnit.start();
	};
	setTimeout(delayedCall, 500);
});

	QUnit.asyncTest("OpenTasks", function(assert) {


		var oTable = sap.ui.getCore().byId('inbox--listViewTable');

		qutils.triggerMouseEvent("inbox--filterComboBox2-icon", "click");
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--li_openTasks", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {

			assert.equal( oTable.getRows()[0].getCells()[5].getText(), "Low", "task has proper Creation Date");

			QUnit.start();
	};
	setTimeout(delayedCall, 500);
});

	QUnit.asyncTest("DueDate", function(assert) {
		qutils.triggerMouseEvent("__item3", "click");
		sap.ui.getCore().applyChanges();
		var oTable = sap.ui.getCore().byId('inbox--listViewTable');
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_DUE_DATETIME_WEEK", "click");
		var delayedCall = function() {

			sap.ui.getCore().applyChanges();
			assert.equal( oTable.getRows()[0].getCells()[5].getText(), "Medium", "task due on last week");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("SwitchToCompletedTasks", function(assert) {


		var oTable = sap.ui.getCore().byId('inbox--listViewTable');

		qutils.triggerMouseEvent("inbox--filterComboBox2-icon", "click");
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--li_completedTasks", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {

			assert.equal( oTable.getRows()[0].getCells()[4].getText(), "Completed", "task has status Completed");

			QUnit.start();
	};
	setTimeout(delayedCall, 500);
});

	QUnit.asyncTest("OpenTasks", function(assert) {


		var oTable = sap.ui.getCore().byId('inbox--listViewTable');

		qutils.triggerMouseEvent("inbox--filterComboBox2-icon", "click");
		sap.ui.getCore().applyChanges();
		qutils.triggerMouseEvent("inbox--li_openTasks", "click");
		sap.ui.getCore().applyChanges();
		var delayedCall = function() {

			assert.equal( oTable.getRows()[0].getCells()[5].getText(), "Medium", "task has proper Due Date");

			QUnit.start();
		};
		setTimeout(delayedCall, 1000);
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});