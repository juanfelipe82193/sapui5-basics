/*global QUnit*/
sap.ui.define([
	"sap/gantt/GanttChart",
	"sap/gantt/qunit/data/DataProducer"
], function (GanttChart, DataProducer) {
	"use strict";

	var oDataProducer = new DataProducer();
	oDataProducer.produceData("RESOURCES");
	var oModel = new sap.ui.model.json.JSONModel();
	oModel.setData(oDataProducer.getData("RESOURCES"));
	var oGanttChart = new GanttChart({
		shapeDataNames: ["activity"],
		rows: {
			path: "test>/root",
			parameters: {
				arrayNames: ["children"]
			}
		}
	});
	oGanttChart.setModel(oModel, "test");
	oGanttChart.placeAt("content");

	QUnit.module("Test reference of Table", {
		beforeEach: function () {
			this.oTable = oGanttChart._oTT;
		}
	});

	QUnit.test("Test function reference", function (assert) {
		assert.ok(this.oTable._collectRowHeights !== undefined, "_collectRowHeights function exists");
		assert.ok(this.oTable._collectRowHeights() instanceof Array, "_collectRowHeights function return a Array");
		assert.ok(this.oTable._updateRowHeights !== undefined, "_updateRowHeights function exists");
		assert.ok(this.oTable._updateTableSizes !== undefined, "_updateTableSizes function exists");
		assert.ok(this.oTable._updateRowState !== undefined, "_updateRowState function exists");
		assert.ok(this.oTable._setLargeDataScrolling !== undefined, "_setLargeDataScrolling function exists");
		assert.ok(this.oTable._updateSelection !== undefined, "_updateSelection function exists");
		assert.ok(this.oTable.updateRows !== undefined, "updateRows function exists");
	});

	QUnit.test("Test variable reference", function (assert) {
		assert.ok(this.oTable._bVariableRowHeightEnabled === true, "_bVariableRowHeightEnabled variable exists");
	});

	QUnit.test("Test CSS reference", function (assert) {
		assert.ok(this.oTable.$("hsb-content") !== undefined, "hsb-content CSS exists");
		assert.ok(this.oTable.$("vsb-content") !== undefined, "hsb-content CSS exists");
	});
});
