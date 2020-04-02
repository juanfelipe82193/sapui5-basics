/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/PerspectiveCamera",
	"sap/ui/vk/threejs/OrthographicCamera",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithViewer",
	"sap/ui/vk/threejs/thirdparty/three"
], function(
	jQuery,
	PerspectiveCamera,
	OrthographicCamera,
	loader,
	three
) {
	"use strict";

	QUnit.moduleWithViewer("threejs.Camera", "test-resources/sap/ui/vk/qunit/media/boxes.three.json", "threejs.test.json", function() {
	});

	QUnit.test("MAIN TEST", function(assert) {
		var done = assert.async();
		var viewport = this.viewer.getViewport();
		setTimeout(function() {
			viewport.attachNodeZoomed(function(event) {
				var node = event.getParameter("zoomed");
				var isZoomIn = event.getParameter("isZoomIn");

				assert.ok(isZoomIn, "Zoomin event is fired");

				var bbox = new THREE.Box3().setFromObject(node);
				var cameraTarget = bbox.getCenter();

				var camera = viewport.getCamera().getCameraRef();
				var cameraOrigin = camera.position;

				var dir = new THREE.Vector3().copy(cameraTarget).sub(cameraOrigin).normalize();
				var cameraDir = camera.getWorldDirection().normalize();

				assert.ok(Math.abs(dir.x - cameraDir.x) < 0.00001 && Math.abs(dir.y - cameraDir.y) < 0.00001 && Math.abs(dir.z - cameraDir.z) < 0.00001, "Camera zooming is checked");
				done();
			});

			var size = viewport.getImplementation().getRenderer().getSize();
			viewport.tap(size.width / 2, size.height / 2, true);
		}, 500); // time to resize the viewport
	});

	var near = 42;
	var far = 99;

	var position = new THREE.Vector3(1, 2, 3);
	var target = new THREE.Vector3(5, 6, 7);
	var look = target.clone().sub(position).normalize();
	var up = new THREE.Vector3(1, 0, 0);

	function floatArrayEqualWithEpsilon(arr1, arr2, epsilon) {
		if (arr1.length != arr2.length) {
			return false;
		}
		for (var i = 0; i < arr1.length; i++) {

			if (Math.abs(arr1[ i ] - arr2[ i ]) > epsilon) {
				return false;
			}
		}
		return true;
	}

	function initBasicCameraPropertiesForNativeCamera(nativeCamera) {
		nativeCamera.position.copy(position);
		nativeCamera.up.copy(up);
		nativeCamera.lookAt(target);
		nativeCamera.near = near;
		nativeCamera.far = far;
	}

	function testBasicCameraProperties(assert, camera) {
		assert.deepEqual(position.toArray(), camera.getPosition(), "position");
		assert.deepEqual(up.toArray(), camera.getUpDirection(), "up direction");
		assert.ok(floatArrayEqualWithEpsilon(look.toArray(), camera.getTargetDirection(), 0.0005), "target direction");

		assert.deepEqual(near, camera.getNearClipPlane(), "near");
		assert.deepEqual(far, camera.getFarClipPlane(), "far");
	}

	QUnit.test("Perspective Camera", function(assert) {
		var fov = 45;
		var aspect = 1;

		// creating directly for testing purpose only. For the consistency of DVL, this should be created from ContentManager.
		var camera = new PerspectiveCamera();

		var nativeCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		initBasicCameraPropertiesForNativeCamera(nativeCamera);
		camera.setCameraRef(nativeCamera);

		testBasicCameraProperties(assert, camera);

		// perspective camera prop
		assert.deepEqual(fov, camera.getFov(), "fov");

	});

	QUnit.test("Orthographic Camera", function(assert) {
		var left = 1;
		var right = 2;
		var top = 3;
		var bottom = 4;
		var zoom = 5;

		// creating directly for testing purpose only. For the consistency of DVL, this should be created from ContentManager.
		var camera = new OrthographicCamera();

		var nativeCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
		initBasicCameraPropertiesForNativeCamera(nativeCamera);
		nativeCamera.zoom = zoom;
		camera.setCameraRef(nativeCamera);

		testBasicCameraProperties(assert, camera);

		// orthographic camera prop
		assert.deepEqual(zoom, camera.getZoomFactor(), "zoom factor");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});