sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/vk/ContentResource",
	"sap/m/MessageToast"
], function(Controller, JSONModel, ContentResource) {
	"use strict";

	var contentResource = new sap.ui.vk.ContentResource({
		// specifying the resource to load
		source: "../../internal/media/nodes_boxes_with_steps.vds",
		sourceType: "vds",
		id: "abc123"
	});

	return Controller.extend("sap-demo.controller.App", {
			// when the controller is initialized,
			// we declare an empty structure and
			// we set this as model for the URLs
		onInit: function() {

			var mainScene;

			// Creates a new GraphicsCore object that takes 2 arguments as parameters. (runtimeSettings, webGLContextAttributes)
			// webGL Context Attributes:
			var graphicsCore = new sap.ui.vk.dvl.GraphicsCore({}, {
				// the drawing buffer will perform antialiasing using its choice of technique (multisample/supersample) and quality
				antialias: true,
				// the drawing buffer has an alpha channel for the purposes of performing OpenGL destination alpha operations and compositing with the page
				alpha: true,
				// the page compositor will assume that colors in the drawing buffer are not premultiplied.
				premultipliedAlpha: false
			});

			var view = this.getView();
			// get the current viewer control
			var viewport = view.byId("viewport");
			var sceneTree = view.byId("scenetree");
			var stepNavigation = view.byId("StepNavigation");
			viewport.setGraphicsCore(graphicsCore);
			// loads content resources
			graphicsCore.loadContentResourcesAsync([ contentResource ], function(sourcesFailedToLoad){
				if (sourcesFailedToLoad){
					// Creates a new error-level entry in the log with the given message
					jQuery.sap.log.error("Some of content resources cannot be loaded.");
				} else {
					// Builds a scene tree from the hierarchy of content resources. The content resources must be already loaded.
					var scene = graphicsCore.buildSceneTree([ contentResource ]);
					if (scene){
						mainScene = scene;
						// Scene class provides the interface for the 3D model.
						viewport.setScene(mainScene);
						// The ViewStateManager class manages visibility and selection states of nodes in the scene.
						// Creates a new ViewStateManager object.GraphicsCore owns the new ViewStateManager object.
						// nodeHierarchy	The NodeHierarchy object the view state manager is created for
						var viewStateManager = graphicsCore.createViewStateManager(mainScene.getDefaultNodeHierarchy());
						viewport.setViewStateManager(viewStateManager);
						sceneTree.setScene(mainScene, viewStateManager);

						// his control enables navigation and activation of procedures and steps contained in a single 3D scene.
						// Attaches a Scene object to the Step Navigation control so that it can access the Scene’s procedures and steps.
						stepNavigation.setScene(mainScene);
					} else {
						jQuery.sap.log.error("Failed to build the scene tree.");
					}
				}
			});
		}
	});
});