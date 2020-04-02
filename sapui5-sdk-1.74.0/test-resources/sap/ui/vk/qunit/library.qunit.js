/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/getResourceBundle"
], function(
	jQuery,
	getResourceBundle
) {
	"use strict";

	QUnit.test("getting resource bundle", function(assert) {

		var resourceBundle1 = getResourceBundle();
		assert.ok(resourceBundle1, "Resource bundle is retrieved the first time");

		var resourceBundle2 = getResourceBundle();
		assert.ok(resourceBundle2, "Resource bundle is retrieved the second time");

		assert.strictEqual(resourceBundle1, resourceBundle2, "Resource bundles are the same");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
