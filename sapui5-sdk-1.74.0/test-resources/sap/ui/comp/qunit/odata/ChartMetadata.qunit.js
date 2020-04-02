/* global QUnit */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/odata/ChartMetadata"
	], function(ChartMetadata){

		QUnit.module("sap.ui.comp.odata.ChartMetadata");

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(ChartMetadata);
		});

		QUnit.test("Shall return the proper UI5 chart type based on Annotation chart type", function(assert) {
			var sType = null;

			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Waterfall");
			assert.strictEqual(sType, "waterfall");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Column");
			assert.strictEqual(sType, "column");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/AreaStacked");
			assert.strictEqual(sType, "stacked_column");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/ColumnStacked");
			assert.strictEqual(sType, "stacked_column");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/ColumnDual");
			assert.strictEqual(sType, "dual_column");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/ColumnStackedDual");
			assert.strictEqual(sType, "dual_stacked_column");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/AreaStacked100");
			assert.strictEqual(sType, "100_stacked_column");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/ColumnStacked100");
			assert.strictEqual(sType, "100_stacked_column");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/ColumnStackedDual100");
			assert.strictEqual(sType, "100_dual_stacked_column");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/HorizontalArea");
			assert.strictEqual(sType, "bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Bar");
			assert.strictEqual(sType, "bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/HorizontalAreaStacked");
			assert.strictEqual(sType, "stacked_bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/BarStacked");
			assert.strictEqual(sType, "stacked_bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/BarDual");
			assert.strictEqual(sType, "dual_bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/BarStackedDual");
			assert.strictEqual(sType, "dual_stacked_bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/HorizontalAreaStacked100");
			assert.strictEqual(sType, "100_stacked_bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/BarStacked100");
			assert.strictEqual(sType, "100_stacked_bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/BarStackedDual100");
			assert.strictEqual(sType, "100_dual_stacked_bar");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Radar");
			assert.strictEqual(sType, "line");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Area");
			assert.strictEqual(sType, "area");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Line");
			assert.strictEqual(sType, "line");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/LineDual");
			assert.strictEqual(sType, "dual_line");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Combination");
			assert.strictEqual(sType, "combination");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/CombinationStacked");
			assert.strictEqual(sType, "stacked_combination");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/CombinationDual");
			assert.strictEqual(sType, "dual_combination");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/CombinationStackedDual");
			assert.strictEqual(sType, "dual_stacked_combination");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationStacked");
			assert.strictEqual(sType, "horizontal_stacked_combination");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Pie");
			assert.strictEqual(sType, "pie");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Donut");
			assert.strictEqual(sType, "donut");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Scatter");
			assert.strictEqual(sType, "scatter");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Bubble");
			assert.strictEqual(sType, "bubble");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/HeatMap");
			assert.strictEqual(sType, "heatmap");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/TreeMap");
			assert.strictEqual(sType, "treemap");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/Bullet");
			assert.strictEqual(sType, "bullet");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/VerticalBullet");
			assert.strictEqual(sType, "vertical_bullet");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/HorizontalWaterfall");
			assert.strictEqual(sType, "horizontal_waterfall");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationDual");
			assert.strictEqual(sType, "dual_horizontal_combination");
			sType = ChartMetadata.getChartType("com.sap.vocabularies.UI.v1.ChartType/HorizontalCombinationStackedDual");
			assert.strictEqual(sType, "dual_horizontal_stacked_combination");

			sType = ChartMetadata.getChartType("foo");
			assert.strictEqual(sType, undefined);
		});

		QUnit.test("Shall return the proper UI5 chart measure role based on Annotation measure role", function(assert) {
			var sType = null;

			sType = ChartMetadata.getMeasureRole("com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1");
			assert.strictEqual(sType, "axis1");
			sType = ChartMetadata.getMeasureRole("com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis2");
			assert.strictEqual(sType, "axis2");
			sType = ChartMetadata.getMeasureRole("com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis3");
			assert.strictEqual(sType, "axis3");
			sType = ChartMetadata.getMeasureRole("com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis4");
			assert.strictEqual(sType, "axis4");

			sType = ChartMetadata.getMeasureRole("foo");
			assert.strictEqual(sType, undefined);
		});

		QUnit.test("Shall return the proper UI5 chart dimension role based on Annotation dimension role", function(assert) {
			var sType = null;

			sType = ChartMetadata.getDimensionRole("com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category");
			assert.strictEqual(sType, "category");
			sType = ChartMetadata.getDimensionRole("com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series");
			assert.strictEqual(sType, "series");
			sType = ChartMetadata.getDimensionRole("com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Category2");
			assert.strictEqual(sType, "category2");

			sType = ChartMetadata.getDimensionRole("foo");
			assert.strictEqual(sType, undefined);
		});

		QUnit.start();
	});

})();
