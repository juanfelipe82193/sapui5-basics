sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ViewStateManager",
	"sap/ui/vk/DrawerToolbar",
	"sap/ui/vk/tools/MoveTool",
	"sap/ui/vk/tools/RotateTool",
	"sap/ui/vk/tools/ScaleTool",
	"sap/ui/vk/tools/AnchorPointTool",
	"sap/ui/vk/tools/CoordinateSystem",
	"sap/ui/vk/tools/SceneOrientationTool",
	"sap/ui/vk/tools/TooltipTool",
], function(
	Controller,
	ContentResource,
	ContentConnector,
	ViewStateManager,
	DrawerToolbar,
	MoveTool,
	RotateTool,
	ScaleTool,
	AnchorPointTool,
	CoordinateSystem,
	SceneOrientationTool,
	TooltipTool
) {
	"use strict";

	var CoordinateSystems = [ CoordinateSystem.World, CoordinateSystem.Local, CoordinateSystem.Screen, CoordinateSystem.Custom ];

	return Controller.extend("viewportTools.controller.App", {
		onInit: function() {
			var view = this.getView();
			var viewport = this.viewport = view.byId("viewport");

			var tools = this.tools = [ new MoveTool(), new RotateTool(), new ScaleTool(), new AnchorPointTool() ];

			var onCoordinateSystemChanged = function(event) {
				var coordinateSystem = event.getParameter("coordinateSystem");
				var index = CoordinateSystems.indexOf(coordinateSystem);
				this.getView().byId("coordinateSystem").setSelectedIndex(index);
				for (var i = 0; i < 3; i++) {
					tools[i].setCoordinateSystem(coordinateSystem);
				}
			}.bind(this);

			tools.forEach(function(tool, index) {
				viewport.addTool(tool);
				if (index < 3) {
					tool.attachCoordinateSystemChanged(onCoordinateSystemChanged);
				}
			});

			viewport.addContent(new DrawerToolbar({
				expanded: true,
				viewport: viewport
			}));

			var sceneOrientationTool = new SceneOrientationTool({
				enablePredefinedViews: false,
				enableInitialView: true
			})
			viewport.addTool(sceneOrientationTool);

			var tooltipTool = this.tooltipTool = new TooltipTool();
			viewport.addTool(tooltipTool);
			tooltipTool.attachHover(function(event) {
				var nodeRef = event.getParameters().nodeRef;
				tooltipTool.setTitle(nodeRef ? (nodeRef.name || ("<" + nodeRef.type + ">")) : null);
			});

			var jsonObjectLoader = function(parentNode, contentResource) {
				return new Promise(function(resolve, reject) {
					var loader = new THREE.ObjectLoader();
					loader.load(
						contentResource.getSource(), // resource URL
						// pass the loaded data to the onLoad function.
						// Here it is assumed to be an object
						function(obj) { // add the loaded object to the scene
							parentNode.add(obj);
							resolve({
								node: parentNode,
								contentResource: contentResource
							});
						},

						// Function called when download progresses
						function(xhr) { },

						// Function called when download errors
						function(xhr) {
							reject(new Error("Not object json"));
						});
				});
			};

			ContentConnector.addContentManagerResolver({
				pattern: "THREE.JSON",
				dimension: 3,
				contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
				settings: {
					loader: jsonObjectLoader
				}
			});

			var contentConnector = new ContentConnector({
				contentChangesFinished: function(event) {
					if (event.getParameter("content") !== null) {
						tools[ 0 ].setActive(true, viewport); // activate move tool
						sceneOrientationTool.setActive(true, viewport); // activate scene orientation tool
					}
				}.bind(this)
			});

			// Manages the visibility and the selection states of nodes in the scene.
			var viewStateManager = new ViewStateManager({
				contentConnector: contentConnector
			});

			// Set content connector and viewStateManager for viewport
			viewport.setContentConnector(contentConnector);
			viewport.setViewStateManager(viewStateManager);

			// Set scene tree content connector and viewStateManager
			var sceneTree = view.byId("scenetree");
			sceneTree.setContentConnector(contentConnector);
			sceneTree.setViewStateManager(viewStateManager);

			// Add resource to load to content connector
			contentConnector.addContentResource(new ContentResource({
				source: "models/model.three.json",
				sourceType: "THREE.JSON",
				name: "3D Objects"
			}));
		},

		onToolSelect: function(event) {
			var viewport = this.viewport;
			var selectedIndex = event.getParameter("selectedIndex");
			this.tools.forEach(function(tool, index) {
				tool.setActive(index === selectedIndex, viewport);
			});

			// disable the coordinate system group if the anchor point tool is selected
			this.getView().byId("coordinateSystem").setEnabled(selectedIndex !== 3);
		},

		onSteppingSelect: function(event) {
			var selected = event.getParameter("selected");
			this.tools.forEach(function(tool) {
				tool.setEnableStepping(selected);
			});
		},

		onEditingUISelect: function(event) {
			var selected = event.getParameter("selected");
			var tools = this.viewport.getTools();
			for (var i = 0; i < tools.length; i++) {
				var tool = sap.ui.getCore().byId(tools[ i ]);
				if (tool.setShowEditingUI) {
					tool.setShowEditingUI(selected);
				}
			}
		},

		onCoordinateSystemSelect: function(event) {
			var coordinateSystem = CoordinateSystems[ event.getParameter("selectedIndex") ];
			for (var i = 0; i < 3; i++) {
				this.tools[ i ].setCoordinateSystem(coordinateSystem);
			};
		},

		onTooltipSelect: function(event) {
			this.tooltipTool.setActive(event.getParameter("selected"), this.viewport);
		}
	});
});