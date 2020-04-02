/*global QUnit */
sap.ui.define([
	"sap/gantt/config/Mode"
], function (Mode) {
	"use strict";

	QUnit.module("Create config.Mode with default values.", {
		beforeEach: function () {
			this.oConfig = new Mode();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "");
		assert.strictEqual(this.oConfig.getText(), "");
		assert.strictEqual(this.oConfig.getIcon(), "");
	});

	QUnit.module("Create config.Mode with customized values.", {
		beforeEach: function () {
			this.oConfig = new Mode({
				key: "Z",
				text: "Z mode",
				icon: "http://localhost/1.png"
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "Z");
		assert.strictEqual(this.oConfig.getText(), "Z mode");
		assert.strictEqual(this.oConfig.getIcon(), "http://localhost/1.png");
	});
});
