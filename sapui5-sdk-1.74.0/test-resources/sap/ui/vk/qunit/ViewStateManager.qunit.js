/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/dvl/GraphicsCore",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/NodeHierarchy"
], function(
	jQuery,
	GraphicsCore,
	ContentResource,
	NodeHierarchy
) {
	"use strict";

	var testGetNodeHierarchy = function(originalNodeHierarchy, retrievedNodeHierarchy) {
		QUnit.test("getNodeHierarchy", function(assert) {
			assert.ok(retrievedNodeHierarchy instanceof NodeHierarchy, "The retrieved node hierarchy is an instance of sap.ui.vk.NodeHierarchy");
			assert.deepEqual(originalNodeHierarchy, retrievedNodeHierarchy, "The original node hierarchy is equal to the retrieved node hierarchy.");
		});
	};

	var testSelection = function(initiallySelectedNodes, selectedNodesCollection, rootElementDefaultSelection, rootElementAfterSelection, rootNodeRef) {
		QUnit.test("enumerateSelection", function(assert) {
			assert.strictEqual(initiallySelectedNodes.length, 0, "Initially, there are no selected nodes.");
			assert.strictEqual(selectedNodesCollection.length, 1, "After selecting the root node (not recursively), there is one node selected.");
			assert.strictEqual(selectedNodesCollection[0], rootNodeRef, "The only selected node is the root node.");
		});

		QUnit.test("getSelectionState & setSelectionState", function(assert) {
			assert.strictEqual(rootElementDefaultSelection, false, "The root node is not selected initially.");
			assert.strictEqual(rootElementAfterSelection, true, "The root node has changed its state to 'selected' after selecting it.");
		});
	};

	var testVisibility = function(rootElementDefaultVisibility, rootElementAfterVisibility) {
		QUnit.test("getVisibilityState & setVisibilityState", function(assert) {
			assert.ok(rootElementDefaultVisibility, "The default visibility of the root node is 'visibile'.");
			assert.notOk(rootElementAfterVisibility, "The root node visibility is false after changing the visibility state.");
		});
	};

	var enumerationHandler = function(collection, element, index) {
		collection.push(element);
	};

	QUnit.test("MAIN TEST", function(assert) {
		var done = assert.async();

		GraphicsCore.create({ totalMemory: 16777216 }, {
			antialias: true,
			alpha: true,
			premultipliedAlpha: false
		}).then(function(graphicsCore) {

			var contentResource = new ContentResource({
				source: "test-resources/sap/ui/vk/qunit/media/nodes_boxes_with_steps.vds",
				sourceType: "vds",
				sourceId: "abc"
			});

			graphicsCore.loadContentResourcesAsync([ contentResource ], function(sourcesFailedToLoad) {
				if (sourcesFailedToLoad) {
					assert.ok(false, "The VDS file was loaded successfully.");
					done();
				} else {
					assert.ok(true, "The VDS file was loaded successfully.");
					var scene = graphicsCore.buildSceneTree([ contentResource ]);
					var nodeHierarchy = scene.getDefaultNodeHierarchy();
					var viewStateManager = graphicsCore.createViewStateManager(nodeHierarchy);

					testGetNodeHierarchy(nodeHierarchy, viewStateManager.getNodeHierarchy());

					var initiallySelectedNodes = [];
					viewStateManager.enumerateSelection(enumerationHandler.bind(undefined, initiallySelectedNodes));

					var rootElementId = viewStateManager.getNodeHierarchy().getChildren()[0];

					var rootElementDefaultSelection = viewStateManager.getSelectionState(rootElementId);

					viewStateManager.setSelectionState(rootElementId, true, false);

					var rootElementAfterSelection = viewStateManager.getSelectionState(rootElementId);

					var selectedNodesCollection = [];
					viewStateManager.enumerateSelection(enumerationHandler.bind(undefined, selectedNodesCollection));

					testSelection(initiallySelectedNodes, selectedNodesCollection, rootElementDefaultSelection, rootElementAfterSelection, rootElementId);

					var rootElementDefaultVisibility = viewStateManager.getVisibilityState(rootElementId);
					viewStateManager.setVisibilityState(rootElementId, false, false);

					var rootElementAfterVisibility = viewStateManager.getVisibilityState(rootElementId);

					testVisibility(rootElementDefaultVisibility, rootElementAfterVisibility);

					var n1 = nodeHierarchy.findNodesByName({ value: "Box #22" })[0],
						n2 = nodeHierarchy.findNodesByName({ value: "Box #23" })[0];

					QUnit.test("opacity - single node", function(assert) {
						assert.strictEqual(viewStateManager.getOpacity(n1), null, "Node has no opacity assigned.");

						viewStateManager.setOpacity(n1, 0.75);
						assert.strictEqual(viewStateManager.getOpacity(n1), 0.75, "Node has opacity 0.75.");

						viewStateManager.setOpacity(n1, null);
						assert.strictEqual(viewStateManager.getOpacity(n1), null, "Node has no opacity assigned.");
					});

					QUnit.test("opacity - multiple nodes", function(assert) {
						assert.deepEqual(viewStateManager.getOpacity([ n1, n2 ]), [ null, null ], "Nodes have no opacity assigned.");

						viewStateManager.setOpacity([ n1, n2 ], 0.25);
						assert.deepEqual(viewStateManager.getOpacity([ n1, n2 ]), [ 0.25, 0.25 ], "Nodes have opacity 0.25.");

						viewStateManager.setOpacity([ n1 ], 0.5);
						assert.deepEqual(viewStateManager.getOpacity([ n1, n2 ]), [ 0.5, 0.25 ], "Node have opacity 0.5 and 0.25.");

						viewStateManager.setOpacity([ n2 ], null);
						assert.deepEqual(viewStateManager.getOpacity([ n1, n2 ]), [ 0.5, null ], "Node have opacity 0.5 and none.");

						viewStateManager.setOpacity([ n1, n2 ], null);
						assert.deepEqual(viewStateManager.getOpacity([ n1, n2 ]), [ null, null ], "Node have no opacity.");
					});

					QUnit.test("tint color - single node - ABGR format", function(assert) {
						assert.strictEqual(viewStateManager.getTintColor(n1, true), null, "Node has no tint color assigned.");

						viewStateManager.setTintColor(n1, 0x1f345678);
						assert.strictEqual(viewStateManager.getTintColor(n1, true), 0x1f345678, "Node has tint color 0x1f345678.");
						assert.strictEqual(viewStateManager.getTintColor(n1), "rgba(120,86,52,0.12156862745098039)", "Node has tint color rgba(120,86,52,0.12156862745098039).");

						viewStateManager.setTintColor(n1, null);
						assert.strictEqual(viewStateManager.getTintColor(n1), null, "Node has no tint color assigned.");
					});

					QUnit.test("tint color - single node - CSS color format", function(assert) {
						assert.strictEqual(viewStateManager.getTintColor(n1), null, "Node has no tint color assigned.");

						viewStateManager.setTintColor(n1, "purple");
						assert.strictEqual(viewStateManager.getTintColor(n1), "rgba(128,0,128,1)", "Node has tint color rgba(128,0,128,1).");
						assert.strictEqual(viewStateManager.getTintColor(n1, true), 0xff800080, "Node has tint color 0xff800080.");

						viewStateManager.setTintColor(n1, null);
						assert.strictEqual(viewStateManager.getTintColor(n1), null, "Node has no tint color assigned.");
					});

					QUnit.test("tint color - multiple nodes - ABGR format", function(assert) {
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ], true), [ null, null ], "Nodes have no tint color assigned.");

						viewStateManager.setTintColor([ n1, n2 ], 0x1f345678);
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ], true), [ 0x1f345678, 0x1f345678 ], "Nodes have tint color 0x1f345678.");
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ]), [ "rgba(120,86,52,0.12156862745098039)", "rgba(120,86,52,0.12156862745098039)" ], "Nodes have tint color rgba(120,86,52,0.12156862745098039).");

						viewStateManager.setTintColor(n1, 0xff00ffff);
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ], true), [ 0xff00ffff, 0x1f345678 ], "Nodes have tint colors 0xff00ffff and 0x1f345678.");
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ]), [ "rgba(255,255,0,1)", "rgba(120,86,52,0.12156862745098039)" ], "Nodes have tint colors rgba(255,255,0,1) and rgba(120,86,52,0.12156862745098039).");

						viewStateManager.setTintColor(n2, null);
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ], true), [ 0xff00ffff, null ], "Nodes have tint colors 0xff00ffff and none.");
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ]), [ "rgba(255,255,0,1)", null ], "Nodes have tint colors rgba(255,255,0,1) and none.");

						viewStateManager.setTintColor([ n1, n2 ], null);
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ]), [ null, null ], "Nodes have no tint color assigned.");
					});

					QUnit.test("tint color - multiple nodes - CSS color format", function(assert) {
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ]), [ null, null ], "Nodes have no tint color assigned.");

						viewStateManager.setTintColor([ n1, n2 ], "purple");
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ]), [ "rgba(128,0,128,1)", "rgba(128,0,128,1)" ], "Nodes have tint color rgba(128,0,128,1).");
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ], true), [ 0xff800080, 0xff800080 ], "Nodes have tint color 0xff800080.");

						viewStateManager.setTintColor(n1, "brown");
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ]), [ "rgba(165,42,42,1)", "rgba(128,0,128,1)" ], "Nodes have tint colors rgba(165,42,42,1) and rgba(128,0,128,1).");
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ], true), [ 0xff2a2aa5, 0xff800080 ], "Nodes have tint colors 0xff2a2aa5 and 0xff800080.");

						viewStateManager.setTintColor(n2, null);
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ]), [ "rgba(165,42,42,1)", null ], "Nodes have tint colors rgba(165,42,42,1) and none.");
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ], true), [ 0xff2a2aa5, null ], "Nodes have tint colors 0xff2a2aa5 and none.");

						viewStateManager.setTintColor([ n1, n2 ], null);
						assert.deepEqual(viewStateManager.getTintColor([ n1, n2 ], true), [ null, null ], "Nodes have no tint color assigned.");
					});

					QUnit.test("recursiveSelection flag", function(assert) {
						var nodes = [
							nodeHierarchy.findNodesByName({ value: "Box #5" })[ 0 ], // root parent
							nodeHierarchy.findNodesByName({ value: "Box #6" })[ 0 ], // parent
							nodeHierarchy.findNodesByName({ value: "Box #22" })[ 0 ], // child 1
							nodeHierarchy.findNodesByName({ value: "Box #23" })[ 0 ], // child 2
							nodeHierarchy.findNodesByName({ value: "Box #24" })[ 0 ]  // child 3
						];

						viewStateManager.setSelectionState(nodes[ 0 ], false, true);
						assert.deepEqual(viewStateManager.getSelectionState(nodes), [ false, false, false, false, false ], "All nodes are deselected.");

						viewStateManager.setSelectionState(nodes[ 0 ], true, false);
						assert.deepEqual(viewStateManager.getSelectionState(nodes), [ true, false, false, false, false ], "Only the root parent is selected.");

						viewStateManager.setRecursiveSelection(true);
						viewStateManager.setSelectionState(nodes[ 0 ], true, false);
						assert.deepEqual(viewStateManager.getSelectionState(nodes), [ true, true, true, true, true ], "All nodes are selected.");

						viewStateManager.setRecursiveSelection(false);
						viewStateManager.setSelectionState(nodes[ 3 ], false, false);
						assert.deepEqual(viewStateManager.getSelectionState(nodes), [ true, true, true, false, true ], "Only one child is deselected.");

						viewStateManager.setRecursiveSelection(true);
						viewStateManager.setSelectionState(nodes[ 3 ], false, false);
						assert.deepEqual(viewStateManager.getSelectionState(nodes), [ false, false, true, false, true ], "One child and ancestors are deselected.");

						viewStateManager.setSelectionState(nodes[ 3 ], true, false);
						assert.deepEqual(viewStateManager.getSelectionState(nodes), [ false, false, true, true, true ], "Children are selected, ancestors are deselected.");
					});

					done();
				}
			});
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
