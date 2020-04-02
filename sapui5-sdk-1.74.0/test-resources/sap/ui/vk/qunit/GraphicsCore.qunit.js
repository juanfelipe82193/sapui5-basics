/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/dvl/Viewport",
	"sap/ui/vk/dvl/GraphicsCore",
	"sap/ui/vk/dvl/GraphicsCoreApi",
	"sap/ui/vk/dvl/Scene"
], function(
	jQuery,
	ContentResource,
	Viewport,
	GraphicsCore,
	GraphicsCoreApi,
	DvlScene
) {
	"use strict";

	/*
		* Unit tests for the following methods:
		* ---- buildSceneTree
		* ---- destroyScene
		* ---- loadContentResourcesAsync
		* ---- getApi
		* ---- showDebugInfo
		* ---- _getCanvas
		* ---- _getViewportCount
		* ---- _registerViewport
		* ---- _deregisterViewport
	*/

	var testBuildSceneTree = function(scene) {
		QUnit.test("Test buildSceneTree method", function(assert) {
			assert.ok(scene, "The created scene is a truthy object");
			assert.ok(scene instanceof DvlScene, "buildSceneTree returns an instance of sap.ui.vk.dvl.Scene");
		});
	};

	var testDestroyScene = function(graphicsCore, oldScene, destroyedScene) {
		QUnit.test("Test destroyScene method", function(assert) {
			assert.notDeepEqual(oldScene, destroyedScene, "The scene is not equal to itself after being destroyed");
			assert.propEqual(graphicsCore._vkSceneData.length, 0, "The graphicsCore does not have any vkSceneData left");
		});
	};

	var testLoadContentResourcesAsync = function(error) {
		QUnit.test("Test loadContentResourcesAsync method", function(assert) {
			assert.equal(error, undefined, "the 'error' variable is undefined if loadContentResourcesAsync is successful");
		});
	};

	var testGetApi = function(graphicsCore) {
		var api = graphicsCore.getApi(GraphicsCoreApi.LegacyDvl);
		QUnit.test("Test getApi method", function(assert) {
			assert.ok(api.Client, "The API has the Client property");
			assert.ok(api.Core, "The API has the Core property");
			assert.ok(api.CreateCoreInstance, "The API has the CreateCoreInstance property");
			assert.ok(api.Material, "The API has the Material property");
			assert.ok(api.Renderer, "The API has the Renderer property");
			assert.ok(api.Scene, "The API has the Scene property");
			assert.ok(api.Settings, "The API has the Settings property");
		});
	};

	var testShowDebugInfo = function(graphicsCore, viewport) {
		QUnit.test("Test showDebugInfo method", function(assert) {
			// Unit Test for showDebugInfo
			assert.notOk(viewport.getShowDebugInfo(), "By default, the viewport doesn't show debug info.");
			graphicsCore.showDebugInfo(true);
			assert.ok(viewport.getShowDebugInfo(), "showDebugInfo(true) method from Graphics Core makes the viewport show the debug info.");
			graphicsCore.showDebugInfo(false);
			assert.notOk(viewport.getShowDebugInfo(false), "showDebugInfo(false) method from Graphics Core makes the viewport hide the debug info.");
		});
	};

	var testGraphicsCoreConstructor = function(graphicsCore) {
		QUnit.test("Test the graphics core constructor", function(assert) {
			assert.equal(graphicsCore._getCanvas().nodeName.toLowerCase(), "canvas", "GraphicsCore should create an HTML <canvas> element");
		});
	};

	var testGetViewportCount = function(graphicsCore, viewport) {
		QUnit.test("Test the _getViewportCount method", function(assert) {
			assert.equal(graphicsCore._getViewportCount(), 1, "GraphicsCore has one viewport.");
			graphicsCore._deregisterViewport(viewport);
			assert.equal(graphicsCore._getViewportCount(), 0, "After deregistering the only viewport, GraphicsCore has no viewport.");
			graphicsCore._registerViewport(viewport);
			assert.equal(graphicsCore._getViewportCount(), 1, "GraphicsCore has one viewport after registering our current viewport.");
		});
	};

	var contentResource = new ContentResource({
		source: "test-resources/sap/ui/vk/qunit/media/box.vds",
		sourceType: "vds",
		sourceId: "abc"
	});

	var viewport = new Viewport();
	viewport.placeAt("content");

	QUnit.test("test buildSceneTree", function(assert) {

		var done = assert.async();

		GraphicsCore.create({ totalMemory: 16777216 * 2 }, {
			antialias: true,
			alpha: true,
			premultipliedAlpha: false,
			preserveDrawingBuffer: true
		}).then(function(graphicsCore) {

			// Unit Test for the GraphicsCore constructor
			testGraphicsCoreConstructor(graphicsCore);

			viewport.setGraphicsCore(graphicsCore);

			var scene, oldScene;

			graphicsCore.loadContentResourcesAsync([ contentResource ], function(sourcesFailedToLoad) {

				// Unit test for loadContentResourcesAsync method
				testLoadContentResourcesAsync(sourcesFailedToLoad);

				if (sourcesFailedToLoad) {
					jQuery.sap.log.error("Some of content resources cannot be loaded.");
				} else {
					scene = graphicsCore.buildSceneTree([ contentResource ]);

					assert.ok(scene != null, "Scene created");
					testBuildSceneTree(scene);
					if (scene) {
						viewport.setScene(scene);

						oldScene = jQuery.extend(true, {}, scene);
						graphicsCore.destroyScene(scene);

						// Unit Test for destroyScene
						testDestroyScene(graphicsCore, oldScene, scene);

						// Unit Test for getApi
						testGetApi(graphicsCore);

						// Unit Test for showDebugInfo
						testShowDebugInfo(graphicsCore, viewport);

						// Unit Test for _getViewportCount
						testGetViewportCount(graphicsCore, viewport);
						done();
					} else {
						jQuery.sap.log.error("Failed to build the scene tree.");
					}
				}
			});
		});
	});

	QUnit.test("test buildSceneTreeAsync", function(assert) {

		var done = assert.async();

		GraphicsCore.create({ totalMemory: 16777216 * 2 }, {
			antialias: true,
			alpha: true,
			premultipliedAlpha: false,
			preserveDrawingBuffer: true
		}).then(function(graphicsCore) {

			var contentResource = new ContentResource({
				source: "test-resources/sap/ui/vk/qunit/media/boxTestModel.vds",
				sourceType: "vds",
				sourceId: "s1",
				contentResources: [
					new ContentResource({
						source: "test-resources/sap/ui/vk/qunit/media/coneTestModel.vds",
						sourceType: "vds",
						sourceId: "s2",
						localMatrix: [ -1, 0, 0, 0, -0.866027, -0.5, 0, -0.5, 0.866026, 12.5, -22.5, 38.9712 ],
						contentResources: [
							new ContentResource({
								source: "test-resources/sap/ui/vk/qunit/media/cylinderTestModel.vds",
								sourceType: "vds",
								sourceId: "s3",
								localMatrix: [ -1, 0, 0, 0, 0.866027, -0.5, 0, -0.5, -0.866026, 12.5, -22.5, -38.9712 ]
							})
						]
					})
				]
			});

			graphicsCore.loadContentResourcesAsync([ contentResource ], function(sourcesFailedToLoad) {
				if (sourcesFailedToLoad) {
					throw new Error("Source failed to load");
				} else {
					// Builds a scene tree from the hierarchy of content resources. The content resources must be already loaded.
					// buildSceneTreeAsync returns a promise.
					var promise = graphicsCore.buildSceneTreeAsync([ contentResource ]);
					assert.ok(promise instanceof Promise, "buildSceneTreeAsync returns a promise.");

					promise.then(function(data) {
						assert.ok(data.scene instanceof DvlScene, "buildSceneTreeAsync promise resolves as an instance of sap.ui.vk.dvl.Scene");
						done();
					});
				}
			});
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
