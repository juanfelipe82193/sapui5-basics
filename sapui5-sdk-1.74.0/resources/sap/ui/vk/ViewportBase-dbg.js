/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.ViewportBase.
sap.ui.define([
	"sap/ui/core/Control",
	"./tools/Tool",
	"./library",
	"./SelectionMode",
	"./SelectionDisplayMode",
	"./RenderMode"
], function(
	Control,
	Tool,
	vkLibrary,
	SelectionMode,
	SelectionDisplayMode,
	RenderMode
) {
	"use strict";

	/**
	 * Constructor for a new Viewport.
	 *
	 * @class
	 * Provides a rendering canvas for the 3D elements of a loaded scene.
	 *
	 * @param {string} [sId] ID for the new Viewport control. Generated automatically if no ID is given.
	 * @param {object} [mSettings] Initial settings for the new Viewport control.
	 * @public
	 * @abstract
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.core.Control
	 * @alias sap.ui.vk.ViewportBase
	 * @since 1.50.0
	 */
	var ViewportBase = Control.extend("sap.ui.vk.ViewportBase", /** @lends sap.ui.vk.ViewportBase.prototype */ {
		metadata: {
			library: "sap.ui.vk",

			"abstract": true,

			properties: {
				/**
				 * Shows or hides the debug info.
				 */
				showDebugInfo: {
					type: "boolean",
					defaultValue: false
				},

				/**
				 * Viewport background top color in the CSS Color format
				 */
				backgroundColorTop: {
					type: "sap.ui.core.CSSColor",
					defaultValue: "rgba(50, 50, 50, 1)" // dark grey
				},

				/**
				 * Viewport background bottom color in the CSS Color format
				 */
				backgroundColorBottom: {
					type: "sap.ui.core.CSSColor",
					defaultValue: "rgba(255, 255, 255, 1)" // white
				},

				/**
				 * Viewport width
				 */
				width: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},

				/**
				 * Viewport height
				 */
				height: {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},

				/**
				 * Selection mode
				 */
				selectionMode: {
					type: "sap.ui.vk.SelectionMode",
					defaultValue: SelectionMode.Sticky
				},

				/**
				 * Selection display mode
				 */
				selectionDisplayMode: {
					type: "sap.ui.vk.SelectionDisplayMode",
					defaultValue: SelectionDisplayMode.Highlight
				},

				/**
				 * Freeze camera
				 */
				freezeCamera: {
					type: "boolean",
					defaultValue: false
				},

				/**
				 * Viewport render mode
				 */
				renderMode: {
					type: "sap.ui.vk.RenderMode",
					defaultValue: RenderMode.Default
				}
			},

			associations: {
				/**
				 * An association to the <code>ContentConnector</code> instance that manages content resources.
				 */
				contentConnector: {
					type: "sap.ui.vk.ContentConnector",
					multiple: false
				},

				/**
				 * An association to the <code>ViewStateManager</code> instance.
				 */
				viewStateManager: {
					type: "sap.ui.vk.ViewStateManager",
					multiple: false
				},
				/**
				 * The tools of this viewport.
				 */
				tools: {
					type: "sap.ui.vk.tools.Tool",
					multiple: true
				}
			},

			aggregations: {
				/**
				 * The controls inside the viewport.
				 */
				content: {
					type: "sap.ui.core.Control",
					multiple: true
				}
			},

			events: {
				/**
				 * This event is fired when a URL in a note is clicked.
				 */
				urlClicked: {
					parameters: {
						/**
						 * Returns a node reference of the note that contains the URL.
						 */
						nodeRef: "any",
						/**
						 * Returns a URL that was clicked.
						 */
						url: "string"
					},
					enableEventBubbling: true
				},
				/**
				 * This event will be fired when a node is clicked.
				 */
				nodeClicked: {
					parameters: {
						/**
						 * Returns a node reference.
						 */
						nodeRef: "any",
						x: "int",
						y: "int"
					},
					enableEventBubbling: true
				},
				/**
				 * This event is fired when viewport size is changed.
				 */
				resize: {
					parameters: {
						/**
						 * Returns the width and height of new size { width: number, height: number } in CSS pixels.
						 */
						size: "object"
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when nodes in the scene are picked by user action.
				 * If application requires different selection behaviour then it can handle this event and implement its own selection method.
				 * In this case {@link sap.ui.vk.Viewport#selectionMode selectionMode} property should be set to <code>sap.ui.vk.SelectionMode.None</code>
				 * Application can modify list of picked node references to alter selection behaviour.
				 */
				nodesPicked: {
					parameters: {
						/**
						 * References of the nodes that are picked.
						 */
						picked: {
							type: "any[]"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when a node in the scene is zoomed in/out by double-clicking.
				 */
				nodeZoomed: {
					parameters: {
						/**
						 * Reference of the node that is zoomed.
						 */
						zoomed: {
							type: "any"
						},
						/**
						 * True for zoom in, and false for zoom out.
						 */
						isZoomIn: {
							type: "boolean"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when a view in the viewport is activated
				 */
				viewActivated: {
					parameters: {
						/**
						 * Index of the activated view
						 */
						viewIndex: "int",

						/**
						 * The activated view
						 */
						view: "sap.ui.vk.View",

						/**
						 * The type of content loaded into the Viewport (for example: 2D, 3D).
						 */
						type: {
							type: "string"
						}
					},
					enableEventBubbling: true
				},

				/**
				 * This event is fired when the current procedure is done playing
				 * @private
				 */
				procedureFinished: {
					enableEventBubbling: true
				},

				/**
				 * This event is fired when the current view is done playing
				 * @private
				 */
				viewFinished: {
					parameters: {
						viewIndex: "int"
					},
					enableEventBubbling: true
				}
			}
		}
	});

	var basePrototype = ViewportBase.getMetadata().getParent().getClass().prototype;

	ViewportBase.prototype.init = function() {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}

		this._camera = null;
	};

	ViewportBase.prototype.exit = function() {

		if (this._camera) {
			if (this._contentConnector) {
				var contentManager = this._contentConnector.getContentManager();
				if (contentManager) {
					contentManager.destroyCamera(this._camera);
				}
				this._camera = null;
			}
		}

		if (basePrototype.exit) {
			basePrototype.exit.call(this);
		}
	};

	ViewportBase.prototype.addTool = function(tool) {
		this.addAssociation("tools", tool);

		tool = tool instanceof Tool ? tool : sap.ui.getCore().byId(tool);
		tool.setViewport(this);
	};

	/**
	 * Returns viewport content as an image of desired size.
	 *
	 * @param {int} width Requested image width in pixels (allowed values 8 to 2048)
	 * @param {int} height Requested image height in pixels (allowed values 8 to 2048)
	 * @returns {string} Base64 encoded PNG image
	 */
	ViewportBase.prototype.getImage = function(width, height) {
		return null;
	};

	/**
	 * Helper method to provide "sticky" selection method. If this method is used then nodes are
	 * added into selection if they were not selected before, otherwise they are removed from selection.
	 * If this is called with empty nodes list then all already selected nodes are deselected.
	 *
	 * @param {any[]} nodes Array of node references
	 * @protected
	 */
	ViewportBase.prototype.stickySelectionHandler = function(nodes) {
		if (this._viewStateManager == null) {
			return;
		}

		if (nodes.length === 0) {
			// Clear selection.
			var currentlySelected = [];
			if (this.getSelectionDisplayMode() === SelectionDisplayMode.Outline) {
				this._viewStateManager.enumerateOutlinedNodes(function(selectedNode) {
					currentlySelected.push(selectedNode);
				});
				if (currentlySelected.length > 0) {
					this._viewStateManager.setOutliningStates([], currentlySelected);
				}
			} else {
				this._viewStateManager.enumerateSelection(function(selectedNode) {
					currentlySelected.push(selectedNode);
				});
				if (currentlySelected.length > 0) {
					this._viewStateManager.setSelectionStates([], currentlySelected);
				}
			}
		} else {
			var select = [];
			var deselect = [];
			var isSelected, ni;
			if (this.getSelectionDisplayMode() === SelectionDisplayMode.Outline) {
				isSelected = this._viewStateManager.getOutliningState(nodes);
				for (ni = 0; ni < isSelected.length; ni++) {
					if (isSelected[ni]) {
						deselect.push(nodes[ni]);
					} else {
						select.push(nodes[ni]);
					}
				}
				this._viewStateManager.setOutliningStates(select, deselect);
			} else {
				isSelected = this._viewStateManager.getSelectionState(nodes);
				for (ni = 0; ni < isSelected.length; ni++) {
					if (isSelected[ni]) {
						deselect.push(nodes[ni]);
					} else {
						select.push(nodes[ni]);
					}
				}
				this._viewStateManager.setSelectionStates(select, deselect);
			}
		}
	};

	/**
	 * Helper method used to provide exclusive selection method. If this method is used then nodes are
	 * marked as selected while all previously selected objects are deselected.
	 * If this is called with empty nodes list then all already selected nodes are deselected.
	 *
	 * @param {any[]} nodes Array of node references
	 * @protected
	 */
	ViewportBase.prototype.exclusiveSelectionHandler = function(nodes) {
		if (this._viewStateManager == null) {
			return;
		}

		var notInCurrentSelection = true;
		if (nodes.length === 1) {
			notInCurrentSelection = !this._viewStateManager.getSelectionState(nodes[0]);
		} else if (nodes.length > 1) {
			var isSelected;
			if (this.getSelectionDisplayMode() === SelectionDisplayMode.Outline) {
				isSelected = this._viewStateManager.getOutliningState(nodes);
			} else {
				isSelected = this._viewStateManager.getSelectionState(nodes);
			}
			for (var ni = 0; ni < isSelected.length; ni++) {
				if (isSelected[ ni ]) {
					notInCurrentSelection = false;
					break;
				}
			}
		}

		var unselected = [];
		if (nodes.length === 0 || notInCurrentSelection) {
			// Clear selection.
			if (this.getSelectionDisplayMode() === SelectionDisplayMode.Outline) {
				this._viewStateManager.enumerateOutlinedNodes(function(selectedNode) {
					unselected.push(selectedNode);
				});
			} else {
				this._viewStateManager.enumerateSelection(function(selectedNode) {
					unselected.push(selectedNode);
				});
			}

		}
		if (this.getSelectionDisplayMode() === SelectionDisplayMode.Outline) {
			this._viewStateManager.setOutliningStates(nodes, unselected);
		} else {
			this._viewStateManager.setSelectionStates(nodes, unselected);
		}
	};

	/**
	 * Sets current camera to the viewport
	 *
	 * @param {sap.ui.vk.Camera} camera
	 * If the <code>camera</code> parameter is not <code>null</code>, the camera is replaced.
	 * If the <code>camera</code> parameter is <code>null</code>, the current camera is destroyed.
	 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
	 * @public
	 * @since 1.52.0
	 */
	ViewportBase.prototype.setCamera = function(camera) {

		if (camera !== this._camera) {
			if (this._camera && this._contentConnector) {
				var contentManager = this._contentConnector.getContentManager();
				if (contentManager) {
					contentManager.destroyCamera(this._camera);
				}
			}
		}
		this._camera = camera;
		return this;
	};

	/**
	 * Gets current camera to the viewport
	 *
	 * @returns {sap.ui.vk.Camera} Current camera in this viewport.
	 * @public
	 */
	ViewportBase.prototype.getCamera = function() {
		return this._camera;
	};

	ViewportBase.prototype._onBeforeClearContentConnector = function() {
		this.setCamera(null);
	};

	/**
	 * Calls activateView with view definition
	 *
	 * @param {sap.ui.vk.View} view view object definition
	 * @param {boolean} playViewGroup true if view activation is part of playing view group
	 * @param {boolean} notAnimateCameraChange true if not animating the change of camera
	 * @returns {sap.ui.vk.ViewportBase} return this
	 * @public
	 */
	ViewportBase.prototype.activateView = function(view, playViewGroup, notAnimateCameraChange) {
		return this;
	};


	/**
	 * Performs a <code>pan</code> gesture to pan across the Viewport.
	 *
	 * @param {int} dx The change in distance along the x-coordinate.
	 * @param {int} dy The change in distance along the y-coordinate.
	 * @returns {sap.ui.vk.ViewportBase} return this
	 * @public
	 */
	ViewportBase.prototype.pan = function(dx, dy) {
		return this;
	};

	/**
	 * Rotates the content resource displayed on the Viewport.
	 *
	 * @param {int} dx The change in x-coordinate used to define the desired rotation.
	 * @param {int} dy The change in y-coordinate used to define the desired rotation.
	 * @returns {sap.ui.vk.ViewportBase} return this
	 * @public
	 */
	ViewportBase.prototype.rotate = function(dx, dy) {
		return this;
	};

	/**
	 * Performs a <code>zoom</code> gesture to zoom in or out on the beginGesture coordinate.
	 * @param {double} dy Zoom factor. A scale factor that specifies how much to zoom in or out by.
	 * @returns {sap.ui.vk.ViewportBase} return this
	 * @public
	 */
	ViewportBase.prototype.zoom = function(dy) {
		return this;
	};

	return ViewportBase;
});
