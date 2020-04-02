sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/dvl/GraphicsCore"
], function(Controller, ContentResource, GraphicsCore) {
	"use strict";

	function handleFrameRenderingFinished(event) {
		var from = event.getSource(),
		    to = from === window.viewportTop ? window.viewportBottom : window.viewportTop;

		if (from._skip) {
			from._skip = false;
			return;
		}

		to.setViewInfo(from.getViewInfo({ camera: { useTransitionCamera: true }, animation: false }));
		to._skip = true;
	}

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
				premultipliedAlpha: false
			});

			var view = this.getView();

			var sceneTreeTop               = view.byId("sceneTreeTop"),
				viewportTop                = view.byId("viewportTop"),
				sceneTreeBottom            = view.byId("sceneTreeBottom"),
				viewportBottom             = view.byId("viewportBottom"),
				synchroniseCamerasCheckBox = view.byId("synchroniseCameras");

			viewportTop.setGraphicsCore(graphicsCore);
			viewportBottom.setGraphicsCore(graphicsCore);

			synchroniseCamerasCheckBox.attachSelect(function(event) {
				var methodName = (event.getParameter("selected") ? "attach" : "detach") + "FrameRenderingFinished";
				viewportTop[methodName](handleFrameRenderingFinished);
				viewportBottom[methodName](handleFrameRenderingFinished);
			});

			// loads content resources
			graphicsCore.loadContentResourcesAsync([ contentResource ], function(sourcesFailedToLoad){
				if (sourcesFailedToLoad){
					// Creates a new error-level entry in the log with the given message
					jQuery.sap.log.error("Some of content resources cannot be loaded.");
				} else {
					// Builds a scene tree from the hierarchy of content resources. The content resources must be already loaded.
					var scene = graphicsCore.buildSceneTree([ contentResource ]);
					if (scene) {
						var nodeHierarchy = scene.getDefaultNodeHierarchy(),
							viewStateManagerTop = graphicsCore.createViewStateManager(nodeHierarchy, true),
							viewStateManagerBottom = graphicsCore.createViewStateManager(nodeHierarchy, true);

						sceneTreeTop.setScene(scene, viewStateManagerTop);
						viewportTop.setViewStateManager(viewStateManagerTop);
						viewportTop.setScene(scene);
						sceneTreeBottom.setScene(scene, viewStateManagerBottom);
						viewportBottom.setViewStateManager(viewStateManagerBottom);
						viewportBottom.setScene(scene);

						// Move to global level for debugging purposes.
						window.dvl = graphicsCore._dvl;
						window.scene = scene;
						window.nodeHierarchy = nodeHierarchy;
						window.viewStateManagerTop = viewStateManagerTop;
						window.viewStateManagerBottom = viewStateManagerBottom;
						window.view = view;
						window.sceneTreeTop = sceneTreeTop;
						window.sceneTreeBottom = sceneTreeBottom;
						window.viewportTop = viewportTop;
						window.viewportBottom = viewportBottom;
						window.synchroniseCamerasCheckBox = synchroniseCamerasCheckBox;
						window.graphicsCore = graphicsCore;
					} else {
						jQuery.sap.log.error("Failed to load viewport");
					}
				}
			});
		}
	});
});
