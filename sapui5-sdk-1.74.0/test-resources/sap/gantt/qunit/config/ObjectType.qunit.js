/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ObjectType"
], function (ObjectType) {
	"use strict";

	QUnit.module("Create config.ObjectType with default values.", {
		beforeEach: function () {
			this.oConfig = new ObjectType();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "");
		assert.strictEqual(this.oConfig.getDescription(), "");
		assert.strictEqual(this.oConfig.getMainChartSchemeKey(), sap.gantt.config.DEFAULT_MAIN_CHART_SCHEME_KEY);
		assert.deepEqual(this.oConfig.getExpandedChartSchemeKeys(), []);
	});

	QUnit.module("Create config.ObjectType with customized values.", {
		beforeEach: function () {
			this.oConfig = new ObjectType({
				key: "T1",
				description: "Type 1",
				mainChartSchemeKey: "MC",
				expandedChartSchemeKeys: ["EC"]
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "T1");
		assert.strictEqual(this.oConfig.getDescription(), "Type 1");
		assert.strictEqual(this.oConfig.getMainChartSchemeKey(), "MC");
		assert.deepEqual(this.oConfig.getExpandedChartSchemeKeys(), ["EC"]);
	});
});
