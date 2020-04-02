/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithViewer"
], function(
	jQuery,
	loader
) {
	"use strict";

	QUnit.moduleWithViewer("threejs.Lighting", "test-resources/sap/ui/vk/qunit/media/boxes.three.json", "threejs.test.json");

	QUnit.test("MAIN TEST", function(assert) {
		var nativeScene = this.viewer.getScene().getSceneRef();
		var nPointLight = 0, nDirectionalLight = 0, nLightForCastingShadow = 0;
		for (var ni = 0; ni < nativeScene.children.length; ni++){
			if (nativeScene.children[ni] && nativeScene.children[ni].name === "DefaultLights"){
				var lightGroups = nativeScene.children[ni];
				for (var nj = 0; nj < lightGroups.children.length; nj++){
					if (lightGroups.children[nj] instanceof THREE.PointLight){
						nPointLight++;
						var pointLightHelper = new THREE.PointLightHelper(lightGroups.children[nj], 100);
						nativeScene.add(pointLightHelper);
					} else if (lightGroups.children[nj] instanceof THREE.DirectionalLight){
						nDirectionalLight++;
						var helper = new THREE.DirectionalLightHelper(lightGroups.children[nj], 100);
						nativeScene.add(helper);
					}
					if (lightGroups.children[nj].castShadow){
						nLightForCastingShadow++;
					}
				}
			}
		}
		assert.equal(nPointLight, 1, "One point light is checked");
		assert.equal(nDirectionalLight, 3, "3 directional lights are checked");
		assert.equal(nLightForCastingShadow, 0, "0 casting shadow");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
