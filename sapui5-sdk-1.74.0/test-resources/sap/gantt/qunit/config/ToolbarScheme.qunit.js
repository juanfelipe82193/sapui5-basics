/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ToolbarScheme",
	"sap/gantt/config/ToolbarGroup",
	"sap/gantt/config/TimeZoomGroup",
	"sap/gantt/config/LayoutGroup",
	"sap/gantt/config/ExpandChartGroup",
	"sap/gantt/config/ModeGroup"
], function (ToolbarScheme, ToolbarGroup, TimeZoomGroup, LayoutGroup, ExpandChartGroup, ModeGroup) {
	"use strict";

	QUnit.module("Create config.ToolbarScheme with default values.", {
		beforeEach: function () {
			this.oConfig = new ToolbarScheme();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "");
		assert.strictEqual(this.oConfig.getSourceSelect(), null);
		assert.strictEqual(this.oConfig.getLayout(), null);
		assert.strictEqual(this.oConfig.getCustomToolbarItems(), null);
		assert.deepEqual(this.oConfig.getExpandChart(), null);
		assert.strictEqual(this.oConfig.getExpandTree(), null);
		assert.strictEqual(this.oConfig.getTimeZoom(), null);
		assert.strictEqual(this.oConfig.getLegend(), null);
		assert.strictEqual(this.oConfig.getSettings(), null);
		assert.strictEqual(this.oConfig.getMode(), null);
		assert.strictEqual(this.oConfig.getToolbarDesign(), sap.m.ToolbarDesign.Auto);
	});

	QUnit.module("Create config.ToolbarScheme with customized values.", {
		beforeEach: function () {
			this.oSourceSelect = new ToolbarGroup({
				position: "L1",
				overflowPriority: sap.m.OverflowToolbarPriority.High
			});
			this.oLayout = new LayoutGroup({
				enableRichStyle: false
			});
			this.oCustomToolbarItems = new ToolbarGroup({
				position: "L2",
				overflowPriority: sap.m.OverflowToolbarPriority.Low
			});
			this.oExpandChart = new ExpandChartGroup();
			this.oExpandTree = new ToolbarGroup({
				position: "L3",
				overflowPriority: sap.m.OverflowToolbarPriority.Low
			});
			this.oTimeZoom = new TimeZoomGroup({
				position: "L4",
				overflowPriority: sap.m.OverflowToolbarPriority.High
			});
			this.oLegend = new ToolbarGroup({
				position: "L5",
				overflowPriority: sap.m.OverflowToolbarPriority.Disappear
			});
			this.oSettings = new ToolbarGroup({
				position: "L6",
				overflowPriority: sap.m.OverflowToolbarPriority.NeverOverflow
			});
			this.oModeGroup = new ModeGroup({
				modeKeys: ["A", "D"]
			});
			this.oConfig = new ToolbarScheme({
				key: "ToolBarScheme",
				sourceSelect: this.oSourceSelect,
				layout: this.oLayout,
				customToolbarItems: this.oCustomToolbarItems,
				expandChart: this.oExpandChart,
				expandTree: this.oExpandTree,
				timeZoom: this.oTimeZoom,
				legend: this.oLegend,
				settings: this.oSettings,
				mode: this.oModeGroup,
				toolbarDesign: sap.m.ToolbarDesign.Solid
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "ToolBarScheme");
		assert.strictEqual(this.oConfig.getSourceSelect(), this.oSourceSelect);
		assert.strictEqual(this.oConfig.getLayout(), this.oLayout);
		assert.strictEqual(this.oConfig.getCustomToolbarItems(), this.oCustomToolbarItems);
		assert.deepEqual(this.oConfig.getExpandChart(), this.oExpandChart);
		assert.strictEqual(this.oConfig.getExpandTree(), this.oExpandTree);
		assert.strictEqual(this.oConfig.getTimeZoom(), this.oTimeZoom);
		assert.strictEqual(this.oConfig.getLegend(), this.oLegend);
		assert.strictEqual(this.oConfig.getSettings(), this.oSettings);
		assert.strictEqual(this.oConfig.getMode(), this.oModeGroup);
		assert.strictEqual(this.oConfig.getToolbarDesign(), sap.m.ToolbarDesign.Solid);
	});
});
