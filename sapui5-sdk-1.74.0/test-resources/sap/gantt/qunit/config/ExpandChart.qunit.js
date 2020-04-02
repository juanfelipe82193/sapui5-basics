/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ExpandChart"
], function (ExpandChart) {
	"use strict";

	QUnit.module("Create config.ExpandChart with default values.", {
		beforeEach: function () {
			this.oConfig = new ExpandChart();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getIcon(), "");
		assert.strictEqual(this.oConfig.getIsExpand(), false);
		assert.deepEqual(this.oConfig.getChartSchemeKeys(), []);
	});

	QUnit.module("Create config.ExpandChart with customized values.", {
		beforeEach: function () {
			this.oConfig = new ExpandChart({
				icon: "http://localhost:8080/1.png",
				isExpand: true,
				chartSchemeKeys: ["C1", "C2"]
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getIcon(), "http://localhost:8080/1.png");
		assert.strictEqual(this.oConfig.getIsExpand(), true);
		assert.deepEqual(this.oConfig.getChartSchemeKeys(), ["C1", "C2"]);
	});
});
