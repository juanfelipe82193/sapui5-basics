/*global QUnit */
sap.ui.define([
	"sap/gantt/config/GanttChartLayout"
], function (GanttChartLayout) {
	"use strict";

	QUnit.module("Create config.GanttChartLayout with default values.", {
		beforeEach: function () {
			this.oConfig = new GanttChartLayout();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values." , function (assert) {
		assert.strictEqual(this.oConfig.getGanttChartSize(), "");
		assert.strictEqual(this.oConfig.getActiveModeKey(), sap.gantt.config.DEFAULT_MODE_KEY);
		assert.strictEqual(this.oConfig.getHierarchyKey(), sap.gantt.config.DEFAULT_HIERARCHY_KEY);
	});

	QUnit.module("Create config.GanttChartLayout with customized values.", {
		beforeEach: function () {
			this.oConfig = new GanttChartLayout({
				ganttChartSize: "90%",
				activeModeKey: "A",
				hierarchyKey: "HK",
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getGanttChartSize(), "90%");
		assert.strictEqual(this.oConfig.getActiveModeKey(), "A");
		assert.strictEqual(this.oConfig.getHierarchyKey(), "HK");
	});
});
