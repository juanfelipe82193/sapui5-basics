/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/MoveTool",
	"sap/ui/vk/tools/GizmoPlacementMode",
	"sap/ui/vk/tools/ToolNodeSet",
	"sap/ui/vk/threejs/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	Viewport,
	ViewStateManager,
	MoveTool,
	GizmoPlacementMode,
	ToolNodeSet,
	three,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager;
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("MoveTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert){
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Test MoveTool", function(assert) {
		var done = assert.async();
		var tool = new MoveTool();
		assert.ok(tool !== null, "Tool created");

		tool.setActive(true, viewport);
		tool.setEnableSnapping(true);
		tool.setPlacementMode(GizmoPlacementMode.ObjectCenter);
		assert.ok(tool.getPlacementMode() === GizmoPlacementMode.ObjectCenter, "ObjectCenter Placement mode enabled");
		assert.ok(tool.getEnableSnapping() === true, "Snapping enabled");

		var detector = tool.getDetector();
		assert.ok(detector !== null, "Detector obtained");

		detector.addObjFromScene(viewport);
		var objArray = detector.getObjArray();
		var selected = objArray.find(function(o) {return o.name === "Sphere";});
		viewStateManager.setSelectionStates(selected, [], false, true);
		detector.setSource(viewStateManager);
		detector.setMoved(true);
		tool.getGizmo().show(viewport, tool);
		tool.getGizmo().beginGesture();
		tool.getGizmo()._getSelectionCenter(tool.getGizmo()._gizmo.position);
		tool.getGizmo()._move(new THREE.Vector3(10, 0, 0));
		detector.detect({ viewport: viewport, gizmo: tool.getGizmo(), detectType: "move" });
		var target = objArray.find(function(o) {return o.name === "Dodecahedron";});
		setTimeout(function() {
			assert.ok(detector.detectCollisionGJK(selected, target) === true, "Snapping move to target object");
			tool.setActive(false, viewport);
			done();
		}, 3000);
	});

	QUnit.test("Test node set selection", function(assert) {
		var tool = new MoveTool();
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

		var pos1 = torus.position.x;
		var pos2 = box.position.x;

		tool.move(-10, 0, 0);

		assert.equal(pos1, torus.position.x + 10, "Higlighted node has moved");
		assert.equal(pos2, box.position.x, "Outlined node has not moved");

		pos1 = torus.position.x;
		tool.setNodeSet(ToolNodeSet.Outline);
		tool.move(-10, 0, 0);

		assert.equal(pos1, torus.position.x, "Higlighted node has not moved");
		assert.equal(pos2, box.position.x + 10, "Outlined node has moved");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});