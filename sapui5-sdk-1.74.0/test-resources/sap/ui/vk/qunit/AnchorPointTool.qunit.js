/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/vk/tools/AnchorPointTool",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	Viewport,
	ViewStateManager,
	three,
	AnchorPointTool,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager;
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("AnchorPointTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Test AnchorPointTool", function(assert) {
		var done = assert.async();
		var tool = new AnchorPointTool();
		assert.ok(tool !== null, "AnchorPointTool created");
		var gizmo = tool.getAggregation("gizmo");
		assert.ok(gizmo !== null, "AnchorPointToolGizmo created");

		viewport.addTool(tool);
		// tool.setActive(true, viewport);

		var scene = viewport.getScene().getSceneRef();
		var box = scene.getChildByName("Box");
		assert.ok(box !== null, "Box found");
		var cone = scene.getChildByName("Cone");
		assert.ok(cone !== null, "Cone found");
		var cylinder = scene.getChildByName("Cylinder");
		assert.ok(cylinder !== null, "Cylinder found");
		var sphere = scene.getChildByName("Sphere");
		assert.ok(sphere !== null, "Sphere found");

		var pos = gizmo._gizmo.position;
		function testGizmoPosition(x, y, z, title) {
			assert.deepEqual(pos.x, x, title + " x");
			assert.deepEqual(pos.y, y, title + " y");
			assert.deepEqual(pos.z, z, title + " z");
		}

		// tool.moveTo(new THREE.Vector3(1, 2, 3));
		// testGizmoPosition(1, 2, 3, "moveTo(position) test");

		tool.moveTo(box, true);
		testGizmoPosition(0, 10, 0, "moveTo(box, true) test");

		tool.moveTo(cone, true);
		testGizmoPosition(25, 10, 0, "moveTo(cone, true) test");

		tool.moveTo(cylinder, true);
		testGizmoPosition(-25, -10, 0, "moveTo(cylinder, true) test");

		tool.moveTo(sphere, true);
		testGizmoPosition(0, -10, 0, "moveTo(cylinder, true) test");

		tool.moveTo([ box, cone ], true);
		testGizmoPosition(12.5, 10, 0, "moveTo([ box, cone ], true) test");

		tool.moveTo([ box, cone, cylinder ], true);
		testGizmoPosition(0, 10 * (1 / 3), 0, "moveTo([ box, cone, cylinder ], true) test");

		tool.moveTo([ box, cone ], false);
		testGizmoPosition(7.5, 10, 0, "moveTo([ box, cone ], false) test");

		tool.moveTo([ box, cone, sphere ], false);
		testGizmoPosition(7.5, -0.5, 0, "moveTo([ box, cone, sphere ], false) test");

		var quat = gizmo._gizmo.quaternion;
		function testGizmoQauternion(q, title) {
			assert.ok(Math.abs(quat.x - q.x) < 1e-5, title + " x");
			assert.ok(Math.abs(quat.y - q.y) < 1e-5, title + " y");
			assert.ok(Math.abs(quat.z - q.z) < 1e-5, title + " z");
			assert.ok(Math.abs(quat.w - q.w) < 1e-5, title + " w");
		}

		// var testQuaternion = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 5);
		// tool.alignTo(testQuaternion);
		// testGizmoQauternion(testQuaternion, "alignTo(quaternion) test");

		var camera = viewport.getCamera().getCameraRef();
		camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 4);
		tool.alignToScreen();
		testGizmoQauternion(camera.quaternion, "alignToScreen() test 1");

		camera.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 3);
		viewport.fireCameraChanged();
		testGizmoQauternion(camera.quaternion, "alignToScreen() test 2");

		tool.alignTo(box);
		testGizmoQauternion(box.quaternion, "alignTo(box) test");

		cylinder.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 3);
		cylinder.updateMatrixWorld(true);
		tool.alignTo(cylinder);
		testGizmoQauternion(cylinder.quaternion, "alignTo(cylinder) test1 ")

		viewport.fireCameraChanged();
		testGizmoQauternion(cylinder.quaternion, "alignTo(cylinder) test 2")

		tool.alignToScreen();
		testGizmoQauternion(camera.quaternion, "alignToScreen() test 3");

		tool.alignToWorld();
		testGizmoQauternion(new THREE.Quaternion(), "alignToWorld() test 1");

		viewport.fireCameraChanged();
		testGizmoQauternion(new THREE.Quaternion(), "alignToWorld() test 2");

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});