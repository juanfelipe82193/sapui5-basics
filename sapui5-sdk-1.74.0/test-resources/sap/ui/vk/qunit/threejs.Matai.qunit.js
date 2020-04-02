/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/threejs/Billboard",
	"sap/ui/vk/threejs/Callout",
	"sap/ui/vk/threejs/PolylineMesh",
	"sap/ui/vk/threejs/PolylineMaterial",
	"sap/ui/vk/threejs/PolylineGeometry"
], function(
	jQuery,
	Viewport,
	ContentConnector,
	ContentResource,
	Billboard,
	Callout,
	PolylineMesh,
	PolylineMaterial,
	PolylineGeometry
) {
	"use strict";

	var contentConnector = new ContentConnector();

	var viewport = new Viewport({
		contentConnector: contentConnector
	});
	viewport.placeAt("content");

	QUnit.test("Loading scene", function(assert) {
		var done = assert.async();

		contentConnector.attachContentChangesFinished(function(event) {
			var content = event.getParameter("content");
			if (content) {
				var scene = content.getSceneRef();
				assert.ok(scene instanceof THREE.Scene, "VDS4 file is loaded");

				var annotationsModel = scene.children[0];
				assert.equal(annotationsModel.name, "VDS4-annotations", "Root name");

				[ "RichText1", "Callout A", "Callout 1", "Point Head", "Near Object", "Note1", "Note2" ].forEach(function(name, index) {
					var node = annotationsModel.getChildByName(name);
					assert.notEqual(node, undefined, name + " node found");
					assert.ok(node.children.length > 0, name + " has children");

					var billboard = node.userData.billboard;
					var target = annotationsModel.children[0];
					if (index > 0) {// callout
						assert.ok(billboard instanceof Callout, name + " is a callout");
						assert.ok(node.children.length > 2, name + " children test");
						var callout = billboard;
						assert.deepEqual(target, callout.getAnchorNode(), name + " callout anchor node test");
						assert.ok(node.children[1] instanceof PolylineMesh && node.children[1].isHaloMesh, name + " has a halo polyline mesh");
						assert.ok(node.children[1].geometry instanceof PolylineGeometry, name + " halo polyline mesh geometry test");
						assert.ok(node.children[1].material instanceof PolylineMaterial, name + " halo polyline mesh material test");
						assert.deepEqual(target, node.children[1].userData.targetNode, name + " halo polyline target test");
						assert.ok(node.children[2] instanceof PolylineMesh && !node.children[2].isHaloMesh, name + " has a polyline mesh");
						assert.ok(node.children[2].geometry instanceof PolylineGeometry, name + " polyline mesh geometry test");
						assert.ok(node.children[2].material instanceof PolylineMaterial, name + " polyline mesh material test");
						assert.deepEqual(target, node.children[2].userData.targetNode, name + " polyline target test");
					} else {// billboard
						assert.ok(billboard instanceof Billboard, name + " is a billboard");
						assert.ok(node.children.length === 1, name + " children test");
					}
					node.children.forEach(function(child, index) {
						assert.deepEqual(child.layers, node.layers, name + " child[" + index + "] layers test");
					});
				});

				var multipleShapesModel = scene.children[1];
				assert.equal(multipleShapesModel.name, "VDS4-multiple_shapes", "Root name");

				[ "box", "capsule", "cone", "cylinder", "donut", "frame", "gear", "geosphere", "helix", "stairs", "Text" ].forEach(function(name, index) {
					var node = multipleShapesModel.children[index];
					assert.equal(node.name, name, name + " name test");
					assert.equal(node.children.length, index === 0 ? 2 : 1, name + " children test");
					assert.equal(node.layers.mask, index < 10 ? 1 : 0, name + (index < 10 ? " visible" : " invisible")); // "Text" node is invisible
					node.children.forEach(function(child, index) {
						assert.deepEqual(child.layers, node.layers, name + " child[" + index + "] layers test");
					});
				});

				assert.ok(multipleShapesModel.children[0].userData.treeNode, "box userData.treeNode test");
				var veids = multipleShapesModel.children[0].userData.veids;
				assert.ok(veids && veids["SAP/VE_COMPONENT"] && veids["SAP/VE_COMPONENT"].ID === "69a82c67-cfa4-4fa6-ab8f-e21111b96684_14", "box veid test");

				var viewGroups = content.getViewGroups();
				assert.equal(viewGroups.length, 1, "scene viewGroups test");
				assert.equal(viewGroups[0].getName(), "Procedure 1", "viewGroup name test");
				assert.ok(viewGroups[0].veids &&
					viewGroups[0].veids["SAP/VE_VIEWPORT"] &&
					viewGroups[0].veids["SAP/VE_VIEWPORT"].ID === "49", "viewGroup veid test");
				assert.equal(viewGroups[0]._views.length, 7, "modelViews test");
			} else {
				var failureReason = event.getParameter("failureReason");
				assert.ok(false, "Unable to load VDS4 file: " + (Array.isArray(failureReason) ? failureReason[0].errorMessage : "uknown error"));
			}
			done();
		});

		contentConnector.addContentResource(new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/annotations.vds",
			sourceType: "vds4",
			name: "VDS4-annotations"
		}));

		contentConnector.addContentResource(new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/multiple_shapes.vds",
			sourceType: "vds4",
			name: "VDS4-multiple_shapes"
		}));
	});

	QUnit.done(function() {
		jQuery("#qunit-fixture").hide();
	});
});
