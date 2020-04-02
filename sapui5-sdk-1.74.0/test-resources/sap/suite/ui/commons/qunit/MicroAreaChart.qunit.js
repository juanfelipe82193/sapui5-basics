sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/MicroAreaChart",
	"sap/suite/ui/commons/MicroAreaChartItem"
], function(QUnitUtils, MicroAreaChart, MicroAreaChartItem) {
	"use strict";


	QUnit.module("Rendering", {
		beforeEach: function() {
			this.oChart = new MicroAreaChart("micro-area-chart", {
				target: new MicroAreaChartItem({ points: [ {x: 0, y: 0}, {x: 60, y: 40}, {x: 100, y: 90} ] }),
				innerMinThreshold: new MicroAreaChartItem({ color: "Good" }),
				innerMaxThreshold: new MicroAreaChartItem({ color: "Good" }),
				minThreshold: new MicroAreaChartItem({ color: "Error", points: [ {x: 0, y: 0}, {x: 60, y: 30}, {x: 100, y: 70} ] }),
				maxThreshold: new MicroAreaChartItem({ color: "Good", points: [ {x: 0, y: 0}, {x: 60, y: 50}, {x: 100, y: 100} ] }),
				chart: new MicroAreaChartItem({ points: [ {x: 0, y: 0}, {x: 60, y: 20}, {x: 100, y: 80} ] }),
				lines: [ new MicroAreaChartItem({ points: [ {x: 0, y: 100}, {x: 100, y: 0} ] }) ]
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("MicroAreaChart wrapper is working", function(assert) {
		assert.ok(this.oChart.getDomRef(), "MicroAreaChart was rendered successfully");
	});
});