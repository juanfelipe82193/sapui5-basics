/*globals QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/variants/VariantItem"

], function (
		VariantItem
	) {
	"use strict";

	QUnit.module("sap.ui.comp.variants.VariantItem", {
		beforeEach: function() {
			this.oVariantItem = new VariantItem();
		},
		afterEach: function() {
			this.oVariantItem.destroy();
		}
	});

	QUnit.test("Shall be instantiable", function(assert) {
		assert.ok(this.oVariantItem);
	});

	QUnit.test("Checking the key attribute", function(assert) {
		this.oVariantItem.setKey("V1");

		assert.equal(this.oVariantItem.getKey(), "V1", "the key attribute should be 'V1'" );
	});

	// more to follow

	QUnit.start();

});