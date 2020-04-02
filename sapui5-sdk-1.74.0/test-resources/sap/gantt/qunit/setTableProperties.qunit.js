/*global QUnit*/
sap.ui.define(["sap/gantt/test/shape/RectangleGroup"], function () {
	"use strict";

	var oGanttChartWithTable = new sap.gantt.GanttChartWithTable({
		columns: [],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});

	//Use getTableProperties() function to get default value.
	QUnit.module("Test for getTableProperties function");
	QUnit.test("get default value", function (assert) {
		var oTT = oGanttChartWithTable._oTT;
		assert.strictEqual(oTT.getRowHeight(), oGanttChartWithTable.getTableProperties().rowHeight, "Equal to default");
		assert.strictEqual(oTT.getFirstVisibleRow(), oGanttChartWithTable.getTableProperties().firstVisibleRow, "Equal to default");
		assert.strictEqual(oTT.getShowColumnVisibilityMenu(), oGanttChartWithTable.getTableProperties().showColumnVisibilityMenu, "Equal to default");
		assert.strictEqual(oTT.getFixedColumnCount(), oGanttChartWithTable.getTableProperties().fixedColumnCount, "Equal to default");
		assert.strictEqual(oTT.getThreshold(), oGanttChartWithTable.getTableProperties().threshold, "Equal to default");
		assert.strictEqual(oTT.getSelectionMode(), oGanttChartWithTable.getTableProperties().selectionMode, "Equal to default");
		assert.strictEqual(oTT.getSelectionBehavior(), oGanttChartWithTable.getTableProperties().selectionBehavior, "Equal to default");
	});

	//Use original function to get default value.
	QUnit.module("Test for original \"get\" function");
	QUnit.test("get default value", function (assert) {
		var oTT = oGanttChartWithTable._oTT;
		assert.strictEqual(oTT.getFirstVisibleRow(), oGanttChartWithTable.getFirstVisibleRow(), "Equal to default");
		assert.strictEqual(oTT.getFixedColumnCount(), oGanttChartWithTable.getFixedColumnCount(), "Equal to default");
	});

	//Use setTableProperties() function to set value.
	QUnit.module("Test for setTableProperties function");
	QUnit.test("set new value", function (assert) {
		oGanttChartWithTable.setTableProperties({
			rowHeight: 40,
			firstVisibleRow: 2,
			showColumnVisibilityMenu: true,
			fixedColumnCount: 4,
			threshold: 60,
			selectionMode: "Single",
			selectionBehavior: "RowSelector"
		});
		assert.strictEqual(40, oGanttChartWithTable.getTableProperties().rowHeight, "Changed to expectation");
		assert.strictEqual(2, oGanttChartWithTable.getTableProperties().firstVisibleRow, "Changed to expectation");
		assert.strictEqual(true, oGanttChartWithTable.getTableProperties().showColumnVisibilityMenu, "Changed to expectation");
		assert.strictEqual(4, oGanttChartWithTable.getTableProperties().fixedColumnCount, "Changed to expectation");
		assert.strictEqual(60, oGanttChartWithTable.getTableProperties().threshold, "Changed to expectation");
		assert.strictEqual("Single", oGanttChartWithTable.getTableProperties().selectionMode, "Changed to expectation");
		assert.strictEqual("RowSelector", oGanttChartWithTable.getTableProperties().selectionBehavior, "Changed to expectation");
	});

	//Use original function to set value.
	QUnit.module("Test for original \"set\" function");
	QUnit.test("set new value", function (assert) {
		oGanttChartWithTable.setFirstVisibleRow(3);
		assert.strictEqual(3, oGanttChartWithTable.getFirstVisibleRow(), "Changed to expectation");

		oGanttChartWithTable.setFixedColumnCount(5);
		assert.strictEqual(5, oGanttChartWithTable.getFixedColumnCount(), "Changed to expectation");
	});

	//Set invalid property into setTableProperties() function.
	QUnit.module("Set invalid property");
	QUnit.test("Set invalid property into setTableProperties() function", function (assert) {
		var oWarningSpy = this.spy(jQuery.sap.log, 'warning');
		oGanttChartWithTable.setTableProperties({ inValidProp: -1 });
		assert.equal(oWarningSpy.calledTwice, true, "Log warning method called");
	});
});


