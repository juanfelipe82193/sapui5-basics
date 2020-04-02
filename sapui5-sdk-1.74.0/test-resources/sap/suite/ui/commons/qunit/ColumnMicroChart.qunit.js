sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/ColumnMicroChart",
	"sap/suite/ui/commons/ColumnMicroChartLabel"
], function(QUnitUtils, ColumnMicroChart, ColumnMicroChartLabel) {
	"use strict";


	QUnit.module("Rendering", {
		beforeEach: function() {
			this.oChart = new ColumnMicroChart("column-micro-chart", {
				width: "100px",
				height: "50px",
				leftTopLabel: new ColumnMicroChartLabel({ label: "Left", color: "Critical"}),
				rightBottomLabel: new ColumnMicroChartLabel({ label: "Right", color: "Error"}),
				columns: [
					{value: 0, color: "Good"}, {value: 10, color: "Error"},
					{value: -10, color: "Critical"}
				]
			});
			this.oChart.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("ColumnMicroChart wrapper is working", function(assert) {
		assert.ok(this.oChart.getDomRef(), "ColumnMicroChart was rendered successfully");
	});
});