/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	jQuery,
	ViewStateManager,
	Viewport,
	loader
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("Material", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);
	});

	QUnit.test("Double-sided materials", function(assert) {
		var done = assert.async();
		var scene = viewport.getScene();

		var getNumberOfMaterials = function(scene) {
			var nh = scene.getDefaultNodeHierarchy();
			var allNodes = nh.findNodesByName();
			var count = 0;
			allNodes.forEach(function(node) {
				if (node.material != null) {
					count++;
				}
			});
			return count;
		};

		var getNumberOfDoubleSidedMaterials = function(scene) {
			var nh = scene.getDefaultNodeHierarchy();
			var allNodes = nh.findNodesByName();
			var count = 0;
			allNodes.forEach(function(node) {
				if (node.material != null) {
					if (node.material.side === THREE.DoubleSide) {
						count++;
					}
				}
			});
			return count;
		};

		assert.ok(getNumberOfDoubleSidedMaterials(scene) === 0, "Initial state of materials ");

		scene.setDoubleSided(true);

		assert.ok(getNumberOfDoubleSidedMaterials(scene) === getNumberOfMaterials(scene), "All materials are double sided ");

		scene.setDoubleSided(false);

		assert.ok(getNumberOfDoubleSidedMaterials(scene) === 0, "No double sided materials");

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
