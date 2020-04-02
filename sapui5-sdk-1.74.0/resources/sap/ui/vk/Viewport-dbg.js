/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.Viewport.
sap.ui.define([
	"jquery.sap.global",
	"sap/base/util/ObjectPath",
	"./ViewportBase",
	"./ContentConnector",
	"./ViewStateManager",
	"./ViewportRenderer",
	"./VisibilityMode",
	"./RenderMode",
	"./Scene",
	"./Camera"
], function(
	jQuery,
	ObjectPath,
	ViewportBase,
	ContentConnector,
	ViewStateManager,
	ViewportRenderer,
	VisibilityMode,
	RenderMode,
	Scene,
	Camera
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
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.vk.ViewportBase
	 * @alias sap.ui.vk.Viewport
	 * @since 1.50.0
	 */
	var Viewport = ViewportBase.extend("sap.ui.vk.Viewport", /** @lends sap.ui.vk.Viewport.prototype */ {
		metadata: {
			library: "sap.ui.vk",
			designtime: "sap/ui/vk/designtime/Viewport.designtime"
		}
	});

	var basePrototype = Viewport.getMetadata().getParent().getClass().prototype;

	Viewport.prototype.init = function() {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}

		this._implementation = null;
	};

	Viewport.prototype.exit = function() {
		this._destroyImplementation();

		if (basePrototype.exit) {
			basePrototype.exit.call(this);
		}
	};

	Viewport.prototype.getImplementation = function() {
		return this._implementation;
	};

	Viewport.prototype._destroyImplementation = function() {
		if (this._implementation) {
			this._implementation.destroy();
			this._implementation = null;
		}
		return this;
	};

	////////////////////////////////////////////////////////////////////////
	// Propagate public properties to implementation

	Viewport.prototype.getShowDebugInfo = function() {
		if (this._implementation) {
			return this._implementation.getShowDebugInfo();
		}
		return basePrototype.getShowDebugInfo.call(this);
	};

	Viewport.prototype.setShowDebugInfo = function(value) {
		basePrototype.setShowDebugInfo.call(this, value);
		if (this._implementation) {
			this._implementation.setShowDebugInfo(value);
		}
		return this;
	};

	Viewport.prototype.getBackgroundColorTop = function() {
		if (this._implementation) {
			return this._implementation.getBackgroundColorTop();
		}
		return basePrototype.getBackgroundColorTop.call(this);
	};

	Viewport.prototype.setBackgroundColorTop = function(value) {
		basePrototype.setBackgroundColorTop.call(this, value);
		if (this._implementation) {
			this._implementation.setBackgroundColorTop(value);
		}
		return this;
	};

	Viewport.prototype.getBackgroundColorBottom = function() {
		if (this._implementation) {
			return this._implementation.getBackgroundColorBottom();
		}
		return basePrototype.getBackgroundColorBottom.call(this);
	};

	Viewport.prototype.setBackgroundColorBottom = function(value) {
		basePrototype.setBackgroundColorBottom.call(this, value);
		if (this._implementation) {
			this._implementation.setBackgroundColorBottom(value);
		}
		return this;
	};

	Viewport.prototype.setWidth = function(value) {
		basePrototype.setWidth.call(this, value);
		if (this._implementation) {
			this._implementation.setWidth(value);
		}
		return this;
	};

	Viewport.prototype.setHeight = function(value) {
		basePrototype.setHeight.call(this, value);
		if (this._implementation) {
			this._implementation.setHeight(value);
		}
		return this;
	};

	Viewport.prototype.setSelectionMode = function(value) {
		basePrototype.setSelectionMode.call(this, value);
		if (this._implementation) {
			this._implementation.setSelectionMode(value);
		}
		return this;
	};

	Viewport.prototype.getSelectionMode = function() {
		if (this._implementation) {
			return this._implementation.getSelectionMode();
		}
		return basePrototype.getSelectionMode.call(this);
	};

	Viewport.prototype.setSelectionDisplayMode = function(value) {
		basePrototype.setSelectionDisplayMode.call(this, value);
		if (this._implementation) {
			this._implementation.setSelectionDisplayMode(value);
		}
		return this;
	};

	Viewport.prototype.getSelectionDisplayMode = function() {
		if (this._implementation) {
			return this._implementation.getSelectionDisplayMode();
		}
		return basePrototype.getSelectionDisplayMode.call(this);
	};

	Viewport.prototype.setCamera = function(value) {
		basePrototype.setCamera.call(this, value);
		if (this._implementation) {
			this._implementation.setCamera(value);
			return this;
		}

		return this;
	};

	Viewport.prototype.getCamera = function() {
		if (this._implementation) {
			return this._implementation.getCamera();
		}
		return basePrototype.getCamera.call(this);
	};

	Viewport.prototype.setShouldRenderFrame = function() {
		if (this._implementation) {
			this._implementation.setShouldRenderFrame();
		}
		return this;
	};

	Viewport.prototype.shouldRenderFrame = function() {
		if (this._implementation) {
			this._implementation.shouldRenderFrame();
		}
	};

	Viewport.prototype.setRenderMode = function(value) {
		if (this._implementation && this._implementation.setRenderMode) {
			this._implementation.setRenderMode(value);
		}
		return this;
	};

	Viewport.prototype.getRenderMode = function() {
		if (this._implementation && this._implementation.getRenderMode) {
			return this._implementation.getRenderMode();
		}
		return RenderMode.Default;
	};

	Viewport.prototype.setFreezeCamera = function(value) {
		basePrototype.setFreezeCamera.call(this, value);

		if (this._implementation) {
			this._implementation.setFreezeCamera(value);
		}
		return this;
	};

	/**
	 * @param {any|any[]} nodeRefs The node reference or the array of node references that we want to tint.
	 * @param {boolean} show Whether to highlight the nodes or remove the highlight.
	 * @param {int|sap.ui.vk.CSSColor} color The color to use for highlighting the nodes passed as argument.
	 * @return {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
	 * @public
	 */
	 Viewport.prototype.showHotspots = function(nodeRefs, show, color){
		if (this._implementation && this._implementation.showHotspots){
			this._implementation.showHotspots(nodeRefs, show, color);
		}
		return this;
	};

	/////////////////////////////////////////////////////////////////////
	// Forward tool association methods to the implementation object

	Viewport.prototype.addTool = function(tool) {
		this.addAssociation("tools", tool);

		if (this._implementation) {
			this._implementation.addTool(tool);
		}
	};

	Viewport.prototype.removeTool = function(tool) {
		this.removeAssociation("tools", tool);

		if (this._implementation) {
			this._implementation.removeTool(tool);
		}
	};

	Viewport.prototype.getTools = function() {
		if (this._implementation) {
			return this._implementation.getTools();
		}

		return this.getAssociation("tools", []);
	};

	Viewport.prototype.removeAllTools = function() {
		this.removeAllAssociation("tools");

		if (this._implementation) {
			this._implementation.removeAllTools();
		}
	};

	/////////////////////////////////////////////////////////////////////
	// Forward content aggregation methods to the implementation object

	Viewport.prototype.addContent = function(content) {
		if (this._implementation) {
			this._implementation.addContent(content);
		} else {
			this.addAggregation("content", content);
		}
	};

	Viewport.prototype.removeContent = function(content) {
		if (this._implementation) {
			this._implementation.removeContent(content);
		} else {
			this.removeAggregation("content", content);
		}
	};

	Viewport.prototype.getContent = function() {
		if (this._implementation) {
			return this._implementation.getContent();
		}
		return this.getAggregation("content");
	};

	Viewport.prototype.removeAllContent = function() {
		if (this._implementation) {
			this._implementation.removeAllContent();
		} else {
			this.removeAggregation("content");
		}
	};

	/////////////////////////////////////////////////////////////////////
	// Forward method calls to the implementation object

	Viewport.prototype.startAnimation = function(playbacks) {
		if (this._implementation && this._implementation.startAnimation) {
			this._implementation.startAnimation(playbacks);
		}
	};

	Viewport.prototype.stopAnimation = function() {
		if (this._implementation && this._implementation.stopAnimation) {
			this._implementation.stopAnimation();
		}
	};

	Viewport.prototype.playProcedure = function(modelViews, viewIndex, notPlayingAnimations) {
		if (this._implementation && this._implementation.playProcedure) {
			this._implementation.playProcedure(modelViews, viewIndex, notPlayingAnimations);
		}
	};

	/**
	* Get current view -  remembered when activateView function is called
	*
	* @returns {sap.ui.vk.View} current view
	* @public
	*/
	Viewport.prototype.getCurrentView = function() {
		if (this._implementation && this._implementation.getCurrentView) {
			return this._implementation.getCurrentView();
		}
		return null;
	};


	Viewport.prototype.pan = function(dx, dy) {
		if (this._implementation && this._implementation.pan) {
			this._implementation.pan(dx, dy);
		}
	};

	Viewport.prototype.rotate = function(dx, dy){
		if (this._implementation && this._implementation.rotate) {
			this._implementation.rotate(dx, dy);
		}
	};

	Viewport.prototype.zoom = function(dy) {
		if (this._implementation && this._implementation.zoom) {
			this._implementation.zoom(dy);
		}
	};

	/**
	 * Pause animation
	 *
	 * @returns {void}
	 * @private
	 */
	Viewport.prototype.pauseAnimation = function() {
		if (this._implementation && this._implementation.pauseAnimation) {
			return this._implementation.pauseAnimation();
		}
	};

	/**
	 * Resume animation playing
	 *
	 * @returns {void}
	 * @private
	 */
	Viewport.prototype.resumeAnimation = function() {
		if (this._implementation && this._implementation.resumeAnimation) {
			return this._implementation.resumeAnimation();
		}
	};

	/**
	 * Hanle the event for dragging animation to a progress value
	 *
	 * @param {object} event contains a property "value" between 0 and 100
	 *
	 * @private
	 */
	Viewport.prototype.handleDragAnimation = function(event) {
		if (this._implementation && this._implementation.handleDragAnimation) {
			this._implementation.handleDragAnimation(event);
		}
	};

	/**
	 * Handle the event for completing draging animation to a progress value
	 *
	 * @param {object} event contains a property "value" between 0 and 100
	 *
	 * @private
	 */
	Viewport.prototype.handleCompleteDraggingAnimation = function(event) {
		if (this._implementation && this._implementation.handleCompleteDraggingAnimation) {
			this._implementation.handleCompleteDraggingAnimation(event);
		}
	};

	/**
	 * Add Handlers to events fired by animation sequences
	 *
	 * @param {sap.ui.vk.AnimationSequence} animationSequence animation sequence
	 *
	 * @private
	 */
	Viewport.prototype.AddHandlersToAnimationSequenceEvents = function(animationSequence) {
		if (this._implementation && this._implementation.AddHandlersToAnimationSequenceEvents) {
			this._implementation.AddHandlersToAnimationSequenceEvents(animationSequence);
		}
	};

	////////////////////////////////////////////////////////////////////////
	// Content connector handling begins.

	Viewport.prototype._setContent = function(content) {
		var scene = null;
		var camera = null;

		if (content) {
			scene = content;
			if (!(scene instanceof Scene)) {
				scene = null;
			}
			camera = content.camera;
			if (!(camera instanceof Camera)) {
				camera = null;
			}
		}

		this._setScene(scene);

		if (camera) { // camera is optional so only set it if exist
			this.setCamera(camera);
		}
	};

	Viewport.prototype._onAfterUpdateContentConnector = function() {
		this._setContent(this._contentConnector.getContent());
	};

	Viewport.prototype._onBeforeClearContentConnector = function() {

		if (basePrototype._onBeforeClearContentConnector) {
			basePrototype._onBeforeClearContentConnector.call(this);
		}

		this._setScene(null);
	};

	Viewport.prototype._handleContentReplaced = function(event) {
		var content = event.getParameter("newContent");
		this._setContent(content);
	};

	Viewport.prototype._setScene = function(scene) {
		if (scene instanceof Scene) {
			var sceneType = scene.getMetadata().getName(),
			    implementationType = this._implementation && this._implementation.getMetadata().getName(),
			    reuseImplemenation = sceneType === "sap.ui.vk.dvl.Scene" && implementationType === "sap.ui.vk.dvl.Viewport" ||
									 sceneType === "sap.ui.vk.threejs.Scene" && implementationType === "sap.ui.vk.threejs.Viewport";

			if (!reuseImplemenation) {
				this._destroyImplementation();
				var newImplementationType;
				var camera = this.getCamera();

				if (sceneType === "sap.ui.vk.dvl.Scene") {
					newImplementationType = "sap.ui.vk.dvl.Viewport";
				} else if (sceneType === "sap.ui.vk.threejs.Scene") {
					newImplementationType = "sap.ui.vk.threejs.Viewport";
				}

				if (newImplementationType) {
					// The Viewport implementation classes from `dvl` and `threejs` namespaces are loaded by
					// the corresponding content managers, so there is no need to load them here. We can safely
					// assume that thery are available at this point.
					var Class = ObjectPath.get(newImplementationType);
					this._implementation = new Class({
						viewStateManager: this.getViewStateManager(),
						tools: this.getAssociation("tools"),
						content: this.getContent(),
						showDebugInfo: this.getShowDebugInfo(),
						width: this.getWidth(),
						height: this.getHeight(),
						backgroundColorTop: this.getBackgroundColorTop(),
						backgroundColorBottom: this.getBackgroundColorBottom(),
						selectionMode: this.getSelectionMode(),
						freezeCamera: this.getFreezeCamera(),
						contentConnector: this.getContentConnector() // content connector must be the last parameter in the list!
					});

					// pass the camera, if we have one
					if (camera) {
						this._camera = null; // proxy no longer owns the camera
						this._implementation.setCamera(camera); // forward the camera to implementation
					}

					this._implementation.setParent(this);
				}

				this.invalidate();
			}
		} else {
			this._destroyImplementation();
			this.invalidate();
		}
		return this;
	};

	// Content connector handling ends.
	////////////////////////////////////////////////////////////////////////

	Viewport.prototype._onAfterUpdateViewStateManager = function() {
		if (this._implementation) {
			this._implementation.setViewStateManager(this._viewStateManager);
		}
	};

	Viewport.prototype._onBeforeClearViewStateManager = function() {
		if (this._implementation) {
			this._implementation.setViewStateManager(null);
		}
	};

	/**
	 * Calls activateView with view definition
	 *
	 * @param {sap.ui.vk.View} view object definition
	 * @param {boolean} playViewGroup true if view activation is part of playing view group
	 * @param {boolean} notAnimateCameraChange true if not animating the change of camera
	 * @returns {sap.ui.vk.Viewport} returns this
	 * @public
	 */
	Viewport.prototype.activateView = function(view, playViewGroup, notAnimateCameraChange) {
		if (this._implementation) {
			this._implementation.activateView(view, playViewGroup, notAnimateCameraChange);
			return this;
		} else {
			jQuery.sap.log.error("no implementation");
			return this;
		}
	};

	/**
	* Reset current view to its inital status
	*
	* @returns {sap.ui.vk.Viewport} returns this
	* @private
	* @since 1.67.0
	*/
	Viewport.prototype.resetCurrentView = function() {
		if (this._implementation && this._implementation.resetCurrentView) {
			this._implementation.resetCurrentView();
			return this;
		} else {
			jQuery.sap.log.error("no implementation");
			return this;
		}
	};


	/**
	 * Zooms the scene to a bounding box created from a particular set of nodes.
	 *
	 * @param {sap.ui.vk.ZoomTo|sap.ui.vk.ZoomTo[]} what What set of nodes to zoom to.
	 * @param {any} nodeRef Is only used if what == sap.ui.vk.ZoomTo.Node.
	 * @param {float} crossFadeSeconds Time to perform the "fly to" animation. Set to 0 to do this immediately.
	 * @param {float} margin Margin. Set to 0 to zoom to the entire screen.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.zoomTo = function(what, nodeRef, crossFadeSeconds, margin) {
		if (this._implementation) {
			this._implementation.zoomTo(what, nodeRef, crossFadeSeconds, margin);
		} else {
			jQuery.sap.log.error("zoomTo: no implementation");
		}
		return this;
	};

	/**
	 * Executes a click or tap gesture.
	 *
	 * @param {int} x The tap gesture's x-coordinate.
	 * @param {int} y The tap gesture's y-coordinate.
	 * @param {boolean} isDoubleClick Indicates whether the tap gesture should be interpreted as a double-click. A value of <code>true</code> indicates a double-click gesture, and <code>false</code> indicates a single click gesture.
	 * @returns {sap.ui.vk.Viewport} this
	 * @public
	 */
	Viewport.prototype.tap = function(x, y, isDoubleClick) {
		if (this._implementation) {
			this._implementation.tap(x, y, isDoubleClick);
		}
		return this;
	};

	var setDefaultQueryCamera = function(effectiveQuery) {
		effectiveQuery.camera = {};
	};

	var setDefaultQueryCameraMatrices = function(effectiveQuery) {
		if (typeof effectiveQuery.camera === "object" && effectiveQuery.camera !== null) {
			effectiveQuery.camera.matrices = false;
		}
	};

	var setDefaultQueryCameraUseTransitionCamera = function(effectiveQuery) {
		if (typeof effectiveQuery.camera === "object" && effectiveQuery.camera !== null) {
			effectiveQuery.camera.useTransitionCamera = false;
		}
	};

	var setDefaultQueryAnimation = function(effectiveQuery) {
		effectiveQuery.animation = true;
	};

	var setDefaultQueryVisibility = function(effectiveQuery) {
		effectiveQuery.visibility = false;
	};

	var setDefaultQueryVisibilityMode = function(effectiveQuery) {
		if (typeof effectiveQuery.visibility === "object" && effectiveQuery.visibility !== null) {
			effectiveQuery.visibility.mode = VisibilityMode.Complete;
		}
	};

	/**
	 * Retrieves information about the current camera view in the scene, and saves the information in a JSON-like object.
	 * The information can then be used at a later time to restore the scene to the same camera view using the
	 * {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} method.<br/>
	 * @param {object}         [query]                       Query object which indicates what information to be retrieved.
	 * @param {boolean|object} [query.camera=true]           Indicator to retrieve camera information.
	 * @param {boolean}        [query.camera.matrices=false] Indicator to retrieve camera view and projection matrices.
	 * @param {boolean}        [query.camera.useTransitionCamera=false] Indicator to retrieve the transition camera properties instead of regular one's.
	 * @param {boolean}        [query.animation=true]        Indicator to retrieve animation information.
	 * @param {boolean|object} [query.visibility=false]      Indicator to retrieve visibility information.
	 * @param {sap.ui.vk.VisibilityMode} [query.visibility.mode=sap.ui.vk.VisibilityMode.Complete]
	 *                                                       Indicator to retrieve the complete visibility definition or just the difference.
	 * @returns {object} JSON-like object which holds the current view information. See {@link sap.ui.vk.Viewport#setViewInfo setViewInfo}.
	 *                   In addition to properties defined in {@link sap.ui.vk.Viewport#setViewInfo setViewInfo} the output from
	 *                   {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} contains camera view and projection matrices
	 * <pre>
	 *   {
	 *     ...
	 *     camera: {
	 *       ...
	 *       matrices: {
	 *         view:       [number, ...],
	 *         projection: [number, ...],
	 *       }
	 *       ...
	 *     },
	 *     ...
	 *   }
	 * </pre>
	 * @public
	 */
	Viewport.prototype.getViewInfo = function(query) {
		if (!this._implementation) {
			jQuery.sap.log.error("no implementation");
			return null;
		}

		var effectiveQuery = {};

		if (typeof query !== "object" || query === null) {
			setDefaultQueryCamera(effectiveQuery);
			setDefaultQueryCameraMatrices(effectiveQuery);
			setDefaultQueryCameraUseTransitionCamera(effectiveQuery);
			setDefaultQueryAnimation(effectiveQuery);
			setDefaultQueryVisibility(effectiveQuery);
			setDefaultQueryVisibilityMode(effectiveQuery);
		} else {
			if (typeof query.camera === "object" && query.camera !== null) {
				effectiveQuery.camera = {};
				if (typeof query.camera.matrices === "boolean") {
					effectiveQuery.camera.matrices = query.camera.matrices;
				} else if ("matrices" in query.camera) {
					// If camera.matrices is defined but not of type boolean, this is an error.
					effectiveQuery.camera.matrices = false;
				} else {
					// If camera.matrices is not defined, use default value.
					setDefaultQueryCameraMatrices(effectiveQuery);
				}
				if (typeof query.camera.useTransitionCamera === "boolean") {
					effectiveQuery.camera.useTransitionCamera = query.camera.useTransitionCamera;
				} else if ("useTransitionCamera" in query.camera) {
					// If camera.useTransitionCamera is defined but not of type boolean, this is an error.
					effectiveQuery.camera.useTransitionCamera = false;
				} else {
					// If camera.useTransitionCamera is not defined, use default value.
					setDefaultQueryCameraUseTransitionCamera(effectiveQuery);
				}
			} else if (typeof query.camera === "boolean") {
				if (query.camera === true) {
					effectiveQuery.camera = {};
					setDefaultQueryCameraMatrices(effectiveQuery);
					setDefaultQueryCameraUseTransitionCamera(effectiveQuery);
				} else {
					effectiveQuery.camera = false;
				}
			} else if ("camera" in query) {
				// If camera is defined but is not of type object or boolean, this is an error.
				effectiveQuery.camera = false;
			} else {
				// If camera is not defined at all, use default values.
				setDefaultQueryCamera(effectiveQuery);
				setDefaultQueryCameraMatrices(effectiveQuery);
				setDefaultQueryCameraUseTransitionCamera(effectiveQuery);
			}

			if (typeof query.animation === "boolean") {
				effectiveQuery.animation = query.animation;
			} else if ("animation" in query) {
				// If animation is defiend but is not of type boolean, this is an error.
				effectiveQuery.animation = false;
			} else {
				// If animation is not defined, use default value.
				setDefaultQueryAnimation(effectiveQuery);
			}

			if (typeof query.visibility === "object" && query.visibility !== null) {
				effectiveQuery.visibility = {};
				if (query.visibility.mode === VisibilityMode.Complete || query.visibility.mode === VisibilityMode.Differences) {
					effectiveQuery.visibility.mode = query.visibility.mode;
				} else {
					// If visibility.mode is not defined or does not equal "complete" or "differences", use default value.
					// This condition is different from camera.matrices because the mode property must have a valid string value.
					setDefaultQueryVisibilityMode(effectiveQuery);
				}
			} else if (typeof query.visibility === "boolean") {
				if (query.visibility === true) {
					effectiveQuery.visibility = {};
					setDefaultQueryVisibilityMode(effectiveQuery);
				} else {
					effectiveQuery.visibility = false;
				}
			} else if ("visibility" in query) {
				// If visibility is defined but is not of type object or boolean, this is an error.
				effectiveQuery.visibility = false;
			} else {
				// If visibility is not defined, use default values.
				setDefaultQueryVisibility(effectiveQuery);
				setDefaultQueryVisibilityMode(effectiveQuery);
			}
		}

		return this._implementation.getViewInfo(effectiveQuery);
	};

	/**
	 * Sets the current scene to use the camera view information acquired from the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
	 * Internally, the <code>setViewInfo</code> method activates certain steps at certain animation times,
	 * and then changes the camera position, rotation and field of view (FOV) / zoom factor.
	 * @param {object}   viewInfo                             A JSON-like object containing view information acquired using
	 *                                                        the {@link sap.ui.vk.Viewport#getViewInfo getViewInfo} method.<br/>
	 * @param {object}   [viewInfo.camera]                    A JSON-like object containing the camera information.
	 * @param {object}   viewInfo.camera.rotation             Rotation defined in {@link https://en.wikipedia.org/wiki/Aircraft_principal_axes Aircraft principal axes}.
	 * @param {float}    viewInfo.camera.rotation.yaw         Angle around the vertical axis in degrees.
	 * @param {float}    viewInfo.camera.rotation.pitch       Angle around the lateral axis in degrees.
	 * @param {float}    viewInfo.camera.rotation.roll        Angle around the longitudinal axis in degrees.
	 * @param {object}   viewInfo.camera.position             Position defined in 3-dimensional space.
	 * @param {float}    viewInfo.camera.position.x           X coordinate.
	 * @param {float}    viewInfo.camera.position.y           Y coordinate.
	 * @param {float}    viewInfo.camera.position.z           Z coordinate.
	 * @param {sap.ui.vk.CameraFOVBindingType} viewInfo.camera.bindingType Camera field of view binding type.
	 * @param {sap.ui.vk.CameraProjectionType} viewInfo.camera.projectionType Camera projection type.
	 * @param {float}    viewInfo.camera.fieldOfView          Camera field of view in degrees. Applicable only to perspective cameras.
	 * @param {float}    viewInfo.camera.zoomFactor           Camera zoom factor. Applicable only to orthographic cameras.
	 * @param {object}   [viewInfo.animation]                 A JSON-like object containing the animation information.
	 * @param {string}   [viewInfo.animation.stepVeId]        Step VE ID. If it is omitted then procedure and step indices are used.
	 * @param {int}      [viewInfo.animation.procedureIndex]  Procedure index in the list of procedures.
	 * @param {int}      [viewInfo.animation.stepIndex]       Step index in the list of steps in the procedure.
	 * @param {float}    [viewInfo.animation.animationTime=0] Time at which to activate the step.
	 * @param {object}   [viewInfo.visibility]                A JSON-like object containing the visibility information.
	 * @param {sap.ui.vk.VisibilityMode} viewInfo.visibility.mode If the mode equals to {@link sap.ui.vk.VisibilityMode.Complete complete}
	 *                                                        then the visible and hidden fields are defined. If the mode
	 *                                                        equals {@link sap.ui.vk.VisibilityMode.Differences differences} then
	 *                                                        the changes field is defined.
	 * @param {string[]} viewInfo.visibility.visible          List of Ids of visible nodes.
	 * @param {string[]} viewInfo.visibility.hidden           List of Ids of hidden nodes.
	 * @param {string[]} viewInfo.visibility.changes          List of Ids of nodes with inverted visibility.
	 * @param {float}    [flyToDuration=0]                    Fly-to animation duration in seconds.
	 * @returns {sap.ui.vk.Viewport} <code>this</code> to allow method chaining.
	 * @public
	 */
	Viewport.prototype.setViewInfo = function(viewInfo, flyToDuration) {
		if (this._implementation) {
			this._implementation.setViewInfo(viewInfo, flyToDuration);
		} else {
			jQuery.sap.log.error("no implementation");
		}

		return this;
	};

	/**
	* Update node information in current view with the current node transformation
	* @param {object} nodeRef node reference
	* @param {float} opacity optional, opacity for the node
	*
	* @private
	* @since 1.67.0
	*/
	Viewport.prototype.updateNodeInfoInCurrentView = function(nodeRef, opacity) {
		if (this._implementation && this._implementation.updateNodeInfoInCurrentView) {
			this._implementation.updateNodeInfoInCurrentView(nodeRef, opacity);
		} else {
			jQuery.sap.log.error("no implementation");
		}
	};

	/**
	 * Returns viewport content as an image of desired size.
	 *
	 * @param {int} width Requested image width in pixels (allowed values 8 to 2048)
	 * @param {int} height Requested image height in pixels (allowed values 8 to 2048)
	 * @param {string} topColor The sap.ui.core.CSSColor to be used for top background color
	 * @param {string} bottomColor The sap.ui.core.CSSColor to be used for bottom background color
	 * @param {boolean} includeSelection Include selected nodes
	 * @returns {string} Base64 encoded PNG image
	 * @public
	 */
	Viewport.prototype.getImage = function(width, height, topColor, bottomColor, includeSelection) {
		if (this._implementation && this._implementation.getImage) {
			return this._implementation.getImage(width, height, topColor, bottomColor, includeSelection);
		}

		return null;
	};

	ContentConnector.injectMethodsIntoClass(Viewport);
	ViewStateManager.injectMethodsIntoClass(Viewport);

	return Viewport;
});
