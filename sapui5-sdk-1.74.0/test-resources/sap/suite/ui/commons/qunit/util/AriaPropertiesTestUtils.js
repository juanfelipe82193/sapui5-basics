/*global QUnit,sinon*/

sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function (JSONModel) {
	"use strict";
	return {
		ariaPropertiesSupport: function(ControlClass) {
			QUnit.module("Control supports AriaProperties utility", {
				beforeEach: function() {
					var oData = {
						ariaProperties: {
							label: "Test label",
							labelledBy: "id4",
							describedBy: "id0",
							hasPopup: "dialog",
							role: "button"
						}
					};
					var oJModel = new JSONModel(oData);
					this.oControl = new ControlClass({
						ariaProperties: {
							label: "{/ariaProperties/label}",
							labelledBy: "{/ariaProperties/labelledBy}",
							describedBy: "{/ariaProperties/describedBy}",
							role: "{/ariaProperties/role}",
							hasPopup: "{/ariaProperties/hasPopup}"
						}
					});
					this.oControl.setModel(oJModel);
					this.oControl.placeAt("qunit-fixture");
					sap.ui.getCore().applyChanges();
				},
				afterEach: function() {
					this.oControl.destroy();
					this.oControl = null;
				}
			});

			QUnit.test("Test aria properties.", function(assert) {
				var $Control = this.oControl.$();
				assert.equal($Control.attr("aria-label"), "Test label", "Test aria-label property.");
				assert.equal($Control.attr("aria-labelledby"), "id4", "Test aria-labelledby property.");
				assert.equal($Control.attr("aria-describedby"), "id0", "Test aria-describedby property.");
				assert.equal($Control.attr("aria-haspopup"), "dialog", "Test aria-haspoup property.");
				assert.equal($Control.attr("role"), "button", "Test role property.");
			});
		}
	};
});


