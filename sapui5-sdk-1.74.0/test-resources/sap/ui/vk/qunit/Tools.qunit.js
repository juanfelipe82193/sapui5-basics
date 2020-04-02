/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/Viewport",
	"sap/ui/vk/tools/SceneOrientationTool",
	"sap/ui/vk/tools/TooltipTool",
	"sap/ui/vk/tools/MoveTool",
	"sap/ui/vk/tools/PredefinedView",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector"
], function(
	jQuery,
	Viewport,
	SceneOrientationTool,
	TooltipTool,
	MoveTool,
	PredefinedView,
	loader
) {
	"use strict";

	var sceneOrientationTool = new SceneOrientationTool();
	var tooltipTool = new TooltipTool();
	var moveTool = new MoveTool();
	var viewport = new Viewport({
		tools: [ sceneOrientationTool, tooltipTool, moveTool ]
	});
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("Tools", "test-resources/sap/ui/vk/qunit/media/boxes.three.json", "threejs.test.json", function(assert){
		viewport.setContentConnector(this.contentConnector);
	});

	QUnit.test("Initialization", function(assert) {
		assert.equal(viewport.getTools().length, 3, "Tools loaded in Viewport");
		assert.equal(viewport.getImplementation().getTools().length, 3, "Tools loaded in implementation Viewport");
	});

	QUnit.test("SceneOrientationTool", function(assert) {
		var newInstance = new SceneOrientationTool();
		assert.equal(newInstance, sceneOrientationTool, "Tool is singleton");

		var enabledDone = assert.async();
		sceneOrientationTool.attachEventOnce("enabled", function(evt){
			assert.ok(evt.getParameter("enabled"), "Tool enabled event param");
			assert.ok(sceneOrientationTool.getActive(), "Tool enabled property");
			enabledDone();
		});
		sceneOrientationTool.setActive(true, viewport);

		var compareNumbers = function(f1, f2) {
			return f1 - f2 < 0.00001;
		};

		var done = assert.async();
		var phase = 0;
		var time;
		viewport.attachEvent("viewFinished", function(evt){
			switch (phase){
				case 0:
					var dir1 = viewport.getCamera().getTargetDirection();
					assert.ok(compareNumbers(dir1[ 0 ], 0) && compareNumbers(dir1[ 1 ], 0) && compareNumbers(dir1[ 2 ], -1), "Front view immediate set");
					sceneOrientationTool.setView(PredefinedView.Left);
				break;
				case 1:
					var dir2 = viewport.getCamera().getTargetDirection();
					assert.ok(compareNumbers(dir2[ 0 ], 1) && compareNumbers(dir2[ 1 ], 0) && compareNumbers(dir2[ 2 ], 0), "Left view immediate set");
					time = Date.now();
					sceneOrientationTool.setView(PredefinedView.Front, 100);
				break;
				case 2:
					var dir3 = viewport.getCamera().getTargetDirection();
					assert.ok(Date.now() - time >= 100, "Minimum fly-to time");
					assert.ok(compareNumbers(dir3[ 0 ], 0) && compareNumbers(dir3[ 1 ], 0) && compareNumbers(dir3[ 2 ], -1), "Front view delayed set");
					time = Date.now();
					sceneOrientationTool.setView(PredefinedView.Left, 100);
					break;
				default:
					var dir4 = viewport.getCamera().getTargetDirection();
					assert.ok(Date.now() - time >= 100, "Minimum fly-to time");
					assert.ok(compareNumbers(dir4[ 0 ], 1) && compareNumbers(dir4[ 1 ], 0) && compareNumbers(dir4[ 2 ], 0), "Left view delayed set");
					done();
				break;
			}
			phase++;
		});
		sceneOrientationTool.setView(PredefinedView.Front);
	});

	QUnit.test("TooltipTool", function(assert) {
		assert.test.module.hooks.afterEach = null;

		var clientRect = viewport.getDomRef().getBoundingClientRect();
		var x = clientRect.x + clientRect.width / 2;
		var y = clientRect.y + clientRect.height / 2;

		var enabledDone = assert.async();
		tooltipTool.attachEventOnce("enabled", function(evt){
			assert.ok(evt.getParameter("enabled"), "Tool enabled event param");
			assert.ok(tooltipTool.getActive(), "Tool enabled property");
			enabledDone();
		});

		tooltipTool.setActive(true, viewport);

		var done = assert.async();
		tooltipTool.attachEventOnce("hover", function(evt) {
			var name = evt.getParameter("nodeRef").name;
			assert.equal(name, "Box 2", "Object detection");
			tooltipTool.setTitle(name);
			assert.equal(tooltipTool.getGizmo().getDomRef().innerText, name, "Gizmo name correct");

			tooltipTool.setActive(false);
			done();
		});

		viewport._implementation.attachEventOnce("frameRenderingFinished", function(){
			viewport.getImplementation()._loco._move({
				points: [],
				buttons: 0,
				timeStamp: 1100,
				n: 0,
				d: 0,
				x: x,
				y: y
			});
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
