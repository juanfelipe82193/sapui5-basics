/*global QUnit */
sap.ui.define([
	"sap/gantt/config/SettingItem"
], function (SettingItem) {
	"use strict";

	QUnit.module("Create config.SettingItem with default values.", {
		beforeEach: function () {
			this.oConfig = new SettingItem();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getChecked(), false);
		assert.strictEqual(this.oConfig.getKey(), "");
		assert.strictEqual(this.oConfig.getDisplayText(), "");
	});

	QUnit.module("Create config.SettingItem with customized values.", {
		beforeEach: function () {
			this.oConfig = new SettingItem({
				checked: true,
				key: "ITEM",
				displayText: "Enable Row Scroll Sync"
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getChecked(), true);
		assert.strictEqual(this.oConfig.getKey(), "ITEM");
		assert.strictEqual(this.oConfig.getDisplayText(), "Enable Row Scroll Sync");
	});
});
