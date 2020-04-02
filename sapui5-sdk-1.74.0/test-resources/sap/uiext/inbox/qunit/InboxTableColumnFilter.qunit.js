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

	QUnit.module("Table creation");

	QUnit.asyncTest("Checking table binding", function(assert) {
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			var oInbox = sap.ui.getCore().getControl("inbox");
			var oTable = sap.ui.getCore().getControl("inbox--listViewTable");
			var oListBinding = oTable.getBinding('rows');
			assert.equal(oListBinding.aKeys.length, 8, "Table is bound to correct data");
			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.test("Filtering a column if none of the other columns are filtered", function(assert) {
		var oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		var oInbox = sap.ui.getCore().getControl("inbox");
		var oTaskTitleColumn = oTable.getColumns()[0];
		assert.equal(oTaskTitleColumn.getFilterProperty(), "TaskTitle", "Filter property of column is correct");
		oInbox._applyFilterOnTableColumns(oTaskTitleColumn, "purchase");
		sap.ui.getCore().applyChanges();

		var oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		var oTaskTitleColumn = oTable.getColumns()[0];
		assert.equal(oTaskTitleColumn.getFiltered(), true, "Filtered property of column is set to true");
		assert.equal(oTaskTitleColumn.getFilterValue(), "purchase", "FilterValue property of column is set");
		var oListBinding = oTable.getBinding('rows');
		assert.equal(oListBinding.aKeys.length, 2, "Table binding has changed according to the filter applied");
	});

	QUnit.test("Filtering a column if other columns are already filtered", function(assert) {
		var oInbox = sap.ui.getCore().getControl("inbox");
		var oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		var oDueDateColumn = oTable.getColumns()[3];
		oInbox._applyFilterOnTableColumns(oDueDateColumn, "JuN 21");
		sap.ui.getCore().applyChanges();

		oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		oDueDateColumn = oTable.getColumns()[3];
		assert.equal(oDueDateColumn.getFiltered(), true, "Filter property of column is correct");
		assert.equal(oDueDateColumn.getFilterValue(), "jun 21", "FilterValue property of column is set");
		var oListBinding = oTable.getBinding('rows');
		assert.equal(oListBinding.aKeys.length, 1, "Table binding has changed according to the filter applied");
		oInbox._removeTableFilters();
	});

	QUnit.test("applying local search if columns of table are filtered", function(assert) {
		sap.ui.getCore().applyChanges();
		var oInbox = sap.ui.getCore().getControl("inbox");
		var oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		assert.equal(oInbox._isTableFiltered(), false, "none of the columns are filtered");
		var oDueDateColumn = oTable.getColumns()[3];
		oInbox._applyFilterOnTableColumns(oDueDateColumn, "JuN");
		oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		oDueDateColumn = oTable.getColumns()[3];
		assert.equal(oDueDateColumn.getFiltered(), true, "Filter property of column is correct");
		assert.equal(oDueDateColumn.getFilterValue(), "jun", "FilterValue of column is set");
		var oListBinding = oTable.getBinding('rows');
		assert.equal(oListBinding.aKeys.length, 3, "Table binding has changed according to the filter applied");

		var oSeachField = sap.ui.getCore().getControl("inbox--searchField");
		oSeachField.setValue("high");
		oSeachField.focus();
		qutils.triggerKeydown("inbox--searchField-tf", jQuery.sap.KeyCodes.ENTER, false, false, false);
		oTable = sap.ui.getCore().getControl("inbox--listViewTable");
		oDueDateColumn = oTable.getColumns()[3];
		assert.equal(oInbox._isTableFiltered(), true, "columns of table are filtered");
		assert.equal(oDueDateColumn.getFiltered(), true, "Filter property of column is correct");
		assert.equal(oDueDateColumn.getFilterValue(), "jun", "FilterValue of column is set");
		assert.equal(oInbox._getLocalSearchText(), "high", "searchfield value is set");

		oListBinding = oTable.getBinding('rows');

		assert.equal(oListBinding.aKeys.length, 1, "Table binding has changed according to the filter and Local search applied");
	});

	QUnit.asyncTest("Switch to stream view if column filters are applied", function(assert) {
		var oInbox = sap.ui.getCore().byId('inbox');
		qutils.triggerMouseEvent("inbox--rrViewSelectionButton", "click");
		sap.ui.getCore().applyChanges();

		var delayedCall = function() {
			assert.equal(oInbox.currentView, "sap_inbox_stream", "current view is row repeater view");
			QUnit.start();
		};
		setTimeout(delayedCall, 500);
	});

	QUnit.test("Column filters and Local search in stream view", function(assert) {
		var oInbox = sap.ui.getCore().getControl("inbox");
		var oTasksRrView = sap.ui.getCore().byId('inbox--tasksRowRepeater');

		assert.equal(oInbox._isTableFiltered(), false, "none of the columns are filtered; filters are removed on switchViews");
		//equals(oInbox._getLocalSearchText(), "high", "Local search is still applied");
		assert.equal(oTasksRrView.getRows().length, 5, "Local search and column filters are removed");
	});

	QUnit.done(function() {
		qutils.triggerMouseEvent("inbox" + "--tableViewSelectionButton", "click");
	});
});