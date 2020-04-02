/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"jquery.sap.global",
	"./mockServer/InboxMockServerQUnit",
	"./mockServer/InboxMockServerData",
	"sap/ui/core/IconPool",
	"sap/uiext/inbox/library",
	"sap/uiext/inbox/InboxConstants"
], function(
	qutils,
	createAndAppendDiv,
	jQuery,
	InboxMockServerQUnit,
	InboxMockServerData,
	IconPool,
	inboxLibrary,
	InboxConstants
) {
	"use strict";


	// prepare DOM
	createAndAppendDiv("uiArea1").setAttribute("style", "width: 80%;");

	// setup mock server and inbox control
	InboxMockServerQUnit.setup({applyTaskCategoryFilter: true});


	QUnit.module("Load");

	QUnit.test("InboxCreationOk", function(assert) {
		sap.ui.getCore().applyChanges();
		var oInbox = jQuery.sap.byId("inbox");
		assert.equal(false, (oInbox === undefined), "Checking if the Inbox Control is created and is not undefined.");
		assert.equal(false, (oInbox === null), "Checking if the Inbox Control is created and is not null.");
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});


	QUnit.module("CategoryFilter");

	QUnit.asyncTest("Checking facet filter, table columns and toolbar container on initial load", function(assert) {
		qutils.triggerMouseEvent("inbox--filterViewButton", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			var oFacetFilter = sap.ui.getCore().byId('inbox--filterFacet');
			var oToolbar = sap.ui.getCore().byId('inbox--actionButtonsToolbarContainer');
			var oDataOfFirstRow  = oTable.getRows()[0].getCells()[0];
			var oDataOfSecondRow = oTable.getRows()[1].getCells()[0];
			var sTaskTitleOfFirstRow = InboxMockServerData.taskData.d.results[0].TaskTitle;
			var sTaskTitleOfSecondRow  = InboxMockServerData.taskData.d.results[1].TaskTitle;
			var sIsTaskSelectedInCategoryFilter = InboxConstants.aDrillDownFilterMetadata[0].attributes[0];

			assert.equal( oFacetFilter.getLists()[0].getSelectedKeys()[0], sIsTaskSelectedInCategoryFilter, "Tasks is selected on initial load in category filter");
			assert.equal( oDataOfFirstRow.getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal(oDataOfFirstRow.getAggregation('titleLink').getText(), sTaskTitleOfFirstRow , "Correct data is bound to task table");
			assert.equal( oDataOfSecondRow.getAggregation('titleLink').getText(), sTaskTitleOfSecondRow, "Correct data is bound to task table");
			assert.equal( oToolbar.getItems()[4].getEnabled(), true, "Substitution Action button is enabled");


			assert.equal( oFacetFilter.getLists().length, 6, "Number of Lists in facet filter is correct");
			assert.equal( oFacetFilter.getLists()[0].getId(), "inbox--INBOX_FILTER_CATEGORY", "category filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[1].getId(), "inbox--INBOX_FILTER_TASK_TYPE", "task type filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[2].getId(), "inbox--INBOX_FILTER_PRIORITY", "priority filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[3].getId(), "inbox--INBOX_FILTER_STATUS", "status filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[4].getId(), "inbox--INBOX_FILTER_CREATION_DATE", "creation date filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[5].getId(), "inbox--INBOX_FILTER_DUE_DATETIME", "due date filter exists in facet filter at index 0");



			assert.equal( oTable.getColumns().length, 6, "Number of columns in task table on initial load is correct");
			assert.equal( oTable.getColumns()[0].getId(), "inbox--TaskTitle", "column at index 0 is task title");
			assert.equal( oTable.getColumns()[1].getId(), "inbox--CreatedOn", "column at index 1 is created on");
			assert.equal( oTable.getColumns()[2].getId(), "inbox--CreatedByName", "column at index 2 is created by");
			assert.equal( oTable.getColumns()[3].getId(), "inbox--CompletionDeadLine", "column at index 3 is due date");
			assert.equal( oTable.getColumns()[4].getId(), "inbox--Status", "column at index 4 is status");
			assert.equal( oTable.getColumns()[5].getId(), "inbox--Priority", "column at index 5 is task priority");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Checking facet filter, table columns and toolbar tontainer on selecting Todo in Category filter", function(assert) {
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_CATEGORY_TODO", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			var oFacetFilter = sap.ui.getCore().byId('inbox--filterFacet');
			var oToolbar = sap.ui.getCore().byId('inbox--actionButtonsToolbarContainer');
			var oDataOfFirstRow  = oTable.getRows()[0].getCells()[0];
			var sTaskTitleOfFirstRow = InboxMockServerData.todoData.d.results[0].TaskTitle;
			var sTodoSelectedInCategoryFilter = InboxConstants.aDrillDownFilterMetadata[0].attributes[1];

			assert.equal( oToolbar.getItems()[4].getEnabled(), false, "Substitution Action button is disabled");
			assert.equal( oFacetFilter.getLists()[0].getSelectedKeys(), sTodoSelectedInCategoryFilter, "Todo is selected in category filter ");
			assert.equal( oDataOfFirstRow.getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oDataOfFirstRow.getTitleLink().getProperty("text"), sTaskTitleOfFirstRow, "Correct data is bound to task table");


			assert.equal( oFacetFilter.getLists().length, 4, "Number of Lists in facet filter is correct");
			assert.equal( oFacetFilter.getLists()[0].getId(), "inbox--INBOX_FILTER_CATEGORY", "category filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[1].getId(), "inbox--INBOX_FILTER_TASK_TYPE", "task type filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[2].getId(), "inbox--INBOX_FILTER_STATUS", "status filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[3].getId(), "inbox--INBOX_FILTER_CREATION_DATE", "creation date filter exists in facet filter at index 0");

			assert.equal( oTable.getColumns().length, 5, "Number of columns in task table on initial load is correct");
			assert.equal( oTable.getColumns()[0].getId(), "inbox--TaskTitle", "column at index 0 is task title");
			assert.equal( oTable.getColumns()[1].getId(), "inbox--CreatedOn", "column at index 1 is created on");
			assert.equal( oTable.getColumns()[2].getId(), "inbox--CreatedByName", "column at index 2 is created by");
			assert.equal( oTable.getColumns()[3].getId(), "inbox--Status", "column at index 4 is status");
			assert.equal( oTable.getColumns()[4].getId(), "inbox--Priority", "column at index 5 is task priority");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Checking facet filter, table columns and toolbar tontainer on selecting Alert in Category filter", function(assert) {
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_CATEGORY_ALERT", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			var oFacetFilter = sap.ui.getCore().byId('inbox--filterFacet');
			var oToolbar = sap.ui.getCore().byId('inbox--actionButtonsToolbarContainer');
			var oDataOfFirstRow  = oTable.getRows()[0].getCells()[0];
			var sTaskTitleOfFirstRow = InboxMockServerData.alertData.d.results[0].TaskTitle;
			var sAlertSelectedInCategoryFilter = InboxConstants.aDrillDownFilterMetadata[0].attributes[2];

			assert.equal( oToolbar.getItems()[4].getEnabled(), false, "Substitution Action button is disabled");
			assert.equal( oFacetFilter.getLists()[0].getSelectedKeys(), sAlertSelectedInCategoryFilter, "Alert is selected in category filter ");
			assert.equal( oDataOfFirstRow.getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oDataOfFirstRow.getTitleLink().getProperty("text"), sTaskTitleOfFirstRow, "Correct data is bound to task table");

			assert.equal( oFacetFilter.getLists().length, 5, "Number of Lists in facet filter is correct");
			assert.equal( oFacetFilter.getLists()[0].getId(), "inbox--INBOX_FILTER_CATEGORY", "category filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[1].getId(), "inbox--INBOX_FILTER_TASK_TYPE", "task type filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[2].getId(), "inbox--INBOX_FILTER_PRIORITY", "priority filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[3].getId(), "inbox--INBOX_FILTER_STATUS", "status filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[4].getId(), "inbox--INBOX_FILTER_CREATION_DATE", "creation date filter exists in facet filter at index 0");

			assert.equal( oTable.getColumns().length, 5, "Number of columns in task table on initial load is correct");
			assert.equal( oTable.getColumns()[0].getId(), "inbox--TaskTitle", "column at index 0 is task title");
			assert.equal( oTable.getColumns()[1].getId(), "inbox--CreatedOn", "column at index 1 is created on");
			assert.equal( oTable.getColumns()[2].getId(), "inbox--CreatedByName", "column at index 2 is created by");
			assert.equal( oTable.getColumns()[3].getId(), "inbox--Status", "column at index 4 is status");
			assert.equal( oTable.getColumns()[4].getId(), "inbox--Priority", "column at index 5 is task priority");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Checking facet filter, table columns and toolbar tontainer on selecting Task in Category filter", function(assert) {
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_CATEGORY_TASKS", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			var oFacetFilter = sap.ui.getCore().byId('inbox--filterFacet');
			var oToolbar = sap.ui.getCore().byId('inbox--actionButtonsToolbarContainer');
			var oDataOfFirstRow  = oTable.getRows()[0].getCells()[0];
			var sTaskTitleOfFirstRow = InboxMockServerData.taskData.d.results[0].TaskTitle;
			var sTasksSelectedInCategoryFilter = InboxConstants.aDrillDownFilterMetadata[0].attributes[0];
			assert.equal( oToolbar.getItems()[4].getEnabled(), true, "Substitution Action button is enabled");
			assert.equal( oFacetFilter.getLists()[0].getSelectedKeys(), sTasksSelectedInCategoryFilter, "Tasks is selected in category filter ");
			assert.equal( oDataOfFirstRow.getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oDataOfFirstRow.getTitleLink().getProperty("text"), sTaskTitleOfFirstRow, "Correct data is bound to task table");

			assert.equal( oFacetFilter.getLists().length, 6, "Number of Lists in facet filter is correct");
			assert.equal( oFacetFilter.getLists()[0].getId(), "inbox--INBOX_FILTER_CATEGORY", "category filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[1].getId(), "inbox--INBOX_FILTER_TASK_TYPE", "task type filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[2].getId(), "inbox--INBOX_FILTER_PRIORITY", "priority filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[3].getId(), "inbox--INBOX_FILTER_STATUS", "status filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[4].getId(), "inbox--INBOX_FILTER_CREATION_DATE", "creation date filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[5].getId(), "inbox--INBOX_FILTER_DUE_DATETIME", "due date filter exists in facet filter at index 0");

			assert.equal( oTable.getColumns().length, 6, "Number of columns in task table on initial load is correct");
			assert.equal( oTable.getColumns()[0].getId(), "inbox--TaskTitle", "column at index 0 is task title");
			assert.equal( oTable.getColumns()[1].getId(), "inbox--CreatedOn", "column at index 1 is created on");
			assert.equal( oTable.getColumns()[2].getId(), "inbox--CreatedByName", "column at index 2 is created by");
			assert.equal( oTable.getColumns()[3].getId(), "inbox--CompletionDeadLine", "column at index 3 is due date");
			assert.equal( oTable.getColumns()[4].getId(), "inbox--Status", "column at index 4 is status");
			assert.equal( oTable.getColumns()[5].getId(), "inbox--Priority", "column at index 5 is task priority");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Checking facet filter, table columns and toolbar tontainer on selecting Notification in Category filter", function(assert) {
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_CATEGORY_NOTIFICATION", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			var oFacetFilter = sap.ui.getCore().byId('inbox--filterFacet');
			var oToolbar = sap.ui.getCore().byId('inbox--actionButtonsToolbarContainer');
			var oDataOfFirstRow  = oTable.getRows()[0].getCells()[0];
			var sTaskTitleOfFirstRow = InboxMockServerData.notificationData.d.results[0].TaskTitle;
			var sNotificationSelectedInCategoryFilter = InboxConstants.aDrillDownFilterMetadata[0].attributes[3];

			assert.equal( oToolbar.getItems()[4].getEnabled(), false, "Substitution Action button is disabled");
			assert.equal( oFacetFilter.getLists()[0].getSelectedKeys(), sNotificationSelectedInCategoryFilter, "Notification is selected in category filter ");
			assert.equal(  oDataOfFirstRow.getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oDataOfFirstRow.getTitleLink().getProperty("text"), sTaskTitleOfFirstRow, "Correct data is bound to task table");


			assert.equal( oFacetFilter.getLists().length, 5, "Number of Lists in facet filter is correct");
			assert.equal( oFacetFilter.getLists()[0].getId(), "inbox--INBOX_FILTER_CATEGORY", "category filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[1].getId(), "inbox--INBOX_FILTER_TASK_TYPE", "task type filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[2].getId(), "inbox--INBOX_FILTER_PRIORITY", "priority filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[3].getId(), "inbox--INBOX_FILTER_STATUS", "status filter exists in facet filter at index 0");
			assert.equal( oFacetFilter.getLists()[4].getId(), "inbox--INBOX_FILTER_CREATION_DATE", "creation date filter exists in facet filter at index 0");

			assert.equal( oTable.getColumns().length, 5, "Number of columns in task table on initial load is correct");
			assert.equal( oTable.getColumns()[0].getId(), "inbox--TaskTitle", "column at index 0 is task title");
			assert.equal( oTable.getColumns()[1].getId(), "inbox--CreatedOn", "column at index 1 is created on");
			assert.equal( oTable.getColumns()[2].getId(), "inbox--CreatedByName", "column at index 2 is created by");
			assert.equal( oTable.getColumns()[3].getId(), "inbox--Status", "column at index 4 is status");
			assert.equal( oTable.getColumns()[4].getId(), "inbox--Priority", "column at index 5 is task priority");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.module("Filter preservation in categoty filter");
	QUnit.asyncTest("Selecting priority filter - Low if notification is selected in category filter", function(assert) {
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_PRIORITY_LOW", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			var oFacetFilter = sap.ui.getCore().byId('inbox--filterFacet');
			var sLowSelectedInPriorityFilter = InboxConstants.aFilterMetaData[1].attributes[0];
			var sNotificationSelectedInCategoryFilter = InboxConstants.aDrillDownFilterMetadata[0].attributes[3];

			assert.equal( oFacetFilter.getLists()[0].getSelectedKeys(), sNotificationSelectedInCategoryFilter, "Notification is selected in category filter ");
			assert.equal( oFacetFilter.getLists()[2].getSelectedKeys(), sLowSelectedInPriorityFilter, "Low is selected in Priority filter ");
			assert.equal( oTable.getRows()[0].getCells()[4].getText(), "Low", "Correct data is bound to task table");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Selecting Category Todo", function(assert) {
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_CATEGORY_TODO", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			var oFacetFilter = sap.ui.getCore().byId('inbox--filterFacet');
			var oDataOfFirstRow  = oTable.getRows()[0].getCells()[0];
			var sTaskTitleOfFirstRow = InboxMockServerData.todoData.d.results[0].TaskTitle;
			var sTodoSelectedInCategoryFilter = InboxConstants.aDrillDownFilterMetadata[0].attributes[1];

			assert.equal( oFacetFilter.getLists()[0].getSelectedKeys(), sTodoSelectedInCategoryFilter, "Notification is selected in category filter ");
			assert.equal(oDataOfFirstRow.getCategoryIconURI(), "sap-icon://task", "Task image is present in the content of first cell of the row");
			assert.equal( oDataOfFirstRow.getTitleLink().getProperty("text"), sTaskTitleOfFirstRow, "Correct data is bound to task table");
			assert.equal( oFacetFilter.getLists().length, 4, "Number of Lists in facet filter is correct");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.asyncTest("Selecting category notification and check if priority filter is still applied", function(assert) {
		qutils.triggerMouseEvent("inbox--INBOX_FILTER_CATEGORY_NOTIFICATION", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oTable = sap.ui.getCore().byId('inbox--listViewTable');
			var oFacetFilter = sap.ui.getCore().byId('inbox--filterFacet');
			var sLowSelectedInPriorityFilter = InboxConstants.aFilterMetaData[1].attributes[0];
			var sNotificationSelectedInCategory = InboxConstants.aDrillDownFilterMetadata[0].attributes[3];

			assert.equal( oFacetFilter.getLists()[0].getSelectedKeys(), sNotificationSelectedInCategory, "Notification is selected in category filter ");
			assert.equal( oFacetFilter.getLists()[2].getSelectedKeys(), sLowSelectedInPriorityFilter, "Low is selected in Priority filter ");
			assert.equal( oTable.getRows()[0].getCells()[4].getText(), "Low", "Correct data is bound to task table");

			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});