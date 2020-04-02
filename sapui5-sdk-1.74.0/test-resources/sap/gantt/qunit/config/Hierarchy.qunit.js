/*global QUnit */
sap.ui.define([
	"sap/gantt/config/Hierarchy",
	"sap/gantt/config/HierarchyColumn",
	"sap/gantt/config/ColumnAttribute"
], function (Hierarchy, HierarchyColumn, ColumnAttribute) {
	"use strict";

	QUnit.module("Create config.Hierarchy with default values.", {
		beforeEach: function () {
			this.oConfig = new Hierarchy();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values." , function (assert) {
		assert.strictEqual(this.oConfig.getKey(), sap.gantt.config.DEFAULT_HIERARCHY_KEY);
		assert.strictEqual(this.oConfig.getText(), this.oConfig._oRb.getText("XLST_DEFAULT_HIE"));
		assert.strictEqual(this.oConfig.getActiveModeKey(), sap.gantt.config.DEFAULT_MODE_KEY);
		assert.strictEqual(this.oConfig.getToolbarSchemeKey(), sap.gantt.config.DEFAULT_GANTTCHART_TOOLBAR_SCHEME_KEY);
		assert.deepEqual(this.oConfig.getColumns(), undefined);
		assert.deepEqual(this.oConfig.getExpandedLevels(), undefined);
	});

	QUnit.module("Create config.Hierarchy with customized values.", {
		beforeEach: function () {
			this.aColumns = [new HierarchyColumn({
				key: "C1",
				title: "Column1",
				contentType: "01",
				sortAttribute: "sorter",
				filterAttribute: "filter",
				attribute: "F1",
				attributes: [new ColumnAttribute({objectTypeKey: "OBJ1", attribute: "sorter"}), new ColumnAttribute({objectTypeKey: "OBJ1", attribute: "filter"})]
			}),
			new HierarchyColumn({
				key: "C2",
				title: "Column2",
				contentType: "02",
				sortAttribute: "sorter",
				filterAttribute: "filter",
				attribute: "F2",
				attributes: [new ColumnAttribute({objectTypeKey: "OBJ2", attribute: "sorter"}), new ColumnAttribute({objectTypeKey: "OBJ2", attribute: "filter"})]
			})];

			this.oConfig = new Hierarchy({
				key: "H1",
				text: "Hierarchy1",
				activeModeKey: "Z",
				toolbarSchemeKey: "T200",
				columns: this.aColumns,
				expandedLevels: [["01"], ["04"]]
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "H1");
		assert.strictEqual(this.oConfig.getText(), "Hierarchy1");
		assert.strictEqual(this.oConfig.getActiveModeKey(), "Z");
		assert.strictEqual(this.oConfig.getToolbarSchemeKey(), "T200");
		assert.deepEqual(this.oConfig.getColumns(), this.aColumns);
		assert.deepEqual(this.oConfig.getExpandedLevels(), [["01"], ["04"]]);
	});
});
