/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/RotateTool",
	"sap/ui/vk/tools/RotatableAxis",
	"sap/ui/vk/tools/ToolNodeSet",
	"sap/ui/vk/threejs/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	Viewport,
	ViewStateManager,
	RotateTool,
	RotatableAxis,
	ToolNodeSet,
	three,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager;
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("RotateTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert){
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Test RotateTool", function(assert) {
		var done = assert.async();
		var tool = new RotateTool();
		assert.ok(tool !== null, "Tool created");

		tool.setActive(true, viewport);
		tool.setEnableSnapping(true);
		tool.setAxis(RotatableAxis.Z);
		assert.ok(tool.getEnableSnapping() === true, "Snapping enabled");

		var detector = tool.getDetector();
		assert.ok(detector !== null, "Detector obtained");

		detector.addObjFromScene(viewport);
		var objArray = detector.getObjArray();
		var selected = objArray.find(function(o) {return o.name === "Box";});
		var target = objArray.find(function(o) {return o.name === "Sphere";});
		viewStateManager.setSelectionStates(selected, [], false, true);
		detector.setSource(viewStateManager);
		var angle1 = 0.7;
		var angle2 = -0.9;
		tool.getGizmo().show(viewport, tool);
		tool.getGizmo().beginGesture();
		tool.getGizmo()._getSelectionCenter(tool.getGizmo()._gizmo.position);
		var option = {
			viewport: viewport,
			gizmo: tool.getGizmo(),
			handleIndex: 2,
			detectType: "rotate",
			angle1: angle1,
			angle2: angle2
		};
		detector.detect(option);
		detector.setMoved(true);
		detector.detect();
		setTimeout(function() {
			assert.ok(detector.detectCollisionGJK(selected, target) === true, "Snapping rotate to target object");
			done();
		}, 3000);
	});

	QUnit.test("Test node set selection", function(assert) {
		var tool = new RotateTool();
		assert.ok(tool !== null, "Tool created");
		tool.setActive(true, viewport);
		viewport.addTool(tool);

		var torus = viewStateManager.getNodeHierarchy().findNodesByName({ value: "Torus1" })[0];
		var box = viewStateManager.getNodeHierarchy().findNodesByName({ value: "Box" })[0];

		viewStateManager.setSelectionStates([ torus ], []);
		viewStateManager.setOutliningStates([ box ], []);

		assert.equal(viewStateManager.getSelectionState(torus), true, "Torus is selected");
		assert.equal(viewStateManager.getOutliningState(torus), false, "Torus is not outlined");

		assert.equal(viewStateManager.getSelectionState(box), false, "Box is not selected");
		assert.equal(viewStateManager.getOutliningState(box), true, "Box is outlined");

		var pos1 = torus.quaternion.x;
		var pos2 = box.quaternion.x;

		tool.rotate(1, 0, 0, 0);

		assert.notEqual(pos1, torus.quaternion.x, "Higlighted node has rotated");
		assert.equal(pos2, box.quaternion.x, "Outlined node has not rotated");

		pos1 = torus.quaternion.x;
		tool.setNodeSet(ToolNodeSet.Outline);
		tool.rotate(1, 0, 0, 0);

		assert.equal(pos1, torus.quaternion.x, "Higlighted node has not rotated");
		assert.notEqual(pos2, box.quaternion.x, "Outlined node has rotated");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});