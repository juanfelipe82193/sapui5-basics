/*global QUnit */
sap.ui.define([
	"sap/gantt/config/HierarchyColumn",
	"sap/gantt/config/ColumnAttribute"
], function (HierarchyColumn, ColumnAttribute) {
	"use strict";

	QUnit.module("Create config.HierarchyColumn with default values.", {
		beforeEach: function () {
			this.oConfig = new HierarchyColumn();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "");
		assert.strictEqual(this.oConfig.getTitle(), "");
		assert.strictEqual(this.oConfig.getContentType(), "");
		assert.strictEqual(this.oConfig.getSortAttribute(), "");
		assert.strictEqual(this.oConfig.getFilterAttribute(), "");
		assert.strictEqual(this.oConfig.getAttribute(), "");
		assert.deepEqual(this.oConfig.getAttributes(), []);
	});

	QUnit.module("Create config.HierarchyColumn with customized values.", {
		beforeEach: function () {
			this.aColumnAttributes = [
				new ColumnAttribute({ objectTypeKey: "OBJ1", attribute: "sorter" }),
				new ColumnAttribute({ objectTypeKey: "OBJ1", attribute: "filter" }),
				new ColumnAttribute({ objectTypeKey: "OBJ1", attribute: "attribute1" })
			];
			this.oConfig = new HierarchyColumn({
				key: "C1",
				title: "Column1",
				contentType: "02",
				sortAttribute: "sorter",
				filterAttribute: "filter",
				attribute: "ATTRIBUTE1",
				attributes: this.aColumnAttributes
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "C1");
		assert.strictEqual(this.oConfig.getTitle(), "Column1");
		assert.strictEqual(this.oConfig.getContentType(), "02");
		assert.strictEqual(this.oConfig.getSortAttribute(), "sorter");
		assert.strictEqual(this.oConfig.getFilterAttribute(), "filter");
		assert.strictEqual(this.oConfig.getAttribute(), "ATTRIBUTE1");
		assert.deepEqual(this.oConfig.getAttributes(), this.aColumnAttributes);
	});
});
