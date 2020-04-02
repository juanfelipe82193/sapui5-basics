/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ChartScheme"
], function (ChartScheme) {
	"use strict";

	QUnit.module("Create config.ChartScheme with default values.", {
		beforeEach: function () {
			this.oConfig = new ChartScheme();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "");
		assert.strictEqual(this.oConfig.getName(), "");
		assert.strictEqual(this.oConfig.getRowSpan(), 1);
		assert.strictEqual(this.oConfig.getIcon(), "");
		assert.strictEqual(this.oConfig.getModeKey(), sap.gantt.config.DEFAULT_MODE_KEY);
		assert.deepEqual(this.oConfig.getShapeKeys(), []);
	});

	QUnit.module("Create config.ChartScheme with customized values.", {
		beforeEach: function () {
			this.oConfig = new ChartScheme({
				key: "ChartScheme",
				name: "C1",
				rowSpan: 2,
				icon: "http://local:8080/1.png",
				modeKey: "Z",
				shapeKeys: ["S1", "S2"]
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "ChartScheme");
		assert.strictEqual(this.oConfig.getName(), "C1");
		assert.strictEqual(this.oConfig.getRowSpan(), 2);
		assert.strictEqual(this.oConfig.getIcon(), "http://local:8080/1.png");
		assert.strictEqual(this.oConfig.getModeKey(), "Z");
		assert.deepEqual(this.oConfig.getShapeKeys(), ["S1", "S2"]);
	});
});
