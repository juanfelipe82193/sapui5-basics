/*global QUnit */
sap.ui.define([
	"sap/gantt/config/ContainerLayout",
	"sap/gantt/config/GanttChartLayout"
], function (ContainerLayout, GanttChartLayout) {
	"use strict";

	QUnit.module("Create config.ContainerLayout with default values.", {
		beforeEach: function () {
			this.oConfig = new ContainerLayout();
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test default configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), sap.gantt.config.DEFAULT_CONTAINER_SINGLE_LAYOUT_KEY);
		assert.strictEqual(this.oConfig.getText(), sap.ui.getCore().getLibraryResourceBundle("sap.gantt").getText("XLST_SINGLE_LAYOUT"));
		assert.strictEqual(this.oConfig.getOrientation(), sap.ui.core.Orientation.Vertical);
		assert.strictEqual(this.oConfig.getActiveModeKey(), sap.gantt.config.DEFAULT_MODE_KEY);
		assert.strictEqual(this.oConfig.getToolbarSchemeKey(), sap.gantt.config.DEFAULT_CONTAINER_TOOLBAR_SCHEME_KEY);
		assert.strictEqual(this.oConfig.getSelectionPanelSize(), "30%");
		assert.deepEqual(this.oConfig.getGanttChartLayouts(), []);
	});

	QUnit.module("Create config.ContainerLayout with customized values.", {
		beforeEach: function () {
			this.aGanttChartLayouts = [
				new GanttChartLayout({
					viewSize: "40%",
					activeModeKey: "A",
					hierarchyKey: "HK"
				}),
				new GanttChartLayout({
					viewSize: "35%",
					activeModeKey: "D",
					hierarchyKey: "HK2"
				})];
			this.oConfig = new ContainerLayout({
				key: "CONTAINERLAYOUT",
				text: "Container Layout",
				orientation: sap.ui.core.Orientation.Horizontal,
				activeModeKey: "D",
				toolbarSchemeKey: "ToolbarScheme",
				selectionPanelSize: "25%",
				ganttChartLayouts: this.aGanttChartLayouts
			});
		},
		afterEach: function () {
			this.oConfig.destroy();
			this.oConfig = undefined;
		}
	});

	QUnit.test("Test customized configuration values.", function (assert) {
		assert.strictEqual(this.oConfig.getKey(), "CONTAINERLAYOUT");
		assert.strictEqual(this.oConfig.getText(), "Container Layout");
		assert.strictEqual(this.oConfig.getOrientation(), sap.ui.core.Orientation.Horizontal);
		assert.strictEqual(this.oConfig.getActiveModeKey(), "D");
		assert.strictEqual(this.oConfig.getToolbarSchemeKey(), "ToolbarScheme");
		assert.strictEqual(this.oConfig.getSelectionPanelSize(), "25%");
		assert.deepEqual(this.oConfig.getGanttChartLayouts(), this.aGanttChartLayouts);
	});
});
