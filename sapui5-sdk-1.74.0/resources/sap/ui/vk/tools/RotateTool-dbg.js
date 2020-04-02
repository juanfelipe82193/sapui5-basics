/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides control sap.ui.vk.tools.RotateTool
sap.ui.define([
	"./Tool",
	"./RotatableAxis",
	"./CoordinateSystem",
	"./RotateToolHandler",
	"./RotateToolGizmo",
	"./Detector",
	"./ToolNodeSet"
], function(
	Tool,
	RotatableAxis,
	CoordinateSystem,
	RotateToolHandler,
	RotateToolGizmo,
	Detector,
	ToolNodeSet
) {
	"use strict";

	/**
	 * Constructor for a new RotateTool.
	 *
	 * @class
	 * Tool to rotate 3D objects in space

	 * @param {string} [sId] ID of the new tool instance. <code>sId</code>is generated automatically if no non-empty ID is given.
	 *                       Note: this can be omitted, regardless of whether <code>mSettings</code> will be provided or not.
	 * @param {object} [mSettings] An optional map/JSON object with initial property values, aggregated objects etc. for the new tool instance.
	 * @public
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.vk.tools.Tool
	 * @alias sap.ui.vk.tools.RotateTool
	 */
	var RotateTool = Tool.extend("sap.ui.vk.tools.RotateTool", /** @lends sap.ui.vk.tools.RotateTool.prototype */ {
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
				 * Controls which axis are rotatable around. Can be All, X, Y, or Z
				 */
				axis: {
					type: "sap.ui.vk.tools.RotatableAxis",
					defaultValue: RotatableAxis.All
				},
				/**
				 * If set to <code>true</code> values will change in round number increments instead of continual change
				 */
				enableStepping: {
					type: "boolean",
					defaultValue: false
				},
				/**
				 * Determines if snapping when rotating is enabled
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
				 * This event will be fired when rotation occurs.
				 */
				rotating: {
					parameters: {
						x: "float",
						y: "float",
						z: "float"
					}
				},
				/**
				 * This event will be fired when rotation finished.
				 */
				rotated: {
					parameters: {
						x: "float",
						y: "float",
						z: "float"
					}
				},
				axisChanged: {
					parameters: {
						axis: "sap.ui.vk.tools.RotatableAxis"
					}
				},
				/**
				 * This event will be fired when the coordinate system changes.
				 */
				coordinateSystemChanged: {
					parameters: {
						coordinateSystem: "sap.ui.vk.tools.CoordinateSystem"
					}
				}
			}
		},

		constructor: function(sId, mSettings) {
			Tool.apply(this, arguments);

			// Configure dependencies
			this._viewport = null;
			this._handler = new RotateToolHandler(this);
			this._gizmo = null;
			this._detector = new Detector();
		}
	});

	RotateTool.prototype.init = function() {
		if (Tool.prototype.init) {
			Tool.prototype.init.call(this);
		}

		// set footprint for tool
		this.setFootprint([ "sap.ui.vk.threejs.Viewport" ]);

		this.setAggregation("gizmo", new RotateToolGizmo());
	};

	// Override the active property setter so that we execute activation / deactivation code at the same time
	RotateTool.prototype.setActive = function(value, activeViewport, gizmoContainer) {
		Tool.prototype.setActive.call(this, value, activeViewport, gizmoContainer);

		if (this._viewport) {
			if (value) {
				this._gizmo = this.getGizmo();
				this._gizmo.setAxis(this.getAxis());
				this._gizmo.setCoordinateSystem(this.getCoordinateSystem());
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
	 * @returns {sap.ui.vk.tools.RotateTool} <code>this</code> to allow method chaining.
	 * @public
	 */
	RotateTool.prototype.queueCommand = function(command) {
		if (this._addLocoHandler()) {
			if (this.isViewportType("sap.ui.vk.threejs.Viewport")) {
				command();
			}
		}
		return this;
	};

	RotateTool.prototype.setAxis = function(value) {
		var currentValue = this.getAxis();
		if (currentValue !== value) {
			this.setProperty("axis", value, true);
			this.getGizmo().setAxis(value);
			if (this._viewport) {
				this._viewport.setShouldRenderFrame();
			}
			this.fireAxisChanged({ axis: value });
		}
		return this;
	};

	RotateTool.prototype.setCoordinateSystem = function(value) {
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

	RotateTool.prototype.setShowEditingUI = function(value) {
		this.setProperty("showEditingUI", value, true);
		if (this._viewport) {
			this._viewport.setShouldRenderFrame();
		}
		return this;
	};

	RotateTool.prototype.setEnableSnapping = function(value) {
		this.setProperty("enableSnapping", value, true);
		if (this._viewport) {
			this._viewport.setShouldRenderFrame();
		}
		return this;
	};

	RotateTool.prototype.getDetector = function() {
		return this._detector;
	};

	RotateTool.prototype.setNodeSet = function(value) {
		this.setProperty("nodeSet", value, true);
		if (this._gizmo) {
			this._gizmo.handleSelectionChanged();
		}
	};

	/**
	 * Performs rotation of selected objects.
	 *
	 * @param {float} [x] Euler rotation x axis angle in degrees.
	 * @param {float} [y] Euler rotation y axis angle in degrees.
	 * @param {float} [z] Euler rotation z axis angle in degrees.
	 * @returns {sap.ui.vk.tools.RotateTool} <code>this</code> to allow method chaining.
	 * @public
	 */
	RotateTool.prototype.rotate = function(x, y, z) {
		if (this._gizmo) {
			this._gizmo.rotate(x, y, z);
		}
		if (this._viewport) {
			this._viewport.setShouldRenderFrame();
		}
		return this;
	};

	return RotateTool;
});
