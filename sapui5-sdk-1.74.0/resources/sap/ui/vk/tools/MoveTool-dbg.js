/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.MoveTool
sap.ui.define([
	"./Tool",
	"./CoordinateSystem",
	"./GizmoPlacementMode",
	"./MoveToolHandler",
	"./MoveToolGizmo",
	"./Detector",
	"./ToolNodeSet"
], function(
	Tool,
	CoordinateSystem,
	GizmoPlacementMode,
	MoveToolHandler,
	MoveToolGizmo,
	Detector,
	ToolNodeSet
) {
	"use strict";

	/**
	 * Constructor for a new MoveTool.
	 *
	 * @class
	 * Tool used to move objects in 3D space

	 * @param {string} [sId] ID of the new tool instance. <code>sId</code>is generated automatically if no non-empty ID is given.
	 *                       Note: this can be omitted, regardless of whether <code>mSettings</code> will be provided or not.
	 * @param {object} [mSettings] An optional map/JSON object with initial property values, aggregated objects etc. for the new tool instance.
	 * @public
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.vk.tools.Tool
	 * @alias sap.ui.vk.tools.MoveTool
	 */
	var MoveTool = Tool.extend("sap.ui.vk.tools.MoveTool", /** @lends sap.ui.vk.tools.MoveTool.prototype */ {
		metadata: {
			properties: {
				/**
				 * Select coordinate system in which this tool operates. Can be Local, World, Screen or Custom
				 */
				coordinateSystem: {
					type: "sap.ui.vk.tools.CoordinateSystem",
					defaultValue: CoordinateSystem.World
				},
				/**
				 * Sets the placement mode. Can be Default, ObjectCenter, or OnScreen
				 */
				placementMode: {
					type: "sap.ui.vk.tools.GizmoPlacementMode",
					defaultValue: GizmoPlacementMode.Default
				},
				/**
				 * If set to <code>true</code> values will change in round number increments instead of continual change
				 */
				enableStepping: {
					type: "boolean",
					defaultValue: false
				},
				/**
				 * Determines if snapping when moving is enabled
				 */
				enableSnapping: {
					type: "boolean",
					defaultValue: false
				},
				/**
				 * Display text box with current value, which can also be used to directly modify the value
				 */
				showEditingUI: {
					type: "boolean",
					defaultValue: false
				},
				/**
				 * Whether or not to allow context menu on right-click
				 */
				allowContextMenu: {
					type: "boolean",
					defaultValue: true
				},
				/**
				 * Determine what set of nodes will be transformed with this tool
				 */
				nodeSet: {
					type: "sap.ui.vk.tools.ToolNodeSet",
					defaultValue: ToolNodeSet.Highlight
				}
			},
			events: {
				/**
				 * This event will be fired when movement occurs.
				 */
				moving: {
					parameters: {
						x: "float",
						y: "float",
						z: "float"
					}
				},
				/**
				 * This event will be fired when movement finished.
				 */
				moved: {
					parameters: {
						x: "float",
						y: "float",
						z: "float"
					}
				},
				/**
				 * This event will be fired when the coordinate system changes.
				 */
				coordinateSystemChanged: {
					parameters: {
						coordinateSystem: "sap.ui.vk.tools.CoordinateSystem"
					}
				},
				// gizmo placement mode changed event
				placementModeChanged: {
					parameters: {
						placementMode: "sap.ui.vk.tools.GizmoPlacementMode"
					}
				}
			}
		},

		constructor: function(sId, mSettings) {
			Tool.apply(this, arguments);

			// Configure dependencies
			this._viewport = null;
			this._handler = new MoveToolHandler(this);
			this._gizmo = null;
			this._detector = new Detector();
		}
	});

	MoveTool.prototype.init = function() {
		if (Tool.prototype.init) {
			Tool.prototype.init.call(this);
		}

		// set footprint for tool
		this.setFootprint([ "sap.ui.vk.threejs.Viewport" ]);

		this.setAggregation("gizmo", new MoveToolGizmo());
	};

	// Override the active property setter so that we execute activation / deactivation code at the same time
	MoveTool.prototype.setActive = function(value, activeViewport, gizmoContainer) {
		Tool.prototype.setActive.call(this, value, activeViewport, gizmoContainer);

		if (this._viewport) {
			if (value) {
				this._gizmo = this.getGizmo();
				this._gizmo.setCoordinateSystem(this.getCoordinateSystem());
				this._gizmo.setPlacementMode(this.getPlacementMode());
				this._gizmo.show(this._viewport, this);

				this._addLocoHandler();
			} else {
				this._removeLocoHandler();

				if (this._gizmo) {
					this._gizmo.hide();
					this._gizmo = null;
				}
			}
		}

		return this;
	};

	/** MOVE TO BASE
	 * Queues a command for execution during the rendering cycle. All gesture operations should be called using this method.
	 *
	 * @param {function} command The command to be executed.
	 * @returns {sap.ui.vk.tools.MoveTool} <code>this</code> to allow method chaining.
	 * @public
	 */
	MoveTool.prototype.queueCommand = function(command) {
		if (this._addLocoHandler()) {
			if (this.isViewportType("sap.ui.vk.threejs.Viewport")) {
				command();
			}
		}
		return this;
	};

	MoveTool.prototype.setPlacementMode = function(value) {
		var currentValue = this.getPlacementMode();
		if (currentValue !== value) {
			this.setProperty("placementMode", value, true);
			this.getGizmo().setPlacementMode(value);
			if (this._viewport) {
				this._viewport.setShouldRenderFrame();
			}
			this.firePlacementModeChanged({ placementMode: value });
		}
		return this;
	};

	MoveTool.prototype.setCoordinateSystem = function(value) {
		var currentValue = this.getCoordinateSystem();
		if (currentValue !== value) {
			this.setProperty("coordinateSystem", value, true);
			this.getGizmo().setCoordinateSystem(value);
			if (this._viewport) {
				this._viewport.setShouldRenderFrame();
			}
			this.fireCoordinateSystemChanged({ coordinateSystem: value });
		}
		return this;
	};

	MoveTool.prototype.setShowEditingUI = function(value) {
		this.setProperty("showEditingUI", value, true);
		if (this._viewport) {
			this._viewport.setShouldRenderFrame();
		}
		return this;
	};

	MoveTool.prototype.setEnableSnapping = function(value) {
		this.setProperty("enableSnapping", value, true);
		if (this._viewport) {
			this._viewport.setShouldRenderFrame();
		}
		return this;
	};

	MoveTool.prototype.setNodeSet = function(value) {
		this.setProperty("nodeSet", value, true);
		if (this._gizmo) {
			this._gizmo.handleSelectionChanged();
		}
	};

	MoveTool.prototype.getDetector = function() {
		return this._detector;
	};

	/**
	 * Performs movement of selected objects.
	 *
	 * @param {float} [x] Movement offset of x component in currently selected coordinate system.
	 * @param {float} [y] Movement offset of y component in currently selected coordinate system.
	 * @param {float} [z] Movement offset of z component in currently selected coordinate system.
	 * @returns {sap.ui.vk.tools.MoveTool} <code>this</code> to allow method chaining.
	 * @public
	 */
	MoveTool.prototype.move = function(x, y, z) {
		if (this._gizmo) {
			this._gizmo.move(x, y, z);
		}
		if (this._viewport) {
			this._viewport.setShouldRenderFrame();
		}
		return this;
	};

	return MoveTool;
});
