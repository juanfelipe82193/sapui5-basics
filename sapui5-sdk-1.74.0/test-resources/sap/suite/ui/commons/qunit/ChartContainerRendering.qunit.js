sap.ui.define([
	"jquery.sap.global",
	"sap/suite/ui/commons/ChartContainer"
], function(jQuery, ChartContainer) {
	"use strict";

	QUnit.module("Rendering", {
		beforeEach : function() {
			this.oChartContainer = new ChartContainer();
			this.oChartContainer.placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach : function() {
			this.oChartContainer.destroy();
			this.oChartContainer = null;
		}
	});

	QUnit.test("DOM Structure created", function(assert) {
		//Arrange
		var $ChartContainer = this.oChartContainer.$();
		//Assert
		assert.ok($ChartContainer, "Chart Container rendered");
		assert.equal($ChartContainer.children().length, 1, "Chart Container content wrapper rendered");
		assert.equal($ChartContainer.children().children().length, 2, "Chart Container content wrapper inner structure rendered");
		assert.equal(this.oChartContainer.$("chartArea").length, 1, "Chart Container content wrapper inner structure has an id");
	});

	QUnit.test("CSS classes added", function(assert) {
		//Arrange
		var $ChartContainer = this.oChartContainer.$();
		//Assert
		assert.ok($ChartContainer.hasClass("sapSuiteUiCommonsChartContainer"), "CSS class'sapSuiteUiCommonsChartContainer' added");
		assert.ok($ChartContainer.children().hasClass("sapSuiteUiCommonsChartContainerWrapper"), "CSS class'sapSuiteUiCommonsChartContainerWrapper' on Chart Container content wrapper added");
		assert.ok(jQuery($ChartContainer.children().children()[0]).hasClass("sapSuiteUiCommonsChartContainerToolBarArea"), "CSS class'sapSuiteUiCommonsChartContainerToolBarArea' on Toolbar area added");
		assert.ok(jQuery($ChartContainer.children().children()[1]).hasClass("sapSuiteUiCommonsChartContainerChartArea"), "CSS class'sapSuiteUiCommonsChartContainerChartArea' on Chart area added");
	});
});
