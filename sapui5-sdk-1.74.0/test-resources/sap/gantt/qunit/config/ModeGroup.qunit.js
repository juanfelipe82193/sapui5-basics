/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ModeGroup"
], function (ModeGroup) {
	"use strict";

	QUnit.module("Create config.ModeGroup with default values.", {
		beforeEach: function () {
			this.oConfig = new ModeGroup();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.deepEqual(this.oConfig.getModeKeys(), []);
	});

	QUnit.module("Create config.ModeGroup with customized values.", {
		beforeEach: function () {
			this.oConfig = new ModeGroup({ modeKeys: ["A", "D"] });
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.deepEqual(this.oConfig.getModeKeys(), ["A", "D"]);
	});
});
