/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/CameraProjectionType",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/VisibilityMode",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	CameraProjectionType,
	ViewStateManager,
	Viewport,
	VisibilityMode,
	loader
) {
	"use strict";

	var viewStateManager = new ViewStateManager();
	var viewport = new Viewport({ viewStateManager: viewStateManager });
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("Viewport", "test-resources/sap/ui/vk/qunit/media/nodes_boxes.json", "threejs.test.json", function(assert) {
		viewport.setContentConnector(this.contentConnector);
		viewStateManager.setContentConnector(this.contentConnector);

		// set node fake veid
		var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy();
		var allNodeRefs = nodeHierarchy.findNodesByName();
		allNodeRefs.forEach(function(node) {
			node.userData.treeNode = { sid: node.uuid };
		});
	});

	QUnit.test("Initialization", function(assert) {
		assert.ok(viewport, "The viewport is created.");
		assert.ok(viewport instanceof Viewport, "The viewport is sap.ui.vk.threejs.Viewport implementation.");
	});

	QUnit.test("Default values", function(assert) {
		// No query provided (shall return camera info only)
		var viewInfo = viewport.getViewInfo();
		assert.notEqual(viewInfo.camera, null, "No query - Camera retrieved");
		assert.equal(viewInfo.visibility, null, "No query - No visibility information");

		// Query with no camera required
		viewInfo = viewport.getViewInfo({ camera: false });
		assert.equal(viewInfo.camera, null, "Camera info shall not be retreived");

		// Simple visibility query without camera specified (shall still return camera info)
		viewInfo = viewport.getViewInfo({ visibility: true });
		assert.notEqual(viewInfo.camera, null, "No camera query - Camera still retreived");
		assert.notEqual(viewInfo.visibility, null, "Visibility required - Visibility information retreived");
		assert.equal(viewInfo.visibility.visible.length, 38, "Visibility required - Correct number of visible nodes");
		assert.equal(viewInfo.visibility.hidden.length, 0, "Visibility required - Correct number of hidden nodes");

		// Visibility query requiring differences but diff tracking is not set
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.notEqual(viewInfo.visibility, null, "Visibility diff required - Visibility object retreived");
		assert.equal(viewInfo.visibility.changes, null, "Visibility diff required - Tracking not set");

		// Visibility query requiring differences with diff tracking set
		var viewStateManager = viewport._viewStateManager;
		viewStateManager.setShouldTrackVisibilityChanges(true);
		viewInfo = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Differences }, camera: false });
		assert.notEqual(viewInfo.visibility, null, "Visibility diff required - Visibility object retreived");
		assert.notEqual(viewInfo.visibility.changes, null, "Visibility diff required - Tracking set");
	});

	QUnit.test("setViewInfo getViewInfo", function(assert) {
		var nodeHierarchy = viewport.getScene().getDefaultNodeHierarchy(),
			viewStateManager = viewport._viewStateManager,
			allNodeRefs = nodeHierarchy.findNodesByName(),
			nodeRefToVEID = new Map(),
			veidToNodeRef = new Map(),
			nodes = [];
		allNodeRefs.forEach(function(node) {
			nodes.push(node.uuid);
			nodeRefToVEID.set(node, node.uuid);
			veidToNodeRef.set(node.uuid, node);
		});

		var cameraTests = [
			{ camera: { rotation: { yaw: -48, pitch: 32, roll: -35 }, position: { x: 10, y: 20, z: 30 }, projectionType: CameraProjectionType.Orthographic, zoomFactor: 1.123 } },
			{ camera: { rotation: { yaw: -137, pitch: -32, roll: 45 }, position: { x: 200, y: 300, z: 400 }, projectionType: CameraProjectionType.Perspective, fieldOfView: 45.67 } },
			{ camera: { rotation: { yaw: 134, pitch: 43, roll: -76 }, position: { x: 100, y: 50, z: 25 }, projectionType: CameraProjectionType.Orthographic, zoomFactor: 2.345 } },
			{ camera: { rotation: { yaw: 90, pitch: -5, roll: 10 }, position: { x: 350, y: 0, z: 0 }, projectionType: CameraProjectionType.Perspective, fieldOfView: 34.56 } }
		];

		function floatEqual(a, b, desc) {
			assert.deepEqual(a.toFixed(4), b.toFixed(4), desc);
		}

		cameraTests.forEach(function(test) {
			viewport.setViewInfo(test, 0);
			var camera = viewport.getViewInfo({ camera: true }).camera;
			floatEqual(camera.position.x, test.camera.position.x, "camera.position.x");
			floatEqual(camera.position.y, test.camera.position.y, "camera.position.y");
			floatEqual(camera.position.z, test.camera.position.z, "camera.position.z");
			floatEqual(camera.rotation.yaw, test.camera.rotation.yaw, "camera.yaw");
			floatEqual(camera.rotation.pitch, test.camera.rotation.pitch, "camera.pitch");
			floatEqual(camera.rotation.roll, test.camera.rotation.roll, "camera.roll");
			assert.deepEqual(camera.projectionType, test.camera.projectionType, "camera.projectionType");
			if (camera.projectionType === CameraProjectionType.Orthographic) {
				assert.deepEqual(camera.zoomFactor, test.camera.zoomFactor, "camera.zoomFactor");
			} else {
				assert.deepEqual(camera.fieldOfView, test.camera.fieldOfView, "camera.fieldOfView");
			}
		});

		var visibilityTests = [
			{ visibility: { visible: [ nodes[ 3 ], nodes[ 6 ] ], hidden: [ nodes[ 7 ], nodes[ 9 ] ], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [ nodes[ 7 ], nodes[ 3 ] ], hidden: [ nodes[ 9 ], nodes[ 6 ] ], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [ nodes[ 9 ], nodes[ 6 ] ], hidden: [ nodes[ 7 ], nodes[ 3 ] ], mode: VisibilityMode.Complete } },
			{ visibility: { visible: [ nodes[ 3 ], nodes[ 7 ], nodes[ 9 ] ], hidden: [ nodes[ 6 ] ], mode: VisibilityMode.Complete } }
		];

		visibilityTests.forEach(function(test) {
			viewport.setViewInfo(test, 0);
			var visibility = viewport.getViewInfo({ visibility: { mode: VisibilityMode.Complete } }).visibility;
			test.visibility.visible.forEach(function(veid) {
				var nodeRef = veidToNodeRef.get(veid);
				assert.deepEqual(viewStateManager.getVisibilityState(nodeRef), true, veid + " visible");
				assert.notDeepEqual(visibility.visible.indexOf(veid), -1, veid + " visible");
				assert.deepEqual(visibility.hidden.indexOf(veid), -1, veid + " not hidden");
			});
			test.visibility.hidden.forEach(function(veid) {
				var nodeRef = veidToNodeRef.get(veid);
				assert.deepEqual(viewStateManager.getVisibilityState(nodeRef), false, veid + " hidden");
				assert.deepEqual(visibility.visible.indexOf(veid), -1, veid + " not visible");
				assert.notDeepEqual(visibility.hidden.indexOf(veid), -1, veid + " hidden");
			});
		});
	});

	QUnit.test("Freeze camera", function(assert){
		// check default value
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// get initial camera position
		var initialCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen");

		// try to rotate
		viewport._viewportGestureHandler._cameraController.rotate(20, 20);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not rotated");

		// try to pan
		viewport._viewportGestureHandler._cameraController.pan(5, 10);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not panned");

		// try to zoom
		viewport._viewportGestureHandler._cameraController.zoom(1.4);
		assert.deepEqual(viewport.getViewInfo().camera, initialCamera, "Not zoomed");

		// unfreeze camera
		viewport.setFreezeCamera(false);
		assert.equal(viewport.getFreezeCamera(), false, "Not frozen");

		// zoom out scene
		viewport._viewportGestureHandler._cameraController.beginGesture(1, 1);
		viewport._viewportGestureHandler._cameraController.zoom(0.04);
		viewport._viewportGestureHandler._cameraController.endGesture();

		// get new camera position
		var newCamera = viewport.getViewInfo().camera;

		// freeze camera
		viewport.setFreezeCamera(true);
		assert.equal(viewport.getFreezeCamera(), true, "Frozen again");

		// try to double click
		var done = assert.async();
		viewport.tap(1, 1, true);
		setTimeout(function() {
			assert.deepEqual(viewport.getViewInfo().camera, newCamera, "Not changed");
			done();
		}, 1000);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
