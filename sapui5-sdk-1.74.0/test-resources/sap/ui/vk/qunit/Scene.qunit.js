/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/ContentResource"
], function(
	jQuery,
	Viewer,
	ContentResource
) {
	"use strict";

	var contentResource = new ContentResource({
		source: "test-resources/sap/ui/vk/qunit/media/nodes_boxes.vds",
		sourceType: "vds",
		sourceId: "abc"
	});

	var viewer = new Viewer({
		width: "100%",
		height: "400px",
		runtimeSettings: { totalMemory: 16777216 }
	});
	viewer.placeAt("content");

	QUnit.test("Loading scene", function(assertMain) {
		var done = assertMain.async();

		var testGetId = function(id) {
			QUnit.test("getId", function(assert) {
				assert.ok(id, "The retrieved ID exists");
				assert.propEqual(typeof id, "string", "The retrieved ID is a string");
			});
		};

		var testGetDefaultNodeHierarchy = function(nodeHierarchy) {
			QUnit.test("getDefaultNodeHierarchy", function(assert) {
				assert.ok(nodeHierarchy, "A NodeHierarchy object has been created");
				assert.ok(nodeHierarchy._dvl, "The _dvl property has been created");
				assert.ok(nodeHierarchy._dvlSceneRef, "The _dvlSceneRef property has been created");
				assert.propEqual(typeof nodeHierarchy._dvlSceneRef, "string", "The _dvlSceneRef property is a string");
				assert.ok(nodeHierarchy._graphicsCore, "The _graphicsCore property has been created");
			});
		};

		var testGetGraphicsCore = function(graphicsCore) {
			QUnit.test("getGraphicsCore", function(assert) {
				assert.ok(graphicsCore, "The GraphicsCore object has been created");
				assert.ok(graphicsCore._canvas, "The _canvas property exists");
				assert.propEqual(typeof graphicsCore._canvas, "object", "The _canvas property is an object");
				assert.ok(graphicsCore._dvl, "The _dvl property exists");
				assert.propEqual(typeof graphicsCore._dvl, "object", "The _dvl property is an object");
				assert.ok(graphicsCore._dvlClientId, "The _dvlClientId property exists");
				assert.propEqual(typeof graphicsCore._dvlClientId, "string", "The _dvlClientId property is a string");
				assert.ok(graphicsCore._webGLContext, "The _webGLContext property exists");
				assert.propEqual(typeof graphicsCore._webGLContext, "object", "The _webGLContext property is an object");
			});
		};

		viewer.addContentResource(contentResource);

		// VDS file load error handler
		viewer.attachSceneLoadingFailed(function(event) {
			assertMain.ok(false, "The scene has been loaded successfully.");
			done();
		});

		// VDS file load successfuly handler
		viewer.attachSceneLoadingSucceeded(function(event) {
			assertMain.ok(true, "The scene has been loaded successfully.");
			var scene = viewer.getScene();
			var graphicsCore = scene.getGraphicsCore();
			var id = scene.getId();
			var nodeHierarchy = scene.getDefaultNodeHierarchy();

			// Test getGraphicsCore
			testGetGraphicsCore(graphicsCore);

			// Test getId
			testGetId(id);

			// Test getDefaultNodeHierarchy
			testGetDefaultNodeHierarchy(nodeHierarchy);
			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
