sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/dvl/GraphicsCore"
], function(Controller, ContentResource, GraphicsCore) {
	"use strict";

	// specifying the resource to load
	var contentResource = new ContentResource({
		source: "../../internal/media/9cubes-layers-c.vds",
		sourceType: "vds",
		id: "abc123"
	});

	return Controller.extend("sap-demo.controller.App", {
		// when the controller is initialized,
		// we declare an empty structure and
		// we set this as model for the URLs
		onInit: function() {
			// Creates a new GraphicsCore object that takes 2 arguments as parameters. (runtimeSettings, webGLContextAttributes)
			// webGL Context Attributes:
			var graphicsCore = new GraphicsCore({}, {
				// the drawing buffer will perform antialiasing using its choice of technique (multisample/supersample) and quality
				antialias: true,
				// the drawing buffer has an alpha channel for the purposes of performing OpenGL destination alpha operations and compositing with the page
				alpha: true,
				// the page compositor will assume that colors in the drawing buffer are not premultiplied.
				premultipliedAlpha: false,
				preserveDrawingBuffer: true
			});

			var view = this.getView();

			var viewportA = view.byId("viewportA"),
				viewportB = view.byId("viewportB"),
				viewportC = view.byId("viewportC"),
				viewportD = view.byId("viewportD");

			viewportA.setGraphicsCore(graphicsCore);
			viewportB.setGraphicsCore(graphicsCore);
			viewportC.setGraphicsCore(graphicsCore);
			viewportD.setGraphicsCore(graphicsCore);

			// loads content resources
			graphicsCore.loadContentResourcesAsync([ contentResource ], function(sourcesFailedToLoad){
				if (sourcesFailedToLoad){
					// Creates a new error-level entry in the log with the given message
					jQuery.sap.log.error("Some of content resources cannot be loaded.");
				} else {
					// Builds a scene tree from the hierarchy of content resources. The content resources must be already loaded.
					var scene = graphicsCore.buildSceneTree([ contentResource ]);
					if (scene){
						viewportA.setScene(scene);
						viewportB.setScene(scene);
						viewportC.setScene(scene);
						viewportD.setScene(scene);

						var nodeHierarchy = scene.getDefaultNodeHierarchy(),
							viewStateManagerA = graphicsCore.createViewStateManager(nodeHierarchy, true),
							viewStateManagerB = graphicsCore.createViewStateManager(nodeHierarchy, true);

						viewportA.setViewStateManager(viewStateManagerA);
						viewportB.setViewStateManager(viewStateManagerA);
						viewportC.setViewStateManager(viewStateManagerB);
						viewportD.setViewStateManager(viewStateManagerB);

						// Move to global level for debugging purposes.
						window.dvl = graphicsCore._dvl;
						window.scene = scene;
						window.nodeHierarchy = nodeHierarchy;
						window.viewStateManagerA = viewStateManagerA;
						window.viewStateManagerB = viewStateManagerB;
						window.view = view;
						window.viewportA = viewportA;
						window.viewportB = viewportB;
						window.viewportC = viewportC;
						window.viewportD = viewportD;
						window.graphicsCore = graphicsCore;
					} else {
						jQuery.sap.log.error("Failed to load viewport");
					}
				}
			});
		}
	});
});