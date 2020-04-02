/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/tools/HitTestTool",
	"sap/ui/vk/tools/HitTestClickType",
	"sap/ui/vk/threejs/Viewport",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	HitTestTool,
	HitTestClickType,
	Viewport,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("HitTestTool", "test-resources/sap/ui/vk/qunit/media/boxes.three.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewport.getCamera().setPosition([ 0, 0, 10 ]);
	});

	QUnit.test("Test 1", function(assert) {
		var tool = new HitTestTool();
		assert.ok(tool !== null, "Tool created");

		tool.setActive(true, viewport);
		var hit = tool.hitTest(10, 10, viewport.getScene(), viewport.getCamera(), HitTestClickType.Single);
		assert.ok(hit === null, "No objects detected");

		hit = tool.hitTest(viewport.getDomRef().clientWidth / 2, viewport.getDomRef().clientHeight / 2, viewport.getScene(), viewport.getCamera(), HitTestClickType.Single);
		assert.equal(hit && hit.object.name, "Box 2", "Correct object detected");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});