/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ToolbarGroup"
], function (ToolbarGroup) {
	"use strict";

	QUnit.module("Create config.ToolbarGroup with default values.", {
		beforeEach: function () {
			this.oConfig = new ToolbarGroup();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getPosition(), "");
		assert.strictEqual(this.oConfig.getOverflowPriority(), sap.m.OverflowToolbarPriority.Low);
	});

	QUnit.module("Create config.ToolbarGroup with customized values.", {
		beforeEach: function () {
			this.oConfig = new ToolbarGroup({
				position: "L1",
				overflowPriority: sap.m.OverflowToolbarPriority.High
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getPosition(), "L1");
		assert.strictEqual(this.oConfig.getOverflowPriority(), sap.m.OverflowToolbarPriority.High);
	});
});
