/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Scene",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Texture",
	"sap/ui/vk/threejs/Material",
	"sap/ui/vk/threejs/thirdparty/three",
	"sap/ui/vk/cssColorToColor",
	"sap/ui/vk/colorToCSSColor"
], function(
	jQuery,
	Scene,
	ViewStateManager,
	Texture,
	Material,
	three,
	cssColorToColor,
	colorToCSSColor
) {
	"use strict";

	var getAllChildMeshNodes = function(parent, meshNodes) {
		if (parent && parent instanceof THREE.Mesh) {
			meshNodes.push(parent);
		}

		if (parent && parent.children && parent.children.length > 0) {
			var oi;
			for (oi = 0; oi < parent.children.length; oi += 1) {
				getAllChildMeshNodes(parent.children[ oi ], meshNodes);
			}
		}
	};

	var getAllChildNodes = function(parent, childNodes) {
		if (parent && !(parent.geometry && (parent.name === "" || parent.name === undefined))) {
			childNodes.push(parent);
		}

		if (parent && parent.children && parent.children.length > 0) {
			var oi;
			for (oi = 0; oi < parent.children.length; oi += 1) {
				getAllChildNodes(parent.children[ oi ], childNodes);
			}
		}
	};

	var sourceData = {
		id: "materialId",
		name: "oneMaterial",
		ambientR: 0,
		ambientG: 0,
		ambientB: 0,
		diffuseR: 30,
		diffuseG: 60,
		diffuseB: 90,
		specularR: 10,
		specularG: 15,
		specularB: 20,
		emissiveR: 90,
		emissiveG: 120,
		emissiveB: 150,
		opacity: 0.8,
		glossness: 0.2,
		lineColourR: 180,
		lineColourG: 210,
		lineColourB: 255,
		lineWidth: 0.5,
		textureImageType: 0,   // diffuse = 0, bump = 1, opacity = 2, reflection = 3, emissive = 4, ambientOcclusion = 5
		textureImageUrl: "test-resources/sap/ui/vk/qunit/media/cat.jpg",
		textureId: "texturId",
		uvRotation: 0.5,
		uvHOffset: 5.0,
		uvVOffset: 10.0,
		uvHScale: 15.0,
		uvVScale: 25.0,
		uvHTilingEnabled: true,
		uvVTilingEnabled: true
	};

	QUnit.test("Three JS Material Interface", function(assert) {
		var done = assert.async();
		var test = 0;

		var diffuseTexture;
		var bumpTexture;
		var opacityTexture;
		var emissiveTexture;
		var ambientOcclusionTexture;

		var testTexture = function() {
			var texture = new Texture(sourceData.textureImageUrl);

			assert.ok(texture, "Texture loads ok");

			texture.setId(sourceData.textureId);

			texture.setUvRotationAngle(sourceData.uvRotation);

			texture.setUvHorizontalOffset(sourceData.uvHOffset);

			texture.setUvVerticalOffset(sourceData.uvVOffset);

			texture.setUvHorizontalScale(sourceData.uvHScale);

			texture.setUvVerticalScale(sourceData.uvVScale);

			texture.setUvHorizontalTilingEnabled(sourceData.uvHTilingEnabled);

			texture.setUvVerticalTilingEnabled(sourceData.uvVTilingEnabled);


			assert.ok(sourceData.textureId === texture.getId(), "Setting and getting texture ID works ok");
			assert.ok(sourceData.uvRotation === texture.getUvRotationAngle(), "Setting and getting texture rotation works ok");
			assert.ok(sourceData.uvHOffset === texture.getUvHorizontalOffset() &&
						sourceData.uvVOffset === texture.getUvVerticalOffset(), "Setting and getting texture offset works ok");
			assert.ok(sourceData.uvHScale === texture.getUvHorizontalScale() &&
						sourceData.uvVScale === texture.getUvVerticalScale(), "Setting and getting texture offset works ok");
			assert.ok(sourceData.uvHTilingEnabled === texture.getUvHorizontalTilingEnabled() &&
						sourceData.uvVTilingEnabled === texture.getUvVerticalTilingEnabled(), "Setting and getting texture enable tiling works ok");

			diffuseTexture = texture;
			bumpTexture = texture;
			opacityTexture = texture;
			emissiveTexture = texture;
			ambientOcclusionTexture = texture;
		};

		var currentMaterial;
		var testMaterial = function() {
			var material = new Material();

			var dc = { red: sourceData.diffuseR,
							green: sourceData.diffuseG,
							blue: sourceData.diffuseB,
							alpha: 1.0 };
			material.setDiffuseColour(colorToCSSColor(dc));

			var sc = { red: sourceData.specularR,
							green: sourceData.specularG,
							blue: sourceData.specularB,
							alpha: 1.0 };
			material.setSpecularColour(colorToCSSColor(sc));

			var ec = { red: sourceData.emissiveR,
							green: sourceData.emissiveG,
							blue: sourceData.emissiveB,
							alpha: 1.0 };
			material.setEmissiveColour(colorToCSSColor(ec));

			material.setOpacity(sourceData.opacity);

			material.setGlossness(sourceData.glossness);

			material.setId(sourceData.id);
			material.setName(sourceData.name);

			var diffuseC = material.getDiffuseColour();
			var diffuseColour = cssColorToColor(diffuseC);
			assert.ok(sourceData.diffuseR === diffuseColour.red &&
						sourceData.diffuseG === diffuseColour.green &&
						sourceData.diffuseB === diffuseColour.blue, "Setting and getting diffuse colour works ok");

			var specularC = material.getSpecularColour();
			var specularColour = cssColorToColor(specularC);
			assert.ok(sourceData.specularR === specularColour.red &&
						sourceData.specularG === specularColour.green &&
						sourceData.specularB === specularColour.blue, "Setting and getting specular colour works ok");

			var emissiveC = material.getEmissiveColour();
			var emissiveColour = cssColorToColor(emissiveC);
			assert.ok(sourceData.emissiveR === emissiveColour.red &&
						sourceData.emissiveG === emissiveColour.green &&
						sourceData.emissiveB === emissiveColour.blue, "Setting and getting emissive colour works ok");


			var opacity = material.getOpacity();
			var glossness = material.getGlossness();
			assert.ok(sourceData.opacity === opacity &&
						sourceData.glossness === glossness, "Setting and getting opacity and glossness works ok");

			var id = material.getId();
			var name = material.getName();
			assert.ok(sourceData.id === id &&
						sourceData.name === name, "Setting and getting id and name works ok");

			material.setTextureDiffuse(diffuseTexture);
			material.setTextureBump(bumpTexture);
			material.setTextureOpacity(opacityTexture);
			material.setTextureReflection(opacityTexture);
			material.setTextureEmissive(emissiveTexture);
			material.setTextureAmbientOcclusion(ambientOcclusionTexture);


			assert.ok(material.getTextureDiffuse().getTextureRef() === diffuseTexture.getTextureRef(), "Setting and getting diffuse texture works ok");
			assert.ok(material.getTextureBump().getTextureRef() === bumpTexture.getTextureRef(), "Setting and getting bump texture works ok");
			assert.ok(material.getTextureOpacity().getTextureRef() === opacityTexture.getTextureRef(), "Setting and getting opacity texture works ok");
			assert.ok(material.getTextureReflection().getTextureRef() === opacityTexture.getTextureRef(), "Setting and getting reflection texture works ok");
			assert.ok(material.getTextureEmissive().getTextureRef() === emissiveTexture.getTextureRef(), "Setting and getting emissive texture works ok");
			assert.ok(material.getTextureAmbientOcclusion().getTextureRef() === ambientOcclusionTexture.getTextureRef(), "Setting and getting ambient occlusion texture works ok");

			currentMaterial = material;
		};

		var testLineMaterial = function() {
			var material = new Material(true);
			var c = { red: sourceData.lineColourR,
						green: sourceData.lineColourG,
						blue: sourceData.lineColourB,
						alpha: 1.0 };
			material.setLineColour(colorToCSSColor(c));

			var lineC = material.getLineColour();
			var lineColour = cssColorToColor(lineC);
			assert.ok(sourceData.lineColourR === lineColour.red &&
						sourceData.lineColourG === lineColour.green &&
						sourceData.lineColourB === lineColour.blue, "Setting and getting line colour works ok");

			material.setLineWidth(sourceData.lineWidth);
			assert.ok(material.getLineWidth() === sourceData.lineWidth, "Setting and getting line width works ok");
		};

		var testMaterialInScene = function(scene) {
			var materials = scene.enumerateMaterials();
			assert.ok(materials.length > 0, "Scene enumerateMaterials function works ok");
		};

		var testMaterialInNodeProxy = function(nodeProxy) {
			var materials = nodeProxy.enumerateMaterials();
			assert.ok(materials.length > 0, "NodeProxy enumerateMaterials function works ok");

			var oldMaterial = materials[0];
			nodeProxy.assignMaterial(currentMaterial);
			assert.ok(nodeProxy.enumerateMaterials()[0].getMaterialRef() === currentMaterial.getMaterialRef()
							, "NodeProxy assignMaterial function works ok");

			nodeProxy.replaceMaterial(currentMaterial, oldMaterial);
			assert.ok(nodeProxy.enumerateMaterials()[0].getMaterialRef() === oldMaterial.getMaterialRef()
							, "NodeProxy replaceMaterial function works ok");

		};

		var testFunction = function(obj) {
			var nativeScene = new THREE.Scene();
			var scene = new Scene(nativeScene);
			nativeScene.add(obj);

			var viewStateManager = new ViewStateManager();
			viewStateManager._setScene(scene);

			// use the last mesh node as the selected node
			var meshNodes = [];
			getAllChildMeshNodes(nativeScene, meshNodes);

			if (test === 0) {
				testTexture();
				testMaterial();
				testLineMaterial();
			}

			testMaterialInScene(scene);

			var nodeHierarchy = viewStateManager.getNodeHierarchy();
			var nodeProxy = nodeHierarchy.createNodeProxy(meshNodes[0]);
			testMaterialInNodeProxy(nodeProxy);

			test++;
			if (test === 2) {
				done();
			}
		};

		var loader = new THREE.ObjectLoader();
		loader.load("test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", testFunction);
		loader.load("test-resources/sap/ui/vk/qunit/media/chair.json", testFunction);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
