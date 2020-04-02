/*global QUnit */
sap.ui.define([
	"sap/gantt/config/SettingGroup",
	"sap/gantt/config/SettingItem"
], function (SettingGroup, SettingItem) {
	"use strict";

	QUnit.module("Create config.SettingGroup with default values.", {
		beforeEach: function () {
			this.oConfig = new SettingGroup();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.deepEqual(this.oConfig.getItems(), sap.gantt.config.DEFAULT_TOOLBAR_SETTING_ITEMS);
	});

	QUnit.module("Create config.SettingGroup with customized values.", {
		beforeEach: function () {
			this.aSettingItems = [
				new SettingItem({
					checked: true,
					key: "Item1",
					displayText: "Enable cursorline"
				}),
				new SettingItem({
					checked: true,
					key: "Item2",
					displayText: "Enable Nowline"
				})];
			this.oConfig = new SettingGroup({
				items: this.aSettingItems
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.deepEqual(this.oConfig.getItems(), this.aSettingItems);
	});
});
