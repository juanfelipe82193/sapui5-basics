sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
	"sap/suite/ui/commons/DeltaMicroChart"
], function(QUnitUtils, DeltaMicroChart) {
	"use strict";


	QUnit.module("Rendering", {
		beforeEach: function() {
			this.oChart = new DeltaMicroChart("delta-micro-chart", {
				value1: 5,
				value2: 20,
				title1: "title1",
				title2: "title2",
				press: function() {}
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("DeltaMicroChart wrapper is working", function(assert) {
		assert.ok(this.oChart.getDomRef(), "DeltaMicroChart was rendered successfully");
	});
});