sap.ui.define(function() {

	"use strict";
	return {
		name: "Library sap.ui.vk",
		defaults: {
			group: "Default",
			qunit: {
				version: 2
			},
			sinon: false,
			ui5: {
				language: "en-US",
				rtl: false,					// Whether to run the tests in RTL mode
				libs: [ "sap.ui.vk" ],		// Libraries to load upfront in addition to the library which is tested (sap.ui.vk), if null no libs are loaded
				"xx-waitForTheme": true		// Whether the start of the test should be delayed until the theme is applied
			},
			coverage: {
				only:	[ "sap/ui/vk" ],	// Which files to show in the coverage report, if null, no files are excluded from coverage
				branchCoverage: true		// Whether to enable standard branch coverage
			},
			loader: {
				paths: {
					"sap/ui/vk/qunit": "test-resources/sap/ui/vk/qunit/",
					"sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/",
					"sap/ui/demo/mock": "test-resources/sap/ui/documentation/sdk/"
				}
			},
			page: "test-resources/sap/ui/vk/qunit/teststarter.qunit.html?test={name}",
			autostart: true					// Whether to call QUnit.start() when the test setup is done
		},
		tests: {
			"Animation": {
				coverage: {
					only: [ "sap/ui/vk/AnimationSequence.js" ]
				}
			},
			"BaseNodeProxy": {
				coverage: {
					only: [ "sap/ui/vk/BaseNodeProxy.js" ]
				}
			},
			"Camera": {
			},
			"DownloadManager": {
				coverage: {
					only: [ "sap/ui/vk/DownloadManager.js" ]
				}
			},
			"DrawerToolbar": {
				coverage: {
					only: [ "sap/ui/vk/DrawerToolbar.js" ]
				}
			},
			"GenericTests": {
			},
			"GetImage": {
				coverage: {
					only: [ "sap/ui/vk/threejs/Viewport.js" ]
				}
			},
			"GraphicsCore": {
				coverage: {
					only: [ "sap/ui/vk/dvl/GraphicsCore.js" ]
				}
			},
			"HitTestTool": {
				coverage: {
					only: [ "sap/ui/vk/tools/HitTestTool.js" ]
				}
			},
			"JointUtils": {
				coverage: {
					only: [
						"sap/ui/vk/JointUtils.js"
					]
				}
			},
			"NodeUtils": {
				coverage: {
					only: [
						"sap/ui/vk/NodeUtils.js"
					]
				}
			},
			"MoveTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/MoveTool.js",
						"sap/ui/vk/tools/Detector.js"
					]
				}
			},
			"RotateTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/RotateTool.js",
						"sap/ui/vk/tools/Detector.js"
					]
				}
			},
			"ScaleTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/ScaleTool.js",
						"sap/ui/vk/tools/Detector.js"
					]
				}
			},
			"AnchorPointTool": {
				coverage: {
					only: [
						"sap/ui/vk/tools/AnchorPointTool.js",
						"sap/ui/vk/tools/AnchorPointToolGizmo.js",
					]
				}
			},
			"GlMatrixUtils": {
				coverage: {
					only: [
						"sap/ui/vk/tools/GlMatrixUtils.js"
					]
				}
			},
			"LayerProxy": {
				coverage: {
					only: [ "sap/ui/vk/LayerProxy.js" ]
				}
			},
			"library": {
			},
			"Localisation": {
			},
			"Material": {
			},
			"Measurements": {
				coverage: {
					only: [ "sap/ui/vk/Viewer.js" ]
				}
			},
			"NativeViewport": {
				coverage: {
					only: [ "sap/ui/vk/NativeViewport.js" ]
				}
			},
			"NodeHierarchy": {
				coverage: {
					only: [
						"sap/ui/vk/NodeHierarchy.js",
						"sap/ui/vk/dvl/NodeHierarchy.js",
						"sap/ui/vk/threejs/NodeHierarchy.js"
					]
				}
			},
			"NodeProxy": {
				coverage: {
					only: [
						"sap/ui/vk/NodeProxy.js",
						"sap/ui/vk/dvl/NodeProxy.js",
						"sap/ui/vk/threejs/NodeProxy.js"
					]
				}
			},
			"Notifications": {
				coverage: {
					only: [ "sap/ui/vk/Notifications.js" ]
				}
			},
			"RedlineDesign": {
				coverage: {
					only: [ "sap/ui/vk/RedlineDesign.js" ]
				}
			},
			"RedlineElement": {
				coverage: {
					only: [ "sap/ui/vk/RedlineElement.js" ]
				}
			},
			"RedlineElementEllipse": {
				coverage: {
					only: [ "sap/ui/vk/RedlineElementEllipse.js" ]
				}
			},
			"RedlineElementFreehand": {
				coverage: {
					only: [ "sap/ui/vk/RedlineElementFreehand.js" ]
				}
			},
			"RedlineElementLine": {
				coverage: {
					only: [ "sap/ui/vk/RedlineElementLine.js" ]
				}
			},
			"RedlineElementRectangle": {
				coverage: {
					only: [ "sap/ui/vk/RedlineElementRectangle.js" ]
				}
			},
			"RedlineElementText": {
				coverage: {
					only: [ "sap/ui/vk/RedlineElementText.js" ]
				}
			},
			"RedlineSurface": {
				coverage: {
					only: [ "sap/ui/vk/RedlineSurface.js" ]
				}
			},
			"Scene": {
				coverage: {
					only: [ "sap/ui/vk/Scene.js" ]
				}
			},
			"SceneTree": {
				coverage: {
					only: [ "sap/ui/vk/SceneTree.js" ]
				}
			},
			"Selection": {
				coverage: {
					only: [ "sap/ui/vk/ViewportBase.js" ]
				}
			},
			"StepNavigation": {
				coverage: {
					only: [ "sap/ui/vk/StepNavigation.js" ]
				}
			},
			"threejs.Camera": {
				coverage: {
					only: [ "sap/ui/vk/Viewer.js", "sap/ui/vk/threejs/PerspectiveCamera.js", "sap/ui/vk/threejs/OrthographicCamera.js" ]
				}
			},
			"threejs.Lighting": {
				coverage: {
					only: [ "sap/ui/vk/Viewer.js" ]
				}
			},
			"threejs.Matai": {
				coverage: {
					only: [
						"sap/ui/vk/threejs/thirdparty/matai.js",
						"sap/ui/vk/threejs/thirdparty/matai.wasm",
						"sap/ui/vk/threejs/MataiLoader.js",
						"sap/ui/vk/threejs/MataiLoaderWorker.js",
						"sap/ui/vk/threejs/SceneBuilder.js",
						"sap/ui/vk/threejs/Billboard.js",
						"sap/ui/vk/threejs/Callout.js",
						"sap/ui/vk/threejs/PolylineGeometry.js",
						"sap/ui/vk/threejs/PolylineMaterial.js",
						"sap/ui/vk/threejs/PolylineMesh.js"
					]
				}
			},
			"threejs.Material": {
				coverage: {
					only: [ "sap/ui/vk/threejs/Viewport.js" ]
				}
			},
			"threejs.MaterialInterface": {
				coverage: {
					only: [ "sap/ui/vk/threejs/Material.js", "sap/ui/vk/threejs/Texture.js" ]
				}
			},
			"threejs.SceneBuilder": {
				coverage: {
					only: [ "sap/ui/vk/threejs/SceneBuilder.js" ]
				}
			},
			"threejs.Viewport": {
				coverage: {
					only: [ "sap/ui/vk/threejs/Viewport.js" ]
				}
			},
			"threejs.ViewStateManager": {
				coverage: {
					only: [ "sap/ui/vk/threejs/ViewStateManager.js" ]
				}
			},
			"Tools": {
				coverage: {
					only: [
						"sap/ui/vk/tools/Tool.js",
						"sap/ui/vk/tools/Gizmo.js",
						"sap/ui/vk/tools/SceneOrientationTool",
						"sap/ui/vk/tools/TooltipTool"
					]
				}
			},
			"VDSL": {},
			"ViewAndViewGroup": {
				coverage: {
					only: [ "sap/ui/vk/View.js",
							"sap/ui/vk/ViewGroup.js" ]
				}
			},
			"Viewer": {
				coverage: {
					only: [ "sap/ui/vk/Viewer.js" ]
				}
			},
			"ViewGallery": {
				coverage: {
					only: [ "sap/ui/vk/ViewGallery.js" ]
				}
			},
			"Viewport": {
				coverage: {
					only: [ "sap/ui/vk/Viewport.js" ]
				}
			},
			"ViewStateManager": {
				coverage: {
					only: [ "sap/ui/vk/ViewStateManager.js" ]
				}
			},
			"Highlight": {
				coverage: {
					only: [ "sap/ui/vk/Highlight.js",
							"sap/ui/vk/threejs/HighlightPlayer.js" ]
				}
			}
		}
	};
});
