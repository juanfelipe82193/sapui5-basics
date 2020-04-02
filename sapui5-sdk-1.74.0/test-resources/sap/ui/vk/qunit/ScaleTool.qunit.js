/* global QUnit*/

sap.ui.define([
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/tools/ScaleTool",
	"sap/ui/vk/tools/ToolNodeSet",
	"sap/ui/vk/threejs/thirdparty/three",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	Viewport,
	ViewStateManager,
	ScaleTool,
	ToolNodeSet,
	three,
	loader
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager;
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("ScaleTool", "test-resources/sap/ui/vk/qunit/media/model.three.json", "threejs.test.json", function(assert){
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Test ScaleTool", function(assert) {
		var done = assert.async();
		var tool = new ScaleTool();
		assert.ok(tool !== null, "Tool created");
		var gizmo = tool.getAggregation("gizmo");
		// var camera = viewport.getCamera().getCameraRef();

		tool.setActive(true, viewport);
		tool.setEnableSnapping(true);
		assert.ok(tool.getEnableSnapping() === true, "Snapping enabled");

		var detector = tool.getDetector();
		assert.ok(detector !== null, "Detector obtained");

		detector.addObjFromScene(viewport);
		var scene = viewport.getScene().getSceneRef();
		var selected = scene.getChildByName("Torus1");
		var target = scene.getChildByName("Box");
		var target2 = scene.getChildByName("Cylinder");
		viewStateManager.setSelectionStates(selected, [], false, true);
		detector.setSource(viewStateManager);

		gizmo.show(viewport, tool);
		gizmo._updateGizmoObjectTransformation(gizmo._gizmo, 0);
		tool.scale(1.01, 1.01, 1.01);
		var option = {
			viewport: viewport,
			gizmo: gizmo,
			detectType: "scale"
		};
		detector.detect(option);
		detector.detect();

		setTimeout(function() {
			assert.ok(detector.detectCollisionGJK(selected, target) === true, "Snapping Scale to target object");
			tool.scale(1.01, 1.01, 1.01);
			detector.detect();
			setTimeout(function() {
				assert.ok(detector.detectCollisionGJK(selected, target2) === true, "Snapping Scale to target2 object");
				done();
			}, 5000);
		}, 3000);

	});

	QUnit.test("Test node set selection", function(assert) {
		var tool = new ScaleTool();
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

		assert.equal(torus.scale.x, 1, "Original torus scale is 1");
		assert.equal(box.scale.x, 1, "Original box scale is 1");

		tool.scale(5, 0, 0);

		assert.equal(torus.scale.x, 5, "Higlighted node has scaled");
		assert.equal(box.scale.x, 1, "Outlined node has not scaled");

		tool.setNodeSet(ToolNodeSet.Outline);
		tool.scale(5, 0, 0);

		assert.equal(torus.scale.x, 5, "Higlighted node has not scaled");
		assert.equal(box.scale.x, 5, "Outlined node has scaled");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});