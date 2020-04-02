/*global QUnit */
sap.ui.define([
	"sap/gantt/config/LayoutGroup"
], function (LayoutGroup) {
	"use strict";

	QUnit.module("Create config.LayoutGroup with default values.", {
		beforeEach: function () {
			this.oConfig = new LayoutGroup();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values." , function (assert) {
		assert.strictEqual(this.oConfig.getEnableRichStyle(), true);
	});

	QUnit.module("Create config.LayoutGroup with customized values.", {
		beforeEach: function () {
			this.oConfig = new LayoutGroup({
				enableRichStyle: false
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getEnableRichStyle(), false);
	});
});
