/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithViewer",
	"sap/ui/vk/SelectionMode"
], function(
	jQuery,
	loader,
	SelectionMode
) {
	"use strict";

	QUnit.moduleWithViewer("SceneTree", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.vds", "vds", function(assert) {
		var vp = this.viewer.getViewport().getImplementation();
		assert.equal(vp.getSelectionMode(), SelectionMode.Exclusive, "Default Viewer selection mode on Viewport.vk");

		var nodes = [];
		var nh = this.viewer.getScene().getDefaultNodeHierarchy();
		nh.enumerateChildren(nh.getChildren()[0], function(child) {
			nodes.push(child.getNodeRef());
		});

		// Override hitTest with this fake implementation
		vp.hitTest = function(x, y) {
			if (x === 10) {
				return nodes[0];
			}

			if (x === 20) {
				return nodes[1];
			}

			return null;
		};

		this.nodes = nodes;
	});

	QUnit.test("Exclusive mode", function(assert) {
		var viewport = this.viewer.getViewport();
		viewport.setSelectionMode(SelectionMode.Exclusive);
		var viewStateManager = sap.ui.getCore().byId(viewport.getViewStateManager());

		viewport.tap(10, 0, false);
		var selectedNodes = [];
		viewStateManager.enumerateSelection(function(node){selectedNodes.push(node);});
		assert.equal(selectedNodes.length, 1, "First exclusive select count checked");
		assert.equal(selectedNodes[0], this.nodes[0], "First exclusive selected node checked");

		viewport.tap(20, 0, false);
		selectedNodes = [];
		viewStateManager.enumerateSelection(function(node){selectedNodes.push(node);});
		assert.equal(selectedNodes.length, 1, "Second exclusive select count checked");
		assert.equal(selectedNodes[0], this.nodes[1], "Second exclusive selected node checked");

		viewport.tap(0, 0, false);
		selectedNodes = [];
		viewStateManager.enumerateSelection(function(node){selectedNodes.push(node);});
		assert.equal(selectedNodes.length, 0, "Deselect exclusive checked");
	});

	QUnit.test("Sticky mode", function(assert) {
		var viewport = this.viewer.getViewport();
		viewport.setSelectionMode(SelectionMode.Sticky);
		var viewStateManager = sap.ui.getCore().byId(viewport.getViewStateManager());

		viewport.tap(10, 0, false);
		var selectedNodes = [];
		viewStateManager.enumerateSelection(function(node){selectedNodes.push(node);});
		assert.equal(selectedNodes.length, 1, "First sticky select count checked");
		assert.equal(selectedNodes[0], this.nodes[0], "First sticky select node checked");

		viewport.tap(20, 0, false);
		selectedNodes = [];
		viewStateManager.enumerateSelection(function(node){selectedNodes.push(node);});
		assert.equal(selectedNodes.length, 2, "Second sticky select count checked");
		assert.equal(selectedNodes[1], this.nodes[1], "Second sticky select node checked");

		viewport.tap(20, 0, false);
		selectedNodes = [];
		viewStateManager.enumerateSelection(function(node){selectedNodes.push(node);});
		assert.equal(selectedNodes.length, 1, "Second sticky deselect count checked");
		assert.equal(selectedNodes[0], this.nodes[0], "Second sticky deselect node checked");

		viewport.tap(0, 0, false);
		selectedNodes = [];
		viewStateManager.enumerateSelection(function(node){selectedNodes.push(node);});
		assert.equal(selectedNodes.length, 0, "Deselect sticky checked");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
