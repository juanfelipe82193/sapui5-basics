/* globals QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/smartfilterbar/SFBMultiInput",
	"sap/m/MultiInput",
	"sap/ui/core/Core"
], function(
	SFBMultiInput,
	MultiInput,
	Core
) {
	"use strict";

	QUnit.module("Generic", {
		beforeEach: function() {
			this.oControl = new SFBMultiInput();
		},
		afterEach: function() {
			this.oControl.destroy();
			this.oControl = null;
		}
	});

	QUnit.test("Override onBeforeRendering method calls parent method", function (assert) {
		// Arrange
		var oSpy = sinon.spy(MultiInput.prototype, "onBeforeRendering");

		// Act
		this.oControl.placeAt("qunit-fixture");
		Core.applyChanges();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "Overridden method called once");

		// Cleanup
		oSpy.restore();
	});

	QUnit.module("Token creation from initial value", {
		beforeEach: function() {
			this.oControl = new SFBMultiInput();
		},
		afterEach: function() {
			this.oControl.destroy();
		}
	});

	QUnit.test("With value", function (assert) {
		// Arrange
		var oSpy = sinon.spy(this.oControl, "_validateCurrentText");

		// Act
		this.oControl.setValue("test");
		this.oControl.placeAt("qunit-fixture");
		Core.applyChanges();

		// Assert
		assert.strictEqual(oSpy.callCount, 1, "_validateCurrentText called once");
		assert.ok(oSpy.calledWith(true), "Method called with bExactMatch=true");

		// Cleanup
		oSpy.restore();
	});

	QUnit.test("Without value", function (assert) {
		// Arrange
		var oSpy = sinon.spy(this.oControl, "_validateCurrentText");

		// Act
		this.oControl.placeAt("qunit-fixture");
		Core.applyChanges();

		// Assert
		assert.strictEqual(oSpy.callCount, 0, "_validateCurrentText not called");

		// Cleanup
		oSpy.restore();
	});

	QUnit.start();

});
