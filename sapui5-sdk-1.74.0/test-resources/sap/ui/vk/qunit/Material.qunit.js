/* global QUnit, DvlEnums*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/dvl/GraphicsCoreApi"
], function(
	jQuery,
	ContentResource,
	Viewer,
	GraphicsCoreApi
) {
	"use strict";

		QUnit.test("Material", function(assert) {
			var done = assert.async();

			var oViewer = new Viewer({
				webGLContextAttributes: {
					preserveDrawingBuffer: true
				},
				runtimeSettings: { totalMemory: 16777216 }
			});
			oViewer.placeAt("content");

			oViewer.addContentResource(new ContentResource({
				source: "test-resources/sap/ui/vk/qunit/media/box.vds",
				sourceType: "vds",
				sourceId: "abc"
			}));

			function floatEqual(a, b, desc) {
				assert.deepEqual(a.toFixed(4), b.toFixed(4), desc);
			}

			oViewer.attachSceneLoadingSucceeded(function() {

				var dvl = oViewer.getGraphicsCore().getApi(GraphicsCoreApi.LegacyDvl);
				var scene = dvl.Settings.LastLoadedSceneId;

				var info = dvl.Scene.RetrieveSceneInfo(scene, DvlEnums.DVLSCENEINFO.DVLSCENEINFO_MATERIALS);
				assert.ok(info.hasOwnProperty("Materials"), "Retrieve scene materials list");
				assert.deepEqual(info.Materials.length, 12);

				var materials = [];
				for (var i = 0; i < info.Materials.length; i++) {
					materials[i] = dvl.Material.GetName(info.Materials[i]);
				}

				materials.sort();
				assert.deepEqual(materials[0], "Black");
				assert.deepEqual(materials[1], "Blue");
				assert.deepEqual(materials[2], "Green");
				assert.deepEqual(materials[3], "Material #10");
				assert.deepEqual(materials[4], "Material #11");
				assert.deepEqual(materials[5], "Material #12");
				assert.deepEqual(materials[6], "Material #7");
				assert.deepEqual(materials[7], "Material #8");
				assert.deepEqual(materials[8], "Material #9");
				assert.deepEqual(materials[9], "Purple");
				assert.deepEqual(materials[10], "Red");
				assert.deepEqual(materials[11], "Yellow");

				var mRed = dvl.Scene.GetMaterialByName(scene, "Red");
				var mGreen = dvl.Scene.GetMaterialByName(scene, "Green");
				var mBlue = dvl.Scene.GetMaterialByName(scene, "Blue");
				var mBlack = dvl.Scene.GetMaterialByName(scene, "Black");
				var mPurple = dvl.Scene.GetMaterialByName(scene, "Purple");
				var mYellow = dvl.Scene.GetMaterialByName(scene, "Yellow");

				assert.notEqual(mRed, "");
				assert.notEqual(mGreen, "");
				assert.notEqual(mBlue, "");
				assert.notEqual(mBlack, "");
				assert.notEqual(mPurple, "");
				assert.notEqual(mYellow, "");

				assert.deepEqual(dvl.Material.GetColorParam(mRed, DvlEnums.DVLMATERIALCOLORPARAM.EMISSIVE), 0xFF0000, "Red emissive color");
				assert.deepEqual(dvl.Material.GetColorParam(mGreen, DvlEnums.DVLMATERIALCOLORPARAM.EMISSIVE), 0x00FF00, "Green emissive color");
				assert.deepEqual(dvl.Material.GetColorParam(mBlue, DvlEnums.DVLMATERIALCOLORPARAM.EMISSIVE), 0x0000FF, "Blue emissive color");
				assert.deepEqual(dvl.Material.GetColorParam(mBlack, DvlEnums.DVLMATERIALCOLORPARAM.EMISSIVE), 0x000000, "Black emissive color");
				assert.deepEqual(dvl.Material.GetColorParam(mPurple, DvlEnums.DVLMATERIALCOLORPARAM.EMISSIVE), 0xFF00FF, "Purple emissive color");
				assert.deepEqual(dvl.Material.GetColorParam(mYellow, DvlEnums.DVLMATERIALCOLORPARAM.EMISSIVE), 0xFFFF00, "Yellow emissive color");

				assert.deepEqual(dvl.Material.GetColorParam(mBlue, DvlEnums.DVLMATERIALCOLORPARAM.AMBIENT), 0x000000, "Black ambient color");
				assert.deepEqual(dvl.Material.GetColorParam(mBlue, DvlEnums.DVLMATERIALCOLORPARAM.DIFFUSE), 0x000000, "Black diffuse color");
				assert.deepEqual(dvl.Material.GetColorParam(mBlue, DvlEnums.DVLMATERIALCOLORPARAM.SPECULAR), 0x000000, "Black specular color");
				floatEqual(dvl.Material.GetScalarParam(mBlue, DvlEnums.DVLMATERIALSCALARPARAM.OPACITY), 1.0, "Black opacity");
				floatEqual(dvl.Material.GetScalarParam(mBlue, DvlEnums.DVLMATERIALSCALARPARAM.GLOSSINESS), 0.2, "Black glossiness");
				floatEqual(dvl.Material.GetScalarParam(mBlue, DvlEnums.DVLMATERIALSCALARPARAM.SPECULAR_LEVEL), 0.4, "Black specular level");

				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE), "");
				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE2), "");
				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE3), "");
				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE4), "");
				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.REFLECTION), "");
				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.BUMP), "");
				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.SELF_ILLUMINATION), "");

				// test texture parameters without assigned texture ---------------------------------------------------

				// default values
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_U), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_V), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_U), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_V), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.ANGLE), 0.0);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_U), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_V), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.MODULATE), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.INVERT), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.COLOR_MAP), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.DECAL), false);

				// set parameters
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT, 0.1);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_U, 0.2);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_V, 0.3);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_U, 0.4);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_V, 0.5);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.ANGLE, 0.6);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_U, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_V, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.MODULATE, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.INVERT, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.COLOR_MAP, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.DECAL, true);

				// test parameters
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_U), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_V), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_U), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_V), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.ANGLE), 0.0);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_U), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_V), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.MODULATE), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.INVERT), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.COLOR_MAP), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.DECAL), false);

				// assign texture -------------------------------------------------------------------------------------

				var tex = dvl.Renderer.CreateTexture(1, 1, [ 255, 255, 255, 255 ]);
				dvl.Material.SetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, tex);
				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE), tex);

				// test texture parameters with assigned texture ------------------------------------------------------

				// default values
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 1.0);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_U), 0.0);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_V), 0.0);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_U), 1.0);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_V), 1.0);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.ANGLE), 0.0);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_U), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_V), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.MODULATE), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.INVERT), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.COLOR_MAP), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.DECAL), false);

				// set parameters
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT, 0.1);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_U, 0.2);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_V, 0.3);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_U, 0.4);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_V, 0.5);
				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.ANGLE, 0.6);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_U, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_V, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.MODULATE, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.INVERT, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.COLOR_MAP, true);
				dvl.Material.SetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.DECAL, true);

				// test parameters
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.1);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_U), 0.2);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_V), 0.3);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_U), 0.4);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_V), 0.5);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.ANGLE), 0.6);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_U), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_V), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.MODULATE), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.INVERT), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.COLOR_MAP), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.DECAL), true);

				// clone material -------------------------------------------------------------------------------------

				var m2 = dvl.Material.Clone(mBlue);
				assert.notEqual(m2, mBlue);

				// test parameters
				assert.deepEqual(dvl.Material.GetName(m2), "Blue");
				assert.deepEqual(dvl.Material.GetTexture(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE), tex);
				floatEqual(dvl.Material.GetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.1);
				floatEqual(dvl.Material.GetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_U), 0.2);
				floatEqual(dvl.Material.GetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_V), 0.3);
				floatEqual(dvl.Material.GetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_U), 0.4);
				floatEqual(dvl.Material.GetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_V), 0.5);
				floatEqual(dvl.Material.GetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.ANGLE), 0.6);
				assert.deepEqual(dvl.Material.GetTextureFlag(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_U), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_V), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.MODULATE), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.INVERT), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.COLOR_MAP), true);
				assert.deepEqual(dvl.Material.GetTextureFlag(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.DECAL), true);

				dvl.Material.SetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT, 0.8);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.8);
				floatEqual(dvl.Material.GetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.1);

				dvl.Material.SetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT, 0.9);
				floatEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.8);
				floatEqual(dvl.Material.GetTextureParam(m2, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.9);

				var res = dvl.Material.Release(m2);
				assert.deepEqual(res, DvlEnums.DVLRESULT.OK);

				// remove texture -------------------------------------------------------------------------------------

				dvl.Material.SetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, null);
				assert.deepEqual(dvl.Material.GetTexture(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE), "");

				// default values
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.AMOUNT), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_U), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.OFFSET_V), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_U), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.SCALE_V), 0.0);
				assert.deepEqual(dvl.Material.GetTextureParam(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREPARAM.ANGLE), 0.0);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_U), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.CLAMP_V), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.MODULATE), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.INVERT), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.COLOR_MAP), false);
				assert.deepEqual(dvl.Material.GetTextureFlag(mBlue, DvlEnums.DVLMATERIALTEXTURE.DIFFUSE, DvlEnums.DVLMATERIALTEXTUREFLAG.DECAL), false);

				// assign material to a cloned node -------------------------------------------------------------------

				var nodes = dvl.Scene.FindNodes(dvl.Settings.LastLoadedSceneId, sap.ve.dvl.DVLFINDNODETYPE.DVLFINDNODETYPE_NODE_NAME, sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_EQUAL, "colorBox").nodes;

				assert.deepEqual(nodes.length, 1);
				var n1 = nodes[0];
				var n2 = dvl.Scene.CreateNodeCopy(dvl.Settings.LastLoadedSceneId, n1, sap.ve.dvl.DVLCREATENODECOPYFLAG.COPY_CHILDREN);
				assert.notEqual(n2, n1);

				assert.deepEqual(dvl.Scene.GetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n1, 0), mGreen);
				assert.deepEqual(dvl.Scene.GetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n2, 0), mGreen);

				dvl.Scene.SetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n1, 0, mBlue);
				assert.deepEqual(dvl.Scene.GetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n1, 0), mBlue);
				assert.deepEqual(dvl.Scene.GetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n2, 0), mBlue);

				dvl.Scene.SetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n2, 0, mGreen);
				assert.deepEqual(dvl.Scene.GetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n1, 0), mGreen);
				assert.deepEqual(dvl.Scene.GetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n2, 0), mGreen);

				res = dvl.Scene.DeinstanceContent(dvl.Settings.LastLoadedSceneId, n2);
				assert.deepEqual(res, DvlEnums.DVLRESULT.OK);

				dvl.Scene.SetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n2, 0, mRed);
				assert.deepEqual(dvl.Scene.GetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n1, 0), mGreen);
				assert.deepEqual(dvl.Scene.GetNodeSubmeshMaterial(dvl.Settings.LastLoadedSceneId, n2, 0), mRed);

				// ----------------------------------------------------------------------------------------------------

				done();
			});
		});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
