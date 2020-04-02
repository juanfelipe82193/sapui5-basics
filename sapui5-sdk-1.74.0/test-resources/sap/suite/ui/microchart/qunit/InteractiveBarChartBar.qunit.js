/*global QUnit */
sap.ui.define([
	"sap/suite/ui/microchart/InteractiveBarChartBar"
], function (InteractiveBarChartBar) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("basic tests", {
		beforeEach: function() {
			this.oChart = new InteractiveBarChartBar();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});
	QUnit.test("InteractiveLineChart can be instantiated", function(assert) {
		assert.ok(this.oChart, "The InteractiveBarChartBar element is found in the library and instantiated");
	});
	QUnit.test("InteractiveBarChartBar property color", function(assert) {
		assert.equal(this.oChart.getColor(), "Neutral", "The property color is found and correctly set to the default value");
	});
	QUnit.test("Default values of properties", function(assert) {
		//Assert
		assert.strictEqual(this.oChart.getSelected(), false, "Property 'selected': default value is false");
	});

	QUnit.module("Tests for validateProperty method", {
		beforeEach: function() {
			this.oChart = new InteractiveBarChartBar();
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Value is undefined", function(assert) {
		//Assert
		assert.equal(this.oChart._bNullValue, true, "_bNullValue should be true if the value is undefined" );
	});

	QUnit.test("Value is a string", function(assert) {
		//Arrange
		try {
			this.oChart.setValue("string");
		} catch (err) {
			//do nothing
		}
		//Assert
		assert.equal(this.oChart._bNullValue, true, "_bNullValue should be true if the value is NaN" );
	});

	QUnit.test("Value is null", function(assert) {
		//Arrange
		this.oChart.setValue(null);
		//Assert
		assert.equal(this.oChart._bNullValue, true, "_bNullValue should be true if the value is null" );
	});

	QUnit.test("Value is a negative number", function(assert) {
		//Arrange
		this.oChart.setValue(-5);
		//Assert
		assert.equal(this.oChart._bNullValue, false, "_bNullValue should be false if the value is negative" );
	});

	QUnit.test("Value is a positive number", function(assert) {
		//Arrange
		this.oChart.setValue(5);
		//Assert
		assert.equal(this.oChart._bNullValue, false, "_bNullValue should be false if the value is positive" );
	});

	QUnit.test("Value is 0", function(assert) {
		//Arrange
		this.oChart.setValue(0);
		//Assert
		assert.equal(this.oChart._bNullValue, false, "_bNullValue should be false if the value is 0" );
	});
});

