sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/qunit/utils/createAndAppendDiv",
	"sap/suite/ui/commons/ChartTile",
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/BulletChart",
	"sap/suite/ui/commons/BulletChartData",
	"sap/suite/ui/commons/ComparisonChart",
	"sap/suite/ui/commons/ComparisonData",
	"sap/ui/thirdparty/jquery"
], function(
	QUnitUtils,
	createAndAppendDiv,
	ChartTile,
	commonsLibrary,
	BulletChart,
	BulletChartData,
	ComparisonChart,
	ComparisonData,
	jQuery
) {
	"use strict";

	// shortcut for sap.suite.ui.commons.InfoTileValueColor
	var InfoTileValueColor = commonsLibrary.InfoTileValueColor;

	// shortcut for sap.suite.ui.commons.LoadState
	var LoadState = commonsLibrary.LoadState;

	// shortcut for sap.suite.ui.commons.InfoTileSize
	var InfoTileSize = commonsLibrary.InfoTileSize;

	createAndAppendDiv("contentArea");

	QUnit.module("Test chart data calculation", {
		afterEach: function() {
			this.oTile.destroy();
		}
	});

	QUnit.test("Bullet chart content rendering", function(assert) {
		var done = assert.async();
		this.oTile = new ChartTile("bullet-tile", {
			size: InfoTileSize.L,
			unit: "EUR",
			title: "Cumulative Totals",
			description: "Expenses",
			state: LoadState.Loaded,
			content: new BulletChart("bc1", {
				scale: "M",
				actual: new BulletChartData({ value: 120, color: InfoTileValueColor.Good }),
				targetValue: 100,
				thresholds: [
					new BulletChartData({ value: 0, color: InfoTileValueColor.Error }),
					new BulletChartData({ value: 50, color: InfoTileValueColor.Critical }),
					new BulletChartData({ value: 150, color: InfoTileValueColor.Critical }),
					new BulletChartData({ value: 200, color: InfoTileValueColor.Error })
				]
			}),
			footer: "Actual and Target"
		});
		this.oTile.placeAt("contentArea");
		setTimeout(function() {
			assert.equal("Cumulative Totals", jQuery(document.getElementById("bullet-tile-title")).text(), "title rendered");
			assert.equal("Expenses", jQuery(document.getElementById("bullet-tile-description")).text(), "description rendered");
			assert.equal("(EUR)", jQuery(document.getElementById("bullet-tile-unit")).text(), "unit rendered");
			assert.equal("Actual and Target", jQuery(document.getElementById("bullet-tile-footer-text")).text(), "footer rendered");
			assert.equal("120M", jQuery(document.getElementById("bc1-bc-item-value")).text(), "actual value rendered");
			assert.equal("100M", jQuery(document.getElementById("bc1-bc-target-value")).text(), "target value rendered");
			done();
		}, 1000);
	});

	QUnit.test("Comparison chart content rendering", function(assert) {
		var done = assert.async();
		this.oTile = new ChartTile("comparison-tile", {
			size: InfoTileSize.L,
			unit: "EUR",
			title: "Cumulative Totals",
			description: "Expenses",
			state: LoadState.Loaded,
			content: new ComparisonChart("cc1", {
				scale: "M",
				data: [
					new ComparisonData({ title: "Americas", value: 10, color: InfoTileValueColor.Good }),
					new ComparisonData({ title: "EMEA", value: 50, color: InfoTileValueColor.Good }),
					new ComparisonData({ title: "APAC", value: -20, color: InfoTileValueColor.Error })
			]})
		});
		this.oTile.placeAt("contentArea");
		setTimeout(function() {
			assert.equal("Cumulative Totals", jQuery(document.getElementById("comparison-tile-title")).text(), "title rendered");
			assert.equal("Expenses", jQuery(document.getElementById("comparison-tile-description")).text(), "description rendered");
			assert.equal("(EUR)", jQuery(document.getElementById("comparison-tile-unit")).text(), "unit rendered");

			assert.equal("10M", jQuery(document.getElementById("cc1-chart-item-0-value")).text(), "value in bar 0 rendered");
			assert.equal("50M", jQuery(document.getElementById("cc1-chart-item-1-value")).text(), "value in bar 1 rendered");
			assert.equal("-20M", jQuery(document.getElementById("cc1-chart-item-2-value")).text(), "value in bar 2 rendered");
			assert.equal("Americas", jQuery(document.getElementById("cc1-chart-item-0-title")).text(), "title in bar 0 rendered");
			assert.equal("EMEA", jQuery(document.getElementById("cc1-chart-item-1-title")).text(), "title in bar 1 rendered");
			assert.equal("APAC", jQuery(document.getElementById("cc1-chart-item-2-title")).text(), "title in bar 2 rendered");
			done();
		}, 1000);
	});
});