/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ColumnAttribute"
], function (ColumnAttribute) {
	"use strict";

	QUnit.module("Create config.ColumnAttribute with default values.", {
		beforeEach: function () {
			this.oConfig = new ColumnAttribute();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getObjectTypeKey(), "");
		assert.strictEqual(this.oConfig.getAttribute(), "");
	});

	QUnit.module("Create config.ColumnAttribute with customized values.", {
		beforeEach: function () {
			this.oConfig = new ColumnAttribute({
				objectTypeKey: "O1",
				attribute: "A1"
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getObjectTypeKey(), "O1");
		assert.strictEqual(this.oConfig.getAttribute(), "A1");
	});
});
