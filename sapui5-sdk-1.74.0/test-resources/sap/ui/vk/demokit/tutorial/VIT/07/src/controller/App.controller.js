sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/threejs/thirdparty/three"
], function(Controller, ContentResource, ContentConnector, threejs) {
	"use strict";

	return Controller.extend("threejsObjects.controller.App", {

		onInit: function() {

			function threejsObjectLoader(parentNode, contentResource) {
				parentNode.add(contentResource.getSource());
				return Promise.resolve({
					node: parentNode,
					contentResource: contentResource
				});
			}

			function threejsContentManagerResolver(contentResource) {
				if (contentResource.getSource() instanceof THREE.Object3D) {
					return Promise.resolve({
						dimension: 3,
						contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
						settings: {
							loader: threejsObjectLoader
						}
					});
				} else {
					return Promise.reject();
				}
			}

			ContentConnector.addContentManagerResolver(threejsContentManagerResolver);

			function initObject(obj, name, posX, posY, posZ, id) {
				obj.name = name;
				obj.position.set(posX, posY, posZ);
				obj.userData.treeNode = { sid: id };
			}

			var dx = 20, dy = 10;
			var root = new THREE.Group();
			initObject(root, "Root", 0, 0, 0, "0");

			var obj = new THREE.Mesh(
				new THREE.TorusBufferGeometry(5, 2, 16, 100),
				new THREE.MeshPhongMaterial({ color: 0xC06000 })
			);
			initObject(obj, "Torus1", -dx, dy, 0, "1");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.TorusKnotBufferGeometry(4, 1, 256, 24),
				new THREE.MeshPhongMaterial({ color: 0x00C0C0 })
			);
			initObject(obj, "TorusKnot", 0, dy, 0, "2");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.CylinderBufferGeometry(5, 5, 10, 48),
				new THREE.MeshPhongMaterial({ color: 0xC00000 })
			);
			initObject(obj, "Cylinder", dx, dy, 0, "3");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.BoxBufferGeometry(10, 10, 10),
				new THREE.MeshPhongMaterial({ color: 0x0000C0, shading: THREE.FlatShading })
			);
			initObject(obj, "Box", -dx, -dy, 0, "4");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.ConeBufferGeometry(5, 10, 16),
				new THREE.MeshPhongMaterial({ color: 0x00C000, shading: THREE.FlatShading })
			);
			initObject(obj, "Cone", 0, -dy, 0, "5");
			root.add(obj);

			obj = new THREE.Mesh(
				new THREE.DodecahedronBufferGeometry(6, 0),
				new THREE.MeshPhongMaterial({ color: 0xC0C000, shading: THREE.FlatShading })
			);
			initObject(obj, "Dodecahedron", dx, -dy, 0, "6");
			root.add(obj);

			this.getView().byId("viewer").addContentResource(
				new ContentResource({
					source: root,
					sourceType: "THREE.Object3D",
					name: "Object3D"
				})
			);
		}
	});
});