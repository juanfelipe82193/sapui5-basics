/*global QUnit */
/*eslint no-undef:1, no-unused-vars:1, strict: 1 */
sap.ui.define([
	"sap/suite/ui/microchart/InteractiveLineChartPoint"
], function (InteractiveLineChartPoint) {
	"use strict";

	jQuery.sap.initMobile();


	QUnit.module("InteractiveLineChartPoint is defined", {
		beforeEach: function() {
			this.oPoint = new InteractiveLineChartPoint();
		},
		afterEach: function() {
			this.oPoint.destroy();
		}
	});
	QUnit.test("Selected property default", function(assert) {
		assert.equal(this.oPoint.getSelected(), false, "The default value for Selected property is properly defined");
	});
	QUnit.test("Value property default", function(assert) {
		assert.equal(this.oPoint.getValue(), 0.0, "The default value for Value property is properly defined");
		assert.ok(this.oPoint._bNullValue, "Internal flag '_bNullValue' is set to false by default.");
	});

	QUnit.test("InteractiveLineChartPoint property color", function(assert) {
		assert.equal(this.oPoint.getColor(), "Neutral", "The property color is found and correctly set to the default value");
	});

	QUnit.test("Modifying Value property shall end in 0.0 and set the flag '_bNullValue'", function(assert) {
		//Arrange
		this.oPoint.setValue(5);
		assert.equal(this.oPoint.getValue(), 5, "Check if validateProperty retuns 'oValue' correctly. If not, setter is not working.");
		assert.ok(!this.oPoint._bNullValue, "Internal indicator is set to false");
		//Act
		this.oPoint.setValue(null);
		//Assert
		assert.equal(this.oPoint.getValue(), 0.0, "The default value for Value property is properly defined");
		assert.ok(this.oPoint._bNullValue, "Internal indicator is set to true");
	});

	QUnit.test("Modifying Label property should not modify the inter flag '_bNullValue'", function(assert) {
		//Arrange
		this.oPoint.setValue(5.5);
		assert.ok(!this.oPoint._bNullValue, "Internal indicator is set to false");
		//Act
		this.oPoint.setLabel("Otto");
		//Assert
		assert.ok(!this.oPoint._bNullValue, "Internal indicator is set to false");
	});
});
