/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/vk/threejs/SceneBuilder",
	"sap/ui/vk/View",
	"sap/ui/vk/threejs/Scene"
], function(
	jQuery,
	three,
	SceneBuilder,
	View,
	Scene
) {
	"use strict";

	QUnit.test("SceneBuilder", function(assert) {
		var done = assert.async();

		var nativeScene = new THREE.Scene();
		var node = new THREE.Group();
		nativeScene.add(node);

		var sceneBuilder = new SceneBuilder();
		var sceneId = "166";
		var rootNodeId = "1";

		var vkScene = new Scene(nativeScene);
		sceneBuilder.setRootNode(node, rootNodeId, sceneId, vkScene);


		var rootNode = sceneBuilder._rootNode.getObjectById(5);
		var sceneBuilder2 = new SceneBuilder(rootNode);
		assert.ok(sceneBuilder2._rootNode, "root node");

		var node1 = new THREE.Group();
		nativeScene.add(node1);
		sceneBuilder.setRootNode(node1, "1001", "167");


		var cameraInfo = {
							aspect: 1,
							far: 200000,
							fov: 0.5236,
							id: "10802",
							near: 1,
							origin: [ -464.0531, -873.888, -178.129 ],
							ortho: false,
							target: [ -527.1015, -173.308, -784.8607 ],
							up: [ -0.0981, 0.9836, -0.1514 ],
							zoom: 1
						};
		var camera = sceneBuilder.createCamera(cameraInfo, sceneId);
		var getCamera = sceneBuilder.getCamera(cameraInfo.id);
		assert.equal(getCamera, camera, "getCamera");
		var nativeCamera = camera.getCameraRef();
		assert.ok(nativeCamera.far === 200000 && nativeCamera.near === 1 &&
					nativeCamera.type === "PerspectiveCamera" &&
					nativeCamera.position.x === cameraInfo.origin[0] &&
					nativeCamera.position.y === cameraInfo.origin[1] &&
					nativeCamera.position.z === cameraInfo.origin[2],
					"creation of camera");

		var nodeInfo0 = {
			name: "cameraNode",
			sid: "25252",
			parentId: 99
		};
		var result0 = sceneBuilder.createNode(nodeInfo0, sceneId);

		var testCamera = new THREE.PerspectiveCamera();
		sceneBuilder._cameras.set("6556", testCamera);
		assert.equal(sceneBuilder._nodes.get(nodeInfo0.sid).children.length, 0, "no camera before insert");
		sceneBuilder.insertCamera(nodeInfo0.sid, "6556", sceneId);
		assert.equal(sceneBuilder._nodes.get(nodeInfo0.sid).children.length, 1, "camera after insert");

		var nodeInfo1 = {
							children: [ 1, 4, 6 ],
							name: "root",
							parentId: "1",
							sid: "25046"
						};

		var result1 = sceneBuilder.createNode(nodeInfo1, sceneId);

		var nodeInfo2 = {
							materialId: "2732",
							name: "assy",
							sid: "25047",
							transform: [ 0.5736, 0, -0.8192, 0, 0, 1, 0, 0, 0.8192, 0, 0.5736, 0, -637.2498, -938.7576, -446.2174, 1 ]
						};
		nodeInfo2.parentId = "25046";
		var result2 = sceneBuilder.createNode(nodeInfo2, sceneId);

		var nodeInfo3 = {
							materialId: "2732",
							name: "part1",
							sid: "25048"
						};
		nodeInfo3.parentId = "25047";
		var result3 = sceneBuilder.createNode(nodeInfo3, sceneId);

		var meshId2 = "9303";
		var nodeInfo4 = {
							materialId: "2732",
							meshId: meshId2,
							name: "Root",
							sid: "25049"
						};
		nodeInfo4.parentId4 = "25048";
		var result4 = sceneBuilder.createNode(nodeInfo4, sceneId);

		var nodeInfo5 = {
							materialId: "2734",
							name: "part2",
							sid: "25050",
							transform: [ 0.682, 0, -0.7314, 0, 0, 1, 0, 0, 0.7314, 0, 0.682, 0, -588.1596, -927.9636, -499.916, 1 ]
						};
		nodeInfo5.parentId = "25046";
		var result5 = sceneBuilder.createNode(nodeInfo5, sceneId);

		var meshId1 = "9302";

		var nodeInfo6 = {
							materialId: "2734",
							meshId: meshId1,
							name: "Root",
							sid: "25051"
						};
		nodeInfo6.parentId = "25050";
		var result6 = sceneBuilder.createNode(nodeInfo6, sceneId);

		var nodeInfo7 = {
							materialId: "2734",
							name: "part3",
							sid: "25052",
							transform: [ 0.454, 0, -0.891, 0, 0, 1, 0, 0, 0.891, 0, 0.454, 0, -670.9324, -927.9636, -381.6974, 1 ]
						};
		nodeInfo7.parentId = "25046";
		var result7 = sceneBuilder.createNode(nodeInfo7, sceneId);

		var nodeInfo8 = {
							materialId: "2734",
							meshId: meshId1,
							name: "Root",
							sid: "25053"
						};
		nodeInfo8.parentId = "25052";
		var result8 = sceneBuilder.createNode(nodeInfo8, sceneId);

		var materialInfo1 = {
							ambientColour: [ 0.11764705926179886, 0.11764705926179886, 0.11764705926179886, 1 ],
							diffuseColour: [ 0.8980392217636108, 0.42352941632270813, 0.4745098054409027, 1 ],
							emissiveColour: [ 0, 0, 0, 1 ],
							glossiness: 0.20000000298023224,
							id: "2732",
							opacity: 1,
							specularColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
							specularLevel: 0.4000000059604645
							};
		var resMaterial1 = sceneBuilder.createMaterial(materialInfo1);
		var material1 = sceneBuilder.getMaterial(materialInfo1.id);
		assert.ok(resMaterial1.length === 0 &&
					material1.color.r === materialInfo1.diffuseColour[0] &&
					material1.color.g === materialInfo1.diffuseColour[1] &&
					material1.color.b === materialInfo1.diffuseColour[2] &&
					material1.specular.r === materialInfo1.specularColour[0] &&
					material1.specular.g === materialInfo1.specularColour[1] &&
					material1.specular.b === materialInfo1.specularColour[2], "creation of material 1");

		var materialInfo2 = {
							ambientColour: [ 0.11764705926179886, 0.11764705926179886, 0.11764705926179886, 1 ],
							diffuseColour: [ 0.8980392217636108, 0.45098039507865906, 0, 1 ],
							emissiveColour: [ 0, 0, 0, 1 ],
							glossiness: 0.20000000298023224,
							id: "2734",
							opacity: 1,
							specularColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
							specularLevel: 0.4000000059604645
							};
		var resMaterial2 = sceneBuilder.createMaterial(materialInfo2);
		var material2 = sceneBuilder.getMaterial(materialInfo2.id);
		assert.ok(resMaterial2.length === 0 &&
					material2.color.r === materialInfo2.diffuseColour[0] &&
					material2.color.g === materialInfo2.diffuseColour[1] &&
					material2.color.b === materialInfo2.diffuseColour[2] &&
					material2.specular.r === materialInfo2.specularColour[0] &&
					material2.specular.g === materialInfo2.specularColour[1] &&
					material2.specular.b === materialInfo2.specularColour[2], "creation of material 2");

		var materialInfo3 = {
							ambientColour: [ 0.11764705926179886, 0.11764705926179886, 0.11764705926179886, 1 ],
							diffuseColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
							emissiveColour: [ 0, 0, 0, 1 ],
							glossiness: 0.20000000298023224,
							id: "2735",
							opacity: 1,
							specularColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
							specularLevel: 0.4000000059604645
							};
		var resMaterial3 = sceneBuilder.createMaterial(materialInfo3);
		var material3 = sceneBuilder.getMaterial(materialInfo3.id);
		assert.ok(resMaterial3.length === 0 &&
					material3.color.r === materialInfo3.diffuseColour[0] &&
					material3.color.g === materialInfo3.diffuseColour[1] &&
					material3.color.b === materialInfo3.diffuseColour[2] &&
					material3.specular.r === materialInfo3.specularColour[0] &&
					material3.specular.g === materialInfo3.specularColour[1] &&
					material3.specular.b === materialInfo3.specularColour[2], "creation of material 3");

		var materialInfo4 = {
			ambientColour: [ 0.11764705926179886, 0.11764705926179886, 0.11764705926179886, 1 ],
			diffuseColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
			emissiveColour: [ 0, 0, 0, 1 ],
			glossiness: 0.20000000298023224,
			id: "2737",
			lineWidth: 2,
			lineColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
			opacity: 1,
			specularColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
			specularLevel: 0.4000000059604645
			};
		var resMaterial4 = sceneBuilder.createMaterial(materialInfo4);
		var material4 = sceneBuilder.getMaterial(materialInfo4.id);
		assert.ok(resMaterial4.length === 0 &&
			material4.color.r === materialInfo4.lineColour[0] &&
			material4.color.g === materialInfo4.lineColour[1] &&
			material4.color.b === materialInfo4.lineColour[2] &&
			material4.linewidth === materialInfo4.lineWidth &&
			material4.userData.lineStyle.width === materialInfo4.lineWidth &&
			material4.userData.materialInfo === materialInfo4 &&
			material4.userData.materialId === materialInfo4.id,
			"creation of material 4");

		var materialInfo5 = {
			ambientColour: [ 0.11764705926179886, 0.11764705926179886, 0.11764705926179886, 1 ],
			diffuseColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
			emissiveColour: [ 0.56764854688546, 0.56764854688546, 0.56764854688546, 1 ],
			glossiness: 0.20000000298023224,
			id: "7345",
			opacity: 1,
			specularColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
			specularLevel: 0.4000000059604645
		};
		sceneBuilder.createMaterial(materialInfo5);
		var material5 = sceneBuilder.getMaterial(materialInfo5.id);
		assert.equal(material5.side, 0, "amount of sides before update");
		sceneBuilder.updateMaterialForGeometryWithoutNormal(materialInfo5.id);
		assert.equal(material5.side, 2, "amount of sides after update");

		var lod11 = 	{
					boundingBox: [ -9.399999618530273, -9.399999618530273, 0, 9.399999618530273, 9.399999618530273, 1.9500000476837158 ],
					id: "12129"
					};
		var lod12 =  {
					boundingBox: [ -9.399999618530273, -9.399999618530273, 0, 9.399999618530273, 9.399999618530273, 1.9500000476837158 ],
					data: "A///7j9fd+4zVXf/P927rzPdu6r/X927z1Xdu8z/7q/Pd+6qzHf/7jNVd+7z9Xf/M927qvPdu/r/Vd27zPXdu/z/7qrMd+76/Hc=",
					id: "12130",
					type: "box"
					};
		var submeshInfo1 = 	{
							id: "9533",
							lods: [ lod11, lod12 ],
							materialId: "2735"
							};
		assert.equal(sceneBuilder._nodes.get(nodeInfo6.sid).children.length, 0, "no submeshes in node before insert");
		assert.equal(sceneBuilder._nodes.get(nodeInfo8.sid).children.length, 0, "no submeshes in node before insert");
		submeshInfo1.meshId = meshId1;
		var submeshRes1 = sceneBuilder.insertSubmesh(submeshInfo1);
		assert.equal(sceneBuilder._nodes.get(nodeInfo6.sid).children.length, 1, "submesh is added");
		assert.equal(sceneBuilder._nodes.get(nodeInfo8.sid).children.length, 1, "submesh is added");

		var geom12131 = "12131";

		var submeshInfo2 = {
			id: "9534",
			lods: [ {
				boundingBox: [ -104.8785400390625, 1.649999976158142, 0, 104.8785400390625, 455.5480041503906, 13.888444900512695 ],
				id: geom12131
			}, {
				boundingBox: [ -104.8785400390625, 1.649999976158142, 0, 104.8785400390625, 455.5480041503906, 13.888444900512695 ],
				data: "Az+7In9fM/f1d78Rr/sz+qpf//X/Va//+v8RMxEiMyI=",
				id: "12132",
				type: "box"
			} ],
			materialId: "2735"
		};
		assert.equal(sceneBuilder._nodes.get(nodeInfo4.sid).children.length, 0, "no submeshes in node before insert");
		submeshInfo2.meshId = meshId2;
		var submeshRes2 = sceneBuilder.insertSubmesh(submeshInfo2);
		assert.equal(sceneBuilder._nodes.get(nodeInfo4.sid).children.length, 1, "submesh is added");

		var meshId3 = "9304";
		var geom12133 = "12133";

		var submeshInfo3 = {
			id: "9535",
			lods: [ {
				boundingBox: [ -104.8785400390625, 1.649999976158142, 0, 104.8785400390625, 455.5480041503906, 13.888444900512695 ],
				id: geom12133
			} ],
			materialId: "2737",
			material: {
				ambientColour: [ 0.11764705926179886, 0.11764705926179886, 0.11764705926179886, 1 ],
				diffuseColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
				emissiveColour: [ 0, 0, 0, 1 ],
				glossiness: 0.20000000298023224,
				id: "2737",
				lineWidth: 2,
				opacity: 1,
				specularColour: [ 0.7529411911964417, 0.7529411911964417, 0.7529411911964417, 1 ],
				specularLevel: 0.4000000059604645
			}
		};

		var normals1 = new Float32Array([
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,
			0.0, 0.0, 1.0,

			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,
			0.0, 0.0, -1.0,

			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,
			0.0, 1.0, 0.0,

			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,
			0.0, -1.0, 0.0,

			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,
			1.0, 0.0, 0.0,

			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0,
			-1.0, 0.0, 0.0
		]);

		var indices1 = new Uint16Array([
			0, 1, 2, 2, 1, 3,
			4, 6, 5, 5, 6, 7,
			8 + 0, 8 + 1, 8 + 2, 8 + 2, 8 + 1, 8 + 3,
			8 + 4, 8 + 6, 8 + 5, 8 + 5, 8 + 6, 8 + 7,
			16 + 0, 16 + 1, 16 + 2, 16 + 2, 16 + 1, 16 + 3,
			16 + 4, 16 + 6, 16 + 5, 16 + 5, 16 + 6, 16 + 7
		]);

		var getVerticesFromBoundingBox = function(b) {
			var vertices = new Float32Array([
				b[0], b[1], b[5],
				b[3], b[1], b[5],
				b[0], b[4], b[5],
				b[3], b[4], b[5],

				b[0], b[1], b[2],
				b[3], b[1], b[2],
				b[0], b[4], b[2],
				b[3], b[4], b[2],

				b[0], b[4], b[5],
				b[3], b[4], b[5],
				b[0], b[4], b[2],
				b[3], b[4], b[2],

				b[0], b[1], b[5],
				b[3], b[1], b[5],
				b[0], b[1], b[2],
				b[3], b[1], b[2],

				b[3], b[1], b[5],
				b[3], b[1], b[2],
				b[3], b[4], b[5],
				b[3], b[4], b[2],

				b[0], b[1], b[5],
				b[0], b[1], b[2],
				b[0], b[4], b[5],
				b[0], b[4], b[2]
			]);
			return vertices;
		};

		var boundingBox1 = [ -9.399999618530273, -9.399999618530273, 0, 9.399999618530273, 9.399999618530273, 1.9500000476837158 ];
		var vertices1 = getVerticesFromBoundingBox(boundingBox1);

		var data1 = { indices: indices1, normals: normals1, points: vertices1 };

		var geoInfo1 = {
						data: data1,
						id: "12129",
						isPolyline: false,
						isPositionQuantized: false
					  };

		sceneBuilder.setGeometry(geoInfo1);

		var geo1 = sceneBuilder.getGeometry(geoInfo1.id);

		assert.ok(geo1, "creation of geometry 1");

		var boundingBox2 = [ -104.8785400390625, 1.649999976158142, 0, 104.8785400390625, 455.5480041503906, 13.888444900512695 ];
		var vertices2 = getVerticesFromBoundingBox(boundingBox2);

		var data2 = { indices: indices1, normals: normals1, points: vertices2 };

		var geoInfo2 = {
			data: data2,
			id: geom12131,
			isPolyline: false,
			isPositionQuantized: false
		};


		sceneBuilder.setGeometry(geoInfo2);

		var geo2 = sceneBuilder.getGeometry(geoInfo2.id);
		assert.ok(geo2, "creation of geometry 2");
		assert.equal(sceneBuilder._nodes.get(nodeInfo4.sid).children[0].geometry, geo2, "Geometry replaced");

		// var childIds = sceneBuilder.getChildNodeIds(nodeInfo4.sid, sceneId, true);
		// var childNode = sceneBuilder.getSubmesh(childIds[ 0 ]);
		// assert.ok(geo2 === childNode.geometry, "node geometry is updated");

		var geoInfo3 = {
			data: data2,
			id: geom12131,
			isPolyline: true,
			isPositionQuantized: false
		};

		assert.equal(sceneBuilder._nodes.get(nodeInfo4.sid).children[ 0 ].type, "Mesh", "Submesh type before geometry update");

		sceneBuilder.setGeometry(geoInfo3);

		var geo3 = sceneBuilder.getGeometry(geoInfo3.id);
		assert.ok(geo3, "creation of geometry 3");
		assert.equal(sceneBuilder._nodes.get(nodeInfo4.sid).children[ 0 ].geometry, geo3, "Geometry replaced");

		assert.equal(sceneBuilder._nodes.get(nodeInfo4.sid).children[ 0 ].type, "LineSegments", "Submesh type after geometry update");

		var geoInfo4 = {
			data: data2,
			id: geom12133,
			isPolyline: true,
			isPositionQuantized: false
		};

		sceneBuilder.setGeometry(geoInfo4);

		var geo4 = sceneBuilder.getGeometry(geoInfo4.id);
		assert.ok(geo4, "creation of geometry 4");

		assert.ok(sceneBuilder._meshSubmeshes.get(meshId3) === undefined, "No submeshes");
		submeshInfo3.meshId = meshId3;
		var submeshRes3 = sceneBuilder.insertSubmesh(submeshInfo3);
		assert.ok(sceneBuilder._meshSubmeshes.get(meshId3)[0].type === "LineSegments", "creation of submesh 3");

		var node4 = sceneBuilder.getNode(nodeInfo4.sid);
		var nodeId4 = node4._vkPersistentId();
		assert.ok(nodeId4 === nodeInfo4.sid, "node id is checked");

		var annotation = {
			node: node4,
			coordinateSpace: sap.ui.vk.BillboardCoordinateSpace.Screen,
			order: 3,
			text: "test",
			position: [ 50, 50, 50 ],
			nodeId: nodeId4
		};

		var annotation2 = {
			node: node4,
			coordinateSpace: sap.ui.vk.BillboardCoordinateSpace.Screen,
			order: 4,
			position: [ 100, 100, 100 ],
			width: 10,
			height: 10,
			labelMaterialId: materialInfo4.id,
			nodeId: nodeId4
		};

		sceneBuilder.createAnnotation(annotation, sceneId);
		var billboard = sceneBuilder._rootNode.userData._vkDynamicObjects[0].userData.billboard;
		assert.equal(billboard.getNode(), annotation.node, "annotation node");
		assert.equal(billboard.getRenderOrder(), 1003, "annotation render order");
		assert.equal(billboard.getText(), "test", "annotation text");
		assert.ok(billboard.getPosition().x === 99 &&
			billboard.getPosition().y === -99 &&
			billboard.getPosition().z === 50,
			"annotation position");


		sceneBuilder.createImageNote(annotation2, sceneId);
		var billboard2 = sceneBuilder._rootNode.userData._vkDynamicObjects[0].userData.billboard;
		assert.equal(billboard2.getMaterial().linewidth, materialInfo4.lineWidth, "imagenote line width");
		assert.equal(billboard2.getNode(), annotation.node, "imagenote node");
		assert.equal(billboard2.getHeight(), 5, "imagenote height");
		assert.equal(billboard2.getWidth(), 5, "imagenote width");
		assert.equal(billboard2.getRenderOrder(), 1004, "imagenote render order");
		assert.ok(billboard2.getPosition().x === 105 &&
			billboard2.getPosition().y === 105 &&
			billboard2.getPosition().z === 100,
			"imagenote position");

		var nodeIdArray = [ nodeInfo1.sid, nodeInfo2.sid ];
		assert.equal(sceneBuilder._nodes.size, 10, "amount of nodes before deletion");
		sceneBuilder.decrementResourceCountersForDeletedTreeNode(nodeIdArray, sceneId);
		assert.equal(sceneBuilder._nodes.size, 8, "amount of nodes after deletion");

		var binary = new Uint8Array([ 1, 1, 0, 0, 0, 1, 1, 0 ]);

		var imageInfo1 = {
			id: "testimg",
			binaryData: binary
		};

		assert.equal(sceneBuilder._images.size, 0, "amount of images at start");
		sceneBuilder.createImage(imageInfo1);
		assert.equal(sceneBuilder._images.size, 1, "amount of images at end");

		var pidRes = sceneBuilder.setNodePersistentId(node4, "abc-123");
		assert.ok(!pidRes, "node4 setNodePersistentId returns false");
		assert.ok(node4._vkPersistentId() === nodeInfo4.sid, "node4 id is checked");

		var node4Child = new THREE.Object3D();
		node4.add(node4Child);
		assert.ok(node4Child._vkPersistentId() === node4._vkPersistentId(), "node4.child id");

		pidRes = sceneBuilder.setNodePersistentId(node4Child, nodeInfo3.sid);
		assert.ok(!pidRes, "node4.child setNodePersistentId returns false");
		assert.ok(node4Child._vkPersistentId() === node4._vkPersistentId(), "node4.child id is not changed");

		var someUniqueId = "abc-123";
		pidRes = sceneBuilder.setNodePersistentId(node4Child, someUniqueId);
		assert.ok(pidRes, "node4.child setNodePersistentId returns true");
		assert.ok(node4Child._vkPersistentId() === someUniqueId, "node4.child id is changed");
		assert.equal(sceneBuilder.getNode(someUniqueId), node4Child, "get node4Child by new id");

		sceneBuilder.remove(nodeId4);
		node4 = sceneBuilder.getNode(nodeInfo4.sid);
		assert.ok(!node4, "node is removed");

		var viewId = "9923";
		var viewInfo = {
			name: "testView",
			viewId: viewId,
			thumbnailId: "testimg",
			thumbnailData: ""
		};

		assert.equal(sceneBuilder._views.size, 0, "number of views before insert");
		sceneBuilder.insertView(viewInfo, sceneId);
		assert.equal(sceneBuilder._views.size, 1, "number of views after insert");
		assert.equal(sceneBuilder._views.get(viewId).thumbnailData, sceneBuilder._images.get(imageInfo1.id), "view image data");

		var binary2 = new Uint8Array([ 0, 1, 1, 1, 0, 1, 1, 0 ]);

		var imageInfo2 = {
			id: "testimg2",
			binaryData: binary2
		};

		assert.equal(sceneBuilder._images.size, 1, "amount of images at start");
		sceneBuilder.createImage(imageInfo2);
		assert.equal(sceneBuilder._images.size, 2, "amount of images at end");

		viewInfo.thumbnailId = "testimg2";
		sceneBuilder.setViewThumbnail(imageInfo2.id, viewId, sceneId);
		assert.equal(sceneBuilder._views.get(viewId).thumbnailData, sceneBuilder._images.get(imageInfo2.id), "view image data after setViewThumbnail");

		var playbackInfo = {
			sequenceId: "1827",
			playbackSpeed: 1,
			playbackPreDelay: 0,
			playbackPostDelay: 0,
			playbackRepeat: 0,
			playbackReverse: false
		};

		assert.equal(sceneBuilder.getView(viewId).getPlaybacks().length, 0, "view without playback");
		sceneBuilder.insertPlayback(playbackInfo, viewId, sceneId);
		assert.ok(sceneBuilder.getView(viewId).getPlaybacks(), "view with playback");

		var sequenceInfo = {
			id: "1827",
			name: "testSequence"
		};

		assert.equal(vkScene.getSequences().length, 0, "number of sequences before insert");
		sceneBuilder.insertSequence(sequenceInfo);
		assert.equal(vkScene.getSequences().length, 1, "number of sequences after insert");
		assert.equal(vkScene.findSequence(sequenceInfo.id).getName(), sequenceInfo.name, "sequence name");
		var getSequence = sceneBuilder.getSequence(sequenceInfo.id);
		assert.ok(getSequence, "Sequence retrieved");

		var viewGroupInfo = { name: "test1", id: "6475", views: [ { id: "9923" } ] };

		assert.equal(sceneBuilder._viewGroups.size, 0, "number of view groups before insert");
		assert.equal(sceneBuilder.getViewGroup(viewGroupInfo.id, sceneId).length, 0, "get view group before insert");
		sceneBuilder.insertViewGroup(viewGroupInfo, sceneId);
		assert.equal(sceneBuilder._viewGroups.size, 1, "number of view groups after insert");
		assert.equal(sceneBuilder._viewGroups.get(viewGroupInfo.id).getName(), viewGroupInfo.name, "view group name");
		assert.equal(sceneBuilder.getViewGroup(viewGroupInfo.id, sceneId).length, 1, "get view group after insert");

		assert.notOk(sceneBuilder.getView(viewId).getCamera(), "view camera before set");
		sceneBuilder.setViewCamera(cameraInfo.id, viewId, sceneId);
		assert.ok(sceneBuilder.getView(viewId).getCamera(), "view camera after set");

		var nodeArray = [ result1, result2 ];
		assert.notOk(sceneBuilder.getView(viewId).getNodeInfos(), "view node infos before set");
		sceneBuilder.setViewNodeInfos(nodeArray, viewId, sceneId);
		assert.ok(sceneBuilder.getView(viewId).getNodeInfos(), "view node infos after set");

		sceneBuilder.finalizeViewGroups(sceneId);
		assert.ok(vkScene.getViewGroups().length, "viewGroups after finalization");

		var trackInfo = {
			name: "testTrack",
			id: "12945"
		};

		sceneBuilder._trackIdSequenceNodeMap.set(trackInfo.id);

		assert.equal(sceneBuilder._tracks.size, 0, "no tracks before set");
		sceneBuilder._tracks.set(trackInfo);
		assert.equal(sceneBuilder._tracks.size, 1, "one track after set");

		assert.notOk(sceneBuilder._rootNode.parent.userData.tracks, "no root node tracks before finalization");
		sceneBuilder.finalizeAnimation();
		assert.ok(sceneBuilder._rootNode.parent.userData.tracks, "root node tracks after finalization");

		var highlightStyleInfo = {
			name: "testHighlightStyle",
			id: "78312",
			opacityTrack: {
				times: [ 0, 1 ],
				values: [ 0.6, 0.8 ]
			}
		};

		sceneBuilder.insertHighlightStyle(highlightStyleInfo);

		var highlightStyleExists = sceneBuilder.highlightStyleExists(highlightStyleInfo.id);
		assert.ok(highlightStyleExists, "highlight style exists");

		sceneBuilder.recordHighlightedNodeInView(highlightStyleInfo.id, nodeInfo8.sid, viewId, sceneId);
		assert.ok(sceneBuilder._views.get(viewId).getHighlightIdNodesMap().get(highlightStyleInfo.id), "view highlightIdNodesMap exists and works");

		assert.ok(sceneBuilder._nodes.size > 0, "nodes exist before cleanup");
		assert.ok(sceneBuilder._cameras.size > 0, "cameras exist before cleanup");
		assert.ok(vkScene._materialMap.size > 0, "materials exist before cleanup");
		assert.ok(sceneBuilder._images.size > 0, "images exist before cleanup");
		assert.ok(sceneBuilder._geometries.size > 0, "geometries exist before cleanup");
		assert.ok(sceneBuilder._meshNodes.size > 0, "meshNodes exist before cleanup");
		assert.ok(sceneBuilder._meshSubmeshes.size > 0, "meshSubmeshes exist before cleanup");
		assert.ok(sceneBuilder._geometryMeshes.size > 0, "geometryMeshes exist before cleanup");
		assert.ok(sceneBuilder._materialMeshes.size > 0, "materialMeshes exist before cleanup");
		assert.ok(sceneBuilder._sceneIdTreeNodesMap.size > 0, "sceneIdTreeNodesMaps exists before cleanup");
		assert.ok(sceneBuilder._sceneIdRootNodeMap.size > 0, "sceneIdRootNodeMaps exist before cleanup");
		assert.ok(sceneBuilder._trackIdSequenceNodeMap.size > 0, "trackIdSequenceNodeMaps exist before cleanup");
		assert.ok(sceneBuilder._viewGroups.size > 0, "view groups exist before cleanup");
		assert.ok(sceneBuilder._views.size > 0, "views exist before cleanup");
		assert.ok(sceneBuilder._sceneIdViewGroupMap.size > 0, "sceneIdViewGroupMaps exist before cleanup");
		assert.ok(sceneBuilder._sceneIdViewMap.size > 0, "sceneIdViewMaps exist before cleanup");

		sceneBuilder.cleanup();

		assert.equal(sceneBuilder._nodes.size, 0, "no nodes after cleanup");
		assert.equal(sceneBuilder._cameras.size, 0, "no cameras after cleanup");
		assert.equal(vkScene._materialMap.size, 0, "no materials after cleanup");
		assert.equal(sceneBuilder._images.size, 0, "no images after cleanup");
		assert.equal(sceneBuilder._geometries.size, 0, "no geometries after cleanup");
		assert.equal(sceneBuilder._meshNodes.size, 0, "no meshNodes after cleanup");
		assert.equal(sceneBuilder._meshSubmeshes.size, 0, "no meshSubmeshes after cleanup");
		assert.equal(sceneBuilder._geometryMeshes.size, 0, "no geometryMeshes after cleanup");
		assert.equal(sceneBuilder._materialMeshes.size, 0, "no materialMeshes after cleanup");
		assert.equal(sceneBuilder._sceneIdTreeNodesMap.size, 0, "no sceneIdTreeNodesMaps after cleanup");
		assert.equal(sceneBuilder._sceneIdRootNodeMap.size, 0, "no sceneIdRootNodeMaps after cleanup");
		assert.equal(sceneBuilder._trackIdSequenceNodeMap.size, 0, "no trackIdSequenceNodeMaps after cleanup");
		assert.equal(sceneBuilder._viewGroups.size, 0, "no view groups after cleanup");
		assert.equal(sceneBuilder._views.size, 0, "no views after cleanup");
		assert.equal(sceneBuilder._sceneIdViewGroupMap.size, 0, "no sceneIdViewGroupMaps after cleanup");
		assert.equal(sceneBuilder._sceneIdViewMap.size, 0, "no sceneIdViewMaps after cleanup");

		done();
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
