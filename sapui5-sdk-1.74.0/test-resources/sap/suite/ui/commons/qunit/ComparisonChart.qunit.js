sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/ComparisonChart",
	"sap/suite/ui/commons/library",
	"sap/suite/ui/commons/ComparisonData",
	"sap/ui/util/Mobile"
], function(QUnitUtils, ComparisonChart, commonsLibrary, ComparisonData, Mobile) {
	"use strict";

	// shortcut for sap.suite.ui.commons.ComparisonChartView
	var ComparisonChartView = commonsLibrary.ComparisonChartView;


	Mobile.init();

	QUnit.module("Rendering", {
		beforeEach: function() {
			this.oChart = new ComparisonChart("comparison-chart", {
				size: "M",
				scale: "M",
				view: ComparisonChartView.Normal,
				data: [
					new ComparisonData({
						title: "Americas",
						value: 10,
						color: "Good",
						displayValue: "10M"
					}),
					new ComparisonData({
						title: "EMEA",
						value: 20,
						color: "Critical",
						displayValue: "18M"
					})],
				shrinkable: false,
				height: "400px"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("ComparisonChart wrapper is working", function(assert) {
		assert.ok(this.oChart.getDomRef(), "ComparisonChart was rendered successfully");
	});
});