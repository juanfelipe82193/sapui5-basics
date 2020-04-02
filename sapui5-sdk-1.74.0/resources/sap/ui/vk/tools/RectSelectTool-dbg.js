/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides class sap.ui.vk.tools.HitTestTool control.
sap.ui.define([
	"./Tool",
	"./RectSelectToolHandler",
	"../SelectionDisplayMode",
	"../Loco"
], function(
	Tool,
	RectSelectToolHandler,
	SelectionDisplayMode,
	Loco
) {
	"use strict";

	/**
	 * Constructor for a new RectSelectTool tool.
	 *
	 * @class
	 * This tool provides rectangular selection
	 * @param {string} [sId] ID of the new tool instance. <code>sId</code>is generated automatically if no non-empty ID is given.
	 *                       Note: this can be omitted, regardless of whether <code>mSettings</code> will be provided or not.
	 * @param {object} [mSettings] An optional map/JSON object with initial property values, aggregated objects etc. for the new tool instance.
	 * @public
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.vk.tools.Tool
	 * @alias sap.ui.vk.tools.RectSelectTool
	 */
	var RectSelectTool = Tool.extend("sap.ui.vk.tools.RectSelectTool", /** @lends sap.ui.vk.tools.RectSelectTool.prototype */ {
		metadata: {
			properties: {
				/**
				 * If set to true then this tool will remove selected nodes from the selection set.
				 * Default is to always add them to the selection
				 */
				subtractMode: {
					type: "boolean",
					defaultValue: false
				}
			}
		},

		constructor: function(sId, mSettings) {
			// Treat tool instantiation as singleton
			if (RectSelectTool._instance) {
				return RectSelectTool._instance;
			}

			// extend the properties of the base class
			Tool.apply(this, arguments);

			// Configure dependencies
			this._viewport = null;
			this._handler = new RectSelectToolHandler(this);
			this._loco = null;

			RectSelectTool._instance = this;
		}
	});

	RectSelectTool.prototype.init = function() {
		if (Tool.prototype.init) {
			Tool.prototype.init.call(this);
		}

		// set footprint for tool
		this.setFootprint([ "sap.ui.vk.dvl.Viewport", "sap.ui.vk.threejs.Viewport" ]);
	};

	/*
	* Override the active property setter so that we execute activation / deactivation code at the same time
	*/
	RectSelectTool.prototype.setActive = function(value, activeViewport, gizmoContainer) {
		Tool.prototype.setActive.call(this, value, activeViewport, gizmoContainer);

		if (this._viewport) {
			if (value) {
				// Prepare the tool to execute
				if (this._prepare()) {
					this._handler.activate(this._viewport);
				}
			} else {
				// Remove tool hander from loco stack for viewport so that the tool no longer handles input from user
				this._handler.deactivate();
			}
		}

		return this;
	};

	/*
	* Checks that the execution criteria for this tool are met before execution of tool commands
	*/
	RectSelectTool.prototype._prepare = function() {
		if (this.isViewportType("sap.ui.vk.dvl.Viewport") && this._viewport._dvl) {
				return true;
		} else if (this.isViewportType("sap.ui.vk.threejs.Viewport") && this._viewport._scene && this._viewport._scene.getSceneRef()) {
				return true;
		} else {
			return false;
		}
	};

	/* Queues a command for execution during the rendering cycle. All gesture operations should be called using this method.
	 *
	 * @param {function} command The command to be executed.
	 * @returns {sap.ui.vk.tools.RectSelectTool} this
	 * @public
	 */
	RectSelectTool.prototype.queueCommand = function(command) {
		if (this._prepare()) {
			if (this.isViewportType("sap.ui.vk.threejs.Viewport")) {
				command();
			}
		}
		return this;
	};

	function cropProjection(matProj, cropRect, viewportSize) {
		var m = matProj.elements;
		// calculate projection rectangle from projection matrix
		var isOrthographic = m[ 15 ] === 1;
		var rightMinusLeft = 2 / m[ 0 ];
		var topMinusBottom = 2 / m[ 5 ];
		var rightPlusLeft, topPlusBottom;
		if (isOrthographic) {
			rightPlusLeft = -m[ 12 ] * rightMinusLeft;
			topPlusBottom = -m[ 13 ] * topMinusBottom;
		} else {
			rightPlusLeft = m[ 8 ] * rightMinusLeft;
			topPlusBottom = m[ 9 ] * topMinusBottom;
		}

		var right = (rightMinusLeft + rightPlusLeft) * 0.5;
		var left = rightPlusLeft - right;
		var top = (topMinusBottom + topPlusBottom) * 0.5;
		var bottom = topPlusBottom - top;

		// crop projection rectangle
		var cropLeft = THREE.Math.lerp(left, right, Math.min(cropRect.x1, cropRect.x2) / viewportSize.width);
		var cropRight = THREE.Math.lerp(left, right, Math.max(cropRect.x1, cropRect.x2) / viewportSize.width);
		var cropTop = THREE.Math.lerp(top, bottom, Math.min(cropRect.y1, cropRect.y2) / viewportSize.height);
		var cropBottom = THREE.Math.lerp(top, bottom, Math.max(cropRect.y1, cropRect.y2) / viewportSize.height);

		// update projection matrix
		m[ 0 ] = 2 / (cropRight - cropLeft);
		m[ 5 ] = 2 / (cropTop - cropBottom);
		if (isOrthographic) {
			m[ 12 ] = -(cropRight + cropLeft) / (cropRight - cropLeft);
			m[ 13 ] = -(cropTop + cropBottom) / (cropTop - cropBottom);
		} else {
			m[ 8 ] = (cropRight + cropLeft) / (cropRight - cropLeft);
			m[ 9 ] = (cropTop + cropBottom) / (cropTop - cropBottom);
		}
	}

	/**
	* Find all objects fully contained inside of specified rectangle
	*
	* @param {int} x1 x coordinate of top-left/bottom-right corner of selection rectangle.
	* @param {int} y1 y coordinate of top-left/bottom-right corner of selection rectangle.
	* @param {int} x2 x coordinate of bottom-right/top-left corner of selection rectangle.
	* @param {int} y2 y coordinate of bottom-right/top-left corner of selection rectangle.
	* @param {sap.ui.vk.Scene} scene Scene object used in current viewport.
	* @param {sap.ui.vk.Camera} camera Current viewport's camera.
	* @returns {any[]} The array of node references that are selected.
	* @public
	*/
	RectSelectTool.prototype.select = function(x1, y1, x2, y2, scene, camera) {
		if (!this._prepare()) {
			return [];
		}

		return this._select(x1, y1, x2, y2, this._viewport, scene, camera);
	};

	RectSelectTool.prototype._select = function(x1, y1, x2, y2, viewport, scene, camera) {
		var nodes = [];

		if (viewport.getMetadata().getName() === "sap.ui.vk.dvl.Viewport") {
			nodes = viewport.rectSelect(x1, y1, x2, y2);
			if (nodes.length > 0) {
				var parametersdvl = {
					picked: nodes
				};
				viewport.fireNodesPicked(parametersdvl);
				if (viewport.getSelectionDisplayMode() === SelectionDisplayMode.Outline) {
					if (this.getSubtractMode()) {
						viewport._viewStateManager.setOutliningStates([], nodes);
					} else {
						viewport._viewStateManager.setOutliningStates(nodes, []);
					}
				} else if (this.getSubtractMode()) {
						viewport._viewStateManager.setSelectionStates([], nodes);
				} else {
						viewport._viewStateManager.setSelectionStates(nodes, []);
				}
			}
			return nodes;
		}

		var sceneRef = scene ? scene.getSceneRef() : undefined;
		var cameraRef = camera ? camera.getCameraRef() : undefined;
		var vsm = viewport._getViewStateManagerThreeJS();
		if (!cameraRef || !sceneRef || !vsm || x1 === x2 || y1 === y2) {
			return nodes;
		}

		var rect = { x1: x1, y1: y1, x2: x2, y2: y2 };

		var layers = viewport._getLayers();
		var matProj = cameraRef.projectionMatrix.clone();
		cropProjection(matProj, rect, viewport._renderer.getSize());
		var matViewProj = new THREE.Matrix4().multiplyMatrices(matProj, cameraRef.matrixWorldInverse);
		var frustum = new THREE.Frustum().setFromMatrix(matViewProj);
		var v1 = new THREE.Vector3();

		function checkNodeGeometry(node) {
			var geometry = node.geometry;
			if (geometry !== undefined && frustum.intersectsObject(node)) {
				var i, l = 0;
				if (geometry.isGeometry) {
					var vertices = geometry.vertices;
					for (i = 0, l = vertices.length; i < l; i++) {
						v1.copy(vertices[ i ]).applyMatrix4(node.matrixWorld);
						if (!frustum.containsPoint(v1)) {
							break;
						}
					}
				} else if (geometry.isBufferGeometry) {
					var attribute = geometry.attributes.position;
					if (attribute !== undefined) {
						for (i = 0, l = attribute.count; i < l; i++) {
							v1.fromBufferAttribute(attribute, i).applyMatrix4(node.matrixWorld);
							if (!frustum.containsPoint(v1)) {
								break;
							}
						}
					}
				}
				return l > 0 && i === l;
			}
			return false;
		}

		function traverseVisibleNode(node) {
			if (!node.layers.test(layers)) {
				return;
			}

			var totalGeomCount = 0,
				passedGeomCount = 0;
			if (node.geometry !== undefined) {
				totalGeomCount++;
				if (checkNodeGeometry(node)) {
					passedGeomCount++;
				}
			}

			var children = node.children;
			if (children.length > 0) {
				for (var i = 0; i < children.length; i++) {
					var child = children[i];
					if (child.geometry !== undefined && !child.name && child.children.length === 0) {// consider as a node geometry
						if (child.layers.test(layers)) {
							totalGeomCount++;
							if (checkNodeGeometry(child)) {
								passedGeomCount++;
							}
						}
					} else {
						traverseVisibleNode(child);
					}
				}
			}

			if (passedGeomCount > 0 && totalGeomCount === passedGeomCount) {
				nodes.push(node);
			}
		}

		traverseVisibleNode(sceneRef);

		if (nodes.length > 0) {
			var parameters = {
				picked: nodes
			};
			viewport.fireNodesPicked(parameters);

			if (viewport.getSelectionDisplayMode() === SelectionDisplayMode.Outline) {
				if (this.getSubtractMode()) {
					vsm.setOutliningStates([], nodes);
				} else {
					vsm.setOutliningStates(nodes, []);
				}
			} else if (this.getSubtractMode()) {
					vsm.setSelectionStates([], nodes);
			} else {
					vsm.setSelectionStates(nodes, []);
			}
		}

		return nodes;
	};

	return RectSelectTool;
});
