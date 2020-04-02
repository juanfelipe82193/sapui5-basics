/* global QUnit*/
QUnit.config.autostart = false;

sap.ui.require([
	'sap/ui/comp/personalization/GroupController',
	'sap/ui/table/AnalyticalTable',
	'sap/ui/table/AnalyticalColumn',
	'sap/m/Label',
	'sap/ui/comp/personalization/ColumnHelper'

], function(GroupController, AnalyticalTable, AnalyticalColumn, Label, ColumnHelper) {
	"use strict";

	var oEmpty = {
		group: {
			groupItems: []
		}
	};
	var oA = {
		group: {
			groupItems: [
				{
					columnKey: "name",
					showIfGrouped: true
				}
			]
		}
	};
	var oAx = {
		group: {
			groupItems: [
				{
					columnKey: "name",
					showIfGrouped: false
				}
			]
		}
	};
	var oB = {
		group: {
			groupItems: [
				{
					columnKey: "country",
					showIfGrouped: true
				}
			]
		}
	};
	var oAB = {
		group: {
			groupItems: [
				{
					columnKey: "name",
					showIfGrouped: true
				}, {
					columnKey: "country",
					showIfGrouped: true
				}
			]
		}
	};
	var oBA = {
		group: {
			groupItems: [
				{
					columnKey: "country",
					showIfGrouped: true
				}, {
					columnKey: "name",
					showIfGrouped: true
				}
			]
		}
	};

	QUnit.module("API", {
		beforeEach: function() {
			this.oGroupController = new GroupController();
			this.oTable = new AnalyticalTable({
				columns: [
					new AnalyticalColumn("c1", {
						label: new Label({
							text: "name"
						}),
						grouped: true
					}),
					new AnalyticalColumn("c2", {
						label: new Label({
							text: "country"
						})
					}),
					new AnalyticalColumn("c3", {
						label: new Label({
							text: "year"
						})
					})
				]
			});
		},
		afterEach: function() {
			this.oGroupController.destroy();
			this.oTable.destroy();
		}
	});

	QUnit.test("getChangeData", function(assert) {

		assert.deepEqual(this.oGroupController.getChangeData(oEmpty, oA), oEmpty, "delete: [] XOR A = []");
		assert.deepEqual(this.oGroupController.getChangeData({}, oA), oEmpty, "");
		assert.deepEqual(this.oGroupController.getChangeData(oA, oA), null, "no change: A XOR A = null");
		assert.deepEqual(this.oGroupController.getChangeData(oA, {
			group: {}
		}), oA, "change: A XOR {group} = A");
		assert.deepEqual(this.oGroupController.getChangeData(oA, {}), oA, "change: A XOR {} = A");
		assert.deepEqual(this.oGroupController.getChangeData(oA, null), oA, "change: A XOR null = A");
		assert.deepEqual(this.oGroupController.getChangeData(oA, oB), oA, "change: A XOR B = A");
		assert.deepEqual(this.oGroupController.getChangeData(oA, oAx), oA, "change: A XOR A' = A");
		assert.deepEqual(this.oGroupController.getChangeData(oA, oAB), oA, "change: A XOR (A, B) = A");
		assert.deepEqual(this.oGroupController.getChangeData(oA, {
			group: {
				groupItems: []
			}
		}), oA, "change: A XOR [] = A");
		assert.deepEqual(this.oGroupController.getChangeData(oAx, oA), oAx, "change: A' XOR A = A'");
		assert.deepEqual(this.oGroupController.getChangeData(oAB, oAB), null, "no change: (A, B) XOR (A, B) = null");
		assert.deepEqual(this.oGroupController.getChangeData(oAB, oBA), oAB, "change: (A, B) XOR (B, A) = (A, B)");

	});

	QUnit.test("setTable", function(assert) {

		this.oGroupController.setTable(this.oTable);
		assert.deepEqual(this.oGroupController.getTable(), this.oTable, "Table has been passed to the GroupController");

	});

	QUnit.test("getColumn2Json - without table set", function(assert) {

		var oJSON = this.oGroupController.getColumn2Json(this.oTable.getColumns()[0], "name", 0);
		assert.equal(oJSON, null, "Table has not been set, return null");

	});

	QUnit.test("getColumn2Json - with table set", function(assert) {

		this.oGroupController.setTable(this.oTable);
		var oJSON = this.oGroupController.getColumn2Json(this.oTable.getColumns()[0], "name", 0);
		this.oGroupController.getAdditionalData2Json({
			group: {
				groupItems:[
					{

					}

				]
			}
		}, this.oTable);
		assert.ok(oJSON, "Table has been set without groups, return JSON");
		assert.equal(oJSON.columnKey, "name");
		assert.equal(oJSON.isGrouped, true);
		assert.equal(oJSON.operation, "GroupAscending");
		assert.equal(oJSON.showIfGrouped, false);

	});

	QUnit.test("syncJson2Table - with table set", function(assert) {

		this.oGroupController.setTable(this.oTable);

		var oColumnHelper = new ColumnHelper();
		oColumnHelper.addColumns(this.oTable.getColumns());
		this.oGroupController.setColumnHelper(oColumnHelper);

		this.oGroupController.syncJson2Table({
			group: {
				groupItems: [
					{
						columnKey: "name",
						isGrouped: false,
						operation: "GroupAscending",
						showIfGrouped: false
					}
				]
			}
		});

		assert.equal(this.oTable.getColumns()[0].getGrouped(), false, "syncing via JSON");

	});

	QUnit.test("getDataSuiteFormat2Json - without groupable columns", function(assert) {
		var oJSON = this.oGroupController.getDataSuiteFormat2Json({
			group: {
				groupItems:[
					{columnKey: "country", isGrouped: false, operation: "GroupAscending", showIfGrouped: false}
				]
			}
		});
		assert.ok(oJSON);
	});

	QUnit.start();

});
