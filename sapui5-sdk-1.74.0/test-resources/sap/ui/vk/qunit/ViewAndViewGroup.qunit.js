/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/View",
	"sap/ui/vk/AnimationPlayback",
	"sap/ui/vk/threejs/SceneBuilder",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	jQuery,
	Viewport,
	ViewStateManager,
	View,
	AnimationPlayback,
	SceneBuilder,
	loader
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport(
	{
		viewStateManager: viewStateManager
	});
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("View", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);
	});

	QUnit.test("view and view group", function(assert) {

		var done = assert.async();
		var scene = viewport.getScene();

		var sceneBuilder = new SceneBuilder();
		var sceneId = "166";
		var rootNodeId = "1";
		sceneBuilder.setRootNode(scene.getSceneRef(), rootNodeId, sceneId, scene);

		var getMeshNodes = function(parent, nodes) {

			if (parent && parent.children && parent.children.length > 0) {
				var oi;
				for (oi = 0; oi < parent.children.length; oi++) {
					var node = parent.children[oi];
					if (node instanceof THREE.Mesh) {
						nodes.push(node);
					} else {
						getMeshNodes(node, nodes);
					}
				}
			}
		};

		var meshNodes = [];
		getMeshNodes(scene.getSceneRef(), meshNodes);

		var meshNodesInfo = [];
		for (var mi = 0; mi < meshNodes.length; mi++) {
			var info = {};
			info.target = meshNodes[mi];
			info.meshId = "Mesh" + mi.toString();
			info.transform = meshNodes[mi].matrix.elements;
			meshNodesInfo.push(info);
		}

		var getAssemblyNodes = function(parent, nodes) {

			if (parent && parent.children && parent.children.length > 0) {
				var oi;
				for (oi = 0; oi < parent.children.length; oi++) {
					var node = parent.children[oi];
					if (!(node instanceof THREE.Mesh)) {
						nodes.push(node);
					}
					getAssemblyNodes(node, nodes);
				}
			}
		};

		var assemblyNodes = [];
		getAssemblyNodes(scene.getSceneRef(), assemblyNodes);

		var assemblyNodesInfo = [];
		for (var ai = 0; ai < assemblyNodes.length; ai++) {
			var ainfo = {};
			ainfo.target = assemblyNodes[ai];
			ainfo.transform = assemblyNodes[ai].matrix.elements;
			assemblyNodesInfo.push(ainfo);
		}

		var overlap = 2;
		for (var omi = 0; omi < overlap; omi++) {
			var oinfo = {};
			oinfo.target = meshNodes[omi];
			oinfo.meshId = "OMesh" + omi.toString();
			oinfo.transform = meshNodes[omi].matrix.elements;
			assemblyNodesInfo.push(oinfo);
		}

		var view1 = scene.createView({ viewId: "1",
											name: "view1",
											description: "view1 description" });
		var cameraInfo1 = {
							aspect: 1,
							far: 200000,
							fov: 0.5236,
							id: "10802",
							near: 1,
							origin: [ -464.0531, -873.888, -178.129 ],
							ortho: false,
							target: [ -527.1015, -173.308, -784.8607 ],
							up: [ -0.0981, 0.9836, -0.1514 ],
							zoom: 1
						};
		var camera1 = sceneBuilder.createCamera(cameraInfo1, sceneId);
		view1.setCamera(camera1);
		view1.setNodeInfos(assemblyNodesInfo);

		view1.addHighlightedNodes("H1", meshNodes[0]);
		assert.deepEqual(view1.getHighlightIdNodesMap().get("H1"), [ meshNodes[0] ], "highlighted node1 is inserted into view");
		assert.ok(view1.hasHighlight(), "Check high;ight");

		assert.equal(view1.getViewId(), "1", "view 1 Id");
		assert.equal(view1.getName(), "view1", "view 1 Name");
		assert.equal(view1.getDescription(), "view1 description", "view 1 description");
		assert.deepEqual(view1.getCamera(), camera1, "view 1 camera");
		assert.deepEqual(view1.getNodeInfos(), assemblyNodesInfo, "view 1 node infos");

		view1.updateNodeInfos(meshNodesInfo);
		assert.equal(view1.getNodeInfos().length, meshNodes.length + assemblyNodes.length, "view1 update node info");

		var playback1 = new AnimationPlayback("p1");
		var playback2 = new AnimationPlayback("p2");
		var playback3 = new AnimationPlayback("p3");
		var playback4 = new AnimationPlayback("p4");

		view1.addPlayback(playback1);
		view1.addPlayback(playback3);
		view1.insertPlayback(playback2, 1);
		view1.addPlayback(playback4);

		assert.ok(view1.hasAnimation(), "view 1 has animation");
		assert.equal(view1.getPlaybacks().length, 4, "view 1 get playbacks");
		assert.deepEqual(view1.getPlayback(1), playback2, "view 1 get playback");
		assert.equal(view1.indexOfPlayback(playback1), 0, "view 1 index of playback");

		view1.removePlayback(0);
		assert.deepEqual(view1.getPlayback(0), playback2, "view 1 remove playback by index");
		view1.removePlayback("p2");
		assert.deepEqual(view1.getPlayback(0), playback3, "view 1 remove playback by id");
		view1.removePlayback(playback3);
		assert.deepEqual(view1.getPlayback(0), playback4, "view 1 remove playback");

		view1.removePlaybacks();
		assert.equal(view1.getPlaybacks().length, 0, "view 1 remove playbacks");

		var view2 = new View();
		view2.setViewId("2");
		view2.setName("view2");
		view2.setDescription("view2 description");
		view2.setNodeInfos(meshNodesInfo);

		var cameraInfo2 = {
							aspect: 1,
							far: 200000,
							fov: 0.5236,
							id: "10803",
							near: 1,
							origin: [ -464.0531, -873.888, -178.129 ],
							ortho: true,
							target: [ -527.1015, -173.308, -784.8607 ],
							up: [ -0.0981, 0.9836, -0.1514 ],
							zoom: 1
						};

		var camera2 = sceneBuilder.createCamera(cameraInfo2, sceneId);
		view2.setCamera(camera2);
		assert.equal(view2.getViewId(), "2", "view 2 Id");
		assert.equal(view2.getName(), "view2", "view 2 Name");
		assert.equal(view2.getDescription(), "view2 description", "view 2 description");
		assert.deepEqual(view2.getCamera(), camera2, "view 2 camera");
		assert.deepEqual(view2.getNodeInfos(), meshNodesInfo, "view 2 node infos");

		var viewGroup = scene.createViewGroup({
			viewGroupId: "vg1",
			name: "viewGroup1",
			description: "view group description"
		});
		assert.equal(viewGroup.getViewGroupId(), "vg1", "view group Id");
		assert.equal(viewGroup.getName(), "viewGroup1", "view group name");
		assert.equal(viewGroup.getDescription(), "view group description", "view group description");

		viewGroup.addView(view2);
		viewGroup.insertView(view1, 0);
		assert.equal(viewGroup.getViews().length, 2, "view group get views");
		assert.deepEqual(viewGroup.getViews()[0], view1, "view group get views");
		assert.equal(viewGroup.indexOfView(view2), 1, "view group index of view");

		viewGroup.removeView(view2);
		assert.equal(viewGroup.indexOfView(view2), -1, "view group remove view");

		viewGroup.removeViews();
		assert.equal(viewGroup.getViews().length, 0, "view group remove views");

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
