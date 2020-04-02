/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/dvl/BaseNodeProxy",
	"sap/ui/vk/ContentResource"
],
function(
	jQuery,
	Viewer,
	BaseNodeProxy,
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

	QUnit.test("loading scene test", function(assertMain) {

		var done = assertMain.async();

		var testBaseNodeProxyConstructor = function(baseNodeProxy) {
			QUnit.test("Constructor", function(assert) {
				assert.ok(baseNodeProxy, "BaseNodeProxy object is created");
				assert.ok(baseNodeProxy._dvl, "._dvl property has a truthy value");
				assert.ok(baseNodeProxy._dvlNodeRef, "._dvlNodeRef property has a truthy value");
				assert.ok(baseNodeProxy._dvlSceneRef, "._dvlSceneRef property has a truthy value");
			});
		};

		var testGetNodeRef = function(nodeRef) {
			QUnit.test("getNoderef", function(assert) {
				assert.ok(nodeRef, "The node reference is retrieved and it exists");
				assert.ok(typeof nodeRef === "string", "The node reference is a string");
			});
		};

		var testGetName = function(name) {
			QUnit.test("getName", function(assert) {
				assert.ok(name, "The node name is retrieved and it exists");
				assert.equal(name, "Box #5", "This particular node is named box #5");
			});
		};

		var testGetMetadata = function(nodeMetadata) {
			var expectedMetadata = {
				CADMetadata: {
					PART_NAME: "Bolt"
				}
			};
			QUnit.test("getMetadata", function(assert) {
				assert.ok(nodeMetadata, "The metadata is retrieved and it exists");
				assert.deepEqual(nodeMetadata, expectedMetadata, "The metadata of this particular node matches the expected metadata for the node.");
			});
		};

		var testGetChildren = function(nodeHasChildren) {
			QUnit.test("getHasChildren", function(assert) {
				assert.propEqual(nodeHasChildren, true, "This node has children");
			});
		};

		var testReset = function(baseNodeProxy) {
			var proxyClone = jQuery.extend(true, {}, baseNodeProxy);
			proxyClone.reset();
			QUnit.test("reset", function(assert) {
				assert.strictEqual(proxyClone._dvl, null, "Reset should set _dvl to null.");
				assert.strictEqual(proxyClone._dvlSceneRef, null, "Reset should set _dvlSceneRef to null.");
				assert.strictEqual(proxyClone._dvlNodeRef, null, "Reset should set _dvlNodeRef to null.");
			});
		};

		viewer.addContentResource(contentResource);

		// VDS file load error handler
		viewer.attachSceneLoadingFailed(function(event) {
			assertMain.ok(false, "Viewer loaded successfully");
			done();
		});

		// VDS file load successfuly handler
		viewer.attachSceneLoadingSucceeded(function(event) {
			assertMain.ok(true, "Viewer loaded successfully");

			var scene = viewer.getScene();
			var nodeHierarchy = scene.getDefaultNodeHierarchy();

			// It gets the IDs of the root nodes
			var rootNodeRef = nodeHierarchy.getChildren()[0];

			var baseNodeProxy = new BaseNodeProxy();
			baseNodeProxy.init(nodeHierarchy, rootNodeRef);

			// test if 'reset' method sets the _dvl related properties to null
			testReset(baseNodeProxy);

			// test if the constructor creates an object
			testBaseNodeProxyConstructor(baseNodeProxy);

			// test getNodeRef
			var nodeRef = baseNodeProxy.getNodeRef();
			testGetNodeRef(nodeRef);

			// test getName
			var nodeName = baseNodeProxy.getName();
			testGetName(nodeName);

			// test getMetadata
			var nodeMetadata = baseNodeProxy.getNodeMetadata();
			testGetMetadata(nodeMetadata);

			// test getHasChildren
			var nodeHasChildren = baseNodeProxy.getHasChildren();
			testGetChildren(nodeHasChildren);

			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
