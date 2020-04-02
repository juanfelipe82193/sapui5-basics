/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ExpandChartGroup",
	"sap/gantt/config/ExpandChart"
], function (ExpandChartGroup, ExpandChart) {
	"use strict";

	QUnit.module("Create config.ExpandChartGroup with default values.", {
		beforeEach: function () {
			this.oConfig = new ExpandChartGroup();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.deepEqual(this.oConfig.getExpandCharts(), []);
	});

	QUnit.module("Create config.ExpandChartGroup with customized values.", {
		beforeEach: function () {
			this.aExpandCharts = [
				new ExpandChart({
					icon: "http://localhost:8080/1.png",
					isExpand: true,
					chartSchemeKeys: ["C1", "C2"]
				}),
				new ExpandChart({
					icon: "http://localhost:8080/2.png",
					isExpand: false,
					chartSchemeKeys: ["C3", "C4"]
				})];
			this.oConfig = new ExpandChartGroup({
				expandCharts: this.aExpandCharts
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.deepEqual(this.oConfig.getExpandCharts(), this.aExpandCharts);
	});
});
