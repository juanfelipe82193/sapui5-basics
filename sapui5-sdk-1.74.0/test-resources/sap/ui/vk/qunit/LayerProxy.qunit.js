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
		source: "test-resources/sap/ui/vk/qunit/media/9cubes-layers-c.vds",
		sourceType: "vds",
		sourceId: "abc"
	});

	var viewer = new Viewer({
		width: "100%",
		height: "400px",
		runtimeSettings: { totalMemory: 16777216 }
	});
	viewer.placeAt("content");

	QUnit.test("Loading model with layers", function(assertMain) {
		var done = assertMain.async();

		viewer.addContentResource(contentResource);

		viewer.attachSceneLoadingFailed(function(event) {
			assertMain.ok(false, "Model loading failed");
			done();
		});

		viewer.attachSceneLoadingSucceeded(function(event) {
			assertMain.ok(true, "Model loading succeeded");

			var scene = viewer.getScene();
			var nodeHierarchy = scene.getDefaultNodeHierarchy();
			var layerIds = nodeHierarchy.getLayers();
			var layers;

			QUnit.test("Layer count", function(assert) {
				assert.equal(layerIds.length, 2, "Model has 2 layers");
			});

			QUnit.test("Layer IDs", function(assert) {
				assert.notEqual(layerIds[0], sap.ve.dvl.DVLID_INVALID, "Layer 1 has a valid ID");
				assert.notEqual(layerIds[1], sap.ve.dvl.DVLID_INVALID, "Layer 2 has a valid ID");
			});

			QUnit.test("Layer proxies", function(assert) {
				layers = layerIds.map(function(id) { return nodeHierarchy.createLayerProxy(id); });
				assert.equal(layers.length, 2, "2 layer proxies");
				assert.equal(nodeHierarchy._layerProxies.length, 2, "Node hierarchy contains 2 layer proxies");
				if (layers.length === 2) {
					// Order of layers is random. Let's reorder them [Layer1, Layer2].
					if (layers[0].getName() === "Layer2") {
						var temp = layers[0];
						layers[0] = layers[1];
						layers[1] = temp;
					}
				}
			});

			QUnit.test("Layer 1 properties", function(assert) {
				assert.equal(layers[0].getName(), "Layer1", "Layer name");
				assert.equal(layers[0].getDescription(), "Non-diagonal cubes.", "Layer description");
				assert.deepEqual(layers[0].getVeIds(),
					[
						{
							"type": "VE_LAYER",
							"source": "SAP",
							"fields": [
								{
									"name": "ID",
									"value": "a985410d-b612-46eb-94c0-aab257753e03_305"
								}
							]
						}
					], "Layer VE IDs");
				assert.deepEqual(layers[0].getLayerMetadata(),
					{
						"Layer1 Blob Category": {
							"Layer1 Blob": ""
						},
						"Layer1 TestCategory": {
							"Name.Array1": [
								"Value.1.1",
								"Value.1.2"
							],
							"Name.Array2": [
								"Value.2.1",
								"Value.2.2"
							],
							"Name.Date": "20151001T132301",
							"Name.Float": "12.123",
							"Name.Integer": "12",
							"String.1": "Value.1",
							"String.2": "Value.2"
						}
					}, "Layer metadata");
			});

			QUnit.test("Layer 2 properties", function(assert) {
				assert.equal(layers[1].getName(), "Layer2", "Layer name");
				assert.equal(layers[1].getDescription(), "Diagonal cubes.", "Layer description");
				assert.deepEqual(layers[1].getVeIds(),
					[
						{
							"type": "VE_LAYER",
							"source": "SAP",
							"fields": [
								{
									"name": "ID",
									"value": "a985410d-b612-46eb-94c0-aab257753e03_303"
								}
							]
						}
					], "Layer VE IDs");
				assert.deepEqual(layers[1].getLayerMetadata(),
					{
						"Layer2 Blob Category": {
							"Layer2 Blob": ""
						},
						"Layer2 TestCategory": {
							"layer2.Array1": [
								"layer2.1.1",
								"layer2.1.2",
								"layer2.1.3"
							],
							"layer2.Array2": [
								"layer2.2.1",
								"layer2.2.2"
							],
							"layer2.Date": "20160101T122304",
							"layer2.Float": "333.4321",
							"layer2.Integer": "333",
							"layer2.String.1": "layer2.1",
							"layer2.String.2": "layer2.2"
						}
					}, "Layer metadata");
			});

			QUnit.test("Layer 1 nodes", function(assert) {
				var nodeRefs = layers[0].getNodes();
				assert.equal(nodeRefs.length, 3, "Layer node count");
				var nodes = nodeRefs.map(function(nodeRef) {
					var node = nodeHierarchy.createNodeProxy(nodeRef);
					var name = node.getName();
					nodeHierarchy.destroyNodeProxy(node);
					return name;
				}).sort(); // The order of nodes in the layer is undefined. We have to sort the array of node names
							// to be able to compare it with the expected list of node names.
				assert.deepEqual(nodes, [ "Box2", "Box4", "Box9" ], "Nodes are equal");
			});

			QUnit.test("Layer 2 nodes", function(assert) {
				var nodeRefs = layers[1].getNodes();
				assert.equal(nodeRefs.length, 3, "Layer node count");
				var nodes = nodeRefs.map(function(nodeRef) {
					var node = nodeHierarchy.createNodeProxy(nodeRef);
					var name = node.getName();
					nodeHierarchy.destroyNodeProxy(node);
					return name;
				}).sort(); // The order of nodes in the layer is undefined. We have to sort the array of node names
							// to be able to compare it with the expected list of node names.
				assert.deepEqual(nodes, [ "Box3", "Box5", "Box7" ], "Nodes are equal");
			});

			QUnit.test("Destroy layer proxies", function(assert) {
				layers.forEach(function(layer) {
					nodeHierarchy.destroyLayerProxy(layer);
				});
				assert.equal(nodeHierarchy._layerProxies.length, 0, "Node hierarchy contains 0 layer proxies");
			});

			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});