/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/RedlineDesign",
	"sap/ui/vk/RedlineElementEllipse"
], function(
	jQuery,
	RedlineDesign,
	RedlineElementEllipse
) {
	"use strict";

	var redlineDesign = new RedlineDesign().placeAt("content");

	QUnit.test("RedlineDesign test", function(assert) {
		assert.ok(redlineDesign.hasStyleClass("sapUiVizkitRedlineInteractionMode"), "Default class should be 'sapUiVizkitRedlineInteractionMode' ");

		var ellipse = new RedlineElementEllipse();

		redlineDesign.startAdding(ellipse);
		var activeInstance = redlineDesign.getAggregation("activeElementInstance");
		assert.deepEqual(activeInstance, ellipse, "The active element instance is the one that we've just added");
		assert.ok(redlineDesign.hasStyleClass("sapUiVizkitRedlineDesignMode"), "While in adding mode, the control has 'sapUiVizkitRedlineDesignMode' class.");
		assert.ok(redlineDesign._isAddingModeActive, "Adding mode is active");

		redlineDesign.stopAdding();
		activeInstance = redlineDesign.getAggregation("activeElementInstance");
		assert.strictEqual(activeInstance, null, "After 'stopAdding', the active element instance is 'null'");
		assert.ok(redlineDesign.hasStyleClass("sapUiVizkitRedlineInteractionMode"), "While in interaction mode, the control has 'sapUiVizkitRedlineInteractionMode' class.");
		assert.notOk(redlineDesign._isAddingModeActive, "Adding mode is not active.");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
