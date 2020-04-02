/*globals QUnit */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/variants/EditableVariantItem"

], function (
		EditableVariantItem
	) {
	"use strict";

			QUnit.module("sap.ui.comp.variants.EditableVariantItem", {
				beforeEach: function() {
					this.oEditableVariantItem = new EditableVariantItem();
				},
				afterEach: function() {
					this.oEditableVariantItem.destroy();
				}
			});

			QUnit.test("Shall be instantiable", function(assert) {
				assert.ok(this.oEditableVariantItem);
			});

			QUnit.test("Checking the key attribute", function(assert) {
				this.oEditableVariantItem.setKey("V1");

				assert.equal(this.oEditableVariantItem.getKey(), "V1", "the key attribute should be 'V1'" );
			});

			QUnit.start();

});