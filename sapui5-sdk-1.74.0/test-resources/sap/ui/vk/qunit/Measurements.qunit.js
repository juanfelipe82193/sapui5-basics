/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/Viewer"
], function(
	jQuery,
	ContentResource,
	Viewer
) {
	"use strict";

	var contentResource = new ContentResource({
		source: "test-resources/sap/ui/vk/qunit/media/Measurement.vds",
		sourceType: "vds",
		sourceId: "abc"
	});

	var viewer = new Viewer({
		width: "100%",
		height: "400px",
		runtimeSettings: { totalMemory: 16777216 }
	});
	viewer.placeAt("content");

	/*
		*
		* Unit tests
		*
		*/

	QUnit.test("Measurements", function(assertMain) {
		var done = assertMain.async();

		viewer.addContentResource(contentResource);

		// VDS file load error handler
		viewer.attachSceneLoadingFailed(function(event) {
			assertMain.ok(false, "The scene has been loaded successfully.");
			done();
		});

		// VDS file load successfuly handler
		viewer.attachSceneLoadingSucceeded(function(event) {
			assertMain.ok(true, "The scene has been loaded successfully.");

			var nh = this.getScene().getDefaultNodeHierarchy();
			var nodes = [];
			var rootNodes = nh.getChildren();

			assertMain.ok(rootNodes.length === 2, "Loaded 2 top nodes");
			var dimNode = nh.createNodeProxy(rootNodes[1]);
			assertMain.ok(dimNode.getName() === "Dimensions", "Loaded measurement node");

			nh.enumerateChildren(rootNodes[1], function(child){
				nodes.push(child.getNodeRef());
			});
			assertMain.ok(nodes.length === 3, "Found 3 measurements");

			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
