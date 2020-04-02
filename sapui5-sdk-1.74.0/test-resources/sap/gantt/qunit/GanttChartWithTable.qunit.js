/*global QUnit */
sap.ui.define([
	"sap/gantt/GanttChartWithTable",
	"sap/ui/qunit/QUnitUtils",
	"sap/gantt/qunit/data/DataProducer"
], function(GanttChartWithTable, qutils, DataProducer){
	"use strict";

	var aFirstViewColumns = [new sap.ui.table.Column({
		label: "Unique ID",
		sortProperty: "uuid",
		filterProperty: "uuid",
		template: new sap.m.Label({
			text: {
				path: "uuid",
				model: "test"
			}
		})
	})];

	var oDataProducer = new DataProducer();
	oDataProducer.produceData();
	// create model and load data
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oDataProducer.getData("sap_hierarchy"));

	// create GanttChart
	var oGanttChartWithTable = new GanttChartWithTable({
		columns: aFirstViewColumns,
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});
	oGanttChartWithTable.setModel(oModel, "test");
	oGanttChartWithTable.placeAt("qunit-fixture");
	sap.ui.getCore().applyChanges();

	// qutils.delayTestStart();
	QUnit.module("Basic Rendering Tests");
	QUnit.test("TreeTable API test", function (assert) {
		var done = assert.async();
		assert.equal(oGanttChartWithTable.getSelectedIndex(), oGanttChartWithTable._getSelectionHandler().getSelectedIndex(), "Default selected index");
		oGanttChartWithTable.setSelectedIndex(0);
		assert.equal(oGanttChartWithTable.getSelectedIndex(), oGanttChartWithTable._getSelectionHandler().getSelectedIndex(), "Return index that was set");

		assert.equal(oGanttChartWithTable.getVisibleRowCount(), oGanttChartWithTable._oTT.getVisibleRowCount(), "Number of visible rows");

		assert.equal(oGanttChartWithTable.getRows().length, oGanttChartWithTable._oTT.getRows().length, "Number of rows");

		assert.equal(oGanttChartWithTable.getFirstVisibleRow(), 0, "Default visible row");
		oGanttChartWithTable.setFirstVisibleRow(1);
		assert.equal(oGanttChartWithTable.getFirstVisibleRow(), 1, "Should be 1");

		//Flat mode test
		assert.ok(oGanttChartWithTable._oTT.$().find(".sapUiTableTreeIcon").length > 0, "Tree Icons available in TreeMode");
		oGanttChartWithTable.setUseFlatMode(true);
		setTimeout(function () {
			assert.strictEqual(oGanttChartWithTable._oTT.$().find(".sapUiTableTreeIcon").length, 0, "Tree Icons not available in FlatMode");
			done();
		}, 0);
	});

	QUnit.module("Collapse/Expand mock tests", {
		beforeEach: function () {
			this.oGanttChartWithTable = new sap.gantt.GanttChartWithTable();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});

	QUnit.test("Expand test", function (assert) {
		var iInitialRowIndex = 0;
		this.oGanttChartWithTable._oTT.expand = function (iRowIndex) {
			assert.equal(iRowIndex, iInitialRowIndex, "Expand method of TreeTable was called with correct parameter");
		};
		assert.equal(this.oGanttChartWithTable.expand(iInitialRowIndex), this.oGanttChartWithTable, "The object GanttChartWithTable was returned");
	});

	QUnit.test("Collapse test", function (assert) {
		var iInitialRowIndex = 0;
		this.oGanttChartWithTable._oTT.collapse = function (iRowIndex) {
			assert.equal(iRowIndex, iInitialRowIndex, "Collapse method of TreeTable was called with correct parameter");
		};
		assert.equal(this.oGanttChartWithTable.collapse(iInitialRowIndex), this.oGanttChartWithTable, "The object GanttChartWithTable was returned");
	});

	QUnit.module("shapeSelectionMode property", {
		beforeEach: function () {
			this.oGanttChartWithTable = new sap.gantt.GanttChartWithTable();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});

	QUnit.test("Test for getShapeSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChartWithTable.getShapeSelectionMode(), "Equal to default");

		this.oGanttChartWithTable.setProperty("shapeSelectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChartWithTable.getShapeSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setShapeSelectionMode function", function (assert) {
		this.oGanttChartWithTable.setShapeSelectionMode("None");
		assert.strictEqual("None", this.oGanttChartWithTable.getProperty("shapeSelectionMode"), "Changed to expectation");
	});

	//Test for deprecated function
	QUnit.module("selectionMode property", {
		beforeEach: function () {
			this.oGanttChartWithTable = new sap.gantt.GanttChartWithTable();
		},
		afterEach: function () {
			this.oGanttChartWithTable.destroy();
		}
	});

	QUnit.test("Test for getSelectionMode function", function (assert) {
		//get default value
		assert.strictEqual("MultiWithKeyboard", this.oGanttChartWithTable.getSelectionMode(), "Equal to default");

		this.oGanttChartWithTable.setProperty("selectionMode", "Single");
		assert.strictEqual("Single", this.oGanttChartWithTable.getSelectionMode(), "Equal to expected value");
	});

	QUnit.test("Test for setSelectionMode function", function (assert) {
		this.oGanttChartWithTable.setSelectionMode("None");
		assert.strictEqual("None", this.oGanttChartWithTable.getProperty("selectionMode"), "Changed to expectation");
	});

}, false);
